import { env } from "node:process";

const BASE = env.API_BASE ?? "http://localhost:80/api";
const SESSION: string[] = [];

type Result = { name: string; ok: boolean; status?: number; error?: string };
const results: Result[] = [];

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    results.push({ name, ok: true });
    console.log(`  ✓  ${name}`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    results.push({ name, ok: false, error: msg });
    console.error(`  ✗  ${name}: ${msg}`);
  }
}

async function api(method: string, path: string, body?: unknown, expectStatus = 200) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(SESSION.length ? { Cookie: SESSION[0] } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const setCookie = res.headers.get("set-cookie");
  if (setCookie) SESSION[0] = setCookie.split(";")[0];

  if (res.status !== expectStatus) {
    const text = await res.text().catch(() => "");
    throw new Error(`Expected ${expectStatus}, got ${res.status}: ${text}`);
  }
  const ct = res.headers.get("content-type") ?? "";
  return ct.includes("json") ? res.json() : res.text();
}

let createdBlogId: number | undefined;
let createdProductId: number | undefined;
const testEmail = `test+${Date.now()}@example.com`;

console.log(`\n90StorZon API Tests — ${BASE}\n`);

await test("GET /healthz", async () => {
  const data = await api("GET", "/healthz");
  if (!data.status) throw new Error("No status field");
});

await test("GET /blog/posts (list)", async () => {
  const data = await api("GET", "/blog/posts");
  if (!Array.isArray(data)) throw new Error("Expected array");
});

await test("GET /shop/products (list)", async () => {
  const data = await api("GET", "/shop/products");
  if (!Array.isArray(data)) throw new Error("Expected array");
});

await test("GET /analytics/summary", async () => {
  const data = await api("GET", "/analytics/summary");
  if (typeof data.totalPageViews !== "number") throw new Error("Missing totalPageViews");
});

await test("GET /analytics/daily", async () => {
  const data = await api("GET", "/analytics/daily");
  if (!Array.isArray(data)) throw new Error("Expected array");
});

await test("POST /analytics/track (pageview)", async () => {
  await api("POST", "/analytics/track", { page: "/test" }, 200);
});

await test("GET /sitemap.xml", async () => {
  const res = await fetch(`${BASE.replace("/api", "")}/api/sitemap.xml`);
  if (res.status !== 200) throw new Error(`Got ${res.status}`);
  const text = await res.text();
  if (!text.includes("<urlset")) throw new Error("Invalid sitemap XML");
});

await test("GET /robots.txt", async () => {
  const res = await fetch(`${BASE.replace("/api", "")}/robots.txt`);
  if (res.status !== 200) throw new Error(`Got ${res.status}`);
  const text = await res.text();
  if (!text.includes("User-agent")) throw new Error("Invalid robots.txt");
});

await test("POST /auth/register", async () => {
  await api("POST", "/auth/register", { name: "Test User", email: testEmail, password: "password123" }, 201);
});

await test("POST /auth/login", async () => {
  await api("POST", "/auth/login", { email: testEmail, password: "password123" });
});

await test("GET /auth/me", async () => {
  const data = await api("GET", "/auth/me");
  if (!data.email) throw new Error("Missing email");
});

await test("POST /auth/logout", async () => {
  await api("POST", "/auth/logout", {});
});

await test("Admin login (admin@90storzon.com)", async () => {
  SESSION.length = 0;
  await api("POST", "/auth/login", { email: "admin@90storzon.com", password: "Admin1234!" });
});

await test("POST /blog/posts (create)", async () => {
  const data = await api("POST", "/blog/posts", {
    title: "Test Post",
    slug: `test-post-${Date.now()}`,
    excerpt: "A short excerpt.",
    content: "Full content of the test post.",
    category: "Testing",
    metaTitle: "Test Post | 90StorZon",
    metaDescription: "SEO description for test post.",
  }, 201);
  createdBlogId = data.id;
});

await test("PUT /blog/posts/by-id/:id (update)", async () => {
  if (!createdBlogId) throw new Error("No blog post created");
  await api("PUT", `/blog/posts/by-id/${createdBlogId}`, { title: "Test Post (Updated)", slug: `test-post-updated-${Date.now()}`, excerpt: "Updated excerpt.", content: "Updated content.", category: "Testing" });
});

await test("POST /shop/products (create)", async () => {
  const data = await api("POST", "/shop/products", {
    name: "Test Product",
    description: "A test product.",
    price: 9.99,
    category: "Tools",
    featured: false,
  }, 201);
  createdProductId = data.id;
});

await test("PUT /shop/products/:id (update)", async () => {
  if (!createdProductId) throw new Error("No product created");
  await api("PUT", `/shop/products/${createdProductId}`, { name: "Test Product (Updated)", description: "Updated.", price: 14.99, category: "Tools", featured: true });
});

await test("POST /shop/products/:id/click (affiliate tracking)", async () => {
  if (!createdProductId) throw new Error("No product created");
  await api("POST", `/shop/products/${createdProductId}/click`, {}, 200);
});

await test("GET /shop/affiliate-stats", async () => {
  const data = await api("GET", "/shop/affiliate-stats");
  if (!Array.isArray(data)) throw new Error("Expected array");
});

await test("GET /admin/stats", async () => {
  const data = await api("GET", "/admin/stats");
  if (typeof data.totalUsers !== "number") throw new Error("Missing totalUsers");
});

await test("GET /admin/users", async () => {
  const data = await api("GET", "/admin/users");
  if (!Array.isArray(data)) throw new Error("Expected array");
});

await test("DELETE /shop/products/:id (cleanup)", async () => {
  if (!createdProductId) throw new Error("No product created");
  await api("DELETE", `/shop/products/${createdProductId}`, undefined, 200);
});

await test("DELETE /blog/posts/by-id/:id (cleanup)", async () => {
  if (!createdBlogId) throw new Error("No blog post created");
  await api("DELETE", `/blog/posts/by-id/${createdBlogId}`, undefined, 200);
});

const passed = results.filter(r => r.ok).length;
const failed = results.filter(r => !r.ok).length;
const total = results.length;

console.log(`\n${"─".repeat(40)}`);
console.log(`Results: ${passed}/${total} passed${failed ? `, ${failed} failed` : ""}`);

if (failed > 0) process.exit(1);

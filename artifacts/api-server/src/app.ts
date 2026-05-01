import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { blogPostsTable, productsTable } from "@workspace/db";
import { db } from "@workspace/db";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/sitemap.xml", async (_req: Request, res: Response) => {
  try {
    const posts = await db.select({ slug: blogPostsTable.slug }).from(blogPostsTable);
    const products = await db.select({ id: productsTable.id }).from(productsTable);
    const baseUrl = "https://90storzon.com";

    const staticPaths = [
      "/", "/tools", "/blog", "/shop", "/about", "/contact",
      "/privacy-policy", "/terms",
      "/tools/age-calculator", "/tools/bmi-calculator", "/tools/loan-calculator",
      "/tools/percentage-calculator", "/tools/word-counter", "/tools/password-generator",
      "/tools/qr-code-generator", "/tools/unit-converter", "/tools/domain-authority-checker",
    ];

    const urls = [
      ...staticPaths.map(path => `  <url><loc>${baseUrl}${path}</loc><changefreq>weekly</changefreq><priority>${path === "/" ? "1.0" : "0.8"}</priority></url>`),
      ...posts.map(p => `  <url><loc>${baseUrl}/blog/${p.slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`),
      ...products.map(p => `  <url><loc>${baseUrl}/shop/${p.id}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch {
    res.status(500).send("Error generating sitemap");
  }
});

app.get("/api/robots.txt", (_req: Request, res: Response) => {
  res.header("Content-Type", "text/plain");
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard
Disallow: /api/

Sitemap: https://90storzon.com/api/sitemap.xml
`);
});

app.use("/api", router);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

export default app;

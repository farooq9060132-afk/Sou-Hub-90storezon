import { Router } from "express";
import { db, productsTable, affiliateClicksTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { z } from "zod";
import { sessionMiddleware, requireAdmin, type AuthRequest } from "../middlewares/session";

const router = Router();

const ProductBody = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  imageUrl: z.string().nullable().optional(),
  category: z.string().min(1),
  externalLink: z.string().nullable().optional(),
  featured: z.boolean().optional().default(false),
});

function serializeProduct(p: typeof productsTable.$inferSelect, clickCount?: number) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: parseFloat(p.price),
    imageUrl: p.imageUrl,
    category: p.category,
    externalLink: p.externalLink,
    featured: p.featured,
    clickCount: clickCount ?? 0,
  };
}

router.get("/shop/products", async (req, res) => {
  try {
    const products = await db.select().from(productsTable).orderBy(productsTable.id);
    res.json(products.map(p => serializeProduct(p)));
  } catch (err) {
    req.log.error({ err }, "List products error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/shop/products", sessionMiddleware as any, requireAdmin as any, async (req: AuthRequest, res) => {
  const parsed = ProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.errors });
    return;
  }
  try {
    const [product] = await db.insert(productsTable).values({
      ...parsed.data,
      price: String(parsed.data.price),
    }).returning();
    res.status(201).json(serializeProduct(product));
  } catch (err) {
    req.log.error({ err }, "Create product error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/shop/products/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid product ID" }); return; }
  try {
    const products = await db.select().from(productsTable).where(eq(productsTable.id, id)).limit(1);
    if (products.length === 0) { res.status(404).json({ error: "Product not found" }); return; }
    res.json(serializeProduct(products[0]));
  } catch (err) {
    req.log.error({ err }, "Get product error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/shop/products/:id", sessionMiddleware as any, requireAdmin as any, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid product ID" }); return; }
  const parsed = ProductBody.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.errors });
    return;
  }
  try {
    const updates: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.price !== undefined) updates.price = String(parsed.data.price);
    const [product] = await db.update(productsTable).set(updates).where(eq(productsTable.id, id)).returning();
    if (!product) { res.status(404).json({ error: "Product not found" }); return; }
    res.json(serializeProduct(product));
  } catch (err) {
    req.log.error({ err }, "Update product error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/shop/products/:id", sessionMiddleware as any, requireAdmin as any, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid product ID" }); return; }
  try {
    const deleted = await db.delete(productsTable).where(eq(productsTable.id, id)).returning();
    if (deleted.length === 0) { res.status(404).json({ error: "Product not found" }); return; }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    req.log.error({ err }, "Delete product error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/shop/products/:id/click", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid product ID" }); return; }
  try {
    const products = await db.select().from(productsTable).where(eq(productsTable.id, id)).limit(1);
    if (products.length === 0) { res.status(404).json({ error: "Product not found" }); return; }
    await db.insert(affiliateClicksTable).values({
      productId: id,
      productName: products[0].name,
      ipAddress: req.ip,
      referrer: req.headers.referer || null,
    });
    res.json({ message: "Click tracked" });
  } catch (err) {
    req.log.error({ err }, "Track affiliate click error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/shop/affiliate-stats", sessionMiddleware as any, requireAdmin as any, async (req: AuthRequest, res) => {
  try {
    const stats = await db
      .select({
        productId: affiliateClicksTable.productId,
        productName: affiliateClicksTable.productName,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(affiliateClicksTable)
      .groupBy(affiliateClicksTable.productId, affiliateClicksTable.productName)
      .orderBy(desc(sql`count(*)`));
    res.json(stats.map(s => ({ productId: s.productId, productName: s.productName, count: Number(s.count) })));
  } catch (err) {
    req.log.error({ err }, "Affiliate stats error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

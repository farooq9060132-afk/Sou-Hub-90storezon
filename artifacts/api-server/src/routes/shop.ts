import { Router } from "express";
import { db, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/shop/products", async (req, res) => {
  try {
    const products = await db.select().from(productsTable).orderBy(productsTable.id);
    res.json(products.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: parseFloat(p.price),
      imageUrl: p.imageUrl,
      category: p.category,
      externalLink: p.externalLink,
      featured: p.featured,
    })));
  } catch (err) {
    req.log.error({ err }, "List products error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/shop/products/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid product ID" });
    return;
  }

  try {
    const products = await db.select().from(productsTable).where(eq(productsTable.id, id)).limit(1);
    if (products.length === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    const p = products[0];
    res.json({
      id: p.id,
      name: p.name,
      description: p.description,
      price: parseFloat(p.price),
      imageUrl: p.imageUrl,
      category: p.category,
      externalLink: p.externalLink,
      featured: p.featured,
    });
  } catch (err) {
    req.log.error({ err }, "Get product error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

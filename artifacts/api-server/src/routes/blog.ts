import { Router } from "express";
import { db, blogPostsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateBlogPostBody } from "@workspace/api-zod";
import { z } from "zod";
import { sessionMiddleware, requireAdmin, type AuthRequest } from "../middlewares/session";

const router = Router();

const UpdateBlogPostBody = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  excerpt: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  imageUrl: z.string().nullable().optional(),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
});

function serializePost(p: typeof blogPostsTable.$inferSelect) {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    content: p.content,
    category: p.category,
    imageUrl: p.imageUrl,
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

router.get("/blog/posts", async (req, res) => {
  try {
    const posts = await db.select().from(blogPostsTable).orderBy(blogPostsTable.createdAt);
    res.json(posts.map(serializePost));
  } catch (err) {
    req.log.error({ err }, "List blog posts error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/blog/posts", sessionMiddleware as any, requireAdmin as any, async (req: AuthRequest, res) => {
  const parsed = CreateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.errors });
    return;
  }
  try {
    const [post] = await db.insert(blogPostsTable).values(parsed.data).returning();
    res.status(201).json(serializePost(post));
  } catch (err) {
    req.log.error({ err }, "Create blog post error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/blog/posts/by-id/:id", sessionMiddleware as any, requireAdmin as any, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  const parsed = UpdateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.errors });
    return;
  }
  try {
    const [post] = await db.update(blogPostsTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(blogPostsTable.id, id))
      .returning();
    if (!post) { res.status(404).json({ error: "Post not found" }); return; }
    res.json(serializePost(post));
  } catch (err) {
    req.log.error({ err }, "Update blog post error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/blog/posts/by-id/:id", sessionMiddleware as any, requireAdmin as any, async (req: AuthRequest, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    const deleted = await db.delete(blogPostsTable).where(eq(blogPostsTable.id, id)).returning();
    if (deleted.length === 0) { res.status(404).json({ error: "Post not found" }); return; }
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    req.log.error({ err }, "Delete blog post error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/blog/posts/:slug", async (req, res) => {
  try {
    const posts = await db.select().from(blogPostsTable).where(eq(blogPostsTable.slug, req.params.slug)).limit(1);
    if (posts.length === 0) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json(serializePost(posts[0]));
  } catch (err) {
    req.log.error({ err }, "Get blog post error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

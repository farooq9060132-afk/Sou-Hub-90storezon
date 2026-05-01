import { Router } from "express";
import { db, blogPostsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateBlogPostBody } from "@workspace/api-zod";

const router = Router();

router.get("/blog/posts", async (req, res) => {
  try {
    const posts = await db.select().from(blogPostsTable).orderBy(blogPostsTable.createdAt);
    res.json(posts.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      category: p.category,
      imageUrl: p.imageUrl,
      createdAt: p.createdAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "List blog posts error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/blog/posts", async (req, res) => {
  const parsed = CreateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  try {
    const [post] = await db.insert(blogPostsTable).values(parsed.data).returning();
    res.status(201).json({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Create blog post error");
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
    const post = posts[0];
    res.json({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      imageUrl: post.imageUrl,
      createdAt: post.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Get blog post error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

import { Router } from "express";
import { db, usersTable, pageViewsTable, toolUsageTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { sessionMiddleware, requireAdmin, type AuthRequest } from "../middlewares/session";

const router = Router();

router.use(sessionMiddleware as any);

router.get("/admin/users", requireAdmin as any, async (req: AuthRequest, res) => {
  try {
    const users = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
    res.json(users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      isAdmin: u.isAdmin,
      createdAt: u.createdAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "List users error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/users/:id", requireAdmin as any, async (req: AuthRequest, res) => {
  const id = parseInt(req.params["id"] as string, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  try {
    const deleted = await db.delete(usersTable).where(eq(usersTable.id, id)).returning();
    if (deleted.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    req.log.error({ err }, "Delete user error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/stats", requireAdmin as any, async (req: AuthRequest, res) => {
  try {
    const userCountResult = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(usersTable);
    const totalUsers = Number(userCountResult[0].count);

    const pageViewCountResult = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(pageViewsTable);
    const totalPageViews = Number(pageViewCountResult[0].count);

    const toolUsageCountResult = await db.select({ count: sql<number>`cast(count(*) as int)` }).from(toolUsageTable);
    const totalToolUsage = Number(toolUsageCountResult[0].count);

    const recentUsers = await db
      .select()
      .from(usersTable)
      .orderBy(desc(usersTable.createdAt))
      .limit(5);

    const toolStats = await db
      .select({
        tool: toolUsageTable.tool,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(toolUsageTable)
      .groupBy(toolUsageTable.tool)
      .orderBy(desc(sql`count(*)`))
      .limit(10);

    res.json({
      totalUsers,
      totalPageViews,
      totalToolUsage,
      recentUsers: recentUsers.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        isAdmin: u.isAdmin,
        createdAt: u.createdAt.toISOString(),
      })),
      toolStats: toolStats.map(s => ({ tool: s.tool, count: Number(s.count) })),
    });
  } catch (err) {
    req.log.error({ err }, "Admin stats error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

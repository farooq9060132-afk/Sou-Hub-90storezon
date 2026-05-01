import { Router } from "express";
import { db, pageViewsTable, toolUsageTable } from "@workspace/db";
import { sql, desc } from "drizzle-orm";
import { TrackPageViewBody, TrackToolUsageBody } from "@workspace/api-zod";

const router = Router();

function getDeviceType(ua: string): string {
  if (/mobile/i.test(ua)) return "mobile";
  if (/tablet|ipad/i.test(ua)) return "tablet";
  return "desktop";
}

function categorizeReferrer(referrer: string | undefined): string | null {
  if (!referrer) return null;
  if (/google\./i.test(referrer)) return "Google";
  if (/facebook\.com|fb\.com/i.test(referrer)) return "Facebook";
  if (/instagram\.com/i.test(referrer)) return "Instagram";
  if (/twitter\.com|x\.com/i.test(referrer)) return "Twitter/X";
  if (/youtube\.com/i.test(referrer)) return "YouTube";
  if (/tiktok\.com/i.test(referrer)) return "TikTok";
  if (/bing\./i.test(referrer)) return "Bing";
  return referrer.replace(/^https?:\/\//, "").split("/")[0];
}

router.post("/analytics/track", async (req, res) => {
  const parsed = TrackPageViewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  try {
    const ua = req.headers["user-agent"] || "";
    const deviceType = getDeviceType(ua);
    const categorized = categorizeReferrer(parsed.data.referrer);
    await db.insert(pageViewsTable).values({
      page: parsed.data.page,
      referrer: categorized,
      ipAddress: req.ip,
      deviceType,
    });
    res.json({ message: "Page view tracked" });
  } catch (err) {
    req.log.error({ err }, "Track page view error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/analytics/summary", async (req, res) => {
  try {
    const totalResult = await db.select({ count: sql<number>`count(*)` }).from(pageViewsTable);
    const totalPageViews = Number(totalResult[0].count);

    const uniquePagesResult = await db
      .select({ count: sql<number>`count(distinct page)` })
      .from(pageViewsTable);
    const uniquePages = Number(uniquePagesResult[0].count);

    const topPages = await db
      .select({ page: pageViewsTable.page, count: sql<number>`cast(count(*) as int)` })
      .from(pageViewsTable)
      .groupBy(pageViewsTable.page)
      .orderBy(desc(sql`count(*)`))
      .limit(10);

    const referrers = await db
      .select({ referrer: pageViewsTable.referrer, count: sql<number>`cast(count(*) as int)` })
      .from(pageViewsTable)
      .groupBy(pageViewsTable.referrer)
      .orderBy(desc(sql`count(*)`))
      .limit(10);

    res.json({
      totalPageViews,
      uniquePages,
      topPages: topPages.map(r => ({ page: r.page, count: Number(r.count) })),
      referrers: referrers
        .filter(r => r.referrer)
        .map(r => ({ referrer: r.referrer!, count: Number(r.count) })),
    });
  } catch (err) {
    req.log.error({ err }, "Analytics summary error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/analytics/daily", async (req, res) => {
  try {
    const daily = await db
      .select({
        date: sql<string>`to_char(created_at, 'YYYY-MM-DD')`,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(pageViewsTable)
      .groupBy(sql`to_char(created_at, 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(created_at, 'YYYY-MM-DD')`)
      .limit(30);
    res.json(daily.map(d => ({ date: d.date, count: Number(d.count) })));
  } catch (err) {
    req.log.error({ err }, "Daily analytics error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/tools/track", async (req, res) => {
  const parsed = TrackToolUsageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }
  try {
    await db.insert(toolUsageTable).values({ tool: parsed.data.tool });
    res.json({ message: "Tool usage tracked" });
  } catch (err) {
    req.log.error({ err }, "Track tool error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/tools/stats", async (req, res) => {
  try {
    const stats = await db
      .select({ tool: toolUsageTable.tool, count: sql<number>`cast(count(*) as int)` })
      .from(toolUsageTable)
      .groupBy(toolUsageTable.tool)
      .orderBy(desc(sql`count(*)`));
    res.json(stats.map(s => ({ tool: s.tool, count: Number(s.count) })));
  } catch (err) {
    req.log.error({ err }, "Tool stats error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

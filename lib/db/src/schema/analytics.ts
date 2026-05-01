import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const pageViewsTable = pgTable("page_views", {
  id: serial("id").primaryKey(),
  page: text("page").notNull(),
  referrer: text("referrer"),
  ipAddress: text("ip_address"),
  country: text("country"),
  deviceType: text("device_type"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const toolUsageTable = pgTable("tool_usage", {
  id: serial("id").primaryKey(),
  tool: text("tool").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const affiliateClicksTable = pgTable("affiliate_clicks", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  productName: text("product_name").notNull(),
  ipAddress: text("ip_address"),
  referrer: text("referrer"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPageViewSchema = createInsertSchema(pageViewsTable).omit({ id: true, createdAt: true });
export type InsertPageView = z.infer<typeof insertPageViewSchema>;
export type PageView = typeof pageViewsTable.$inferSelect;

export const insertToolUsageSchema = createInsertSchema(toolUsageTable).omit({ id: true, createdAt: true });
export type InsertToolUsage = z.infer<typeof insertToolUsageSchema>;
export type ToolUsage = typeof toolUsageTable.$inferSelect;

export const insertAffiliateClickSchema = createInsertSchema(affiliateClicksTable).omit({ id: true, createdAt: true });
export type InsertAffiliateClick = z.infer<typeof insertAffiliateClickSchema>;
export type AffiliateClick = typeof affiliateClicksTable.$inferSelect;

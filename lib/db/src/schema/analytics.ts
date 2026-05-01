import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const pageViewsTable = pgTable("page_views", {
  id: serial("id").primaryKey(),
  page: text("page").notNull(),
  referrer: text("referrer"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const toolUsageTable = pgTable("tool_usage", {
  id: serial("id").primaryKey(),
  tool: text("tool").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPageViewSchema = createInsertSchema(pageViewsTable).omit({ id: true, createdAt: true });
export type InsertPageView = z.infer<typeof insertPageViewSchema>;
export type PageView = typeof pageViewsTable.$inferSelect;

export const insertToolUsageSchema = createInsertSchema(toolUsageTable).omit({ id: true, createdAt: true });
export type InsertToolUsage = z.infer<typeof insertToolUsageSchema>;
export type ToolUsage = typeof toolUsageTable.$inferSelect;

import { Request, Response, NextFunction } from "express";
import { db, sessionsTable, usersTable } from "@workspace/db";
import { eq, and, gt } from "drizzle-orm";

export interface AuthRequest extends Request {
  userId?: number;
  isAdmin?: boolean;
}

export async function sessionMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.headers["authorization"]?.replace("Bearer ", "") ||
    (req.headers["cookie"] as string)?.split("; ")
      .find((c: string) => c.startsWith("session="))
      ?.split("=")[1];

  if (!token) {
    next();
    return;
  }

  try {
    const now = new Date();
    const sessions = await db
      .select()
      .from(sessionsTable)
      .where(
        and(
          eq(sessionsTable.sessionToken, token),
          gt(sessionsTable.expiresAt, now)
        )
      )
      .limit(1);

    if (sessions.length > 0) {
      const session = sessions[0];
      const users = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, session.userId))
        .limit(1);

      if (users.length > 0) {
        req.userId = users[0].id;
        req.isAdmin = users[0].isAdmin;
      }
    }
  } catch {
    // ignore session errors
  }

  next();
}

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  next();
}

export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.userId || !req.isAdmin) {
    res.status(403).json({ error: "Admin access required" });
    return;
  }
  next();
}

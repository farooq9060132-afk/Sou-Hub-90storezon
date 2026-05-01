import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const ADMIN_EMAIL = "admin@90storzon.com";
const ADMIN_PASSWORD = "Admin1234!";
const ADMIN_NAME = "Admin";

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

const existing = await db.select().from(usersTable).where(eq(usersTable.email, ADMIN_EMAIL)).limit(1);
if (existing.length > 0) {
  const passwordHash = hashPassword(ADMIN_PASSWORD);
  await db.update(usersTable).set({ passwordHash, isAdmin: true }).where(eq(usersTable.email, ADMIN_EMAIL));
  console.log(`Admin user updated with correct password hash (id=${existing[0].id}).`);
} else {
  const passwordHash = hashPassword(ADMIN_PASSWORD);
  const [row] = await db.insert(usersTable).values({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    passwordHash,
    isAdmin: true,
  }).returning();
  console.log(`Admin user created: ${row.email} (id=${row.id})`);
}

process.exit(0);

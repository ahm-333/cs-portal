import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { closeDbPool, getDb, isDatabaseConfigured } from "./index";
import { users } from "./schema";

function loadEnvFile(filename: string): void {
  const filePath = path.resolve(process.cwd(), filename);
  if (!fs.existsSync(filePath)) return;

  const raw = fs.readFileSync(filePath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;

    const key = trimmed.slice(0, eqIdx).trim();
    if (!key || process.env[key] !== undefined) continue;

    let value = trimmed.slice(eqIdx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

async function seedAdmin(): Promise<void> {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  if (!isDatabaseConfigured()) {
    console.error("Error: DATABASE_URL is not set. Add it to .env.local or your environment.");
    process.exitCode = 1;
    return;
  }

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const fullName = process.env.ADMIN_NAME?.trim() || "Eng. Ahmed Amir";

  if (!email) {
    console.error("Error: ADMIN_EMAIL is required to seed an admin account.");
    process.exitCode = 1;
    return;
  }

  if (!password || password.length < 8) {
    console.error("Error: ADMIN_PASSWORD is required and must be at least 8 characters long.");
    process.exitCode = 1;
    return;
  }

  const db = getDb();
  const passwordHash = hashPassword(password);
  const now = new Date();

  const [admin] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      fullName,
      yearLevel: 4,
      department: "CS",
      role: "admin",
      createdAt: now,
      updatedAt: now,
      lastActiveAt: now,
    })
    .onConflictDoUpdate({
      target: users.email,
      set: {
        passwordHash,
        fullName,
        role: "admin",
        updatedAt: now,
      },
    })
    .returning({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      role: users.role,
    });

  console.log(`Admin account ready: ${admin.fullName} <${admin.email}> (id=${admin.id}, role=${admin.role})`);
}

seedAdmin()
  .catch((error) => {
    console.error("Failed to seed admin account:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDbPool();
  });

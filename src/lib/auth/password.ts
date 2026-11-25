import crypto from "node:crypto";

const SCRYPT_KEY_LENGTH = 64;
const SCRYPT_PREFIX = "scrypt";

/**
 * Hashes a plaintext password using Node's built-in `crypto.scryptSync`
 * with a random 16-byte salt. Matches the format used by `seed-admin.ts`:
 * `scrypt:<32-char-hex-salt>:<128-char-hex-hash>`
 */
export function hashPassword(plain: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .scryptSync(plain, salt, SCRYPT_KEY_LENGTH)
    .toString("hex");
  return `${SCRYPT_PREFIX}:${salt}:${hash}`;
}

/**
 * Verifies a plaintext password against a stored `scrypt:<salt>:<hash>` string
 * using constant-time comparison (`crypto.timingSafeEqual`).
 */
export function verifyPassword(plain: string, stored: string): boolean {
  if (typeof plain !== "string" || typeof stored !== "string") {
    return false;
  }

  const parts = stored.split(":");
  if (parts.length !== 3) {
    return false;
  }

  const [algorithm, salt, expectedHex] = parts;
  if (
    algorithm !== SCRYPT_PREFIX ||
    !salt ||
    !expectedHex ||
    expectedHex.length % 2 !== 0 ||
    !/^[0-9a-fA-F]+$/.test(expectedHex)
  ) {
    return false;
  }

  try {
    const expectedBuf = Buffer.from(expectedHex, "hex");
    if (expectedBuf.length === 0) {
      return false;
    }

    const derivedBuf = crypto.scryptSync(plain, salt, expectedBuf.length);
    if (derivedBuf.length !== expectedBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(derivedBuf, expectedBuf);
  } catch {
    return false;
  }
}

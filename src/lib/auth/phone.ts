const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/**
 * Converts Arabic-Indic / Persian numerals to ASCII digits and strips whitespace/formatting.
 */
function toAsciiPhoneRaw(input: string): string {
  let out = "";
  for (const ch of input.trim()) {
    const arIdx = ARABIC_DIGITS.indexOf(ch);
    if (arIdx !== -1) {
      out += String(arIdx);
      continue;
    }
    const faIdx = PERSIAN_DIGITS.indexOf(ch);
    if (faIdx !== -1) {
      out += String(faIdx);
      continue;
    }
    if ((ch >= "0" && ch <= "9") || ch === "+") {
      out += ch;
    }
  }
  return out;
}

/**
 * Normalizes a student phone number:
 * - Egyptian mobile numbers (010 / 011 / 012 / 015 + 8 digits), whether entered as
 *   `010...`, `+2010...`, `2010...`, `002010...`, or `10...` -> `01XXXXXXXXX` (11 digits).
 * - Other valid international numbers (`+` followed by 9–15 digits) -> `+<digits>`.
 * Returns `null` if invalid.
 */
export function normalizePhoneNumber(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const cleaned = toAsciiPhoneRaw(raw);
  if (!cleaned) return null;

  // Handle 00 prefix as +
  let candidate = cleaned.startsWith("00") ? `+${cleaned.slice(2)}` : cleaned;

  // Strip Egypt country code variants (+20 / 20)
  if (candidate.startsWith("+20")) {
    candidate = candidate.slice(3);
  } else if (candidate.startsWith("20") && candidate.length >= 12) {
    candidate = candidate.slice(2);
  }

  // Egyptian mobile without leading 0 (e.g. 1012345678 -> 01012345678)
  if (/^1[0125]\d{8}$/.test(candidate)) {
    return `0${candidate}`;
  }

  // Standard 11-digit Egyptian mobile
  if (/^01[0125]\d{8}$/.test(candidate)) {
    return candidate;
  }

  // International phone number (+ followed by 9 to 15 digits)
  if (/^\+[1-9]\d{8,14}$/.test(candidate)) {
    return candidate;
  }

  return null;
}

/**
 * Returns true if the login identifier looks like a phone number rather than an email address.
 */
export function looksLikePhoneIdentifier(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed || trimmed.includes("@")) return false;
  return normalizePhoneNumber(trimmed) !== null;
}

/**
 * Builds a WhatsApp direct chat URL (`https://wa.me/...`) from a stored phone number.
 */
export function buildWhatsAppLink(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const normalized = normalizePhoneNumber(phone);
  if (!normalized) return null;
  if (normalized.startsWith("01") && normalized.length === 11) {
    return `https://wa.me/2${normalized}`;
  }
  const digits = normalized.replace(/^\+/, "");
  return digits ? `https://wa.me/${digits}` : null;
}

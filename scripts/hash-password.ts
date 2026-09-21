/**
 * Generates an ADMIN_PASSWORD_HASH for .env.local.
 * Usage: npm run hash-password -- 'your-password'
 */

import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

async function main() {
  const password = process.argv[2];
  if (!password || password.length < 10) {
    console.error(
      "Pass a password of at least 10 characters:\n" +
        "  npm run hash-password -- 'your-password'",
    );
    process.exit(1);
  }

  const salt = randomBytes(16);
  const hash = (await scryptAsync(password, salt, 64)) as Buffer;

  // Colon-separated: Next.js expands `$NAME` inside .env files.
  console.log(
    `ADMIN_PASSWORD_HASH=scrypt:${salt.toString("base64url")}:${hash.toString("base64url")}`,
  );
}

main();

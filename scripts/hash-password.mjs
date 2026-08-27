import { hash } from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error("Usage: node scripts/hash-password.mjs <password>");
  process.exit(1);
}

const hashed = await hash(password, 12);

// Next.js expands $VARIABLE references when it loads .env files, which
// would mangle a bcrypt hash (it's full of $-prefixed segments). Escaping
// is only needed for .env files — paste the raw hash as-is into Vercel's
// dashboard, since that doesn't go through Next's .env expansion.
console.log(`Raw hash (use in Vercel dashboard):\n${hashed}\n`);
console.log(`.env line (use in a local .env file):\nADMIN_PASSWORD_HASH="${hashed.replaceAll("$", "\\$")}"`);

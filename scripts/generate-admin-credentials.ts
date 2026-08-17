// Run this locally to set up the admin PIN: npm run admin:setup
// The PIN you type here is never saved anywhere, only its hash is. Nobody
// reading this codebase (including an AI assistant helping you edit it) can
// recover the PIN from ADMIN_PIN_HASH.

import { randomBytes } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { hashPin } from "../lib/admin-auth";

async function main() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const pin = (await rl.question("Choose an admin PIN (6 digits recommended): ")).trim();
  rl.close();

  if (pin.length < 4) {
    console.error("That PIN is too short. Use at least 4 characters.");
    process.exitCode = 1;
    return;
  }

  const pinHash = hashPin(pin);
  const sessionSecret = randomBytes(32).toString("hex");

  console.log("\nAdd these to your .env file, and to Vercel's Environment Variables:\n");
  console.log(`ADMIN_PIN_HASH="${pinHash}"`);
  console.log(`ADMIN_SESSION_SECRET="${sessionSecret}"`);
  console.log("\nKeep the PIN itself somewhere safe. It cannot be recovered from the hash above.");
}

main();

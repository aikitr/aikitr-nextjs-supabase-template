import { spawnSync } from "node:child_process";
import { loadEnv } from "vite";

const fileEnv = loadEnv("production", process.cwd(), "");

for (const [name, value] of Object.entries(fileEnv)) {
  if (process.env[name] === undefined) {
    process.env[name] = value;
  }
}

const requiredVariables = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SITE_URL",
];
const missingVariables = requiredVariables.filter(
  (name) => !process.env[name]?.trim(),
);

if (missingVariables.length > 0) {
  console.error(
    `Missing required Cloudflare deployment variables: ${missingVariables.join(", ")}`,
  );
  process.exit(1);
}

const result = spawnSync(
  "pnpm",
  ["exec", "vinext-cloudflare", "deploy", ...process.argv.slice(2)],
  {
    env: process.env,
    stdio: "inherit",
  },
);

if (result.error) {
  console.error("Could not start the Cloudflare deployment command.");
  process.exit(1);
}

process.exit(result.status ?? 1);

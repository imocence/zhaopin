#!/usr/bin/env node
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

const projectRoot = process.cwd();
const openNextConfigPath = path.join(projectRoot, ".open-next", ".build", "open-next.config.edge.mjs");
const hasOpenNextBuild = existsSync(openNextConfigPath);
const envTarget = (process.env.DEPLOY_TARGET || process.env.CLOUDFLARE_TARGET || "").toLowerCase();
const shouldUseOpenNext = envTarget === "cloudflare" || hasOpenNextBuild;
const command = shouldUseOpenNext
  ? "npx opennextjs-cloudflare deploy"
  : "npx wrangler deploy";

console.log(`Running deploy command: ${command}`);

try {
  execSync(command, { stdio: "inherit" });
} catch (error) {
  process.exit(error.status || 1);
}

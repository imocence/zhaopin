#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

const projectRoot = process.cwd();
const pkgPath = path.join(projectRoot, "package.json");
let pkg = {};
try {
  pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
} catch (e) {}
const hasOpenNextDep = Boolean(
  (pkg.dependencies && pkg.dependencies["@opennextjs/cloudflare"]) ||
    (pkg.devDependencies && pkg.devDependencies["@opennextjs/cloudflare"])
);
const wranglerPath = path.join(projectRoot, "wrangler.toml");
let wranglerMainOpenNext = false;
try {
  if (existsSync(wranglerPath)) {
    const w = readFileSync(wranglerPath, "utf8");
    wranglerMainOpenNext = w.includes('main = ".open-next/worker.js"');
  }
} catch (e) {}

const envTarget = (process.env.DEPLOY_TARGET || process.env.CLOUDFLARE_TARGET || "").toLowerCase();
const forceNext = process.env.FORCE_NEXT === "1";
const shouldUseOpenNext = !forceNext && (envTarget === "cloudflare" || (hasOpenNextDep && wranglerMainOpenNext));

const command = shouldUseOpenNext ? "npx opennextjs-cloudflare build" : "next build";
console.log(`Running build command: ${command}`);

try {
  execSync(command, { stdio: "inherit" });
} catch (err) {
  process.exit(err.status || 1);
}

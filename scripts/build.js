#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

// 防止递归调用的标志
if (process.env.__OPENNEXT_BUILD_RUNNING === "1") {
  console.log("Detected recursive build call, skipping...");
  process.exit(0);
}

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

if (shouldUseOpenNext) {
  console.log("Running OpenNext build for Cloudflare...");
  
  console.log("Cleaning previous build...");
  execSync("rm -rf .next", { stdio: "inherit" });
  // 先执行 next build
  console.log("Step 1: Building Next.js app...");
  try {
    execSync("npx next build", { stdio: "inherit" });
  } catch (err) {
    process.exit(err.status || 1);
  }
  
  // 再执行 opennextjs-cloudflare build
  console.log("Step 2: Building Cloudflare adapter...");
  try {
    process.env.__OPENNEXT_BUILD_RUNNING = "1";
    execSync("npx opennextjs-cloudflare build", { 
      stdio: "inherit",
      env: process.env
    });
  } catch (err) {
    process.exit(err.status || 1);
  }
  console.log("Step 3: Initializing database...");
  try {
    execSync("npm run db:init", { stdio: "inherit" });
  } catch (err) {
    console.warn("Database initialization failed, but continuing...");
    // 如果失败，不中断部署（可能是已有数据）
  }
} else {
  console.log("Running standard Next.js build...");
  try {
    execSync("npx next build", { stdio: "inherit" });
  } catch (err) {
    process.exit(err.status || 1);
  }
}
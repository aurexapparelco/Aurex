#!/usr/bin/env node
// scripts/setup.mjs — One-shot Supabase setup for Auréx Atelier

import { readFileSync } from "fs";

// ── Parse .env.local ──────────────────────────────────────────────────────────
const raw = readFileSync(".env.local", "utf-8");
const env = {};
for (const line of raw.split("\n")) {
  const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim();
}

const URL  = env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
const SRK  = env.SUPABASE_SERVICE_ROLE_KEY;
const PAT  = env.SUPABASE_ACCESS_TOKEN;          // Personal Access Token
const REF  = URL?.replace("https://", "").replace(".supabase.co", "");

if (!URL || !SRK || !REF) {
  console.error("❌  Missing env vars — check .env.local");
  process.exit(1);
}

const authToken = PAT || SRK;  // PAT preferred; SRK for project-level endpoints

console.log(`\n🏛  Auréx Atelier — Supabase Setup`);
console.log(`   Project ref: ${REF}`);
console.log(`   Auth token:  ${PAT ? "Personal Access Token ✓" : "service_role key (PAT preferred)"}\n`);

// ── Helpers ────────────────────────────────────────────────────────────────────
async function mgmt(path, method = "GET", body, token = authToken) {
  const r = await fetch(`https://api.supabase.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await r.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { ok: r.ok, status: r.status, data };
}

async function execSQL(sql) {
  return mgmt(`/projects/${REF}/database/query`, "POST", { query: sql });
}

// ── 1. Auth redirect URLs ─────────────────────────────────────────────────────
process.stdout.write("🔐  Configuring auth redirect URLs … ");
const authRes = await mgmt(`/projects/${REF}/config/auth`, "PATCH", {
  site_url: "http://localhost:3000",
  additional_redirect_urls: [
    "http://localhost:3000/callback",
    "http://localhost:3000/**",
  ],
  disable_signup: false,
  mailer_autoconfirm: true,
});

if (authRes.ok) {
  console.log("✅");
} else {
  console.log(`⚠️  (${authRes.status})`);
  if (authRes.status === 401 || authRes.status === 403) {
    if (!PAT) {
      console.log(`
   ⚠️  The Management API requires a Personal Access Token (PAT), not the service_role key.

   To fix this, add your PAT to .env.local:
     SUPABASE_ACCESS_TOKEN=sbp_xxxxxxxxxxxxxxxx

   Get your PAT at: https://supabase.com/dashboard/account/tokens
   Then re-run: node scripts/setup.mjs

   Or configure auth redirect manually (30 sec):
     → https://supabase.com/dashboard/project/${REF}/auth/url-configuration
     → Site URL:     http://localhost:3000
     → Redirect URL: http://localhost:3000/callback
`);
    }
  }
}

// ── 2. Schema migration ───────────────────────────────────────────────────────
process.stdout.write("📦  Running schema migration … ");
const migrationSQL = readFileSync(
  "supabase/migrations/001_initial_schema.sql",
  "utf-8",
);

const migRes = await execSQL(migrationSQL);

if (migRes.ok) {
  console.log("✅  Schema created");
} else {
  const errText = JSON.stringify(migRes.data);
  if (errText.includes("already exists")) {
    console.log("✅  Schema already exists (skipping)");
  } else {
    console.log(`❌  (${migRes.status})`);
    if (migRes.status === 401 || migRes.status === 403) {
      if (!PAT) {
        console.log(`
   ⚠️  Schema migration also requires a PAT (same fix as above).

   Or run manually — open the SQL editor and paste the file contents:
     → https://supabase.com/dashboard/project/${REF}/sql/new
     → File: supabase/migrations/001_initial_schema.sql
`);
      }
    } else {
      console.log("   Error:", JSON.stringify(migRes.data, null, 2));
    }
    console.log("⏭   Skipping seed (run after schema is applied)\n");
    process.exit(0);
  }
}

// ── 3. Seed data ──────────────────────────────────────────────────────────────
process.stdout.write("🌱  Inserting seed data … ");
const seedSQL = readFileSync("supabase/seed.sql", "utf-8");
const seedRes = await execSQL(seedSQL);

if (seedRes.ok) {
  console.log("✅  Seed data inserted");
} else {
  const errText = JSON.stringify(seedRes.data);
  if (errText.includes("duplicate") || errText.includes("already exists") || errText.includes("unique")) {
    console.log("✅  Seed data already present (skipping)");
  } else {
    console.log(`⚠️  (${seedRes.status})`);
    console.log("   Error:", JSON.stringify(seedRes.data, null, 2));
    console.log(`
   Run the seed manually:
     → https://supabase.com/dashboard/project/${REF}/sql/new
     → File: supabase/seed.sql
`);
  }
}

// ── Done ──────────────────────────────────────────────────────────────────────
console.log(`
✨  Setup complete.
   Run: pnpm dev  →  http://localhost:3000

   Next steps:
   1. Sign up at http://localhost:3000/signup
   2. Go to your Supabase dashboard → Table Editor → staff table
      → Insert a row with your user UUID and role: "admin"
      → https://supabase.com/dashboard/project/${REF}/editor
   3. Log in at http://localhost:3000/admin/login
`);

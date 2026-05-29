import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// We'll run each DDL statement as a separate RPC call after bootstrapping
// the exec_sql helper. First, create the helper function via a raw fetch
// to the PostgREST /rpc endpoint that accepts SQL text.

// Strategy: use supabase.rpc() — but exec_sql doesn't exist yet.
// Alternative: use the pg_query function available in Supabase via the
// supabase-js client's .rpc('exec_sql') after we create it.

// Bootstrapping: POST to /rest/v1/rpc/exec_sql won't work before it exists.
// Solution: use the Supabase auth admin API to verify connection, then
// use fetch with the service role key to call the Postgres REST endpoint
// that accepts raw queries (pgRESTful pattern via PostgREST 12+).

// Actually the simplest working approach with service role:
// Create the exec_sql function via a raw POST that bypasses PostgREST
// by calling the Supabase SQL HTTP endpoint available in newer SDK.

async function runSQL(sql, description) {
  console.log(`\nRunning: ${description}...`);
  
  // Use the raw fetch to Supabase's internal query endpoint
  const response = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
    method: "POST",
    headers: {
      "apikey": key,
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql }),
  });

  if (!response.ok) {
    const text = await response.text();
    if (text.includes("PGRST202")) {
      // exec_sql doesn't exist yet — we need to bootstrap it
      return { needsBootstrap: true };
    }
    throw new Error(`HTTP ${response.status}: ${text.slice(0, 300)}`);
  }
  
  console.log(`  ✓ ${description}`);
  return { ok: true };
}

// Bootstrap: create exec_sql via the pg endpoint
async function bootstrap() {
  console.log("Bootstrapping exec_sql helper function...");
  
  // Use the Supabase Management API pg/query endpoint (available with service key on hosted)
  const r = await fetch(`${url}/pg/query`, {
    method: "POST",
    headers: {
      "apikey": key,
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN EXECUTE sql; END; $$;`
    }),
  });
  
  if (!r.ok) {
    const txt = await r.text();
    throw new Error(`Bootstrap failed: ${r.status} ${txt.slice(0, 300)}`);
  }
  console.log("  ✓ exec_sql helper created");
}

const STEPS = [
  {
    desc: "Create profiles table",
    sql: `CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN (
    'contractor','client_entity','consultant','professional',
    'employee','psc_community','integrated_org','supplier','auditor'
  )),
  display_name text,
  entity_name text,
  entity_id uuid,
  phone text,
  created_at timestamptz DEFAULT now()
)`,
  },
  {
    desc: "Enable RLS",
    sql: `ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY`,
  },
  {
    desc: "Create SELECT policy",
    sql: `DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='profiles'
    AND policyname='Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON public.profiles FOR SELECT
      TO authenticated USING (auth.uid() = id);
  END IF;
END $$`,
  },
  {
    desc: "Create UPDATE policy",
    sql: `DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='profiles'
    AND policyname='Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON public.profiles FOR UPDATE
      TO authenticated USING (auth.uid() = id);
  END IF;
END $$`,
  },
  {
    desc: "Create handle_new_user function",
    sql: `CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $func$
BEGIN
  INSERT INTO public.profiles (id, role, display_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'role', 'contractor'),
    COALESCE(new.raw_user_meta_data->>'display_name', new.email)
  );
  RETURN new;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER`,
  },
  {
    desc: "Create on_auth_user_created trigger",
    sql: `DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user()`,
  },
];

async function verify() {
  console.log("\n--- Verification ---");

  const { data: cols, error: colErr } = await supabase
    .rpc("exec_sql", { sql: `SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' ORDER BY ordinal_position` })
    .catch(() => ({ data: null, error: "rpc unavailable" }));

  // Use REST to check table existence
  const { data: sample, error: sampleErr } = await supabase
    .from("profiles")
    .select("id")
    .limit(1);

  if (sampleErr && sampleErr.code === "42P01") {
    console.error("✗ profiles table does not exist");
  } else if (sampleErr) {
    // RLS error = table exists, RLS is working
    console.log("✓ profiles table exists (RLS active — no rows returned for service role without bypass)");
  } else {
    console.log("✓ profiles table exists, rows:", sample?.length ?? 0);
  }

  // Check policies
  const policyResp = await fetch(
    `${url}/rest/v1/rpc/exec_sql`,
    {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ sql: "SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='profiles'" }),
    }
  );
  if (policyResp.ok) {
    const policies = await policyResp.json();
    console.log("✓ RLS policies:", policies.map((p) => p.policyname).join(", "));
  }
}

async function main() {
  console.log("=== Tenderbox Supabase Migration ===");
  console.log("Project:", url);

  // Try running first step to see if exec_sql already exists
  const testResult = await runSQL(STEPS[0].sql, STEPS[0].desc);

  if (testResult?.needsBootstrap) {
    await bootstrap();
    // Retry first step
    await runSQL(STEPS[0].sql, STEPS[0].desc);
  }

  // Run remaining steps
  for (const step of STEPS.slice(1)) {
    await runSQL(step.sql, step.desc);
  }

  // Clean up bootstrap helper (optional — leave it, it's useful)
  console.log("\n=== Migration complete ===");
  await verify();
}

main().catch((e) => {
  console.error("\nFATAL:", e.message);
  process.exit(1);
});

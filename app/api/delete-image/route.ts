import { NextRequest, NextResponse } from "next/server";
import { s3Delete, s3BaseUrl } from "@/lib/s3";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: staff } = await supabase.from("staff").select("id").eq("id", user.id).single();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const base = s3BaseUrl();
  const body = await req.json() as { url?: string };
  if (!body.url || !body.url.startsWith(base)) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Extract S3 key from URL, then strip the size filename to get the prefix
  const key = body.url.slice(base.length + 1);
  const prefix = key.replace(/\/[^/]+\.webp$/, "");

  const sizes = key.startsWith("hero/") ? ["mobile", "desktop"] : ["sm", "md", "lg"];
  await Promise.all(sizes.map((s) => s3Delete(`${prefix}/${s}.webp`)));

  return NextResponse.json({ ok: true });
}

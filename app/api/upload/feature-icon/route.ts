import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { s3Put } from "@/lib/s3";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: staff } = await supabase.from("staff").select("id").eq("id", user.id).single();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const id = crypto.randomUUID();

  // Resize to 80×80, preserve transparency via WebP
  const processed = await sharp(buffer)
    .resize(80, 80, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 90, alphaQuality: 100 })
    .toBuffer();

  const url = await s3Put(`feature-icons/${id}.webp`, processed);

  return NextResponse.json({ urls: { icon: url } });
}

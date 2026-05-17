import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { s3Put } from "@/lib/s3";
import { createClient } from "@/lib/supabase/server";

const SIZES = {
  mobile: { width: 800, height: 1000 },
  desktop: { width: 1920, height: 1080 },
} as const;

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
  const urls: Record<string, string> = {};

  for (const [size, dims] of Object.entries(SIZES)) {
    const processed = await sharp(buffer)
      .resize(dims.width, dims.height, { fit: "cover", position: "center" })
      .webp({ quality: 88 })
      .toBuffer();
    urls[size] = await s3Put(`hero/${size}.webp`, processed);
  }

  return NextResponse.json({ urls });
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename") ?? "upload";
  const resourceType = (searchParams.get("resourceType") as "image" | "raw" | "auto") ?? "auto";

  if (!request.body) {
    return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
  }

  const arrayBuffer = await request.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await uploadToCloudinary(buffer, {
    folder: resourceType === "image" ? "media" : "documents",
    filename,
    resourceType,
  });

  return NextResponse.json({ url: result.url, publicId: result.publicId });
}

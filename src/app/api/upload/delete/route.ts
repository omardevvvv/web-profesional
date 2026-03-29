import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function DELETE(request: Request): Promise<NextResponse> {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { publicId, resourceType } = await request.json();
  if (!publicId) {
    return NextResponse.json({ error: "Falta publicId" }, { status: 400 });
  }

  await deleteFromCloudinary(publicId, resourceType ?? "image");
  return NextResponse.json({ ok: true });
}

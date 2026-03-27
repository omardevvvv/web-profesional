"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getHeroContent() {
  return prisma.heroContent.findFirst();
}

export async function updateHeroContent(data: {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: string;
}) {
  const existing = await prisma.heroContent.findFirst();

  if (existing) {
    await prisma.heroContent.update({
      where: { id: existing.id },
      data,
    });
  } else {
    await prisma.heroContent.create({ data });
  }

  revalidatePath("/");
}

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSeoSettings() {
  return prisma.seoSetting.findMany();
}

export async function getSeoByPage(pageName: string) {
  return prisma.seoSetting.findUnique({ where: { pageName } });
}

export async function updateSeoSetting(
  pageName: string,
  data: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    keywords?: string;
  }
) {
  await prisma.seoSetting.upsert({
    where: { pageName },
    update: data,
    create: { pageName, ...data },
  });

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/contacto");
}

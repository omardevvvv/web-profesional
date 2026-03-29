"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({ where: { id } });
}

export async function createCategory(data: { name: string }) {
  const slug = slugify(data.name, { lower: true, strict: true, locale: "es" });
  await prisma.category.create({ data: { name: data.name, slug } });
  revalidatePath("/blog");
  revalidatePath("/admin/blog/categorias");
}

export async function updateCategory(id: string, data: { name: string }) {
  const slug = slugify(data.name, { lower: true, strict: true, locale: "es" });
  await prisma.category.update({ where: { id }, data: { name: data.name, slug } });
  revalidatePath("/blog");
  revalidatePath("/admin/blog/categorias");
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/blog");
  revalidatePath("/admin/blog/categorias");
}

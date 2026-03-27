"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFaqItems(onlyActive = true) {
  return prisma.faqItem.findMany({
    where: onlyActive ? { isActive: true } : {},
    orderBy: { order: "asc" },
  });
}

export async function getFaqById(id: string) {
  return prisma.faqItem.findUnique({ where: { id } });
}

export async function createFaq(data: {
  question: string;
  answer: string;
  order?: number;
}) {
  await prisma.faqItem.create({ data });
  revalidatePath("/");
  revalidatePath("/admin/faq");
}

export async function updateFaq(
  id: string,
  data: {
    question?: string;
    answer?: string;
    order?: number;
    isActive?: boolean;
  }
) {
  await prisma.faqItem.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/admin/faq");
}

export async function deleteFaq(id: string) {
  await prisma.faqItem.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/faq");
}

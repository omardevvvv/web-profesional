"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getServices(onlyActive = true) {
  return prisma.service.findMany({
    where: onlyActive ? { isActive: true } : {},
    orderBy: { order: "asc" },
  });
}

export async function getServiceById(id: string) {
  return prisma.service.findUnique({ where: { id } });
}

export async function createService(data: {
  title: string;
  description: string;
  icon?: string;
  order?: number;
}) {
  await prisma.service.create({ data });
  revalidatePath("/");
  revalidatePath("/admin/servicios");
}

export async function updateService(
  id: string,
  data: {
    title?: string;
    description?: string;
    icon?: string;
    order?: number;
    isActive?: boolean;
  }
) {
  await prisma.service.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/admin/servicios");
}

export async function deleteService(id: string) {
  await prisma.service.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/servicios");
}

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTeamMembers(onlyActive = true) {
  return prisma.teamMember.findMany({
    where: onlyActive ? { isActive: true } : {},
    orderBy: { order: "asc" },
  });
}

export async function getTeamMemberById(id: string) {
  return prisma.teamMember.findUnique({ where: { id } });
}

export async function createTeamMember(data: {
  name: string;
  role: string;
  bio?: string;
  photoUrl?: string;
  email?: string;
  linkedIn?: string;
  order?: number;
}) {
  await prisma.teamMember.create({ data });
  revalidatePath("/");
  revalidatePath("/admin/equipo");
}

export async function updateTeamMember(
  id: string,
  data: {
    name?: string;
    role?: string;
    bio?: string;
    photoUrl?: string;
    email?: string;
    linkedIn?: string;
    order?: number;
    isActive?: boolean;
  }
) {
  await prisma.teamMember.update({ where: { id }, data });
  revalidatePath("/");
  revalidatePath("/admin/equipo");
}

export async function deleteTeamMember(id: string) {
  await prisma.teamMember.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/equipo");
}

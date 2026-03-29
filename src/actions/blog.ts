"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

export async function getBlogPosts(
  publishedOnly = true,
  options?: { search?: string; categorySlug?: string }
) {
  const { search, categorySlug } = options ?? {};
  return prisma.blogPost.findMany({
    where: {
      ...(publishedOnly ? { isPublished: true } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { excerpt: { contains: search, mode: "insensitive" } },
              { content: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(categorySlug
        ? { categories: { some: { slug: categorySlug } } }
        : {}),
    },
    orderBy: { publishedAt: "desc" },
    include: { categories: true, attachments: true },
  });
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug },
    include: { categories: true, attachments: true },
  });
}

export async function getBlogPostById(id: string) {
  return prisma.blogPost.findUnique({
    where: { id },
    include: { categories: true, attachments: true },
  });
}

export async function createBlogPost(data: {
  title: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  isPublished?: boolean;
  author?: string;
  tags?: string[];
  categoryIds?: string[];
  attachments?: { name: string; url: string; publicId?: string; mimeType?: string }[];
}) {
  const { categoryIds, attachments, ...rest } = data;
  const slug = slugify(rest.title, { lower: true, strict: true, locale: "es" });
  const publishedAt = rest.isPublished ? new Date() : undefined;

  await prisma.blogPost.create({
    data: {
      ...rest,
      slug,
      publishedAt,
      ...(categoryIds?.length
        ? { categories: { connect: categoryIds.map(id => ({ id })) } }
        : {}),
      ...(attachments?.length
        ? { attachments: { create: attachments } }
        : {}),
    },
  });

  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath("/admin/blog");
}

export async function updateBlogPost(
  id: string,
  data: {
    title?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    isPublished?: boolean;
    author?: string;
    tags?: string[];
    categoryIds?: string[];
    attachmentsToAdd?: { name: string; url: string; publicId?: string; mimeType?: string }[];
    attachmentIdsToRemove?: string[];
  }
) {
  const { categoryIds, attachmentsToAdd, attachmentIdsToRemove, ...rest } = data;

  const current = await prisma.blogPost.findUnique({ where: { id } });
  if (!current) throw new Error(`BlogPost ${id} not found`);

  const publishedAt =
    rest.isPublished && !current.isPublished ? new Date() : current.publishedAt;

  await prisma.blogPost.update({
    where: { id },
    data: {
      ...rest,
      publishedAt,
      ...(categoryIds !== undefined
        ? { categories: { set: categoryIds.map(cid => ({ id: cid })) } }
        : {}),
      ...(attachmentsToAdd?.length
        ? { attachments: { create: attachmentsToAdd } }
        : {}),
      ...(attachmentIdsToRemove?.length
        ? { attachments: { deleteMany: { id: { in: attachmentIdsToRemove } } } }
        : {}),
    },
  });

  if (current.slug) revalidatePath(`/blog/${current.slug}`);
  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  const post = await prisma.blogPost.findUnique({ where: { id } });
  await prisma.blogPost.delete({ where: { id } });
  if (post?.slug) revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath("/admin/blog");
}

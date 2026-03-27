"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

export async function getBlogPosts(publishedOnly = true) {
  return prisma.blogPost.findMany({
    where: publishedOnly ? { isPublished: true } : {},
    orderBy: { publishedAt: "desc" },
  });
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug } });
}

export async function getBlogPostById(id: string) {
  return prisma.blogPost.findUnique({ where: { id } });
}

export async function createBlogPost(data: {
  title: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  isPublished?: boolean;
  author?: string;
  tags?: string[];
}) {
  const slug = slugify(data.title, { lower: true, strict: true, locale: "es" });
  const publishedAt = data.isPublished ? new Date() : undefined;

  await prisma.blogPost.create({
    data: { ...data, slug, publishedAt },
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
  }
) {
  const current = await prisma.blogPost.findUnique({ where: { id } });
  const publishedAt =
    data.isPublished && !current?.isPublished ? new Date() : current?.publishedAt;

  await prisma.blogPost.update({ where: { id }, data: { ...data, publishedAt } });

  if (current?.slug) revalidatePath(`/blog/${current.slug}`);
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

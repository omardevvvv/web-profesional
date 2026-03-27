import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getBlogPostBySlug, getBlogPosts } from "@/actions/blog";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: post.coverImage ? { images: [post.coverImage] } : undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || !post.isPublished) notFound();

  return (
    <div className="min-h-screen bg-white pt-20 pb-20">
      {/* Cover image */}
      {post.coverImage && (
        <div className="relative w-full h-64 sm:h-80 bg-[#0A1628] mb-10">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[#D4A843] font-medium mb-8 hover:gap-3 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Blog
        </Link>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs bg-[#D4A843]/10 text-[#D4A843] border-[#D4A843]/20"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#0A1628] mb-6 font-[var(--font-heading)] leading-tight">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-10 pb-8 border-b border-gray-100">
          {post.author && (
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" /> {post.author}
            </span>
          )}
          {post.publishedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {format(post.publishedAt, "d 'de' MMMM yyyy", { locale: es })}
            </span>
          )}
        </div>

        {/* Content */}
        <div
          className="prose prose-gray max-w-none prose-headings:font-[var(--font-heading)] prose-headings:text-[#0A1628] prose-a:text-[#D4A843]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Bottom CTA */}
        <div className="mt-16 p-8 bg-[#0A1628] rounded-2xl text-center">
          <h3 className="text-white font-semibold text-xl mb-2 font-[var(--font-heading)]">
            ¿Necesita asesoramiento?
          </h3>
          <p className="text-white/60 mb-5 text-sm">
            Contacte con nuestros expertos para una consulta gratuita.
          </p>
          <Link
            href="/#contacto"
            className="inline-flex items-center gap-2 bg-[#D4A843] hover:bg-[#F0C75E] text-[#0A1628] font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
          >
            Contactar ahora
          </Link>
        </div>
      </div>
    </div>
  );
}

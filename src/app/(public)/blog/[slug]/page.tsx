import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeft, Calendar, User, Download, FileText } from "lucide-react";
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
        <div className="relative w-full h-64 sm:h-80 bg-[#1A1A1A] mb-10">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[#7A5230] font-medium mb-8 hover:gap-3 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Blog
        </Link>

        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog?categoria=${cat.slug}`}
                className="text-xs bg-[#C4A882]/15 text-[#7A5230] border border-[#C4A882]/30 px-2.5 py-1 rounded-full hover:bg-[#C4A882]/25 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs bg-[#C4A882]/15 text-[#7A5230] border-[#C4A882]/30"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-6 font-[var(--font-heading)] leading-tight">
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
          className="prose prose-gray max-w-none prose-headings:font-[var(--font-heading)] prose-headings:text-[#1A1A1A] prose-a:text-[#7A5230]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Attachments */}
        {post.attachments && post.attachments.length > 0 && (
          <div className="mt-12 p-6 bg-[#FAFAFA] rounded-2xl border border-gray-100">
            <h3 className="text-[#1A1A1A] font-semibold text-base mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#C4A882]" />
              Documentos adjuntos
            </h3>
            <ul className="space-y-2">
              {post.attachments.map((att) => (
                <li key={att.id}>
                  <a
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-[#C4A882]/40 hover:shadow-sm transition-all group"
                  >
                    <Download className="w-4 h-4 text-[#C4A882] shrink-0" />
                    <span className="text-sm text-[#1A1A1A] group-hover:text-[#7A5230] transition-colors flex-1 truncate">
                      {att.name}
                    </span>
                    <span className="text-xs text-gray-400 shrink-0">Descargar</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 p-8 bg-[#1A1A1A] rounded-2xl text-center">
          <h3 className="text-white font-semibold text-xl mb-2 font-[var(--font-heading)]">
            ¿Necesita asesoramiento?
          </h3>
          <p className="text-white/60 mb-5 text-sm">
            Contacte con nuestros expertos para una consulta gratuita.
          </p>
          <Link
            href="/#contacto"
            className="inline-flex items-center gap-2 bg-[#C4A882] hover:bg-[#D4B896] text-[#1A1A1A] font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
          >
            Contactar ahora
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BlogCard } from "./BlogCard";
import { AnimatedSection } from "./AnimatedSection";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  publishedAt?: Date | null;
  author?: string | null;
  tags?: string[];
}

interface BlogPreviewSectionProps {
  posts: BlogPost[];
}

export function BlogPreviewSection({ posts }: BlogPreviewSectionProps) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-24 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[#7A5230] font-medium text-sm uppercase tracking-widest">
              Noticias y Novedades
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mt-3 font-[var(--font-heading)]">
              Últimas Publicaciones
            </h2>
          </div>
          <Link
            href="/blog"
            className="flex items-center gap-2 text-[#1A1A1A] font-medium hover:text-[#7A5230] transition-colors shrink-0"
          >
            Ver todo el blog <ArrowRight className="w-4 h-4" />
          </Link>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <AnimatedSection key={post.id} delay={i * 0.1}>
              <BlogCard {...post} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

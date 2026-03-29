import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Category { id: string; name: string; slug: string; }

interface BlogCardProps {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  publishedAt?: Date | null;
  author?: string | null;
  tags?: string[];
  categories?: Category[];
}

export function BlogCard({
  title,
  slug,
  excerpt,
  coverImage,
  publishedAt,
  author,
  tags,
  categories,
}: BlogCardProps) {
  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#C4A882]/40 hover:shadow-lg hover:shadow-[#C4A882]/10 transition-all duration-300">
      {/* Cover image */}
      <div className="relative w-full h-48 bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] overflow-hidden">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#C4A882]/30 text-6xl font-bold font-[var(--font-heading)]">
              {title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/blog?categoria=${cat.slug}`}
                className="text-xs bg-[#C4A882]/15 text-[#7A5230] border border-[#C4A882]/30 px-2 py-0.5 rounded-full hover:bg-[#C4A882]/25 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Tags (legacy) */}
        {(!categories || categories.length === 0) && tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.slice(0, 2).map((tag) => (
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

        <h3 className="text-[#1A1A1A] font-semibold text-lg leading-snug mb-2 group-hover:text-[#7A5230] transition-colors font-[var(--font-heading)]">
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h3>

        {excerpt && (
          <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
            {excerpt}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto">
          <div className="text-xs text-gray-400 space-y-0.5">
            {author && <span>{author}</span>}
            {publishedAt && (
              <p>
                {format(publishedAt, "d MMMM yyyy", { locale: es })}
              </p>
            )}
          </div>
          <Link
            href={`/blog/${slug}`}
            className="flex items-center gap-1 text-[#7A5230] text-sm font-medium hover:gap-2 transition-all"
          >
            Leer más <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </article>
  );
}

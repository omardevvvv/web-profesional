import { BlogCard } from "@/components/public/BlogCard";
import { AnimatedSection } from "@/components/public/AnimatedSection";
import { BlogSearch } from "@/components/public/BlogSearch";
import { getBlogPosts } from "@/actions/blog";
import { getCategories } from "@/actions/categories";
import { getSeoByPage } from "@/actions/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoByPage("blog");
  return {
    title: seo?.metaTitle ?? "Blog",
    description: seo?.metaDescription ?? undefined,
    keywords: seo?.keywords ?? undefined,
  };
}

interface Props {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}

export default async function BlogPage({ searchParams }: Props) {
  const { q, categoria } = await searchParams;
  const [posts, categories] = await Promise.all([
    getBlogPosts(true, { search: q, categorySlug: categoria }),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-10">
          <span className="text-[#7A5230] font-medium text-sm uppercase tracking-widest">
            Nuestro Blog
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1A1A1A] mt-3 mb-4 font-[var(--font-heading)]">
            Noticias y Novedades Fiscales
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Mantente informado sobre las últimas novedades en materia fiscal,
            contable y empresarial.
          </p>
        </AnimatedSection>

        {/* Search + Filters */}
        <AnimatedSection delay={0.1} className="mb-10">
          <BlogSearch categories={categories} currentSearch={q} currentCategory={categoria} />
        </AnimatedSection>

        {posts.length === 0 ? (
          <p className="text-center text-gray-400 py-20">
            {q || categoria ? "No se encontraron artículos con ese filtro." : "Próximamente publicaremos artículos de interés."}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <AnimatedSection key={post.id} delay={i * 0.07}>
                <BlogCard
                  {...post}
                  categories={post.categories}
                />
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

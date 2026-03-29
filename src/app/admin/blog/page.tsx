import Link from "next/link";
import { Plus, Pencil, Search, Tag } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBlogPosts } from "@/actions/blog";
import { getCategories } from "@/actions/categories";
import { DeleteBlogButton } from "./DeleteBlogButton";
import { BlogAdminFilters } from "./BlogAdminFilters";

interface Props {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}

export default async function BlogAdminPage({ searchParams }: Props) {
  const { q, categoria } = await searchParams;
  const [posts, categories] = await Promise.all([
    getBlogPosts(false, { search: q, categorySlug: categoria }),
    getCategories(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A] font-[var(--font-heading)]">Blog</h1>
          <p className="text-gray-500 mt-1">Gestione los artículos del blog</p>
        </div>
        <Button asChild className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white">
          <Link href="/admin/blog/nuevo"><Plus className="w-4 h-4 mr-2" />Nueva entrada</Link>
        </Button>
      </div>

      <BlogAdminFilters categories={categories} currentSearch={q} currentCategory={categoria} />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {posts.length === 0 ? (
          <p className="text-center text-gray-400 py-12 text-sm">No se encontraron artículos.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Artículo</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3 hidden md:table-cell">Autor</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3 hidden md:table-cell">Publicado</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Estado</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#1A1A1A] text-sm">{post.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">/blog/{post.slug}</p>
                    {post.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {post.categories.map(c => (
                          <span key={c.id} className="text-xs bg-[#C4A882]/15 text-[#7A5230] px-1.5 py-0.5 rounded">
                            {c.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{post.author ?? "—"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                    {post.publishedAt ? format(post.publishedAt, "dd/MM/yyyy", { locale: es }) : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={post.isPublished ? "default" : "secondary"}
                      className={post.isPublished ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
                      {post.isPublished ? "Publicado" : "Borrador"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/blog/${post.id}`}><Pencil className="w-4 h-4" /></Link>
                      </Button>
                      <DeleteBlogButton id={post.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

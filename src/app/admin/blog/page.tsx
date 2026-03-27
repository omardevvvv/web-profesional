import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBlogPosts } from "@/actions/blog";
import { DeleteBlogButton } from "./DeleteBlogButton";

export default async function BlogAdminPage() {
  const posts = await getBlogPosts(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628] font-[var(--font-heading)]">Blog</h1>
          <p className="text-gray-500 mt-1">Gestione los artículos del blog</p>
        </div>
        <Button asChild className="bg-[#0A1628] hover:bg-[#1A2A4A] text-white">
          <Link href="/admin/blog/nuevo"><Plus className="w-4 h-4 mr-2" />Nueva entrada</Link>
        </Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Artículo</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Autor</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Publicado</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Estado</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <p className="font-medium text-[#0A1628] text-sm">{post.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">/blog/{post.slug}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{post.author ?? "—"}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
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
      </div>
    </div>
  );
}

import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/actions/categories";
import { DeleteCategoryButton } from "./DeleteCategoryButton";

export default async function CategoriasAdminPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A] font-[var(--font-heading)]">Categorías</h1>
          <p className="text-gray-500 mt-1">Gestione las categorías del blog</p>
        </div>
        <Button asChild className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white">
          <Link href="/admin/blog/categorias/nueva"><Plus className="w-4 h-4 mr-2" />Nueva categoría</Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {categories.length === 0 ? (
          <p className="text-center text-gray-400 py-12 text-sm">No hay categorías todavía.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Categoría</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Slug</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Entradas</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 font-medium text-[#1A1A1A] text-sm">{cat.name}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs font-mono">{cat.slug}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{cat._count.posts}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/blog/categorias/${cat.id}`}><Pencil className="w-4 h-4" /></Link>
                      </Button>
                      <DeleteCategoryButton id={cat.id} postCount={cat._count.posts} />
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

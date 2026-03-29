"use client";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteCategory } from "@/actions/categories";
import { toast } from "sonner";

export function DeleteCategoryButton({ id, postCount }: { id: string; postCount: number }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (postCount > 0) {
      toast.error(`No se puede eliminar: tiene ${postCount} entrada(s) asociada(s).`);
      return;
    }
    if (!confirm("¿Eliminar esta categoría?")) return;
    setLoading(true);
    try {
      await deleteCategory(id);
      toast.success("Categoría eliminada");
    } catch {
      toast.error("Error al eliminar la categoría");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}

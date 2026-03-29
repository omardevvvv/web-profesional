"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCategoryById, updateCategory } from "@/actions/categories";

export default function EditarCategoriaPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<{ name: string }>();

  useEffect(() => {
    getCategoryById(id)
      .then((data) => {
        if (!data) { toast.error("Categoría no encontrada"); router.push("/admin/blog/categorias"); return; }
        reset({ name: data.name });
      })
      .catch(() => toast.error("Error al cargar la categoría"))
      .finally(() => setFetching(false));
  }, [id, reset, router]);

  const onSubmit = async (data: { name: string }) => {
    setLoading(true);
    try {
      await updateCategory(id, data);
      toast.success("Categoría actualizada");
      router.push("/admin/blog/categorias");
    } catch {
      toast.error("Error al actualizar la categoría");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-md">
      <div className="flex items-center gap-3 mb-8">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/blog/categorias"><ArrowLeft className="w-4 h-4" /></Link>
        </Button>
        <h1 className="text-2xl font-bold text-[#1A1A1A] font-[var(--font-heading)]">Editar Categoría</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl p-6 shadow-sm space-y-5">
        <div>
          <Label className="text-[#1A1A1A] font-medium">Nombre *</Label>
          <Input {...register("name", { required: "El nombre es obligatorio" })} className="mt-1.5" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <Button type="submit" disabled={loading} className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {loading ? "Guardando..." : "Guardar cambios"}
        </Button>
      </form>
    </div>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategory } from "@/actions/categories";

export default function NuevaCategoriaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<{ name: string }>();

  const onSubmit = async (data: { name: string }) => {
    setLoading(true);
    try {
      await createCategory(data);
      toast.success("Categoría creada correctamente");
      router.push("/admin/blog/categorias");
    } catch {
      toast.error("Error al crear la categoría");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md">
      <div className="flex items-center gap-3 mb-8">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/blog/categorias"><ArrowLeft className="w-4 h-4" /></Link>
        </Button>
        <h1 className="text-2xl font-bold text-[#1A1A1A] font-[var(--font-heading)]">Nueva Categoría</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl p-6 shadow-sm space-y-5">
        <div>
          <Label className="text-[#1A1A1A] font-medium">Nombre *</Label>
          <Input
            {...register("name", { required: "El nombre es obligatorio" })}
            placeholder="Ej: Novedades Fiscales"
            className="mt-1.5"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          <p className="text-xs text-gray-400 mt-1.5">El slug se genera automáticamente.</p>
        </div>
        <Button type="submit" disabled={loading} className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {loading ? "Creando..." : "Crear categoría"}
        </Button>
      </form>
    </div>
  );
}

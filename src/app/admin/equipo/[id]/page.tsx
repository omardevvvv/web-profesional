"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { getTeamMemberById, updateTeamMember } from "@/actions/team";

interface FormData { name: string; role: string; bio: string; email: string; linkedIn: string; order: number; }

export default function EditarMiembroPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [photoUrl, setPhotoUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    getTeamMemberById(id)
      .then((data) => {
        if (!data) { toast.error("Miembro no encontrado"); router.push("/admin/equipo"); return; }
        reset({
          name: data.name,
          role: data.role,
          bio: data.bio ?? "",
          email: data.email ?? "",
          linkedIn: data.linkedIn ?? "",
          order: data.order,
        });
        setPhotoUrl(data.photoUrl ?? "");
        setIsActive(data.isActive);
      })
      .catch(() => toast.error("Error al cargar el miembro"))
      .finally(() => setFetching(false));
  }, [id, reset, router]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await updateTeamMember(id, {
        name: data.name,
        role: data.role,
        bio: data.bio || undefined,
        email: data.email || undefined,
        linkedIn: data.linkedIn || undefined,
        order: data.order,
        photoUrl: photoUrl || undefined,
        isActive,
      });
      toast.success("Miembro actualizado correctamente");
      router.push("/admin/equipo");
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar. Inténtelo de nuevo.");
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
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Button asChild variant="ghost" size="sm"><Link href="/admin/equipo"><ArrowLeft className="w-4 h-4" /></Link></Button>
        <h1 className="text-2xl font-bold text-[#1A1A1A] font-[var(--font-heading)]">Editar Miembro</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white rounded-xl p-6 shadow-sm">
        <div>
          <Label className="text-[#1A1A1A] font-medium">Foto</Label>
          <ImageUpload value={photoUrl} onChange={setPhotoUrl} className="mt-1.5" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-[#1A1A1A] font-medium">Nombre *</Label>
            <Input {...register("name", { required: "El nombre es obligatorio" })} className="mt-1.5" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label className="text-[#1A1A1A] font-medium">Cargo *</Label>
            <Input {...register("role", { required: "El cargo es obligatorio" })} className="mt-1.5" />
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
          </div>
        </div>
        <div>
          <Label className="text-[#1A1A1A] font-medium">Biografía</Label>
          <Textarea {...register("bio")} rows={3} className="mt-1.5 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-[#1A1A1A] font-medium">Email</Label>
            <Input type="email" {...register("email")} className="mt-1.5" />
          </div>
          <div>
            <Label className="text-[#1A1A1A] font-medium">LinkedIn URL</Label>
            <Input {...register("linkedIn")} className="mt-1.5" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-[#1A1A1A] font-medium">Orden</Label>
            <Input type="number" {...register("order", { valueAsNumber: true })} className="mt-1.5" />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <Label>Activo</Label>
          </div>
        </div>
        <Button type="submit" disabled={loading} className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {loading ? "Guardando..." : "Guardar cambios"}
        </Button>
      </form>
    </div>
  );
}

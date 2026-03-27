"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
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
  const [photoUrl, setPhotoUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const { register, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    getTeamMemberById(id).then((data) => {
      if (data) {
        reset({ ...data, bio: data.bio ?? undefined, email: data.email ?? undefined, linkedIn: data.linkedIn ?? undefined });
        setPhotoUrl(data.photoUrl ?? ""); setIsActive(data.isActive);
      }
    });
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await updateTeamMember(id, { ...data, photoUrl, isActive });
      toast.success("Miembro actualizado");
      router.push("/admin/equipo");
    } catch { toast.error("Error al actualizar"); setLoading(false); }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Button asChild variant="ghost" size="sm"><Link href="/admin/equipo"><ArrowLeft className="w-4 h-4" /></Link></Button>
        <h1 className="text-2xl font-bold text-[#0A1628] font-[var(--font-heading)]">Editar Miembro</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white rounded-xl p-6 shadow-sm">
        <div>
          <Label className="text-[#0A1628] font-medium">Foto</Label>
          <ImageUpload value={photoUrl} onChange={setPhotoUrl} className="mt-1.5" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-[#0A1628] font-medium">Nombre *</Label>
            <Input {...register("name", { required: true })} className="mt-1.5" />
          </div>
          <div>
            <Label className="text-[#0A1628] font-medium">Cargo *</Label>
            <Input {...register("role", { required: true })} className="mt-1.5" />
          </div>
        </div>
        <div>
          <Label className="text-[#0A1628] font-medium">Biografía</Label>
          <Textarea {...register("bio")} rows={3} className="mt-1.5 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-[#0A1628] font-medium">Email</Label>
            <Input type="email" {...register("email")} className="mt-1.5" />
          </div>
          <div>
            <Label className="text-[#0A1628] font-medium">LinkedIn URL</Label>
            <Input {...register("linkedIn")} className="mt-1.5" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-[#0A1628] font-medium">Orden</Label>
            <Input type="number" {...register("order", { valueAsNumber: true })} className="mt-1.5" />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <Label>Activo</Label>
          </div>
        </div>
        <Button type="submit" disabled={loading} className="bg-[#0A1628] hover:bg-[#1A2A4A] text-white">
          <Save className="w-4 h-4 mr-2" />{loading ? "Guardando..." : "Guardar cambios"}
        </Button>
      </form>
    </div>
  );
}

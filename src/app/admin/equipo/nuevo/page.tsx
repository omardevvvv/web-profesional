"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { createTeamMember } from "@/actions/team";

interface FormData { name: string; role: string; bio: string; email: string; linkedIn: string; order: number; }

export default function NuevoMiembroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const { register, handleSubmit } = useForm<FormData>({ defaultValues: { order: 0 } });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await createTeamMember({ ...data, photoUrl });
      toast.success("Miembro creado correctamente");
      router.push("/admin/equipo");
    } catch { toast.error("Error al crear"); setLoading(false); }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Button asChild variant="ghost" size="sm"><Link href="/admin/equipo"><ArrowLeft className="w-4 h-4" /></Link></Button>
        <h1 className="text-2xl font-bold text-[#1A1A1A] font-[var(--font-heading)]">Nuevo Miembro del Equipo</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white rounded-xl p-6 shadow-sm">
        <div>
          <Label className="text-[#1A1A1A] font-medium">Foto</Label>
          <ImageUpload value={photoUrl} onChange={setPhotoUrl} className="mt-1.5" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-[#1A1A1A] font-medium">Nombre *</Label>
            <Input {...register("name", { required: true })} className="mt-1.5" />
          </div>
          <div>
            <Label className="text-[#1A1A1A] font-medium">Cargo *</Label>
            <Input {...register("role", { required: true })} placeholder="Contador Público" className="mt-1.5" />
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
            <Input {...register("linkedIn")} placeholder="https://linkedin.com/in/..." className="mt-1.5" />
          </div>
        </div>
        <div>
          <Label className="text-[#1A1A1A] font-medium">Orden</Label>
          <Input type="number" {...register("order", { valueAsNumber: true })} className="mt-1.5 w-24" />
        </div>
        <Button type="submit" disabled={loading} className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white">
          <Save className="w-4 h-4 mr-2" />{loading ? "Creando..." : "Crear miembro"}
        </Button>
      </form>
    </div>
  );
}

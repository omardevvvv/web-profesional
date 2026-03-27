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
import { getServiceById, updateService } from "@/actions/services";

const ICONS = ["BookOpen","FileText","Building2","Users","Search","TrendingUp","Briefcase","Calculator","Shield","Star","Clock","Globe"];

interface FormData {
  title: string;
  description: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export default function EditarServicioPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const { register, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    getServiceById(id).then((data) => {
      if (data) {
        reset({ ...data, icon: data.icon ?? undefined });
        setIsActive(data.isActive);
      }
    });
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await updateService(id, { ...data, isActive });
      toast.success("Servicio actualizado");
      router.push("/admin/servicios");
    } catch {
      toast.error("Error al actualizar");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/servicios"><ArrowLeft className="w-4 h-4" /></Link>
        </Button>
        <h1 className="text-2xl font-bold text-[#0A1628] font-[var(--font-heading)]">Editar Servicio</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white rounded-xl p-6 shadow-sm">
        <div>
          <Label className="text-[#0A1628] font-medium">Título *</Label>
          <Input {...register("title", { required: true })} className="mt-1.5" />
        </div>
        <div>
          <Label className="text-[#0A1628] font-medium">Descripción *</Label>
          <Textarea {...register("description", { required: true })} rows={4} className="mt-1.5 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-[#0A1628] font-medium">Icono</Label>
            <select {...register("icon")} className="mt-1.5 w-full border border-gray-200 rounded-md px-3 py-2 text-sm">
              {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <Label className="text-[#0A1628] font-medium">Orden</Label>
            <Input type="number" {...register("order", { valueAsNumber: true })} className="mt-1.5" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={isActive} onCheckedChange={setIsActive} />
          <Label className="text-[#0A1628]">Servicio activo (visible en web)</Label>
        </div>
        <Button type="submit" disabled={loading} className="bg-[#0A1628] hover:bg-[#1A2A4A] text-white">
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Guardando..." : "Guardar cambios"}
        </Button>
      </form>
    </div>
  );
}

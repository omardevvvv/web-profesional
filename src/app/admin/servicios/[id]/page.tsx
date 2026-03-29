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
import { getServiceById, updateService } from "@/actions/services";

const ICONS = ["BookOpen","FileText","Building2","Users","Search","TrendingUp","Briefcase","Calculator","Shield","Star","Clock","Globe"];

interface FormData { title: string; description: string; icon: string; order: number; }

export default function EditarServicioPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    getServiceById(id)
      .then((data) => {
        if (!data) { toast.error("Servicio no encontrado"); router.push("/admin/servicios"); return; }
        reset({ title: data.title, description: data.description, icon: data.icon ?? "Briefcase", order: data.order });
        setIsActive(data.isActive);
      })
      .catch(() => toast.error("Error al cargar el servicio"))
      .finally(() => setFetching(false));
  }, [id, reset, router]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await updateService(id, { ...data, isActive });
      toast.success("Servicio actualizado correctamente");
      router.push("/admin/servicios");
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
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/servicios"><ArrowLeft className="w-4 h-4" /></Link>
        </Button>
        <h1 className="text-2xl font-bold text-[#1A1A1A] font-[var(--font-heading)]">Editar Servicio</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white rounded-xl p-6 shadow-sm">
        <div>
          <Label className="text-[#1A1A1A] font-medium">Título *</Label>
          <Input {...register("title", { required: "El título es obligatorio" })} className="mt-1.5" />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <Label className="text-[#1A1A1A] font-medium">Descripción *</Label>
          <Textarea {...register("description", { required: "La descripción es obligatoria" })} rows={4} className="mt-1.5 resize-none" />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-[#1A1A1A] font-medium">Icono</Label>
            <select {...register("icon")} className="mt-1.5 w-full border border-gray-200 rounded-md px-3 py-2 text-sm">
              {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <Label className="text-[#1A1A1A] font-medium">Orden</Label>
            <Input type="number" {...register("order", { valueAsNumber: true })} className="mt-1.5" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={isActive} onCheckedChange={setIsActive} />
          <Label className="text-[#1A1A1A]">Servicio activo (visible en web)</Label>
        </div>
        <Button type="submit" disabled={loading} className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white">
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {loading ? "Guardando..." : "Guardar cambios"}
        </Button>
      </form>
    </div>
  );
}

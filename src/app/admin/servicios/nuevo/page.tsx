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
import { createService } from "@/actions/services";

const ICONS = ["BookOpen","FileText","Building2","Users","Search","TrendingUp","Briefcase","Calculator","Shield","Star","Clock","Globe"];

interface FormData {
  title: string;
  description: string;
  icon: string;
  order: number;
}

export default function NuevoServicioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<FormData>({ defaultValues: { order: 0, icon: "Briefcase" } });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await createService(data);
      toast.success("Servicio creado correctamente");
      router.push("/admin/servicios");
    } catch {
      toast.error("Error al crear el servicio");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/servicios"><ArrowLeft className="w-4 h-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A] font-[var(--font-heading)]">Nuevo Servicio</h1>
          <p className="text-gray-500 text-sm mt-0.5">Añadir un nuevo servicio a la web</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white rounded-xl p-6 shadow-sm">
        <div>
          <Label className="text-[#1A1A1A] font-medium">Título *</Label>
          <Input {...register("title", { required: true })} className="mt-1.5" />
        </div>
        <div>
          <Label className="text-[#1A1A1A] font-medium">Descripción *</Label>
          <Textarea {...register("description", { required: true })} rows={4} className="mt-1.5 resize-none" />
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
        <Button type="submit" disabled={loading} className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white">
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Creando..." : "Crear servicio"}
        </Button>
      </form>
    </div>
  );
}

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
import { getFaqById, updateFaq } from "@/actions/faq";

interface FormData { question: string; answer: string; order: number; }

export default function EditarFaqPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const { register, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    getFaqById(id).then((data) => {
      if (data) { reset(data); setIsActive(data.isActive); }
    });
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try { await updateFaq(id, { ...data, isActive }); toast.success("Actualizada"); router.push("/admin/faq"); }
    catch { toast.error("Error al actualizar"); setLoading(false); }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Button asChild variant="ghost" size="sm"><Link href="/admin/faq"><ArrowLeft className="w-4 h-4" /></Link></Button>
        <h1 className="text-2xl font-bold text-[#0A1628] font-[var(--font-heading)]">Editar Pregunta FAQ</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white rounded-xl p-6 shadow-sm">
        <div>
          <Label className="text-[#0A1628] font-medium">Pregunta *</Label>
          <Input {...register("question", { required: true })} className="mt-1.5" />
        </div>
        <div>
          <Label className="text-[#0A1628] font-medium">Respuesta *</Label>
          <Textarea {...register("answer", { required: true })} rows={5} className="mt-1.5 resize-none" />
        </div>
        <div className="grid grid-cols-2 gap-4 items-end">
          <div>
            <Label className="text-[#0A1628] font-medium">Orden</Label>
            <Input type="number" {...register("order", { valueAsNumber: true })} className="mt-1.5" />
          </div>
          <div className="flex items-center gap-3 pb-1">
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

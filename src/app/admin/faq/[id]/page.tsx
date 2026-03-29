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
import { getFaqById, updateFaq } from "@/actions/faq";

interface FormData { question: string; answer: string; order: number; }

export default function EditarFaqPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    getFaqById(id)
      .then((data) => {
        if (!data) { toast.error("Pregunta no encontrada"); router.push("/admin/faq"); return; }
        reset({ question: data.question, answer: data.answer, order: data.order });
        setIsActive(data.isActive);
      })
      .catch(() => toast.error("Error al cargar la pregunta"))
      .finally(() => setFetching(false));
  }, [id, reset, router]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await updateFaq(id, { ...data, isActive });
      toast.success("Pregunta actualizada correctamente");
      router.push("/admin/faq");
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
        <Button asChild variant="ghost" size="sm"><Link href="/admin/faq"><ArrowLeft className="w-4 h-4" /></Link></Button>
        <h1 className="text-2xl font-bold text-[#1A1A1A] font-[var(--font-heading)]">Editar Pregunta FAQ</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white rounded-xl p-6 shadow-sm">
        <div>
          <Label className="text-[#1A1A1A] font-medium">Pregunta *</Label>
          <Input {...register("question", { required: "La pregunta es obligatoria" })} className="mt-1.5" />
          {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question.message}</p>}
        </div>
        <div>
          <Label className="text-[#1A1A1A] font-medium">Respuesta *</Label>
          <Textarea {...register("answer", { required: "La respuesta es obligatoria" })} rows={5} className="mt-1.5 resize-none" />
          {errors.answer && <p className="text-red-500 text-xs mt-1">{errors.answer.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4 items-end">
          <div>
            <Label className="text-[#1A1A1A] font-medium">Orden</Label>
            <Input type="number" {...register("order", { valueAsNumber: true })} className="mt-1.5" />
          </div>
          <div className="flex items-center gap-3 pb-1">
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

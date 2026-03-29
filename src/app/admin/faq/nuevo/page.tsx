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
import { createFaq } from "@/actions/faq";

interface FormData { question: string; answer: string; order: number; }

export default function NuevaFaqPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm<FormData>({ defaultValues: { order: 0 } });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try { await createFaq(data); toast.success("Pregunta creada"); router.push("/admin/faq"); }
    catch { toast.error("Error al crear"); setLoading(false); }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Button asChild variant="ghost" size="sm"><Link href="/admin/faq"><ArrowLeft className="w-4 h-4" /></Link></Button>
        <h1 className="text-2xl font-bold text-[#1A1A1A] font-[var(--font-heading)]">Nueva Pregunta FAQ</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white rounded-xl p-6 shadow-sm">
        <div>
          <Label className="text-[#1A1A1A] font-medium">Pregunta *</Label>
          <Input {...register("question", { required: true })} className="mt-1.5" />
        </div>
        <div>
          <Label className="text-[#1A1A1A] font-medium">Respuesta *</Label>
          <Textarea {...register("answer", { required: true })} rows={5} className="mt-1.5 resize-none" />
        </div>
        <div>
          <Label className="text-[#1A1A1A] font-medium">Orden</Label>
          <Input type="number" {...register("order", { valueAsNumber: true })} className="mt-1.5 w-24" />
        </div>
        <Button type="submit" disabled={loading} className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white">
          <Save className="w-4 h-4 mr-2" />{loading ? "Creando..." : "Crear pregunta"}
        </Button>
      </form>
    </div>
  );
}

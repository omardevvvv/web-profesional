"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { getHeroContent, updateHeroContent } from "@/actions/hero";

interface FormData {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
}

export default function HeroAdminPage() {
  const [loading, setLoading] = useState(false);
  const [bgImage, setBgImage] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    getHeroContent().then((data) => {
      if (data) {
        reset({ ...data, backgroundImage: data.backgroundImage ?? undefined });
        setBgImage(data.backgroundImage ?? "");
      }
    });
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await updateHeroContent({ ...data, backgroundImage: bgImage });
      toast.success("Hero actualizado correctamente");
    } catch {
      toast.error("Error al guardar los cambios");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A] font-[var(--font-heading)]">
          Editar Hero
        </h1>
        <p className="text-gray-500 mt-1">Sección principal de la landing page</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-xl p-6 shadow-sm">
        <div>
          <Label className="text-[#1A1A1A] font-medium">Título principal *</Label>
          <Input {...register("title", { required: true })} className="mt-1.5" />
        </div>

        <div>
          <Label className="text-[#1A1A1A] font-medium">Subtítulo / Tagline *</Label>
          <Textarea {...register("subtitle", { required: true })} rows={3} className="mt-1.5 resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-[#1A1A1A] font-medium">Texto del botón *</Label>
            <Input {...register("ctaText", { required: true })} className="mt-1.5" />
          </div>
          <div>
            <Label className="text-[#1A1A1A] font-medium">Enlace del botón *</Label>
            <Input {...register("ctaLink", { required: true })} placeholder="#contacto" className="mt-1.5" />
          </div>
        </div>

        <div>
          <Label className="text-[#1A1A1A] font-medium">Imagen de fondo (opcional)</Label>
          <ImageUpload value={bgImage} onChange={setBgImage} className="mt-1.5" />
        </div>

        <Button type="submit" disabled={loading} className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white">
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Guardando..." : "Guardar cambios"}
        </Button>
      </form>
    </div>
  );
}

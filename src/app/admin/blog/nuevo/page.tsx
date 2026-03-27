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
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { createBlogPost } from "@/actions/blog";

interface FormData { title: string; excerpt: string; author: string; tags: string; }

export default function NuevoBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await createBlogPost({
        ...data,
        content,
        coverImage,
        isPublished,
        tags: data.tags ? data.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      });
      toast.success("Artículo creado correctamente");
      router.push("/admin/blog");
    } catch { toast.error("Error al crear el artículo"); setLoading(false); }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Button asChild variant="ghost" size="sm"><Link href="/admin/blog"><ArrowLeft className="w-4 h-4" /></Link></Button>
        <h1 className="text-2xl font-bold text-[#0A1628] font-[var(--font-heading)]">Nueva Entrada de Blog</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-5">
          <div>
            <Label className="text-[#0A1628] font-medium">Título *</Label>
            <Input {...register("title", { required: true })} placeholder="Título del artículo" className="mt-1.5" />
          </div>
          <div>
            <Label className="text-[#0A1628] font-medium">Extracto</Label>
            <Textarea {...register("excerpt")} rows={2} placeholder="Breve descripción..." className="mt-1.5 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[#0A1628] font-medium">Autor</Label>
              <Input {...register("author")} placeholder="Nombre del autor" className="mt-1.5" />
            </div>
            <div>
              <Label className="text-[#0A1628] font-medium">Etiquetas (separadas por coma)</Label>
              <Input {...register("tags")} placeholder="fiscal, novedades, IRPF" className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label className="text-[#0A1628] font-medium">Imagen de portada</Label>
            <ImageUpload value={coverImage} onChange={setCoverImage} className="mt-1.5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <Label className="text-[#0A1628] font-medium block mb-3">Contenido *</Label>
          <RichTextEditor value={content} onChange={setContent} placeholder="Escriba el artículo aquí..." />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            <Label>Publicar inmediatamente</Label>
          </div>
          <Button type="submit" disabled={loading} className="bg-[#0A1628] hover:bg-[#1A2A4A] text-white">
            <Save className="w-4 h-4 mr-2" />{loading ? "Creando..." : "Crear artículo"}
          </Button>
        </div>
      </form>
    </div>
  );
}

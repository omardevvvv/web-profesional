"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, Save, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { getBlogPostById, updateBlogPost } from "@/actions/blog";

interface FormData { title: string; excerpt: string; author: string; tags: string; }

export default function EditarBlogPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [slug, setSlug] = useState("");
  const { register, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    getBlogPostById(id).then((data) => {
      if (data) {
        reset({ title: data.title, excerpt: data.excerpt ?? "", author: data.author ?? "", tags: data.tags.join(", ") });
        setContent(data.content);
        setCoverImage(data.coverImage ?? "");
        setIsPublished(data.isPublished);
        setSlug(data.slug);
      }
    });
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await updateBlogPost(id, {
        ...data,
        content,
        coverImage,
        isPublished,
        tags: data.tags ? data.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      });
      toast.success("Artículo actualizado");
      router.push("/admin/blog");
    } catch { toast.error("Error al actualizar"); setLoading(false); }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Button asChild variant="ghost" size="sm"><Link href="/admin/blog"><ArrowLeft className="w-4 h-4" /></Link></Button>
        <div className="flex items-center gap-3 flex-1">
          <h1 className="text-2xl font-bold text-[#0A1628] font-[var(--font-heading)]">Editar Artículo</h1>
          {slug && (
            <Link href={`/blog/${slug}`} target="_blank" className="text-[#D4A843] hover:underline text-sm flex items-center gap-1">
              Ver <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-5">
          <div>
            <Label className="text-[#0A1628] font-medium">Título *</Label>
            <Input {...register("title", { required: true })} className="mt-1.5" />
          </div>
          <div>
            <Label className="text-[#0A1628] font-medium">Extracto</Label>
            <Textarea {...register("excerpt")} rows={2} className="mt-1.5 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[#0A1628] font-medium">Autor</Label>
              <Input {...register("author")} className="mt-1.5" />
            </div>
            <div>
              <Label className="text-[#0A1628] font-medium">Etiquetas</Label>
              <Input {...register("tags")} className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label className="text-[#0A1628] font-medium">Imagen de portada</Label>
            <ImageUpload value={coverImage} onChange={setCoverImage} className="mt-1.5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <Label className="text-[#0A1628] font-medium block mb-3">Contenido *</Label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            <Label>{isPublished ? "Publicado" : "Borrador"}</Label>
          </div>
          <Button type="submit" disabled={loading} className="bg-[#0A1628] hover:bg-[#1A2A4A] text-white">
            <Save className="w-4 h-4 mr-2" />{loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}

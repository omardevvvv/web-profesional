"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, Save, ExternalLink, Paperclip, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { getBlogPostById, updateBlogPost } from "@/actions/blog";
import { getCategories } from "@/actions/categories";

interface FormData { title: string; excerpt: string; author: string; tags: string; }
interface Attachment { id?: string; name: string; url: string; publicId?: string; mimeType?: string; }
interface Category { id: string; name: string; }

export default function EditarBlogPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [slug, setSlug] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [removedAttachmentIds, setRemovedAttachmentIds] = useState<string[]>([]);
  const [newAttachments, setNewAttachments] = useState<Attachment[]>([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    Promise.all([getBlogPostById(id), getCategories()])
      .then(([data, cats]) => {
        if (!data) { toast.error("Artículo no encontrado"); router.push("/admin/blog"); return; }
        reset({
          title: data.title,
          excerpt: data.excerpt ?? "",
          author: data.author ?? "",
          tags: data.tags.join(", "),
        });
        setContent(data.content);
        setCoverImage(data.coverImage ?? "");
        setIsPublished(data.isPublished);
        setSlug(data.slug);
        setCategories(cats);
        setSelectedCategoryIds(data.categories.map((c: { id: string }) => c.id));
        setAttachments(data.attachments.map(a => ({
          id: a.id,
          name: a.name,
          url: a.url,
          publicId: a.publicId ?? undefined,
          mimeType: a.mimeType ?? undefined,
        })));
      })
      .catch(() => toast.error("Error al cargar el artículo"))
      .finally(() => setFetching(false));
  }, [id, reset, router]);

  const toggleCategory = (catId: string) => {
    setSelectedCategoryIds(prev =>
      prev.includes(catId) ? prev.filter(x => x !== catId) : [...prev, catId]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    try {
      const res = await fetch(
        `/api/upload?filename=${encodeURIComponent(file.name)}&resourceType=auto`,
        { method: "POST", body: file }
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setNewAttachments(prev => [...prev, {
        name: file.name,
        url: data.url,
        publicId: data.publicId,
        mimeType: file.type,
      }]);
      toast.success("Archivo adjuntado correctamente");
    } catch {
      toast.error("Error al subir el archivo");
    } finally {
      setUploadingFile(false);
      e.target.value = "";
    }
  };

  const removeExistingAttachment = (attId: string) => {
    setAttachments(prev => prev.filter(a => a.id !== attId));
    setRemovedAttachmentIds(prev => [...prev, attId]);
  };

  const removeNewAttachment = (url: string) => {
    setNewAttachments(prev => prev.filter(a => a.url !== url));
  };

  const onSubmit = async (data: FormData) => {
    if (!content.trim()) { toast.error("El contenido no puede estar vacío"); return; }
    setLoading(true);
    try {
      await updateBlogPost(id, {
        title: data.title,
        excerpt: data.excerpt || undefined,
        author: data.author || undefined,
        content,
        coverImage: coverImage || undefined,
        isPublished,
        tags: data.tags ? data.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        categoryIds: selectedCategoryIds,
        attachmentsToAdd: newAttachments,
        attachmentIdsToRemove: removedAttachmentIds,
      });
      toast.success("Artículo actualizado correctamente");
      router.push("/admin/blog");
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar el artículo. Inténtelo de nuevo.");
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
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Button asChild variant="ghost" size="sm"><Link href="/admin/blog"><ArrowLeft className="w-4 h-4" /></Link></Button>
        <div className="flex items-center gap-3 flex-1">
          <h1 className="text-2xl font-bold text-[#1A1A1A] font-[var(--font-heading)]">Editar Artículo</h1>
          {slug && (
            <Link href={`/blog/${slug}`} target="_blank" className="text-[#7A5230] hover:underline text-sm flex items-center gap-1">
              Ver <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-5">
          <div>
            <Label className="text-[#1A1A1A] font-medium">Título *</Label>
            <Input {...register("title", { required: "El título es obligatorio" })} className="mt-1.5" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <Label className="text-[#1A1A1A] font-medium">Extracto</Label>
            <Textarea {...register("excerpt")} rows={2} className="mt-1.5 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[#1A1A1A] font-medium">Autor</Label>
              <Input {...register("author")} className="mt-1.5" />
            </div>
            <div>
              <Label className="text-[#1A1A1A] font-medium">Etiquetas (separadas por coma)</Label>
              <Input {...register("tags")} className="mt-1.5" />
            </div>
          </div>

          {categories.length > 0 && (
            <div>
              <Label className="text-[#1A1A1A] font-medium">Categorías</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      selectedCategoryIds.includes(cat.id)
                        ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label className="text-[#1A1A1A] font-medium">Imagen de portada</Label>
            <ImageUpload value={coverImage} onChange={setCoverImage} className="mt-1.5" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <Label className="text-[#1A1A1A] font-medium block mb-3">Contenido *</Label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        {/* Adjuntos */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <Label className="text-[#1A1A1A] font-medium block mb-3">Archivos adjuntos</Label>
          {[...attachments, ...newAttachments].length > 0 && (
            <ul className="space-y-2 mb-3">
              {attachments.map(att => (
                <li key={att.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                  <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#7A5230] hover:underline truncate max-w-xs">
                    {att.name}
                  </a>
                  <button type="button" onClick={() => removeExistingAttachment(att.id!)} className="text-red-400 hover:text-red-600 ml-2">
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
              {newAttachments.map(att => (
                <li key={att.url} className="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2">
                  <span className="text-sm text-gray-700 truncate max-w-xs">{att.name} <span className="text-xs text-blue-500">(nuevo)</span></span>
                  <button type="button" onClick={() => removeNewAttachment(att.url)} className="text-red-400 hover:text-red-600 ml-2">
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.zip" onChange={handleFileUpload} className="hidden" disabled={uploadingFile} />
            <Button type="button" variant="outline" size="sm" disabled={uploadingFile} asChild>
              <span>
                {uploadingFile ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Paperclip className="w-4 h-4 mr-1.5" />}
                {uploadingFile ? "Subiendo..." : "Adjuntar archivo"}
              </span>
            </Button>
          </label>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            <Label>{isPublished ? "Publicado" : "Borrador"}</Label>
          </div>
          <Button type="submit" disabled={loading} className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}

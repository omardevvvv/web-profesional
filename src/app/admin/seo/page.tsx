"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSeoSettings, updateSeoSetting } from "@/actions/seo";

interface FormData { metaTitle: string; metaDescription: string; keywords: string; }

function SeoForm({ pageName, defaultValues }: { pageName: string; defaultValues: FormData }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormData>({ defaultValues });

  useEffect(() => { reset(defaultValues); }, [defaultValues, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try { await updateSeoSetting(pageName, data); toast.success("SEO actualizado"); }
    catch { toast.error("Error al guardar"); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white rounded-xl p-6 shadow-sm">
      <div>
        <Label className="text-[#1A1A1A] font-medium">Meta título</Label>
        <Input {...register("metaTitle")} placeholder="Título de la página (50-60 caracteres)" className="mt-1.5" />
        <p className="text-xs text-gray-400 mt-1">Aparece en la pestaña del navegador y en Google</p>
      </div>
      <div>
        <Label className="text-[#1A1A1A] font-medium">Meta descripción</Label>
        <Textarea {...register("metaDescription")} rows={3} placeholder="Descripción breve (120-160 caracteres)" className="mt-1.5 resize-none" />
        <p className="text-xs text-gray-400 mt-1">Aparece en los resultados de búsqueda de Google</p>
      </div>
      <div>
        <Label className="text-[#1A1A1A] font-medium">Palabras clave</Label>
        <Input {...register("keywords")} placeholder="asesoría fiscal, contabilidad, Madrid" className="mt-1.5" />
        <p className="text-xs text-gray-400 mt-1">Separadas por coma</p>
      </div>
      <Button type="submit" disabled={loading} className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white">
        <Save className="w-4 h-4 mr-2" />{loading ? "Guardando..." : "Guardar SEO"}
      </Button>
    </form>
  );
}

export default function SeoAdminPage() {
  const [settings, setSettings] = useState<Record<string, FormData>>({});

  useEffect(() => {
    getSeoSettings().then((data) => {
      const map: Record<string, FormData> = {};
      for (const s of data) {
        map[s.pageName] = {
          metaTitle: s.metaTitle ?? "",
          metaDescription: s.metaDescription ?? "",
          keywords: s.keywords ?? "",
        };
      }
      setSettings(map);
    });
  }, []);

  const empty: FormData = { metaTitle: "", metaDescription: "", keywords: "" };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A] font-[var(--font-heading)]">SEO</h1>
        <p className="text-gray-500 mt-1">Configure los metadatos de cada página</p>
      </div>

      <Tabs defaultValue="home">
        <TabsList className="mb-6 bg-white shadow-sm">
          <TabsTrigger value="home">Inicio</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="contacto">Contacto</TabsTrigger>
        </TabsList>
        <TabsContent value="home">
          <SeoForm pageName="home" defaultValues={settings["home"] ?? empty} />
        </TabsContent>
        <TabsContent value="blog">
          <SeoForm pageName="blog" defaultValues={settings["blog"] ?? empty} />
        </TabsContent>
        <TabsContent value="contacto">
          <SeoForm pageName="contacto" defaultValues={settings["contacto"] ?? empty} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

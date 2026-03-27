"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Save, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getContactInfo, updateContactInfo } from "@/actions/contact";

interface FormData {
  phone: string; email: string; address: string;
  mapEmbedUrl: string; schedule: string;
  facebook: string; instagram: string; linkedIn: string;
}

export default function ContactoAdminPage() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    getContactInfo().then((data) => {
      if (data) reset({
        phone: data.phone ?? undefined,
        email: data.email ?? undefined,
        address: data.address ?? undefined,
        mapEmbedUrl: data.mapEmbedUrl ?? undefined,
        schedule: data.schedule ?? undefined,
        facebook: data.facebook ?? undefined,
        instagram: data.instagram ?? undefined,
        linkedIn: data.linkedIn ?? undefined,
      });
    });
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try { await updateContactInfo(data); toast.success("Información de contacto actualizada"); }
    catch { toast.error("Error al guardar"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628] font-[var(--font-heading)]">Contacto</h1>
          <p className="text-gray-500 mt-1">Gestione la información de contacto</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/contacto/mensajes"><MessageSquare className="w-4 h-4 mr-2" />Ver mensajes</Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-[#0A1628] font-medium">Teléfono</Label>
            <Input {...register("phone")} placeholder="+34 91 123 45 67" className="mt-1.5" />
          </div>
          <div>
            <Label className="text-[#0A1628] font-medium">Email</Label>
            <Input type="email" {...register("email")} placeholder="info@despacho.com" className="mt-1.5" />
          </div>
        </div>
        <div>
          <Label className="text-[#0A1628] font-medium">Dirección</Label>
          <Textarea {...register("address")} rows={2} className="mt-1.5 resize-none" />
        </div>
        <div>
          <Label className="text-[#0A1628] font-medium">Horario de atención</Label>
          <Textarea {...register("schedule")} rows={3} placeholder="Lunes a Viernes: 9:00 - 18:00" className="mt-1.5 resize-none" />
        </div>
        <div>
          <Label className="text-[#0A1628] font-medium">URL de Google Maps (iframe embed)</Label>
          <Input {...register("mapEmbedUrl")} placeholder="https://www.google.com/maps/embed?..." className="mt-1.5" />
        </div>
        <div className="border-t pt-5">
          <p className="text-sm font-semibold text-[#0A1628] mb-4">Redes Sociales</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-[#0A1628] font-medium text-xs">Facebook</Label>
              <Input {...register("facebook")} placeholder="https://..." className="mt-1.5" />
            </div>
            <div>
              <Label className="text-[#0A1628] font-medium text-xs">Instagram</Label>
              <Input {...register("instagram")} placeholder="https://..." className="mt-1.5" />
            </div>
            <div>
              <Label className="text-[#0A1628] font-medium text-xs">LinkedIn</Label>
              <Input {...register("linkedIn")} placeholder="https://..." className="mt-1.5" />
            </div>
          </div>
        </div>
        <Button type="submit" disabled={loading} className="bg-[#0A1628] hover:bg-[#1A2A4A] text-white">
          <Save className="w-4 h-4 mr-2" />{loading ? "Guardando..." : "Guardar cambios"}
        </Button>
      </form>
    </div>
  );
}

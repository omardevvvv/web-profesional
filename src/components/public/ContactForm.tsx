"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitContactForm } from "@/actions/contact";

const schema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await submitContactForm(data);
      toast.success("Mensaje enviado correctamente. Nos pondremos en contacto pronto.");
      reset();
    } catch {
      toast.error("Error al enviar el mensaje. Por favor, inténtelo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="name" className="text-[#0A1628] font-medium text-sm">
            Nombre *
          </Label>
          <Input
            id="name"
            placeholder="Su nombre completo"
            {...register("name")}
            className="mt-1.5 border-gray-200 focus:border-[#D4A843] focus:ring-[#D4A843]/20"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="text-[#0A1628] font-medium text-sm">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="su@email.com"
            {...register("email")}
            className="mt-1.5 border-gray-200 focus:border-[#D4A843] focus:ring-[#D4A843]/20"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <Label htmlFor="phone" className="text-[#0A1628] font-medium text-sm">
            Teléfono
          </Label>
          <Input
            id="phone"
            placeholder="+34 600 000 000"
            {...register("phone")}
            className="mt-1.5 border-gray-200 focus:border-[#D4A843] focus:ring-[#D4A843]/20"
          />
        </div>

        <div>
          <Label htmlFor="subject" className="text-[#0A1628] font-medium text-sm">
            Asunto
          </Label>
          <Input
            id="subject"
            placeholder="¿En qué podemos ayudarle?"
            {...register("subject")}
            className="mt-1.5 border-gray-200 focus:border-[#D4A843] focus:ring-[#D4A843]/20"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="message" className="text-[#0A1628] font-medium text-sm">
          Mensaje *
        </Label>
        <Textarea
          id="message"
          placeholder="Describa su consulta..."
          rows={5}
          {...register("message")}
          className="mt-1.5 border-gray-200 focus:border-[#D4A843] focus:ring-[#D4A843]/20 resize-none"
        />
        {errors.message && (
          <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        size="lg"
        className="w-full bg-[#0A1628] hover:bg-[#1A2A4A] text-white font-semibold h-12"
      >
        {loading ? (
          "Enviando..."
        ) : (
          <>
            Enviar Mensaje
            <Send className="ml-2 w-4 h-4" />
          </>
        )}
      </Button>
    </form>
  );
}

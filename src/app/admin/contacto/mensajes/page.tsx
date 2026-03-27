import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Mail, MailOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getContactSubmissions } from "@/actions/contact";
import { MarkReadButton } from "./MarkReadButton";

export default async function MensajesPage() {
  const submissions = await getContactSubmissions();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A1628] font-[var(--font-heading)]">Mensajes de Contacto</h1>
        <p className="text-gray-500 mt-1">{submissions.filter(s => !s.isRead).length} mensajes sin leer</p>
      </div>

      <div className="space-y-4">
        {submissions.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center text-gray-400">
            <Mail className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No hay mensajes todavía</p>
          </div>
        )}
        {submissions.map((msg) => (
          <div key={msg.id}
            className={`bg-white rounded-xl p-6 shadow-sm border-l-4 ${msg.isRead ? "border-gray-100" : "border-[#D4A843]"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${msg.isRead ? "bg-gray-100" : "bg-[#D4A843]/10"}`}>
                  {msg.isRead
                    ? <MailOpen className="w-4 h-4 text-gray-400" />
                    : <Mail className="w-4 h-4 text-[#D4A843]" />
                  }
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-[#0A1628] text-sm">{msg.name}</p>
                    {!msg.isRead && (
                      <Badge className="bg-[#D4A843]/10 text-[#D4A843] hover:bg-[#D4A843]/10 text-xs px-2 py-0">Nuevo</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-400 mb-3">
                    <span>{msg.email}</span>
                    {msg.phone && <span>{msg.phone}</span>}
                    {msg.subject && <span className="font-medium text-gray-500">Asunto: {msg.subject}</span>}
                    <span>{format(msg.createdAt, "d MMM yyyy, HH:mm", { locale: es })}</span>
                  </div>
                  <p className="text-gray-600 text-sm whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
              {!msg.isRead && <MarkReadButton id={msg.id} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

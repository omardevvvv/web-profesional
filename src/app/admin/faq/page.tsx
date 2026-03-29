import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getFaqItems } from "@/actions/faq";
import { DeleteFaqButton } from "./DeleteFaqButton";

export default async function FaqAdminPage() {
  const items = await getFaqItems(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A] font-[var(--font-heading)]">FAQ</h1>
          <p className="text-gray-500 mt-1">Gestione las preguntas frecuentes</p>
        </div>
        <Button asChild className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white">
          <Link href="/admin/faq/nuevo"><Plus className="w-4 h-4 mr-2" />Nueva pregunta</Link>
        </Button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Pregunta</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Orden</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Estado</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <p className="font-medium text-[#1A1A1A] text-sm">{item.question}</p>
                  <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{item.answer}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.order}</td>
                <td className="px-6 py-4">
                  <Badge variant={item.isActive ? "default" : "secondary"}
                    className={item.isActive ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
                    {item.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/faq/${item.id}`}><Pencil className="w-4 h-4" /></Link>
                    </Button>
                    <DeleteFaqButton id={item.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

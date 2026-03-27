import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getServices } from "@/actions/services";
import { DeleteButton } from "./DeleteButton";

export default async function ServiciosAdminPage() {
  const services: Awaited<ReturnType<typeof getServices>> = await getServices(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628] font-[var(--font-heading)]">
            Servicios
          </h1>
          <p className="text-gray-500 mt-1">Gestione los servicios del despacho</p>
        </div>
        <Button asChild className="bg-[#0A1628] hover:bg-[#1A2A4A] text-white">
          <Link href="/admin/servicios/nuevo">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo servicio
          </Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Servicio</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Orden</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Estado</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium text-[#0A1628] text-sm">{service.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{service.description}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{service.order}</td>
                <td className="px-6 py-4">
                  <Badge variant={service.isActive ? "default" : "secondary"}
                    className={service.isActive ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
                    {service.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/servicios/${service.id}`}>
                        <Pencil className="w-4 h-4" />
                      </Link>
                    </Button>
                    <DeleteButton id={service.id} />
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

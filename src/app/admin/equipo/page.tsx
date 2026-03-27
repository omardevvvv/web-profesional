import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTeamMembers } from "@/actions/team";
import { DeleteTeamButton } from "./DeleteTeamButton";

export default async function EquipoAdminPage() {
  const members = await getTeamMembers(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628] font-[var(--font-heading)]">Equipo</h1>
          <p className="text-gray-500 mt-1">Gestione los miembros del equipo</p>
        </div>
        <Button asChild className="bg-[#0A1628] hover:bg-[#1A2A4A] text-white">
          <Link href="/admin/equipo/nuevo"><Plus className="w-4 h-4 mr-2" />Nuevo miembro</Link>
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Miembro</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Cargo</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Estado</th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#0A1628] flex items-center justify-center overflow-hidden shrink-0">
                      {member.photoUrl ? (
                        <Image src={member.photoUrl} alt={member.name} width={36} height={36} className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-[#D4A843] text-sm font-bold">{member.name.charAt(0)}</span>
                      )}
                    </div>
                    <p className="font-medium text-[#0A1628] text-sm">{member.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{member.role}</td>
                <td className="px-6 py-4">
                  <Badge variant={member.isActive ? "default" : "secondary"}
                    className={member.isActive ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
                    {member.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/equipo/${member.id}`}><Pencil className="w-4 h-4" /></Link>
                    </Button>
                    <DeleteTeamButton id={member.id} />
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

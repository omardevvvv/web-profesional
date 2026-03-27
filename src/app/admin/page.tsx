import { prisma } from "@/lib/prisma";
import { FileText, Mail, Users, Briefcase } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboard() {
  const [posts, submissions, services, team] = await Promise.all([
    prisma.blogPost.count(),
    prisma.contactSubmission.count({ where: { isRead: false } }),
    prisma.service.count(),
    prisma.teamMember.count(),
  ]);

  const stats = [
    { label: "Entradas de blog", value: posts, icon: FileText, color: "text-blue-600" },
    { label: "Mensajes sin leer", value: submissions, icon: Mail, color: "text-amber-600" },
    { label: "Servicios activos", value: services, icon: Briefcase, color: "text-green-600" },
    { label: "Miembros del equipo", value: team, icon: Users, color: "text-purple-600" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0A1628] font-[var(--font-heading)]">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1">Resumen del estado de su sitio web</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.label}
                </CardTitle>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-[#0A1628]">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#0A1628]">
            Guía de uso del panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>→ <strong>Hero:</strong> Edite el título, subtítulo y botón principal de la página de inicio.</li>
            <li>→ <strong>Servicios:</strong> Añada, edite o elimine los servicios que aparecen en la landing.</li>
            <li>→ <strong>Equipo:</strong> Gestione los miembros del equipo con fotos y perfiles.</li>
            <li>→ <strong>FAQ:</strong> Actualice las preguntas frecuentes que se muestran en la web.</li>
            <li>→ <strong>Blog:</strong> Publique artículos con el editor de texto enriquecido.</li>
            <li>→ <strong>Contacto:</strong> Actualice datos de contacto y vea los mensajes recibidos.</li>
            <li>→ <strong>SEO:</strong> Configure los metadatos de cada página para buscadores.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

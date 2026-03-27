"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Image,
  Briefcase,
  Users,
  HelpCircle,
  FileText,
  Mail,
  Search,
  LogOut,
  Building2,
  MessageSquare,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems: { label: string; href: string; icon: LucideIcon; submenu?: { label: string; href: string }[] }[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Hero", href: "/admin/hero", icon: Image },
  {
    label: "Servicios", href: "/admin/servicios", icon: Briefcase,
    submenu: [{ label: "Nuevo servicio", href: "/admin/servicios/nuevo" }],
  },
  {
    label: "Equipo", href: "/admin/equipo", icon: Users,
    submenu: [{ label: "Nuevo miembro", href: "/admin/equipo/nuevo" }],
  },
  {
    label: "FAQ", href: "/admin/faq", icon: HelpCircle,
    submenu: [{ label: "Nueva pregunta", href: "/admin/faq/nuevo" }],
  },
  {
    label: "Blog", href: "/admin/blog", icon: FileText,
    submenu: [{ label: "Nueva entrada", href: "/admin/blog/nuevo" }],
  },
  {
    label: "Contacto", href: "/admin/contacto", icon: Mail,
    submenu: [{ label: "Mensajes", href: "/admin/contacto/mensajes" }],
  },
  { label: "SEO", href: "/admin/seo", icon: Search },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0A1628] h-screen flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#D4A843] rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-[#0A1628]" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">
              Panel Admin
            </p>
            <p className="text-white/40 text-xs">Despacho Contable</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#D4A843] text-[#0A1628]"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
              {item.submenu && isActive && (
                <div className="ml-7 mt-1 space-y-1">
                  {item.submenu.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className={cn(
                        "block px-3 py-1.5 rounded text-xs transition-colors",
                        pathname === sub.href
                          ? "text-[#D4A843]"
                          : "text-white/50 hover:text-white"
                      )}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full justify-start text-white/60 hover:text-white hover:bg-white/10 gap-2"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </Button>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 text-xs text-white/40 hover:text-white/70 transition-colors mt-1"
        >
          ↗ Ver sitio web
        </Link>
      </div>
    </aside>
  );
}

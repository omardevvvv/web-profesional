export const NAV_ITEMS = [
  { label: "Inicio", href: "#hero" },
  { label: "Servicios", href: "#servicios" },
  { label: "Equipo", href: "#equipo" },
  { label: "FAQ", href: "#faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contacto", href: "#contacto" },
] as const;

export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Hero", href: "/admin/hero", icon: "Image" },
  { label: "Servicios", href: "/admin/servicios", icon: "Briefcase" },
  { label: "Equipo", href: "/admin/equipo", icon: "Users" },
  { label: "FAQ", href: "/admin/faq", icon: "HelpCircle" },
  { label: "Blog", href: "/admin/blog", icon: "FileText" },
  { label: "Contacto", href: "/admin/contacto", icon: "Mail" },
  { label: "SEO", href: "/admin/seo", icon: "Search" },
] as const;

import {
  BookOpen,
  FileText,
  Building2,
  Users,
  Search,
  TrendingUp,
  Briefcase,
  Calculator,
  LucideIcon,
} from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  FileText,
  Building2,
  Users,
  Search,
  TrendingUp,
  Briefcase,
  Calculator,
};

interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string | null;
}

interface ServicesSectionProps {
  services: Service[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section id="servicios" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="text-[#D4A843] font-medium text-sm uppercase tracking-widest">
            Nuestros Servicios
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628] mt-3 mb-4 font-[var(--font-heading)]">
            Soluciones Contables y Fiscales
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Ofrecemos un servicio integral para cubrir todas las necesidades
            contables, fiscales y financieras de su empresa o actividad.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => {
            const Icon = service.icon ? iconMap[service.icon] : Briefcase;
            return (
              <AnimatedSection key={service.id} delay={i * 0.1}>
                <div className="group p-8 rounded-2xl border border-gray-100 hover:border-[#D4A843]/30 hover:shadow-lg hover:shadow-[#D4A843]/5 transition-all duration-300 h-full">
                  <div className="w-12 h-12 bg-[#0A1628] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#D4A843] transition-colors duration-300">
                    {Icon && (
                      <Icon className="w-6 h-6 text-[#D4A843] group-hover:text-[#0A1628] transition-colors duration-300" />
                    )}
                  </div>
                  <h3 className="text-[#0A1628] font-semibold text-lg mb-3 font-[var(--font-heading)]">
                    {service.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}

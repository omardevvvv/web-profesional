import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { ContactForm } from "./ContactForm";

interface ContactInfo {
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  schedule?: string | null;
}

interface ContactSectionProps {
  contactInfo: ContactInfo | null;
}

export function ContactSection({ contactInfo }: ContactSectionProps) {
  const infoItems = [
    contactInfo?.phone && {
      icon: Phone,
      label: "Teléfono",
      value: contactInfo.phone,
      href: `tel:${contactInfo.phone.replace(/\s/g, "")}`,
    },
    contactInfo?.email && {
      icon: Mail,
      label: "Email",
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
    },
    contactInfo?.address && {
      icon: MapPin,
      label: "Dirección",
      value: contactInfo.address,
    },
    contactInfo?.schedule && {
      icon: Clock,
      label: "Horario",
      value: contactInfo.schedule,
    },
  ].filter(Boolean);

  return (
    <section id="contacto" className="py-24 bg-[#0A1628]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="text-[#D4A843] font-medium text-sm uppercase tracking-widest">
            Contacto
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4 font-[var(--font-heading)]">
            Hablemos de Su Situación
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Primera consulta gratuita y sin compromiso. Cuéntenos su caso y le
            ofreceremos la solución más adecuada para sus necesidades.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact info */}
          <AnimatedSection className="lg:col-span-2 space-y-8">
            {infoItems.map((item) => {
              if (!item) return null;
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#D4A843]/10 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#D4A843]" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-white hover:text-[#D4A843] transition-colors whitespace-pre-line"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-white whitespace-pre-line">{item.value}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </AnimatedSection>

          {/* Form */}
          <AnimatedSection
            delay={0.2}
            className="lg:col-span-3 bg-white rounded-2xl p-8"
          >
            <h3 className="text-[#0A1628] font-semibold text-xl mb-6 font-[var(--font-heading)]">
              Envíenos un Mensaje
            </h3>
            <ContactForm />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

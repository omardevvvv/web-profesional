import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/public/ContactForm";
import { AnimatedSection } from "@/components/public/AnimatedSection";
import { getContactInfo } from "@/actions/contact";
import { getSeoByPage } from "@/actions/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoByPage("contacto");
  return {
    title: seo?.metaTitle ?? "Contacto",
    description: seo?.metaDescription ?? undefined,
  };
}

export default async function ContactPage() {
  const contact = await getContactInfo();

  const infoItems = [
    contact?.phone && {
      icon: Phone,
      label: "Teléfono",
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s/g, "")}`,
    },
    contact?.email && {
      icon: Mail,
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    contact?.address && {
      icon: MapPin,
      label: "Dirección",
      value: contact.address,
    },
    contact?.schedule && {
      icon: Clock,
      label: "Horario de atención",
      value: contact.schedule,
    },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-14">
          <span className="text-[#D4A843] font-medium text-sm uppercase tracking-widest">
            Contacto
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#0A1628] mt-3 mb-4 font-[var(--font-heading)]">
            Estamos Aquí Para Ayudarle
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Solicite su primera consulta gratuita. Nuestro equipo le atenderá
            en el menor tiempo posible.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact details */}
          <AnimatedSection className="lg:col-span-2 space-y-6">
            <div className="bg-[#0A1628] rounded-2xl p-8 space-y-7">
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
                        <p className="text-white whitespace-pre-line">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map placeholder */}
            {contact?.mapEmbedUrl ? (
              <div className="rounded-2xl overflow-hidden h-48">
                <iframe
                  src={contact.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="border-0"
                />
              </div>
            ) : (
              <div className="rounded-2xl bg-[#0A1628]/10 h-48 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <MapPin className="w-8 h-8 mx-auto mb-2 text-[#D4A843]" />
                  <p className="text-sm">Mapa disponible próximamente</p>
                </div>
              </div>
            )}
          </AnimatedSection>

          {/* Form */}
          <AnimatedSection
            delay={0.2}
            className="lg:col-span-3 bg-white rounded-2xl p-8 shadow-sm"
          >
            <h2 className="text-[#0A1628] font-semibold text-2xl mb-6 font-[var(--font-heading)]">
              Envíenos un Mensaje
            </h2>
            <ContactForm />
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}

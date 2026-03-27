import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { getContactInfo } from "@/actions/contact";

export async function Footer() {
  const contact = await getContactInfo();

  return (
    <footer className="bg-[#0A1628] text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#D4A843] rounded-sm flex items-center justify-center">
                <span className="text-[#0A1628] font-bold text-sm">D</span>
              </div>
              <span className="text-white font-semibold text-lg font-[var(--font-heading)]">
                Despacho Contable
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Asesoría contable y fiscal profesional. Más de 20 años de
              experiencia ayudando a empresas y particulares.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Servicios
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                "Contabilidad Empresarial",
                "Asesoría Fiscal",
                "Constitución de Sociedades",
                "Laboral y RRHH",
                "Auditoría de Cuentas",
              ].map((s) => (
                <li key={s}>
                  <Link
                    href="#servicios"
                    className="hover:text-[#D4A843] transition-colors"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Contacto
            </h3>
            <ul className="space-y-3 text-sm">
              {contact?.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#D4A843] shrink-0" />
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="hover:text-[#D4A843] transition-colors"
                  >
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact?.email && (
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#D4A843] shrink-0" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="hover:text-[#D4A843] transition-colors"
                  >
                    {contact.email}
                  </a>
                </li>
              )}
              {contact?.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#D4A843] shrink-0 mt-0.5" />
                  <span className="whitespace-pre-line">{contact.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>
            © {new Date().getFullYear()} Despacho Contable y Fiscal. Todos los
            derechos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-[#D4A843] transition-colors">
              Política de Privacidad
            </Link>
            <Link href="#" className="hover:text-[#D4A843] transition-colors">
              Aviso Legal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

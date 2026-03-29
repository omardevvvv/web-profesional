import Image from "next/image";
import { ExternalLink, Mail } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string | null;
  photoUrl?: string | null;
  email?: string | null;
  linkedIn?: string | null;
}

interface TeamSectionProps {
  members: TeamMember[];
}

export function TeamSection({ members }: TeamSectionProps) {
  return (
    <section id="equipo" className="py-24 bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="text-[#7A5230] font-medium text-sm uppercase tracking-widest">
            Nuestro Equipo
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mt-3 mb-4 font-[var(--font-heading)]">
            Profesionales a Su Servicio
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Un equipo de expertos altamente cualificados comprometidos con
            ofrecer el mejor asesoramiento para su situación.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, i) => (
            <AnimatedSection key={member.id} delay={i * 0.15}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                {/* Photo */}
                <div className="relative w-full h-64 bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A]">
                  {member.photoUrl ? (
                    <Image
                      src={member.photoUrl}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-[#C4A882]/20 border-2 border-[#C4A882]/40 flex items-center justify-center">
                        <span className="text-[#C4A882] font-bold text-3xl font-[var(--font-heading)]">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-[#1A1A1A] font-semibold text-lg font-[var(--font-heading)]">
                    {member.name}
                  </h3>
                  <p className="text-[#7A5230] text-sm font-medium mt-1 mb-3">
                    {member.role}
                  </p>
                  {member.bio && (
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                      {member.bio}
                    </p>
                  )}
                  <div className="flex gap-3">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center hover:bg-[#C4A882] transition-colors"
                        aria-label={`Email de ${member.name}`}
                      >
                        <Mail className="w-4 h-4 text-white" />
                      </a>
                    )}
                    {member.linkedIn && (
                      <a
                        href={member.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center hover:bg-[#C4A882] transition-colors"
                        aria-label={`LinkedIn de ${member.name}`}
                      >
                        <ExternalLink className="w-4 h-4 text-white" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

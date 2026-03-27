import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { HeroSection } from "@/components/public/HeroSection";
import { ServicesSection } from "@/components/public/ServicesSection";
import { TeamSection } from "@/components/public/TeamSection";
import { FaqSection } from "@/components/public/FaqSection";
import { BlogPreviewSection } from "@/components/public/BlogPreviewSection";
import { ContactSection } from "@/components/public/ContactSection";
import { getHeroContent } from "@/actions/hero";
import { getServices } from "@/actions/services";
import { getTeamMembers } from "@/actions/team";
import { getFaqItems } from "@/actions/faq";
import { getBlogPosts } from "@/actions/blog";
import { getContactInfo } from "@/actions/contact";
import { getSeoByPage } from "@/actions/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoByPage("home");
  return {
    title: seo?.metaTitle ?? undefined,
    description: seo?.metaDescription ?? undefined,
    keywords: seo?.keywords ?? undefined,
    openGraph: seo?.ogImage ? { images: [seo.ogImage] } : undefined,
  };
}

export default async function HomePage() {
  const [hero, services, team, faqs, posts, contact] = await Promise.all([
    getHeroContent(),
    getServices(),
    getTeamMembers(),
    getFaqItems(),
    getBlogPosts(),
    getContactInfo(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection
          title={hero?.title ?? "Asesoría Contable y Fiscal de Confianza"}
          subtitle={
            hero?.subtitle ??
            "Profesionales comprometidos con su tranquilidad fiscal."
          }
          ctaText={hero?.ctaText ?? "Solicitar Consulta"}
          ctaLink={hero?.ctaLink ?? "#contacto"}
        />
        <ServicesSection services={services} />
        <TeamSection members={team} />
        <FaqSection items={faqs} />
        <BlogPreviewSection posts={posts.slice(0, 3)} />
        <ContactSection contactInfo={contact} />
      </main>
      <Footer />
    </>
  );
}

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL ?? "" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Iniciando seed...");

  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@despacho.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123456";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: "Administrador",
    },
  });
  console.log("✅ Usuario admin creado:", adminEmail);

  // Hero content
  await prisma.heroContent.upsert({
    where: { id: "hero-main" },
    update: {},
    create: {
      id: "hero-main",
      title: "Asesoría Contable y Fiscal de Confianza",
      subtitle:
        "Más de 20 años de experiencia ayudando a empresas y particulares a optimizar su situación fiscal y contable con rigor, transparencia y compromiso.",
      ctaText: "Solicitar Consulta Gratuita",
      ctaLink: "#contacto",
    },
  });
  console.log("✅ Hero content creado");

  // Services
  const services = [
    {
      id: "srv-1",
      title: "Contabilidad Empresarial",
      description:
        "Llevamos la contabilidad de su empresa de forma precisa y actualizada. Cuentas anuales, libros contables y presentación de obligaciones mercantiles.",
      icon: "BookOpen",
      order: 1,
    },
    {
      id: "srv-2",
      title: "Asesoría Fiscal",
      description:
        "Planificación y optimización fiscal integral. Declaraciones de renta, IVA, IS, modelos informativos y gestión ante la Agencia Tributaria.",
      icon: "FileText",
      order: 2,
    },
    {
      id: "srv-3",
      title: "Constitución de Sociedades",
      description:
        "Le acompañamos en todo el proceso de creación de su empresa. Elección de forma jurídica, trámites ante el Registro Mercantil y administraciones.",
      icon: "Building2",
      order: 3,
    },
    {
      id: "srv-4",
      title: "Laboral y RRHH",
      description:
        "Gestión completa de nóminas, contratos, altas y bajas en Seguridad Social, EREs y representación ante la Inspección de Trabajo.",
      icon: "Users",
      order: 4,
    },
    {
      id: "srv-5",
      title: "Auditoría de Cuentas",
      description:
        "Auditoría voluntaria y obligatoria de estados financieros. Informes de revisión limitada y due diligence para operaciones corporativas.",
      icon: "Search",
      order: 5,
    },
    {
      id: "srv-6",
      title: "Consultoría Financiera",
      description:
        "Análisis económico-financiero, planificación estratégica, valoración de empresas y acompañamiento en procesos de financiación.",
      icon: "TrendingUp",
      order: 6,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: {},
      create: service,
    });
  }
  console.log("✅ Servicios creados");

  // Team members
  const team = [
    {
      id: "team-1",
      name: "Carlos Martínez López",
      role: "Socio Director · Economista",
      bio: "Más de 25 años de experiencia en asesoría fiscal y financiera. Miembro del ROAC y del Registro de Economistas Asesores Fiscales.",
      order: 1,
    },
    {
      id: "team-2",
      name: "Ana García Ruiz",
      role: "Socia · Contable y Fiscal",
      bio: "Especialista en fiscalidad internacional y contabilidad de grupos empresariales. Asesora de referencia para pymes y autónomos.",
      order: 2,
    },
    {
      id: "team-3",
      name: "Miguel Torres Sánchez",
      role: "Responsable Laboral",
      bio: "Graduado Social Colegiado con amplia experiencia en derecho laboral, negociación colectiva y gestión de nóminas.",
      order: 3,
    },
  ];

  for (const member of team) {
    await prisma.teamMember.upsert({
      where: { id: member.id },
      update: {},
      create: member,
    });
  }
  console.log("✅ Equipo creado");

  // FAQ
  const faqs = [
    {
      id: "faq-1",
      question: "¿Cuándo debo presentar el Impuesto sobre la Renta?",
      answer:
        "La campaña de la Renta habitualmente se desarrolla entre abril y junio. Sin embargo, si tiene actividad empresarial o realiza pagos fraccionados, existen obligaciones trimestrales adicionales. Le recomendamos contactarnos para revisar su situación concreta.",
      order: 1,
    },
    {
      id: "faq-2",
      question: "¿Qué documentación necesito para darme de alta como autónomo?",
      answer:
        "Necesitará DNI/NIE, número de la Seguridad Social, datos bancarios y la descripción de la actividad que va a desarrollar (epígrafe IAE). Nosotros nos encargamos de todo el proceso de alta en Hacienda y Seguridad Social.",
      order: 2,
    },
    {
      id: "faq-3",
      question: "¿Qué diferencia hay entre una SL y una SA?",
      answer:
        "La Sociedad Limitada (SL) requiere un capital mínimo de 3.000€ y es la forma más común para pymes. La Sociedad Anónima (SA) requiere 60.000€ de capital y está orientada a empresas grandes o que cotizan en bolsa. Para la mayoría de casos, la SL es la opción más adecuada.",
      order: 3,
    },
    {
      id: "faq-4",
      question: "¿Con qué frecuencia debo presentar el IVA?",
      answer:
        "La mayoría de autónomos y empresas presentan el IVA trimestralmente (enero, abril, julio y octubre). Las grandes empresas están obligadas a presentarlo mensualmente. Gestionamos todos los modelos necesarios para cumplir con sus obligaciones.",
      order: 4,
    },
    {
      id: "faq-5",
      question: "¿Ofrecen una primera consulta gratuita?",
      answer:
        "Sí, ofrecemos una primera consulta sin compromiso para analizar su situación y presentarle nuestros servicios. Puede contactarnos por teléfono, email o a través del formulario de contacto de esta página.",
      order: 5,
    },
  ];

  for (const faq of faqs) {
    await prisma.faqItem.upsert({
      where: { id: faq.id },
      update: {},
      create: faq,
    });
  }
  console.log("✅ FAQ creada");

  // Blog posts
  const posts = [
    {
      id: "post-1",
      title: "Novedades fiscales 2025: Lo que necesitas saber",
      slug: "novedades-fiscales-2025",
      excerpt:
        "Resumen de los principales cambios normativos en materia fiscal que entran en vigor en 2025 y cómo afectan a autónomos y empresas.",
      content:
        "<h2>Principales cambios fiscales en 2025</h2><p>El inicio del año trae consigo importantes novedades en materia tributaria. A continuación resumimos los cambios más relevantes que deben conocer autónomos y empresas.</p><h3>IRPF</h3><p>Se amplía la deducción por maternidad y se introducen nuevos tramos en la base liquidable del ahorro para las rentas más elevadas.</p><h3>IVA</h3><p>El tipo reducido del IVA en determinados productos de primera necesidad se mantiene, mientras que se producen ajustes en la aplicación del régimen simplificado.</p>",
      isPublished: true,
      publishedAt: new Date("2025-01-15"),
      author: "Carlos Martínez",
      tags: ["fiscal", "IRPF", "IVA", "novedades"],
    },
    {
      id: "post-2",
      title: "Cómo optimizar la tributación de tu empresa",
      slug: "optimizar-tributacion-empresa",
      excerpt:
        "Estrategias legales y recomendaciones prácticas para reducir la carga fiscal de tu negocio de forma eficiente y dentro de la normativa vigente.",
      content:
        "<h2>Optimización fiscal empresarial</h2><p>La planificación fiscal es una herramienta fundamental para mejorar la rentabilidad de cualquier empresa. Conocer las deducciones, bonificaciones e incentivos fiscales disponibles puede suponer un ahorro significativo.</p><h3>Deducciones por I+D+i</h3><p>Las empresas que realicen actividades de investigación y desarrollo pueden aplicar importantes deducciones en el Impuesto sobre Sociedades.</p>",
      isPublished: true,
      publishedAt: new Date("2025-02-10"),
      author: "Ana García",
      tags: ["empresas", "IS", "planificación fiscal"],
    },
    {
      id: "post-3",
      title: "Guía para autónomos: primeros pasos",
      slug: "guia-autonomos-primeros-pasos",
      excerpt:
        "Todo lo que necesitas saber cuando decides darte de alta como trabajador autónomo: obligaciones, cuotas, deducciones y consejos prácticos.",
      content:
        "<h2>Ser autónomo en España</h2><p>Emprender como autónomo es una decisión importante que implica asumir una serie de obligaciones fiscales y administrativas. En esta guía te explicamos los aspectos clave.</p><h3>Alta en Hacienda y Seguridad Social</h3><p>Antes de iniciar la actividad debes darte de alta en el censo de empresarios (modelo 036 o 037) y en el Régimen Especial de Trabajadores Autónomos (RETA).</p>",
      isPublished: true,
      publishedAt: new Date("2025-03-01"),
      author: "Miguel Torres",
      tags: ["autónomos", "alta", "guía"],
    },
  ];

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { id: post.id },
      update: {},
      create: post,
    });
  }
  console.log("✅ Blog posts creados");

  // Contact info
  await prisma.contactInfo.upsert({
    where: { id: "contact-main" },
    update: {},
    create: {
      id: "contact-main",
      phone: "+34 91 123 45 67",
      email: "info@despacho.com",
      address: "Calle Gran Vía, 28, 3ª planta\n28013 Madrid",
      schedule:
        "Lunes a Jueves: 9:00 - 18:00\nViernes: 9:00 - 14:00\nJulio y Agosto: 8:00 - 15:00",
    },
  });
  console.log("✅ Información de contacto creada");

  // SEO settings
  const seoPages = [
    {
      pageName: "home",
      metaTitle: "Despacho Contable y Fiscal | Asesoría Profesional en Madrid",
      metaDescription:
        "Despacho profesional de contabilidad y asesoría fiscal en Madrid. Más de 20 años de experiencia. Servicios de contabilidad, impuestos, auditoría y consultoría.",
      keywords: "asesoría fiscal, contabilidad, Madrid, autónomos, pymes",
    },
    {
      pageName: "blog",
      metaTitle: "Blog | Noticias Fiscales y Contables",
      metaDescription:
        "Artículos y noticias sobre novedades fiscales, contabilidad y asesoría empresarial. Manténgase informado con nuestros expertos.",
      keywords: "blog fiscal, noticias fiscales, contabilidad, novedades",
    },
    {
      pageName: "contacto",
      metaTitle: "Contacto | Despacho Contable y Fiscal",
      metaDescription:
        "Póngase en contacto con nuestro despacho. Primera consulta gratuita. Teléfono, email y formulario de contacto disponibles.",
      keywords: "contacto, asesoría fiscal Madrid, consulta gratuita",
    },
  ];

  for (const seo of seoPages) {
    await prisma.seoSetting.upsert({
      where: { pageName: seo.pageName },
      update: {},
      create: seo,
    });
  }
  console.log("✅ SEO settings creadas");

  console.log("🎉 Seed completado con éxito");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

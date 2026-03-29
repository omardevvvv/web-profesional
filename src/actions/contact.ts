"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

export async function getContactInfo() {
  return prisma.contactInfo.findFirst();
}

export async function updateContactInfo(data: {
  phone?: string;
  email?: string;
  address?: string;
  mapEmbedUrl?: string;
  schedule?: string;
  facebook?: string;
  instagram?: string;
  linkedIn?: string;
  notificationEmail?: string;
  senderEmail?: string;
}) {
  const existing = await prisma.contactInfo.findFirst();

  if (existing) {
    await prisma.contactInfo.update({ where: { id: existing.id }, data });
  } else {
    await prisma.contactInfo.create({ data });
  }

  revalidatePath("/");
  revalidatePath("/contacto");
}

export async function submitContactForm(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  await prisma.contactSubmission.create({ data });

  // Send notification email if API key and notification email are configured
  if (process.env.RESEND_API_KEY) {
    const contactInfo = await prisma.contactInfo.findFirst();
    const toEmail = contactInfo?.notificationEmail || contactInfo?.email;
    const fromEmail = contactInfo?.senderEmail || "onboarding@resend.dev";

    if (toEmail) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: `Formulario Web <${fromEmail}>`,
        to: toEmail,
        replyTo: data.email,
        subject: `Nuevo mensaje de contacto: ${data.subject || "Sin asunto"}`,
        html: `
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.phone ? `<p><strong>Teléfono:</strong> ${data.phone}</p>` : ""}
          ${data.subject ? `<p><strong>Asunto:</strong> ${data.subject}</p>` : ""}
          <p><strong>Mensaje:</strong></p>
          <p>${data.message.replace(/\n/g, "<br>")}</p>
        `,
      });
    }
  }
}

export async function getContactSubmissions() {
  return prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function markSubmissionAsRead(id: string) {
  await prisma.contactSubmission.update({
    where: { id },
    data: { isRead: true },
  });
  revalidatePath("/admin/contacto/mensajes");
}

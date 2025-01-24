import { EmailStatus, PrismaClient, type Email } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const emailService = {
  async queueEmail(
    to: string,
    subject: string,
    content: string
  ): Promise<Email> {
    return prisma.email.create({
      data: {
        to,
        subject,
        content,
        status: EmailStatus.QUEUED,
      },
    });
  },

  async processEmailQueue() {
    const emails = await prisma.email.findMany({
      where: {
        status: EmailStatus.QUEUED,
      },
      take: 10, // Process 10 emails at a time
    });

    for (const email of emails) {
      await this.sendEmail(email);
    }
  },

  async sendEmail(email: Email) {
    try {
      await prisma.email.update({
        where: { id: email.id },
        data: { status: EmailStatus.PROCESSING },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email.to,
        subject: email.subject,
        html: email.content,
      });

      await prisma.email.update({
        where: { id: email.id },
        data: {
          status: EmailStatus.SENT,
          sentAt: new Date(),
        },
      });
    } catch (error: any) {
      console.error("Error sending email:", error);
      await prisma.email.update({
        where: { id: email.id },
        data: {
          status: EmailStatus.FAILED,
          retries: { increment: 1 },
          lastError: error.message,
        },
      });
    }
  },
};

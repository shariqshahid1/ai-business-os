import nodemailer from "nodemailer";

type MailOptions = {
  to: string;
  subject: string;
  html: string;
};

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.EMAIL_SERVER_HOST;
  if (!host) return null;
  transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
    secure: Number(process.env.EMAIL_SERVER_PORT ?? 587) === 465,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });
  return transporter;
}

function baseTemplate(content: string) {
  return `<!doctype html>
  <html lang="en">
    <body style="margin:0;background:#0b1020;font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;color:#e5e7eb;padding:32px;">
      <div style="max-width:480px;margin:0 auto;background:#11162a;border:1px solid #1f2742;border-radius:16px;padding:32px;">
        <h1 style="font-size:20px;margin:0 0 8px;color:#ffffff;">Nexora</h1>
        <p style="color:#aab2c5;margin:0 0 24px;">The Smart AI Operating System for Modern Businesses</p>
        ${content}
        <hr style="border:none;border-top:1px solid #1f2742;margin:24px 0;" />
        <p style="color:#6b7280;font-size:12px;">If you didn't request this email, you can safely ignore it.</p>
      </div>
    </body>
  </html>`;
}

export async function sendMail({ to, subject, html }: MailOptions) {
  const client = getTransporter();

  if (!client) {
    // In production, missing SMTP config must fail loudly rather than impersonate success.
    if (process.env.NODE_ENV === "production") {
      throw new Error("EMAIL_SERVER_HOST is not configured; cannot send email.");
    }
    // Dev fallback: log the action so local flows still work without SMTP.
    console.info(`[mail:dev] To=${to} Subject="${subject}"\n${html.replace(/<[^>]+>/g, "")}`);
    return { ok: true, dev: true };
  }

  await client.sendMail({
    from: process.env.EMAIL_FROM ?? "noreply@nexora.ai",
    to,
    subject,
    html: baseTemplate(html),
  });
  return { ok: true };
}

export function verificationEmailLink(token: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${appUrl}/verify-email?token=${token}`;
}

export function resetPasswordLink(token: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${appUrl}/reset-password?token=${token}`;
}

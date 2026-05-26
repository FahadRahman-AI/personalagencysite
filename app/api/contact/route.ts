import { NextResponse } from "next/server";
import { Resend } from "resend";

interface ContactBody {
  name?: string;
  email?: string;
  service?: string;
  message?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactBody;
    const { name, email, service, message } = body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.NOTIFICATION_EMAIL;

    if (!apiKey || !to) {
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 500 },
      );
    }

    const resend = new Resend(apiKey);
    const from = process.env.RESEND_FROM_EMAIL ?? "Studio FX <onboarding@resend.dev>";

    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: "New Project Enquiry — Studio FX",
      html: `
        <h2>New Project Enquiry — Studio FX</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Service:</strong> ${escapeHtml(service ?? "Not specified")}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message ?? "")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message." },
      { status: 500 },
    );
  }
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

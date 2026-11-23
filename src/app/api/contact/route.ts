import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { TOPICS, validateContact, type ContactPayload } from "../../../lib/contact";


/* ---------- simple spam protection ---------- */

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PER_WINDOW = 5; // messages per IP in that window
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // keep the map from growing forever
  if (hits.size > 1000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }

  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

/* ---------- helpers ---------- */

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const oneLine = (value: string): string =>
  value.replace(/[\r\n]+/g, " ").trim();

function parseBody(body: unknown): ContactPayload | null {
  if (typeof body !== "object" || body === null) return null;
  const raw = body as Record<string, unknown>;
  const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

  const topic = str(raw.topic);
  if (!(TOPICS as readonly string[]).includes(topic)) return null;

  return {
    name: str(raw.name),
    email: str(raw.email),
    phone: str(raw.phone),
    topic: topic as ContactPayload["topic"],
    message: str(raw.message),
    website: str(raw.website),
  };
}

/* ---------- route ---------- */

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const data = parseBody(body);
  if (!data) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill this hidden field. Pretend it worked and send nothing.
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const fields = validateContact(data);
  if (Object.keys(fields).length > 0) {
    return NextResponse.json(
      { error: "Please check the form and try again.", fields },
      { status: 422 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  const to = process.env.CONTACT_TO_EMAIL || user;

  if (!user || !pass || !to) {
    console.error("Contact form: GMAIL_USER or GMAIL_APP_PASSWORD is missing.");
    return NextResponse.json(
      { error: "Email is not set up yet." },
      { status: 500 },
    );
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  const name = oneLine(data.name);
  const text = [
    `Topic: ${data.topic}`,
    `Name: ${name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "Not given"}`,
    "",
    data.message,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#1e293b;line-height:1.6">
      <h2 style="margin:0 0 12px;color:#17549a">New message from the website</h2>
      <p style="margin:0"><strong>Topic:</strong> ${escapeHtml(data.topic)}</p>
      <p style="margin:0"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin:0"><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p style="margin:0 0 16px"><strong>Phone:</strong> ${escapeHtml(data.phone || "Not given")}</p>
      <div style="padding:14px 16px;border-left:4px solid #20a545;background:#f5f9fc">
        ${escapeHtml(data.message).replace(/\n/g, "<br />")}
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Teliclinicbd Website" <${user}>`,
      to,
      replyTo: `"${name.replace(/"/g, "")}" <${data.email}>`,
      subject: `[Website] ${data.topic} from ${name}`,
      text,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form: sending failed.", error);
    return NextResponse.json(
      { error: "We could not send your message. Please try again later." },
      { status: 500 },
    );
  }
}

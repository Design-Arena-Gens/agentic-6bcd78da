import { NextResponse } from "next/server";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();

    const errors: Record<string, string> = {};
    if (name.length < 2) errors.name = "Name must be at least 2 characters";
    if (!isValidEmail(email)) errors.email = "Enter a valid email";
    if (message.length < 10) errors.message = "Message must be at least 10 characters";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: "Validation failed", errors }, { status: 400 });
    }

    // Simulate processing (e.g., send email or store in DB)
    console.log("CONTACT_FORM_SUBMISSION", {
      at: new Date().toISOString(),
      name,
      email,
      message,
      userAgent: request.headers.get("user-agent") ?? undefined,
      ip: request.headers.get("x-forwarded-for") ?? undefined,
    });

    return NextResponse.json({ message: "Your message has been received." }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}

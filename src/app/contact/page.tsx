"use client";

import { useState, useMemo } from "react";

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  const isValid = useMemo(() => {
    const nameOk = name.trim().length >= 2;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const messageOk = message.trim().length >= 10;
    return nameOk && emailOk && messageOk;
  }, [name, email, message]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValid || submitState.status === "submitting") return;

    setSubmitState({ status: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Failed to submit. Please try again.");
      }
      setSubmitState({ status: "success", message: data?.message ?? "Thanks for reaching out!" });
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      setSubmitState({ status: "error", message: err?.message || "Something went wrong." });
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50">
      <main className="mx-auto max-w-2xl px-6 py-20">
        <h1 className="text-4xl font-semibold tracking-tight">Contact</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Have a question or a project in mind? Send a message and I’ll get back to you.
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base placeholder-zinc-400 shadow-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-800"
              placeholder="Your full name"
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base placeholder-zinc-400 shadow-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-800"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              required
              minLength={10}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="block w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base placeholder-zinc-400 shadow-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-800"
              placeholder="Tell me a bit about your goals..."
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!isValid || submitState.status === "submitting"}
              className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              {submitState.status === "submitting" ? "Sending..." : "Send message"}
            </button>
            {submitState.status === "success" && (
              <span className="text-sm text-emerald-600 dark:text-emerald-400">
                {submitState.message}
              </span>
            )}
            {submitState.status === "error" && (
              <span className="text-sm text-rose-600 dark:text-rose-400">
                {submitState.message}
              </span>
            )}
          </div>
        </form>

        <p className="mt-10 text-xs text-zinc-500 dark:text-zinc-500">
          This demo validates inputs server-side and logs messages without sending email.
        </p>
      </main>
    </div>
  );
}

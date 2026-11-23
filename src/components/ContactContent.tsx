"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Check,
  ChevronDown,
  Info,
  Loader,
  Mail,
  MapPin,
  Phone,
  Send,
  type LucideIcon,
} from "lucide-react";
import {
  LIMITS,
  TOPICS,
  validateContact,
  type FieldErrors,
  type FieldName,
  type Topic,
} from "../lib/contact";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type FormValues = {
  name: string;
  email: string;
  phone: string;
  topic: Topic;
  message: string;
  website: string;
};

type Status = "idle" | "sending" | "success" | "error";
type ContactInfo = {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
};

const initialValues: FormValues = {
  name: "",
  email: "",
  phone: "",
  topic: "none" as Topic,
  message: "",
  website: "",
};

/** Replace these with your real contact details. */
const contactInfo: ContactInfo[] = [
  {
    icon: Mail,
    label: "Email",
    value: "info@teliclinicbd.org",
    href: "mailto:info@teliclinicbd.org",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+880 1XXX-XXXXXX",
    href: "tel:+8801000000000",
  },
  { icon: MapPin, label: "Address", value: "Your address, Bangladesh" },
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-100";

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-slate-800">
        {label}
        {optional && (
          <span className="ml-1.5 font-normal text-muted">(optional)</span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactContent() {
  const root = useRef<HTMLElement>(null);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");

  // Entrance animation
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-item]", {
          y: 28,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-group]", start: "top 85%" },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Success message animation
  useGSAP(
    () => {
      if (status !== "success") return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from("[data-success-icon]", {
            scale: 0,
            rotate: -30,
            duration: 0.7,
            ease: "back.out(2)",
          })
          .from(
            "[data-success-item]",
            { y: 16, opacity: 0, duration: 0.5, stagger: 0.1 },
            "-=0.3",
          );
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [status] },
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (name in errors) {
      setErrors((prev) => ({ ...prev, [name as FieldName]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    const found = validateContact(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("sending");
    setServerError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          topic: "General inquiry", // Send a valid topic to the server, even if "none" is selected
        }),
      });

      if (!res.ok) {
        const data: { error?: string; fields?: FieldErrors } = await res
          .json()
          .catch(() => ({}));
        if (data.fields) setErrors(data.fields);
        setServerError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setValues(initialValues);
      setStatus("success");
    } catch {
      setServerError(
        "We could not reach the server. Please check your connection and try again.",
      );
      setStatus("error");
    }
  };

  const sending = status === "sending";

  useEffect(() => {
    if (status !== "success") return;

    const timer = setTimeout(() => {
      setStatus("idle");
    }, 5000);

    return () => clearTimeout(timer);
  }, [status]);

  return (
    <main
      ref={root}
      className="relative isolate overflow-hidden bg-linear-to-b from-surface via-white to-white"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 -top-24 h-112 w-md rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div
          data-group
          className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16"
        >
          {/* Left: info */}
          <div>
            <h1
              data-item
              className="text-balance text-4xl font-bold leading-[1.12] tracking-tight text-slate-900 sm:text-5xl"
            >
              We would love to hear from you.
            </h1>
            <p
              data-item
              className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg"
            >
              Ask about a campaign near you, offer to help as a doctor, or find
              out how to contribute. Send us a message and our team will get
              back to you.
            </p>

            <ul className="mt-10 flex flex-col gap-4">
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <li
                  key={label}
                  data-item
                  className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 backdrop-blur transition-colors duration-300 hover:border-primary/30"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="flex flex-col leading-snug">
                    <span className="text-sm text-muted">{label}</span>
                    {href ? (
                      <a
                        href={href}
                        className="text-base font-semibold text-slate-900 outline-none transition-colors duration-300 hover:text-primary focus-visible:text-primary focus-visible:underline"
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="text-base font-semibold text-slate-900">
                        {value}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: form card */}
          <div
            data-item
            className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.35)] sm:p-9"
          >
            {status === "success" ? (
              <div
                className="flex flex-col items-center py-10 text-center"
                role="status"
              >
                <span
                  data-success-icon
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-white shadow-[0_14px_30px_-12px_rgba(32,165,69,0.8)]"
                >
                  <Check className="h-8 w-8" />
                </span>
                <h2
                  data-success-item
                  className="mt-6 text-2xl font-bold tracking-tight text-slate-900"
                >
                  Message sent
                </h2>
                <p
                  data-success-item
                  className="mt-3 max-w-sm text-base leading-relaxed text-muted"
                >
                  Thank you for writing to us. Our team will read your message
                  and reply by email.
                </p>
                <button
                  data-success-item
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-8 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-5"
              >
                <h2 className="text-xl font-bold tracking-tight text-slate-900">
                  Send us a message
                </h2>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    id="contact-name"
                    label="Your name"
                    error={errors.name}
                  >
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={values.name}
                      onChange={handleChange}
                      maxLength={LIMITS.nameMax}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={
                        errors.name ? "contact-name-error" : undefined
                      }
                      placeholder="Your full name"
                      className={inputClass}
                    />
                  </Field>

                  <Field
                    id="contact-email"
                    label="Email address"
                    error={errors.email}
                  >
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={handleChange}
                      maxLength={LIMITS.emailMax}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? "contact-email-error" : undefined
                      }
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    id="contact-phone"
                    label="Phone number"
                    optional
                    error={errors.phone}
                  >
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={values.phone}
                      onChange={handleChange}
                      maxLength={LIMITS.phoneMax}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={
                        errors.phone ? "contact-phone-error" : undefined
                      }
                      placeholder="+880 1XXX-XXXXXX"
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field
                  id="contact-message"
                  label="Your message"
                  error={errors.message}
                >
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={6}
                    value={values.message}
                    onChange={handleChange}
                    maxLength={LIMITS.messageMax}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={
                      errors.message ? "contact-message-error" : undefined
                    }
                    placeholder="Tell us how we can help"
                    className={`${inputClass} resize-y`}
                  />
                  <p className="text-right text-xs text-muted">
                    {values.message.length}/{LIMITS.messageMax}
                  </p>
                </Field>

                {/* Honeypot: hidden from people, bots fill it in */}
                <div
                  aria-hidden
                  className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
                >
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={values.website}
                    onChange={handleChange}
                  />
                </div>

                {status === "error" && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    <Info className="mt-0.5 h-4 w-4 shrink-0" />
                    {serverError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-primary px-7 py-4 text-base font-semibold text-white shadow-[0_14px_30px_-12px_rgba(23,84,154,0.85)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 sm:self-start"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                  {sending ? (
                    <Loader className="relative h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  )}
                  <span className="relative">
                    {sending ? "Sending..." : "Send message"}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

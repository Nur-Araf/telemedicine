"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Heart,
  Stethoscope,
  HandHeart,
  CalendarDays,
  Mail,
  Phone,
  User,
  GraduationCap,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  HeartHandshake,
  ClipboardCheck,
  MessageCircle,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { TOPICS, type Topic } from "../../lib/contact";

/* -------------------------------------------------------------------------- */
/*  Types & constants                                                         */
/* -------------------------------------------------------------------------- */

type ContributionType = "doctor" | "donate";

type FormValues = {
  type: ContributionType;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  qualification: string;
  dates: [string, string, string]; // ISO strings: YYYY-MM-DD
  amount: string;
  message: string;
};

const initialValues: FormValues = {
  type: "doctor",
  name: "",
  email: "",
  phone: "",
  specialization: "",
  qualification: "",
  dates: ["", "", ""],
  amount: "",
  message: "",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10";

const ways = [
  {
    icon: Stethoscope,
    title: "Volunteer as a Doctor",
    text: "Offer your time and clinical expertise to people who rarely get to see a qualified physician.",
    tone: "bg-primary/10 text-primary",
  },
  {
    icon: HandHeart,
    title: "Make a Donation",
    text: "Help us fund medicines, equipment and outreach so more communities can receive care.",
    tone: "bg-green-100 text-green-600",
  },
  {
    icon: HeartHandshake,
    title: "Every Gift Counts",
    text: "Time, knowledge or funds. Each one moves us closer to healthcare for everyone.",
    tone: "bg-amber-100 text-amber-600",
  },
];

const steps = [
  {
    icon: ClipboardCheck,
    title: "Share your details",
    text: "Fill in the short form above. It takes about two minutes.",
  },
  {
    icon: Users,
    title: "We review it",
    text: "Our team looks through your submission and your availability.",
  },
  {
    icon: MessageCircle,
    title: "We contact you",
    text: "You'll hear from us by email to talk through the next steps.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Date helpers (no external libraries)                                      */
/* -------------------------------------------------------------------------- */

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

const pad = (n: number) => String(n).padStart(2, "0");

const toISO = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const fromISO = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const formatShort = (iso: string) =>
  fromISO(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatLong = (iso: string) =>
  fromISO(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

/* -------------------------------------------------------------------------- */
/*  Custom date picker                                                        */
/* -------------------------------------------------------------------------- */

function DatePicker({
  id,
  label,
  value,
  onChange,
  disabledDates,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (iso: string) => void;
  disabledDates: string[];
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const [todayISO, setTodayISO] = useState("");

  const [view, setView] = useState<Date>(() => new Date(2000, 0, 1));

  // Set today's date only in the browser after mounting.
  useEffect(() => {
    const currentDate = new Date();

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTodayISO(toISO(currentDate));
    setView(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
  }, []);

  // Safe fallback during prerendering and the initial hydration render.
  const today = todayISO ? fromISO(todayISO) : new Date(2000, 0, 1);

  // Open on the selected month (or the current month).
  const toggle = () => {
    if (!open) {
      const base = value ? fromISO(value) : today;
      setView(new Date(base.getFullYear(), base.getMonth(), 1));
    }
    setOpen((o) => !o);
  };

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const year = view.getFullYear();
  const month = view.getMonth();
  const leadingBlanks = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array<null>(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const canGoPrev =
    year > today.getFullYear() ||
    (year === today.getFullYear() && month > today.getMonth());

  const goMonth = (delta: number) => setView(new Date(year, month + delta, 1));

  return (
    <div ref={rootRef} className="relative">
      <label
        htmlFor={id}
        className="mb-2 block text-xs font-semibold text-slate-600"
      >
        {label}
      </label>

      <button
        id={id}
        type="button"
        onClick={toggle}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          "flex h-12 w-full items-center gap-2.5 rounded-xl border bg-white px-3.5 text-left text-sm outline-none transition-all duration-200",
          "hover:border-slate-300 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10",
          open ? "border-primary ring-4 ring-primary/10" : "border-slate-200",
        )}
      >
        <CalendarDays
          className={cn(
            "h-4 w-4 shrink-0",
            value ? "text-primary" : "text-slate-400",
          )}
        />
        <span
          className={cn(
            "flex-1 truncate",
            value ? "font-medium text-slate-800" : "text-slate-400",
          )}
        >
          {value ? formatShort(value) : "Select date"}
        </span>
      </button>

      {open && todayISO && (
        <div
          role="dialog"
          aria-label={`Choose ${label.toLowerCase()}`}
          className="absolute left-1/2 z-30 mt-2 w-[18.5rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 animate-in fade-in zoom-in-95 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10 duration-150"
        >
          {/* Header */}
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => goMonth(-1)}
              disabled={!canGoPrev}
              aria-label="Previous month"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="text-sm font-bold text-slate-900">
              {MONTHS[month]} {year}
            </div>

            <button
              type="button"
              onClick={() => goMonth(1)}
              aria-label="Next month"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Weekday labels */}
          <div className="mb-1 grid grid-cols-7 text-center">
            {WEEKDAYS.map((d) => (
              <span
                key={d}
                className="py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400"
              >
                {d}
              </span>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((day, i) => {
              if (day === null) return <span key={`blank-${i}`} />;

              const date = new Date(year, month, day);
              const iso = toISO(date);
              const isPast = date < today;
              const isTaken = disabledDates.includes(iso);
              const isDisabled = isPast || isTaken;
              const isSelected = iso === value;
              const isToday = iso === todayISO;

              return (
                <button
                  key={iso}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    onChange(iso);
                    setOpen(false);
                  }}
                  aria-label={formatLong(iso)}
                  aria-pressed={isSelected}
                  className={cn(
                    "mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition-all duration-150",
                    isSelected &&
                      "bg-primary font-bold text-white shadow-md shadow-primary/30",
                    !isSelected &&
                      !isDisabled &&
                      "text-slate-700 hover:bg-primary/10 hover:text-primary",
                    !isSelected &&
                      isToday &&
                      !isDisabled &&
                      "font-bold text-primary ring-1 ring-primary/40",
                    isDisabled && "cursor-not-allowed text-slate-300",
                    isTaken && "line-through",
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              disabled={!value}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </button>

            <button
              type="button"
              disabled={disabledDates.includes(todayISO)}
              onClick={() => {
                onChange(todayISO);
                setOpen(false);
              }}
              className="rounded-lg px-2 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function ContributePage() {
  const [values, setValues] = useState<FormValues>(initialValues);

  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const [error, setError] = useState("");

  const isDoctor = values.type === "doctor";

  const clearError = () => {
    if (status === "error") {
      setStatus("idle");
      setError("");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    clearError();
  };

  const handleDateChange = (index: number, iso: string) => {
    setValues((prev) => {
      const dates = [...prev.dates] as FormValues["dates"];
      dates[index] = iso;
      return { ...prev, dates };
    });

    clearError();
  };

  const handleTypeChange = (type: ContributionType) => {
    setValues((prev) => ({
      ...initialValues,
      type,
      name: prev.name,
      email: prev.email,
      phone: prev.phone,
    }));

    setStatus("idle");
    setError("");
  };

  // Combine all additional information into the existing message field.
  const buildMessage = () => {
    const additionalMessage = values.message.trim();

    if (isDoctor) {
      const show = (iso: string) => (iso ? formatLong(iso) : "Not provided");

      return [
        "DOCTOR APPLICATION",
        "------------------------------",
        `Medical Specialization: ${values.specialization.trim()}`,
        `Qualifications: ${values.qualification.trim()}`,
        "",
        "AVAILABLE DATES:",
        `1. ${show(values.dates[0])}`,
        `2. ${show(values.dates[1])}`,
        `3. ${show(values.dates[2])}`,
        "",
        "ADDITIONAL INFORMATION:",
        additionalMessage || "Not provided",
      ].join("\n");
    }

    return [
      "DONATION INTEREST",
      "------------------------------",
      `Intended Donation Amount: ${values.amount.trim() || "Not specified"}`,
      "",
      "MESSAGE:",
      additionalMessage || "Not provided",
    ].join("\n");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (status === "sending") return;

    if (!values.name.trim() || !values.email.trim()) {
      setError("Please provide your name and email address.");
      setStatus("error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      setError("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    if (values.phone && !/^[0-9+()\-\s]+$/.test(values.phone)) {
      setError("Please enter a valid phone number.");
      setStatus("error");
      return;
    }

    if (
      isDoctor &&
      (!values.specialization.trim() || !values.qualification.trim())
    ) {
      setError("Please provide your specialization and qualification.");
      setStatus("error");
      return;
    }

    const finalMessage = buildMessage();

    if (finalMessage.length > 3000) {
      setError(
        "Your combined information is too long. Please shorten your additional message.",
      );
      setStatus("error");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      // Reuse the existing contact API. No backend changes required.
      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        topic: (isDoctor ? TOPICS[1] : TOPICS[2]) as Topic,
        message: finalMessage,
        website: "",
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));

        if (data.fields?.message) {
          setError(data.fields.message);
          setStatus("error");
          return;
        }

        throw new Error(
          data.error || "Unable to submit your request. Please try again.",
        );
      }

      setValues(initialValues);
      setStatus("success");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setStatus("error");
    }
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-50">
      {/* Background decoration */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-40 top-[45%] h-96 w-96 rounded-full bg-green-400/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        {/* HERO */}
        <section className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm">
            <Heart className="h-4 w-4 fill-current" />
            Be part of something meaningful
          </div>

          <h1 className="mt-7 text-4xl font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Help Us Bring Healthcare
            <span className="mt-2 block text-primary">
              to the People Who Need It Most.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            Where you live should never decide the care you receive. Whether you
            are a doctor ready to volunteer or a supporter who wants to give,
            you can help us reach communities that have been left waiting.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              Your information stays private
            </span>
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Personal follow-up by email
            </span>
          </div>
        </section>

        {/* WAYS TO HELP */}
        <section className="mt-14 grid gap-5 md:grid-cols-3">
          {ways.map(({ icon: Icon, title, text, tone }) => (
            <div
              key={title}
              className="group rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                  tone,
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </section>

        {/* FORM */}
        <section
          id="contribute-form"
          className="mx-auto mt-14 max-w-3xl rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_25px_70px_-35px_rgba(15,23,42,0.3)] sm:p-10"
        >
          {status === "success" ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center py-10 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <h2 className="mt-7 text-3xl font-bold text-slate-900">
                Thank You!
              </h2>

              <p className="mt-4 max-w-md leading-7 text-slate-600">
                We&apos;ve received your details. Our team will review them and
                get in touch by email to talk about the next steps.
              </p>

              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-primary/90"
              >
                Submit another response
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  How Would You Like to Help?
                </h2>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
                  Choose an option and tell us a little about yourself. We will
                  reach out personally.
                </p>
              </div>

              {/* Contribution selector */}
              <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => handleTypeChange("doctor")}
                  aria-pressed={isDoctor}
                  className={cn(
                    "flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-300",
                    isDoctor
                      ? "border-primary bg-primary/5 text-primary shadow-sm"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300",
                  )}
                >
                  <Stethoscope className="h-7 w-7 shrink-0" />
                  <span>
                    <span className="block text-sm font-bold">
                      Join as a Doctor
                    </span>
                    <span className="block text-xs opacity-75">
                      Volunteer your expertise
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange("donate")}
                  aria-pressed={!isDoctor}
                  className={cn(
                    "flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-300",
                    !isDoctor
                      ? "border-green-500 bg-green-50 text-green-700 shadow-sm"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300",
                  )}
                >
                  <HandHeart className="h-7 w-7 shrink-0" />
                  <span>
                    <span className="block text-sm font-bold">
                      Make a Donation
                    </span>
                    <span className="block text-xs opacity-75">
                      Support our work
                    </span>
                  </span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Personal information */}
                <div>
                  <h3 className="mb-4 text-sm font-bold text-slate-800">
                    Personal Information
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Full Name *
                      </label>

                      <div className="relative">
                        <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          id="name"
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          required
                          minLength={2}
                          maxLength={100}
                          placeholder="Enter your full name"
                          className={`${inputClass} pl-11`}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="email"
                          className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                          Email Address *
                        </label>

                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={values.email}
                            onChange={handleChange}
                            required
                            maxLength={254}
                            placeholder="you@example.com"
                            className={`${inputClass} pl-11`}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                          Phone Number
                        </label>

                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={values.phone}
                            onChange={handleChange}
                            maxLength={30}
                            placeholder="+880 1XXX-XXXXXX"
                            className={`${inputClass} pl-11`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Doctor information */}
                {isDoctor && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="mb-4 border-t border-slate-100 pt-6">
                      <h3 className="text-sm font-bold text-slate-800">
                        Professional Information
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Tell us about your medical background.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="specialization"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                          >
                            Medical Specialization *
                          </label>

                          <div className="relative">
                            <Stethoscope className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                              id="specialization"
                              name="specialization"
                              value={values.specialization}
                              onChange={handleChange}
                              required={isDoctor}
                              maxLength={150}
                              placeholder="e.g. General Physician"
                              className={`${inputClass} pl-11`}
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="qualification"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                          >
                            Qualifications *
                          </label>

                          <div className="relative">
                            <GraduationCap className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                              id="qualification"
                              name="qualification"
                              value={values.qualification}
                              onChange={handleChange}
                              required={isDoctor}
                              maxLength={200}
                              placeholder="e.g. MBBS, FCPS"
                              className={`${inputClass} pl-11`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Availability */}
                      <div className="rounded-2xl border border-primary/15 bg-primary/[0.035] p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <CalendarDays className="h-5 w-5" />
                          </div>

                          <div>
                            <h4 className="text-sm font-bold text-slate-900">
                              Your Available Dates
                            </h4>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              Pick up to three dates when you could support our
                              medical services. These are only preferences, not
                              confirmed appointments.
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                          {["First Date", "Second Date", "Third Date"].map(
                            (label, i) => (
                              <DatePicker
                                key={label}
                                id={`date${i + 1}`}
                                label={label}
                                value={values.dates[i]}
                                onChange={(iso) => handleDateChange(i, iso)}
                                disabledDates={values.dates.filter(
                                  (d, idx) => !!d && idx !== i,
                                )}
                              />
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Donation information */}
                {!isDoctor && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="mb-4 border-t border-slate-100 pt-6">
                      <h3 className="text-sm font-bold text-slate-800">
                        Your Contribution
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Let us know how you would like to support our mission.
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="amount"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        Intended Donation Amount (Optional)
                      </label>

                      <input
                        id="amount"
                        name="amount"
                        value={values.amount}
                        onChange={handleChange}
                        maxLength={100}
                        placeholder="e.g. BDT 5,000 or any amount"
                        className={inputClass}
                      />

                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        This only tells us you&apos;re interested. No payment is
                        taken through this form. Our team will contact you to
                        talk about your contribution.
                      </p>
                    </div>
                  </div>
                )}

                {/* Additional message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    {isDoctor
                      ? "Additional Information (Optional)"
                      : "Your Message (Optional)"}
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={values.message}
                    onChange={handleChange}
                    maxLength={1500}
                    placeholder={
                      isDoctor
                        ? "Share your experience or how you'd like to help..."
                        : "Tell us why you'd like to support our mission..."
                    }
                    className={`${inputClass} resize-y`}
                  />

                  <p className="mt-1 text-right text-xs text-slate-400">
                    {values.message.length}/1500
                  </p>
                </div>

                {/* Error */}
                {status === "error" && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </div>
                )}

                {/* Submission note */}
                <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-xs leading-5 text-slate-600">
                    Once you submit, our team will review your details and reply
                    by email. Nothing, including payments and appointments, is
                    confirmed automatically.
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      {isDoctor
                        ? "Submit Doctor Application"
                        : "Express Donation Interest"}
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </section>

        {/* WHAT HAPPENS NEXT */}
        <section className="mx-auto mt-16 max-w-5xl">
          <h2 className="text-center text-xl font-bold text-slate-900 sm:text-2xl">
            What Happens Next?
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-5">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <div
                key={title}
                className="relative rounded-2xl border border-slate-200/80 bg-white/70 p-6 pt-8 text-center backdrop-blur"
              >
                <span className="absolute -top-3 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {i + 1}
                </span>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-slate-400">
            Thank you for being part of our mission.
          </p>
        </section>
      </div>
    </main>
  );
}

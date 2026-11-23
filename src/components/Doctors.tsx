"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight,
  Clock,
  HeartHandshake,
  Laptop,
  MapPin,
  MessageCircle,
  Stethoscope,
  Users,
  type LucideIcon,
} from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Benefit = { icon: LucideIcon; title: string; text: string };
type DoctorProfile = { name: string; specialty: string; image: string };

/** Link for the main button. Change it if you add a dedicated doctor sign-up page. */
const JOIN_HREF = "/contribute";

/** Edit these so they match what you really offer to volunteer doctors. */
const benefits: Benefit[] = [
  {
    icon: Laptop,
    title: "Give advice from anywhere",
    text: "Talk to villagers from your clinic, your home or wherever you are.",
  },
  {
    icon: Clock,
    title: "Give the time you can spare",
    text: "Even a small amount of your time can help many families.",
  },
  {
    icon: Users,
    title: "We handle the rest",
    text: "Our team runs the campaigns and brings the patients to you.",
  },
];

const specialties: string[] = [
  "General medicine",
  "Child health",
  "Women’s health",
  "Skin care",
  "Eye care",
  "Mental health",
];

/**
 * Add your real doctors here (photos in /public/doctors/).
 * While this list is empty, the "Meet our doctors" row stays hidden.
 */
const doctors: DoctorProfile[] = [];

const dotGridStyle: CSSProperties = {
  backgroundImage:
    "radial-gradient(circle at center, rgba(255,255,255,0.2) 1px, transparent 1.6px)",
  backgroundSize: "24px 24px",
  maskImage: "radial-gradient(ellipse at 70% 30%, black 20%, transparent 75%)",
  WebkitMaskImage:
    "radial-gradient(ellipse at 70% 30%, black 20%, transparent 75%)",
};

export default function Doctors() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const bannerTrigger = { trigger: "[data-banner]", start: "top 75%" };

        gsap.from("[data-copy]", {
          y: 28,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: bannerTrigger,
        });

        gsap.from("[data-visual]", {
          y: 40,
          opacity: 0,
          duration: 0.9,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: bannerTrigger,
        });

        gsap.from("[data-chip]", {
          scale: 0.8,
          opacity: 0,
          duration: 0.5,
          stagger: 0.07,
          ease: "back.out(2)",
          scrollTrigger: { trigger: "[data-chips]", start: "top 92%" },
        });

        // Advice travelling from the doctor to the village, in a loop
        // that only runs while the card is on screen
        const loop = gsap.timeline({
          repeat: -1,
          scrollTrigger: {
            trigger: "[data-visual]",
            start: "top 90%",
            end: "bottom 10%",
            toggleActions: "play pause resume pause",
          },
        });

        loop
          .fromTo(
            "[data-dot]",
            { left: "0%", opacity: 0 },
            { opacity: 1, duration: 0.2 },
          )
          .to("[data-dot]", {
            left: "100%",
            duration: 1.8,
            ease: "power1.inOut",
          })
          .to("[data-dot]", { opacity: 0, duration: 0.2 })
          .fromTo(
            "[data-ring]",
            { scale: 1, opacity: 0.55 },
            {
              scale: 2.1,
              opacity: 0,
              duration: 0.9,
              ease: "power2.out",
              stagger: 0.18,
            },
            "<",
          )
          .to({}, { duration: 0.5 });

        if (doctors.length > 0) {
          gsap.from("[data-doctor]", {
            y: 30,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: "[data-doctors]", start: "top 85%" },
          });
        }
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="doctors" className="relative scroll-mt-24 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        {/* Join banner */}
        <div
          data-banner
          className="relative isolate overflow-hidden rounded-4xl bg-primary px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute inset-0" style={dotGridStyle} />
            <div className="absolute -right-20 -top-24 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />
            <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            {/* Copy */}
            <div>
              <h2
                data-copy
                className="text-balance text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-5xl"
              >
                Your time can reach a village that has no doctor nearby.
              </h2>

              <p
                data-copy
                className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
              >
                Many families in rural Bangladesh cannot easily see a doctor.
                When you join Teliclinicbd as a volunteer doctor, you give
                advice to people who need it most.
              </p>

              <ul className="mt-8 flex flex-col gap-4">
                {benefits.map(({ icon: Icon, title, text }) => (
                  <li key={title} data-copy className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/12 text-white ring-1 ring-white/20">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex flex-col leading-snug">
                      <span className="text-base font-semibold text-white">
                        {title}
                      </span>
                      <span className="mt-0.5 text-sm text-white/70">
                        {text}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <div
                data-copy
                className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
              >
                <Link
                  href={JOIN_HREF}
                  className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-white px-7 py-4 text-base font-semibold text-primary shadow-[0_14px_30px_-12px_rgba(0,0,0,0.5)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-surface focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary active:translate-y-0"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-primary/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                  <HeartHandshake className="relative h-5 w-5 text-secondary transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
                  <span className="relative">Join as a doctor</span>
                  <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-white/30 px-7 py-4 text-base font-semibold text-white outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary active:translate-y-0"
                >
                  <MessageCircle className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  Ask a question
                </Link>
              </div>
            </div>

            {/* Visual: advice travelling from doctor to village */}
            <div
              data-visual
              className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-md sm:p-8"
            >
              <p className="text-sm font-semibold text-white">
                Your advice, delivered to a village
              </p>

              <div className="mt-8 flex items-start">
                <div className="flex w-20 flex-col items-center gap-2.5">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-primary shadow-[0_14px_30px_-12px_rgba(0,0,0,0.5)]">
                    <Stethoscope className="h-7 w-7" />
                  </span>
                  <span className="text-sm font-medium text-white">You</span>
                </div>

                <div className="relative mt-8 h-0 flex-1 border-t-2 border-dashed border-white/40">
                  <span
                    data-dot
                    className="absolute top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary opacity-0 shadow-[0_0_12px_3px_rgba(32,165,69,0.7)]"
                  />
                </div>

                <div className="flex w-20 flex-col items-center gap-2.5">
                  <span className="relative flex h-16 w-16 items-center justify-center">
                    <span
                      data-ring
                      aria-hidden
                      className="absolute inset-0 rounded-2xl border-2 border-secondary opacity-0"
                    />
                    <span
                      data-ring
                      aria-hidden
                      className="absolute inset-0 rounded-2xl border-2 border-secondary opacity-0"
                    />
                    <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-white shadow-[0_14px_30px_-12px_rgba(0,0,0,0.5)]">
                      <MapPin className="h-7 w-7" />
                    </span>
                  </span>
                  <span className="text-sm font-medium text-white">
                    A village
                  </span>
                </div>
              </div>

              <div className="mt-8 border-t border-white/15 pt-6">
                <p className="text-sm text-white/75">
                  Doctors of every specialty are welcome.
                </p>
                <ul data-chips className="mt-4 flex flex-wrap gap-2">
                  {specialties.map((name) => (
                    <li
                      key={name}
                      data-chip
                      className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Current doctors (only shown once you add some) */}
        {doctors.length > 0 && (
          <div data-doctors className="mt-16 sm:mt-20">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Meet our doctors
            </h3>
            <ul className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {doctors.map((doc) => (
                <li key={doc.name} data-doctor className="group">
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-200">
                    <Image
                      src={doc.image}
                      alt={doc.name}
                      fill
                      sizes="(min-width: 1024px) 22vw, 45vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 text-base font-semibold text-slate-900">
                    {doc.name}
                  </p>
                  <p className="text-sm text-muted">{doc.specialty}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

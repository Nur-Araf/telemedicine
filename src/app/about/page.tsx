"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight,
  Eye,
  HeartHandshake,
  HeartPulse,
  MapPin,
  Scale,
  ShieldCheck,
  Stethoscope,
  Target,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type IconItem = { icon: LucideIcon; title: string; text: string };

/** Edit all of the text below so it tells your real story. */
const glance: IconItem[] = [
  {
    icon: HeartHandshake,
    title: "Non-profit",
    text: "Run to help people, not to make a profit",
  },
  {
    icon: MapPin,
    title: "Rural Bangladesh",
    text: "Campaigns in villages that need care most",
  },
  {
    icon: Wallet,
    title: "Very small fee",
    text: "Good advice stays within reach",
  },
];

const purpose: IconItem[] = [
  {
    icon: Target,
    title: "Our mission",
    text: "To bring trusted advice from good doctors to rural villages, for a very small fee.",
  },
  {
    icon: Eye,
    title: "Our vision",
    text: "A Bangladesh where every family, in every village, can reach a doctor when they need one.",
  },
];

const values: IconItem[] = [
  {
    icon: HeartPulse,
    title: "Care comes first",
    text: "Every person who speaks to a doctor deserves to be listened to with patience.",
  },
  {
    icon: Scale,
    title: "Fair and affordable",
    text: "We keep the fee very small so money is never the reason someone goes without advice.",
  },
  {
    icon: ShieldCheck,
    title: "Trust",
    text: "We work with good, experienced doctors and are open about how we work.",
  },
  {
    icon: Users,
    title: "Community",
    text: "We grow with the villages we serve, together with volunteers, doctors and supporters.",
  },
];

const dotGridStyle: CSSProperties = {
  backgroundImage:
    "radial-gradient(circle at center, rgba(23,84,154,0.16) 1px, transparent 1.6px)",
  backgroundSize: "24px 24px",
  maskImage: "radial-gradient(ellipse at 80% 20%, black 20%, transparent 70%)",
  WebkitMaskImage:
    "radial-gradient(ellipse at 80% 20%, black 20%, transparent 70%)",
};

/** Highlighter-pen bar that sweeps in behind its children. */
function Mark({ children }: { children: ReactNode }) {
  return (
    <span className="relative isolate inline-block">
      <span
        aria-hidden
        data-marker
        className="absolute inset-x-[-0.1em] bottom-[0.04em] top-[0.24em] -z-10 rounded-md bg-secondary/25"
      />
      {children}
    </span>
  );
}

export default function AboutContent() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Every [data-group] reveals its [data-item] children one after another
        gsap.utils.toArray<HTMLElement>("[data-group]").forEach((group) => {
          const items = group.querySelectorAll("[data-item]");
          if (items.length === 0) return;

          gsap.from(items, {
            y: 28,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: group, start: "top 85%" },
          });
        });

        // Highlighter sweep on the key phrase in the page heading
        gsap.from("[data-marker]", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.9,
          delay: 0.7,
          ease: "power2.inOut",
          stagger: 0.2,
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <main ref={root}>
      {/* Page header */}
      <section className="relative isolate overflow-hidden bg-linear-to-b from-surface via-white to-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0" style={dotGridStyle} />
          <div className="absolute -left-24 -top-24 h-112 w-md rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div
            data-group
            className="grid items-center gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16"
          >
            <div>
              <span
                data-item
                className="inline-flex items-center gap-2.5 rounded-full border border-secondary/25 bg-white/80 px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur"
              >
                <Stethoscope className="h-4 w-4 text-secondary" />
                About Teliclinicbd
              </span>

              <h1
                data-item
                className="mt-6 text-balance text-4xl font-bold leading-[1.12] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
              >
                Good health advice should not depend on{" "}
                <Mark>
                  <span className="text-primary">where you live.</span>
                </Mark>
              </h1>

              <p
                data-item
                className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
              >
                Teliclinicbd is a non-profit telemedicine organization. We run
                campaigns in rural villages of Bangladesh, where villagers can
                take advice from good doctors for a very small fee.
              </p>
            </div>

            {/* At a glance */}
            <ul
              data-item
              className="divide-y divide-slate-200/80 rounded-3xl border border-slate-200/80 bg-white/80 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.3)] backdrop-blur"
            >
              {glance.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-center gap-4 px-5 py-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface text-primary">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="flex flex-col leading-snug">
                    <span className="text-base font-semibold text-slate-900">
                      {title}
                    </span>
                    <span className="mt-0.5 text-sm text-muted">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Our story + mission and vision */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div data-group className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2
                data-item
                className="text-balance text-3xl font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-4xl"
              >
                Why we started
              </h2>
              <div className="mt-6 flex flex-col gap-4 text-base leading-relaxed text-muted sm:text-lg">
                <p data-item>
                  Many families in rural Bangladesh live far from a good doctor.
                  Travelling costs time and money, so a small health problem can
                  quietly turn into a big one.
                </p>
                <p data-item>
                  Teliclinicbd brings the doctor to the village instead. Through
                  our campaigns, people can ask about their health, get clear
                  advice and know what to do next, without leaving their
                  community.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {purpose.map(({ icon: Icon, title, text }) => (
                <div
                  key={title}
                  data-item
                  className="flex items-start gap-5 rounded-3xl border border-slate-200/80 bg-surface p-6 transition-colors duration-300 hover:border-primary/30 sm:p-8"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_10px_22px_-8px_rgba(23,84,154,0.8)]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {title}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-muted">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

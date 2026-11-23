"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight,
  HeartHandshake,
  HeartPulse,
  MapPin,
  Pill,
  ShieldCheck,
  Stethoscope,
  Thermometer,
  Wallet,
  type LucideIcon,
} from "lucide-react";

gsap.registerPlugin(useGSAP);

type TrustItem = { icon: LucideIcon; title: string; text: string };
type FloatChip = { icon: LucideIcon; position: string; tone: string };

const trust: TrustItem[] = [
  {
    icon: ShieldCheck,
    title: "Experienced doctors",
    text: "Advice you can trust",
  },
  { icon: Wallet, title: "Very small fee", text: "Care within reach" },
  {
    icon: MapPin,
    title: "Made for villages",
    text: "Campaigns across rural Bangladesh",
  },
];

const chips: FloatChip[] = [
  { icon: Stethoscope, position: "left-[6%] top-[24%]", tone: "text-primary" },
  {
    icon: HeartPulse,
    position: "right-[7%] top-[20%]",
    tone: "text-secondary",
  },
  { icon: Pill, position: "left-[10%] bottom-[34%]", tone: "text-secondary" },
  {
    icon: Thermometer,
    position: "right-[11%] bottom-[36%]",
    tone: "text-primary",
  },
];

const ECG_PATH =
  "M0 60 H150 L165 60 L175 48 L187 60 L205 60 L215 68 L228 8 L242 104 L254 60 L275 60 L290 46 L306 60 H520 L535 60 L545 48 L557 60 L575 60 L585 68 L598 8 L612 104 L624 60 L645 60 L660 46 L676 60 H900 L915 60 L925 48 L937 60 L955 60 L965 68 L978 8 L992 104 L1004 60 L1025 60 L1040 46 L1056 60 H1200";

const dotGridStyle: CSSProperties = {
  backgroundImage:
    "radial-gradient(circle at center, rgba(23,84,154,0.16) 1px, transparent 1.6px)",
  backgroundSize: "24px 24px",
  maskImage: "radial-gradient(ellipse at center, black 25%, transparent 72%)",
  WebkitMaskImage:
    "radial-gradient(ellipse at center, black 25%, transparent 72%)",
};

const ecgMaskStyle: CSSProperties = {
  maskImage:
    "linear-gradient(to right, transparent, black 18%, black 82%, transparent)",
  WebkitMaskImage:
    "linear-gradient(to right, transparent, black 18%, black 82%, transparent)",
};

/** A word that slides up out of a mask when the headline animates in. */
function W({ children }: { children: ReactNode }) {
  return (
    <span className="-mb-[0.15em] inline-block overflow-hidden pb-[0.15em] align-bottom">
      <span data-word className="inline-block will-change-transform">
        {children}
      </span>
    </span>
  );
}

/** Highlighter-pen bar that sweeps in behind its children. */
function Mark({ children, bar }: { children: ReactNode; bar: string }) {
  return (
    <span className="relative isolate inline-block">
      <span
        aria-hidden
        data-marker
        className={`absolute -z-10 rounded-md ${bar}`}
      />
      {children}
    </span>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Entrance sequence
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from("[data-pill]", { y: 16, opacity: 0, duration: 0.6 })
          .from(
            "[data-word]",
            { yPercent: 115, duration: 0.9, stagger: 0.07 },
            "-=0.2",
          )
          .from(
            "[data-marker]",
            {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 0.8,
              ease: "power2.inOut",
              stagger: 0.2,
            },
            "-=0.2",
          )
          .fromTo(
            "[data-underline]",
            { strokeDasharray: 1, strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" },
            "-=0.6",
          )
          .from(
            "[data-fade]",
            { y: 22, opacity: 0, duration: 0.7, stagger: 0.12 },
            "-=0.5",
          )
          .from(
            "[data-chip]",
            {
              scale: 0,
              opacity: 0,
              duration: 0.7,
              ease: "back.out(2)",
              stagger: 0.12,
            },
            "-=0.6",
          );

        // Idle float on the decorative chips
        gsap.utils
          .toArray<HTMLElement>("[data-chip-float]")
          .forEach((el, i) => {
            gsap.to(el, {
              y: i % 2 === 0 ? -10 : 10,
              duration: 2.6 + i * 0.45,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            });
          });

        // Heartbeat pulse travelling along the ECG line
        gsap.set("[data-ecg-pulse]", { opacity: 1, strokeDasharray: "0.18 1" });
        gsap.fromTo(
          "[data-ecg-pulse]",
          { strokeDashoffset: 0.18 },
          {
            strokeDashoffset: -1,
            duration: 3.2,
            ease: "none",
            repeat: -1,
            repeatDelay: 0.5,
          },
        );
      });

      // Soft spotlight that follows the cursor (mouse devices only)
      mm.add(
        "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)",
        () => {
          const section = root.current;
          const spot = section?.querySelector<HTMLElement>("[data-spot]");
          if (!section || !spot) return;

          const half = spot.offsetWidth / 2;
          const moveX = gsap.quickTo(spot, "x", {
            duration: 0.9,
            ease: "power3.out",
          });
          const moveY = gsap.quickTo(spot, "y", {
            duration: 0.9,
            ease: "power3.out",
          });

          const onMove = (e: PointerEvent) => {
            const rect = section.getBoundingClientRect();
            moveX(e.clientX - rect.left - half);
            moveY(e.clientY - rect.top - half);
          };
          const onEnter = () => gsap.to(spot, { opacity: 1, duration: 0.5 });
          const onLeave = () => gsap.to(spot, { opacity: 0, duration: 0.5 });

          section.addEventListener("pointermove", onMove);
          section.addEventListener("pointerenter", onEnter);
          section.addEventListener("pointerleave", onLeave);

          return () => {
            section.removeEventListener("pointermove", onMove);
            section.removeEventListener("pointerenter", onEnter);
            section.removeEventListener("pointerleave", onLeave);
          };
        },
      );

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative isolate overflow-hidden bg-linear-to-b from-surface via-white to-white"
    >
      {/* Background layers */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0" style={dotGridStyle} />
        <div className="absolute -left-24 -top-24 h-112 w-md rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-112 w-md rounded-full bg-secondary/10 blur-3xl" />
        <div
          data-spot
          className="absolute left-0 top-0 h-120 w-120 rounded-full bg-primary/10 opacity-0 blur-3xl"
        />
      </div>

      {/* Heartbeat line along the bottom */}
      <svg
        aria-hidden
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        fill="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-24 w-full sm:h-28"
        style={ecgMaskStyle}
      >
        <path
          d={ECG_PATH}
          pathLength={1}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="text-primary/20"
        />
        <path
          data-ecg-pulse
          d={ECG_PATH}
          pathLength={1}
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="text-secondary opacity-0"
          style={{ filter: "drop-shadow(0 0 6px rgba(32,165,69,0.65))" }}
        />
      </svg>

      {/* Floating decorative chips (large screens only) */}
      {chips.map(({ icon: Icon, position, tone }, i) => (
        <div
          key={i}
          data-chip
          aria-hidden
          className={`absolute hidden xl:block ${position}`}
        >
          <div
            data-chip-float
            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200/80 bg-white shadow-[0_16px_36px_-16px_rgba(15,23,42,0.35)]"
          >
            <Icon className={`h-6 w-6 ${tone}`} />
          </div>
        </div>
      ))}

      {/* Content */}
      <div className="mx-auto w-full max-w-7xl px-4 pb-32 pt-14 sm:px-6 sm:pb-36 sm:pt-20 lg:px-8 lg:pt-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <span
            data-pill
            className="inline-flex items-center gap-2.5 rounded-full border border-secondary/25 bg-white/80 px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-secondary" />
            </span>
            Non-profit telemedicine for rural Bangladesh
          </span>

          <h1 className="mt-7 text-balance text-[2.5rem] font-bold leading-[1.12] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
            <Mark bar="inset-x-[-0.12em] bottom-[0.04em] top-[0.24em] bg-secondary/25">
              <W>Good</W> <W>doctors’</W> <W>advice,</W>
            </Mark>{" "}
            <W>now</W> <W>within</W> <W>reach</W> <W>of</W>{" "}
            <span className="relative inline-block text-primary">
              <W>every</W> <W>village.</W>
              <svg
                aria-hidden
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                fill="none"
                className="absolute -bottom-1 left-0 h-2.5 w-full text-secondary sm:-bottom-2 sm:h-3"
              >
                <path
                  data-underline
                  d="M2 8 C 40 2, 70 12, 110 6 S 170 3, 198 8"
                  pathLength={1}
                  stroke="currentColor"
                  strokeWidth={4}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </span>
          </h1>

          <p
            data-fade
            className="mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
          >
            Teliclinicbd is a non-profit running health campaigns across rural
            Bangladesh. Talk to{" "}
            <Mark bar="inset-x-[-2px] bottom-0 h-[0.55em] bg-secondary/25">
              <span className="font-semibold text-slate-800">
                experienced doctors
              </span>
            </Mark>{" "}
            from your own village for a{" "}
            <Mark bar="inset-x-[-2px] bottom-0 h-[0.55em] bg-primary/15">
              <span className="font-semibold text-slate-800">
                very small fee
              </span>
            </Mark>
            , without travelling far from home.
          </p>

          <div
            data-fade
            className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4"
          >
            <Link
              href="/contact"
              className="group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-primary px-7 py-4 text-base font-semibold text-white shadow-[0_14px_30px_-12px_rgba(23,84,154,0.85)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_18px_36px_-12px_rgba(23,84,154,0.9)] focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 active:translate-y-0 sm:w-auto"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
              <Stethoscope className="relative h-5 w-5" />
              <span className="relative">Get doctor advice</span>
              <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/contribute"
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-slate-200 bg-white px-7 py-4 text-base font-semibold text-slate-700 shadow-sm outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/50 hover:bg-secondary/5 hover:text-secondary-dark focus-visible:ring-2 focus-visible:ring-secondary/50 focus-visible:ring-offset-2 active:translate-y-0 sm:w-auto"
            >
              <HeartHandshake className="h-5 w-5 text-secondary transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
              Contribute
            </Link>
          </div>

          <ul
            data-fade
            className="mt-14 grid w-full max-w-3xl grid-cols-1 divide-y divide-slate-200/80 rounded-2xl border border-slate-200/80 bg-white/75 text-left shadow-[0_18px_40px_-24px_rgba(15,23,42,0.3)] backdrop-blur sm:grid-cols-3 sm:divide-x sm:divide-y-0"
          >
            {trust.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-center gap-3 px-5 py-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold text-slate-800">
                    {title}
                  </span>
                  <span className="mt-0.5 text-xs text-muted">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

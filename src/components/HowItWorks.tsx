"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight,
  ClipboardList,
  MapPin,
  MessageCircleHeart,
  Stethoscope,
  Video,
  type LucideIcon,
} from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Step = { icon: LucideIcon; title: string; text: string };

/** Edit these so they match exactly how a Teliclinicbd campaign runs. */
const steps: Step[] = [
  {
    icon: MapPin,
    title: "Visit a campaign",
    text: "Come to a Teliclinicbd campaign in or near your village. Our team will welcome you and help you get started.",
  },
  {
    icon: ClipboardList,
    title: "Tell us your problem",
    text: "Share what is troubling you. Our team notes it down so the doctor can understand quickly.",
  },
  {
    icon: Video,
    title: "Talk to a doctor",
    text: "You are connected to an experienced doctor who listens, asks questions and takes your problem seriously.",
  },
  {
    icon: MessageCircleHeart,
    title: "Get clear advice",
    text: "The doctor explains what to do next in simple words. You pay only a very small fee.",
  },
];

export default function HowItWorks() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Heading block
        gsap.from("[data-head]", {
          y: 28,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-head-wrap]", start: "top 82%" },
        });

        // Progress line grows as you scroll through the steps
        gsap.fromTo(
          "[data-progress]",
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: {
              trigger: "[data-list]",
              start: "top 65%",
              end: "bottom 65%",
              scrub: true,
            },
          },
        );

        // Each step lights up when the line reaches it
        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
          ScrollTrigger.create({
            trigger: step,
            start: "top 65%",
            onEnter: () => {
              step.dataset.active = "true";
            },
            onLeaveBack: () => {
              step.dataset.active = "false";
            },
          });
        });
      });

      // Reduced motion: show everything as already reached
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
          step.dataset.active = "true";
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="how-it-works"
      className="relative scroll-mt-24 bg-surface"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* Left: heading (stays in view while the steps scroll) */}
          <div data-head-wrap className="lg:sticky lg:top-32 lg:self-start">
            <h2
              data-head
              className="text-balance text-3xl font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
            >
              Getting advice takes four simple steps.
            </h2>
            <p
              data-head
              className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg"
            >
              No long journey and no confusing process. Here is what to expect
              when you visit a Teliclinicbd campaign.
            </p>
            <div data-head className="mt-8">
              <Link
                href="/contact"
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(23,84,154,0.85)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 active:translate-y-0"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                <Stethoscope className="relative h-4.5 w-4.5" />
                <span className="relative">Get doctor advice</span>
                <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right: timeline */}
          <div className="relative">
            <div
              aria-hidden
              className="absolute bottom-6 left-6 top-6 w-0.5 -translate-x-1/2 rounded-full bg-slate-200"
            />
            <div
              aria-hidden
              data-progress
              className="absolute bottom-6 left-6 top-6 w-0.5 -translate-x-1/2 rounded-full bg-linear-to-b from-primary to-secondary"
            />

            <ol data-list className="relative flex flex-col gap-6 sm:gap-8">
              {steps.map(({ icon: Icon, title, text }, i) => (
                <li
                  key={title}
                  data-step
                  data-active="false"
                  className="group flex gap-4 sm:gap-6"
                >
                  <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-base font-bold text-slate-400 transition-all duration-500 group-data-[active=true]:border-primary group-data-[active=true]:bg-primary group-data-[active=true]:text-white group-data-[active=true]:shadow-[0_10px_22px_-8px_rgba(23,84,154,0.8)]">
                    {i + 1}
                  </span>

                  <div className="flex-1 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_-22px_rgba(15,23,42,0.35)] transition-all duration-500 hover:border-primary/30 group-data-[active=true]:border-primary/25 group-data-[active=true]:shadow-[0_18px_40px_-22px_rgba(23,84,154,0.45)] sm:p-6">
                    <div className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface text-primary transition-colors duration-500 group-data-[active=true]:bg-secondary/10 group-data-[active=true]:text-secondary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted sm:text-base">
                          {text}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

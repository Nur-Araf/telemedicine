"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight,
  HeartHandshake,
  MapPin,
  Stethoscope,
  Wallet,
  type LucideIcon,
} from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type CampaignPhoto = {
  src: string;
  alt: string;
  title: string;
  text: string;
  aspect: string;
  offset: string;
};

type Step = { icon: LucideIcon; title: string; text: string };

/**
 * Put your two photos in /public/campaigns/ and edit the text below
 * so it describes what each photo really shows.
 */
const photos: CampaignPhoto[] = [
  {
    src: "/campaign-1.png",
    alt: "Villagers gathered at a Teliclinicbd health campaign",
    title: "The village comes together",
    text: "Families meet our team and ask about everyday health problems.",
    aspect: "aspect-[4/5]",
    offset: "",
  },
  {
    src: "/campaign-2.jpg",
    alt: "A Teliclinicbd team member helping a villager during a consultation",
    title: "Help at every step",
    text: "Our team sits with each person and connects them to a doctor.",
    aspect: "aspect-[4/5] md:aspect-square",
    offset: "md:mt-16",
  },
];

const steps: Step[] = [
  {
    icon: MapPin,
    title: "We come to your village",
    text: "Campaigns are set up in rural areas, close to where families live.",
  },
  {
    icon: Stethoscope,
    title: "Talk to a doctor",
    text: "Ask about your health problem and get clear, caring advice.",
  },
  {
    icon: Wallet,
    title: "Pay a very small fee",
    text: "Good care stays within reach for every family.",
  },
];

export default function Campaigns() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Heading block
        gsap.from("[data-head]", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-head-wrap]", start: "top 82%" },
        });

        // Photo cards: reveal from the bottom, settle the zoom, drift on scroll
        gsap.utils.toArray<HTMLElement>("[data-card]").forEach((card) => {
          const zoom = card.querySelector<HTMLElement>("[data-zoom]");
          const drift = card.querySelector<HTMLElement>("[data-drift]");
          const caption = card.querySelector<HTMLElement>("[data-caption]");
          const trigger = { trigger: card, start: "top 85%" };

          gsap.fromTo(
            card,
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.1,
              ease: "power3.inOut",
              scrollTrigger: trigger,
            },
          );

          if (zoom) {
            gsap.from(zoom, {
              scale: 1.3,
              duration: 1.7,
              ease: "power3.out",
              scrollTrigger: trigger,
            });
          }

          if (caption) {
            gsap.from(caption, {
              y: 24,
              opacity: 0,
              duration: 0.7,
              delay: 0.7,
              ease: "power3.out",
              scrollTrigger: trigger,
            });
          }

          if (drift) {
            gsap.fromTo(
              drift,
              { yPercent: -5 },
              {
                yPercent: 5,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          }
        });

        // Steps: line draws across, then each step rises in
        const stepsTrigger = { trigger: "[data-steps]", start: "top 85%" };

        gsap.from("[data-line]", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.1,
          ease: "power2.inOut",
          scrollTrigger: stepsTrigger,
        });

        gsap.from("[data-step]", {
          y: 26,
          opacity: 0,
          duration: 0.7,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: stepsTrigger,
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="campaigns"
      className="relative scroll-mt-24 overflow-hidden bg-white"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        {/* Heading */}
        <div
          data-head-wrap
          className="grid items-end gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16"
        >
          <h2
            data-head
            className="text-balance text-3xl font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
          >
            Our campaigns reach people where they live.
          </h2>

          <div data-head className="flex flex-col items-start gap-5">
            <p className="text-base leading-relaxed text-muted sm:text-lg">
              Our teams set up in rural villages across Bangladesh, so families
              can ask a doctor about their health without travelling far from
              home.
            </p>
            <Link
              href="/contribute"
              className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/50 hover:bg-secondary/5 hover:text-secondary-dark focus-visible:ring-2 focus-visible:ring-secondary/50 focus-visible:ring-offset-2"
            >
              <HeartHandshake className="h-4.5 w-4.5 text-secondary transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
              Support a campaign
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Photos */}
        <div className="mt-12 grid gap-6 sm:mt-16 md:grid-cols-2 md:gap-8">
          {photos.map((photo, i) => (
            <figure
              key={photo.src}
              data-card
              className={`group relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 ${photo.aspect} ${photo.offset}`}
            >
              <div data-drift className="absolute inset-x-0 -top-[7%] h-[114%]">
                <Image
                  data-zoom
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-slate-900/45 to-transparent"
              />

              <figcaption
                data-caption
                className="absolute inset-x-4 bottom-4 flex items-start gap-3 rounded-2xl border border-white/60 bg-white/90 p-4 backdrop-blur-md transition-transform duration-500 group-hover:-translate-y-1.5 sm:inset-x-5 sm:bottom-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                  <MapPin className="h-5 w-5" />
                </span>
                <span className="flex flex-col leading-snug">
                  <span className="text-sm font-semibold text-slate-900 sm:text-base">
                    {photo.title}
                  </span>
                  <span className="mt-0.5 text-sm text-muted">
                    {photo.text}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* How a campaign works (a real sequence, so the connecting line makes sense) */}
        <div
          data-steps
          className="relative mt-16 rounded-3xl bg-surface px-5 py-10 sm:mt-24 sm:px-10 sm:py-12"
        >
          <div
            aria-hidden
            data-line
            className="absolute left-[18%] right-[18%] top-[4.35rem] hidden border-t-2 border-dashed border-primary/25 md:block"
          />

          <ol className="relative grid gap-10 md:grid-cols-3 md:gap-6">
            {steps.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                data-step
                className="flex flex-col items-center text-center"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/15 bg-white text-primary shadow-[0_10px_24px_-12px_rgba(23,84,154,0.5)]">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
                  {text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

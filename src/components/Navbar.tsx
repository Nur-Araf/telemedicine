"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HeartHandshake,
  Home,
  Info,
  Mail,
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";

type NavLink = {
  name: string;
  href: string;
  icon: LucideIcon;
  hint: string;
};

const navLinks: NavLink[] = [
  { name: "Home", href: "/", icon: Home, hint: "Back to the start" },
  {
    name: "About Us",
    href: "/about",
    icon: Info,
    hint: "Who we are and what we do",
  },
  {
    name: "Contact Us",
    href: "/contact",
    icon: Mail,
    hint: "Questions or support",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Shadow + stronger glass once the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-6 sm:pt-4 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <nav
          aria-label="Main"
          className={`flex items-center justify-between gap-4 rounded-2xl border px-3 py-2.5 backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 sm:px-5 sm:py-3 ${
            scrolled
              ? "border-slate-200 bg-white/90 shadow-[0_12px_36px_-14px_rgba(23,84,154,0.35)]"
              : "border-slate-200/70 bg-white/75 shadow-[0_4px_20px_-12px_rgba(15,23,42,0.18)]"
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            aria-label="Teliclinicbd home"
            className="group flex shrink-0 items-center rounded-xl px-1 py-0.5 outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Image
              src="/logo.jpg"
              alt="Teliclinicbd"
              width={220}
              height={120}
              priority
              className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-12 lg:h-14"
            />
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 rounded-full border border-slate-200/80 bg-surface p-1 md:flex">
            {navLinks.map(({ name, href, icon: Icon }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary/40 ${
                      active
                        ? "bg-primary text-white shadow-[0_8px_18px_-8px_rgba(23,84,154,0.8)]"
                        : "text-slate-600 hover:bg-white hover:text-primary hover:shadow-sm"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 transition-transform duration-300 ${
                        active
                          ? ""
                          : "group-hover:-translate-y-0.5 group-hover:scale-110"
                      }`}
                    />
                    {name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/contribute"
              className="group relative hidden items-center gap-2 overflow-hidden rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(32,165,69,0.75)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary-dark hover:shadow-[0_14px_28px_-10px_rgba(32,165,69,0.8)] focus-visible:ring-2 focus-visible:ring-secondary/50 focus-visible:ring-offset-2 active:translate-y-0 sm:inline-flex"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
              <HeartHandshake className="relative h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
              <span className="relative">Contribute</span>
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary/40 md:hidden ${
                open
                  ? "border-primary/20 bg-primary text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-primary/30 hover:bg-surface hover:text-primary"
              }`}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile panel */}
        <div
          id="mobile-menu"
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out md:hidden ${
            open
              ? "grid-rows-[1fr] opacity-100"
              : "pointer-events-none grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="mt-2 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-[0_18px_40px_-16px_rgba(15,23,42,0.25)] backdrop-blur-xl">
              <ul className="flex flex-col gap-1">
                {navLinks.map(({ name, href, icon: Icon, hint }) => {
                  const active = isActive(href);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        aria-current={active ? "page" : undefined}
                        tabIndex={open ? 0 : -1}
                        className={`group flex items-center gap-3 rounded-xl px-3 py-3 outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-primary/40 ${
                          active ? "bg-primary/10" : "hover:bg-surface"
                        }`}
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
                            active
                              ? "bg-primary text-white"
                              : "bg-surface text-primary group-hover:bg-primary group-hover:text-white"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="flex flex-col">
                          <span
                            className={`text-sm font-semibold ${
                              active ? "text-primary" : "text-slate-800"
                            }`}
                          >
                            {name}
                          </span>
                          <span className="text-xs text-muted">{hint}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <Link
                href="/contribute"
                tabIndex={open ? 0 : -1}
                className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-secondary px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(32,165,69,0.75)] outline-none transition-all duration-300 hover:bg-secondary-dark focus-visible:ring-2 focus-visible:ring-secondary/50 sm:hidden"
              >
                <HeartHandshake className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                Contribute
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

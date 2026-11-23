import Image from "next/image";
import Link from "next/link";
import {
  HeartHandshake,
  Mail,
  MapPin,
  Phone,
  type LucideIcon,
} from "lucide-react";

type FooterLink = { name: string; href: string };
type ContactItem = { icon: LucideIcon; label: string; href?: string };

const exploreLinks: FooterLink[] = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Our Campaigns", href: "/#campaigns" },
  { name: "How It Works", href: "/#how-it-works" },
];

const involvedLinks: FooterLink[] = [
  { name: "Contribute", href: "/contribute" },
  { name: "Join as a doctor", href: "/contribute" },
  { name: "Our Doctors", href: "/#doctors" },
  { name: "Contact Us", href: "/contact" },
];

/** Replace these with your real contact details. */
const contacts: ContactItem[] = [
  {
    icon: Mail,
    label: "info@teliclinicbd.org",
    href: "mailto:info@teliclinicbd.org",
  },
  { icon: Phone, label: "+880 1XXX-XXXXXX", href: "tel:+8801000000000" },
  { icon: MapPin, label: "Your address, Bangladesh" },
];

const linkClass =
  "text-sm text-muted outline-none transition-colors duration-300 hover:text-primary focus-visible:text-primary focus-visible:underline";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-surface">
      <div className="mx-auto w-full max-w-7xl px-4 pt-14 sm:px-6 sm:pt-16 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              aria-label="Teliclinicbd home"
              className="inline-block"
            >
              <Image
                src="/logo.jpg"
                alt="Teliclinicbd"
                width={200}
                height={110}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Teliclinicbd is a non-profit telemedicine initiative bringing
              doctors’ advice to rural villages in Bangladesh for a very small
              fee.
            </p>
            <Link
              href="/contribute"
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(32,165,69,0.7)] outline-none transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary-dark focus-visible:ring-2 focus-visible:ring-secondary/50 focus-visible:ring-offset-2 active:translate-y-0"
            >
              <HeartHandshake className="h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" />
              Contribute
            </Link>
          </div>

          {/* Explore */}
          <nav aria-label="Explore">
            <h3 className="text-sm font-semibold text-slate-900">Explore</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className={linkClass}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Get involved */}
          <nav aria-label="Get involved">
            <h3 className="text-sm font-semibold text-slate-900">
              Get involved
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {involvedLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className={linkClass}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Contact</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {contacts.map(({ icon: Icon, label, href }) => (
                <li key={label} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-primary ring-1 ring-slate-200">
                    <Icon className="h-4 w-4" />
                  </span>
                  {href ? (
                    <a href={href} className={`${linkClass} pt-1.5`}>
                      {label}
                    </a>
                  ) : (
                    <span className="pt-1.5 text-sm text-muted">{label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-slate-200 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-muted">
            © {year} Teliclinicbd. All rights reserved.
          </p>
          <p className="text-sm text-muted">
            Good doctors’ advice for every village.
          </p>
        </div>
      </div>
    </footer>
  );
}

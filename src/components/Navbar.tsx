import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { name: "Contribute", href: "/contribute" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.jpg"
            alt="Teliclinicbd"
            width={180}
            height={110}
            priority
            className="h-auto w-36 object-contain sm:w-44"
          />
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-700 transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Contribute Button */}
        <Link
          href="/contribute"
          className="rounded-full bg-secondary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-secondary-dark hover:shadow-md sm:px-6"
        >
          Contribute
        </Link>
      </nav>
    </header>
  );
}

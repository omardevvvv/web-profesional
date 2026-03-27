"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#0A1628]/95 backdrop-blur-sm shadow-lg"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-[#D4A843] rounded-sm flex items-center justify-center">
              <span className="text-[#0A1628] font-bold text-sm font-[var(--font-heading)]">
                D
              </span>
            </div>
            <span className="text-white font-semibold text-lg tracking-wide hidden sm:block font-[var(--font-heading)]">
              Despacho Contable
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white/80 hover:text-[#D4A843] text-sm font-medium transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
            <Button
              asChild
              className="bg-[#D4A843] hover:bg-[#F0C75E] text-[#0A1628] font-semibold text-sm px-5"
            >
              <Link href="#contacto">Consulta Gratuita</Link>
            </Button>
          </div>

          {/* Mobile nav */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-white hover:bg-white/10 transition-colors"
              aria-label="Abrir menú"
            >
              <Menu className="w-6 h-6" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-[#0A1628] border-[#1A2A4A] w-72"
            >
              <div className="flex flex-col gap-6 mt-8">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-white/80 hover:text-[#D4A843] text-lg font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
                <Button
                  asChild
                  className="bg-[#D4A843] hover:bg-[#F0C75E] text-[#0A1628] font-semibold mt-4"
                >
                  <Link href="#contacto" onClick={() => setOpen(false)}>
                    Consulta Gratuita
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

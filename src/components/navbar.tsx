"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#forex", label: "Forex" },
  { href: "#real-estate", label: "Real Estate" },
  { href: "#loans", label: "Loans" },
  { href: "#about", label: "About" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="relative fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">A</span>
            </div>
            <span className="text-sm md:text-base font-semibold text-foreground">
              Apex <span className="text-primary">Meridian</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-300 hover:text-yellow-500 text-2xl">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#0a1628] border-b border-yellow-900/30 p-4 space-y-3 z-50">
            {['Home', 'Forex', 'Real Estate', 'Loans', 'About'].map((item) => (
              <a key={item} href="#" 
                className="block text-gray-300 hover:text-yellow-500 py-2 text-sm">
                {item}
              </a>
            ))}
            <div className="flex gap-3 pt-3 border-t border-yellow-900/30">
              <Link href="/login" className="flex-1 text-center py-2 border border-yellow-500 text-yellow-500 rounded-lg text-sm">
                Sign In
              </Link>
              <Link href="/register" className="flex-1 text-center py-2 bg-yellow-600 text-white rounded-lg text-sm">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { GoArrowRight } from "react-icons/go";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "How it works", href: "/how-it-works" },
  { name: "Pricing", href: "/pricing" },
  { name: "Partnership", href: "#" },
  { name: "ASEE 2025", href: "/asee-2025" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="flex flex-col fixed top-0 left-0 right-0 z-50">
      {/* Promotional Banner */}
      <div className="bg-secondary gap-1 py-2.5 px-4">
        <Link
          href="https://app.bluesandstemlabs.com/auth/login"
          className=" flex items-center justify-center"
        >
          <p className="text-white text-xs sm:text-sm font-sans text-center">
            Sign up to get started now
          </p>
          <GoArrowRight className="text-white text-base sm:text-xl flex-shrink-0" />
        </Link>
      </div>

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

        {/* Desktop Navigation Links */}
        <ul className="hidden lg:flex flex-row items-center space-x-8 font-sans text-sm font-medium text-foreground">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className="hover:text-primary transition-all duration-300 relative px-3 py-2 rounded-md hover:bg-primary/5 hover:scale-105"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop Action Buttons */}

        <div className="hidden lg:flex items-center gap-3">
          <Link href="https://app.bluesandstemlabs.com/auth/login">
            <button className="px-5 py-2.5 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200 cursor-pointer">
              Sign in
            </button>
          </Link>
          <Link href="https://app.bluesandstemlabs.com/auth/register">
            <button className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer">
              Get Started
            </button>
          </Link>
        </div>

    const handleEscape = (e) => {
      if (e.key === "Escape") closeMenu();
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-50 flex flex-col bg-white"
      >
        {/* Promotional Banner */}
        <div className="bg-secondary flex items-center justify-center gap-1.5 py-2 px-3 text-center text-xs sm:text-sm">
          <p className="text-white font-medium">Sign up to get started now</p>
          <GoArrowRight className="text-white text-sm sm:text-base" />
        </div>

        {/* Main Nav */}
        <nav className="flex items-center justify-between px-3 sm:px-5 lg:px-8 xl:px-12 2xl:px-16 py-3 sm:py-4 shadow-sm">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <Image
              src="/logo.png"
              width={140}
              height={48}
              alt="Blue Stem Labs Logo"
              className="h-7 sm:h-9 w-auto"
              priority
            />
          </a>

          {/* Desktop Links */}
          <ul className="hidden lg:flex items-center gap-3 xl:gap-5">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-foreground hover:text-primary transition-all duration-300 px-2.5 py-1.5 rounded-md hover:bg-primary/5 whitespace-nowrap"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3">
            <a
              href="/get-started"
              className="px-5 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            className="lg:hidden p-1.5 text-foreground hover:text-primary transition-colors"
          >
            {isMenuOpen ? (
              <IoClose className="h-6 w-6 sm:h-7 sm:w-7" />
            ) : (
              <HiMenuAlt3 className="h-6 w-6 sm:h-7 sm:w-7" />
            )}
          </button>
        </nav>
      </header>

      {/* Mobile Backdrop */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        style={{ top: `${headerHeight}px` }}
        className={`lg:hidden fixed right-0 bottom-0 w-full max-w-[320px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full max-h-screen overflow-y-auto">
          <nav className="flex-1 p-4 sm:p-5 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                className="block px-4 py-3 text-base font-medium text-foreground hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="border-t border-gray-100 p-4 sm:p-5 space-y-2">
            <a
              href="/signin"
              onClick={closeMenu}
              className="block w-full text-center px-4 py-3 text-sm font-medium text-foreground border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Sign in
            </a>
            <a
              href="/get-started"
              onClick={closeMenu}
              className="block w-full text-center px-5 py-3 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-all shadow-md"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

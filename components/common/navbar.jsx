"use client";

import Image from "next/image";
import React, { useState } from "react";
import { GoArrowRight } from "react-icons/go";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "VirtualSTEMLabs", href: "#" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="flex flex-col fixed top-0 left-0 right-0 z-50">
      {/* Promotional Banner */}
      <div className="bg-secondary flex items-center justify-center gap-1 py-2.5 px-4">
        <p className="text-white text-xs sm:text-sm font-sans text-center">
          Free Courses 🌟 Sale Ends Soon, Get It Now
        </p>
        <GoArrowRight className="text-white text-base sm:text-xl flex-shrink-0" />
      </div>

      {/* Main Navigation */}
      <nav className="flex justify-between items-center px-4 sm:px-6 lg:px-8 py-4 bg-white shadow-sm">
        {/* Logo */}
        <div className="flex items-center z-50">
          <Image
            src="/logo.png"
            width={120}
            height={40}
            alt="Blue Stem Labs Logo"
            className="h-8 sm:h-10 w-auto"
          />
        </div>

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
          <button className="px-5 py-2.5 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200">
            Sign in
          </button>
          <button className="px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-md hover:shadow-lg">
            Get Started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden z-50 text-foreground hover:text-primary transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <IoClose className="w-7 h-7" />
          ) : (
            <HiMenuAlt3 className="w-7 h-7" />
          )}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      ></div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-[88px] right-0 bottom-0 w-full sm:w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Navigation Links */}
          <ul className="flex flex-col p-6 space-y-1 font-sans">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="block px-4 py-3 text-base font-medium text-foreground hover:bg-gray-50 hover:text-primary rounded-lg transition-all duration-200"
                  onClick={toggleMenu}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Action Buttons */}
          <div className="mt-auto p-6 border-t border-gray-100 space-y-3">
            <button
              className="w-full px-5 py-3 text-sm font-medium text-foreground border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
              onClick={toggleMenu}
            >
              Sign in
            </button>
            <button
              className="w-full px-6 py-3 bg-primary text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-md"
              onClick={toggleMenu}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import { Toaster } from "react-hot-toast";

const jarkataSans = Plus_Jakarta_Sans({
  variable: "--font-jarkata",
  subsets: ["latin"],
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "BLUESANDS STEM LABS | Africa STEM EdTech Expo",
  description:
    "Africa STEM EdTech Expo - Empowering the next generation through STEM education",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/*
         * Tell the browser to open a TCP+TLS connection to Cloudinary's CDN
         * before the first image request arrives. Saves ~150-300 ms on the
         * first image load on cold connections (especially on mobile networks).
         * dns-prefetch is the lightweight fallback for browsers that ignore preconnect.
         */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body
        className={`${jarkataSans.variable} ${inter.variable} font-sans antialiased`}
      >
        {children}

        <Toaster position="top-center" />
      </body>
    </html>
  );
}

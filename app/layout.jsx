import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import { Toaster } from "react-hot-toast";
import { FormbricksProvider } from "./providers";

const jarkataSans = Plus_Jakarta_Sans({
  variable: "--font-jarkata",
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
      <body className={`${jarkataSans.variable} antialiased`}>
        <FormbricksProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 pt-[88px]">{children}</main>
            <Footer />
          </div>
          <Toaster position="top-center" />
        </FormbricksProvider>
      </body>
    </html>
  );
}

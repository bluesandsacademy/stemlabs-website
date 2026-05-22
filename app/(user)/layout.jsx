import { Inter, Plus_Jakarta_Sans } from "next/font/google";

import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import { Toaster } from "react-hot-toast";
import AseeDisclaimerPopup from "@/components/shared/asee/disclaimer-popup";

export const metadata = {
  title: "BLUESANDS STEM LABS | Africa STEM EdTech Expo",
  description:
    "Africa STEM EdTech Expo - Empowering the next generation through STEM education",
};

export default function UserLayout({ children }) {
  return (
    <>
      {" "}
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </div>
      <AseeDisclaimerPopup />
      <Toaster position="top-center" />
    </>
  );
}

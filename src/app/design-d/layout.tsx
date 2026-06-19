import { Bebas_Neue, DM_Sans } from "next/font/google";
import type { Metadata } from "next";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ELYXIER — Elevated Glam",
  description: "Luxury Body Butter & Oils",
};

export default function DesignDLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${bebasNeue.variable} ${dmSans.variable}`}>
      {children}
    </div>
  );
}

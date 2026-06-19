import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import type { Metadata } from "next";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ELYXIER — Warm Ivory",
  description: "Luxury Body Butter & Oils",
};

export default function DesignBLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${cormorant.variable} ${dmSans.variable}`}>
      {children}
    </div>
  );
}

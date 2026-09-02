import { Montserrat, Nunito } from "next/font/google";
import type { Metadata } from "next";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ELYXIER — Bold Canvas",
  description: "Luxury Body Butter & Oils",
};

export default function DesignCLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${montserrat.variable} ${nunito.variable}`}>
      {children}
    </div>
  );
}

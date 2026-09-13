import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vridhi | National Skill & Career Growth Portal",
  description:
    "Vridhi (वृद्धि) connects learners, institutions and industry through intelligent skill assessment, verified capabilities, learning pathways, internships and employment opportunities. Where Skills Grow. Opportunities Multiply.",
  keywords: ["Vridhi", "skills", "AI assessment", "internships", "career opportunities", "Ministry of Education", "Government of India", "SIH 2026"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

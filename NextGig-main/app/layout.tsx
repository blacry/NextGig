import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "NextGig — Academia–Industry Collaboration Portal",
    template: "%s | NextGig",
  },
  description:
    "NextGig connects students, educators, institutions and companies in one ecosystem — turning learning into real-world opportunity.",
  keywords: ["internship", "placement", "skill mapping", "academia", "industry", "SIH"],
  authors: [{ name: "NextGig" }],
  openGraph: {
    title: "NextGig",
    description: "Learn. Build. Connect. Grow.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#163832",
              border: "1px solid rgba(142,182,155,0.2)",
              color: "#DAF1DE",
            },
          }}
        />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Outfit, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jb" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#080810",
};

export const metadata: Metadata = {
  title: "CandidBoard — AI hiring panel",
  description: "Five specialist agents. One Advance / Hold / Reject report.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} ${mono.variable} h-full`}>
      <body className="min-h-full bg-[#0a0a0a] text-gray-100 antialiased" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        <div className="wave-bg" aria-hidden />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

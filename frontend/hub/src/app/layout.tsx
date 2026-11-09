import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PageLoader from "@/components/PageLoader";
import LenisProvider from "@/components/LenisProvider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AINCRAD · Control Center",
  description: "Mission-critical observability engine and fleet telemetry control",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <PageLoader />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neat-O Slate: Spoiler-Free NBA",
  description: "Configure your personal watchability algorithm and rank the previous slate of NBA games with zero spoilers.",
};

import Footer from "@/components/ui/Footer";
import Navbar from "@/components/ui/Navbar";
import { ToastProvider } from "@/components/ui/Toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col relative`}
        suppressHydrationWarning
      >
        <ToastProvider>
          {/* CRT Scanline Overlay */}
          <div className="fixed inset-0 pointer-events-none z-[130] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%]" />

          <Suspense fallback={<div className="h-16 fixed top-0 w-full bg-black/60 backdrop-blur-md border-b border-gray-800 z-[110]" />}>
            <Navbar />
          </Suspense>

          <div className="flex-grow pt-16">
            {children}
          </div>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}

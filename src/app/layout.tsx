
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter as a clean sans-serif font
import "./globals.css";
import { AppLayout } from "@/components/layout/app-layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans", // Use CSS variable for font
});

export const metadata: Metadata = {
  title: "TrackWIsE - Academic Dashboard",
  description: "Your personal academic performance tracker and scheduler.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}

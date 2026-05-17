import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PM Interview Simulator",
  description: "Practice PM interviews with AI-powered questions and scoring",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}

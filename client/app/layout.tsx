import type { Metadata } from "next";
import { Footer } from "./components/footer";
import { NavBar } from "./components/nav-bar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rare Ticket Platform",
  description: "Modern concert ticket reservation platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <div id="portal" />
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

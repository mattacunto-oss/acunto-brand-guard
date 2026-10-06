import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harbor Shield — Guarding NIL, Teams & HNWI Brands",
  description:
    "Harbor Shield guards NIL athletes, pro teams, and high-net-worth clients with public-web brand monitoring.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

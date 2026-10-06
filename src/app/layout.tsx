import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Acunto Brand Guard — Executive Brand Monitoring",
  description:
    "Executive brand monitoring for NIL, pro teams, and high-net-worth clients. Public-web monitoring only.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CineScope — Live TV & Movie News",
  description:
    "Real-time TV schedules, show data, and movie news powered by TVmaze API with live webhook updates.",
  openGraph: {
    title: "CineScope",
    description: "Live TV & Movie News powered by TVmaze",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

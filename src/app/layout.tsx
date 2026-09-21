import type { Metadata } from "next";
import { Caveat, Instrument_Serif, Karla } from "next/font/google";

import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Oddment — Good things, oddly chosen",
    template: "%s · Oddment",
  },
  description:
    "An independent boutique on Weaver's Row in Manchester's Northern Quarter. Hand-picked menswear and womenswear, most of it in ones and twos. A fictional concept store by Sono Technologies.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body
        className={`${instrumentSerif.variable} ${karla.variable} ${caveat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

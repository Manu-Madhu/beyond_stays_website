import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Beyond Stays",
    template: "%s | Beyond Stays",
  },
  description:
    "Discover your next unforgettable travel experience with Beyond Stays — curated stays, unique destinations, and seamless travel planning.",
  keywords: [
    "Beyond Stays",
    "Travel",
    "Vacation Rentals",
    "Hotels",
    "Homestays",
    "Travel Planning",
  ],
  authors: [{ name: "Beyond Stays Team" }],
  openGraph: {
    title: "Beyond Stays",
    description:
      "Explore curated stays and travel experiences with Beyond Stays.",
    url: "https://www.travelwithbeyondstays.com",
    siteName: "Beyond Stays",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Beyond Stays Travel",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beyond Stays",
    description:
      "Travel smarter with Beyond Stays — curated destinations and unique experiences.",
    images: ["/images/og-image.jpg"],
  },
  metadataBase: new URL("https://www.travelwithbeyondstays.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${roboto.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

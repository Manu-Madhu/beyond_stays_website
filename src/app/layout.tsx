import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";

import Navbar from "@/components/common/Navbar";

import "./globals.css";
import Footer from "@/components/common/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap"
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "Beyond Stays | Let’s make your next trip unforgettable.",
    template: "%s | Beyond Stays"
  },
  description:
    "Beyond Stays offers handpicked stays and custom travel plans made just for you. From start to finish, we take care of the details so you can enjoy the journey.",
  keywords: [
    "Beyond Stays",
    "Travel",
    "Vacation Rentals",
    "Hotels",
    "Homestays",
    "Travel Planning"
  ],
  authors: [{ name: "Beyond Stays Team" }],
  openGraph: {
    title: "Beyond Stays | Let’s make your next trip unforgettable",
    description:
      "Beyond Stays offers handpicked stays and custom travel plans made just for you. From start to finish, we take care of the details so you can enjoy the journey.",
    url: "https://www.travelwithbeyondstays.com",
    siteName: "Beyond Stays",
    images: [
      {
        url: "https://www.travelwithbeyondstays.com/logo/logo.png",
        width: 1200,
        height: 630,
        alt: "Beyond Stays Travel"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Beyond Stays | Let’s make your next trip unforgettable",
    description:
      "Beyond Stays offers handpicked stays and custom travel plans made just for you. From start to finish, we take care of the details so you can enjoy the journey.",
    images: ["https://www.travelwithbeyondstays.com/logo/logo.png"]
  },
  metadataBase: new URL("https://www.travelwithbeyondstays.com")
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${roboto.variable} antialiased`}>
        {/* Navbar */}
        <Navbar />

        {/* Children */}
        {children}

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import VideoPlayerModal from "@/components/VideoPlayerModal";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "MSW — Movies, Trailers & More",
    template: "%s · MSW",
  },
  description: "Stream trailers for the latest blockbusters, critically acclaimed films and timeless classics.",
};

export const viewport: Viewport = {
  themeColor: "#08070d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-ink font-sans">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <VideoPlayerModal />
        </Providers>
      </body>
    </html>
  );
}

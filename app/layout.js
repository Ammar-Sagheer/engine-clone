import { Jost } from "next/font/google";
import "./globals.css";
import Header from "@/_components/Header";
import Footer from "@/_components/Footer";
import { CartProvider } from "@/_context/CartContext";

const jost = Jost({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Engine Clone — Western Wear Store",
  description: "A demo storefront clone built with Next.js and Tailwind CSS.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jost.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

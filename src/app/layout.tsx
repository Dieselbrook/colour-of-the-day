import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Colour of the Day",
  description: "Discover your mood colours and get a dad joke",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}

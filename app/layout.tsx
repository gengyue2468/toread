import type { Metadata } from "next";
import { Public_Sans, Lora } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "@/components/auth";
import BottomBar from "@/components/bottom-bar";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

export const metadata: Metadata = {
  title: "ToRead | 读了吗",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${publicSans.variable} ${lora.variable} antialiased selection:bg-stone-300 dark:selection:bg-neutral-700 `}
      >
        <AuthProvider>
          <main>{children}</main>
          <BottomBar />
        </AuthProvider>
        <footer className="border-x border-stone-200 dark:border-neutral-800 max-w-prose mx-auto px-8">
          <small className="block text-center py-6 text-neutral-500">
            Made by <Link href="https://www.gengyue.site/" className="font-serif font-medium">Geng Yue</Link>. For personal use only.
          </small>
        </footer>
      </body>
    </html>
  );
}

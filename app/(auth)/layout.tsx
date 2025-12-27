import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PastelPixels - Admin Auth",
  description: "Admin auth to manage PastelPixels website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className={`${inter.className} h-screen flex justify-center items-center`}>{children}</div>
  );
}
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

import { ClerkProvider } from "@clerk/nextjs"
import LeftSideBar from "@/components/layout/LeftSideBar";
import TopBar from "@/components/layout/TopBar"
import { ToasterProvider } from "@/lib/ToasterProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PastelPixels - Admin Dashboard",
  description: "Admin dashboard to manage PastelPixels shop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex max-lg:flex-col">
        <ToasterProvider />
        <TopBar />
        <LeftSideBar />
        <div className="flex-1">{children}</div>
    </div>
  )
}

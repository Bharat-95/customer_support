import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";


export const metadata: Metadata = {
  title: "Customer_Support",
 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased bg-gradient-to-r from-[#0F766E] to-[#0F766E]/50 text-white px-[5%] py-5`}
      >
      
       
        {children}
      </body>
    </html>
  );
}

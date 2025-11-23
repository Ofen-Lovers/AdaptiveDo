import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { cn } from "@/lib/utils";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AdaptiveDo",
  description: "An adaptive to-do list that evolves with you.",
};

import { AdaptiveLayout } from "@/components/AdaptiveLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.className} suppressHydrationWarning>
        <UserProvider>
          <AdaptiveLayout>
            {children}
          </AdaptiveLayout>
        </UserProvider>
      </body>
    </html>
  );
}

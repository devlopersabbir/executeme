import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import BaseProvider from "@/components/shared/providers/base-provider";
import { baseMetadata } from "@/constants/base-memetadata";

export const metadata: Metadata = {
  title: "Execute Me - Code Execution Platform",
  description: "Run code in any programming language, instantly",
  ...baseMetadata,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <BaseProvider>{children}</BaseProvider>
      </body>
    </html>
  );
}

import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import BaseProvider from "@/components/shared/providers/base-provider";

export const metadata: Metadata = {
  title: "Execute Me - Code Execution Platform",
  description: "Run code in any programming language, instantly",
  authors: {
    name: "Sabbir Hossain Shuvo",
    url: "devlopersabbir.github.io",
  },
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

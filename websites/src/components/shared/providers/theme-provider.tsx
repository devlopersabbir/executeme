"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <main className={inter.className}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </main>
  );
}

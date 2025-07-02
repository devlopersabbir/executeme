import { Toaster } from "@/components/ui/sonner";
import { PropsWithChildren } from "react";
import { ThemeProvider } from "./theme-provider";
import SocketProvider from "./socket-provider";

export default function BaseProvider({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <SocketProvider>
        {children} <Toaster />
      </SocketProvider>
    </ThemeProvider>
  );
}

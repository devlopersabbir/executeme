import { PropsWithChildren } from "react";
import SocketProvider from "./socket-provider";
import { Toaster } from "sonner";

export default function BaseProvider({ children }: PropsWithChildren) {
  return (
    <SocketProvider>
      {children} <Toaster />
    </SocketProvider>
  );
}

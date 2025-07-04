import { socket } from "@renderer/lib/socket";
import { PropsWithChildren, useEffect } from "react";
import OnlineCoders from "../online-coders/online-coders";

const SocketProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="relative">
      {children}
      <OnlineCoders />
    </div>
  );
};

export default SocketProvider;

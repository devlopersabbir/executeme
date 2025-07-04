import { baseUri } from "@renderer/constants/base";
import { io } from "socket.io-client";

export const socket = io(`${baseUri}`, {
  autoConnect: false,
  transports: ["websocket"],

  timeout: 20000,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

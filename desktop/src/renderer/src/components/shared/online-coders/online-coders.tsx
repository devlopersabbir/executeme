import { useState, useEffect } from "react";
import { ClassValue } from "clsx";
import Content from "./content";
import FloatingParticles from "./floating-particles";
import { socket } from "@renderer/lib/socket";
import "./style.css";

type Props = {
  className?: ClassValue;
};
export default function OnlineCoders({ className }: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const handleActiveCoders = (data: string[]) => {
      setCount(data.length || 0);
    };
    socket.on("active_coders", handleActiveCoders);
    return () => {
      socket.off("active_coders", handleActiveCoders);
    };
  }, []);
  return (
    <div className={`fixed z-20 bottom-5 right-5 ${className}`}>
      {/* Background glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur-lg opacity-30 animate-pulse"></div>

      {/* Main container with glassmorphism */}
      <div
        className="relative backdrop-blur-xl bg-white/10 border border-white/20 
        rounded-2xl p-6 shadow-2xl overflow-hidden
        transform transition-all duration-1000 ease-out translate-y-0 opacity-100"
      >
        {/* Animated background gradient */}
        <div className="animated-background-gradient animate-gradient-xy"></div>

        {/* Floating particles */}
        <FloatingParticles />

        {/* Content */}
        <Content displayCount={count} />

        {/* Bottom accent line */}
        <div className="bottom-accent-line animate-gradient-x"></div>
      </div>
    </div>
  );
}

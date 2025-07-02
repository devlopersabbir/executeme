import { Users, Zap } from "lucide-react";

type Props = {
  displayCount: number;
};
export default function Content({ displayCount }: Props) {
  return (
    <div className="relative z-10 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {/* Animated icon container */}
        <div className="relative">
          <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
          <div className="relative bg-gradient-to-r from-green-400 to-emerald-500 p-3 rounded-full shadow-lg">
            <Users className="w-6 h-6 text-white animate-pulse" />
          </div>
        </div>

        <div>
          <p className="text-white/80 text-sm font-medium tracking-wide">
            Online Coders
          </p>
          <div className="flex items-center space-x-2">
            {/* Animated count */}
            <span className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              {displayCount.toLocaleString()}
            </span>

            {/* Live indicator */}
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <span className="text-green-400 text-xs font-semibold tracking-wider uppercase">
                Live
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity indicator */}
      <div className="flex flex-col items-center space-y-2">
        <div className="relative">
          <Zap className="w-5 h-5 text-yellow-400 animate-bounce" />
          <div className="absolute inset-0 bg-yellow-400/30 rounded-full animate-ping"></div>
        </div>
        <span className="text-white/60 text-xs font-medium">Active</span>
      </div>
    </div>
  );
}

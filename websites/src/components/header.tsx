import { SUPPORTED_LANGUAGES } from "@/constants/language";
import { Github } from "lucide-react";
import { Badge } from "./ui/badge";

export default function Header() {
  return (
    <div className="text-center mb-8 p-6 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20">
      <h1 className="md:text-5xl text-3xl font-extrabold text-white mb-2 md:mb-3 tracking-tight drop-shadow-lg">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Execute
        </span>{" "}
        Me
      </h1>
      <p className="md:text-xl text-lg text-gray-200 mb-6 font-light drop-shadow-md">
        Run code in any programming language,{" "}
        <span className="font-semibold text-white">instantly</span> and{" "}
        <span className="font-semibold text-white">securely</span>.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {SUPPORTED_LANGUAGES.slice(0, 6).map((lang) => (
          <Badge
            key={lang.value}
            variant="outline"
            className="text-sm px-4 py-1.5 bg-white/20 text-white border-white/30 backdrop-blur-sm"
          >
            {lang.label}
          </Badge>
        ))}
        <Badge
          variant="outline"
          className="text-sm px-4 py-1.5 bg-white/20 text-white border-white/30 backdrop-blur-sm"
        >
          +{SUPPORTED_LANGUAGES.length - 6} more
        </Badge>
      </div>

      {/* GitHub Icon and Link */}
      <div className="md:mt-8 mt-5">
        <a
          href="https://github.com/devlopersabbir/executeme"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200"
        >
          <Github className="w-6 h-6" />
          <span className="font-medium">Star on GitHub</span>
        </a>
      </div>
    </div>
  );
}

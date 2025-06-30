import { Badge } from "@/components/ui/badge";
import { Terminal } from "lucide-react";
import { ExecutionProps } from "./result-sections";

export default function OutputHeader({ executionResult }: ExecutionProps) {
  return (
    <div className="flex items-center gap-2">
      <Terminal className="w-4 h-4 text-gray-400" /> {/* Adjusted icon color */}
      <span className="text-sm font-medium text-gray-300">Output</span>{" "}
      {/* Adjusted text color */}
      {executionResult.results.responseTime !== undefined && ( // Check for undefined instead of truthiness to allow 0ms
        <Badge
          variant="outline"
          className="text-xs bg-gray-700 text-gray-200 border-gray-600"
        >
          {executionResult.results.responseTime.toFixed(0)}ms
        </Badge>
      )}
      <Badge
        variant={
          executionResult.status === "success"
            ? "default"
            : executionResult.status === "error"
            ? "destructive"
            : "secondary"
        }
        className="text-xs"
      >
        {executionResult.status}
      </Badge>
    </div>
  );
}

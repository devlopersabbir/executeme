import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@renderer/components/ui/card";
import { FileText, Play } from "lucide-react";
import { OutputViewer } from "../output-viewer";
import { ExecutionResult } from "@renderer/@types";
import Loading from "@renderer/components/loading/loading";

export type ExecutionProps = {
  executionResult: ExecutionResult;
};
type Props = { optional: ExecutionResult | null; isExecuting: boolean };

export default function ResultSection({ optional, isExecuting }: Props) {
  return (
    <Card className="h-full bg-white/5 backdrop-blur-sm border border-white/10 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <FileText className="w-6 h-6 text-pink-400" />
          Execution Results
        </CardTitle>
        <CardDescription className="text-gray-300">Output and execution details</CardDescription>
      </CardHeader>
      <CardContent className="h-full flex justify-center items-center w-full">
        {isExecuting ? (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-full max-w-lg">
              <div className="custom-loading">
                <Loading />
              </div>
            </div>
            <p className="text-lg text-purple-300 mt-4">Executing your code, step-by-step...</p>
            <p className="text-sm text-gray-400 mt-2">
              Ensuring isolation and efficiency at every stage.
            </p>
          </div>
        ) : !optional ? (
          <div className="text-center text-gray-400">
            <Play className="w-14 h-14 mx-auto mb-4 opacity-50 text-purple-300" />
            <p className="text-lg">Execute your code to see results here</p>
          </div>
        ) : (
          <OutputViewer executionResult={optional} />
        )}
      </CardContent>
    </Card>
  );
}

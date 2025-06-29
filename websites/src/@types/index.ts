import { LANGUAGE_MAP } from "@/constants";

export type Language = keyof typeof LANGUAGE_MAP;
export type Status = "success" | "error" | "running";
export type ExecutionResult = {
  status: Status;
  output: string;
  executionTime: number;
  language: Language;
};

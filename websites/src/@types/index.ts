import { LANGUAGE_MAP } from "@/constants";

export type Language = keyof typeof LANGUAGE_MAP;
export type Status = "success" | "error" | "running";

export type Input = {
  language: Language;
  code: string;
};

export type Output = {
  output: string;
  responseTime: number; // in milliseconds
};

export type ExecutionResult = {
  status: Status;
  results: Output;
  language: Language;
};

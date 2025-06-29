"use server";

import { Language } from "@/@types";
import { baseUri } from "@/constants/base";
import axios from "axios";
import { performance } from "perf_hooks";

type Input = {
  language: Language;
  code: string;
};
type Output = {
  output: string;
  responseTime: number; // in milliseconds
};
export async function executeCodeAction(input: Input): Promise<Output> {
  const start = performance.now();
  let responseTime = 0;
  let end = 0;
  try {
    const response = await axios.post(`${baseUri}/run`, input);
    end = performance.now();
    responseTime = end - start;

    return {
      output: response.data.output,
      responseTime: Math.round(responseTime),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    end = performance.now();
    responseTime = end - start;

    const errorMessage = error.response.data.details as unknown as string;
    const response = {
      output: errorMessage,
      responseTime: Math.round(responseTime),
    };
    throw new Error(JSON.stringify(response));
  }
}

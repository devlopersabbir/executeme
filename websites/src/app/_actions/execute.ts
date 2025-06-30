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

  try {
    const response = await axios.post(`${baseUri}/run`, input);
    const end = performance.now();

    return {
      output: response.data.output,
      responseTime: Math.round(end - start),
    };
  } catch (error: any) {
    const end = performance.now();
    const responseTime = Math.round(end - start);

    // Safer extraction of error message
    const errorMessage =
      error?.response?.data?.details || "Unknown error occurred";

    // Optional: log more useful error info for debugging
    console.error("executeCodeAction Error:", {
      message: errorMessage,
      status: error?.response?.status,
      data: error?.response?.data,
    });

    // Throw a serializable error object
    throw new Error(
      JSON.stringify({
        output: errorMessage,
        responseTime,
      })
    );
  }
}

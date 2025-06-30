"use server";

import { Input, Output } from "@/@types";
import { baseUri } from "@/constants/base";
import axios from "axios";
import { performance } from "perf_hooks";

export async function executeCodeAction(input: Input): Promise<Output> {
  const start = performance.now();
  console.log("baseurl: ", baseUri);
  try {
    const response = await axios.post(`${baseUri}/run`, input);
    const end = performance.now();

    return {
      output: response.data.output,
      responseTime: Math.round(end - start),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const end = performance.now();
    const responseTime = Math.round(end - start);

    // Safer extraction of error message
    const errorMessage =
      error?.response?.data?.details || "Unknown error occurred";

    throw new Error(
      JSON.stringify({
        output: errorMessage,
        responseTime,
      })
    );
  }
}

"use server";

import { Input, Output } from "@/@types";
import { baseUri } from "@/constants/base";
import axios from "axios";
import { performance } from "perf_hooks";
import https from "https"; // Import the built-in Node.js https module

const agent = new https.Agent({
  rejectUnauthorized: false, // THIS IS THE KEY LINE
});
const axiosInstance = axios.create({
  httpsAgent: agent,
});
export async function executeCodeAction(input: Input): Promise<Output> {
  const start = performance.now();
  try {
    const response = await axiosInstance.post(`${baseUri}/run`, input);
    const end = performance.now();

    return {
      output: response.data.output,
      responseTime: Math.round(end - start),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const end = performance.now();

    const output =
      error?.response?.data?.details ||
      error?.message ||
      "Unknown error occurred";

    return {
      output,
      responseTime: Math.round(end - start),
    };
  }
}

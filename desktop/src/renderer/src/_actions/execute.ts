import { Input, Output } from "@renderer/@types";
import { baseUri } from "@renderer/constants/base";
import axios from "axios";

export async function executeCodeAction(input: Input): Promise<Output> {
  const start = performance.now();
  try {
    const response = await axios.post(`${baseUri}/run`, input);
    const end = performance.now();

    return {
      output: response.data.output,
      responseTime: Math.round(end - start)
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const end = performance.now();

    const output = error?.response?.data?.details || error?.message || "Unknown error occurred";

    return {
      output,
      responseTime: Math.round(end - start)
    };
  }
}

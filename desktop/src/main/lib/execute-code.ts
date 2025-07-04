import { Input } from "@shared/types";
import { IpcMainInvokeEvent } from "electron";
import https from "https";
import axios from "axios";

export const handleExecuteCode = async (_: IpcMainInvokeEvent, payload: Input) => {
  const agent = new https.Agent({
    rejectUnauthorized: false
  });
  const axiosInstance = axios.create({
    httpsAgent: agent
  });
  const baseAPI = "https://145.223.97.55:9292";
  const start = performance.now();
  try {
    const { data } = await axiosInstance.post(`${baseAPI}/run`, payload);
    const end = performance.now();
    return {
      output: data.output,
      responseTime: Math.round(end - start)
    };
  } catch (error: any) {
    const end = performance.now();

    const output = error?.response?.data?.details || error?.message || "Unknown error occurred";

    return {
      output,
      responseTime: Math.round(end - start)
    };
  }
};

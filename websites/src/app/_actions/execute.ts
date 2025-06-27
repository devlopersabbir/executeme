'use server';

import { Language } from '@/@types';
import { baseUri } from '@/constants/base';
import axios from 'axios';
import { performance } from 'perf_hooks';

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
    const responseTime = end - start;

    return {
      output: response.data.output,
      responseTime: Math.round(responseTime),
    };
  } catch (error) {
    console.error('Failed to post data:', error);
    throw new Error('Fail to execute');
  }
}

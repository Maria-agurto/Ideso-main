'use server';
/**
 * @fileOverview This file implements a Genkit flow that provides a natural language explanation
 * for an SVM model's stock trend prediction (BUY/SELL/HOLD) based on historical 60-day price patterns.
 *
 * - aiExplanationForSVMSignal - A function that generates the explanation.
 * - AIExplanationForSVMSignalInput - The input type for the function.
 * - AIExplanationForSVMSignalOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIExplanationForSVMSignalInputSchema = z.object({
  ticker: z.string().describe('The ticker symbol of the stock (e.g., AAPL).'),
  currentPrediction: z.enum(['BUY', 'SELL', 'HOLD']).describe('The current SVM model prediction for the stock.'),
  historicalPrices: z.array(
    z.object({
      date: z.string().describe('Date in YYYY-MM-DD format.'),
      price: z.number().describe('Closing price for the day.'),
    })
  ).describe('Historical stock prices for the last 60 trading days.'),
});
export type AIExplanationForSVMSignalInput = z.infer<typeof AIExplanationForSVMSignalInputSchema>;

const AIExplanationForSVMSignalOutputSchema = z.object({
  explanation: z.string().describe('A natural language explanation of the SVM model\'s prediction.'),
});
export type AIExplanationForSVMSignalOutput = z.infer<typeof AIExplanationForSVMSignalOutputSchema>;

export async function aiExplanationForSVMSignal(input: AIExplanationForSVMSignalInput): Promise<AIExplanationForSVMSignalOutput> {
  return aiExplanationForSVMSignalFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiExplanationForSVMSignalPrompt',
  input: {schema: AIExplanationForSVMSignalInputSchema},
  output: {schema: AIExplanationForSVMSignalOutputSchema},
  prompt: `You are an expert financial analyst. Your task is to provide a concise natural language explanation for an SVM (Support Vector Classifier) model's stock trend prediction.
The SVM model classifies each market day into BUY (class 1), SELL (class 2), or HOLD (class 0), using 60-day windows of normalized prices with an RBF kernel, C=1.0, and gamma='scale'.
The user wants to understand the rationale behind the current prediction based on the provided historical price patterns.

**Context:**
- Ticker: {{{ticker}}}
- Current SVM Prediction: {{{currentPrediction}}}
- Historical Prices (last 60 days):
\
{{{json historicalPrices}}}
\

Based on the historical price patterns and the characteristics of the SVM model, explain *why* the model is predicting '{{{currentPrediction}}}'. Focus on observable trends, volatility, and price movements within the 60-day window that would lead to such a classification by an RBF kernel SVM.

Your explanation should be professional, insightful, and easy for a quantitative investor to understand. Provide a clear and concise explanation in about 3-5 sentences.`,
});

const aiExplanationForSVMSignalFlow = ai.defineFlow(
  {
    name: 'aiExplanationForSVMSignalFlow',
    inputSchema: AIExplanationForSVMSignalInputSchema,
    outputSchema: AIExplanationForSVMSignalOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

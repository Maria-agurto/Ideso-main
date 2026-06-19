'use server';
/**
 * @fileOverview A Genkit flow to provide insights into how changing the prediction horizon impacts forecast confidence and risks.
 *
 * - predictionHorizonInsight - A function that provides an AI-generated explanation based on the prediction horizon.
 * - PredictionHorizonInsightInput - The input type for the predictionHorizonInsight function.
 * - PredictionHorizonInsightOutput - The return type for the predictionHorizonInsight function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictionHorizonInsightInputSchema = z.object({
  currentHorizon: z
    .number()
    .describe(
      'The selected prediction horizon in days (e.g., 7, 14, 30, 60).'
    ),
  assetTicker: z
    .string()
    .describe(
      'The ticker symbol of the financial asset (e.g., AAPL, BTC-USD).'
    ),
});
export type PredictionHorizonInsightInput = z.infer<
  typeof PredictionHorizonInsightInputSchema
>;

const PredictionHorizonInsightOutputSchema = z.object({
  explanation: z
    .string()
    .describe(
      'A concise AI-generated explanation of the impact of the prediction horizon on forecast confidence and risks.'
    ),
});
export type PredictionHorizonInsightOutput = z.infer<
  typeof PredictionHorizonInsightOutputSchema
>;

export async function predictionHorizonInsight(
  input: PredictionHorizonInsightInput
): Promise<PredictionHorizonInsightOutput> {
  return predictionHorizonInsightFlow(input);
}

const predictionHorizonInsightPrompt = ai.definePrompt({
  name: 'predictionHorizonInsightPrompt',
  input: {schema: PredictionHorizonInsightInputSchema},
  output: {schema: PredictionHorizonInsightOutputSchema},
  prompt: `As an expert financial analyst, provide a concise explanation for the asset {{assetTicker}} on how changing the prediction horizon to {{currentHorizon}} days impacts the forecast's confidence and associated risks.

Highlight the trade-offs between short-term and long-term predictions. Consider factors like market volatility, data availability, model accuracy trends, and the inherent uncertainty that increases with longer horizons.`,
});

const predictionHorizonInsightFlow = ai.defineFlow(
  {
    name: 'predictionHorizonInsightFlow',
    inputSchema: PredictionHorizonInsightInputSchema,
    outputSchema: PredictionHorizonInsightOutputSchema,
  },
  async input => {
    const {output} = await predictionHorizonInsightPrompt(input);
    return output!;
  }
);

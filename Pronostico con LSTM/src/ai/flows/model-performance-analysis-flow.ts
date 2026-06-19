'use server';
/**
 * @fileOverview This file provides a Genkit flow for analyzing LSTM model performance metrics.
 *
 * - analyzeModelPerformance - A function that analyzes the provided metrics and generates insights.
 * - ModelPerformanceAnalysisInput - The input type for the analyzeModelPerformance function.
 * - ModelPerformanceAnalysisOutput - The return type for the analyzeModelPerformance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModelPerformanceAnalysisInputSchema = z.object({
  rmse_usd: z.number().describe('Root Mean Squared Error in USD.'),
  rmse_percentage: z.number().describe('Root Mean Squared Error as a percentage.'),
  mae_usd: z.number().describe('Mean Absolute Error in USD.'),
  r_squared: z.number().describe('R-squared value, indicating the proportion of variance in the dependent variable that is predictable from the independent variable(s).'),
  directional_accuracy_percentage: z.number().describe('Directional Accuracy as a percentage, indicating the proportion of correctly predicted price movements.'),
});
export type ModelPerformanceAnalysisInput = z.infer<typeof ModelPerformanceAnalysisInputSchema>;

const ModelPerformanceAnalysisOutputSchema = z.object({
  analysis: z.string().describe('A comprehensive analysis of the model\'s performance, interpreting the metrics.'),
  suitability: z.enum(['Highly Suitable', 'Moderately Suitable', 'Use with Caution', 'Not Recommended']).describe('Overall suitability assessment for investment decisions based on the analysis.'),
  key_strengths: z.array(z.string()).describe('List of key strengths of the model identified from the metrics.'),
  key_weaknesses: z.array(z.string()).describe('List of key weaknesses or areas for improvement for the model identified from the metrics.'),
  actionable_recommendations: z.array(z.string()).describe('Actionable recommendations for an investor based on the model\'s performance.'),
});
export type ModelPerformanceAnalysisOutput = z.infer<typeof ModelPerformanceAnalysisOutputSchema>;

export async function analyzeModelPerformance(input: ModelPerformanceAnalysisInput): Promise<ModelPerformanceAnalysisOutput> {
  return modelPerformanceAnalysisFlow(input);
}

const modelPerformanceAnalysisPrompt = ai.definePrompt({
  name: 'modelPerformanceAnalysisPrompt',
  input: {schema: ModelPerformanceAnalysisInputSchema},
  output: {schema: ModelPerformanceAnalysisOutputSchema},
  prompt: `Eres un experto analista financiero especializado en la evaluación de modelos de aprendizaje automático para decisiones de inversión.

Tu tarea es analizar las métricas de rendimiento del modelo LSTM proporcionadas y generar una visión clara y accionable sobre su precisión y fiabilidad actuales.
Basándose en estas métricas, evalúa su idoneidad para las decisiones de inversión y proporciona puntos fuertes específicos, puntos débiles y recomendaciones.

Métricas de rendimiento:
- RMSE (USD): {{{rmse_usd}}}
- RMSE (%): {{{rmse_percentage}}}
- MAE (USD): {{{mae_usd}}}
- R-squared: {{{r_squared}}}
- Precisión Direccional (%): {{{directional_accuracy_percentage}}}

Considera las siguientes pautas generales para la evaluación:
- Un RMSE y MAE más bajos son mejores.
- Un R-squared más cercano a 1.0 es mejor.
- Una Precisión Direccional superior al 50% es mejor que el azar; más cercano al 100% es excelente.

Proporciona tu análisis en formato JSON, adhiriéndote estrictamente al siguiente esquema de salida:

`,
});

const modelPerformanceAnalysisFlow = ai.defineFlow(
  {
    name: 'modelPerformanceAnalysisFlow',
    inputSchema: ModelPerformanceAnalysisInputSchema,
    outputSchema: ModelPerformanceAnalysisOutputSchema,
  },
  async input => {
    const {output} = await modelPerformanceAnalysisPrompt(input);
    return output!;
  }
);

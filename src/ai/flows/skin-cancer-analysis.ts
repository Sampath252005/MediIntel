'use server';

/**
 * @fileOverview An AI agent to analyze skin lesion images and provide a cancer risk assessment.
 *
 * - analyzeSkinLesion - A function that handles the skin lesion analysis process.
 * - SkinCancerAnalysisInput - The input type for the analyzeSkinLesion function.
 * - SkinCancerAnalysisOutput - The return type for the analyzeSkinLesion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkinCancerAnalysisInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a skin lesion, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SkinCancerAnalysisInput = z.infer<typeof SkinCancerAnalysisInputSchema>;

const SkinCancerAnalysisOutputSchema = z.object({
  cancerProbability: z
    .number()
    .describe('The probability (0-1) of the lesion being cancerous.'),
  recommendation: z
    .string()
    .describe(
      'A recommendation based on the probability, such as consult a doctor or safe.'
    ),
});
export type SkinCancerAnalysisOutput = z.infer<typeof SkinCancerAnalysisOutputSchema>;

export async function analyzeSkinLesion(
  input: SkinCancerAnalysisInput
): Promise<SkinCancerAnalysisOutput> {
  return analyzeSkinLesionFlow(input);
}

const analyzeSkinLesionPrompt = ai.definePrompt({
  name: 'analyzeSkinLesionPrompt',
  input: {schema: SkinCancerAnalysisInputSchema},
  output: {schema: SkinCancerAnalysisOutputSchema},
  prompt: `You are a dermatologist analyzing an image of a skin lesion.

  Based on the image, determine the probability (between 0 and 1) of the lesion being cancerous.
  Provide a recommendation, such as "consult a doctor" if the probability is high, or "safe" if the probability is low.

  Image: {{media url=imageDataUri}}
  `,
});

const analyzeSkinLesionFlow = ai.defineFlow(
  {
    name: 'analyzeSkinLesionFlow',
    inputSchema: SkinCancerAnalysisInputSchema,
    outputSchema: SkinCancerAnalysisOutputSchema,
  },
  async input => {
    const {output} = await analyzeSkinLesionPrompt(input);
    return output!;
  }
);

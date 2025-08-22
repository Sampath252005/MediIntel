'use server';

/**
 * @fileOverview This file defines a Genkit flow for checking potential drug interactions.
 *
 * - drugInteractionChecker - A function that takes a list of medications and checks for potential interactions.
 * - DrugInteractionCheckerInput - The input type for the drugInteractionChecker function.
 * - DrugInteractionCheckerOutput - The return type for the drugInteractionChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DrugInteractionCheckerInputSchema = z.object({
  medications: z
    .array(z.string())
    .describe('A list of medications to check for interactions.'),
});
export type DrugInteractionCheckerInput = z.infer<typeof DrugInteractionCheckerInputSchema>;

const DrugInteractionCheckerOutputSchema = z.object({
  safe: z.boolean().describe('Whether the combination of medications is safe.'),
  warnings: z
    .array(z.string())
    .describe('A list of warnings about potential interactions.'),
});
export type DrugInteractionCheckerOutput = z.infer<typeof DrugInteractionCheckerOutputSchema>;

export async function drugInteractionChecker(input: DrugInteractionCheckerInput): Promise<DrugInteractionCheckerOutput> {
  return drugInteractionCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'drugInteractionCheckerPrompt',
  input: {schema: DrugInteractionCheckerInputSchema},
  output: {schema: DrugInteractionCheckerOutputSchema},
  prompt: `You are a pharmacist. Determine if the following list of medications has any dangerous interactions. Return any warnings, and whether the combination is safe.

Medications: {{#each medications}}{{{this}}}\n{{/each}}`,
});

const drugInteractionCheckerFlow = ai.defineFlow(
  {
    name: 'drugInteractionCheckerFlow',
    inputSchema: DrugInteractionCheckerInputSchema,
    outputSchema: DrugInteractionCheckerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

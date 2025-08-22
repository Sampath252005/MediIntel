'use server';

/**
 * @fileOverview A symptom checker AI agent.
 *
 * - symptomChecker - A function that handles the symptom checking process.
 * - SymptomCheckerInput - The input type for the symptomChecker function.
 * - SymptomCheckerOutput - The return type for the symptomChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomCheckerInputSchema = z.object({
  symptoms: z
    .string()
    .describe("The user's symptoms."),
});
export type SymptomCheckerInput = z.infer<typeof SymptomCheckerInputSchema>;

const SymptomCheckerOutputSchema = z.object({
  conditions: z.array(
    z.object({
      condition: z.string().describe('The name of the possible condition.'),
      severity: z
        .enum(['mild', 'moderate', 'severe'])
        .describe('The severity level of the condition.'),
    })
  ).describe('A list of possible conditions with their severity levels.'),
});
export type SymptomCheckerOutput = z.infer<typeof SymptomCheckerOutputSchema>;

export async function symptomChecker(input: SymptomCheckerInput): Promise<SymptomCheckerOutput> {
  return symptomCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomCheckerPrompt',
  input: {schema: SymptomCheckerInputSchema},
  output: {schema: SymptomCheckerOutputSchema},
  prompt: `You are a medical professional who helps users identify possible conditions based on their symptoms.

  Based on the following symptoms:
  {{symptoms}}

  Provide a list of possible conditions with their severity levels (mild, moderate, or severe).  Make sure to return the output in JSON format.`,
});

const symptomCheckerFlow = ai.defineFlow(
  {
    name: 'symptomCheckerFlow',
    inputSchema: SymptomCheckerInputSchema,
    outputSchema: SymptomCheckerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

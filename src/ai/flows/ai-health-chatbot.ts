// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview AI Health Chatbot for providing health-related assistance.
 *
 * - aiHealthChatbot - A function that handles the chatbot interaction.
 * - AiHealthChatbotInput - The input type for the aiHealthChatbot function.
 * - AiHealthChatbotOutput - The return type for the aiHealthChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiHealthChatbotInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The chat history between the user and the chatbot.')
});
export type AiHealthChatbotInput = z.infer<typeof AiHealthChatbotInputSchema>;

const AiHealthChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot response to the user message.'),
});
export type AiHealthChatbotOutput = z.infer<typeof AiHealthChatbotOutputSchema>;

export async function aiHealthChatbot(input: AiHealthChatbotInput): Promise<AiHealthChatbotOutput> {
  return aiHealthChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiHealthChatbotPrompt',
  input: {schema: AiHealthChatbotInputSchema},
  output: {schema: AiHealthChatbotOutputSchema},
  prompt: `You are a helpful AI health assistant chatbot.
  Your goal is to provide helpful and informative responses to user questions about health concerns.
  You can provide general information, but you are not a substitute for a medical professional.
  Do not provide any medical advice. Refer users to consult with qualified healthcare providers for specific health concerns.

  Here is the chat history between the user and you:
  {{#each chatHistory}}
    {{#if (eq role \"user\")}}
      User: {{{content}}}
    {{else}}
      Assistant: {{{content}}}
    {{/if}}
  {{/each}}

  User: {{{message}}}
  Assistant: `,
});

const aiHealthChatbotFlow = ai.defineFlow(
  {
    name: 'aiHealthChatbotFlow',
    inputSchema: AiHealthChatbotInputSchema,
    outputSchema: AiHealthChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

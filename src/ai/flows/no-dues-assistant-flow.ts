'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { departments, type Department } from '@/components/department-checklist';

const NoDuesAssistantInputSchema = z.object({
  query: z.string().describe("The user's question about the no-dues process."),
  departmentStates: z.record(z.string()).describe('The current status of each department clearance.'),
});
export type NoDuesAssistantInput = z.infer<typeof NoDuesAssistantInputSchema>;

const NoDuesAssistantOutputSchema = z.object({
  response: z.string().describe("The AI's response to the user's query."),
});
export type NoDuesAssistantOutput = z.infer<typeof NoDuesAssistantOutputSchema>;


const getDepartmentContactInfo = ai.defineTool(
    {
      name: 'getDepartmentContactInfo',
      description: 'Get the contact email and phone for a specific department.',
      inputSchema: z.object({
        departmentId: z.string().describe('The ID of the department (e.g., "library", "accounts").'),
      }),
      outputSchema: z.object({
        name: z.string(),
        email: z.string(),
        phone: z.string(),
      }),
    },
    async (input) => {
      const dept = departments.find(d => d.id === input.departmentId);
      if (!dept) {
        throw new Error('Department not found.');
      }
      return {
        name: dept.name,
        email: dept.contact.email,
        phone: dept.contact.phone,
      };
    }
  );

const noDuesPrompt = ai.definePrompt({
  name: 'noDuesPrompt',
  input: { schema: NoDuesAssistantInputSchema },
  output: { schema: NoDuesAssistantOutputSchema },
  tools: [getDepartmentContactInfo],
  system: `You are the "No Dues Assistant" for a university. Your job is to help students with questions about their clearance process.

You have access to the student's current clearance status for all departments. Use this information to answer their questions accurately.

If a student asks for contact details, use the \`getDepartmentContactInfo\` tool.

Be friendly, concise, and helpful.`,
  prompt: `Current Department Statuses:
{{#each departmentStates as |status key|}}
- {{key}}: {{status}}
{{/each}}

User's question: {{{query}}}
`,
});

const noDuesAssistantFlow = ai.defineFlow(
  {
    name: 'noDuesAssistantFlow',
    inputSchema: NoDuesAssistantInputSchema,
    outputSchema: NoDuesAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await noDuesPrompt(input);
    
    if (!output) {
      return { response: "I'm sorry, I couldn't process that request. Please try again." };
    }
    
    return output;
  }
);

export async function noDuesAssistant(input: NoDuesAssistantInput): Promise<NoDuesAssistantOutput> {
  return noDuesAssistantFlow(input);
}

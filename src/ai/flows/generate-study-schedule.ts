// src/ai/flows/generate-study-schedule.ts
'use server';

/**
 * @fileOverview AI-powered study schedule generator.
 *
 * - generateStudySchedule - A function that generates a personalized study schedule.
 * - GenerateStudyScheduleInput - The input type for the generateStudySchedule function.
 * - GenerateStudyScheduleOutput - The return type for the generateStudySchedule function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyScheduleInputSchema = z.object({
  courses: z
    .array(z.string())
    .describe('List of courses the student is taking.'),
  grades: z
    .record(z.string(), z.number())
    .describe('A map of course names to current grades (0-100).'),
  upcomingDeadlines: z
    .array(z.object({
      course: z.string(),
      assignment: z.string(),
      deadline: z.string().describe('Deadline in ISO 8601 format (YYYY-MM-DD).'),
    }))
    .describe('List of upcoming assignment deadlines for each course.'),
  studyHoursPerDay: z
    .number()
    .int()
    .min(0)
    .max(24)
    .describe('The number of hours the student can study per day.'),
  examDates: z
    .array(z.object({
      course: z.string(),
      date: z.string().describe('Exam date in ISO 8601 format (YYYY-MM-DD).'),
    }))
    .describe('List of exam dates for each course.'),
});
export type GenerateStudyScheduleInput = z.infer<typeof GenerateStudyScheduleInputSchema>;

const GenerateStudyScheduleOutputSchema = z.object({
  schedule: z
    .string()
    .describe('A detailed study schedule, including time slots for each course and assignment.'),
});
export type GenerateStudyScheduleOutput = z.infer<typeof GenerateStudyScheduleOutputSchema>;

export async function generateStudySchedule(
  input: GenerateStudyScheduleInput
): Promise<GenerateStudyScheduleOutput> {
  return generateStudyScheduleFlow(input);
}

const generateStudySchedulePrompt = ai.definePrompt({
  name: 'generateStudySchedulePrompt',
  input: {schema: GenerateStudyScheduleInputSchema},
  output: {schema: GenerateStudyScheduleOutputSchema},
  prompt: `You are an AI-powered study schedule generator. Analyze the student's courses, grades, upcoming deadlines, available study hours, and exam dates to create a personalized study schedule.

Courses: {{courses}}
Grades: {{grades}}
Upcoming Deadlines: {{upcomingDeadlines}}
Study Hours Per Day: {{studyHoursPerDay}}
Exam Dates: {{examDates}}

Consider the student's performance in each course and the proximity of deadlines and exams to prioritize study time. The schedule should be realistic and manageable, ensuring that the student has enough time to cover all the material.

Return a detailed study schedule with specific time slots for each course and assignment.
`,
});

const generateStudyScheduleFlow = ai.defineFlow(
  {
    name: 'generateStudyScheduleFlow',
    inputSchema: GenerateStudyScheduleInputSchema,
    outputSchema: GenerateStudyScheduleOutputSchema,
  },
  async input => {
    const {output} = await generateStudySchedulePrompt(input);
    return output!;
  }
);


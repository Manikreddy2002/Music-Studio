'use server';
/**
 * @fileOverview A flow to retrieve song lyrics.
 *
 * - getSongLyrics - A function that gets lyrics for a song.
 * - LyricsInput - The input type for the getSongLyrics function.
 * - LyricsOutput - The return type for the getSongLyrics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LyricsInputSchema = z.object({
  title: z.string().describe('The title of the song.'),
  artist: z.string().describe('The artist of the song.'),
});
export type LyricsInput = z.infer<typeof LyricsInputSchema>;

const LyricsOutputSchema = z.object({
    plainLyrics: z.string().describe('The lyrics of the song as a plain string. If lyrics are not found, this should be an empty string.'),
});
export type LyricsOutput = z.infer<typeof LyricsOutputSchema>;

export async function getSongLyrics(input: LyricsInput): Promise<LyricsOutput> {
    return lyricsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getLyricsPrompt',
  input: {schema: LyricsInputSchema},
  output: {schema: LyricsOutputSchema},
  prompt: `You are a music expert. Find the lyrics for the song titled "{{title}}" by the artist "{{artist}}". 
  
  Please provide the full lyrics. 
  
  If you cannot find the lyrics for the song, return an empty string for the plainLyrics field.`,
});

const lyricsFlow = ai.defineFlow(
  {
    name: 'lyricsFlow',
    inputSchema: LyricsInputSchema,
    outputSchema: LyricsOutputSchema,
  },
  async (input) => {
    // The model may fail for certain songs, so we wrap it in a try/catch
    try {
        const {output} = await prompt(input);
        if (!output) {
            return { plainLyrics: '' };
        }
        return output;
    } catch(e) {
        console.error(`Could not generate lyrics for ${input.title}`, e);
        return { plainLyrics: '' };
    }
  }
);

"use server";

import { summarizeArticle, type SummarizeArticleInput } from "@/ai/flows/summarize-article";

interface SummarizationResult {
  summary: string | null;
  error: string | null;
}

export async function handleSummarizeArticle(url: string): Promise<SummarizationResult> {
  if (!url) {
    return { summary: null, error: "URL cannot be empty." };
  }

  try {
    // Basic URL validation (more robust validation can be added)
    new URL(url);
  } catch (_) {
    return { summary: null, error: "Invalid URL format." };
  }
  
  try {
    const input: SummarizeArticleInput = { url };
    const result = await summarizeArticle(input);
    if (result && result.summary) {
      return { summary: result.summary, error: null };
    }
    return { summary: null, error: "Failed to generate summary. The AI model might not have returned a summary." };
  } catch (error) {
    console.error("Error summarizing article:", error);
    if (error instanceof Error) {
        // Check for common user-facing errors if possible, otherwise generic
        if (error.message.includes('fetch')) {
             return { summary: null, error: "Could not fetch content from the URL. Please check the URL and try again." };
        }
        return { summary: null, error: `An error occurred: ${error.message}` };
    }
    return { summary: null, error: "An unknown error occurred during summarization." };
  }
}

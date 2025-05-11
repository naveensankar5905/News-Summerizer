"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, NewspaperIcon, FileWarningIcon, LightbulbIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  // CardHeader, CardDescription, CardTitle are no longer used directly inside the Card for the main title
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { handleSummarizeArticle } from "./actions";
import { Separator } from "@/components/ui/separator";

const FormSchema = z.object({
  url: z.string().trim().url({ message: "Please enter a valid URL." }),
});

export default function NewsDigestPage() {
  const [summary, setSummary] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      url: "",
    },
    mode: 'onChange', 
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setSummary(null); 

    const result = await handleSummarizeArticle(data.url);

    setIsLoading(false);
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Summarization Failed",
        description: result.error,
      });
    } else if (result.summary) {
      setSummary(result.summary);
      toast({
        title: "Summary Ready!",
        description: "The article has been summarized successfully.",
      });
    } else {
       toast({
        variant: "destructive",
        title: "Summarization Failed",
        description: "An unexpected issue occurred. No summary was returned.",
      });
    }
  }

  function handleClear() {
    form.reset({ url: "" });
    setSummary(null);
    setIsLoading(false); 
  }
  
  const currentUrl = form.watch("url");
  const prevUrlRef = React.useRef<string>();

  React.useEffect(() => {
    if (currentUrl !== prevUrlRef.current && summary) {
        setSummary(null);
    }
    prevUrlRef.current = currentUrl;
  }, [currentUrl, summary]);

  return (
    <main className="min-h-screen flex flex-col bg-secondary/50 dark:bg-background">
      {/* Full-width Header Banner */}
      <header className="w-full bg-primary/5 dark:bg-primary/10 shadow-md py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <NewspaperIcon className="h-16 w-16 sm:h-20 sm:w-20 text-primary mb-4" data-ai-hint="newspaper logo"/>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight">
            News Digest
          </h1>
          <p className="mt-3 text-lg sm:text-xl text-muted-foreground max-w-2xl">
            Get quick AI-powered summaries of online articles.
          </p>
        </div>
      </header>

      {/* Content Area - centered card */}
      <div className="flex-grow flex flex-col items-center w-full px-4 sm:px-8 -mt-8 sm:-mt-10 z-10">
        <Card className="w-full max-w-2xl shadow-2xl rounded-xl overflow-hidden bg-card mb-12">
          {/* CardHeader for main title is removed from here and placed in the top banner */}
          <CardContent className="p-6 pt-8 sm:pt-10"> {/* Adjusted top padding */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="url-input" className="text-lg font-semibold">Article URL</FormLabel>
                      <FormControl>
                        <Input
                          id="url-input"
                          placeholder="e.g., https://www.example.com/article-title"
                          {...field}
                          className="text-base h-12"
                          disabled={isLoading}
                          aria-label="Article URL"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClear}
                    className="w-full sm:w-auto h-11 text-base"
                    disabled={isLoading}
                  >
                    Clear
                  </Button>
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto h-11 text-base"
                    disabled={isLoading || !form.formState.isDirty || !form.formState.isValid}
                    aria-live="polite"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Summarizing...
                      </>
                    ) : (
                      "Summarize Article"
                    )}
                  </Button>
                </div>
              </form>
            </Form>

            {(isLoading || summary) && <Separator className="my-8" />}
            
            {isLoading && (
              <div className="flex flex-col items-center justify-center text-muted-foreground p-4 min-h-[150px]" role="status">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-lg">Fetching and summarizing content...</p>
                <p className="text-sm">This might take a moment.</p>
              </div>
            )}

            {!isLoading && summary && (
              <div
                className="mt-6 space-y-4 animate-in fade-in-0 duration-500"
                key={summary} 
                role="article"
                aria-labelledby="summary-heading"
              >
                <h2 id="summary-heading" className="text-2xl font-semibold text-primary flex items-center">
                  <LightbulbIcon className="mr-2 h-6 w-6" data-ai-hint="idea lightbulb"/>
                  Summary
                </h2>
                <div className="prose prose-base dark:prose-invert max-w-none p-4 border rounded-lg bg-secondary/30 dark:bg-secondary/20 shadow-inner">
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {summary}
                  </p>
                </div>
              </div>
            )}

            {!isLoading && !summary && !form.formState.isSubmitted && ( // Show placeholder only if not submitted or loading
              <div className="mt-8 text-center text-muted-foreground p-4 min-h-[150px] flex flex-col items-center justify-center border-2 border-dashed rounded-lg">
                  <FileWarningIcon className="h-12 w-12 mb-3 opacity-50" data-ai-hint="empty document"/>
                  <p className="text-lg font-medium">Summary will appear here.</p>
                  <p className="text-sm">Enter a URL above and click "Summarize Article".</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-4 bg-muted/50 dark:bg-muted/20 border-t">
              <p className="text-xs text-muted-foreground text-center w-full">
                  Powered by Genkit AI. Summaries may not always be perfect.
              </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lightbulb } from "lucide-react";

interface ScheduleDisplayProps {
  schedule: string;
  isLoading: boolean;
}

export function ScheduleDisplay({ schedule, isLoading }: ScheduleDisplayProps) {
  if (isLoading) {
    return (
      <Card className="mt-8 shadow-lg animate-pulse">
        <CardHeader>
          <CardTitle>Generating Your Schedule...</CardTitle>
          <CardDescription>Our AI is crafting the perfect study plan for you. Please wait a moment.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!schedule) {
    return null; // Don't render anything if there's no schedule and not loading
  }
  
  const isError = schedule.toLowerCase().startsWith("failed to generate schedule");

  return (
    <Card className={`mt-8 shadow-lg ${isError ? 'border-destructive bg-destructive/10' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className={`h-6 w-6 ${isError ? 'text-destructive' : 'text-primary'}`} />
          {isError ? "Schedule Generation Error" : "Your Personalized Study Schedule"}
        </CardTitle>
        {!isError && <CardDescription>Follow this plan to optimize your study time and achieve your goals.</CardDescription>}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-muted/20">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed">
            {schedule}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

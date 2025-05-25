
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ScheduleGeneratorForm } from "@/components/schedule/schedule-generator-form";
import { ScheduleDisplay } from "@/components/schedule/schedule-display";

export default function SchedulePage() {
  const [generatedSchedule, setGeneratedSchedule] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <>
      <PageHeader
        title="Smart Study Scheduler"
        description="Let our AI craft a personalized study schedule based on your courses, grades, and deadlines."
      />
      <ScheduleGeneratorForm 
        onScheduleGenerated={setGeneratedSchedule}
        setIsLoading={setIsLoading}
      />
      <ScheduleDisplay schedule={generatedSchedule} isLoading={isLoading} />
    </>
  );
}

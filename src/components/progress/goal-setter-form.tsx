
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Goal, PlusCircle } from "lucide-react";
import type { AcademicGoal, GoalType } from "@/types/goal";
import { useToast } from "@/hooks/use-toast";

const goalFormSchema = z.object({
  description: z.string().min(5, "Description must be at least 5 characters.").max(200),
  type: z.enum(["grade", "completion", "study_hours"], {
    required_error: "You need to select a goal type.",
  }),
  targetValue: z.string().min(1, "Target value is required."),
  targetDate: z.string().optional(),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

interface GoalSetterFormProps {
  onGoalAdd: (newGoal: AcademicGoal) => void;
}

export function GoalSetterForm({ onGoalAdd }: GoalSetterFormProps) {
  const { toast } = useToast();
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      description: "",
      type: undefined,
      targetValue: "",
      targetDate: "",
    },
  });

  function onSubmit(data: GoalFormValues) {
    const newGoal: AcademicGoal = {
      id: crypto.randomUUID(),
      description: data.description,
      type: data.type as GoalType,
      targetValue: data.type === "grade" || data.type === "study_hours" ? Number(data.targetValue) : data.targetValue,
      currentValue: data.type === "completion" ? 0 : "", // Initial current value
      targetDate: data.targetDate || undefined,
      createdAt: new Date().toISOString(),
    };
    onGoalAdd(newGoal);
    toast({
      title: "Goal Added!",
      description: `Successfully added new goal: ${data.description}`,
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 border rounded-lg shadow-md bg-card">
        <div className="flex items-center gap-2 mb-4">
          <Goal className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Set a New Academic Goal</h2>
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Description</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Achieve A in Math, Complete Physics Project" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goal Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select goal type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="grade">Target Grade</SelectItem>
                    <SelectItem value="completion">Task Completion</SelectItem>
                    <SelectItem value="study_hours">Study Hours</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="targetValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Value</FormLabel>
                <FormControl>
                  <Input type={form.watch("type") === "grade" || form.watch("type") === "study_hours" ? "number" : "text"} placeholder="e.g., 90 (for grade), 100 (for % completion), 10 (for hours)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="targetDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Date (Optional)</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Goal
        </Button>
      </form>
    </Form>
  );
}

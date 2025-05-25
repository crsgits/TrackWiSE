
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, PlusCircle, Trash2, CalendarDays, ListChecks, BookCopy, BarChart2, Clock } from "lucide-react";
import { generateStudySchedule, type GenerateStudyScheduleInput } from "@/ai/flows/generate-study-schedule";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const deadlineSchema = z.object({
  course: z.string().min(1, "Course name is required for deadline."),
  assignment: z.string().min(1, "Assignment name is required."),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Deadline must be in YYYY-MM-DD format."),
});

const examDateSchema = z.object({
  course: z.string().min(1, "Course name is required for exam."),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Exam date must be in YYYY-MM-DD format."),
});

const scheduleFormSchema = z.object({
  courses: z.array(z.object({ name: z.string().min(1, "Course name is required.") })),
  grades: z.array(z.object({ courseName: z.string(), grade: z.coerce.number().min(0).max(100).optional() })),
  upcomingDeadlines: z.array(deadlineSchema),
  studyHoursPerDay: z.coerce.number().min(1, "Minimum 1 study hour per day.").max(16, "Maximum 16 study hours per day."),
  examDates: z.array(examDateSchema),
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

interface ScheduleGeneratorFormProps {
  onScheduleGenerated: (schedule: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export function ScheduleGeneratorForm({ onScheduleGenerated, setIsLoading }: ScheduleGeneratorFormProps) {
  const { toast } = useToast();
  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      courses: [{ name: "" }],
      grades: [],
      upcomingDeadlines: [],
      studyHoursPerDay: 4,
      examDates: [],
    },
  });

  const { fields: courseFields, append: appendCourse, remove: removeCourse } = useFieldArray({
    control: form.control,
    name: "courses",
  });

  const { fields: deadlineFields, append: appendDeadline, remove: removeDeadline } = useFieldArray({
    control: form.control,
    name: "upcomingDeadlines",
  });

  const { fields: examFields, append: appendExam, remove: removeExam } = useFieldArray({
    control: form.control,
    name: "examDates",
  });

  // Sync grades array with courses array
  const currentCourses = form.watch("courses");
  form.setValue("grades", currentCourses.map(c => ({ courseName: c.name, grade: form.getValues("grades").find(g => g.courseName === c.name)?.grade })));


  async function onSubmit(data: ScheduleFormValues) {
    setIsLoading(true);
    onScheduleGenerated(""); // Clear previous schedule

    const formattedGrades: Record<string, number> = {};
    data.grades.forEach(gradeEntry => {
      if (gradeEntry.courseName && typeof gradeEntry.grade === 'number') {
        formattedGrades[gradeEntry.courseName] = gradeEntry.grade;
      }
    });
    
    const inputForAI: GenerateStudyScheduleInput = {
      courses: data.courses.map(c => c.name).filter(name => name.trim() !== ""),
      grades: formattedGrades,
      upcomingDeadlines: data.upcomingDeadlines.filter(d => d.course.trim() !== "" && d.assignment.trim() !== ""),
      studyHoursPerDay: data.studyHoursPerDay,
      examDates: data.examDates.filter(e => e.course.trim() !== ""),
    };

    if (inputForAI.courses.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one course.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await generateStudySchedule(inputForAI);
      onScheduleGenerated(result.schedule);
      toast({
        title: "Schedule Generated!",
        description: "Your personalized study schedule is ready.",
      });
    } catch (error) {
      console.error("Error generating schedule:", error);
      toast({
        title: "Error Generating Schedule",
        description: "Something went wrong. Please try again. " + (error instanceof Error ? error.message : ""),
        variant: "destructive",
      });
      onScheduleGenerated("Failed to generate schedule. Please check your inputs and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <BrainCircuit className="h-7 w-7 text-primary" />
          Smart Study Schedule Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Courses */}
            <div className="space-y-4 p-4 border rounded-md">
              <h3 className="font-medium text-lg flex items-center gap-2"><BookCopy className="h-5 w-5 text-primary"/>Courses & Grades</h3>
              {courseFields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-2">
                  <FormField
                    control={form.control}
                    name={`courses.${index}.name`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormLabel>Course {index + 1} Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Math 101" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`grades.${index}.grade`}
                    render={({ field: gradeField }) => (
                       <FormItem>
                        <FormLabel>Grade (0-100)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 85" {...gradeField} onChange={(e) => {
                            gradeField.onChange(e.target.value === '' ? undefined : Number(e.target.value));
                            // Keep courseName in sync
                            form.setValue(`grades.${index}.courseName`, form.getValues(`courses.${index}.name`));
                          }}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {courseFields.length > 1 && (
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeCourse(index)} aria-label="Remove course">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendCourse({ name: "" })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Course
              </Button>
            </div>
            
            <Separator/>

            {/* Upcoming Deadlines */}
            <div className="space-y-4 p-4 border rounded-md">
              <h3 className="font-medium text-lg flex items-center gap-2"><ListChecks className="h-5 w-5 text-primary"/>Upcoming Deadlines</h3>
              {deadlineFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                  <FormField control={form.control} name={`upcomingDeadlines.${index}.course`}
                    render={({ field }) => (
                      <FormItem className="md:col-span-1"><FormLabel>Course</FormLabel><FormControl><Input placeholder="Course Name" {...field} /></FormControl><FormMessage /></FormItem>
                    )}
                  />
                  <FormField control={form.control} name={`upcomingDeadlines.${index}.assignment`}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2"><FormLabel>Assignment</FormLabel><FormControl><Input placeholder="Assignment Title" {...field} /></FormControl><FormMessage /></FormItem>
                    )}
                  />
                  <FormField control={form.control} name={`upcomingDeadlines.${index}.deadline`}
                    render={({ field }) => (
                      <FormItem className="md:col-span-1"><FormLabel>Date (YYYY-MM-DD)</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                    )}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeDeadline(index)} aria-label="Remove deadline" className="md:col-start-5">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendDeadline({ course: "", assignment: "", deadline: "" })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Deadline
              </Button>
            </div>

            <Separator/>

            {/* Exam Dates */}
            <div className="space-y-4 p-4 border rounded-md">
              <h3 className="font-medium text-lg flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary"/>Exam Dates</h3>
              {examFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                  <FormField control={form.control} name={`examDates.${index}.course`}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2"><FormLabel>Course</FormLabel><FormControl><Input placeholder="Course Name" {...field} /></FormControl><FormMessage /></FormItem>
                    )}
                  />
                  <FormField control={form.control} name={`examDates.${index}.date`}
                    render={({ field }) => (
                      <FormItem><FormLabel>Date (YYYY-MM-DD)</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                    )}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeExam(index)} aria-label="Remove exam date" className="md:col-start-4">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendExam({ course: "", date: "" })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Exam Date
              </Button>
            </div>

            <Separator/>
            
            {/* Study Hours */}
             <FormField
              control={form.control}
              name="studyHoursPerDay"
              render={({ field }) => (
                <FormItem className="p-4 border rounded-md">
                  <FormLabel className="font-medium text-lg flex items-center gap-2"><Clock className="h-5 w-5 text-primary"/>Daily Study Hours</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 4" {...field} />
                  </FormControl>
                  <FormDescription>How many hours can you dedicate to studying each day?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
              <BrainCircuit className="mr-2 h-4 w-4" /> Generate Schedule
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

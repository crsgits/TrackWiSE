
"use client";

import type { AcademicGoal } from "@/types/goal";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, differenceInDays, formatDistanceToNowStrict } from "date-fns";
import { Target, CheckCircle2, Clock, TrendingUp, Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface GoalsDisplayProps {
  goals: AcademicGoal[];
  onUpdateGoal: (goalId: string, newCurrentValue: string | number) => void;
  onDeleteGoal: (goalId: string) => void;
}

export function GoalsDisplay({ goals, onUpdateGoal, onDeleteGoal }: GoalsDisplayProps) {
  if (goals.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed rounded-lg">
        <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-muted-foreground">No Goals Set Yet</h3>
        <p className="text-muted-foreground">Start by adding a new academic goal above.</p>
      </div>
    );
  }

  const calculateProgress = (goal: AcademicGoal): number => {
    if (goal.type === "completion") {
      return Number(goal.currentValue) || 0;
    }
    if (goal.type === "grade" || goal.type === "study_hours") {
      const target = Number(goal.targetValue);
      const current = Number(goal.currentValue) || 0;
      if (target === 0) return current > 0 ? 100 : 0;
      return Math.min(Math.max((current / target) * 100, 0), 100);
    }
    return 0;
  };

  const getGoalStatus = (goal: AcademicGoal): { text: string; color: string; Icon: any } => {
    const progress = calculateProgress(goal);
    if (progress >= 100) return { text: "Completed", color: "bg-green-500", Icon: CheckCircle2 };
    if (goal.targetDate && differenceInDays(parseISO(goal.targetDate), new Date()) < 0) {
      return { text: "Overdue", color: "bg-red-500", Icon: Clock };
    }
    return { text: "In Progress", color: "bg-blue-500", Icon: TrendingUp };
  };
  
  // Dummy update handler
  const handleUpdateProgress = (goalId: string) => {
    const goalToUpdate = goals.find(g => g.id === goalId);
    if (!goalToUpdate) return;

    let newValue: string | number;
    if (goalToUpdate.type === 'completion') {
      newValue = Math.min((Number(goalToUpdate.currentValue) || 0) + 10, 100); // Increment by 10%
    } else if (goalToUpdate.type === 'grade') {
      newValue = Math.min((Number(goalToUpdate.currentValue) || 0) + 5, Number(goalToUpdate.targetValue)); // Increment by 5 points
    } else { // study_hours
      newValue = (Number(goalToUpdate.currentValue) || 0) + 1; // Increment by 1 hour
    }
    onUpdateGoal(goalId, newValue);
  };


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <Target className="h-7 w-7 text-primary" />
        Your Goals
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => {
          const progress = calculateProgress(goal);
          const status = getGoalStatus(goal);
          return (
            <Card key={goal.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{goal.description}</CardTitle>
                  <Badge variant="outline" className="capitalize flex items-center gap-1 text-xs">
                    <status.Icon className={`h-3 w-3 ${status.color === 'bg-green-500' ? 'text-green-500' : status.color === 'bg-red-500' ? 'text-red-500' : 'text-blue-500' }`} />
                    {status.text}
                  </Badge>
                </div>
                <CardDescription>
                  Target: {goal.targetValue}
                  {goal.type === "completion" ? "%" : goal.type === "grade" ? " pts" : " hrs"}
                  {goal.targetDate && ` by ${format(parseISO(goal.targetDate), "MMM dd, yyyy")}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <Progress value={progress} aria-label={`${goal.description} progress`} className="h-3 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Current: {goal.currentValue || (goal.type === 'completion' ? '0' : 'N/A')}
                  {goal.type === "completion" ? "%" : goal.type === "grade" ? " pts" : " hrs"}
                </p>
                {goal.targetDate && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {differenceInDays(parseISO(goal.targetDate), new Date()) >= 0 
                      ? `${formatDistanceToNowStrict(parseISO(goal.targetDate))} left`
                      : `${formatDistanceToNowStrict(parseISO(goal.targetDate))} overdue`}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Set: {formatDistanceToNowStrict(parseISO(goal.createdAt))} ago
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => handleUpdateProgress(goal.id)}>
                  <Edit3 className="h-4 w-4 mr-1.5" /> Update
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-1.5" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this goal.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDeleteGoal(goal.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

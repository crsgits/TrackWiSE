
import type { LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

export interface DeadlineItem {
  id: string;
  title: string;
  course: string;
  dueDate: string; // ISO Date string
  Icon: LucideIcon;
}

interface UpcomingDeadlinesListProps {
  deadlines: DeadlineItem[];
  className?: string;
}

export function UpcomingDeadlinesList({ deadlines, className }: UpcomingDeadlinesListProps) {
  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300 h-full", className)}>
      <CardHeader>
        <CardTitle>Upcoming Deadlines</CardTitle>
        <CardDescription>Stay on top of your assignments and exams.</CardDescription>
      </CardHeader>
      <CardContent>
        {deadlines.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming deadlines. Great job!</p>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <ul className="space-y-4">
              {deadlines.map((deadline, index) => (
                <li key={deadline.id}>
                  <div className="flex items-start space-x-3">
                    <deadline.Icon className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold">{deadline.title}</p>
                      <p className="text-sm text-muted-foreground">{deadline.course}</p>
                      <p className="text-xs text-accent-foreground/80 bg-accent/20 px-1.5 py-0.5 rounded-full inline-block mt-1">
                        Due: {format(parseISO(deadline.dueDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  {index < deadlines.length - 1 && <Separator className="my-4" />}
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

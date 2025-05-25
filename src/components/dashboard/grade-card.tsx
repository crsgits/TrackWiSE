
import type { LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GradeCardProps {
  courseName: string;
  grade: number;
  Icon: LucideIcon;
  className?: string;
}

export function GradeCard({ courseName, grade, Icon, className }: GradeCardProps) {
  let gradeColor = "text-foreground";
  if (grade >= 90) gradeColor = "text-green-600";
  else if (grade >= 80) gradeColor = "text-blue-600";
  else if (grade >= 70) gradeColor = "text-yellow-600";
  else if (grade >= 60) gradeColor = "text-orange-600";
  else gradeColor = "text-red-600";

  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{courseName}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className={cn("text-3xl font-bold", gradeColor)}>{grade}%</div>
        <CardDescription className="text-xs text-muted-foreground">
          Current grade
        </CardDescription>
      </CardContent>
    </Card>
  );
}

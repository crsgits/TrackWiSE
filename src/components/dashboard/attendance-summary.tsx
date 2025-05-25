
import { UserCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AttendanceSummaryProps {
  attendedClasses: number;
  totalClasses: number;
  className?: string;
}

export function AttendanceSummary({ attendedClasses, totalClasses, className }: AttendanceSummaryProps) {
  const attendancePercentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Attendance</CardTitle>
        <UserCheck className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{attendancePercentage}%</div>
        <CardDescription className="text-xs text-muted-foreground">
          {attendedClasses} of {totalClasses} classes attended
        </CardDescription>
        <Progress value={attendancePercentage} className="mt-2 h-2" />
      </CardContent>
    </Card>
  );
}

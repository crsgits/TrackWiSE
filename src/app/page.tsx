
import { PageHeader } from "@/components/shared/page-header";
import { GradeCard } from "@/components/dashboard/grade-card";
import { AttendanceSummary } from "@/components/dashboard/attendance-summary";
import { UpcomingDeadlinesList, type DeadlineItem } from "@/components/dashboard/upcoming-deadlines-list";
import { BookOpen, Sigma, ClipboardList, Users, FileText, Presentation, BarChartBig, Palette } from "lucide-react";

// Mock Data
const gradesData = [
  { id: "1", courseName: "Mathematics", grade: 88, Icon: Sigma },
  { id: "2", courseName: "Literature", grade: 92, Icon: BookOpen },
  { id: "3", courseName: "History", grade: 75, Icon: ClipboardList },
  { id: "4", courseName: "Physics", grade: 82, Icon: BarChartBig },
  { id: "5", courseName: "Art", grade: 95, Icon: Palette },
];

const attendanceData = {
  attendedClasses: 45,
  totalClasses: 50,
};

const deadlinesData: DeadlineItem[] = [
  { id: "d1", title: "Essay Submission", course: "Literature", dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), Icon: FileText },
  { id: "d2", title: "Midterm Exam", course: "Mathematics", dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), Icon: Presentation },
  { id: "d3", title: "Project Proposal", course: "Physics", dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), Icon: ClipboardList },
  { id: "d4", title: "Historical Analysis Paper", course: "History", dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), Icon: FileText },
];

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's your academic overview."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {gradesData.map((grade) => (
          <GradeCard
            key={grade.id}
            courseName={grade.courseName}
            grade={grade.grade}
            Icon={grade.Icon}
          />
        ))}
        <AttendanceSummary
          attendedClasses={attendanceData.attendedClasses}
          totalClasses={attendanceData.totalClasses}
          className="lg:col-start-auto"
        />
      </div>
      <div className="mt-8">
        <UpcomingDeadlinesList deadlines={deadlinesData} />
      </div>
    </>
  );
}


export type GoalType = "grade" | "completion" | "study_hours";

export interface AcademicGoal {
  id: string;
  description: string;
  type: GoalType;
  targetValue: string | number; // e.g., "90" for grade, "100" for completion percentage, "10" for study hours
  currentValue: string | number;
  targetDate?: string; // ISO Date string
  createdAt: string; // ISO Date string
}

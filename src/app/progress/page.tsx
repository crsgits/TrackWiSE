
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { GoalSetterForm } from "@/components/progress/goal-setter-form";
import { GoalsDisplay } from "@/components/progress/goals-display";
import type { AcademicGoal } from "@/types/goal";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

// Mock initial goals
const initialGoals: AcademicGoal[] = [
  {
    id: "1",
    description: "Achieve 90% in Calculus",
    type: "grade",
    targetValue: 90,
    currentValue: 75,
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: "2",
    description: "Complete History Research Paper",
    type: "completion",
    targetValue: 100,
    currentValue: 40, // 40% done
    targetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
];


export default function ProgressPage() {
  const [goals, setGoals] = useState<AcademicGoal[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Simulate fetching goals or load from local storage
    const storedGoals = localStorage.getItem("academicGoals");
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    } else {
      setGoals(initialGoals); // Use initial mock data if nothing in local storage
    }
  }, []);

  useEffect(() => {
    // Persist goals to local storage whenever they change
    if (goals.length > 0 || localStorage.getItem("academicGoals")) { // Only save if goals exist or were previously saved
        localStorage.setItem("academicGoals", JSON.stringify(goals));
    }
  }, [goals]);

  const handleAddGoal = (newGoal: AcademicGoal) => {
    setGoals((prevGoals) => [newGoal, ...prevGoals]);
    setShowForm(false); // Hide form after adding a goal
  };

  const handleUpdateGoal = (goalId: string, newCurrentValue: string | number) => {
    setGoals(prevGoals => 
      prevGoals.map(goal => 
        goal.id === goalId ? { ...goal, currentValue: newCurrentValue } : goal
      )
    );
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
  };

  return (
    <>
      <PageHeader
        title="Academic Progress"
        description="Set and track your academic goals to stay motivated and organized."
        actions={
          !showForm && (
            <Button onClick={() => setShowForm(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Goal
            </Button>
          )
        }
      />

      {showForm && (
        <div className="mb-8">
          <GoalSetterForm onGoalAdd={handleAddGoal} />
           <Button variant="outline" onClick={() => setShowForm(false)} className="mt-4">
            Cancel
          </Button>
        </div>
      )}

      <GoalsDisplay goals={goals} onUpdateGoal={handleUpdateGoal} onDeleteGoal={handleDeleteGoal} />
    </>
  );
}

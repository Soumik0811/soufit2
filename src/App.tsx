import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Dumbbell,
  Timer,
  RefreshCw,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

// Updated Exercise Interface with isCompleted Field
interface Exercise {
  name: string;
  sets: number;
  reps: string;
  weight: number; // Added weight field
  description?: string;
  isCompleted: boolean; // Checkbox state
}

interface WorkoutDay {
  day: string;
  focus: string;
  description: string;
  exercises: Exercise[];
  isCompleted: boolean;
}

function App() {
  const [workoutDays, setWorkoutDays] =
    useState<WorkoutDay[]>(initialWorkoutDays);

  // Function to toggle completion status of a day
  const toggleDayCompletion = (dayIndex: number) => {
    setWorkoutDays((days) =>
      days.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              isCompleted: !day.isCompleted,
              exercises: day.exercises.map((exercise) => ({
                ...exercise,
                isCompleted: !day.isCompleted, // Sync all exercises with day completion
              })),
            }
          : day
      )
    );
  };

  // Function to toggle completion status of an individual exercise
  const toggleExerciseCompletion = (
    dayIndex: number,
    exerciseIndex: number
  ) => {
    setWorkoutDays((days) =>
      days.map((day, dIndex) =>
        dIndex === dayIndex
          ? {
              ...day,
              exercises: day.exercises.map((exercise, eIndex) =>
                eIndex === exerciseIndex
                  ? { ...exercise, isCompleted: !exercise.isCompleted }
                  : exercise
              ),
            }
          : day
      )
    );
  };

  // Function to update dumbbell weight for an exercise
  const updateWeight = (
    dayIndex: number,
    exerciseIndex: number,
    newWeight: number
  ) => {
    setWorkoutDays((days) =>
      days.map((day, dIndex) =>
        dIndex === dayIndex
          ? {
              ...day,
              exercises: day.exercises.map((exercise, eIndex) =>
                eIndex === exerciseIndex
                  ? { ...exercise, weight: newWeight }
                  : exercise
              ),
            }
          : day
      )
    );
  };

  // Calculate Overall Progress Percentage
  const calculateProgress = () => {
    const totalExercises = workoutDays.reduce(
      (total, day) => total + day.exercises.length,
      0
    );
    const completedExercises = workoutDays.reduce(
      (completed, day) =>
        completed +
        day.exercises.filter((exercise) => exercise.isCompleted).length,
      0
    );
    return totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
  };

  const progressPercentage = calculateProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dumbbell Home Workout Plan
          </h1>
          <p className="text-gray-600 flex items-center justify-center gap-2 text-lg">
            <Dumbbell className="w-5 h-5" />
            Progressive Resistance Training
          </p>
        </header>

        {/* Progress Bar */}
        <div className="mb-8 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Progress Tracker
          </h2>
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">
              {Math.round(progressPercentage)}% Completed
            </p>
            <button
              onClick={() => {
                setWorkoutDays((days) =>
                  days.map((day) => ({
                    ...day,
                    isCompleted: false,
                    exercises: day.exercises.map((exercise) => ({
                      ...exercise,
                      isCompleted: false,
                    })),
                  }))
                );
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset Progress
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Workout Days */}
        <div className="space-y-6">
          {workoutDays.map((day, dayIndex) => (
            <div
              key={day.day}
              className={`bg-white rounded-xl shadow-sm overflow-hidden ${
                day.isCompleted ? 'border-l-4 border-green-500' : ''
              }`}
            >
              <div
                className="p-6 cursor-pointer bg-gray-50 border-b"
                onClick={() => toggleDayCompletion(dayIndex)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {day.day}
                    </h2>
                    <p className="text-indigo-600 font-medium">{day.focus}</p>
                  </div>
                  <button
                    className="text-gray-600 hover:text-green-500 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDayCompletion(dayIndex);
                    }}
                  >
                    {day.isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>
                </div>
                <p className="text-gray-600 text-sm mt-2">{day.description}</p>
              </div>

              {/* Exercises */}
              <div className="p-4 space-y-4">
                {day.exercises.map((exercise, exIndex) => (
                  <div
                    key={exIndex}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <span className="text-gray-800 font-medium">
                        {exercise.name}
                      </span>
                      {exercise.description && (
                        <p className="text-gray-600 text-xs mt-1">
                          {exercise.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Timer className="w-3 h-3" />
                      <span>
                        {exercise.sets} × {exercise.reps}
                      </span>
                      <div className="flex items-center gap-1">
                        <Dumbbell className="w-4 h-4" />
                        <input
                          type="number"
                          value={exercise.weight}
                          onChange={(e) =>
                            updateWeight(
                              dayIndex,
                              exIndex,
                              Number(e.target.value)
                            )
                          }
                          className="w-16 px-2 py-1 text-center border rounded"
                        />
                        <span>kg</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExerciseCompletion(dayIndex, exIndex);
                        }}
                        className="text-gray-600 hover:text-green-500 transition-colors"
                      >
                        {exercise.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Initial Workout Days Data
const initialWorkoutDays: WorkoutDay[] = [
  {
    day: 'Day 1 – Arms + Core',
    focus: 'Arms & Core Strength',
    description: 'Focus on biceps, triceps, and core stability.',
    exercises: [
      {
        name: 'Dumbbell Bicep Curls',
        sets: 3,
        reps: '10–12',
        weight: 8,
        isCompleted: false,
      },
      {
        name: 'Dumbbell Hammer Curls',
        sets: 3,
        reps: '10',
        weight: 8,
        isCompleted: false,
      },
      {
        name: 'Overhead Dumbbell Tricep Extensions',
        sets: 3,
        reps: '12',
        weight: 8,
        isCompleted: false,
      },
      {
        name: 'Dumbbell Concentration Curls',
        sets: 2,
        reps: '12',
        weight: 8,
        isCompleted: false,
      },
      {
        name: 'Plank (hold)',
        sets: 3,
        reps: '30–45 sec',
        weight: 0,
        isCompleted: false,
      },
      {
        name: 'Russian Twists',
        sets: 3,
        reps: '20',
        weight: 5,
        isCompleted: false,
      },
      {
        name: 'Leg Raises',
        sets: 3,
        reps: '15',
        weight: 0,
        isCompleted: false,
      },
    ],
    isCompleted: false,
  },
  {
    day: 'Day 2 – Legs + Core',
    focus: 'Legs & Core Stability',
    description: 'Strengthen legs and engage core muscles.',
    exercises: [
      {
        name: 'Dumbbell Goblet Squats',
        sets: 3,
        reps: '15',
        weight: 10,
        isCompleted: false,
      },
      {
        name: 'Dumbbell Lunges',
        sets: 3,
        reps: '10/leg',
        weight: 10,
        isCompleted: false,
      },
      {
        name: 'Dumbbell Romanian Deadlifts',
        sets: 3,
        reps: '12',
        weight: 10,
        isCompleted: false,
      },
      {
        name: 'Wall Sit',
        sets: 2,
        reps: '45 sec',
        weight: 0,
        isCompleted: false,
      },
      {
        name: 'Toe Touches',
        sets: 3,
        reps: '20',
        weight: 0,
        isCompleted: false,
      },
      {
        name: 'Mountain Climbers',
        sets: 3,
        reps: '30 sec',
        weight: 0,
        isCompleted: false,
      },
    ],
    isCompleted: false,
  },
  {
    day: 'Day 3 – Push (Chest, Shoulders, Triceps) + Core',
    focus: 'Upper Body Push',
    description: 'Focus on chest, shoulders, and triceps.',
    exercises: [
      {
        name: 'Dumbbell Floor Press',
        sets: 3,
        reps: '12',
        weight: 12,
        isCompleted: false,
      },
      {
        name: 'Dumbbell Shoulder Press',
        sets: 3,
        reps: '10',
        weight: 10,
        isCompleted: false,
      },
      {
        name: 'Dumbbell Front Raises',
        sets: 3,
        reps: '12',
        weight: 8,
        isCompleted: false,
      },
      { name: 'Push-Ups', sets: 3, reps: 'Max', weight: 0, isCompleted: false },
      {
        name: 'Plank with Shoulder Tap',
        sets: 3,
        reps: '30 sec',
        weight: 0,
        isCompleted: false,
      },
      {
        name: 'Flutter Kicks',
        sets: 3,
        reps: '20',
        weight: 0,
        isCompleted: false,
      },
    ],
    isCompleted: false,
  },
  {
    day: 'Day 4 – Pull (Back, Biceps) + Core',
    focus: 'Upper Body Pull',
    description: 'Focus on back and biceps.',
    exercises: [
      {
        name: 'Dumbbell Bent-Over Rows',
        sets: 3,
        reps: '12',
        weight: 12,
        isCompleted: false,
      },
      {
        name: 'Renegade Rows',
        sets: 3,
        reps: '10/side',
        weight: 10,
        isCompleted: false,
      },
      {
        name: 'Dumbbell Shrugs',
        sets: 3,
        reps: '15',
        weight: 12,
        isCompleted: false,
      },
      {
        name: 'Dumbbell Deadlifts',
        sets: 3,
        reps: '12',
        weight: 14,
        isCompleted: false,
      },
      {
        name: 'Bicycle Crunches',
        sets: 3,
        reps: '20',
        weight: 0,
        isCompleted: false,
      },
      {
        name: 'Side Plank',
        sets: 2,
        reps: '30 sec',
        weight: 0,
        isCompleted: false,
      },
    ],
    isCompleted: false,
  },
  {
    day: 'Day 5 – Full Body Burnout + Core',
    focus: 'Full Body Workout',
    description: 'High-intensity full-body workout.',
    exercises: [
      {
        name: 'Dumbbell Squat to Press',
        sets: 3,
        reps: '12',
        weight: 12,
        isCompleted: false,
      },
      {
        name: 'Push-Up to Renegade Row',
        sets: 3,
        reps: '8/side',
        weight: 10,
        isCompleted: false,
      },
      {
        name: 'Dumbbell Swing',
        sets: 3,
        reps: '15',
        weight: 12,
        isCompleted: false,
      },
      { name: 'Burpees', sets: 3, reps: '10', weight: 0, isCompleted: false },
      {
        name: 'Sit-Ups with Dumbbell',
        sets: 3,
        reps: '15',
        weight: 5,
        isCompleted: false,
      },
      {
        name: 'Plank March',
        sets: 3,
        reps: '30 sec',
        weight: 0,
        isCompleted: false,
      },
    ],
    isCompleted: false,
  },
];

export default App;

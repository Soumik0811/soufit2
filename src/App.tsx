import React, { useState, useEffect } from 'react';
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

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  description?: string;
}

interface WorkoutDay {
  day: string;
  focus: string;
  description: string;
  exercises: Exercise[];
  isCompleted: boolean;
}

interface WorkoutWeek {
  week: string;
  title: string;
  description: string;
  days: WorkoutDay[];
}

function App() {
  const [workoutWeeks, setWorkoutWeeks] = useState<WorkoutWeek[]>(() => {
    const saved = localStorage.getItem('workoutProgress');
    return saved ? JSON.parse(saved) : initialWorkoutWeeks;
  });

  const [selectedWeek, setSelectedWeek] = useState<number | null>(0);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('workoutProgress', JSON.stringify(workoutWeeks));
  }, [workoutWeeks]);

  const toggleDayCompletion = (weekIndex: number, dayIndex: number) => {
    setWorkoutWeeks((weeks) =>
      weeks.map((week, wIndex) =>
        wIndex === weekIndex
          ? {
              ...week,
              days: week.days.map((day, dIndex) =>
                dIndex === dayIndex
                  ? { ...day, isCompleted: !day.isCompleted }
                  : day
              ),
            }
          : week
      )
    );
  };

  const resetProgress = () => {
    setWorkoutWeeks((weeks) =>
      weeks.map((week) => ({
        ...week,
        days: week.days.map((day) => ({ ...day, isCompleted: false })),
      }))
    );
    setSelectedDay(null);
  };

  const allWorkoutDays = workoutWeeks.flatMap((week) => week.days);
  const completedWorkouts = allWorkoutDays.filter(
    (day) => day.isCompleted
  ).length;
  const totalWorkouts = allWorkoutDays.length;
  const progressPercentage = (completedWorkouts / totalWorkouts) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            4-Week Push-up Mastery Journey
          </h1>
          <p className="text-gray-600 flex items-center justify-center gap-2 text-lg">
            <Calendar className="w-5 h-5" />
            Progressive Strength & Conditioning
          </p>
        </header>

        <div className="mb-8 bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Progress Tracker
              </h2>
              <p className="text-gray-600">
                {completedWorkouts} of {totalWorkouts} workouts completed
              </p>
            </div>
            <button
              onClick={resetProgress}
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

        <div className="space-y-6">
          {workoutWeeks.map((week, weekIndex) => (
            <div
              key={week.week}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div
                className="p-6 cursor-pointer bg-gray-50 border-b"
                onClick={() =>
                  setSelectedWeek(selectedWeek === weekIndex ? null : weekIndex)
                }
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {week.week}
                    </h2>
                    <p className="text-indigo-600 font-medium">{week.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {week.days.filter((day) => day.isCompleted).length} /{' '}
                      {week.days.length}
                    </span>
                    {selectedWeek === weekIndex ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2">{week.description}</p>
              </div>

              {selectedWeek === weekIndex && (
                <div className="p-4">
                  <div className="grid gap-4">
                    {week.days.map((day, dayIndex) => (
                      <div
                        key={day.day}
                        className={`bg-white rounded-lg border transition-all ${
                          day.isCompleted ? 'border-l-4 border-green-500' : ''
                        }`}
                      >
                        <div
                          className="p-4 cursor-pointer"
                          onClick={() =>
                            setSelectedDay(
                              selectedDay === dayIndex ? null : dayIndex
                            )
                          }
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Dumbbell className="w-4 h-4 text-indigo-500" />
                                {day.day}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {day.focus}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDayCompletion(weekIndex, dayIndex);
                              }}
                              className="text-gray-600 hover:text-green-500 transition-colors"
                            >
                              {day.isCompleted ? (
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                              ) : (
                                <Circle className="w-6 h-6" />
                              )}
                            </button>
                          </div>

                          <p className="text-gray-600 text-xs">
                            {day.description}
                          </p>

                          {selectedDay === dayIndex && (
                            <div className="space-y-2 mt-4 border-t pt-4">
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
                                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                                    <Timer className="w-3 h-3" />
                                    <span>
                                      {exercise.sets} × {exercise.reps}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const initialWorkoutWeeks: WorkoutWeek[] = [
  {
    week: 'Week 1',
    title: 'Base Building',
    description:
      'Push-up volume starts growing with modified versions to build strength foundation',
    days: [
      {
        day: 'Day 1',
        focus: 'Upper Body Foundation',
        description:
          'Beginner-friendly push variations to start building chest and triceps',
        exercises: [
          {
            name: 'Incline Push-ups',
            sets: 4,
            reps: '10',
            description: 'Hands elevated, maintain straight body',
          },
          {
            name: 'Knee Push-ups',
            sets: 3,
            reps: '8',
            description: 'Keep core tight, lower chest to ground',
          },
          {
            name: 'Wall Push-up Hold',
            sets: 3,
            reps: '20 sec',
            description: 'Arms extended against wall, isometric hold',
          },
        ],
        isCompleted: false,
      },
      {
        day: 'Day 2',
        focus: 'Core Stability',
        description:
          'Building the foundational core strength needed for proper push-ups',
        exercises: [
          {
            name: 'Plank',
            sets: 3,
            reps: '30 sec',
            description: 'Keep body straight, engage core',
          },
          {
            name: 'Leg Raises',
            sets: 3,
            reps: '10',
            description: 'Keep legs straight, control the movement',
          },
          {
            name: 'Bird Dog',
            sets: 3,
            reps: '10/side',
            description: 'Opposite arm and leg, maintain balance',
          },
        ],
        isCompleted: false,
      },
      {
        day: 'Day 3',
        focus: 'Lower Body Strength',
        description:
          'Building lower body foundation for overall strength and stability',
        exercises: [
          {
            name: 'Bodyweight Squats',
            sets: 3,
            reps: '15',
            description: 'Full depth, keep chest up',
          },
          {
            name: 'Glute Bridges',
            sets: 3,
            reps: '12',
            description: 'Drive through heels, squeeze at top',
          },
          {
            name: 'Wall Sit',
            sets: 2,
            reps: '30 sec',
            description: 'Back flat against wall, thighs parallel',
          },
        ],
        isCompleted: false,
      },
      {
        day: 'Day 4',
        focus: 'Push & Core Combo',
        description:
          'Combining upper body and core work for better stabilization',
        exercises: [
          {
            name: 'Incline Push-ups',
            sets: 3,
            reps: '12',
            description: 'Hands elevated, maintain straight body',
          },
          {
            name: 'Knee Push-ups',
            sets: 2,
            reps: '10',
            description: 'Keep core tight, lower chest to ground',
          },
          {
            name: 'Plank Shoulder Taps',
            sets: 3,
            reps: '10',
            description: 'Maintain stable hips while tapping shoulders',
          },
        ],
        isCompleted: false,
      },
      {
        day: 'Day 5',
        focus: 'Full Body Circuit',
        description:
          'Combining movements for endurance and full body integration',
        exercises: [
          {
            name: 'Circuit (2 Rounds)',
            sets: 2,
            reps: 'Complete circuit',
            description:
              'Minimal rest between exercises, 1-2 min between rounds',
          },
          {
            name: 'Incline Push-ups',
            sets: 1,
            reps: '10',
            description: 'Part of circuit',
          },
          {
            name: 'Squats',
            sets: 1,
            reps: '10',
            description: 'Part of circuit',
          },
          {
            name: 'Plank',
            sets: 1,
            reps: '20 sec',
            description: 'Part of circuit',
          },
          {
            name: 'Bird Dogs',
            sets: 1,
            reps: '10/side',
            description: 'Part of circuit',
          },
        ],
        isCompleted: false,
      },
    ],
  },
  {
    week: 'Week 2',
    title: 'Real Gains',
    description:
      'Standard push-ups begin as strength increases through progressive overload',
    days: [
      {
        day: 'Day 1',
        focus: 'Push-up Progression',
        description:
          'First introduction to standard push-ups with supportive variations',
        exercises: [
          {
            name: 'Normal Push-ups',
            sets: 3,
            reps: '3',
            description: 'Full push-ups with proper form',
          },
          {
            name: 'Incline Push-ups',
            sets: 3,
            reps: '12',
            description: 'Hands elevated, maintain straight body',
          },
          {
            name: 'Knee Push-ups',
            sets: 2,
            reps: '10',
            description: 'Keep core tight, lower chest to ground',
          },
        ],
        isCompleted: false,
      },
      {
        day: 'Day 2',
        focus: 'Core Advancement',
        description:
          'Increasing core endurance and introducing more challenging movements',
        exercises: [
          {
            name: 'Plank',
            sets: 3,
            reps: '40 sec',
            description: 'Keep body straight, engage core',
          },
          {
            name: 'Leg Raises',
            sets: 3,
            reps: '12',
            description: 'Keep legs straight, control the movement',
          },
          {
            name: 'V-Ups',
            sets: 2,
            reps: '10',
            description: 'Simultaneously raise arms and legs to form a V',
          },
        ],
        isCompleted: false,
      },
      {
        day: 'Day 3',
        focus: 'Lower Body Volume',
        description: 'Increasing repetitions to build muscular endurance',
        exercises: [
          {
            name: 'Squats',
            sets: 4,
            reps: '15',
            description: 'Full depth, keep chest up',
          },
          {
            name: 'Glute Bridges',
            sets: 3,
            reps: '15',
            description: 'Drive through heels, squeeze at top',
          },
          {
            name: 'Wall Sit',
            sets: 2,
            reps: '40 sec',
            description: 'Back flat against wall, thighs parallel',
          },
        ],
        isCompleted: false,
      },
      {
        day: 'Day 4',
        focus: 'Upper & Core Integration',
        description:
          'Building push-up strength with core stabilization exercises',
        exercises: [
          {
            name: 'Normal Push-ups',
            sets: 3,
            reps: '4',
            description: 'Full push-ups with proper form',
          },
          {
            name: 'Plank Shoulder Taps',
            sets: 3,
            reps: '12',
            description: 'Maintain stable hips while tapping shoulders',
          },
          {
            name: 'Russian Twists',
            sets: 2,
            reps: '15/side',
            description: 'Rotate torso, keep feet elevated',
          },
        ],
        isCompleted: false,
      },
      {
        day: 'Day 5',
        focus: 'Progressive Circuit',
        description: 'More challenging circuit with standard push-ups included',
        exercises: [
          {
            name: 'Circuit (3 Rounds)',
            sets: 3,
            reps: 'Complete circuit',
            description:
              'Minimal rest between exercises, 1-2 min between rounds',
          },
          {
            name: 'Normal Push-ups',
            sets: 1,
            reps: '5',
            description: 'Part of circuit',
          },
          {
            name: 'Squats',
            sets: 1,
            reps: '15',
            description: 'Part of circuit',
          },
          {
            name: 'Plank',
            sets: 1,
            reps: '30 sec',
            description: 'Part of circuit',
          },
          {
            name: 'V-Ups',
            sets: 1,
            reps: '10',
            description: 'Part of circuit',
          },
        ],
        isCompleted: false,
      },
    ],
  },
  {
    week: 'Week 3',
    title: 'Build Endurance',
    description:
      'Higher repetitions and more challenging variations to build muscular endurance',
    days: [
      {
        day: 'Day 1',
        focus: 'Push-up Volume',
        description:
          'Increasing standard push-up repetitions with supportive exercises',
        exercises: [
          {
            name: 'Push-ups',
            sets: 4,
            reps: '6',
            description: 'Full push-ups with proper form',
          },
          {
            name: 'Incline Push-ups',
            sets: 3,
            reps: '10',
            description: 'Hands elevated, maintain straight body',
          },
          {
            name: 'Wall Push-up Hold',
            sets: 2,
            reps: '40 sec',
            description: 'Arms extended against wall, isometric hold',
          },
        ],
        isCompleted: false,
      },
      {
        day: 'Day 2',
        focus: 'Core Endurance',
        description:
          'Building longer-duration core stability for better push-ups',
        exercises: [
          {
            name: 'Plank',
            sets: 3,
            reps: '50 sec',
            description: 'Keep body straight, engage core',
          },
          {
            name: 'Leg Raises',
            sets: 3,
            reps: '15',
            description: 'Keep legs straight, control the movement',
          },
          {
            name: 'Hollow Body Hold',
            sets: 3,
            reps: '20 sec',
            description: 'Low back pressed to floor, limbs extended',
          },
        ],
        isCompleted: false,
      },
      {
        day: 'Day 3',
        focus: 'Explosive Lower Body',
        description: 'Adding plyometric elements to build power and endurance',
        exercises: [
          {
            name: 'Jump Squats',
            sets: 3,
            reps: '10',
            description: 'Explosive up, soft landing',
          },
          {
            name: 'Wall Sit',
            sets: 3,
            reps: '40 sec',
            description: 'Back flat against wall, thighs parallel',
          },
          {
            name: 'Glute Bridges',
            sets: 3,
            reps: '20',
            description: 'Drive through heels, squeeze at top',
          },
        ],
        isCompleted: false,
      },
      {
        day: 'Day 4',
        focus: 'Push-up & Core Advancement',
        description: 'Higher volume push-ups with challenging core exercises',
        exercises: [
          {
            name: 'Push-ups',
            sets: 4,
            reps: '7',
            description: 'Full push-ups with proper form',
          },
          {
            name: 'Plank Shoulder Taps',
            sets: 3,
            reps: '15',
            description: 'Maintain stable hips while tapping shoulders',
          },
          {
            name: 'Russian Twists',
            sets: 3,
            reps: '20/side',
            description: 'Rotate torso, keep feet elevated',
          },
        ],
        isCompleted: false,
      },
      {
        day: 'Day 5',
        focus: 'Challenging Circuit',
        description: 'Advanced circuit combining all movement patterns',
        exercises: [
          {
            name: 'Circuit (3 Rounds)',
            sets: 3,
            reps: 'Complete circuit',
            description:
              'Minimal rest between exercises, 1-2 min between rounds',
          },
          {
            name: 'Push-ups',
            sets: 1,
            reps: '8',
            description: 'Part of circuit',
          },
          {
            name: 'Jump Squats',
            sets: 1,
            reps: '10',
            description: 'Part of circuit',
          },
          {
            name: 'Plank',
            sets: 1,
            reps: '45 sec',
            description: 'Part of circuit',
          },
          {
            name: 'Leg Raises',
            sets: 1,
            reps: '10',
            description: 'Part of circuit',
          },
        ],
        isCompleted: false,
      },
    ],
  },
  {
    week: 'Week 4',
    title: 'Push-up Mastery Phase',
    description:
      'Testing push-up endurance with higher volume and challenging variations',
    days: [
      {
        day: 'Day 1',
        focus: 'Push-up Mastery',
        description: 'Higher volume with burnout sets for maximum development',
        exercises: [
          {
            name: 'Push-ups',
            sets: 4,
            reps: '8',
            description: 'Full push-ups with proper form',
          },
          {
            name: 'Knee Push-ups (burnout)',
            sets: 2,
            reps: '10',
            description: 'Immediately after regular push-ups',
          },
          {
            name: 'Wall Push-up Hold',
            sets: 3,
            reps: '40 sec',
            description: 'Arms extended against wall, isometric hold',
          },
        ],
        isCompleted: false,
      },
      {
        day: 'Day 2',
        focus: 'Peak Core Stability',
        description: 'Maximum core endurance development for push-up support',
        exercises: [
          {
            name: 'Plank',
            sets: 3,
            reps: '1 min',
            description: 'Keep body straight, engage core',
          },
          {
            name: 'Leg Raises',
            sets: 3,
            reps: '20',
            description: 'Keep legs straight, control the movement',
          },
          {
            name: 'Hollow Hold',
            sets: 3,
            reps: '30 sec',
            description: 'Low back pressed to floor, limbs extended',
          },
        ],
        isCompleted: false,
      },
      {
        day: 'Day 3',
        focus: 'Lower Body Power & Endurance',
        description: 'Building peak lower body strength with longer holds',
        exercises: [
          {
            name: 'Jump Squats',
            sets: 3,
            reps: '15',
            description: 'Explosive up, soft landing',
          },
          {
            name: 'Wall Sit',
            sets: 2,
            reps: '1 min',
            description: 'Back flat against wall, thighs parallel',
          },
          {
            name: 'Lunges',
            sets: 2,
            reps: '12/leg',
            description: 'Step forward, knee at 90 degrees',
          },
        ],
        isCompleted: false,
      },
      {
        day: 'Day 4',
        focus: 'Push-up & Stability Peak',
        description: 'High volume push-ups with advanced stability work',
        exercises: [
          {
            name: 'Push-ups',
            sets: 3,
            reps: '10',
            description: 'Full push-ups with proper form',
          },
          {
            name: 'Plank Shoulder Taps',
            sets: 3,
            reps: '20',
            description: 'Maintain stable hips while tapping shoulders',
          },
          {
            name: 'Superman Hold',
            sets: 2,
            reps: '30 sec',
            description: 'Lift arms and legs, hold position',
          },
        ],
        isCompleted: false,
      },
      {
        day: 'Day 5',
        focus: 'Push-up Test & Final Challenge',
        description:
          'Test maximum push-up capacity followed by a challenge circuit',
        exercises: [
          {
            name: 'Max Push-up Test',
            sets: 1,
            reps: 'As many as possible',
            description: 'Do as many push-ups as you can in one set',
          },
          {
            name: 'Challenge Circuit (2 Rounds)',
            sets: 2,
            reps: 'Complete circuit',
            description:
              'Rest 2-3 minutes after max test, then complete circuit',
          },
          {
            name: 'Push-ups',
            sets: 1,
            reps: '10',
            description: 'Part of circuit',
          },
          {
            name: 'Squats',
            sets: 1,
            reps: '15',
            description: 'Part of circuit',
          },
          {
            name: 'Plank',
            sets: 1,
            reps: '1 min',
            description: 'Part of circuit',
          },
          {
            name: 'Russian Twists',
            sets: 1,
            reps: '15/side',
            description: 'Part of circuit',
          },
        ],
        isCompleted: false,
      },
    ],
  },
];

export default App;

import React, { useState } from "react";

const splitsData = [
  {
    id: 1,
    title: "Push Pull Legs (PPL)",
    description:
      "Highly popular split focusing on movement patterns and recovery.",
    days: [
      { day: "Day 1", muscles: "Chest, Shoulders, Triceps" },
      { day: "Day 2", muscles: "Back, Biceps" },
      { day: "Day 3", muscles: "Legs & Core" },
      { day: "Day 4", muscles: "Rest / Repeat" }
    ]
  },
  {
    id: 2,
    title: "Bro Split",
    description:
      "Classic bodybuilding split with one muscle group per day.",
    days: [
      { day: "Day 1", muscles: "Chest" },
      { day: "Day 2", muscles: "Back" },
      { day: "Day 3", muscles: "Shoulders" },
      { day: "Day 4", muscles: "Arms" },
      { day: "Day 5", muscles: "Legs" }
    ]
  },
  {
    id: 3,
    title: "Upper Lower Split",
    description:
      "Balanced split ideal for strength and hypertrophy.",
    days: [
      { day: "Day 1", muscles: "Upper Body" },
      { day: "Day 2", muscles: "Lower Body" },
      { day: "Day 3", muscles: "Rest" },
      { day: "Day 4", muscles: "Upper Body" },
      { day: "Day 5", muscles: "Lower Body" }
    ]
  },
  {
    id: 4,
    title: "Full Body Split",
    description:
      "Beginner-friendly program training the entire body each session.",
    days: [
      { day: "Day 1", muscles: "Full Body" },
      { day: "Day 3", muscles: "Full Body" },
      { day: "Day 5", muscles: "Full Body" }
    ]
  },
  {
    id: 5,
    title: "Arnold Split",
    description:
      "High-volume split popularized by Arnold Schwarzenegger.",
    days: [
      { day: "Day 1", muscles: "Chest & Back" },
      { day: "Day 2", muscles: "Shoulders & Arms" },
      { day: "Day 3", muscles: "Legs" },
      { day: "Day 4", muscles: "Chest & Back" },
      { day: "Day 5", muscles: "Shoulders & Arms" }
    ]
  },
  {
    id: 6,
    title: "PHUL Split",
    description:
      "Power Hypertrophy Upper Lower split combining strength and size.",
    days: [
      { day: "Day 1", muscles: "Upper Power" },
      { day: "Day 2", muscles: "Lower Power" },
      { day: "Day 3", muscles: "Rest" },
      { day: "Day 4", muscles: "Upper Hypertrophy" },
      { day: "Day 5", muscles: "Lower Hypertrophy" }
    ]
  },
  {
    id: 7,
    title: "PHAT Split",
    description:
      "Advanced split blending powerlifting and bodybuilding.",
    days: [
      { day: "Day 1", muscles: "Upper Power" },
      { day: "Day 2", muscles: "Lower Power" },
      { day: "Day 3", muscles: "Back & Shoulders Hypertrophy" },
      { day: "Day 4", muscles: "Chest & Arms Hypertrophy" },
      { day: "Day 5", muscles: "Legs Hypertrophy" }
    ]
  },
  {
    id: 8,
    title: "3-Day Push Pull Legs",
    description:
      "Minimal yet effective split for busy schedules and consistency.",
    days: [
      { day: "Day 1", muscles: "Push Muscles" },
      { day: "Day 2", muscles: "Pull Muscles" },
      { day: "Day 3", muscles: "Legs" }
    ]
  },
  {
    id: 9,
    title: "Glutes & Legs Focus (Women)",
    description:
      "Lower-body focused split for toning and strength.",
    days: [
      { day: "Day 1", muscles: "Glutes & Hamstrings" },
      { day: "Day 2", muscles: "Upper Body" },
      { day: "Day 3", muscles: "Glutes & Quads" },
      { day: "Day 4", muscles: "Core & Conditioning" }
    ]
  },
  {
    id: 10,
    title: "Fat Loss / Cutting Split",
    description:
      "High-frequency training combined with cardio for fat loss.",
    days: [
      { day: "Day 1", muscles: "Upper Body + Cardio" },
      { day: "Day 2", muscles: "Lower Body + Cardio" },
      { day: "Day 3", muscles: "HIIT & Core" },
      { day: "Day 4", muscles: "Full Body" }
    ]
  }
];

const WorkoutSplit = () => {
  const [selectedSplit, setSelectedSplit] = useState(null);

  return (
    <>
      {/* GRID OF CARDS */}
    <h1 className="flex justify-center text-2xl">Workout Splits</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {splitsData.map((split) => (
          <div
            key={split.id}
            className="bg-white border rounded-xl shadow-sm p-5 flex flex-col"
          >
            <h3 className="text-lg font-semibold text-slate-800">
              {split.title}
            </h3>
            <p className="text-sm text-slate-600 mt-2 flex">
              {split.description}
            </p>

            <button
              onClick={() => setSelectedSplit(split)}
              className="mt-4 rounded-md bg-slate-900 py-2 text-white text-sm hover:bg-slate-700 transition cursor-pointer"
            >
              Read More
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedSplit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-xl w-full max-w-xl shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                {selectedSplit.title}
              </h2>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
              {selectedSplit.days.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between bg-slate-100 p-3 rounded-md text-sm"
                >
                  <span className="font-medium">{item.day}</span>
                  <span className="text-slate-700">{item.muscles}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t flex justify-center">
              <button
                onClick={() => setSelectedSplit(null)}
                className="bg-red-900 text-white px-4 py-2 rounded-md text-sm hover:bg-red-950"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkoutSplit;

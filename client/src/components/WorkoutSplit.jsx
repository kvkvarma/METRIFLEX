import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    id: 9,
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
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <button onClick={(e)=>navigate('/Dashboard')} className="absolute cursor-pointer top-4 right-4 px-4 py-2 bg-red-900 text-white rounded-lg text-sm hover:opacity-90 z-10">Exit</button>
      <div className="text-center pt-10 px-4">
        <h1 className="text-3xl font-bold text-slate-900">
          Workout Splits
        </h1>
        <p className="mt-2 text-slate-600 max-w-xl mx-auto">
          Choose a workout split that matches your goals, schedule, and training style
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {splitsData.map((split) => (
          <div
            key={split.id}
            className="group bg-white rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col"
          >
            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-black transition">
              {split.title}
            </h3>

            <p className="text-sm text-slate-600 mt-3 leading-relaxed flex-1">
              {split.description}
            </p>

            <button
              onClick={() => setSelectedSplit(split)}
              className="mt-6 rounded-xl bg-black py-2.5 text-white text-sm font-medium hover:bg-slate-800 transition"
            >
              View Split
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {selectedSplit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b">
              <h2 className="text-xl font-semibold text-slate-900">
                {selectedSplit.title}
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Weekly training breakdown
              </p>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
              {selectedSplit.days.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-slate-100 px-4 py-3 rounded-xl text-sm"
                >
                  <span className="font-medium text-slate-800">
                    {item.day}
                  </span>
                  <span className="text-slate-600 text-right">
                    {item.muscles}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setSelectedSplit(null)}
                className="rounded-xl bg-red-900 px-5 py-2 text-sm text-white hover:bg-red-950 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutSplit;


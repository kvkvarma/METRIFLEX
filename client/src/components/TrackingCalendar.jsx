"use client"

import React, { useState } from "react"
import { Calendar } from "@/components/ui/calendar"

export function CalendarDemo() {
  const [date, setDate] = useState(new Date())

  const today = new Date()

  // 🔥 Calculate allowed range
  const threeMonthsAgo = new Date(
    today.getFullYear(),
    today.getMonth() - 2,
    1
  )

  const currentMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  )

  const trackingData = {
    "2026-02-01": { calories: 2200, goal: 2000 },
    "2026-02-02": { calories: 1500, goal: 2000 },
    "2026-02-03": { calories: 800, goal: 2000 },
    "2026-02-05": { calories: 2000, goal: 2000 },
  }

  const formatDate = (date) => {
    return date.toISOString().split("T")[0]
  }

  const reachedDays = []
  const mediumDays = []
  const missedDays = []

  Object.entries(trackingData).forEach(([key, value]) => {
    const percentage = (value.calories / value.goal) * 100
    const day = new Date(key)

    if (percentage >= 100) reachedDays.push(day)
    else if (percentage >= 70) mediumDays.push(day)
    else missedDays.push(day)
  })

  return (
    <div className="p-4 w-full h-full">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        fromMonth={threeMonthsAgo}
        toMonth={currentMonth}
        defaultMonth={currentMonth}
        numberOfMonths={1}
        captionLayout="dropdown"

        className="rounded-lg border p-6 " 

        classNames={{
          months: "space-y-6",
          month: "space-y-6",
          caption: "flex justify-center pt-2 relative items-center text-lg font-semibold",
          table: "w-full h-full border-collapse space-y-2",
          head_row: "flex",
          head_cell: "text-muted-foreground rounded-md w-14 font-medium text-base"
        }}

        modifiers={{
          reached: reachedDays,
          medium: mediumDays,
          missed: missedDays,
        }}

        modifiersClassNames={{
          reached: "bg-green-400 text-white",
          medium: "bg-yellow-400 text-black",
          missed: "bg-red-500 text-white",
        }}

        components={{
          DayContent: (props) => {
            const formatted = formatDate(props.date)
            const entry = trackingData[formatted]

            return (
              <div
                title={
                  entry
                    ? `${entry.calories} / ${entry.goal} calories`
                    : "No Data"
                }
              >
                {props.date.getDate()}
              </div>
            )
          },
        }}
      />
    </div>
  )
}

export default CalendarDemo

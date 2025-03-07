"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useTimetableStore } from "@/store/timetable"

export default function CalendarPage() {
  const { classConfig } = useTimetableStore()

  return (
    <div className="py-14 px-2 sm:px-6 max-w-4xl mx-auto bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      <div className="mb-2 text-center print:mb-8">
        <p className="text-neutral-500 dark:text-neutral-400 print:text-lg text-xl font-semibold">
          {classConfig?.school || "학교"}
        </p>
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 print:text-4xl mb-4">
          학사일정
        </h1>
      </div>
      
      <div className="overflow-x-auto rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
        <div className="min-w-full bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 p-4">
          <div className="h-[600px] flex items-center justify-center">
            <h2 className="text-4xl font-bold text-neutral-500 dark:text-neutral-400">Under Construction</h2>
          </div>
        </div>
      </div>
    </div>
  )
} 
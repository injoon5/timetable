'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimetableHeaderProps {
  schoolYear: number
  school: string
  grade: string
  class: string
  isNextWeek: boolean
  isWeekChangeLoading: boolean
  onWeekChange: (isNext: boolean) => void
}

export function TimetableHeader({
  schoolYear,
  school,
  grade,
  class: classNumber,
  isNextWeek,
  isWeekChangeLoading,
  onWeekChange,
}: TimetableHeaderProps) {
  return (
    <div className="mb-2 text-center print:mb-8">
      <p className="text-neutral-500 dark:text-neutral-400 print:text-lg text-xl font-semibold">
        {schoolYear}학년도 {school}
      </p>
      <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 print:text-4xl mb-4">
        {grade}학년 {classNumber}반 시간표
      </h1>
      <div className="flex justify-end gap-2 print:hidden">
        <Button
          variant="outline"
          onClick={() => onWeekChange(false)}
          disabled={!isNextWeek || isWeekChangeLoading}
          className={cn(
            "border-neutral-200 dark:border-neutral-700 rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-900",
            "px-3",
            isWeekChangeLoading && "opacity-50 cursor-not-allowed"
          )}
        >
          <ChevronLeft className={cn(
            "w-4 h-4",
            "text-neutral-700 dark:text-neutral-300",
            (isWeekChangeLoading || !isNextWeek) && "dark:text-neutral-600"
          )} />
        </Button>
        <Button
          variant="outline"
          onClick={() => onWeekChange(true)}
          disabled={isNextWeek || isWeekChangeLoading}
          className={cn(
            "border-neutral-200 dark:border-neutral-700 rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-900",
            "px-3",
            isWeekChangeLoading && "opacity-50 cursor-not-allowed"
          )}
        >
          <ChevronRight className={cn(
            "w-4 h-4",
            "text-neutral-700 dark:text-neutral-300",
            (isWeekChangeLoading || isNextWeek) && "dark:text-neutral-600"
          )} />
        </Button>
      </div>
    </div>
  )
} 
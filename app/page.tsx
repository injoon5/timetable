'use client'

import "./print.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TimetableHeader } from "@/components/timetable/timetable-header"
import { TimetableGrid } from "@/components/timetable/timetable-grid"
import { AboutHoverCard } from "@/components/about-hover-card"
import { ConfigDialog } from "@/components/config-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useTimetableStore } from "@/store/timetable"
import { useEffect } from "react"

function getCurrentSchoolYear() {
  const today = new Date();
  let schoolYear = today.getFullYear();
  if (today.getMonth() < 2) {
    schoolYear--;
  }
  return schoolYear;
}

function generatePeriods(timetableData: any, classConfig: any) {
  if (!timetableData?.day_time?.length || !timetableData?.timetable?.length) return []
  
  const days = ["월", "화", "수", "목", "금"]
  
  // First, create all regular periods
  const periods = timetableData.day_time.map((timeStr: string, idx: number) => {
    const period = timeStr.split('(')[0]
    const time = timeStr.split('(')[1]?.replace(')', '')
    
    return {
      id: period,
      time,
      subjects: days.map((_, dayIndex) => {
        const periodData = timetableData.timetable[dayIndex]?.[idx]
        return periodData?.subject || ""
      })
    }
  })

  // Then insert lunch at the correct position
  const lunchPeriod = {
    id: "점심",
    time: "12:20~13:20",
    subjects: Array(days.length).fill("점심")
  }

  // Insert lunch after the specified period
  if (typeof classConfig?.lunchAfter === 'number') {
    periods.splice(classConfig.lunchAfter, 0, lunchPeriod)
  }

  return periods
}

export default function Home() {
  const { 
    isNextWeek, 
    isWeekChangeLoading,
    changeWeek,
    showConfig,
    setShowConfig,
    classConfig,
    isLoading,
    error,
    timetableData,
    initializeStore,
    setTempConfig,
    saveConfig,
    saveTeacherInfo,
    getTeacherInfo
  } = useTimetableStore()

  useEffect(() => {
    initializeStore()
  }, [])

  useEffect(() => {
    if (classConfig) {
      document.title = `${classConfig.grade}학년 ${classConfig.class}반 시간표 - ${classConfig.school}`
    }
  }, [classConfig])

  const handleConfigSave = (newConfig: any) => {
    setTempConfig(newConfig)
    saveConfig()
    setShowConfig(false)
  }

  if (!classConfig) {
    return (
      <div className="py-6 px-2 sm:px-6 max-w-4xl mx-auto">
        <Skeleton className="h-[600px] rounded-xl" />
      </div>
    )
  }

  const periods = generatePeriods(timetableData, classConfig)

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className="min-h-screen bg-linear-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 py-8 print:bg-white print:py-4">
        <div className="py-6 px-2 sm:px-6 max-w-4xl mx-auto print:max-w-none">
          <TimetableHeader
            schoolYear={getCurrentSchoolYear()}
            school={classConfig.school}
            grade={classConfig.grade}
            class={classConfig.class}
            isNextWeek={isNextWeek}
            isWeekChangeLoading={isWeekChangeLoading}
            onWeekChange={changeWeek}
          />

          {error ? (
            <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
              <pre className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 overflow-auto">
                {error}
              </pre>
            </div>
          ) : (isLoading || isWeekChangeLoading) ? (
            <div className="overflow-x-auto shadow-lg rounded-xl border border-neutral-200 dark:border-neutral-800">
              <div className="min-w-full bg-white dark:bg-neutral-900">
                <Skeleton className="h-[600px]" />
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 print:shadow-none print:border print:rounded-none">
              <TimetableGrid
                periods={periods}
                timetableData={timetableData}
                onTeacherInfoSave={saveTeacherInfo}
                getTeacherInfo={getTeacherInfo}
              />
            </div>
          )}
          
          <div className="mt-6 print:hidden">
            <div className="flex justify-between items-center mb-4">
              {timetableData?.update_date && !error && (
                <p className="ml-1 text-sm text-neutral-500 dark:text-neutral-400">
                  업데이트: {timetableData.update_date.slice(1, -1)}
                </p>
              )}
            </div>
            <div className="flex justify-center gap-2">
              <AboutHoverCard />
            </div>
          </div>

          <ConfigDialog
            open={showConfig}
            onOpenChange={setShowConfig}
            classConfig={classConfig}
            onConfigChange={setTempConfig}
            onSave={handleConfigSave}
          />
        </div>
      </main>
    </ThemeProvider>
  )
}

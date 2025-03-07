"use client"

import { useState, useEffect } from "react"
import { Clock, Settings, ChevronLeft, ChevronRight } from "lucide-react"
import { TeacherInfoPopup } from "./teacher-info-popup"
import { getCookie, setCookie } from 'cookies-next'
import { ConfigDialog } from "./config-dialog"
import { AboutHoverCard } from "./about-hover-card"
import { Skeleton } from "./ui/skeleton"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import config from '@/config.json'
import { useTimetableStore } from "@/store/timetable"

// Constants
const DAYS = ["월", "화", "수", "목", "금"]
const API_URL = config.isDev ? config.development.apiUrl : config.production.apiUrl
const DEBUG = config.isDev ? config.development.debug : config.production.debug

const log = (...args: any[]) => {
  if (DEBUG) {
    console.log(...args)
  }
}

const COLORS = [
  'bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900/70',
  'bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/50 dark:hover:bg-orange-900/70',
  'bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/50 dark:hover:bg-yellow-900/70', 
  'bg-green-100 hover:bg-green-200 dark:bg-green-900/50 dark:hover:bg-green-900/70',
  'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-900/70'
]

const DEFAULT_SCHOOL_CODE = "7081492"

function getSubjectColor(subject: string) {
  // Generate a consistent index based on the subject name
  // let total = 0;
  // for (let i = 0; i < subject.length; i++) {
  //   total += subject.charCodeAt(i);
  // }

  // why sum?
  return COLORS[
    subject.charCodeAt(0) % (COLORS.length) // previously colorIndex
  ];
}

interface ClassConfig {
  school: string
  schoolCode: string
  grade: string
  class: string
  lunchAfter: number
}

interface TimetableData {
  day_time: string[]
  timetable: Array<Array<{
    period: number
    subject: string
    teacher: string
    replaced: boolean
    original: {
      period: number
      subject: string
      teacher: string
    } | null
  }>>
  update_date: string
}

export default function Timetable() {
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

  // Single effect for initial setup
  useEffect(() => {
    initializeStore()
  }, [])

  // Update title when config changes
  useEffect(() => {
    if (classConfig) {
      document.title = `${classConfig.grade}학년 ${classConfig.class}반 시간표 - ${classConfig.school}`
    }
  }, [classConfig])

  const handleConfigSave = (newConfig: ClassConfig) => {
    log('Saving new config:', newConfig)
    setTempConfig(newConfig)
    saveConfig()
    setShowConfig(false)
  }

  const handleTeacherInfoSave = (subject: string, info: string) => {
    log('Saving teacher info:', { subject, info })
    saveTeacherInfo(subject, info)
  }

  const generatePeriods = () => {
    if (!timetableData?.day_time?.length || !timetableData?.timetable?.length) return []
    
    // First, create all regular periods
    const periods = timetableData.day_time.map((timeStr: string, idx: number) => {
      const period = timeStr.split('(')[0]
      const time = timeStr.split('(')[1]?.replace(')', '')
      
      return {
        id: period,
        time,
        subjects: DAYS.map((_, dayIndex) => {
          const periodData = timetableData.timetable[dayIndex]?.[idx]
          return periodData?.subject || ""
        })
      }
    })

    // Then insert lunch at the correct position
    const lunchPeriod = {
      id: "점심",
      time: "12:20~13:20",
      subjects: Array(DAYS.length).fill("점심")
    }

    // Insert lunch after the specified period
    if (typeof classConfig?.lunchAfter === 'number') {
      periods.splice(classConfig.lunchAfter, 0, lunchPeriod)
    }

    return periods
  }

  const renderSubjectCell = (subject: string, index: number, periodIdx: number) => {
    const info = getTeacherInfo(subject)
    const isEmpty = subject === ""
    const periodData = timetableData?.timetable[index]?.[periodIdx]
    const isReplaced = periodData?.replaced
    const originalSubject = periodData?.original?.subject

    if (isEmpty) {
      return (
        <span className="h-14 xs:h-18 sm:h-23 font-medium text-neutral-800 dark:text-neutral-200 text-center print:text-base print:font-semibold">
          {subject}
        </span>
      )
    }

    return (
      <TeacherInfoPopup
        subject={subject}
        onSave={(info) => handleTeacherInfoSave(subject, info)}
        initialInfo={info}
      >
        <div className="w-full h-14 xs:h-18 sm:h-23 flex flex-col items-center justify-center overflow-hidden">
          <span className={cn(
            "font-semibold text-sm xs:text-base sm:text-lg text-center print:text-lg print:font-semibold xs:line-clamp-1 print:text-black",
            isReplaced 
              ? "text-red-600 dark:text-red-400" 
              : "text-neutral-800 dark:text-neutral-200"
          )}>
            {subject}
          </span>
    
          {isReplaced && originalSubject && (
            <span className="text-xs text-red-500 dark:text-red-400 -mt-1 line-clamp-1">
              ({originalSubject} 대체)
            </span>
          )}

          {info && (
            <span className="text-xs xs:text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-medium print:text-base print:mt-0 line-clamp-1">
              {info}
            </span>
          )}
        </div>
      </TeacherInfoPopup>
    );
  }

  const periods = generatePeriods()

  // Update the render to handle null classConfig
  if (!classConfig) {
    return (
      <div className="py-6 px-2 sm:px-6 max-w-4xl mx-auto">
        <Skeleton className="h-[600px] rounded-xl" />
      </div>
    )
  }

  function getCurrentSchoolYear() {
    // calculates school year. year-- if month is jan or feb
    const today = new Date();
    let schoolYear = today.getFullYear();
    if (today.getMonth() < 2) {
      schoolYear--;
    }
    return schoolYear;
  }

  return (
    <div className="py-6 px-2 sm:px-6 max-w-4xl mx-auto print:max-w-none">
      <div className="mb-2 text-center print:mb-8">
        <p className="text-neutral-500 dark:text-neutral-400 print:text-lg text-xl font-semibold">
          {getCurrentSchoolYear()}학년도 {classConfig.school}
        </p>
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 print:text-4xl mb-4">
          {classConfig.grade}학년 {classConfig.class}반 시간표
        </h1>
        <div className="flex justify-end gap-2 print:hidden">
          <Button
            variant="outline"
            onClick={() => changeWeek(false)}
            disabled={!isNextWeek || isWeekChangeLoading}
            className={cn(
              "border-neutral-200 dark:border-neutral-700 rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-900",
              "px-3"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline" 
            onClick={() => changeWeek(true)}
            disabled={isNextWeek || isWeekChangeLoading}
            className={cn(
              "border-neutral-200 dark:border-neutral-700 rounded-xl bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-900",
              "px-3"
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

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
          <div className="min-w-full bg-white dark:bg-neutral-900">
            {/* Header */}
            <div className="grid grid-cols-6 bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
              <div className="py-3 px-2 font-medium text-neutral-500 dark:text-neutral-400 flex flex-col items-center justify-center border-r border-neutral-200 dark:border-neutral-700 print:py-3">
                <Clock className="w-4 h-4 print:w-5 print:h-5" />
              </div>
              {DAYS.map((day, index) => (
                <div
                  key={day}
                  className={`text-sm sm:text-base py-2 px-4 font-medium text-center text-neutral-700 dark:text-neutral-300 ${
                    index < DAYS.length - 1 ? "border-r border-neutral-200 dark:border-neutral-700" : ""
                  } print:text-base print:font-semibold print:py-3`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Body */}
            <div className="divide-neutral-200 dark:divide-neutral-700">
              {periods.map((period) => (
                <div key={period.id} className="grid grid-cols-6">
                  <div className="py-3 sm:py-5 bg-neutral-50 dark:bg-neutral-800 flex flex-col justify-center items-center border-t border-r border-neutral-200 dark:border-neutral-700 print:py-4">
                    <span className="text-sm sm:text-base font-medium text-neutral-700 dark:text-neutral-300 print:text-base print:font-semibold">
                      {period.id === "점심" ? "점심" : `${period.id}교시`}
                    </span>
                    {period.id !== "점심" ? (<span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 print:text-sm">({period.time})</span>) : ''}
                  </div>
                  
                  {period.id !== "점심" ? (
                    period.subjects.map((subject, index) => {
                      const periodIdx = parseInt(period.id) - 1
                      return (
                        <div
                          key={index}
                          className={cn(
                            "py-1 px-2 flex flex-col items-center justify-center transition-all duration-200 border-t border-neutral-200 dark:border-neutral-700",
                            index < 4 ? 'border-r' : '',
                            subject ? getSubjectColor(subject) : "bg-neutral-50 dark:bg-neutral-800",
                            subject ? "cursor-pointer" : "",
                            "print:hover:bg-white print:py-4"
                          )}
                        >
                          {renderSubjectCell(subject, index, periodIdx)}
                        </div>
                      )
                    })
                  ) : (
                    <div className="col-span-5 bg-neutral-100 dark:bg-neutral-800 print:py-4 flex items-center justify-center border-t border-neutral-200 dark:border-neutral-700">
                      <span className="font-medium text-neutral-700 dark:text-neutral-300 print:text-base print:font-semibold">점심시간</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
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
          <button
            onClick={() => setShowConfig(true)}
            className="p-2 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
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
  )
}

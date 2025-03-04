"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { TeacherInfoPopup } from "./teacher-info-popup"

export default function Timetable() {
  const [teacherInfo, setTeacherInfo] = useState<Record<string, string>>({})

  useEffect(() => {
    const storedInfo = localStorage.getItem("teacherInfo")
    if (storedInfo) {
      setTeacherInfo(JSON.parse(storedInfo))
    }
  }, [])

  const saveTeacherInfo = (subject: string, info: string) => {
    const newInfo = { ...teacherInfo, [subject]: info }
    setTeacherInfo(newInfo)
    localStorage.setItem("teacherInfo", JSON.stringify(newInfo))
  }

  // Subject color mapping for visual distinction
  const subjectColors: Record<string, string> = {
    한문: "bg-blue-100 hover:bg-blue-200 border-blue-300",
    영어: "bg-green-100 hover:bg-green-200 border-green-300",
    수학: "bg-purple-100 hover:bg-purple-200 border-purple-300",
    체육: "bg-orange-100 hover:bg-orange-200 border-orange-300",
    과2: "bg-pink-100 hover:bg-pink-200 border-pink-300",
    과1: "bg-pink-100 hover:bg-pink-200 border-pink-300",
    음악: "bg-yellow-100 hover:bg-yellow-200 border-yellow-300",
    독서: "bg-indigo-100 hover:bg-indigo-200 border-indigo-300",
    중국어: "bg-red-100 hover:bg-red-200 border-red-300",
    스포츠: "bg-teal-100 hover:bg-teal-200 border-teal-300",
    역사: "bg-amber-100 hover:bg-amber-200 border-amber-300",
    창체: "bg-cyan-100 hover:bg-cyan-200 border-cyan-300",
    사회: "bg-lime-100 hover:bg-lime-200 border-lime-300",
    국어: "bg-violet-100 hover:bg-violet-200 border-violet-300",
    미술: "bg-rose-100 hover:bg-rose-200 border-rose-300",
  }

  // Timetable data
  const days = ["월", "화", "수", "목", "금"]
  const periods = [
    { id: 1, time: "08:50", subjects: ["한문", "영어", "수학", "체육", "과2"] },
    { id: 2, time: "09:45", subjects: ["체육", "음악", "영어", "독서", "음악"] },
    { id: 3, time: "10:40", subjects: ["과2", "중국어", "스포츠", "중국어", "영어"] },
    { id: 4, time: "11:35", subjects: ["역사", "창체", "사회", "영어", "체육"] },
    { id: "점심", time: "12:20", subjects: ["점심시간"] },
    { id: 5, time: "13:20", subjects: ["국어", "수학", "미술", "역사", "수학"] },
    { id: 6, time: "14:15", subjects: ["수학", "사회", "미술", "과1", "국어"] },
    { id: 7, time: "15:10", subjects: ["", "과1", "국어", "", ""] },
  ]

  return (
    <div className="py-6 px-2 sm:px-6 max-w-4xl mx-auto print:max-w-none">
      <div className="mb-6 text-center print:mb-8">
        <p className="text-gray-500 print:text-lg text-xl font-semibold">2025학년도</p>
        <h1 className="text-3xl font-bold text-gray-800 print:text-4xl">3학년 4반 시간표</h1>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 print:shadow-none print:border print:rounded-none">
        <div className="min-w-full bg-white">
          {/* Header */}
          <div className="grid grid-cols-6 bg-gray-50 border-b border-gray-200">
            <div className="py-3 px-2 font-medium text-gray-500 flex items-center justify-center border-r border-gray-200 print:py-3">
              <Clock className="w-4 h-4 mr-2 print:w-5 print:h-5" />
              <span className="print:text-base print:font-semibold">교시</span>
            </div>
            {days.map((day, index) => (
              <div
                key={day}
                className={`py-3 px-4 font-medium text-center text-gray-700 ${
                  index < days.length - 1 ? "border-r border-gray-200" : ""
                } print:text-base print:font-semibold print:py-3`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="divide-y divide-gray-200">
            {periods.map((period) => (
              <div key={period.id} className="grid grid-cols-6">
                {period.id !== "점심" ? (
                    <div className="py-3 sm:py-5 bg-gray-50 flex flex-col justify-center items-center border-r border-gray-200 print:py-4">
                    <span className="font-medium text-gray-700 print:text-base print:font-semibold">{period.id}교시</span>
                    <span className="text-xs text-gray-500 mt-1 print:text-sm">({period.time})</span>
                  </div>
                ) : (
                  <div className="py-3 sm:py-5 bg-gray-50 flex flex-col justify-center items-center border-r border-gray-200 print:py-4">
                    <span className="font-medium text-gray-700 print:text-base print:font-semibold">점심시간</span>
                    <span className="text-xs text-gray-500 mt-1 print:text-sm">({period.time})</span>
                  </div>
                )} 
                
                {period.id !== "점심" ? (
                  period.subjects.map((subject, index) => {
                    const info = teacherInfo[subject]
                    const isEmpty = subject === ""
                    return (
                      <div
                        key={index}
                        className={`py-3 px-2 flex flex-col items-center justify-center transition-all duration-200 
                          ${!isEmpty ? subjectColors[subject] : "bg-gray-50"} 
                          ${index < days.length - 1 ? "border-r border-gray-200" : ""} 
                          ${!isEmpty ? "cursor-pointer" : ""} 
                          print:hover:bg-white print:py-4`}
                      >
                        {!isEmpty ? (
                          <TeacherInfoPopup
                            subject={subject}
                            onSave={(info) => saveTeacherInfo(subject, info)}
                            initialInfo={info}
                          >
                            <div className="w-full h-full flex flex-col items-center justify-center">
                              <span className="font-medium text-gray-800 text-center print:text-base print:font-semibold">
                                {subject}
                              </span>
                              {info && (
                                <span className="text-xs text-secondary-foreground mt-1 print:text-sm">{info}</span>
                              )}
                            </div>
                          </TeacherInfoPopup>
                        ) : (
                          <span className="font-medium text-gray-800 text-center print:text-base print:font-semibold">
                            {subject}
                          </span>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <div className="col-span-5 bg-gray-100 print:py-4 flex items-center justify-center">
                    <span className="font-medium text-gray-700 print:text-base print:font-semibold">점심시간</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


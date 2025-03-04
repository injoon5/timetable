import { Clock } from "lucide-react"

export default function Timetable() {
  // Subject color mapping for visual distinction
  const subjectColors: Record<string, string> = {
    한문: "bg-blue-100 border-blue-300",
    영어: "bg-green-100 border-green-300",
    수학: "bg-purple-100 border-purple-300",
    체육: "bg-orange-100 border-orange-300",
    과2: "bg-pink-100 border-pink-300",
    과1: "bg-pink-100 border-pink-300",
    음악: "bg-yellow-100 border-yellow-300",
    독서: "bg-indigo-100 border-indigo-300",
    중국어: "bg-red-100 border-red-300",
    스포츠: "bg-teal-100 border-teal-300",
    역사: "bg-amber-100 border-amber-300",
    창체: "bg-cyan-100 border-cyan-300",
    사회: "bg-lime-100 border-lime-300",
    국어: "bg-violet-100 border-violet-300",
    미술: "bg-rose-100 border-rose-300",
    점심시간: "bg-gray-100 border-gray-300",
  }

  // Timetable data
  const days = ["월", "화", "수", "목", "금"]

  // First 4 periods
  const morningPeriods = [
    { id: 1, time: "08:50", subjects: ["한문", "영어", "수학", "체육", "과2"] },
    { id: 2, time: "09:55", subjects: ["체육", "음악", "영어", "독서", "음악"] },
    { id: 3, time: "10:40", subjects: ["과2", "중국어", "스포츠", "중국어", "영어"] },
    { id: 4, time: "11:35", subjects: ["역사", "창체", "사회", "영어", "체육"] },
  ]

  // Lunch time
  const lunchTime = {
    id: "점심",
    time: "12:25",
    subjects: ["", "", "", "", ""],
  }

  // Afternoon periods
  const afternoonPeriods = [
    { id: 5, time: "13:20", subjects: ["국어", "수학", "미술", "역사", "수학"] },
    { id: 6, time: "14:15", subjects: ["수학", "사회", "미술", "과1", "국어"] },
    { id: 7, time: "15:10", subjects: ["", "과1", "국어", "", ""] },
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">3학년 4반 시간표</h1>
        <p className="text-gray-500 mt-2">Class 4, Grade 3 Timetable</p>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        <div className="min-w-full bg-white">
          {/* Header */}
          <div className="grid grid-cols-6 bg-gray-50 border-b border-gray-200">
            <div className="py-5 px-8 font-medium text-gray-500 flex items-center justify-center border-r border-gray-200">
              <Clock className="w-4 h-4 mr-2" />
              <span>교시</span>
            </div>
            {days.map((day, index) => (
              <div
                key={day}
                className={`py-5 px-8 font-medium text-center text-gray-700 ${index < days.length - 1 ? "border-r border-gray-200" : ""}`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Morning Periods */}
          <div className="divide-y divide-gray-200">
            {morningPeriods.map((period) => (
              <div key={period.id} className="grid grid-cols-6">
                <div className="py-5 px-8 bg-gray-50 flex flex-col justify-center items-center border-r border-gray-200">
                  <span className="font-medium text-gray-700">{period.id}교시</span>
                  <span className="text-xs text-gray-500 mt-1">({period.time})</span>
                </div>
                {period.subjects.map((subject, index) => (
                  <div
                    key={index}
                    className={`py-5 px-8 flex items-center justify-center transition-all duration-200 
                      ${subject ? subjectColors[subject] : "bg-gray-50"} 
                      ${index < days.length - 1 ? "border-r border-gray-200" : ""} hover:shadow-inner`}
                  >
                    <span className="font-medium text-gray-800 text-center">{subject}</span>
                  </div>
                ))}
              </div>
            ))}

            {/* Lunch Time */}
            <div className="grid grid-cols-6">
              <div className="py-5 px-8 bg-gray-50 flex flex-col justify-center items-center border-r border-gray-200">
                <span className="font-medium text-gray-700">{lunchTime.id}</span>
                <span className="text-xs text-gray-500 mt-1">({lunchTime.time})</span>
              </div>
              {lunchTime.subjects.map((subject, index) => (
                <div
                  key={index}
                  className={`py-5 px-8 flex items-center justify-center transition-all duration-200 
                    bg-gray-100 
                    ${index < days.length - 1 ? "border-r border-gray-200" : ""} hover:shadow-inner`}
                >
                  <span className="font-medium text-gray-800 text-center">{subject}</span>
                </div>
              ))}
            </div>

            {/* Afternoon Periods */}
            {afternoonPeriods.map((period) => (
              <div key={period.id} className="grid grid-cols-6">
                <div className="py-5 px-8 bg-gray-50 flex flex-col justify-center items-center border-r border-gray-200">
                  <span className="font-medium text-gray-700">{period.id}교시</span>
                  <span className="text-xs text-gray-500 mt-1">({period.time})</span>
                </div>
                {period.subjects.map((subject, index) => (
                  <div
                    key={index}
                    className={`py-5 px-8 flex items-center justify-center transition-all duration-200 
                      ${subject ? subjectColors[subject] : "bg-gray-50"} 
                      ${index < days.length - 1 ? "border-r border-gray-200" : ""} hover:shadow-inner`}
                  >
                    <span className="font-medium text-gray-800 text-center">{subject}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>오인준</p>
      </div>
    </div>
  )
}


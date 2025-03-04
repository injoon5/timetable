import dynamic from "next/dynamic"
import "./print.css"

const Timetable = dynamic(() => import("@/components/timetable"), { ssr: false })

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 print:bg-white print:py-4">
      <Timetable />
    </main>
  )
}


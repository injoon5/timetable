import dynamic from "next/dynamic"
import "./print.css"
import { ThemeProvider } from "@/components/theme-provider"

const Timetable = dynamic(() => import("@/components/timetable"), { ssr: false })

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <main className="min-h-screen bg-linear-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 py-8 print:bg-white print:py-4">
        <Timetable />
      </main>
    </ThemeProvider>
  )
}

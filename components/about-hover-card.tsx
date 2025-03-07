"use client"

import { useState } from "react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"
import { Info } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function AboutHoverCard() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <HoverCard 
      openDelay={100} 
      closeDelay={200}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <HoverCardTrigger asChild>
        <button 
          className="p-2 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Info className="w-5 h-5" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent 
        className={cn(
          "w-80 dark:bg-neutral-900 dark:border-neutral-800",
          "data-[state=open]:animate-slideUpAndFade data-[state=open]:duration-300",
          "data-[state=closed]:animate-fadeOut data-[state=closed]:duration-200"
        )}
        sideOffset={8}
      >
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <h4 className="font-semibold dark:text-neutral-100">안내</h4>
          <div className="text-sm dark:text-neutral-400 space-y-2 break-all">
            <p>• 각 과목을 클릭하여 선생님을 입력할 수 있습니다.</p>
            <p>• 설정 버튼을 눌러 학교와 반을 변경할 수 있습니다.</p>
            <p>• 정보는 NEIS API에서 불러오고 있습니다. </p>
            <p>• 입력한 정보는 브라우저에 자동으로 저장됩니다.</p>
          </div>
          <div className="pt-2 border-t dark:border-neutral-800">
            <p className="text-sm dark:text-neutral-400">
              Made by{" "}
              <Link 
                href="https://github.com/injoon5" 
                target="_blank"
                className="font-medium text-neutral-900 dark:text-neutral-100 hover:underline transition-colors duration-200"
              >
                @injoon5
              </Link>
              {" • "}
              <Link 
                href="https://injoon5.com" 
                target="_blank"
                className="font-medium text-neutral-900 dark:text-neutral-100 hover:underline transition-colors duration-200"
              >
                Website
              </Link>
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

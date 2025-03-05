"use client"

import type React from "react"

import { useState, useEffect, type KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface TeacherInfoPopupProps {
  subject: string
  onSave: (info: string) => void
  initialInfo?: string
  children: React.ReactNode
}

export function TeacherInfoPopup({ subject, onSave, initialInfo = "", children }: TeacherInfoPopupProps) {
  const [teacherInfo, setTeacherInfo] = useState(initialInfo)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setTeacherInfo(initialInfo)
  }, [initialInfo])

  const handleSave = () => {
    onSave(teacherInfo)
    setIsOpen(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave()
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent 
        className={cn(
          "w-80 dark:bg-neutral-900 dark:border-neutral-800",
          "data-[state=open]:animate-slideUpAndFade data-[state=open]:duration-300",
          "data-[state=closed]:animate-fadeOut data-[state=closed]:duration-200"
        )}
        sideOffset={5}
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none dark:text-neutral-100">{subject} 선생님 정보</h4>
            <p className="text-sm text-muted-foreground dark:text-neutral-400">
              {subject} 담당 선생님 정보를 입력하세요. 브라우저 쿠키에 정보가 저장됩니다.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="teacher" className="dark:text-neutral-200">선생님 이름</Label>
            <Input
              id="teacher"
              value={teacherInfo}
              onChange={(e) => setTeacherInfo(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 dark:placeholder-neutral-400"
            />
          </div>
          <Button onClick={handleSave}>저장</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

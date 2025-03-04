"use client"

import type React from "react"

import { useState, useEffect, type KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{subject} 교사 정보</h4>
            <p className="text-sm text-muted-foreground">{subject} 담당 교사 정보를 입력하세요.</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="teacher">교사 이름</Label>
            <Input
              id="teacher"
              value={teacherInfo}
              onChange={(e) => setTeacherInfo(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-8"
            />
          </div>
          <Button onClick={handleSave}>저장</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}


"use client"

import { useState } from "react"
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle } from "./ui/drawer"
import { Info } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "react-responsive"
import {Dialog, DialogContent, DialogTitle, DialogTrigger, DialogHeader} from "@/components/ui/dialog";

export function AboutHoverCard() {
  const [isOpen, setIsOpen] = useState(false)
  const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" })

  const AboutContent = () => (
    <>
      <div className="text-sm dark:text-neutral-400 space-y-2 break-all mb-2">
        <p>• 각 과목을 클릭하여 선생님을 입력할 수 있습니다.</p>
        <p>• 설정 버튼을 눌러 학교와 반을 변경할 수 있습니다.</p>
        <p>• 정보는 NEIS API에서 불러오고 있습니다.</p>
        <p>• 선생님 성함 끝자가 빠져서 정보가 제공되므로 직접 수정해 주세요.</p>
        <p>• <kbd>Ctrl/Cmd + P</kbd>를 눌러 인쇄하면 적절한 디자인으로 출력할 수 있습니다. (크기 조절 필요)</p>
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
    </>
  )

  if (isSmallScreen) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <button 
            className="p-2 rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            <Info className="w-5 h-5" />
          </button>
        </DrawerTrigger>
        <DrawerContent className="h-[50%]">
          <DrawerHeader>
            <DrawerTitle>안내</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <AboutContent />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
      <Dialog
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <DialogTrigger asChild>
          <button
                className="p-2 rounded-lg flex flex-row items-center gap-2 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
          >
            <Info className="w-5 h-5" /> 안내
          </button>
        </DialogTrigger>
        <DialogContent
          className={cn(
          "w-96 dark:bg-neutral-900/90 dark:border-neutral-800",
              "rounded-lg max-w-lg p-6 backdrop-blur-sm"
          )}
        >
          <DialogHeader>
            <DialogTitle className="dark:text-neutral-100">안내</DialogTitle>
          </DialogHeader>
          <AboutContent />
        </DialogContent>
      </Dialog>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Calendar, Utensils, Clock, Settings } from "lucide-react"
import { Button } from "./ui/button"
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle } from "./ui/drawer"
import { cn } from "@/lib/utils"
import { ConfigDialog } from "./config-dialog"
import { useTimetableStore } from "@/store/timetable"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

const links = [
  { href: "/", label: "시간표", icon: Clock },
  { href: "/lunch", label: "급식", icon: Utensils },
  { href: "/calendar", label: "학사일정", icon: Calendar },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { showConfig, setShowConfig, classConfig, setTempConfig, saveConfig } = useTimetableStore()

  const handleConfigSave = (newConfig: any) => {
    setTempConfig(newConfig)
    saveConfig()
  }

  return (
    <nav className="print:hidden bg-neutral-50  dark:bg-neutral-950">
      <div className="flex h-16 items-center px-2 sm:px-4 md:px-6 max-w-4xl mx-auto">
        <div className="sm:hidden">
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="sm:hidden hover:bg-neutral-100 dark:hover:bg-neutral-900">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[50%]">
              <VisuallyHidden asChild>
                <DrawerHeader>
                  <DrawerTitle>메뉴</DrawerTitle>
                </DrawerHeader>
              </VisuallyHidden>
              <div className="px-4 py-6">
                <nav className="flex flex-col gap-4">
                  {links.map((link) => {
                    const Icon = link.icon
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-2 text-lg font-medium",
                          "text-neutral-500 dark:text-neutral-400",
                          "hover:text-neutral-900 dark:hover:text-neutral-50",
                          pathname === link.href && "text-neutral-900 dark:text-neutral-50"
                        )}
                      >
                        <Icon className="h-6 w-6" />
                        {link.label}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        
        <div className="hidden sm:flex sm:gap-8 sm:items-center">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 text-base font-medium",
                  "text-neutral-500 dark:text-neutral-400",
                  "hover:text-neutral-900 dark:hover:text-neutral-50",
                  pathname === link.href && "text-neutral-900 dark:text-neutral-50"
                )}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto">
          <button
            onClick={() => setShowConfig(true)}
            className={cn(
              "flex items-center gap-2 text-base font-medium p-2 rounded-lg",
              "text-neutral-500 dark:text-neutral-400",
              "hover:bg-neutral-100 dark:hover:bg-neutral-900"
            )}
          >
            <Settings className="h-5 w-5" />
            <span className="hidden sm:inline">설정</span>
          </button>
        </div>
      </div>

      <ConfigDialog
        open={showConfig}
        onOpenChange={setShowConfig}
        classConfig={classConfig}
        onConfigChange={setTempConfig}
        onSave={handleConfigSave}
      />
    </nav>
  )
} 
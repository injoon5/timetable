"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useState, useEffect, useMemo } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import debounce from 'lodash/debounce'
import config from '@/config.json'

interface School {
  SCHUL_NM: string
  ATPT_OFCDC_SC_NM: string
  SCHUL_KND_SC_NM: string
  SD_SCHUL_CODE: string
}

interface ClassConfig {
  school: string
  schoolCode: string
  grade: string
  class: string
  lunchAfter: number
}

interface ConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classConfig: ClassConfig
  onConfigChange: (config: ClassConfig) => void
  onSave: (config: ClassConfig) => void
}

const API_URL = config.isDev ? config.development.apiUrl : config.production.apiUrl
const DEBUG = config.isDev ? config.development.debug : config.production.debug

const log = (...args: any[]) => {
  if (DEBUG) {
    console.log(...args)
  }
}

export function ConfigDialog({ open, onOpenChange, classConfig, onConfigChange, onSave }: ConfigDialogProps) {
  const [tempConfig, setTempConfig] = useState(classConfig)
  const [schools, setSchools] = useState<School[]>([])
  const [openCombobox, setOpenCombobox] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [availableClasses, setAvailableClasses] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Update debug logs to use the log function
  useEffect(() => {
    log('Schools updated:', schools)
    log('Open combobox:', openCombobox)
    log('Search value:', searchValue)
  }, [schools, openCombobox, searchValue])

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setTempConfig(classConfig)
      setSearchValue(classConfig.school) // Set initial search value to current school
      setError(null)
      if (classConfig.school) {
        searchSchools(classConfig.school) // Search for current school when dialog opens
      } else {
        setSchools([])
      }
    }
  }, [open, classConfig])

  // Update classes when school and grade change
  useEffect(() => {
    if (tempConfig.schoolCode && tempConfig.grade) {
      fetchClasses(tempConfig.schoolCode, tempConfig.grade)
    }
  }, [tempConfig.schoolCode, tempConfig.grade])

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (isSearching || !tempConfig.schoolCode) {
        setTempConfig(prev => ({
          ...prev,
          school: '',
          schoolCode: '',
          grade: '',
          class: ''
        }))
        setSearchValue('')
      }
      setIsSearching(false)
    }
    setOpenCombobox(open)
    onOpenChange(open)
  }

  const handleSearchValueChange = (value: string) => {
    log('Search value changing from:', searchValue, 'to:', value)
    setSearchValue(value)
    setIsSearching(true)
    setOpenCombobox(true)
    
    if (value.length < 2) {
      log('Search value too short, clearing results')
      setSchools([])
      setError(null)
      return
    }
    
    log('Initiating search for:', value)
    searchSchools(value)
  }

  const handleSchoolSelect = (schoolName: string) => {
    const school = schools.find(s => s.SCHUL_NM === schoolName)
    if (!school) return

    setTempConfig(prev => ({
      ...prev,
      school: schoolName,
      schoolCode: school.SD_SCHUL_CODE,
      grade: '',
      class: ''
    }))
    setSearchValue(schoolName)
    setIsSearching(false)
    setOpenCombobox(false)
  }

  const getAvailableGrades = (schoolName: string) => {
    const school = schools.find(s => s.SCHUL_NM === schoolName)
    return school?.SCHUL_NM.endsWith('초등학교') ? 
      Array.from({length: 6}, (_, i) => (i + 1).toString()) :
      ['1', '2', '3']
  }

  // Fetch available classes when school and grade are selected
  const fetchClasses = async (schoolCode: string, grade: string) => {
    try {
      setError(null)
      const response = await fetch(`${API_URL}/classes?grade=${grade}&schoolcode=${schoolCode}`)
      if (!response.ok) throw new Error('반 정보를 불러오지 못했습니다')
      const data = await response.json()
      setAvailableClasses(Array.isArray(data) ? data : [])
      if (Array.isArray(data) && data.length === 0) {
        setError('해당 학년의 반 정보가 없습니다')
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
      setAvailableClasses([])
      setError(error instanceof Error ? error.message : '반 정보를 불러오는 중 오류가 발생했습니다')
    }
  }

  // Update searchSchools to use the log function
  const searchSchools = useMemo(() =>
    debounce(async (query: string) => {
      log('Debounced search executing for:', query)
      if (query.length < 2) {
        setSchools([])
        setError(null)
        setIsSearching(false)
        return
      }
      
      setIsLoading(true)
      setOpenCombobox(true)
      try {
        setError(null)
        log('Fetching schools for query:', query)
        const response = await fetch(`${API_URL}/school?schoolname=${encodeURIComponent(query)}`)
        if (!response.ok) throw new Error('학교 정보를 불러오지 못했습니다')
        const data = await response.json()
        log('Search results received:', data)
        setSchools(Array.isArray(data) ? data : [])
        if (Array.isArray(data) && data.length === 0) {
          setError('검색 결과가 없습니다')
        }
      } catch (error) {
        console.error('Error fetching schools:', error)
        setSchools([])
        setError(error instanceof Error ? error.message : '학교 정보를 불러오는 중 오류가 발생했습니다')
      } finally {
        setIsLoading(false)
        setIsSearching(false)
        setOpenCombobox(true)
      }
    }, 500),
    []
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className={cn(
          "dark:bg-neutral-900 dark:border-neutral-800",
          "w-[90%] max-w-lg p-6",
          "rounded-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
          "data-[state=open]:slide-in-from-left-1/2 data-[state=closed]:slide-out-to-left-1/2",
          "data-[state=open]:slide-in-from-top-[48%] data-[state=closed]:slide-out-to-top-[48%]"
        )}
      >
        <DialogHeader>
          <DialogTitle className="dark:text-neutral-100">설정</DialogTitle>
          <DialogDescription className="dark:text-neutral-400">
            학급 정보 등을 설정해 주세요. 
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label className="dark:text-neutral-200">학교</Label>
            <Popover 
              open={openCombobox}
              onOpenChange={(open) => {
                log('Popover open changing to:', open)
                setOpenCombobox(open)
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="justify-between w-full dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
                  onClick={() => {
                    log('Trigger clicked, current open state:', openCombobox)
                    setOpenCombobox(true)
                  }}
                >
                  {searchValue || "학교 검색..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-[var(--radix-popover-trigger-width)] p-0 dark:bg-neutral-800 dark:border-neutral-700"
                align="start"
              >
                <Command 
                  className="dark:bg-neutral-800"
                  filter={() => 1}
                  shouldFilter={false}
                >
                  <CommandInput 
                    placeholder="학교 이름 검색..." 
                    value={searchValue}
                    onValueChange={handleSearchValueChange}
                    className="dark:bg-neutral-800 dark:text-neutral-100"
                  />
                  
                  <CommandList>
                    {error ? (
                      <div className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
                        {error}
                      </div>
                    ) : searchValue.length <= 1 ? (
                      <CommandEmpty className="py-6 text-center text-sm dark:text-neutral-400">
                        학교 이름을 입력하세요
                      </CommandEmpty>
                    ) : isLoading ? (
                      <div className="py-6 text-center text-sm dark:text-neutral-400">
                        검색중...
                      </div>
                    ) : schools.length === 0 ? (
                      <div className="py-6 text-center text-sm dark:text-neutral-400">
                        검색 결과가 없습니다
                      </div>
                    ) : (
                      <CommandGroup>
                        {schools.map((school) => (
                            <CommandItem
                              key={`${school.SCHUL_NM}-${school.SD_SCHUL_CODE}`}
                              onSelect={() => handleSchoolSelect(school.SCHUL_NM)}
                              className="dark:text-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  tempConfig.school === school.SCHUL_NM ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {school.SCHUL_NM}
                              <span className="ml-2 text-sm text-neutral-500 dark:text-neutral-400">
                                ({school.ATPT_OFCDC_SC_NM})
                              </span>
                            </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {error && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {error}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="dark:text-neutral-200">학년</Label>
              <Select
                disabled={!tempConfig.school || isSearching}
                value={tempConfig.grade}
                onValueChange={(value) => setTempConfig({ ...tempConfig, grade: value, class: '' })}
              >
                <SelectTrigger className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100">
                  <SelectValue placeholder="학년 선택" />
                </SelectTrigger>
                <SelectContent className="dark:bg-neutral-800 dark:border-neutral-700">
                  {tempConfig.school && getAvailableGrades(tempConfig.school).map((grade) => (
                    <SelectItem 
                      key={grade} 
                      value={grade}
                      className="dark:text-neutral-100 dark:focus:bg-neutral-700"
                    >
                      {grade}학년
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="dark:text-neutral-200">반</Label>
              <Select
                disabled={!tempConfig.school || !tempConfig.grade || isSearching}
                value={tempConfig.class}
                onValueChange={(value) => setTempConfig({ ...tempConfig, class: value })}
              >
                <SelectTrigger className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100">
                  <SelectValue placeholder="반 선택" />
                </SelectTrigger>
                <SelectContent className="dark:bg-neutral-800 dark:border-neutral-700">
                  {availableClasses.map((classNum) => (
                    <SelectItem 
                      key={classNum} 
                      value={classNum}
                      className="dark:text-neutral-100 dark:focus:bg-neutral-700"
                    >
                      {classNum}반
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label className="dark:text-neutral-200">점심시간</Label>
            <Select
              disabled={!tempConfig.school || !tempConfig.grade || !tempConfig.class || isSearching}
              value={tempConfig.lunchAfter.toString()}
              onValueChange={(value) => setTempConfig({ ...tempConfig, lunchAfter: parseInt(value) })}
            >
              <SelectTrigger className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100">
                <SelectValue placeholder="점심시간 선택" />
              </SelectTrigger>
              <SelectContent className="dark:bg-neutral-800 dark:border-neutral-700">
                {[3, 4, 5].map((period) => (
                  <SelectItem 
                    key={period} 
                    value={period.toString()}
                    className="dark:text-neutral-100 dark:focus:bg-neutral-700"
                  >
                    {period}교시 후
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={() => onSave(tempConfig)}
            disabled={!tempConfig.school || !tempConfig.grade || !tempConfig.class || isSearching}
            className="w-full sm:w-auto"
          >
            저장
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

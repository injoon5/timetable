import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getCookie, setCookie } from 'cookies-next'
import config from '@/config.json'

const API_URL = config.isDev ? config.development.apiUrl : config.production.apiUrl

const DEFAULT_CONFIG: ClassConfig = {
  school: "목운중학교",
  schoolCode: "7081492",
  grade: "3",
  class: "4",
  lunchAfter: 4
}

interface TimetableState {
  // Persistent state
  classConfig: ClassConfig
  teacherInfo: Record<string, Record<string, string>>
  
  // Temporary state (not persisted)
  tempConfig: ClassConfig | null
  timetableData: TimetableData | null
  isLoading: boolean
  isWeekChangeLoading: boolean  // New state for week change loading
  error: string | null
  isNextWeek: boolean
  showConfig: boolean
  
  // Actions
  initializeStore: () => Promise<void>
  setTempConfig: (config: ClassConfig) => void
  resetTempConfig: () => void
  setShowConfig: (show: boolean) => void
  changeWeek: (isNext: boolean) => Promise<void>  // Updated week change action
  saveConfig: () => Promise<boolean>
  saveTeacherInfo: (subject: string, info: string) => void
  fetchTimetable: (config?: ClassConfig) => Promise<void>
}

interface ClassConfig {
  school: string
  schoolCode: string
  grade: string
  class: string
  lunchAfter: number
}

interface TimetableData {
  day_time: string[]
  timetable: Array<Array<{
    period: number
    subject: string
    teacher: string
    replaced: boolean
    original: {
      period: number
      subject: string
      teacher: string
    } | null
  }>>
  update_date: string
}

export const useTimetableStore = create<TimetableState>()((set, get) => ({
  // Initialize with default values
  classConfig: DEFAULT_CONFIG,
  teacherInfo: {},
  tempConfig: null,
  timetableData: null,
  isLoading: true,
  isWeekChangeLoading: false,
  error: null,
  isNextWeek: false,
  showConfig: false,

  initializeStore: async () => {
    // Load saved config from cookies
    const savedConfig = getCookie('classConfig')
    const config = savedConfig ? JSON.parse(savedConfig as string) : DEFAULT_CONFIG
    
    // Load saved teacher info
    const savedTeacherInfo = getCookie('teacherInfo')
    const teacherInfo = savedTeacherInfo ? JSON.parse(savedTeacherInfo as string) : {}

    set({ 
      classConfig: config,
      teacherInfo,
      tempConfig: null,
      isLoading: true
    })

    try {
      // Fetch initial timetable
      const params = new URLSearchParams({
        grade: config.grade,
        classno: config.class,
        week: "0", // Always start with current week
        schoolcode: config.schoolCode
      })

      const response = await fetch(`${API_URL}/timetable?${params}`)
      if (!response.ok) throw new Error(`Error: ${response.status}`)
      
      const data = await response.json()
      set({ 
        timetableData: data,
        isNextWeek: false,
        error: null
      })
    } catch (err) {
      set({ 
        error: err instanceof Error 
          ? `시간표를 불러오는 중 오류가 발생했습니다: ${err.message}`
          : '시간표를 불러오지 못했습니다. 학교 정보와 인터넷 연결을 확인해 주세요.'
      })
    } finally {
      set({ isLoading: false })
    }
  },

  setTempConfig: (config: ClassConfig) => {
    set({ tempConfig: config })
  },

  resetTempConfig: () => {
    set({ tempConfig: null })
  },

  setShowConfig: (show: boolean) => {
    set({ 
      showConfig: show,
      // Reset temp config when closing dialog without saving
      tempConfig: show ? get().tempConfig : null,
      error: null
    })
  },

  changeWeek: async (isNext: boolean) => {
    // Don't fetch if we're already on the requested week
    if ((isNext && get().isNextWeek) || (!isNext && !get().isNextWeek)) {
      return
    }

    set({ isWeekChangeLoading: true })
    try {
      const params = new URLSearchParams({
        grade: get().classConfig.grade,
        classno: get().classConfig.class,
        week: isNext ? "1" : "0",
        schoolcode: get().classConfig.schoolCode
      })

      const response = await fetch(`${API_URL}/timetable?${params}`)
      if (!response.ok) throw new Error(`Error: ${response.status}`)
      
      const data = await response.json()
      
      set({ 
        timetableData: data,
        isNextWeek: isNext,
        error: null
      })
    } catch (err) {
      set({ 
        error: err instanceof Error 
          ? `시간표를 불러오는 중 오류가 발생했습니다: ${err.message}`
          : '시간표를 불러오지 못했습니다. 학교 정보와 인터넷 연결을 확인해 주세요.'
      })
    } finally {
      set({ isWeekChangeLoading: false })
    }
  },

  saveConfig: async () => {
    const { tempConfig } = get()
    if (!tempConfig) return false

    try {
      // Try fetching with new config first
      await get().fetchTimetable(tempConfig)
      
      // If successful, save to cookies and update main config
      setCookie('classConfig', JSON.stringify(tempConfig))
      set({ 
        classConfig: tempConfig,
        tempConfig: null,
        showConfig: false
      })
      return true
    } catch (err) {
      set({ 
        error: err instanceof Error 
          ? `설정을 저장하는 중 오류가 발생했습니다: ${err.message}`
          : '설정을 저장하지 못했습니다. 학교 정보와 인터넷 연결을 확인해 주세요.'
      })
      return false
    }
  },

  saveTeacherInfo: (subject: string, info: string) => {
    const { classConfig, teacherInfo } = get()
    const configKey = `${classConfig.schoolCode}-${classConfig.grade}-${classConfig.class}`
    
    const newInfo = {
      ...teacherInfo,
      [configKey]: {
        ...(teacherInfo[configKey] || {}),
        [subject]: info
      }
    }

    set({ teacherInfo: newInfo })
    setCookie('teacherInfo', JSON.stringify(newInfo))
  },

  fetchTimetable: async (config?: ClassConfig) => {
    const currentConfig = config || get().classConfig
    set({ isLoading: true, error: null })
    
    try {
      const params = new URLSearchParams({
        grade: currentConfig.grade,
        classno: currentConfig.class,
        week: get().isNextWeek ? "1" : "0",
        schoolcode: currentConfig.schoolCode
      })

      const response = await fetch(`${API_URL}/timetable?${params}`)
      if (!response.ok) throw new Error(`Error: ${response.status}`)
      
      const data = await response.json()
      set({ timetableData: data })
    } catch (err) {
      set({ 
        error: err instanceof Error 
          ? `시간표를 불러오는 중 오류가 발생했습니다: ${err.message}`
          : '시간표를 불러오지 못했습니다. 학교 정보와 인터넷 연결을 확인해 주세요.'
      })
      throw err // Re-throw for saveConfig to catch
    } finally {
      set({ isLoading: false })
    }
  }
})) 
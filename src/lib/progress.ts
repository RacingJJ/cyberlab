export type Progress = {
  xp: number
  level: number
  completedLessons: string[]
  completedLabs: string[]
  badges: string[]
  streak: number
  quizHistory: { id: string; score: number; date: string }[]
}

const defaultProgress: Progress = {
  xp: 0,
  level: 1,
  completedLessons: [],
  completedLabs: [],
  badges: ['First Step'],
  streak: 0,
  quizHistory: []
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem('cyberlab-progress-v1')
    if (!raw) return defaultProgress
    return { ...defaultProgress, ...JSON.parse(raw) }
  } catch {
    return defaultProgress
  }
}

export function saveProgress(progress: Progress) {
  localStorage.setItem('cyberlab-progress-v1', JSON.stringify(progress))
}

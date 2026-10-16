export type Lesson = {
  id: string
  title: string
  path: string
  content: string
}

export type Lab = {
  id: string
  title: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  objectives: string[]
}

export type QuizOption = {
  label: string
  value: string
}

export type QuizQuestion = {
  id: string
  prompt: string
  options: QuizOption[]
  answer: string
  explanation: string
}

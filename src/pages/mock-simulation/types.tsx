export interface Session {
  id: number
  package_id: number
  user_id: number
  completed: number
  score: number | string
  section_id: number
  question_id: number
  first_time: string
  last_time: string
  started_at: string
  finished_at: string
  package: {
    id: number
    name: string
    type: string
  }
}

export interface Package {
  id: number
  name: string
  type: string
  code: string
}

import { FormInstance } from 'antd'

export interface Step4FormProps {
  form: FormInstance
}

export interface Step2FormProps {
  students?: Array<Student>
  tutors?: Array<Tutor>
}

export interface Student {
  id: number
  status: number
  full_name: string
  phone_number: string | number
  profile_picture: string
  ucat_teaching_session_credit: string | number
  teaching_session_credit: string | number
  country: string
  credit: string | number
  timezone_id: number
}

export interface Tutor {
  id: number
  full_name: string
  profile_picture: string
  biography: string
  university: Array<University>
}

export interface University {
  school: string
  degree: string
}

export interface JobOffer {
  id: string
  title: string
  street: string
  city: string
  country_code: string
  marker_icon: string
  remote: boolean
  experience_level: string
  salary_from: number
  salary_to: number
  salary_currency: string
  latitude: number
  longitude: number
  employment_type: string
  published_at: Date
  company_name: string
  company_url: string
  company_size: number
  company_logo_url: string
  skills: ProgrammingSkill[]
}

export interface ProgrammingSkill {
  name: string
  level: number
}

export interface JobCategoryWithCount {
  category: string
  count: number
}

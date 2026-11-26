import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type JobSeeker = {
  id: string;
  telegram_id: number;
  username?: string;
  first_name?: string;
  language: string;
  city?: string;
  field?: string;
  experience_years: number;
  min_salary: number;
  languages: Record<string, string>;
  job_type: string[];
  education?: string;
  skills: string[];
  bio?: string;
  is_premium: boolean;
  rating: number;
  created_at: string;
};

export type Employer = {
  id: string;
  telegram_id: number;
  company_name: string;
  company_logo?: string;
  website?: string;
  description?: string;
  benefits: string[];
  is_verified: boolean;
  rating: number;
  created_at: string;
};

export type Vacancy = {
  id: string;
  employer_id: string;
  title: string;
  salary_min: number;
  salary_max: number;
  city: string;
  job_type: string;
  schedule?: string;
  experience_years?: number;
  required_languages: Record<string, string>;
  required_skills: string[];
  screening_questions: any[];
  description?: string;
  status: string;
  is_featured: boolean;
  created_at: string;
};

export type Application = {
  id: string;
  job_seeker_id: string;
  vacancy_id: string;
  status: string;
  screening_answers: Record<string, any>;
  sent_at: string;
  viewed_at?: string;
  interview_scheduled_at?: string;
  responded_at?: string;
  created_at: string;
};
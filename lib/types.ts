import type { UserRole } from './constants';

export type ActionResult<T = undefined> = T extends undefined
  ? { success?: boolean; error?: string }
  : { success?: boolean; error?: string; data?: T };

export type ShiftStatus = 'open' | 'filled' | 'completed' | 'cancelled';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'no_show';

export interface ShiftFilters {
  district?: string;
  dateFrom?: string;
  dateTo?: string;
  skills?: string[];
  urgentOnly?: boolean;
  minPayCents?: number;
  status?: ShiftStatus | ShiftStatus[];
  limit?: number;
  offset?: number;
}

export interface DashboardStats {
  role: UserRole;
  pendingApplications?: number;
  upcomingShifts?: number;
  completedShifts?: number;
  totalEarnedCents?: number;
  unreadNotifications?: number;
  openShifts?: number;
  pendingReview?: number;
  filledShifts?: number;
  ratingAvg?: number;
  totalUsers?: number;
  totalBusinesses?: number;
  totalOpenShifts?: number;
  applicationsToday?: number;
  contactSubmissions?: number;
}

export interface PlatformStats {
  openShifts: number;
  students: number;
  businesses: number;
  completedShifts: number;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

export interface Profile {
  id: string;
  role: UserRole;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  onboarding_complete: boolean;
  suspended: boolean;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  university: string | null;
  degree: string | null;
  year_of_study: number | null;
  bio: string | null;
  skills: string[];
  languages: Record<string, string>;
  availability: Record<string, unknown>;
  cv_url: string | null;
  reliability_score: number;
  shifts_completed: number;
  total_earned_cents: number;
  stripe_account_id: string | null;
  district: string | null;
}

export interface Business {
  id: string;
  business_name: string;
  business_type: string;
  nif: string | null;
  district: string;
  address: string | null;
  phone: string | null;
  public_email: string | null;
  website: string | null;
  logo_url: string | null;
  description: string | null;
  verified: boolean;
  verified_at: string | null;
  verified_by: string | null;
  stripe_customer_id: string | null;
  rating_avg: number;
  shifts_posted: number;
}

export interface Shift {
  id: string;
  business_id: string;
  title: string;
  description: string;
  district: string;
  address: string | null;
  lat: number | string | null;
  lng: number | string | null;
  shift_date: string;
  start_time: string;
  end_time: string;
  pay_per_hour_cents: number;
  workers_needed: number;
  workers_confirmed: number;
  skills_needed: string[];
  is_urgent: boolean;
  status: ShiftStatus;
  created_at: string;
}

export interface Application {
  id: string;
  shift_id: string;
  student_id: string;
  status: ApplicationStatus;
  applied_at: string;
  responded_at: string | null;
  stripe_payment_intent_id: string | null;
}

export interface TalentPool {
  id: string;
  business_id: string;
  student_id: string;
  added_at: string;
  note: string | null;
}

export interface Conversation {
  id: string;
  shift_id: string;
  student_id: string;
  business_id: string;
  created_at: string;
  last_message_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  sent_at: string;
  read_at: string | null;
}

export interface Rating {
  id: string;
  shift_id: string;
  rater_id: string;
  rated_id: string;
  score: number;
  comment: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  link: string | null;
  read_at: string | null;
  created_at: string;
}

/** Nested business fields commonly selected with shifts. */
export type ShiftBusiness = Pick<
  Business,
  'id' | 'business_name' | 'business_type' | 'logo_url' | 'rating_avg' | 'verified' | 'district'
>;

/** Shift joined with its posting business — used in cards, browse, and map views. */
export interface ShiftWithBusiness extends Shift {
  business: ShiftBusiness;
}

export interface ApplicationWithShift extends Application {
  shift: ShiftWithBusiness;
}

export interface StudentWithProfile extends Student {
  profile: Profile;
}

export interface BusinessWithProfile extends Business {
  profile: Profile;
}

/** Supabase may return nested relations as objects or single-element arrays. */
export function unwrapRelation<T>(value: T | T[] | null | undefined): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

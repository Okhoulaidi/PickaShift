export const MADRID_DISTRICTS = [
  'Centro', 'Arganzuela', 'Retiro', 'Salamanca', 'Chamartín', 'Tetuán',
  'Chamberí', 'Fuencarral-El Pardo', 'Moncloa-Aravaca', 'Latina', 'Carabanchel',
  'Usera', 'Puente de Vallecas', 'Moratalaz', 'Ciudad Lineal', 'Hortaleza',
  'Villaverde', 'Villa de Vallecas', 'Vicálvaro', 'San Blas-Canillejas', 'Barajas',
] as const;

export const UNIVERSITIES = [
  'Universidad Complutense de Madrid (UCM)',
  'Universidad Autónoma de Madrid (UAM)',
  'Universidad Politécnica de Madrid (UPM)',
  'Universidad Carlos III de Madrid (UC3M)',
  'Universidad Rey Juan Carlos (URJC)',
  'IE University',
  'ESIC Business & Marketing School',
  'Other',
] as const;

export const SKILLS = [
  'Barista', 'Waiter', 'Cashier', 'Sales', 'Event staff', 'Heavy lifting',
  'Customer service', 'Cocktails', 'Food prep', 'POS/TPV', 'English', 'French', 'German',
] as const;

export const BUSINESS_TYPES = [
  'Restaurant', 'Café', 'Retail', 'Events', 'Hotel', 'Other',
] as const;

export const SPANISH_LEVELS = [
  { value: 'none', label: 'None' },
  { value: 'basic', label: 'Basic' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'fluent', label: 'Fluent' },
  { value: 'native', label: 'Native' },
] as const;

export const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
export const DAY_LABELS: Record<string, string> = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun',
};
export const SLOTS = ['morning', 'afternoon', 'evening'] as const;
export const SLOT_LABELS: Record<string, string> = {
  morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening',
};

/** Supabase Storage bucket id for student CV uploads (case-sensitive). */
export const STUDENT_CV_BUCKET = 'student-cvs';

export type UserRole = 'student' | 'business' | 'admin';

export interface UserMetadata {
  role?: UserRole;
  onboardingComplete?: boolean;
  verified?: boolean;
  suspended?: boolean;
}

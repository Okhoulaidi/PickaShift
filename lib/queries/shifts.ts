import { startOfDay } from 'date-fns';
import { createAdminClient } from '@/lib/supabase/admin';
import type { DashboardStats, PlatformStats, ShiftFilters } from '@/lib/types';

type ProfileSnippet = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  email: string;
};

async function fetchProfilesByIds(ids: string[]): Promise<Map<string, ProfileSnippet>> {
  if (!ids.length) return new Map();

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, avatar_url, email')
    .in('id', ids);

  if (error) {
    console.error('[fetchProfilesByIds]', error.code, error.message);
    return new Map();
  }

  return new Map((data ?? []).map((profile) => [profile.id, profile as ProfileSnippet]));
}

const SHIFT_SELECT = `
  *,
  business:businesses!inner(
    id,
    business_name,
    business_type,
    logo_url,
    rating_avg,
    verified,
    district
  )
`;

const APPLICATION_SELECT = `
  *,
  shift:shifts(
    id,
    title,
    shift_date,
    start_time,
    end_time,
    pay_per_hour_cents,
    district,
    status,
    business:businesses(business_name, logo_url)
  )
`;

export async function getOpenShifts(filters: ShiftFilters = {}) {
  const supabase = createAdminClient();
  const today = startOfDay(new Date()).toISOString().slice(0, 10);

  let query = supabase
    .from('shifts')
    .select(SHIFT_SELECT)
    .eq('status', 'open')
    .eq('business.verified', true)
    .gte('shift_date', filters.dateFrom ?? today)
    .order('shift_date', { ascending: true })
    .order('start_time', { ascending: true });

  if (filters.district) query = query.eq('district', filters.district);
  if (filters.dateTo) query = query.lte('shift_date', filters.dateTo);
  if (filters.urgentOnly) query = query.eq('is_urgent', true);
  if (filters.minPayCents) query = query.gte('pay_per_hour_cents', filters.minPayCents);
  if (filters.skills?.length) query = query.overlaps('skills_needed', filters.skills);
  if (filters.limit) query = query.limit(filters.limit);
  if (filters.offset) query = query.range(filters.offset, filters.offset + (filters.limit ?? 20) - 1);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getShiftById(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('shifts')
    .select(SHIFT_SELECT)
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function getPlatformStats(): Promise<PlatformStats> {
  const supabase = createAdminClient();

  const [openRes, studentsRes, businessesRes, completedRes] = await Promise.all([
    supabase.from('shifts').select('id', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('students').select('id', { count: 'exact', head: true }),
    supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('verified', true),
    supabase.from('shifts').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
  ]);

  return {
    openShifts: openRes.count ?? 0,
    students: studentsRes.count ?? 0,
    businesses: businessesRes.count ?? 0,
    completedShifts: completedRes.count ?? 0,
  };
}

export async function getBusinessShifts(businessId: string, filters: ShiftFilters = {}) {
  const supabase = createAdminClient();
  let query = supabase
    .from('shifts')
    .select('*')
    .eq('business_id', businessId)
    .order('shift_date', { ascending: false })
    .order('start_time', { ascending: false });

  if (filters.status) {
    const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
    query = query.in('status', statuses);
  }
  if (filters.dateFrom) query = query.gte('shift_date', filters.dateFrom);
  if (filters.dateTo) query = query.lte('shift_date', filters.dateTo);
  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getStudentApplications(studentId: string, status?: string) {
  const supabase = createAdminClient();
  let query = supabase
    .from('applications')
    .select(APPLICATION_SELECT)
    .eq('student_id', studentId)
    .order('applied_at', { ascending: false });

  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getShiftApplicants(shiftId: string, businessId: string) {
  const supabase = createAdminClient();

  const { data: shift } = await supabase
    .from('shifts')
    .select('business_id')
    .eq('id', shiftId)
    .single();

  if (!shift || shift.business_id !== businessId) throw new Error('Forbidden');

  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      student:students!inner(
        id,
        university,
        degree,
        year_of_study,
        bio,
        skills,
        reliability_score,
        shifts_completed
      )
    `)
    .eq('shift_id', shiftId)
    .order('applied_at', { ascending: true });

  if (error) throw new Error(error.message);

  const studentIds = [...new Set((data ?? []).map((app) => app.student_id))];
  const profileMap = await fetchProfilesByIds(studentIds);

  return (data ?? []).map((app) => {
    const student = Array.isArray(app.student) ? app.student[0] : app.student;
    return {
      ...app,
      student: student
        ? {
            ...student,
            profile: profileMap.get(app.student_id) ?? null,
          }
        : app.student,
    };
  });
}

export async function getDashboardStats(role: 'student' | 'business' | 'admin', userId: string): Promise<DashboardStats> {
  const supabase = createAdminClient();
  const today = startOfDay(new Date()).toISOString().slice(0, 10);

  const unreadQuery = supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .is('read_at', null);

  if (role === 'student') {
    const [pending, upcoming, completed, student, unread] = await Promise.all([
      supabase.from('applications').select('id', { count: 'exact', head: true }).eq('student_id', userId).eq('status', 'pending'),
      supabase.from('applications').select('id', { count: 'exact', head: true }).eq('student_id', userId).eq('status', 'accepted'),
      supabase.from('applications').select('id', { count: 'exact', head: true }).eq('student_id', userId).eq('status', 'completed'),
      supabase.from('students').select('total_earned_cents').eq('id', userId).single(),
      unreadQuery,
    ]);

    return {
      role,
      pendingApplications: pending.count ?? 0,
      upcomingShifts: upcoming.count ?? 0,
      completedShifts: completed.count ?? 0,
      totalEarnedCents: student.data?.total_earned_cents ?? 0,
      unreadNotifications: unread.count ?? 0,
    };
  }

  if (role === 'business') {
    // Get shift IDs for this business first.
    // We can't use an embedded join with head:true to filter pending apps —
    // PostgREST drops the join condition on HEAD requests, returning the wrong count.
    const { data: bizShifts } = await supabase
      .from('shifts')
      .select('id')
      .eq('business_id', userId);

    const shiftIds = bizShifts?.map((s) => s.id) ?? [];

    const [open, pending, filled, biz, unread] = await Promise.all([
      supabase
        .from('shifts')
        .select('id', { count: 'exact', head: true })
        .eq('business_id', userId)
        .eq('status', 'open'),
      shiftIds.length
        ? supabase
            .from('applications')
            .select('id', { count: 'exact', head: true })
            .in('shift_id', shiftIds)
            .eq('status', 'pending')
        : Promise.resolve({ count: 0 }),
      supabase
        .from('shifts')
        .select('id', { count: 'exact', head: true })
        .eq('business_id', userId)
        .eq('status', 'filled'),
      supabase.from('businesses').select('rating_avg').eq('id', userId).single(),
      unreadQuery,
    ]);

    return {
      role,
      openShifts: open.count ?? 0,
      pendingReview: pending.count ?? 0,
      filledShifts: filled.count ?? 0,
      ratingAvg: Number(biz.data?.rating_avg ?? 0),
      unreadNotifications: unread.count ?? 0,
    };
  }

  const [users, totalBusinesses, openShifts, applicationsToday, contactSubmissions, unread] =
    await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('businesses').select('id', { count: 'exact', head: true }),
    supabase.from('shifts').select('id', { count: 'exact', head: true }).eq('status', 'open'),
    supabase.from('applications').select('id', { count: 'exact', head: true }).gte('applied_at', `${today}T00:00:00`),
    supabase.from('contact_submissions').select('id', { count: 'exact', head: true }),
    unreadQuery,
  ]);

  return {
    role,
    totalUsers: users.count ?? 0,
    totalBusinesses: totalBusinesses.count ?? 0,
    totalOpenShifts: openShifts.count ?? 0,
    applicationsToday: applicationsToday.count ?? 0,
    contactSubmissions: contactSubmissions.count ?? 0,
    unreadNotifications: unread.count ?? 0,
  };
}

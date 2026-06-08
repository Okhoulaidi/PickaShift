import { createAdminClient } from '@/lib/supabase/admin';

export { getBusinessProfile } from '@/lib/queries/business';
export { getStudentProfile } from '@/lib/queries/student';

type ProfileSnippet = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  email: string;
  created_at?: string;
};

async function fetchProfilesByIds(ids: string[]): Promise<Map<string, ProfileSnippet>> {
  if (!ids.length) return new Map();

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, avatar_url, email, created_at')
    .in('id', ids);

  if (error) {
    console.error('[fetchProfilesByIds]', error.code, error.message);
    return new Map();
  }

  return new Map((data ?? []).map((profile) => [profile.id, profile as ProfileSnippet]));
}

export async function getTalentPool(businessId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('talent_pool')
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
    .eq('business_id', businessId)
    .order('added_at', { ascending: false });

  if (error) throw new Error(error.message);

  const studentIds = [...new Set((data ?? []).map((row) => row.student_id))];
  const profileMap = await fetchProfilesByIds(studentIds);

  return (data ?? []).map((row) => {
    const student = Array.isArray(row.student) ? row.student[0] : row.student;
    return {
      ...row,
      student: student
        ? {
            ...student,
            profile: profileMap.get(row.student_id) ?? null,
          }
        : row.student,
    };
  });
}

export async function getUnverifiedBusinesses() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('verified', false);

  if (error) throw new Error(error.message);

  const businessIds = (data ?? []).map((business) => business.id);
  const profileMap = await fetchProfilesByIds(businessIds);

  return (data ?? [])
    .map((business) => ({
      ...business,
      profile: profileMap.get(business.id) ?? null,
    }))
    .sort((a, b) => {
      const aDate = a.profile?.created_at ?? '';
      const bDate = b.profile?.created_at ?? '';
      return aDate.localeCompare(bDate);
    });
}

export async function getAllProfiles(limit = 100) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getBusinessAnalytics(businessId: string) {
  const supabase = createAdminClient();

  const [shiftsRes, appsRes, completedRes, poolRes] = await Promise.all([
    supabase.from('shifts').select('id, status', { count: 'exact' }).eq('business_id', businessId),
    supabase
      .from('applications')
      .select('id, status, shift:shifts!inner(business_id)', { count: 'exact' })
      .eq('shift.business_id', businessId),
    supabase
      .from('applications')
      .select('id, shift:shifts!inner(business_id, status)', { count: 'exact', head: true })
      .eq('status', 'completed')
      .eq('shift.business_id', businessId),
    supabase.from('talent_pool').select('id', { count: 'exact', head: true }).eq('business_id', businessId),
  ]);

  const shifts = shiftsRes.data ?? [];
  const openShifts = shifts.filter((s) => s.status === 'open').length;
  const filledShifts = shifts.filter((s) => s.status === 'filled').length;
  const completedShifts = shifts.filter((s) => s.status === 'completed').length;

  const apps = appsRes.data ?? [];
  const pendingApps = apps.filter((a) => a.status === 'pending').length;
  const acceptedApps = apps.filter((a) => a.status === 'accepted').length;

  return {
    totalShifts: shifts.length,
    openShifts,
    filledShifts,
    completedShifts,
    totalApplications: apps.length,
    pendingApplications: pendingApps,
    acceptedApplications: acceptedApps,
    completedApplications: completedRes.count ?? 0,
    talentPoolSize: poolRes.count ?? 0,
  };
}

export async function getStudentAppliedShiftIds(studentId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('applications')
    .select('shift_id')
    .eq('student_id', studentId);

  return new Set((data ?? []).map((a) => a.shift_id));
}

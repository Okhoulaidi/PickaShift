import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { ShiftDetailClient } from '@/components/shift/ShiftDetailClient';
import { getShiftById } from '@/lib/queries/shifts';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ShiftWithBusiness } from '@/lib/types';

export default async function ShiftDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shift = (await getShiftById(id)) as ShiftWithBusiness | null;
  if (!shift) notFound();

  const { userId } = await auth();
  let alreadyApplied = false;

  if (userId) {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('applications')
      .select('id')
      .eq('shift_id', id)
      .eq('student_id', userId)
      .maybeSingle();
    alreadyApplied = !!data;
  }

  return <ShiftDetailClient shift={shift} alreadyApplied={alreadyApplied} />;
}

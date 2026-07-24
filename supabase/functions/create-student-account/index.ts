import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) throw new Error('You must be signed in.');
    const projectUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const userClient = createClient(projectUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) throw new Error('Your session has expired.');
    const adminClient = createClient(projectUrl, serviceKey);
    const { data: profile } = await adminClient.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error('Only administrators can create student accounts.');

    const { student, username } = await request.json();
    if (!student?.name || !username || !/^[a-z0-9]+$/.test(username)) throw new Error('Use a name and a lowercase username containing letters and numbers only.');
    const placeholderEmail = `${username}@students.pimes.local`;
    const temporaryPassword = `${username}123`;
    
    let studentId = student.id;
    const isNewStudent = !studentId;
    
    if (isNewStudent) {
      const { data: newStudent, error: studentError } = await adminClient.from('students').insert({
        name: student.name, photo: student.photo || null, contact_number: student.contactNumber || null,
        parent_guardian: student.parentGuardian || null, monthly_fee: Number(student.monthlyFee) || 0,
        schedule: student.schedule || null, date_enrolled: student.dateEnrolled || null, notes: student.notes || null
      }).select('id').single();
      if (studentError) throw studentError;
      studentId = newStudent.id;
    }
    
    const { data: account, error: accountError } = await adminClient.auth.admin.createUser({ email: placeholderEmail, password: temporaryPassword, email_confirm: true, user_metadata: { username } });
    if (accountError) { 
      if (isNewStudent) {
        await adminClient.from('students').delete().eq('id', studentId);
      }
      throw accountError; 
    }
    const { error: profileError } = await adminClient.from('profiles').update({ role: 'student', student_id: studentId, username, must_change_password: true }).eq('id', account.user.id);
    if (profileError) throw profileError;
    return Response.json({ username, temporaryPassword }, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    return Response.json({ error: error.message || 'Could not create the account.' }, { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});

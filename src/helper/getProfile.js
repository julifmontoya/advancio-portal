// helper/getProfile.js
import supabase from '../helper/supabaseClient';

export const getProfile = async (userId) => {
  if (!userId) return null;

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    console.error('Session error:', sessionError);
    return null;
  }

  const accessToken = session.access_token;

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
    }
  );

  const json = await res.json();
  return json[0] || null;
};

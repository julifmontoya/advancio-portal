import { getSessionToken } from './getSessionToken';

export const getProfile = async (userId) => {
  if (!userId) return null;

  const accessToken = await getSessionToken();
  if (!accessToken) return null;

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
    }
  );

  if (!res.ok) {
    console.error('Failed to fetch profile:', await res.text());
    return null;
  }

  const json = await res.json();
  return json[0] || null;
};

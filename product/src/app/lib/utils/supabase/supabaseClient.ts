import { createClient } from '@supabase/supabase-js';
import { SupabaseAdapter } from '@auth/supabase-adapter';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing environment variable SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable SUPABASE_ANON_KEY');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing environment variable SUPABASE_SERVICE_ROLE_KEY');
}
if (!process.env.SUPABASE_JWT_SECRET) {
  throw new Error('Missing environment variable SUPABASE_JWT_SECRET');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET;

export function initializeSupabaseClient(supabaseAccessToken?: string) {
  const options = supabaseAccessToken
    ? {
        global: {
          headers: {
            Authorization: `Bearer ${supabaseAccessToken}`,
          },
        },
      }
    : {};

  return createClient(supabaseUrl, supabaseAnonKey, options);
}

export const supabaseClient = initializeSupabaseClient();

// export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseNextAuthAdapter = SupabaseAdapter({
  url: supabaseUrl,
  secret: supabaseServiceRoleKey,
});

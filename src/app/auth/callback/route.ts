import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in search params, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Check if this was a password reset request
      // Supabase doesn't always send the type in PKCE, 
      // but we know it's a reset if 'next' was set to /reset-password
      return NextResponse.redirect(`${origin}${next}`);
    } else {
      console.error('Auth callback error:', error.message);
      // Redirect to login with error message and explicit login mode
      return NextResponse.redirect(`${origin}/login?mode=login&error=${encodeURIComponent(error.message)}`);
    }
  }

  // If no code, check if there's an error in the URL from Supabase
  const error_description = searchParams.get('error_description');
  if (error_description) {
    return NextResponse.redirect(`${origin}/login?mode=login&error=${encodeURIComponent(error_description)}`);
  }

  // Fallback for invalid links
  return NextResponse.redirect(`${origin}/login?mode=login&error=Invalid or expired authentication link`);
}

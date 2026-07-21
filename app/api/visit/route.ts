import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Extract server headers
  const ip =
  req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
  null;
  const user_agent = req.headers.get('user-agent') || null;
  const language = req.headers.get('accept-language')?.split(',')[0] || null;
  const referer = req.headers.get('referer') || null;

  const { error } = await supabase.from('visits').insert([
    {
      ip,
      user_agent,
      language,
      referer,
      ...body, // country, city, timezone, screen dimensions, color_scheme, coords
    },
  ]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
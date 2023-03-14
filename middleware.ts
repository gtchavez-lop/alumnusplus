import { NextRequest, NextResponse } from 'next/server'

import { supabase } from './lib/supabase'

export async function middleware(request: NextRequest) {
  const session =  await supabase.auth.getSession()

  if (!session && request.nextUrl.pathname.startsWith('/h')) {
    return NextResponse.redirect(new URL("/login", request.nextUrl.origin).toString())
  }
}
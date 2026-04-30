import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl.clone();

  // // Redirect requests starting with /blog to the external blog site
  // if (url.pathname.startsWith('/blog')) {
  //   return NextResponse.redirect('https://www.pitchpredictions.com/blog');
  // }

  // Allow other routes to proceed as usual
  return NextResponse.next();
}

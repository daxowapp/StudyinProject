import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
    const { supabase, response, user } = await updateSession(request)

    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Allow access to login page
        if (request.nextUrl.pathname === '/admin/login') {
            // If already logged in as admin, redirect to dashboard
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()

                if (profile?.role === 'admin') {
                    return NextResponse.redirect(new URL('/admin', request.url))
                }
            }
            return response
        }

        // Protect other admin routes
        if (!user) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        // Check if user is admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'admin') {
            // Redirect unauthorized users to home or show error
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // Protect dashboard routes
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (!user) {
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}

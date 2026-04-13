import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

const COOKIE_NAME = 'takeni-auth'

const PROTECTED_CUSTOMER_PATHS = ['/customer']
const PROTECTED_TECHNICIAN_PATHS = ['/technician']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isCustomerPath = PROTECTED_CUSTOMER_PATHS.some((path) =>
    pathname.startsWith(path)
  )
  const isTechnicianPath = PROTECTED_TECHNICIAN_PATHS.some((path) =>
    pathname.startsWith(path)
  )

  if (!isCustomerPath && !isTechnicianPath) {
    return NextResponse.next()
  }

  const token = request.cookies.get(COOKIE_NAME)?.value

  if (!token) {
    const role = isTechnicianPath ? 'technician' : 'customer'
    return NextResponse.redirect(new URL(`/auth?role=${role}`, request.url))
  }

  const payload = await verifyToken(token)

  if (!payload) {
    const role = isTechnicianPath ? 'technician' : 'customer'
    return NextResponse.redirect(new URL(`/auth?role=${role}`, request.url))
  }

  // Redirect technician trying to access customer routes and vice versa
  if (isTechnicianPath && payload.role !== 'technician') {
    return NextResponse.redirect(new URL('/customer', request.url))
  }

  if (isCustomerPath && payload.role !== 'customer') {
    return NextResponse.redirect(new URL('/technician', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/customer/:path*', '/technician/:path*'],
}

import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value

  const pendingVerify = request.cookies.get('pendingVerify')?.value

  const { pathname } = request.nextUrl

  // Đã đăng nhập
  if (token) {
    if (
      pathname === '/login' ||
      pathname === '/register' ||
      pathname === '/verify'
    ) {
      return NextResponse.redirect(
        new URL('/dashboard', request.url)
      )
    }

    return NextResponse.next()
  }

  // Chưa đăng nhập nhưng truy cập Verify
  if (pathname === '/verify') {
    if (!pendingVerify) {
      return NextResponse.redirect(
        new URL('/register', request.url)
      )
    }

    return NextResponse.next()
  }

  // Login và Register được truy cập khi chưa đăng nhập
  if (
    pathname === '/login' ||
    pathname === '/register'
  ) {
    return NextResponse.next()
  }

  // Các trang còn lại bắt buộc đăng nhập
  return NextResponse.redirect(
    new URL('/login', request.url)
  )
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/users/:path*',
    '/vaccinations/:path*',

    '/login',
    '/register',
    '/verify'
  ]
}
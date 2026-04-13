import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { signToken } from '@/lib/auth'

const COOKIE_NAME = 'takeni-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, password, role = 'customer' } = body

    if (!name || !phone || !password) {
      return NextResponse.json(
        { error: 'שם, טלפון וסיסמה הם שדות חובה' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'הסיסמה חייבת להכיל לפחות 6 תווים' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { phone },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'מספר הטלפון כבר רשום במערכת' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        phone,
        password: hashedPassword,
        role,
      },
    })

    // If registering as technician, create technician profile
    if (role === 'technician') {
      await prisma.technician.create({
        data: {
          userId: user.id,
          specialty: JSON.stringify([]),
          isAvailable: false,
        },
      })
    }

    const token = await signToken({
      userId: user.id,
      role: user.role,
      name: user.name,
      phone: user.phone,
    })

    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          role: user.role,
        },
      },
      { status: 201 }
    )

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'שגיאה בשרת, אנא נסה שוב' },
      { status: 500 }
    )
  }
}

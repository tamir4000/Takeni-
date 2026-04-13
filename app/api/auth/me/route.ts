import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)

    if (!authUser) {
      return NextResponse.json(
        { error: 'לא מחובר' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        createdAt: true,
        technician: {
          select: {
            id: true,
            specialty: true,
            rating: true,
            totalJobs: true,
            isAvailable: true,
            address: true,
            bio: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'משתמש לא נמצא' },
        { status: 404 }
      )
    }

    // Parse specialty JSON if technician
    const responseUser = {
      ...user,
      technician: user.technician
        ? {
            ...user.technician,
            specialty: JSON.parse(user.technician.specialty || '[]'),
          }
        : null,
    }

    return NextResponse.json({ user: responseUser })
  } catch (error) {
    console.error('Me error:', error)
    return NextResponse.json(
      { error: 'שגיאה בשרת' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)

    if (!authUser) {
      return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
    }

    const techProfile = await prisma.technician.findUnique({
      where: { userId: authUser.userId },
    })

    if (!techProfile) {
      return NextResponse.json({ error: 'פרופיל טכנאי לא נמצא' }, { status: 404 })
    }

    const updatedTech = await prisma.technician.update({
      where: { id: techProfile.id },
      data: {
        status: 'approved',
        isAvailable: true,
      },
    })

    return NextResponse.json({ success: true, technician: updatedTech })
  } catch (error) {
    console.error('Approve demo error:', error)
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 })
  }
}

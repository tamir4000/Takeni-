import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)

    if (!authUser || authUser.role !== 'technician') {
      return NextResponse.json({ error: 'לא מורשה' }, { status: 401 })
    }

    const tech = await prisma.technician.findUnique({
      where: { userId: authUser.userId },
    })

    if (!tech) {
      return NextResponse.json({ error: 'פרופיל טכנאי לא נמצא' }, { status: 404 })
    }

    return NextResponse.json({
      technician: {
        ...tech,
        specialty: JSON.parse(tech.specialty || '[]'),
      },
    })
  } catch (error) {
    console.error('Get technician me error:', error)
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)

    if (!authUser || authUser.role !== 'technician') {
      return NextResponse.json({ error: 'לא מורשה' }, { status: 401 })
    }

    const body = await request.json()
    const { isAvailable, currentLat, currentLng, specialty } = body

    const tech = await prisma.technician.findUnique({
      where: { userId: authUser.userId },
    })

    if (!tech) {
      return NextResponse.json({ error: 'פרופיל טכנאי לא נמצא' }, { status: 404 })
    }

    const updateData: Record<string, unknown> = {}
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable
    if (currentLat !== undefined) updateData.currentLat = currentLat
    if (currentLng !== undefined) updateData.currentLng = currentLng
    if (specialty !== undefined) updateData.specialty = JSON.stringify(specialty)

    const updated = await prisma.technician.update({
      where: { id: tech.id },
      data: updateData,
    })

    return NextResponse.json({
      technician: {
        ...updated,
        specialty: JSON.parse(updated.specialty || '[]'),
      },
    })
  } catch (error) {
    console.error('Update technician me error:', error)
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 })
  }
}

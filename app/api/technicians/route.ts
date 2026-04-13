import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const specialty = searchParams.get('specialty')
    const availableOnly = searchParams.get('available') !== 'false'

    const whereClause: Record<string, unknown> = {}

    if (availableOnly) {
      whereClause.isAvailable = true
    }

    const technicians = await prisma.technician.findMany({
      where: whereClause,
      include: {
        user: {
          select: { id: true, name: true, phone: true },
        },
      },
      orderBy: { rating: 'desc' },
    })

    // Parse specialties and optionally filter
    const parsedTechnicians = technicians
      .map((tech) => ({
        ...tech,
        specialty: JSON.parse(tech.specialty || '[]') as string[],
      }))
      .filter((tech) => {
        if (!specialty) return true
        return tech.specialty.includes(specialty)
      })

    return NextResponse.json({ technicians: parsedTechnicians })
  } catch (error) {
    console.error('Get technicians error:', error)
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)

    if (!authUser) {
      return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
    }

    if (authUser.role !== 'technician') {
      return NextResponse.json(
        { error: 'גישה מורשית לטכנאים בלבד' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { isAvailable, currentLat, currentLng, address, specialty } = body

    const techProfile = await prisma.technician.findUnique({
      where: { userId: authUser.userId },
    })

    if (!techProfile) {
      return NextResponse.json(
        { error: 'פרופיל טכנאי לא נמצא' },
        { status: 404 }
      )
    }

    const updateData: Record<string, unknown> = {}

    if (isAvailable !== undefined) updateData.isAvailable = isAvailable
    if (currentLat !== undefined) updateData.currentLat = currentLat
    if (currentLng !== undefined) updateData.currentLng = currentLng
    if (address !== undefined) updateData.address = address
    if (specialty !== undefined) updateData.specialty = JSON.stringify(specialty)

    const updatedTech = await prisma.technician.update({
      where: { id: techProfile.id },
      data: updateData,
      include: {
        user: {
          select: { id: true, name: true, phone: true },
        },
      },
    })

    return NextResponse.json({
      technician: {
        ...updatedTech,
        specialty: JSON.parse(updatedTech.specialty || '[]'),
      },
    })
  } catch (error) {
    console.error('Update technician error:', error)
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 })
  }
}

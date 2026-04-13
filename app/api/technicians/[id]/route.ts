import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const technician = await prisma.technician.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { id: true, name: true, phone: true },
        },
      },
    })

    if (!technician) {
      return NextResponse.json(
        { error: 'טכנאי לא נמצא' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      technician: {
        ...technician,
        specialty: JSON.parse(technician.specialty || '[]'),
      },
    })
  } catch (error) {
    console.error('Get technician error:', error)
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await getAuthUser(request)

    if (!authUser || authUser.role !== 'technician') {
      return NextResponse.json(
        { error: 'גישה מורשית לטכנאים בלבד' },
        { status: 403 }
      )
    }

    // Verify the technician is updating their own profile
    const techProfile = await prisma.technician.findUnique({
      where: { userId: authUser.userId },
    })

    if (!techProfile || techProfile.id !== params.id) {
      return NextResponse.json({ error: 'גישה לא מורשית' }, { status: 403 })
    }

    const body = await request.json()
    const { action, jobId } = body

    if (action === 'accept' && jobId) {
      // Accept a job
      const job = await prisma.job.findUnique({ where: { id: jobId } })

      if (!job || job.status !== 'searching') {
        return NextResponse.json(
          { error: 'עבודה לא זמינה לקבלה' },
          { status: 400 }
        )
      }

      const updatedJob = await prisma.job.update({
        where: { id: jobId },
        data: {
          technicianId: techProfile.id,
          status: 'matched',
        },
        include: {
          customer: {
            select: { id: true, name: true, phone: true },
          },
        },
      })

      return NextResponse.json({ job: updatedJob })
    }

    if (action === 'decline' && jobId) {
      // Decline means do nothing (job stays as searching)
      return NextResponse.json({ success: true })
    }

    // General profile update
    const { isAvailable, currentLat, currentLng, address } = body
    const updateData: Record<string, unknown> = {}

    if (isAvailable !== undefined) updateData.isAvailable = isAvailable
    if (currentLat !== undefined) updateData.currentLat = currentLat
    if (currentLng !== undefined) updateData.currentLng = currentLng
    if (address !== undefined) updateData.address = address

    const updatedTech = await prisma.technician.update({
      where: { id: params.id },
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

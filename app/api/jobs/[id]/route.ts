import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await getAuthUser(request)

    if (!authUser) {
      return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
    }

    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        customer: {
          select: { id: true, name: true, phone: true },
        },
        technician: {
          include: {
            user: {
              select: { id: true, name: true, phone: true },
            },
          },
        },
      },
    })

    if (!job) {
      return NextResponse.json({ error: 'עבודה לא נמצאה' }, { status: 404 })
    }

    // Verify access: customer can only see their own job, technician can see jobs assigned to them
    if (authUser.role === 'customer' && job.customerId !== authUser.userId) {
      return NextResponse.json({ error: 'גישה לא מורשית' }, { status: 403 })
    }

    const responseJob = {
      ...job,
      technician: job.technician
        ? {
            ...job.technician,
            specialty: JSON.parse(job.technician.specialty || '[]'),
          }
        : null,
    }

    return NextResponse.json({ job: responseJob })
  } catch (error) {
    console.error('Get job error:', error)
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await getAuthUser(request)

    if (!authUser) {
      return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
    }

    const body = await request.json()
    const { status, finalPrice } = body

    const existingJob = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        technician: true,
      },
    })

    if (!existingJob) {
      return NextResponse.json({ error: 'עבודה לא נמצאה' }, { status: 404 })
    }

    // Authorization checks
    if (authUser.role === 'customer' && existingJob.customerId !== authUser.userId) {
      return NextResponse.json({ error: 'גישה לא מורשית' }, { status: 403 })
    }

    if (authUser.role === 'technician') {
      const techProfile = await prisma.technician.findUnique({
        where: { userId: authUser.userId },
      })
      if (!techProfile || existingJob.technicianId !== techProfile.id) {
        return NextResponse.json({ error: 'גישה לא מורשית' }, { status: 403 })
      }
    }

    const updateData: Record<string, unknown> = {}

    if (status) {
      updateData.status = status
      if (status === 'completed') {
        updateData.completedAt = new Date()

        // Update technician stats
        if (existingJob.technicianId) {
          await prisma.technician.update({
            where: { id: existingJob.technicianId },
            data: {
              totalJobs: { increment: 1 },
              isAvailable: true,
            },
          })
        }
      }
    }

    if (finalPrice !== undefined) {
      updateData.finalPrice = finalPrice
    }

    const updatedJob = await prisma.job.update({
      where: { id: params.id },
      data: updateData,
      include: {
        customer: {
          select: { id: true, name: true, phone: true },
        },
        technician: {
          include: {
            user: {
              select: { id: true, name: true, phone: true },
            },
          },
        },
      },
    })

    const responseJob = {
      ...updatedJob,
      technician: updatedJob.technician
        ? {
            ...updatedJob.technician,
            specialty: JSON.parse(updatedJob.technician.specialty || '[]'),
          }
        : null,
    }

    return NextResponse.json({ job: responseJob })
  } catch (error) {
    console.error('Update job error:', error)
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 })
  }
}

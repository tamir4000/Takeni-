import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)

    if (!authUser) {
      return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
    }

    if (authUser.role !== 'customer') {
      return NextResponse.json({ error: 'גישה לא מורשית' }, { status: 403 })
    }

    const body = await request.json()
    const {
      serviceType,
      description,
      urgency = 'urgent',
      customerAddress,
      customerLat,
      customerLng,
      estimatedPrice,
      estimatedTime,
    } = body

    if (!serviceType || !description || !customerAddress) {
      return NextResponse.json(
        { error: 'סוג שירות, תיאור וכתובת הם שדות חובה' },
        { status: 400 }
      )
    }

    // Create the job
    const job = await prisma.job.create({
      data: {
        customerId: authUser.userId,
        serviceType,
        description,
        urgency,
        customerAddress,
        customerLat: customerLat ?? null,
        customerLng: customerLng ?? null,
        estimatedPrice: estimatedPrice ?? '₪250-400',
        estimatedTime: estimatedTime ?? '15-25 דק\'',
        status: 'searching',
      },
    })

    // Try to find an available technician with matching specialty
    const availableTechnicians = await prisma.technician.findMany({
      where: {
        isAvailable: true,
      },
    })

    // Filter technicians by specialty
    const matchingTechnicians = availableTechnicians.filter((tech) => {
      try {
        const specialties: string[] = JSON.parse(tech.specialty || '[]')
        return specialties.includes(serviceType) || serviceType === 'other'
      } catch {
        return false
      }
    })

    // If no exact match, try any available technician (for "other" or fallback)
    const candidateTechnicians =
      matchingTechnicians.length > 0
        ? matchingTechnicians
        : availableTechnicians

    if (candidateTechnicians.length > 0) {
      const assignedTechnician = candidateTechnicians[0]

      // Update job status to matched
      const updatedJob = await prisma.job.update({
        where: { id: job.id },
        data: {
          technicianId: assignedTechnician.id,
          status: 'matched',
        },
        include: {
          technician: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                },
              },
            },
          },
        },
      })

      return NextResponse.json(
        {
          job: {
            ...updatedJob,
            technician: updatedJob.technician
              ? {
                  ...updatedJob.technician,
                  specialty: JSON.parse(
                    updatedJob.technician.specialty || '[]'
                  ),
                }
              : null,
          },
        },
        { status: 201 }
      )
    }

    return NextResponse.json({ job }, { status: 201 })
  } catch (error) {
    console.error('Create job error:', error)
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)

    if (!authUser) {
      return NextResponse.json({ error: 'לא מחובר' }, { status: 401 })
    }

    let jobs

    if (authUser.role === 'customer') {
      jobs = await prisma.job.findMany({
        where: { customerId: authUser.userId },
        orderBy: { createdAt: 'desc' },
        include: {
          technician: {
            include: {
              user: {
                select: { id: true, name: true, phone: true },
              },
            },
          },
        },
      })
    } else if (authUser.role === 'technician') {
      // Get technician profile
      const techProfile = await prisma.technician.findUnique({
        where: { userId: authUser.userId },
      })

      if (!techProfile) {
        return NextResponse.json({ jobs: [] })
      }

      jobs = await prisma.job.findMany({
        where: {
          OR: [
            { technicianId: techProfile.id },
            { status: 'searching' },
          ],
        },
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: { id: true, name: true, phone: true },
          },
        },
      })
    } else {
      return NextResponse.json({ error: 'גישה לא מורשית' }, { status: 403 })
    }

    const parsedJobs = jobs.map((job) => ({
      ...job,
      technician:
        'technician' in job && job.technician
          ? {
              ...job.technician,
              specialty: JSON.parse(
                (job.technician as { specialty: string }).specialty || '[]'
              ),
            }
          : undefined,
    }))

    return NextResponse.json({ jobs: parsedJobs })
  } catch (error) {
    console.error('Get jobs error:', error)
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 })
  }
}

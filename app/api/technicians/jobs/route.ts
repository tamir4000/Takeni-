import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { prisma } from '@/lib/db'

// Get pending jobs for a technician (jobs that match their specialty and are searching)
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser(request)

    if (!authUser || authUser.role !== 'technician') {
      return NextResponse.json({ error: 'לא מורשה' }, { status: 401 })
    }

    const tech = await prisma.technician.findUnique({
      where: { userId: authUser.userId },
    })

    if (!tech || !tech.isAvailable) {
      return NextResponse.json({ jobs: [] })
    }

    const specialties: string[] = JSON.parse(tech.specialty || '[]')

    // Get all searching jobs
    const allSearchingJobs = await prisma.job.findMany({
      where: { status: 'searching' },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        customer: {
          select: { id: true, name: true, phone: true },
        },
      },
    })

    // Filter to matching specialty (or all if tech has 'other' specialty)
    const matchingJobs = allSearchingJobs.filter(job => {
      if (specialties.includes('other') || specialties.length === 0) return true
      return specialties.includes(job.serviceType) || job.serviceType === 'other'
    })

    return NextResponse.json({ jobs: matchingJobs })
  } catch (error) {
    console.error('Get technician jobs error:', error)
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const [
      customers,
      approvedTechnicians,
      completedJobs,
      avgRatingData,
      activeJobs,
      recentCompletions,
      technicians,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'customer' } }),
      prisma.technician.count({ where: { status: 'approved' } }),
      prisma.job.count({ where: { status: 'completed' } }),
      prisma.technician.aggregate({ _avg: { rating: true } }),
      prisma.job.findMany({
        where: { status: { in: ['searching', 'matched', 'onway', 'arrived'] } },
        include: {
          customer: true,
          technician: { include: { user: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.job.findMany({
        where: { status: 'completed' },
        include: {
          customer: true,
          technician: { include: { user: true } },
        },
        orderBy: { completedAt: 'desc' },
        take: 5,
      }),
      prisma.technician.findMany({
        where: { status: 'approved' },
        include: { user: true },
        orderBy: { rating: 'desc' },
      }),
    ])

    const avgRating =
      avgRatingData._avg.rating != null
        ? Math.round(avgRatingData._avg.rating * 10) / 10
        : 5.0

    return NextResponse.json({
      customers,
      approvedTechnicians,
      completedJobs,
      avgRating,
      activeJobs,
      recentCompletions,
      technicians,
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 })
  }
}

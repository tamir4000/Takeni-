import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const [technicianCount, technicians, completedJobs] = await Promise.all([
      prisma.technician.count({ where: { status: 'approved' } }),
      prisma.technician.findMany({ select: { rating: true } }),
      prisma.job.count({ where: { status: 'completed' } }),
    ])

    const avgRating =
      technicians.length > 0
        ? technicians.reduce((sum, t) => sum + t.rating, 0) / technicians.length
        : 5.0

    return NextResponse.json({
      technicianCount,
      avgRating: Math.round(avgRating * 10) / 10,
      completedJobs,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 })
  }
}

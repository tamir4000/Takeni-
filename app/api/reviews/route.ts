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
      return NextResponse.json({ error: 'גישה מורשית ללקוחות בלבד' }, { status: 403 })
    }

    const body = await request.json()
    const { jobId, rating, comment } = body

    if (!jobId || !rating) {
      return NextResponse.json({ error: 'jobId ודירוג הם שדות חובה' }, { status: 400 })
    }

    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'הדירוג חייב להיות בין 1 ל-5' }, { status: 400 })
    }

    // Validate job exists and belongs to customer
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { review: true },
    })

    if (!job) {
      return NextResponse.json({ error: 'עבודה לא נמצאה' }, { status: 404 })
    }

    if (job.customerId !== authUser.userId) {
      return NextResponse.json({ error: 'גישה לא מורשית' }, { status: 403 })
    }

    if (job.status !== 'completed') {
      return NextResponse.json({ error: 'ניתן לדרג רק עבודות שהושלמו' }, { status: 400 })
    }

    if (job.review) {
      return NextResponse.json({ error: 'כבר קיים דירוג לעבודה זו' }, { status: 409 })
    }

    if (!job.technicianId) {
      return NextResponse.json({ error: 'אין טכנאי משויך לעבודה' }, { status: 400 })
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        jobId,
        customerId: authUser.userId,
        technicianId: job.technicianId,
        rating: Math.round(rating),
        comment: comment?.trim() || null,
      },
    })

    // Recalculate technician average rating
    const allReviews = await prisma.review.findMany({
      where: { technicianId: job.technicianId },
      select: { rating: true },
    })

    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

    await prisma.technician.update({
      where: { id: job.technicianId },
      data: { rating: Math.round(avgRating * 10) / 10 },
    })

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    console.error('Create review error:', error)
    return NextResponse.json({ error: 'שגיאה בשרת' }, { status: 500 })
  }
}

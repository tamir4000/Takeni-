import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const technicians = [
  {
    name: 'יוסי כהן',
    phone: '0501234567',
    email: 'yossi@example.com',
    specialty: ['electricity'],
    rating: 4.9,
    totalJobs: 142,
    address: 'דיזנגוף 50, תל אביב',
    bio: 'חשמלאי מוסמך עם 10 שנות ניסיון. מתמחה בתיקוני חירום ומערכות חשמל.',
    lat: 32.0823,
    lng: 34.7741,
  },
  {
    name: 'משה לוי',
    phone: '0522345678',
    email: 'moshe@example.com',
    specialty: ['plumbing'],
    rating: 4.8,
    totalJobs: 98,
    address: 'רוטשילד 22, תל אביב',
    bio: 'אינסטלטור מוסמך. מטפל בכל בעיות האינסטלציה במהירות ומקצועיות.',
    lat: 32.0654,
    lng: 34.7697,
  },
  {
    name: 'דוד אברהם',
    phone: '0533456789',
    email: 'david@example.com',
    specialty: ['locksmith'],
    rating: 4.7,
    totalJobs: 205,
    address: 'בן יהודה 89, תל אביב',
    bio: 'מנעולן מוסמך ומאובטח. זמין 24/7 לפתיחת דלתות ותיקון מנעולים.',
    lat: 32.0787,
    lng: 34.7636,
  },
  {
    name: 'אבי שמש',
    phone: '0544567890',
    email: 'avi@example.com',
    specialty: ['ac', 'electricity'],
    rating: 4.9,
    totalJobs: 178,
    address: 'ארלוזורוב 35, תל אביב',
    bio: 'טכנאי מזגנים וחשמל. מתמחה בהתקנה, תיקון ותחזוקה של מזגנים מכל הסוגים.',
    lat: 32.0920,
    lng: 34.7812,
  },
  {
    name: 'רוני פרץ',
    phone: '0555678901',
    email: 'roni@example.com',
    specialty: ['electricity', 'plumbing', 'other'],
    rating: 4.6,
    totalJobs: 67,
    address: 'אלנבי 120, תל אביב',
    bio: 'טכנאי רב תחומי. מטפל בחשמל, אינסטלציה ועוד. מהיר, אמין ומקצועי.',
    lat: 32.0631,
    lng: 34.7726,
  },
]

async function main() {
  console.log('מתחיל זריעת נתונים...')

  // Clean up existing data
  await prisma.job.deleteMany()
  await prisma.technician.deleteMany()
  await prisma.user.deleteMany()

  // Create a demo customer
  const customerPassword = await bcrypt.hash('demo123', 10)
  const customer = await prisma.user.create({
    data: {
      name: 'ישראל ישראלי',
      phone: '0500000001',
      email: 'customer@demo.com',
      password: customerPassword,
      role: 'customer',
    },
  })
  console.log(`נוצר לקוח לדוגמה: ${customer.name}`)

  // Create technicians
  const techPassword = await bcrypt.hash('demo123', 10)
  for (const tech of technicians) {
    const user = await prisma.user.create({
      data: {
        name: tech.name,
        phone: tech.phone,
        email: tech.email,
        password: techPassword,
        role: 'technician',
      },
    })

    await prisma.technician.create({
      data: {
        userId: user.id,
        specialty: JSON.stringify(tech.specialty),
        rating: tech.rating,
        totalJobs: tech.totalJobs,
        isAvailable: true,
        currentLat: tech.lat,
        currentLng: tech.lng,
        address: tech.address,
        bio: tech.bio,
      },
    })

    console.log(`נוצר טכנאי: ${tech.name} (${tech.specialty.join(', ')})`)
  }

  console.log('✓ זריעת הנתונים הושלמה בהצלחה!')
  console.log('')
  console.log('פרטי כניסה לדוגמה:')
  console.log('לקוח: 0500000001 / demo123')
  console.log('טכנאי: 0501234567 / demo123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

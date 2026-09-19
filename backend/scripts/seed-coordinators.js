/**
 * Seeds the student-coordinator directory (idempotent — upserts by email).
 * Run:  npm run seed:coordinators
 *
 * ⚠️ Replace the placeholder WhatsApp numbers/emails with real ones
 * before production. Categories must match SUPPORT_CATEGORIES in
 * src/support/support.dto.ts exactly.
 */
require('dotenv/config')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const coordinators = [
  {
    name: 'Aditya Sharma',
    email: 'aditya.coordinator@acropolis.in',
    whatsapp: '919999900001',
    categories: ['Travel Assistance & Hostel Booking'],
    webhookUrl: '',
  },
  {
    name: 'Neha Verma',
    email: 'neha.coordinator@acropolis.in',
    whatsapp: '919999900002',
    categories: ['Problem Statement Clarification'],
    webhookUrl: '',
  },
  {
    name: 'Rohan Patidar',
    email: 'rohan.coordinator@acropolis.in',
    whatsapp: '919999900003',
    categories: ['Sponsorship & Bounty Inquiry'],
    webhookUrl: '',
  },
  {
    name: 'Sneha Jain',
    email: 'sneha.coordinator@acropolis.in',
    whatsapp: '919999900004',
    categories: ['Other / General Support'],
    webhookUrl: '',
  },
  {
    // ⚠️ TESTING-only catch-all: 'General' category form submissions ko
    // pakadta hai. Production se pehle isko hata dena ya email badal dena.
    name: 'Test Desk (Dev)',
    email: 'luckyudiya@gmail.com',
    whatsapp: '910000000000',
    categories: ['General'],
    webhookUrl: '',
  },
]

async function run() {
  console.log('[seed] connecting via Prisma…')
  for (const c of coordinators) {
    await prisma.coordinator.upsert({
      where: { email: c.email },
      update: { ...c },
      create: { ...c },
    })
    console.log(`[seed] upserted ${c.name} (${c.categories.join(', ')})`)
  }
  await prisma.$disconnect()
  console.log('[seed] done')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})

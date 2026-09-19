/**
 * Seeds the student-coordinator directory (idempotent — upserts by email).
 * Run:  npm run seed:coordinators
 *
 * ⚠️ Replace the placeholder WhatsApp numbers/emails with real ones
 * before production. Categories must match SUPPORT_CATEGORIES in
 * src/support/support.dto.ts exactly.
 */
require('dotenv/config')
const mongoose = require('mongoose')

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

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    whatsapp: { type: String, required: true, trim: true },
    categories: { type: [String], required: true, default: [] },
    webhookUrl: { type: String, trim: true, default: '' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aimanthan'
  await mongoose.connect(uri)
  console.log('[seed] connected')

  const Coordinator = mongoose.models.Coordinator || mongoose.model('Coordinator', schema)
  for (const c of coordinators) {
    await Coordinator.updateOne({ email: c.email }, { $set: c }, { upsert: true })
    console.log(`[seed] upserted ${c.name} (${c.categories.join(', ')})`)
  }

  await mongoose.disconnect()
  console.log('[seed] done')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})

import mongoose from 'mongoose'

const inquirySchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true },
    name: { type: String, default: '', trim: true },
    category: { type: String, required: true, default: 'General' },
    message: { type: String, required: true, trim: true },
    /** 'participant' = support query, 'feedback' = experience feedback */
    kind: { type: String, enum: ['participant', 'feedback'], default: 'participant' },
    /** 1 (worst) … 5 (best) — feedback only */
    rating: { type: Number, min: 1, max: 5, default: null },
    /** Auto-routing result */
    assignedTo: {
      coordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Coordinator', default: null },
      name: { type: String, default: null },
      email: { type: String, default: null },
      whatsapp: { type: String, default: null },
      notifiedVia: { type: String, default: null }, // webhook | email | logged
    },
    /** Admin workflow */
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved'],
      default: 'open',
      index: true,
    },
    resolutionNote: { type: String, default: '' },
  },
  { timestamps: true },
)

export const Inquiry =
  mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema)

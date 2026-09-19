import mongoose from 'mongoose'

/**
 * Category-wise student coordinators. Every support inquiry is
 * auto-routed (by `categories`) to exactly one coordinator, who
 * receives it on WhatsApp/email + shows up in the admin queue.
 */
const coordinatorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    /** WhatsApp number in international format, no +. */
    whatsapp: { type: String, required: true, trim: true },
    /** Categories this coordinator handles (must match SUPPORT_CATEGORIES). */
    categories: { type: [String], required: true, default: [] },
    /** Optional incoming-webhook URL (e.g. a WhatsApp/Slack bridge) —
        when set, new assignments are POSTed here automatically. */
    webhookUrl: { type: String, trim: true, default: '' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export const Coordinator =
  mongoose.models.Coordinator || mongoose.model('Coordinator', coordinatorSchema)

'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import Icon from '../ui/Icon'
import { phoneDirectory } from '../../data/venue'

/**
 * On-ground help — Phone Directory modal.
 * Opens from the "Phone directory" button in the contact section via the
 * 'open-phone-directory-modal' window event (same contract as the other modals).
 */
export default function PhoneDirectoryModal({ open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-lenis-prevent
        className="glass-strong max-h-[85vh] max-w-2xl gap-0 overflow-y-auto overscroll-contain rounded-2xl p-6 shadow-[0_24px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(0,168,255,0.15)] data-[state=open]:animate-fade-up"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Phone Directory</DialogTitle>
          <DialogDescription>
            On-ground coordinator contacts for the AI Manthan 2K26 arena.
          </DialogDescription>
        </DialogHeader>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan">
              <Icon name="call" className="text-[18px]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-[0.14em] uppercase">
                {phoneDirectory.heading}
              </h3>
              <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                {phoneDirectory.eyebrow}
              </p>
            </div>
          </div>
          <button
            className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
            onClick={onClose}
            aria-label="Close phone directory modal"
          >
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>

        {/* Directory groups — 2-col grid like the reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">
          {phoneDirectory.groups.map((group) => (
            <div key={group.title}>
              <div className="text-[10px] font-mono font-medium tracking-[0.18em] text-zinc-500 uppercase mb-2.5">
                {group.title}
              </div>
              <div className="space-y-2">
                {group.members.map((member) => (
                  <a
                    key={member.phone}
                    href={`tel:${member.phone.replace(/\s/g, '')}`}
                    className="block rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 transition-all duration-300 hover:border-brand-cyan/50 hover:bg-white/[0.06]"
                  >
                    <div className="text-xs sm:text-sm font-semibold text-white">
                      {member.name}
                    </div>
                    <div className="text-[11px] sm:text-xs font-mono text-zinc-400 mt-0.5">
                      {member.phone}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

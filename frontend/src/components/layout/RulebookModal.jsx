'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import Icon from '../ui/Icon'
import { rulebook, site } from '../../data/site'

/**
 * Official Rulebook modal — opens from the footer "Rulebook" button.
 * Any component can trigger it via the 'open-rulebook-modal' window event
 * (same contract as the support modal).
 */
export default function RulebookModal({ open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-lenis-prevent
        className="glass-strong max-h-[85vh] max-w-2xl gap-0 overflow-y-auto overscroll-contain rounded-2xl p-6 shadow-[0_24px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(0,168,255,0.15)] data-[state=open]:animate-fade-up"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Official Rulebook</DialogTitle>
          <DialogDescription>
            Rules, rounds, judging rubric and code of conduct for AI Manthan 2K26.
          </DialogDescription>
        </DialogHeader>

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan">
              <Icon name="menu_book" className="text-[18px]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-[0.14em] uppercase">
                Official Rulebook
              </h3>
              <p className="text-[11px] font-mono text-zinc-400">{rulebook.version}</p>
            </div>
          </div>
          <button
            className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
            onClick={onClose}
            aria-label="Close rulebook modal"
          >
            <Icon name="close" className="text-[18px]" />
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {rulebook.sections.map((section, idx) => (
            <div key={section.title} className="glass rounded-xl p-4">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-7 h-7 rounded-md bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-brand-cyan">
                  <Icon name={section.icon} className="text-[15px]" />
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">
                  <span className="font-mono text-brand-cyan mr-2">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  {section.title}
                </h4>
              </div>
              <ul className="space-y-2">
                {section.rules.map((rule) => (
                  <li
                    key={rule}
                    className="flex items-start gap-2 text-[11px] sm:text-xs text-zinc-400 leading-relaxed"
                  >
                    <span className="mt-[7px] w-1 h-1 rounded-full bg-brand-cyan/70 shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] font-mono text-zinc-500 text-center sm:text-left">
            The jury&apos;s decision is final. Full rubric also drops Oct 1 with Round 2 guidelines.
          </p>
          <a
            className="inline-flex items-center gap-1.5 text-[11px] text-brand-cyan hover:text-white font-medium transition-colors shrink-0"
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${site.email}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="mail" className="text-[14px]" />
            Questions? Email the desk
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}

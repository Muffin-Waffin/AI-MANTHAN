'use client'

import Icon from '../ui/Icon'
import Section from '../ui/Section'
import SectionBackdrop from '../ui/SectionBackdrop'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'
import { venue, faq, phoneDirectory } from '../../data/venue'
import { site } from '../../data/site'
import Link from 'next/link'

/* ── Left column cards (ref: Manipal "GET IN TOUCH") ───────────────── */

function FindUsCard() {
  return (
    <div className="glass rounded-2xl p-5 sm:p-6 relative overflow-hidden">
      {/* corner icon */}
      <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-zinc-300 absolute top-5 right-5">
        <Icon name="location_on" className="text-[18px]" />
      </div>

      <div className="text-[10px] sm:text-[11px] font-mono font-medium tracking-[0.22em] text-zinc-500 uppercase">
        Where to find us
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1.5 font-mono uppercase">
        {venue.heading}
      </h3>

      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mt-4">
        {venue.address}
      </p>

      {/* Embedded map preview — visible directly on the page, responsive
          at every breakpoint, no redirect required. Tapping it opens the
          full external navigation (progressive enhancement over the old
          "button that leads away" pattern). */}
      <div className="mt-5 overflow-hidden rounded-xl border border-white/[0.1] relative">
        <iframe
          src={venue.mapEmbedSrc}
          title="Map preview — Acropolis Institute of Technology and Research, Mangliya Sadak, Indore"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="block w-full h-[220px] sm:h-[260px] lg:h-[240px] border-0"
        />
      </div>

      <a
        href={venue.mapsHref}
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-4 flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-xs sm:text-sm font-semibold text-white transition-all duration-300 hover:border-brand-cyan/50 hover:bg-white/[0.06]"
      >
        Open location in Maps
        <Icon
          name="north_east"
          className="text-[15px] text-zinc-400 transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </a>
    </div>
  )
}

function TalkToUsCard() {
  const openDirectory = () => window.dispatchEvent(new Event('open-phone-directory-modal'))

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 relative overflow-hidden">
      <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-zinc-300 absolute top-5 right-5">
        <Icon name="mail" className="text-[18px]" />
      </div>

      <div className="text-[10px] sm:text-[11px] font-mono font-medium tracking-[0.22em] text-zinc-500 uppercase">
        Questions?
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1.5 font-mono uppercase">
        Talk to Us
      </h3>

      <div className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 font-mono text-xs sm:text-sm text-zinc-300">
        {site.email}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2.5">
        <Link
          href="/support"
          className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-zinc-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-8px_rgba(255,255,255,0.5)]"
        >
          <Icon name="mail" className="text-[15px]" />
          Email us
        </Link>
        <button
          onClick={openDirectory}
          className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.04] px-4 py-2.5 text-xs sm:text-sm font-semibold text-zinc-200 transition-all duration-300 hover:border-brand-cyan/50 hover:text-white hover:bg-white/[0.07]"
        >
          <Icon name="call" className="text-[15px]" />
          Phone directory
        </button>
      </div>
    </div>
  )
}

/* ── Section ─────────────────────────────────────────────────────────── */

export default function VenueFaq() {
  return (
    <Section id="venue">
      <SectionBackdrop variant="topo" />

      {/* GET IN TOUCH display heading — white + neon blue accent word */}
      <h2 className="font-mono text-4xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight leading-[1.05] mb-10 sm:mb-14">
        Get in{' '}
        <span className="text-sky-500 [text-shadow:0_0_28px_rgba(56,189,248,0.55)]">Touch</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10">
        {/* Left rail: find-us + talk-to-us cards */}
        <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6">
          <FindUsCard />
          <TalkToUsCard />
        </div>

        {/* Right: numbered FAQ panel */}
        <div className="lg:col-span-7">
          <div className="glass rounded-2xl p-5 sm:p-7 md:p-8">
            <h3 className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase">
              {faq.heading}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1.5">{faq.sub}</p>

            <Accordion type="single" collapsible className="mt-5 sm:mt-6">
              {faq.items.map((item, idx) => (
                <AccordionItem
                  key={item.q}
                  value={item.q}
                  className="border-b border-white/[0.07] last:border-b-0"
                >
                  <AccordionTrigger className="group py-4 sm:py-5 text-sm sm:text-base font-semibold text-white hover:no-underline hover:text-white gap-3 sm:gap-5 [&>svg]:hidden">
                    <span className="flex items-baseline gap-3 sm:gap-5 min-w-0">
                      <span className="font-mono text-[10px] sm:text-xs text-brand-cyan font-medium shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0">{item.q}</span>
                    </span>
                    {/* circled chevron like the reference — rotates when open */}
                    <span className="w-8 h-8 rounded-full border border-white/[0.12] bg-white/[0.03] flex items-center justify-center shrink-0 transition-all duration-300 group-data-[state=open]:border-brand-cyan/60 group-data-[state=open]:shadow-[0_0_14px_-2px_rgba(0,168,255,0.55)]">
                      <Icon
                        name="expand_more"
                        className="text-[16px] text-zinc-400 transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-white"
                      />
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-white/[0.05] pt-3 sm:pt-4">
                    <span className="block pl-7 sm:pl-9">{item.a}</span>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </Section>
  )
}

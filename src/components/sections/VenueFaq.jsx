import Icon from '../ui/Icon'
import Section from '../ui/Section'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'
import { venue, faq } from '../../data/venue'

function VenueCard() {
  return (
    <div className="lg:col-span-5 flex flex-col">
      <span className="text-xs font-mono font-medium tracking-wider text-brand-violet uppercase">
        {venue.eyebrow}
      </span>
      <h2 className="text-3xl font-bold tracking-tight text-white mt-2">{venue.heading}</h2>
      <p className="text-zinc-400 text-sm mt-3 leading-relaxed">{venue.body}</p>

      <div className="glass-strong mt-6 rounded-2xl overflow-hidden shadow-md">
        <div
          className="h-44 bg-cover bg-center relative"
          style={{ backgroundImage: `url('${venue.mapImg}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-transparent"></div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
            <span className="font-mono text-zinc-300 bg-obsidian-900/90 px-2 py-1 rounded border border-white/10">
              {venue.coordinates}
            </span>
            <a
              className="text-white hover:underline flex items-center gap-1 font-medium bg-black/60 px-2 py-1 rounded"
              href={venue.mapsHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Maps
              <Icon name="open_in_new" className="text-[14px]" />
            </a>
          </div>
        </div>
        <div className="p-4 space-y-2 text-xs">
          <div className="text-zinc-300 font-medium">{venue.address}</div>
          {venue.access.map((line) => (
            <div className="text-zinc-400 font-mono" key={line}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function VenueFaq() {
  return (
    <Section id="venue">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <VenueCard />

        <div className="lg:col-span-7 flex flex-col">
          <span className="text-xs font-mono font-medium tracking-wider text-brand-violet uppercase">
            {faq.eyebrow}
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white mt-2 mb-6">{faq.heading}</h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faq.items.map((item) => (
              <AccordionItem
                key={item.q}
                value={item.q}
                className="glass rounded-xl border border-white/[0.08] px-5 transition-all duration-300 hover:border-white/20 data-[state=open]:border-brand-violet/40 data-[state=open]:shadow-[0_0_24px_-6px_rgba(124,58,237,0.25)]"
              >
                <AccordionTrigger className="py-4 text-sm font-semibold text-white hover:no-underline hover:text-brand-violet [&>svg]:text-zinc-400">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-white/[0.04] pt-3">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </Section>
  )
}

import AppShell from '@/components/layout/AppShell'
import EventJsonLd from '@/components/seo/EventJsonLd'

import Hero from '@/components/sections/Hero'
import Story from '@/components/sections/Story'
import Tracks from '@/components/sections/Tracks'
import Timeline from '@/components/sections/Timeline'
import Gallery from '@/components/sections/Gallery'
import Prizes, { FinalCTA } from '@/components/sections/Prizes'
import Mentors from '@/components/sections/Mentors'
import Team from '@/components/sections/Team'
import Partners from '@/components/sections/Partners'
import VenueFaq from '@/components/sections/VenueFaq'

export default function Home() {
  return (
    <AppShell>
      <EventJsonLd />
      <Hero />
      <Story />
      <Tracks />
      <Timeline />
      <Gallery />
      <Prizes />
      <Mentors />
      <Team />
      <Partners />
      <VenueFaq />
      <FinalCTA />
    </AppShell>
  )
}

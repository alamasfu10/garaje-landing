import { getEventContent } from '@/lib/storyblok'
import TopBar from '@/components/TopBar'
import HeroSection from '@/components/HeroSection'
import FormSection from '@/components/FormSection'
import SiteFooter from '@/components/SiteFooter'

export const revalidate = false   // la caché la gestiona el webhook de Storyblok

export default async function HomePage() {
  const event = await getEventContent()

  return (
    <>
      <TopBar />
      <main>
        <HeroSection event={event} />
        <FormSection />
      </main>
      <SiteFooter />
    </>
  )
}

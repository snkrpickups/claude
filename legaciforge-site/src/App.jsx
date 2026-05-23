import Hero from './sections/Hero'
import Lineup from './sections/Lineup'
import DetailPanels from './sections/DetailPanels'
import Calculator from './sections/Calculator'
import WhyItMatters from './sections/WhyItMatters'
import WhoWeAre from './sections/WhoWeAre'
import ProgramGrid from './sections/ProgramGrid'
import Waitlist from './sections/Waitlist'
import Footer from './sections/Footer'
import Marquee from './components/Marquee'

export default function App() {
  return (
    <main className="relative w-full">
      <Calculator />
      <Hero />
      <Lineup />
      <Marquee items={['forging leaders', 'building legacies', 'veni · vidi · novi']} tone="ember" />
      <DetailPanels />
      <WhyItMatters />
      <Marquee
        items={['legacy is not inherited', 'it’s forged', 'as iron sharpens iron']}
        baseVelocity={3.2}
        tone="bone"
      />
      <WhoWeAre />
      <ProgramGrid />
      <Waitlist />
      <Footer />
    </main>
  )
}

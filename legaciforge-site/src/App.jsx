import Hero from './sections/Hero'
import Lineup from './sections/Lineup'
import DetailPanels from './sections/DetailPanels'
import WhyItMatters from './sections/WhyItMatters'
import WhoWeAre from './sections/WhoWeAre'
import ProgramGrid from './sections/ProgramGrid'
import Footer from './sections/Footer'

export default function App() {
  return (
    <main className="relative w-full">
      <Hero />
      <Lineup />
      <DetailPanels />
      <WhyItMatters />
      <WhoWeAre />
      <ProgramGrid />
      <Footer />
    </main>
  )
}

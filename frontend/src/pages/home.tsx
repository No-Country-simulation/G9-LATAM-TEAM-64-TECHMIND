import { Analyzer } from "@/features/analyzer/analyzer"
import { AnalyzerHero } from "@/features/analyzer/analyzer-hero"
import { HowItWorks } from "@/features/analyzer/how-it-works"

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <AnalyzerHero />
      <HowItWorks />
      <Analyzer />
    </div>
  )
}
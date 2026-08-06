import { DemoNotice } from "@/components/common"
import { API_CONFIGURED } from "@/config"
import { Analyzer } from "@/features/analyzer/analyzer"
import { AnalyzerHero } from "@/features/analyzer/analyzer-hero"

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
      <AnalyzerHero />
      {!API_CONFIGURED && <DemoNotice />}
      <Analyzer />
    </div>
  )
}

import { DemoNotice } from "@/components/common"
import { API_CONFIGURED } from "@/config"
import { Library } from "@/features/library/library"

export default function BibliotecaPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
      {!API_CONFIGURED && <DemoNotice />}
      <Library />
    </div>
  )
}

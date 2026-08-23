import { GithubIcon, LinkedinIcon, OrbitLabLogo } from "@/components/common/brand-icons"
import { useLanguage } from "@/language-context"
import { ORBIT_LAB_TEAM, type TeamMember } from "@/team"

export function SiteFooter() {
  const { t } = useLanguage()

  return (
    <footer className="mt-16 border-t border-border/80 bg-card/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          {/* Marca */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <OrbitLabLogo className="size-7 text-primary" aria-hidden="true" />
              <div className="flex flex-col leading-none">
                <span className="text-sm font-semibold tracking-tight">{t("brand.name")}</span>
                <span className="text-[11px] text-muted-foreground">{t("brand.by")}</span>
              </div>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">{t("footer.note")}</p>
          </div>

          {/* Equipo */}
          <section className="flex flex-col gap-3">
            <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
              {t("footer.equipo")}
            </h2>

            <ul className="grid grid-cols-2">
              <div className="flex flex-col gap-2.5 border-r pr-4">
                {ORBIT_LAB_TEAM.filter((_, i) => i % 2 === 0).map((member) => (
                  <MemberRow key={member.github} member={member} />
                ))}
              </div>

              <div className="flex flex-col gap-2.5 pl-4">
                {ORBIT_LAB_TEAM.filter((_, i) => i % 2 !== 0).map((member) => (
                  <MemberRow key={member.github} member={member} />
                ))}
              </div>
            </ul>
          </section>
        </div>

        <div className="flex flex-col gap-2 border-t border-border/60 pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  )
}

function MemberRow({ member }: { member: TeamMember }) {
  const { t } = useLanguage()

  return (
    <li className="flex items-center gap-3">
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-sm font-medium text-foreground">{member.nombre}</span>
      </div>
      <div className="ml-auto flex items-center gap-1">
        <SocialLink
          href={member.linkedin}
          label={`${t("footer.linkedinDe")} ${member.nombre}`}
          icon={<LinkedinIcon className="size-4" aria-hidden="true" />}
        />
        <SocialLink
          href={member.github}
          label={`${t("footer.githubDe")} ${member.nombre}`}
          icon={<GithubIcon className="size-4" aria-hidden="true" />}
        />
      </div>
    </li>
  )
}

function SocialLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      title={label}
      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {icon}
    </a>
  )
}

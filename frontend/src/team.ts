/** Integrantes de Orbit Lab, tal y como aparecen en el pie de la aplicación.
 *
 *  El orden de este array es el orden en que se muestran. Para añadir a alguien,
 *  basta con sumar una entrada: el footer se genera a partir de aquí. */

export type TeamMember = {
  nombre: string
  /** Área principal. Se muestra junto al nombre. */
  linkedin: string
  github: string
}

export const ORBIT_LAB_TEAM: TeamMember[] = [
  {
    nombre: "Verónica Polaya",
    linkedin: "https://linkedin.com/in/veronica",
    github: "https://github.com/Veronicapolaya",
  },
  {
    nombre: "Nahir Icare",
    linkedin: "https://linkedin.com/in/nahiricare",
    github: "https://github.com/nahiricare",
  },
  {
    nombre: "Felix Aguilar",
    linkedin: "https://linkedin.com/in/felix-robert-aguilar-barrera",
    github: "https://github.com/RobertRedBear",
  },
  {
    nombre: "Mauricio Martinez",
    linkedin: "https://www.linkedin.com/in/mauricio-martinez-53125326b",
    github: "https://github.com/mauriciomartinez0",
  },
]

/** Repositorio del proyecto. */
export const REPO_URL = "https://github.com/No-Country-simulation/G9-LATAM-TEAM-64-TECHMIND"

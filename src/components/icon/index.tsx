import { FC, SVGProps } from "react"
import { ReactComponent as Badge } from "./assets/badge.svg"
import { ReactComponent as Lock } from "./assets/lock.svg"
import { ReactComponent as Doc } from "./assets/doc.svg"
import { ReactComponent as Arrow } from "./assets/arrow.svg"
import { ReactComponent as Home } from "./assets/home.svg"
import { ReactComponent as Cart } from "./assets/cart.svg"
import { ReactComponent as Clip } from "./assets/clip.svg"
import { ReactComponent as Complete } from "./assets/complete-application.svg"
import { ReactComponent as LogoSidebar } from "./assets/logo-sidebar.svg"
import { ReactComponent as FullLogo } from "./assets/full-logo.svg"


export type IconTypes = "badge" | "lock" | string

const icons: {
  [key: string]: FC<SVGProps<SVGSVGElement>>
} = {
  badge: Badge,
  lock: Lock,
  doc: Doc,
  arrow: Arrow,
  home: Home,
  cart: Cart,
  clip: Clip,
  complete: Complete,
  logoSidebar: LogoSidebar,
  fullLogo : FullLogo ,


} as const

type SvgIconProps = SVGProps<SVGSVGElement> & { type: IconTypes }

const SvgIcon: FC<SvgIconProps> = ({ type, ...svgProps }) => {
  const Icon = icons[type] ?? null
  return Icon && <Icon {...svgProps} />
}

export { SvgIcon }

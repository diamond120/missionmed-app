import { FC, PropsWithChildren } from "react"

interface Props extends PropsWithChildren {
  color?: "string"
}
const Underlay: FC<Props> = ({ color, children }) => (
  <div className={"med-underlay"} style={{ backgroundColor: `${color ?? "#F5F6FA"}` }}>
    {children}
  </div>
)

export default Underlay

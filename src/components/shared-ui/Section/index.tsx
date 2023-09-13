import { Typography } from "antd"
import { FC, PropsWithChildren } from "react"

interface Props extends PropsWithChildren {
  title?: string
  className?: string
}
const Section: FC<Props> = ({ title, className, children }) => (
  <section className={`med-section ${className}`}>
    {title && <Typography.Title style={{marginBottom: '24px'}} level={2}>{title}</Typography.Title>}
    {children && children}
  </section>
)

export default Section

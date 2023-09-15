import "./index.less"

import { Button } from "antd"
import { FC, PropsWithChildren } from "react"

interface Props extends PropsWithChildren {
  type?: "link" | "primary"
  onClick?: () => void
  url?: string
  margin?: string
  padding?: string
}

const CustomButton: FC<Props> = ({ type = "primary", onClick, url, children, margin, padding, ...props }) => (
  <Button className={`med-custom-button-${type}`} style={{margin: `${margin}`, padding: `${padding}`}}   onClick={onClick} href={url} {...props}>
    {children}
  </Button>
)

export default CustomButton

import  './index.less'

import { Button } from "antd";
import { FC, PropsWithChildren } from "react"
interface Props extends PropsWithChildren {
  type?: "link" | "primary"
  onClick?: () => void
  url?: string
  className?: string
  backgroundColor?: string
}
const MainButton: FC<Props> =({children,type,backgroundColor='#2816EE', onClick, url, ...props})=>{
  return(
    <Button
      style={{backgroundColor:`${backgroundColor}`, color:'#fff', borderRadius: '8px', margin:'0'}}
      onClick={onClick} href={url} {...props}>
      {children}
    </Button>
  )
}

export default MainButton
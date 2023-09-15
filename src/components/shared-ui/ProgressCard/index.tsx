import "./index.less"

import { Button, Progress, Row, Typography } from "antd"
import { FC } from "react"
import { SvgIcon } from "../../icon"
import CustomButton from "../CustomButton"
import { Link } from "react-router-dom"

interface Props {
  stage?: string
  title: string
  isDisabled?: boolean
  percent?: number
  steps: number
  url?: string
  onClick?: () => void
}
const ProgressCard: FC<Props> = ({ stage, title, isDisabled, percent, steps,url, onClick }) => {
  const buttonProps = {
    icon: isDisabled ? <SvgIcon type={"lock"} /> : null,
  }

  const progress = percent
  return (
    <div className={'med-progress-card-wrap'}>
      {progress === 100 ? <SvgIcon type={"complete"} /> : <SvgIcon type={"doc"} />}
      <h2 className={'med-progress-card-title'}>{title}</h2>
      {isDisabled
        ?
        <Link target={"_blank"} to={"https://missionmed.com.au/checkout_step/unsw-application-review-checkout/"} rel={"noreferrer"}>
          <Button className={'med-button-lock'} style={{backgroundColor:'rgb(0,0,0,0)',border:'none', boxShadow:'none'}}>
            <Row align={"middle"} style={{margin:'94 0 40 50'}}><SvgIcon style={{marginRight:'10px'}} type={"lock"}/>Buy Now</Row>
          </Button>
        </Link>
        :
        <div>
          <Progress steps={steps} percent={percent} strokeColor={"#1DB9E9"} trailColor={"#CBEAF6"} showInfo={false} />
          <p>Stage:<span style={{marginLeft: "4px", color: "#312D42", fontWeight:"600"}}>{stage}</span></p>
          <CustomButton onClick={onClick} >Check Details</CustomButton>
        </div> }
    </div>
  )
}

export default ProgressCard


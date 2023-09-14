
import "./index.less"
import { Rate,Progress } from 'antd';
import { FC } from "react"

interface RatingProps{
title: string
  one: number
  two: number
  three: number
  four: number
  five: number
  rating: number

}

const Rating: FC<RatingProps> = ({title,one,two,three,four,five,rating}) => {
  return(
    <div className={"rating-section"}>
      <h2 className={"rating-section-title"}>{title}</h2>
      <div className={"rating-wrap"}>
        <div className={"rating-rating-block"}>
          <h2 className={"rating-rating"}>{rating}</h2>
          <Rate allowHalf defaultValue={rating} />
        </div>
        <div className={"rating-marks-block"}>
         <div className={"rating-mark"}><span>5</span><Progress percent={five} size={"small"} showInfo={false} strokeColor={"#2816EE"} /></div>
          <div className={"rating-mark"}><span>4</span><Progress percent={four} size={"small"} showInfo={false} strokeColor={"#2816EE"} /></div>
          <div className={"rating-mark"}><span>3</span><Progress percent={three} size={"small"} showInfo={false} strokeColor={"#2816EE"} /></div>
          <div className={"rating-mark"}><span>2</span><Progress percent={two} size={"small"} showInfo={false} strokeColor={"#2816EE"} /></div>
          <div className={"rating-mark"}><span>1</span><Progress percent={one} size={"small"} showInfo={false} strokeColor={"#2816EE"} /></div>

        </div>
      </div>
    </div>
  )
}
export default Rating
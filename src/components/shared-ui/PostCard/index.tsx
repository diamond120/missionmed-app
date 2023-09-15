import "./index.less"

import { Card, Typography } from "antd"
import { FC } from "react"

interface Props {
  title: string
  description: string
  url?: string
}
const PostCard: FC<Props> = ({ title,description, url }) => (
  <Card
    bordered={false}
    className={"med-post-card"}
    cover={
      url ? (
        <img className={"med-post-card-img"} alt={"example"} src={url ?? ""} />
      ) : (
        <div className={"med-post-card-img-bg"} />
      )
    }
  >
    <h2 className={'med-post-card-title'}>{title}</h2>
    <p className={'med-post-card-description'}>{description}</p>
  </Card>
)

export default PostCard

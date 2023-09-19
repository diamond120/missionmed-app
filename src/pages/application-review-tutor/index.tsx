import "./index.less"


import Section from "../../components/shared-ui/Section"
import { Breadcrumb, Typography } from "antd"
import { HomeOutlined } from "@ant-design/icons"
import TableAppReview from "./table-app-review"
const ApplicationReviewTutor = () =>{

  return(
    <Section className={"tutor-app-review-section-title"}>
      <Breadcrumb>
        <Breadcrumb.Item href={"/"}>
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>Application Review</Breadcrumb.Item>
      </Breadcrumb>
      <h2 className={"tutor-app-review-section-title"}>Application Review</h2>

      <TableAppReview/>
    </Section>
  )
}

export default ApplicationReviewTutor;
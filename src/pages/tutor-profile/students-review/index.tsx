import "./index.less"
import { Rate } from 'antd';

const StudentsReview = () => {
  return(
    <div className={"students-review-section"}>
      <h2 className={"students-review-section-title"}>Student’s Review</h2>
      <div className={"students-review-wrap"}>
        <div className={"students-review-item"}>
          <Rate allowHalf defaultValue={4.5} />
          <p className={"students-review-item-content"} >Wonderful tutor! Explains clearly. Lots of fun activities during the session</p>
          <div className={"students-review-item-footer"}>
            <p className={"name"}>Jenny Wilson</p>
            <p className={"type-teaching"}>UCAT Teaching Session</p>
            <p className={"date"}>Mon, 19 Jun 2023</p>
          </div>
        </div>
        <div className={"students-review-item"}>
          <Rate allowHalf defaultValue={5} />
          <p className={"students-review-item-content"} >The content is varied, and she adapts lessons to what I would like to or need to work on. The lessons are always fun and filled with lots of laughter!</p>
          <div className={"students-review-item-footer"}>
            <p className={"name"}>Dianne Russell</p>
            <p className={"type-teaching"}>UCAT Teaching Session</p>
            <p className={"date"}>Wed, 12 May 2023</p>
          </div>
        </div>
        <div className={"students-review-item"}>
          <Rate allowHalf defaultValue={3} />
          <p className={"students-review-item-content"} >Tutor was half an hour late for the session! Session was too boring.</p>
          <div className={"students-review-item-footer"}>
            <p className={"name"}>Robert Fox</p>
            <p className={"type-teaching"}>UCAT Teaching Session</p>
            <p className={"date"}>Wed, 12 May 2023</p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default StudentsReview
import "./index.less"
import { Rate } from 'antd';

const StudentsReview = ({reviews}) => {
  return(
    <div className={"students-review-section"}>
      <h2 className={"students-review-section-title"}>Student’s Review</h2>
     
      {reviews.length == 0 ? (
        <div className={"no-review-banner"}>
          <p>No reviews found</p>
        </div>
      ) : (
        <div className={"students-review-wrap"}>
        {reviews.map((review, index) => (
          <div className={"students-review-item"} key={index}>
            <Rate allowHalf defaultValue={review?.rate} />
            <p className={"students-review-item-content"} >{review?.comments}</p>
            <div className={"students-review-item-footer"}>
              <p className={"name"}>{review?.student_name}</p>
              <p className={"type-teaching"}>{review?.lessionType}</p>
              <p className={"date"}>{review?.date}</p>
            </div>
          </div>
          ))
        }
        </div>
      )}
        {/* <div className={"students-review-item"}>
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
        </div> */}
      </div>
    // </div>
  )
}
export default StudentsReview

import "./index.less"
import { Rate } from 'antd';

const AverageRating = () => {
  return(
    <div className={"average-rating-section"}>
      <h2 className={"average-rating-section-title"}>Average Rating</h2>
      <div className={"average-rating-wrap"}>
        <h2 className={"average-rating-value"}>4.5 / 5</h2>
        <Rate allowHalf defaultValue={4.5} />
        <p className={"average-rating-quantity"}>40 students ratings</p>
      </div>
    </div>
  )
}
export default AverageRating
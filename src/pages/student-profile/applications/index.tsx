import "./index.less"
import { Button } from "antd"
import { HeartFilled } from '@ant-design/icons';

const Applications = () => {
  return(
    <div className={"applications-section"}>
      <h2 className={"applications-section-title"}>Applications</h2>
      <div className={"applications-wrap"}>
        <div className={"applications-item"}>
          <div className={"applications-text-block"}>
            <h2 className={"applications-title"}>No application booked yet!</h2>
          </div>
        </div>
        {/* <div className={"applications-item"}>
          <div className={"applications-text-block"}>
            <h2 className={"applications-title"}>James Cook University</h2>
            <p className={"applications-subtitle"}>MBBS</p>
          </div>
          <div className={"applications-actions"}>
            <Button className={"applications-actions-btn-more"}>More Details</Button>
            <Button className={"applications-actions-btn-heart"}><HeartFilled style={{color: "#2816EE"}} /></Button>
          </div>
        </div>
        <div className={"applications-item"}>
          <div className={"applications-text-block"}>
            <h2 className={"applications-title"}>The University of Sydney</h2>
            <p className={"applications-subtitle"}>Sydney Medical School</p>
          </div>
          <div className={"applications-actions"}>
            <Button className={"applications-actions-btn-more"}>More Details</Button>
            <Button className={"applications-actions-btn-heart"}><HeartFilled style={{color: "#2816EE"}} /></Button>
          </div>
        </div>
        <div className={"applications-item"}>
          <div className={"applications-text-block"}>
            <h2 className={"applications-title"}>The University of Melbourne</h2>
            <p className={"applications-subtitle"}>Melbourne Medical School</p>
          </div>
          <div className={"applications-actions"}>
            <Button className={"applications-actions-btn-more"}>More Details</Button>
            <Button className={"applications-actions-btn-heart"}><HeartFilled style={{color: "#2816EE"}} /></Button>
          </div>
        </div> */}

      </div>
    </div>
  )
}

export default Applications
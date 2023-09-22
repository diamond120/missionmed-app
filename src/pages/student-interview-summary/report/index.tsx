import "./index.less"
import SummaryPreviewimg from "./summary-img/Summary-Preview.jpg"
import { ReactComponent as SummaryPreviewIcon } from '../../../components/icon/assets/session-summary.svg';

const Summarypreview = () => {
  return (
    <>
     <div className={"session-preview con-box"}>
          <h2 className={"secondary-title"}>Summary Preview</h2>
          <div className={"con-box-wrap"}>
            {/* <div className={"session-preview-view"} style={{display:'none'}}>
              <img src={SummaryPreviewimg} alt="Summary Preview" style={{width:'100%'}} />
            </div> */}
            <div className="session-preview-wrap" >
              <span className={"summary-icon"}>
                <SummaryPreviewIcon />
              </span>
              <h4 className={"title"}>Place for <br /> Session Summary</h4>
              <div className={"text"}>Your summary will be displayed here after <br /> uploading</div>
            </div>
               
          </div>
     </div>

    </>
  )
}

export default Summarypreview





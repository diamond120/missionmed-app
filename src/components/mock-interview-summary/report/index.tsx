import "./index.less";
import SummaryPreviewimg from "./summary-img/Summary-Preview.jpg";
import { ReactComponent as SummaryPreviewIcon } from "../../../components/icon/assets/session-summary.svg";
import { Button } from "antd";

const Report = ({ report, title="Diagnostic Report" }) => {
  return (
    <>
      <div className={"session-preview con-box"}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2 className={"secondary-title"}>{title}</h2>
          {report &&  <Button key="download" href={report}
                target="_blank" className={"primary-button"} style={{lineHeight:'1.3',padding:'8px 16px !important',marginBottom:"10px"}}>Download</Button>}

        </div>
        <div className={"con-box-wrap"}>
          {report ? (
            <div className={"session-preview-view"}>
              <img
                src={SummaryPreviewimg}
                alt="Summary Preview"
                style={{ width: "100%" }}
              />
            </div>
          ) : (
            <div className="session-preview-wrap">
              <span className={"summary-icon"}>
                <SummaryPreviewIcon />
              </span>
              <h4 className={"title"}>
                Place for <br /> Session Summary
              </h4>
              <div className={"text"}>
                Your summary will be displayed here after <br /> uploading
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Report;

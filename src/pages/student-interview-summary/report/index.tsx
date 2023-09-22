import "./index.less";
import SummaryPreviewimg from "./summary-img/Summary-Preview.jpg";
import { ReactComponent as SummaryPreviewIcon } from "../../../components/icon/assets/session-summary.svg";
import { Button } from "antd";

const Report = ({ report }) => {
  return (
    <>
      <div className={"session-preview con-box"}>
        <h2 className={"secondary-title"}>Diagnostic Report</h2>
        {report &&  <Button className={"primary-button"}>Download</Button>}
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

import "./index.less";
import { ReactComponent as SummaryPreviewIcon } from "../../../components/icon/assets/session-summary.svg";
import { Button } from "antd";

const DocViewer = ({report}) => {
  return <iframe src={`https://docs.google.com/gview?url=${encodeURIComponent(report)}&embedded=true`} width="100%" height="100%"/>
}


const Report = ({ report, title }) => {
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
          <DocViewer report={report}/>
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

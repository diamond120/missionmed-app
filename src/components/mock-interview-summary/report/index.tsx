import "./index.less";
import SummaryPreviewimg from "./summary-img/Summary-Preview.jpg";
import { ReactComponent as SummaryPreviewIcon } from "../../../components/icon/assets/session-summary.svg";
import { Button } from "antd";
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import {fileName} from "../../../common/common";

const ReportViewer = ({report}) => {
  const filename =  fileName(report)
  const extension = filename.split('.').pop();
  const docs = [
    {
      uri: report,
      fileType: extension,
      name: filename,
    },
  ];
  return <DocViewer documents={docs} pluginRenderers={DocViewerRenderers}  config={{
    header: {
      disableHeader: true,
      disableFileName: true,
    },
    pdfVerticalScrollByDefault: true, // false as default
  }} 
  />;
}

const Report = ({ report, title="Diagnostic Report" }) => {
  
  return (
    <>
      <div className={"session-preview con-box"}>
        <h2 className={"secondary-title"}>{title}</h2>
        {report &&  <Button key="download" href={report}
              target="_blank" className={"primary-button"}>Download</Button>}
        <div className={"con-box-wrap"}>
          {report ? (
            <ReportViewer report={report}/>
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

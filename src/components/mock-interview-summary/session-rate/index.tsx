import { SmileOutlined } from "@ant-design/icons";
import { Button, Col, Rate, Row } from "antd";
import "./index.less";
import RateSession from "../../../components/rate-session";
import { useState } from "react";

const NoSessionRate = ({ session, handleUpdateSummary,pagesession }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleRateCancel = () => {
    setIsOpen(false);
  };
  return (
    <>
      <div style={{ textAlign: "center" }}>
        <SmileOutlined style={{ fontSize: 47, color: "#A9A2F8" }} />
        <h3 className={"title"}>You Haven't Rate This Session Yet</h3>
        <div className="text">
          You can do it any other time by pressing “Rate Session” button below
        </div>
        <Button className={"primary-button"} onClick={() => setIsOpen(true)}>
          Rate Session
        </Button>
      </div>
      <RateSession
        session={session}
        isOpen={isOpen}
        handleRateCancel={handleRateCancel}
        handleUpdateSummary={handleUpdateSummary}
        pagesession={pagesession}
      />
    </>
  );
};

const SessionRateDetails = ({rateDetails}) => {
  return (
    <div className={"rat-comments"}>
      <Row className={"ratings-group"} gutter={[5, 24]}>
        <Col xs={24} xl={12} className="ratings">
          <h4 className={"rat-title"}>Knowledge & Expertise</h4>
          <Rate disabled defaultValue={rateDetails.Knowledge_Expertise ?? 0} allowHalf />
        </Col>
        <Col xs={24} xl={12} className="ratings">
          <h4 className={"rat-title"}>Engagement & Enthusiasm</h4>
          <Rate disabled  defaultValue={rateDetails.Engagement_Enthusiasm ?? 0} allowHalf />
        </Col>
        <Col xs={24} xl={12} className="ratings">
          <h4 className={"rat-title"}>Clarity & Understandability</h4>
          <Rate disabled  defaultValue={rateDetails.Clarity_Understandability ?? 0}  allowHalf />
        </Col>
        <Col xs={24} xl={12} className="ratings">
          <h4 className={"rat-title"}>Punctuality & Preparedness</h4>
          <Rate disabled defaultValue={rateDetails.Punctuality_Preparedness ?? 0}  allowHalf />
        </Col>
      </Row>

      <div className={"ex-comments"}>
        <h4 style={{ color: "#465078", fontWeight: "600", marginTop: 24 }}>
          Extra Comments
        </h4>
        <div style={{ color: "#312D42" }}>
          {rateDetails.comments ?? <span>&#8212;</span>}
        </div>
      </div>
    </div>
  );
};

export { SessionRateDetails, NoSessionRate };

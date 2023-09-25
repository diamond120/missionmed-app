import SectionDetails from "./section-details";
import SessionDetails from "./session-details";

const MockInterviewSummary = () => {
  return (
    <SectionDetails className={`summary-section`} title="Session Details">
      <SessionDetails />
    </SectionDetails>
  );
};

export default MockInterviewSummary;

import "./index.less";
import StepsCustom from "../../components/steps-custom";
import { FC, useEffect, useState } from "react";
import Section from "../../components/shared-ui/Section";
import { HomeOutlined, UserOutlined, CaretDownOutlined, FileSearchOutlined } from '@ant-design/icons';
import { Breadcrumb, Button } from "antd";
import { Avatar } from 'antd';
import { Link, useParams } from "react-router-dom";
import InitialDraftDownload from "./initial-draft-download";
import InitialReviewUpload from "./initial-review-upload";
import FinalReviewUpload from "./final-review-upload";
import InProgress from "./in-progress";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import CustomButton from "../../components/shared-ui/CustomButton";
import { useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import 'dayjs/locale/en';

const ApplicationReviewProcess: FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [fileUrl, setFileUrl] = useState<string>("");
  const [isInitDraftOpen, setIsInitDraftOpen] = useState(false);
  const [isInitReviewOpen, setIsInitReviewOpen] = useState(false);
  const [isInProgressOpen, setIsInProgressOpen] = useState(false);
  const [isFinalReviewOpen, setIsFinalReviewOpen] = useState(false);
  const { id } = useParams();

  // const application = useApplicationsQuery({
  //   variables: { filter: { id: { eq: id } } }
  // });

  const application = [];

  const selectedApplication = application.data?.applications?.data?.[0];
  const fileInitialDraft = selectedApplication?.attributes?.initial_draft?.data?.attributes?.url;
  const currentStage = selectedApplication?.attributes?.stage;
  const docs = [{ uri: fileUrl }];

  useEffect(() => {
    if (currentStage === 'Initial_Review_Complete') { setCurrentStep(2); }
    if (currentStage === 'In_Progress_Final') { setCurrentStep(2); }
    if (currentStage === 'Final_Review') { setCurrentStep(3); }
    if (currentStage === 'Final_Review_Complete') { setCurrentStep(4); }
  }, [currentStage]);

  useEffect(() => {
    if (currentStep === 0 && fileInitialDraft !== undefined) { setFileUrl(fileInitialDraft); }
  }, [currentStep, selectedApplication, fileInitialDraft]);

  useEffect(() => {
    if (selectedApplication?.attributes?.final_draft?.data?.id) { setIsInProgressOpen(true) }
  }, [selectedApplication?.attributes?.final_draft?.data?.id]);


  const handleGetUrlFile = (fileUrl: string) => {
    setFileUrl(fileUrl);
  };

  const setCurrentStepInitReview = () => {
    setCurrentStep(1);
  };

  const deadlineDate = dayjs(selectedApplication?.attributes?.deadline);
  const currentDate = dayjs(); // Текущая дата
  const daysRemaining = deadlineDate.diff(currentDate, 'day');

  const steps = [
    {
      title: <div className={"application-step-title-wrap"}><span className={"application-step-title"}>Initial Draft</span></div>,
      description: <div className={"application-step-desc-wrap"} > {currentStep === 0 ? <InitialDraftDownload setCurrentStepInitReview={setCurrentStepInitReview }  /> :
        "You have successfully completed this part."}<CaretDownOutlined onClick={()=>{setIsInitDraftOpen(!isInitDraftOpen)}} style={{display: currentStep >= 1 ? "block" : "none",  transform: isInitDraftOpen ? 'rotate(180deg)' : ""}} className={"arrow"}/>
        { isInitDraftOpen && <InitialDraftDownload setCurrentStepInitReview={setCurrentStepInitReview} />}
      </div>,
    },
    {
      title: <span className={"application-step-title"}>Initial Review</span>,
      description: <div className={"application-step-desc-wrap"}>{currentStep === 1 ? <InitialReviewUpload id={selectedApplication?.id ?? ""}
                                                                                                           getUrlFile={handleGetUrlFile} /> :  <span> { currentStep >= 1 ? "You have successfully completed this part" : "When you have finished reviewing the application, please upload them here for your student to view."}</span> } <CaretDownOutlined onClick={()=>{setIsInitReviewOpen(!isInitReviewOpen)}} style={{display: currentStep >= 2 ? "block" : "none" , transform: isInitReviewOpen ? 'rotate(180deg)' : ""}} className={"arrow"}/>
        { isInitReviewOpen &&  <InitialReviewUpload id={selectedApplication?.id ?? ""} getUrlFile={handleGetUrlFile} />}
      </div>
    },
    // {
    //   title: <span className={"application-step-title"}>In Progress</span>,
    //   description: <div className={"application-step-desc-wrap"}>{currentStep === 2 ?  "Your student is working hard to implement the advice you have given them." :   <span> { currentStep >= 2 ? <div> { !isInProgressOpen && "You have successfully completed this part"}</div> : "Your student is currently working to re-write their application based of off your feedback."}</span>} <CaretDownOutlined onClick={()=>{setIsInProgressOpen(!isInProgressOpen)}} style={{ display: currentStep >= 2 ? "block" : "none", transform: isInProgressOpen ? 'rotate(180deg)' : ""}} className={"arrow"}/>
    //     {  isInProgressOpen && <div>Your student is working hard to implement the advice you have given them.<InProgress/></div>}
    //   </div>
    // },
    {
      title: <span className={"application-step-title"}>In Progress</span>,
      description: <div className={"application-step-desc-wrap"}>{currentStep === 2 ?  "Your student is working hard to implement the advice you have given them." :   <span> { currentStep >= 2 ? <div> { !isInProgressOpen && "You have successfully completed this part"}</div> : "Your student is currently working to re-write their application based of off your feedback."}</span>} <CaretDownOutlined onClick={()=>{setIsInProgressOpen(!isInProgressOpen)}} style={{ display: currentStep >= 3 ? "block" : "none", transform: isInProgressOpen ? 'rotate(180deg)' : ""}} className={"arrow"}/>
        {  isInProgressOpen && <InProgress/>}
      </div>
    },
    {
      title: <span className={"application-step-title"}>Final Review</span> ,
      description: <div className={"application-step-desc-wrap"}> {currentStep === 3 ? <FinalReviewUpload id={selectedApplication?.id ?? ""}
                                                                                                                                                                    getUrlFile={handleGetUrlFile} /> :  <span> { currentStep >= 3 ? "You have successfully completed this part" : "This is the final review. Please ensure that you are confident with your student's application."}</span>} <CaretDownOutlined onClick={()=>{setIsFinalReviewOpen(!isFinalReviewOpen)}} style={{ display: currentStep >= 4 ? "block" : "none", transform: isFinalReviewOpen ? 'rotate(180deg)' : ""}} className={"arrow"}/>
        { isFinalReviewOpen && <FinalReviewUpload id={selectedApplication?.id ?? ""} getUrlFile={handleGetUrlFile} />}</div>
    },
  ];

  const config = {
    header: {
      disableHeader: true,
    },
    sidebar: {
      disableSidebar: true,
    },
    textSelection: {
      disableTextSelection: true,
    },
    outline: {
      disableOutline: true,
    },
    search: {
      disableSearch: true,
    },
    thumbnailNavigation: {
      disableThumbnailNavigation: true,
    },
    navigation: {
      disableZoomIn: true,
      disableZoomOut: true,
      disableFullScreen: true,
      disableRotate: true,
      disablePageNavigation: true,
    },
  };

  return (
    <Section>
      <Breadcrumb>
        <Breadcrumb.Item href={"/"}>
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href={'/tutor/application_review'}>Application Review</Breadcrumb.Item>
        <Breadcrumb.Item>{selectedApplication?.attributes?.title}</Breadcrumb.Item>
      </Breadcrumb>
      <div className={"application-reviewing-process-section-title-wrap"}>
        <h2 className={"application-reviewing-process-section-title"}>{selectedApplication?.attributes?.title}</h2>
        <Link target={"_blank"} to={"https://missionmed.notion.site/Application-Reviewer-f46aa04723e24b39b12f3ece4e8fe1d6"} rel={"noreferrer"}><CustomButton ><FileSearchOutlined /> How to review {selectedApplication?.attributes?.title} ? </CustomButton></Link>
      </div>
      <div className={"reviewing-process-student-block"}>
        <div className={"student-block-profile"}>
          <h2 className={"student-block-profile-title"}>Student</h2>
          <div className={"student-block-profile-card"}>
            <div className={"student-block-profile-info"}>
              <Avatar className={"student-block-profile-avatar"} size={64} icon={<UserOutlined />} />
              <div className={"student-block-profile-text"}>
                <h2 className={"student-block-profile-text-name"}>{selectedApplication?.attributes?.student?.data?.attributes?.full_name}</h2>
                <p className={"student-block-profile-text-info"}>University:<span>University of New South Wales</span></p>
                <p className={"student-block-profile-text-info"}>Area:<span>Not Rural, Torres Strait Islander (ATSI)</span></p>
                <p className={"student-block-profile-text-info"}>Application Cycle:<span>2023/2024</span></p>
              </div>
            </div>
            <div className={"student-block-profile-actions"}>
              <button className={"student-block-profile-actions-btn"}>View Profile</button>
              <button className={"student-block-profile-actions-btn"}>⋮</button>
            </div>
          </div>
        </div>
        <div className={"reviewing-process-deadline-block"}>
          <h2 className={"deadline-block-title"}>Deadline</h2>
          <div className={"deadline-block-card"}>
            <h2 className={"deadline-block-months"}>{daysRemaining} days</h2>
            <p className={"deadline-block-text"}>Left to {selectedApplication?.attributes?.title} Submission Deadline</p>
          </div>
        </div>
      </div>
      <div className={"reviewing-process-preview-block"}>
        <div className={"steps-block"}>
          <h2 className={"steps-block-title"}>Steps</h2>
          <div className={"steps-wrap"}>
            <StepsCustom steps={steps} current={currentStep} />
          </div>
        </div>
        <div className={"preview-block"}>
          <h2 className={"preview-block-title"}>Application Preview</h2>
          {fileUrl ?
            <DocViewer
              documents={docs}
              initialActiveDocument={docs[0]}
              pluginRenderers={DocViewerRenderers}
              style={{ width: 504, height: 620, marginTop: 24, borderRadius: 8 }}
              config={config}
            />
            :
            <div className={"preview-wrap"}>
            </div>
          }
        </div>
      </div>
    </Section>
  );
};

export default ApplicationReviewProcess;




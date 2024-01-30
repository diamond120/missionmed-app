//
// import "./index.less"
// import {  useParams } from "react-router-dom"
// import { Col, Row, Typography } from "antd"
// import { FC, useState, useEffect } from "react"
// import Section from "../../components/shared-ui/Section"
// import StepsCustom from "../../components/steps-custom"
// import UploadStep from "./upload-step"
// import PreviewDoc from "./preview-doc"
// import { HomeOutlined,CaretDownOutlined  } from '@ant-design/icons';
// import { Breadcrumb } from 'antd';
// import { useApplicationsQuery } from "../../graphql"
// import InProgressStep from "./in-progress-step-first"
// import InitialReviewCompleteStep from "./initial-review-complete-step"
// import FinalReviewStep from "./final-review-step"
// import InProgressFinalStep from "./in-progress-final-step"
// import FinalReviewCompleteStep from "./final-review-complete-step"
// const UnswApplication: FC = () => {
//
//   const [uploadedFileUrl, setUploadedFileUrl] = useState('');
//   const {id} = useParams()
//   const [current, setCurrent] = useState(0);
//   const [isOpenInitDraft,setIsOpenInitDraft]= useState(false)
//
//
//   const application = useApplicationsQuery({
//     variables: { filter: { id: { eq: id } } }
//   })
//
//   const selectedApplication = application.data?.applications?.data?.[0]
//   const currentlyStage= selectedApplication?.attributes?.stage
//  const arrowHandle = () =>{
//     setIsOpenInitDraft(!isOpenInitDraft)
//  }
//
//   useEffect(() => {
//     if (currentlyStage === 'Initial_Draft') {
//       setCurrent(0);
//
//     }
//     if (currentlyStage === 'In_Progress') {
//       setCurrent(1);
//
//     }
//     if (currentlyStage === 'Initial_Review_Complete') {
//       setCurrent(2);
//
//     }
//     if (currentlyStage === 'Final_Review') {
//       setCurrent(3);
//
//     }
//     if (currentlyStage === 'In_Progress_Final') {
//       setCurrent(4);
//
//     }
//     if (currentlyStage === 'Final_Review_Complete') {
//       setCurrent(5);
//
//     }
//   }, [currentlyStage]);
//
//
//
//   const handleGetUrlFile = (fileUrl:string) => {
//     setUploadedFileUrl(fileUrl);
//
//   };
//
//   const steps = [
//     {
//       title: <div><span className={"application-step-title"}>Initial Draft</span></div>,
//       description: <div>{ current === 0 ? (
//         <UploadStep  id={selectedApplication?.id ?? ''} getUrlFile={handleGetUrlFile} />
//       ) :  <div>You have successfully completed this part. { isOpenInitDraft && <div> <UploadStep  id={selectedApplication?.id ?? ''} getUrlFile={handleGetUrlFile} /></div>}</div>}<div className={"arrow-back-step"}>
//         <CaretDownOutlined
//           style={{opacity: 0.45, color: "black", transform: isOpenInitDraft ? 'rotate(180deg)' : ""}}
//           onClick={arrowHandle}/>
//       </div><div className={"arrow-back-step"}>
//         <CaretDownOutlined
//           style={{ opacity: 0.45, color: "black", transform: isOpenInitDraft ? 'rotate(180deg)' : ""}}
//           onClick={arrowHandle}/>
//       </div></div>,
//
//     },
//     {
//       title: <span className={"application-step-title"}>In Progress</span>,
//       description: current === 1 ? (<InProgressStep  />
//       ) : current >= 1 ? 'You have successfully completed this part.' : '',
//     },
//     {
//       title: <span className={"application-step-title"}>Initial Review Complete</span>,
//       description: current === 2 ? (
//         <InitialReviewCompleteStep />
//       ) : current >= 2 ? 'You have successfully completed this part.' : '',
//     },
//     {
//       title: <span className={"application-step-title"}>Final Review</span> ,
//       description: current === 3 ? (
//         <FinalReviewStep id={selectedApplication?.id ?? ''} getUrlFile={handleGetUrlFile} />
//       ) : current >= 3 ? 'You have successfully completed this part.' : '',
//     },
//     {
//       title: <span className={"application-step-title"}>In Progress</span> ,
//       description: current === 4 ? (
//         <InProgressFinalStep />
//       ) : current >= 4 ? 'You have successfully completed this part.' : '',
//     },
//     {
//       title: <span className={"application-step-title"}>Final Review Complete</span> ,
//       description: current === 5 ? (
//         <FinalReviewCompleteStep />
//       ) : current >= 5 ? 'You have successfully completed this part.' : '',
//     },
//   ];
//
//   return (
//     <Section className={"application-section"}>
//       <Breadcrumb>
//          <Breadcrumb.Item href={"/"}>
//           <HomeOutlined />
//         </Breadcrumb.Item>
//         <Breadcrumb.Item href={'/application_review'}>Application Review</Breadcrumb.Item>
//         <Breadcrumb.Item>{selectedApplication?.attributes?.title}</Breadcrumb.Item>
//       </Breadcrumb>
//       <h2 className={"application-upload-section-title"}>{selectedApplication?.attributes?.title}</h2>
//       <Row>
//         <Col className={'application-upload'} xs={24} sm={24} md={24} lg={24} xl={12}>
//           <h2 className={"section-title"}>Steps</h2>
//           <div className={"steps"}>
//             <StepsCustom steps={steps} current={current} />
//           </div>
//         </Col>
//         <Col className={'application-preview'} xs={24} sm={24} md={24} lg={24} xl={12}>
//           <h2 className={"section-title"}>Application Preview</h2>
//           <PreviewDoc uploadedFileUrl={uploadedFileUrl}/>
//         </Col>
//       </Row>
//     </Section>
//
//   )
// }
//
// export default UnswApplication
//


import "./index.less"
import {  useParams } from "react-router-dom"
import { Col, Row, Typography } from "antd"
import { FC, useState, useEffect } from "react"
import Section from "../../components/shared-ui/Section"
import StepsCustom from "../../components/steps-custom"
import UploadStep from "./upload-step"
import PreviewDoc from "./preview-doc"
import { HomeOutlined,CaretDownOutlined  } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
//import { useApplicationsQuery } from "../../graphql"
import InProgressStep from "./in-progress-step-first"
import InitialReviewCompleteStep from "./initial-review-complete-step"
import FinalReviewStep from "./final-review-step"
import InProgressFinalStep from "./in-progress-final-step"
import FinalReviewCompleteStep from "./final-review-complete-step"
import InitialDraftPreview from "./initial-draft-preview"
const UnswApplication: FC = () => {

  const [uploadedFileUrl, setUploadedFileUrl] = useState('');
  const {id} = useParams()
  const [current, setCurrent] = useState(0);
  const [isOpenInitDraft,setIsOpenInitDraft]= useState(false)


  // const application = useApplicationsQuery({
  //   variables: { filter: { id: { eq: id } } }
  // })

  const application = [];

  const selectedApplication = application.data?.applications?.data?.[0]
  const currentlyStage= selectedApplication?.attributes?.stage
  const arrowHandle = () =>{
    setIsOpenInitDraft(!isOpenInitDraft)
  }

  useEffect(() => {
    if (currentlyStage === 'Initial_Draft') {
      setCurrent(0);

    }
    if (currentlyStage === 'In_Progress') {
      setCurrent(1);

    }
    if (currentlyStage === 'Initial_Review_Complete') {
      setCurrent(2);

    }
    if (currentlyStage === 'Final_Review') {
      setCurrent(3);

    }
    if (currentlyStage === 'In_Progress_Final') {
      setCurrent(4);

    }
    if (currentlyStage === 'Final_Review_Complete') {
      setCurrent(5);

    }
  }, [currentlyStage]);



  const handleGetUrlFile = (fileUrl:string) => {
    setUploadedFileUrl(fileUrl);

  };

  const steps = [
    {
      title: <div><span className={"application-step-title"}>Initial Draft</span></div>,
      description: <div>{ current === 0 ? (
        <UploadStep  id={selectedApplication?.id ?? ''} getUrlFile={handleGetUrlFile} />
      ) :  <div>You have successfully completed this part. { isOpenInitDraft && <div> <InitialDraftPreview id={selectedApplication?.id ?? ''} getUrlFile={handleGetUrlFile}  /></div>}</div>}<div className={"arrow-back-step"}>
        <CaretDownOutlined
          style={{opacity: 0.45, color: "black", transform: isOpenInitDraft ? 'rotate(180deg)' : ""}}
          onClick={arrowHandle}/>
      </div><div className={"arrow-back-step"}>
        <CaretDownOutlined
          style={{ opacity: 0.45, color: "black", transform: isOpenInitDraft ? 'rotate(180deg)' : ""}}
          onClick={arrowHandle}/>
      </div></div>,

    },
    {
      title: <span className={"application-step-title"}>In Progress</span>,
      description: current === 1 ? (<InProgressStep  />
      ) : current >= 1 ? 'You have successfully completed this part.' : '',
    },
    {
      title: <span className={"application-step-title"}>Initial Review Complete</span>,
      description: current === 2 ? (
        <InitialReviewCompleteStep />
      ) : current >= 2 ? 'You have successfully completed this part.' : '',
    },
    {
      title: <span className={"application-step-title"}>Final Review</span> ,
      description: current === 3 ? (
        <FinalReviewStep id={selectedApplication?.id ?? ''} getUrlFile={handleGetUrlFile} />
      ) : current >= 3 ? 'You have successfully completed this part.' : '',
    },
    {
      title: <span className={"application-step-title"}>In Progress</span> ,
      description: current === 4 ? (
        <InProgressFinalStep />
      ) : current >= 4 ? 'You have successfully completed this part.' : '',
    },
    {
      title: <span className={"application-step-title"}>Final Review Complete</span> ,
      description: current === 5 ? (
        <FinalReviewCompleteStep />
      ) : current >= 5 ? 'You have successfully completed this part.' : '',
    },
  ];

  return (
    <Section className={"application-section"}>
      <Breadcrumb>
        <Breadcrumb.Item href={"/"}>
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href={'/application_review'}>Application Review</Breadcrumb.Item>
        <Breadcrumb.Item>{selectedApplication?.attributes?.title}</Breadcrumb.Item>
      </Breadcrumb>
      <h2 className={"application-upload-section-title"}>{selectedApplication?.attributes?.title}</h2>
      <Row>
        <Col className={'application-upload'} xs={24} sm={24} md={24} lg={24} xl={12}>
          <h2 className={"section-title"}>Steps</h2>
          <div className={"steps"}>
            <StepsCustom steps={steps} current={current} />
          </div>
        </Col>
        <Col className={'application-preview'} xs={24} sm={24} md={24} lg={24} xl={12}>
          <h2 className={"section-title"}>Application Preview</h2>
          <PreviewDoc uploadedFileUrl={uploadedFileUrl}/>
        </Col>
      </Row>
    </Section>

  )
}

export default UnswApplication








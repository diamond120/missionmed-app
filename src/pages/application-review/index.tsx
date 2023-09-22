
import "./index.less"
import "../student-profile/profile-picture/index.less"
import React from "react"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"
import { Breadcrumb, Modal, Button } from "antd";
import { HomeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import CustomButton from "../../components/shared-ui/CustomButton";
import PostCard from "../../components/shared-ui/PostCard";
import ProgressCard from "../../components/shared-ui/ProgressCard";
import Section from "../../components/shared-ui/Section";
import { SvgIcon } from "../../components/icon";
import postUrl from "../../components/img/post.jpg";
import {useStudent} from "../../api/providers/StudentProvider";

const ApplicationReview = () => {
  const data = [];
 //const { data } = useApplicationsQuery();
  const student = useStudent();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [clickedCanceled, setClickedCanceled] = useState<boolean>(false);


  useEffect(() => {
    setIsModalOpen(
      !clickedCanceled &&
      (!student?.fullName ||
      !student?.birthday ||
      !student?.email ||
      !student?.phoneNumber ||
      !student?.location ||
      !student?.state))}
  , [student?.fullName, student?.birthday, student?.email, student?.phoneNumber])

  const handleCancel = () => {
    setIsModalOpen(false)
    setClickedCanceled(true)
  }

  return (
    <React.Fragment>
      {isModalOpen && <Modal
        className={"notification-modal"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <React.Fragment>
            <Link className={"link-to-profile"} to={'/student_profile'}>Take me to the profile</Link>
            <Button className={"close-modal"} onClick={handleCancel}>Cancel</Button>
          </React.Fragment>
        ]}>
        <p>Please fill all required fields on the My Profile page.</p>
      </Modal>
      }
      <Section className={"application-review-section"}>
        <Breadcrumb>
          <Breadcrumb.Item href={"/"}>
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>Application Review</Breadcrumb.Item>
        </Breadcrumb>
        <div className={"application-review-section-title-wrap"}>
          <h2 className={"application-review-section-title"}>Application Review</h2>

          <Link to={"https://missionmed.com.au/checkout_step/unsw-application-review-checkout/"} rel={"noreferrer"} className={"primary-button"}>
            <ShoppingCartOutlined style={{fontSize: 16, margin: "0 8px 0 0 ", lineHeight: 0 }} />
            Buy More Reviews
          </Link>
        </div>
        <div className={"application-review-progress-cards"}>
          <h2 className={"application-review-progress-cards-title"}>Applications</h2>
          <div className={"application-review-progress-cards-wrap"}>
            {data?.applications?.data?.map((application) => {
              let percent = 0;
              let stageTitle=""
              if (application.attributes?.stage === 'Initial_Draft') {
                percent = 16;
                stageTitle= "Initial Draft"
              }
              if (application.attributes?.stage === 'In_Progress') {
                percent = 32;
                stageTitle= "In Progress"
              }
              if (application.attributes?.stage === 'Initial_Review_Complete') {
                percent = 48;
                stageTitle="Initial Review Complete"
              }
              if (application.attributes?.stage === 'Final_Review') {
                percent = 64;
                stageTitle= "Final Review"
              }
              if (application.attributes?.stage === 'In_Progress_Final') {
                percent = 80;
                stageTitle = "In Progress"

              }
              if (application.attributes?.stage === 'Final_Review_Complete') {
                percent = 100;
                stageTitle = "Final Review Complete"

              }

              return (
                <div className={"application-review-progress-card"} key={application.id}>
                  <ProgressCard
                    title={application.attributes?.title || ""}
                    stage={stageTitle || ""}
                    steps={6}
                    percent={percent || 0}
                    isDisabled={application.attributes?.lock || false}
                    onClick={() => {
                      navigate(`/application_review/application/${application.id}`);
                    }}
                  />
                </div>
              );
            })}


          </div>
        </div>

        {/*<Section className={"related-posts-section"}>*/}
        {/*  <div className={"related-posts-section-title-wrap"}>*/}
        {/*    <h2 className={"related-posts-section-title"}>Related Posts</h2>*/}
        {/*    <Link to={"/"} className={"related-posts-section-link-more"}>*/}
        {/*      See More <SvgIcon type={"arrow"} style={{ marginLeft: 10 }} />*/}
        {/*    </Link>*/}
        {/*  </div>*/}
        {/*  <div className={"related-posts-section-cards"}>*/}
        {/*    <div className={"related-posts-section-card"}>*/}
        {/*      <Link to={"/"}>*/}
        {/*        <PostCard*/}
        {/*          title={"What is UNSW?"}*/}
        {/*          url={postUrl}*/}
        {/*          description={"The UNSW application refers to the process of applying for admission to programs offered by UNSW."}*/}
        {/*        />*/}
        {/*      </Link>*/}
        {/*    </div>*/}
        {/*    <div className={"related-posts-section-card"}>*/}
        {/*      <Link to={"/"}>*/}
        {/*        <PostCard*/}
        {/*          title={"What is UNSW?"}*/}
        {/*          url={postUrl}*/}
        {/*          description={"The UNSW application refers to the process of applying for admission to programs offered by UNSW."}*/}
        {/*        />*/}
        {/*      </Link>*/}
        {/*    </div>*/}
        {/*    <div className={"related-posts-section-card"}>*/}
        {/*      <Link to={"/"}>*/}
        {/*        <PostCard*/}
        {/*          title={"What is UNSW?"}*/}
        {/*          url={postUrl}*/}
        {/*          description={"The UNSW application refers to the process of applying for admission to programs offered by UNSW."}*/}
        {/*        />*/}
        {/*      </Link>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</Section>*/}
      </Section>
    </React.Fragment>
  );
};

export default ApplicationReview;
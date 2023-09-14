import "./index.less"
import { Form, Checkbox, Tooltip } from "antd";
import { FC } from "react";

const Specializations: FC<{ tutor: Tutor; id: string }> = ({ tutor, id }) => {


  return (
    <div className={"specializations-section"}>
      <h2 className={"specializations-section-title"}>Specializations</h2>
      <Form className={"specializations-form"}>
        <Form.Item>
          <div className={"specializations-form-item"}>
            <p className={"specializations-label"}>Lesson Types</p>
            <Tooltip
              title={"Please contact your manager if you would like to be qualified to deliver other lesson types."}
              color={"#465078"}


            >
              <div className={"specializations-checkboxes"}>
                <Checkbox
                  disabled
                  checked={tutor?.ucat_tutoring ?? undefined}
                  className={"specializations-checkbox"}
                >
                  <span>UCAT 1-to-1 Tutoring</span>
                </Checkbox>
                <Checkbox
                  disabled
                  checked={tutor?.interview_tutoring ?? undefined}
                  className={"specializations-checkbox"}
                >
                  <span>Interview 1-to-1 Tutoring</span>
                </Checkbox>
                <Checkbox
                  disabled
                  checked={tutor?.mock_interview ?? undefined}
                  className={"specializations-checkbox"}
                >
                  <span>Mock Interviews</span>
                </Checkbox>
                <Checkbox
                  disabled
                  checked={tutor?.application_review ?? undefined}
                  className={"specializations-checkbox"}
                >
                  <span>Application Review</span>
                </Checkbox>
              </div>
            </Tooltip>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Specializations;

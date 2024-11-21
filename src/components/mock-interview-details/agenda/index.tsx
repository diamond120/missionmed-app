import { Button, Form, Modal, Input, message } from 'antd';
import './index.less'
import { QuestionCircleFilled } from "@ant-design/icons";
import { useEffect, useState } from 'react';
const { TextArea } = Input;

const Agenda = ({agenda, handleEditAgenda}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleClick = () => {
    setIsModalOpen(true)
  }

  const handleSubmit = async () => {
    try{
      const values = await form.validateFields();
      handleEditAgenda(values.agenda);
      setIsModalOpen(false);
    }catch(e){
      message.error(e.message);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    form.setFieldValue('agenda', agenda)
  }, [agenda])

  return (
    <>
      <div className={"upc-agenda con-box"}>
          <h2 className={"secondary-title"}>Agenda<QuestionCircleFilled  style={{marginLeft:"8px"}} title={'Agenda'}/></h2>
          <div className={"con-box-wrap"}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'start', justifyContent:'space-between',height:'100%'}}>
                {/* <ul className={'list-disc'}> */}
                      {/* <li>Ask about how tutor was able to mentally reach the answer for Q34 in Mock 2 of Medify.</li>
                      <li>Ask tutor to explain how to work through syllogisms.</li> */}
                {/* </ul> */}
                {agenda ? agenda : 'No agenda found'}
                <div style={{display:'flex',gap:20,marginTop:10}}>
                  <Button className={"secondary-button"} onClick={handleClick}>Edit Agenda</Button>
                </div>
              </div>
          </div>
      </div>
      <Modal
        title="Edit Agenda"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={handleCancel}
        className={"mock-interview-modal"}
        width={"600px"}
        footer={[
          <div key="buttonGroup" className='button-group'>
            <Button key="discard" type="dashed" className={"secondary-button"} onClick={handleCancel}>
              Discard 
            </Button>
            <Button key="submit" className={"primary-button"} onClick={handleSubmit}>
              Save Changes
            </Button>
          </div>
        ]}
      >
        <Form form={form} layout="vertical">
            <Form.Item 
            label="Here you can put down your thoughts and questions to your tutor on the upcoming session" 
            name="agenda" 
            rules={[{required:true}]}
            initialValue={agenda}
            >
            <TextArea
              style={{ height: 200 }}
              placeholder=""
            />
        </Form.Item>
        </Form>
      </Modal>

    </>
  )
}

export default Agenda
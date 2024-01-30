import { useState } from "react"
import { Button, Form, Input, Modal } from "antd"

const {TextArea} = Input;

const PostSessionTasks = ({tasks, addPostSessionTasks}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleClick = () => {
    setIsModalOpen(true)
  }

  const handleSubmit = async () => {
    try{
      const values = await form.validateFields();
      addPostSessionTasks(values.postSessionTasks);
      setIsModalOpen(false);
    }catch(e){
      message.error(e.message);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleTaskClick = () =>{
    setIsModalOpen(true);
  }

  return (
    <>
      <div className={"post-session-tasks con-box"} style={{margin:"40px 0"}}>
        <h2 className={"secondary-title"}>Post-Session Tasks</h2>
        <div className={"con-box-wrap"}>
          {/* <ul className={'list-disc'} style={{marginBottom:32}}>
            <li>Ask about how tutor was able to mentally reach the answer for Q34 in Mock 2 of Medify.</li>
            <li>Ask tutor to explain how to work through syllogisms.</li>
          </ul> */}
          <div style={{marginBottom:32}}>
            {tasks ? tasks : "No tasks found"}
          </div>
          <Button className={"secondary-button"} onClick={handleTaskClick}>Add New Task</Button>
        </div>
      </div>
      <Modal
        title="Edit Post Session Tasks"
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
            label="Here you can put down post session tasks" 
            name="postSessionTasks" 
            rules={[{required:true}]}
            initialValue={tasks}
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

export default PostSessionTasks
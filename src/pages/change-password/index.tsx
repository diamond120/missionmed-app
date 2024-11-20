import './index.less'
import { Button, Modal, message, Form, Input } from 'antd'
import { useState } from 'react'
import CommonService from '../../api/services/Common'

const ChangePassword = ({ title, moduleType }) => {
  const [form] = Form.useForm()

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [modalTitle, setModalTitle] = useState<string>('')
  const handleSubmit = async () => {
    await form.validateFields()
    try {
      const formData = form.getFieldsValue(true)
      const response = await CommonService.postAPI('/change-password', formData)
      if (response.data.success == true) {
        message.success('You’ve successfully change password')
        handleCancel()
      } else {
        throw new Error(response.data.message)
      }
    } catch (e: any) {
      message.error(e.message)
    }
    // handleCancel();
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    form.resetFields()
  }

  const showModal = () => {
    setIsModalOpen(true)
    setModalTitle(title)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <Button onClick={showModal} className={'profile-picture-block-btn-remove'}>
        {title}
      </Button>
      <Modal
        title={modalTitle}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className={'mock-interview-modal '}
        width={'max-content'}
        footer={[
          <div key='change-password'>
            <Button onClick={handleCancel} className={'secondary-button'}>
              {' '}
              Cancel
            </Button>
            <Button className={'primary-button'} htmlType='submit' onClick={handleSubmit}>
              Change Password
            </Button>
          </div>
        ]}
      >
        <Form form={form} layout='vertical'>
          <div style={{ width: '600px' }} className='md-w-full'>
            <Form.Item
              name={'oldPassword'}
              label={'Old Password *'}
              rules={[{ required: true, message: 'Please enter your current password' }]}
            >
              <Input.Password
                style={{ borderRadius: 8, fontSize: 16, lineHeight: 1.4, padding: ' 8px 12px 8px 12px' }}
                className={'changePassword'}
                placeholder={'Old Password'}
              />
            </Form.Item>

            <Form.Item name={'newPassword'} label={'New Password *'} rules={[{ required: true, message: 'Please enter new password' }]}>
              <Input.Password
                style={{ borderRadius: 8, fontSize: 16, lineHeight: 1.4, padding: ' 8px 12px 8px 12px' }}
                className={'changePassword'}
                placeholder={'New Password'}
              />
            </Form.Item>

            <Form.Item
              name={'confirmNewPassword'}
              label={'Confirm New Password *'}
              rules={[
                { required: true, message: 'Please enter confirm new password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject('New Password and Confirm Password should be same')
                  }
                })
              ]}
              dependencies={['newPassword']}
            >
              <Input.Password
                style={{ borderRadius: 8, fontSize: 16, lineHeight: 1.4, padding: ' 8px 12px 8px 12px' }}
                className={'changePassword'}
                placeholder={'Confirm New Password'}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default ChangePassword

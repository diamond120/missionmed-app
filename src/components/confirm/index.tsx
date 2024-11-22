import { Modal } from "antd";
import { WarningOutlined } from '@ant-design/icons';

interface Props {
  handleOk: () => void
  title: string
  content?: string | null
}

const confirm = async ({ handleOk, title = 'Do you Want to delete it?', content = '' }: Props) => {
    Modal.confirm({
      title: title,
      icon: <WarningOutlined />,
      content: content,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk:() => handleOk(),
      onCancel:() => false,
      okButtonProps:{className:'primary-button'},
      cancelButtonProps:{className:'secondary-button'}
    });
  };

  export default confirm
import './index.less'
import { Spin, Table, message , TableColumnsType, Tag, Modal } from "antd";
import { FC, useState, useEffect } from "react";
import { useTutor } from "../../../api/providers/TutorProvider";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import AddException from '../add-exception';
import CommonService from "../../../api/services/Common";
import moment from 'moment';


const SpecialDays: FC<Any> = ({props}) => {
  const tutor = useTutor();
  const [data, setData] = useState([]);
  const [filterName, setFilterName] = useState([]);
  const [modal, contextHolder] = Modal.useModal();


  interface DataType {
    id: React.Key;
    name: string;
    type: string;
    duration: string;
  }

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      filters: filterName,
      onFilter: (value: string, record) => record.name.indexOf(value) === 0,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.type.localeCompare(b.type),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      defaultSortOrder: 'descend',
      sorter: (a, b) => {
        const startDateA = new Date(a.duration.split(' - ')[0]);
        const startDateB = new Date(b.duration.split(' - ')[0]);
        return startDateA - startDateB;Modal
      },
      render: (text, record) => (
        <div>
          <p>{text}</p>
          {record.hours &&
            JSON.parse(record.hours)
              .map((hour, index) => ({
                ...hour,
                startDate: new Date(`2000-01-01 ${hour.start}`), // Assuming a common date
                endDate: new Date(`2000-01-01 ${hour.end}`), // Assuming a common date
              }))
              .sort((a, b) => a.startDate - b.startDate)
              .map((hour, index) => (
                <div key={index} style={{ marginTop: 1 }}>
                  <Tag color="blue" style={{ borderRadius: 5 }}>
                    {hour.start} - {hour.end}
                  </Tag>
                </div>
              ))
          }
        </div>
      ),
      sortDirections: ['ascend', 'descend'], 
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (text, record) => <div className='d_flex_10'> <a > <AddException title='Add Exception' callAdded={() => {fetchData()}}  editedData={record} /> </a> <a onClick={()=> deleteException(record)}><DeleteOutlined style={{color: '#FF4D4F' }} /></a></div>,
    },
  ];

  useEffect(() => {
    fetchData();
  },[])

  const setState = (data) => {
        setData(data.map((item: any) => {
          item.duration = `${moment(item.start_day).format('D MMMM')} - ${moment(item.end_day).format('D MMMM')}`;
          return item;
        }));
        setFilterName(data.map(item => ({
          text: item.name,
          value: item.name
        })));
  }

  const fetchData = async () => {
    try {
      const response = await CommonService.getAPI('/tutor/get-exceptions');
      if (response.data.success) {
        setState(response.data.data)
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const deleteException = async (data : any) => {
      modal.confirm({
        title: 'Confirm',
        icon: <ExclamationCircleOutlined />,
        content: <>{data.type ==  'Extra Availability' ? 'Please confirm first that no students booked your Extra Slot before delete. Are you sure you want to perform delete?' : 'Are you sure you want to perform delete?'}</>,
        okText: 'Okay',
        cancelText: 'Cancel',
        onOk: async () => {
          try {
            const response = await CommonService.getAPI(`/tutor/delete-exception/${data.id}`);
            if (response.data.success) {
              setState(response.data.data);
              message.success('Exception deleted successfully');
            } else {
              throw new Error(response.data.message);
            }
          } catch (error) {
            message.error(error.message);
          }
        },
      });
  };

  
  if(tutor?.loading){
    return(
      <Spin />
    )
  }
  
  return (
    <>
    <div className={"specializations-section"}>
      <h2 className={"specializations-section-title"}>Special Days</h2>
      <Table columns={columns} dataSource={data} pagination={false}/>
      <AddException title='Add Exception' callAdded={() => {fetchData()}}  />
      {contextHolder}
    </div>
    </>
  );
};

export default SpecialDays;
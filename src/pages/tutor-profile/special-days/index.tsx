import './index.less'
import { Spin, Table, message , TableColumnsType, TableProps } from "antd";
import { FC, useState, useEffect } from "react";
import { useTutor } from "../../../api/providers/TutorProvider";
import { DeleteOutlined } from "@ant-design/icons";
import AddException from '../add-exception';
import CommonService from "../../../api/services/Common";


const SpecialDays: FC<Any> = ({props}) => {
  const tutor = useTutor();
  const [data, setData] = useState([]);
  const [filterName, setFilterName] = useState([]);

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
        return startDateA - startDateB;
      },
      sortDirections: ['ascend', 'descend'], 
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (text, record) => <div className='d_flex_10'> <a > <AddException title='Add Exception' callAdded={() => {fetchData()}}  editedData={record} /> </a> <a onClick={()=> deleteException(record.id)}><DeleteOutlined style={{color: '#FF4D4F' }} /></a></div>,
    },
  ];

  useEffect(() => {
    fetchData();
  },[])

  const setState = (data) => {
        setData(data.map((item: any) => {
          item.duration = `${item.start_day} - ${item.end_day}`;
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

  const deleteException = async (id) => {
    try {
      const response = await CommonService.getAPI(`/tutor/delete-exception/${id}` );
      if (response.data.success) {
       setState(response.data.data)
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      message.error(error.message);
    }
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
    </div>
    </>
  );
};

export default SpecialDays;
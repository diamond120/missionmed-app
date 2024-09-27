import './index.less';
import { Spin, Table, message, TableColumnsType, Tag, Modal, Pagination, Checkbox } from "antd"; 
import { FC, useState, useEffect } from "react";
import { useTutor } from "../../../api/providers/TutorProvider";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import AddException from '../add-exception';
import CommonService from "../../../api/services/Common";
import moment from 'moment';

const SpecialDays: FC<Any> = ({ props }) => {
  const tutor = useTutor();
  const [data, setData] = useState([]);
  const [filterName, setFilterName] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [loading, setLoading] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const [showSpecialDays, setShowSpecialDays] = useState(false); // State for checkbox
  const [includePastData, setIncludePastData] = useState(false); // New state to track checkbox

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
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.type.localeCompare(b.type),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => {
        const startDateA = new Date(a.duration.split(' - ')[0]);
        const startDateB = new Date(b.duration.split(' - ')[0]);
        return startDateA - startDateB;
      },
      render: (text, record) => (
        <div>
          <p>{text}</p>
          {record.hours &&
            JSON.parse(record.hours)
              .map((hour, index) => ({
                ...hour,
                startDate: new Date(`2000-01-01 ${hour.start}`),
                endDate: new Date(`2000-01-01 ${hour.end}`),
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
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (text, record) => {
        if (record.event_id) {
          return <span style={{ color: 'black' }}>Synced from Google Calendar. You cannot edit/delete here. Buffer time is added before and after your event.</span>;
        }
        return (
          <div className='d_flex_10'>
            <a>
              <AddException title='Add Exception' callAdded={() => { fetchData(); }} editedData={record} />
            </a>
            <a onClick={() => deleteException(record)}>
              <DeleteOutlined style={{ color: '#FF4D4F' }} />
            </a>
          </div>
        );
      },
    }
  ];

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, showSpecialDays, includePastData]); // Add includePastData to dependencies

  const setState = (data) => {
    setData(data.map((item: any) => {
      item.duration = `${moment(item.start_day).format('D MMMM')} - ${moment(item.end_day).format('D MMMM')}`;
      return item;
    }));
    setFilterName(data.map(item => ({
      text: item.name,
      value: item.name
    })));
  };
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await CommonService.getAPI('/tutor/get-exceptions', {
        params: {
          page: pagination.current,
          pageSize: pagination.pageSize,
          showSpecialDays, // Pass this flag to the API if needed
          includePastData // New parameter to include past data
        }
      });
      if (response.data.success) {
        setState(response.data.data);
        setPagination(prev => ({ ...prev, total: response.data.total }));
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setShowSpecialDays(checked); // Update the checkbox state
    setIncludePastData(checked); // Also update the past data checkbox
  };


  const deleteException = async (data: any) => {
    modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: <>{data.type === 'Extra Availability' ? 'Please confirm first that no students booked your Extra Slot before delete. Are you sure you want to perform delete?' : 'Are you sure you want to perform delete?'}</>,
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

  const filteredData = data.filter(item => {
    const startDate = moment(item.start_day); // Assume start_day is in your data
    const isPastOrToday = moment(startDate).isBefore(moment(), 'day'); // Check if the date is past or today

    // If showSpecialDays is checked, include past events (including today)
    return showSpecialDays ? isPastOrToday : startDate.isSameOrAfter(moment().startOf('day')); // Show past or future based on checkbox state
  });
  
    if (tutor?.loading || loading) {
      return (
        <div className="spinner-container">
          <Spin />
        </div>
      );
    }

  return (
    <>
      <div className={"specializations-section"}>
        <h2 className={"specializations-section-title"}>Special Days</h2>
        {data.length > 0 && ( // Render checkbox only if there are data
          <Checkbox 
            checked={showSpecialDays}
            onChange={handleCheckboxChange}
          >
            Show Past Special Days
          </Checkbox>
        )}
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{
            ...pagination,
            style: { padding: '10px' }, // Apply your custom css here
          }}
          onChange={handleTableChange}
        />
        <AddException title='Add Exception' callAdded={() => { fetchData(); }} />
        {contextHolder}
      </div>
    </>
  );
};

export default SpecialDays;

import './index.less'
import { Spin, Table, message, TableColumnsType, Tag, Modal, Checkbox } from 'antd'
import { FC, useState, useEffect } from 'react'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import AddException from '../add-exception'
import CommonService from '../../../api/services/Common'
import moment from 'moment'

const SpecialDays: FC<Any> = ({ props, isGoogleVerification }) => {
  const [data, setData] = useState([])
  const [filterName, setFilterName] = useState([])
  const [current, setCurrent] = useState(1)
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [loading, setLoading] = useState(false)
  const [showPastEvents, setShowPastEvents] = useState(false)
  const [modal, contextHolder] = Modal.useModal()
  interface DataType {
    id: React.Key
    name: string
    type: string
    duration: string
  }

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      filters: filterName,
      onFilter: (value: string, record) => record.name.indexOf(value) === 0
    },
    {
      title: 'Type',
      dataIndex: 'type',
      sorter: (a, b) => a.type.localeCompare(b.type)
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      render: (text, record) => (
        <div>
          <p>{text}</p>
          {record.hours &&
            JSON.parse(record.hours)
              .map((hour, index) => ({
                ...hour,
                startDate: new Date(`2000-01-01 ${hour.start}`),
                endDate: new Date(`2000-01-01 ${hour.end}`)
              }))
              .map((hour, index) => (
                <div key={index} style={{ marginTop: 1 }}>
                  <Tag color='blue' style={{ borderRadius: 5 }}>
                    {hour.start} - {hour.end}
                  </Tag>
                </div>
              ))}
        </div>
      ),
      sortDirections: ['descend', 'ascend']
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (text, record) => {
        if (record.event_id) {
          return (
            <span style={{ color: 'black' }}>
              Synced from Google Calendar. You cannot edit/delete here. Buffer time is added before and after your event.
            </span>
          )
        }
        return (
          <div className='d_flex_10'>
            <a>
              <AddException
                title='Add Exception'
                callAdded={() => {
                  fetchData()
                }}
                editedData={record}
              />
            </a>
            <a onClick={() => deleteException(record)}>
              <DeleteOutlined style={{ color: '#FF4D4F' }} />
            </a>
          </div>
        )
      }
    }
  ]
  useEffect(() => {
    if (isGoogleVerification) {
      fetchData()
    }
  }, [isGoogleVerification])

  useEffect(() => {
    fetchData()
  }, [pagination.current, showPastEvents])

  const setState = (data) => {
    const formattedData = data.map((item) => {
      item.duration = `${moment(item.start_day).format('D MMMM')} - ${moment(item.end_day).format('D MMMM')}`
      return item
    })

    setData(formattedData) // Set the formatted data to the state
    setFilterName(
      formattedData.map((item) => ({
        text: item.name,
        value: item.name
      }))
    )
  }

  const onChange = (page, pageSize) => {
    setCurrent(page)
    fetchData(page, pageSize)
  }

  const fetchData = async (page, pageSize) => {
    setLoading(true)
    try {
      const response = await CommonService.postAPI('/tutor/get-exceptions', {
        page: page,
        pageSize: pageSize ?? pagination.pageSize,
        showPast: showPastEvents
      })

      if (response.data.success) {
        const data = response.data.data.data
        setState(data) // Set the data

        setPagination((prev) => ({
          ...prev,
          pageSize: pageSize ?? pagination.pageSize,
          total: response.data.data.total // Ensure this reflects the total records count
        }))
        console.log('pagination', pagination)
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      message.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const deleteException = async (data: any) => {
    modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          {data.type === 'Extra Availability'
            ? 'Please confirm first that no students booked your Extra Slot before delete. Are you sure you want to perform delete?'
            : 'Are you sure you want to perform delete?'}
        </>
      ),
      okText: 'Okay',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const response = await CommonService.getAPI(`/tutor/delete-exception/${data.id}`)
          if (response.data.success) {
            fetchData()
            message.success('Exception deleted successfully')
          } else {
            throw new Error(response.data.message)
          }
        } catch (error) {
          message.error(error.message)
        }
      }
    })
  }

  return (
    <>
      <div className={'specializations-section'}>
        <h2 className={'specializations-section-title'}>Special Days</h2>
        <Checkbox
          onChange={(e) => setShowPastEvents(e.target.checked)} // Toggle checkbox state
          checked={showPastEvents}
          style={{ paddingBottom: '10px' }}
        >
          Show Past Special Days
        </Checkbox>
        {/* The loader is only applied to the table here */}
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              current: current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              onChange: onChange
            }}
          />
        </Spin>
        <AddException
          title='Add Exception'
          callAdded={() => {
            fetchData()
          }}
        />
        {contextHolder}
      </div>
    </>
  )
}

export default SpecialDays

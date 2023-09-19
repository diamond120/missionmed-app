

import "./index.less";
import React, { useState, FC, useEffect } from "react";
import { Breadcrumb, Button, Table, Input, Checkbox, AutoComplete } from "antd";
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult, Key } from 'antd/es/table/interface';
import { HomeOutlined, DeleteOutlined } from "@ant-design/icons";
import Section from "../../components/shared-ui/Section";
import {formatDate} from "../../common/common";
import { useNavigate } from "react-router-dom";
import NotificationsService from "../../api/services/Notifications"

interface DataType {
  date: string;
  notification: string;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
}

const NotificationsTutor: FC = () => {
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10
  })

  const [notification, setNotification] = useState<any[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const [sortedInfo, setSortedInfo] = useState<SorterResult<DataType>>({});
  const [selectedRows, setSelectedRows] = useState<Key[]>([]);

  const handleSelectRow = (record: any) => {
    const selectedKey = record.key;
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(selectedKey)) {
        return prevSelectedRows.filter((key) => key !== selectedKey);
      } else {
        return [...prevSelectedRows, selectedKey];
      }
    });
  };

  const handleSelectAllRows = (event: any) => {
    const checked = event.target.checked;
    setSelectedRows(checked ? notification.map((record) => record.key as Key) : []);
  };

  const handleViewMore = (id: string, idNotification: string) => {
    navigate(`/tutor/reviewing_process/${id}`);
    // updateNotification({
    //   variables: {
    //     id: idNotification,
    //     input: {
    //       is_read: true
    //     }
    //   }
    // })
  };

  const deletedNotification = async (notificationId: string) => {
    const result = await NotificationsService.deleteNotification({
      notificationId:notificationId
    })
    if(result.data.success){
      setNotification((prevNotification) =>
      prevNotification.filter((item) => item.key !== notificationId));
    }else{
      console.log(result);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const getNotifications = async () => {
    const config = { 
      params: {
        role:"tutor",
        page:pagination.current,
        pageSize:pagination.pageSize,
        search:searchText
      }
    };
    const result = await NotificationsService.get(config);
    if(result.data.data.notificationData.length > 0){
      const response = result.data.data.notificationData;
      const totalCount = result.data.data.totalCount;
      setNotification( response.map((res) => ({
        "key":res.id,
        "date":formatDate(res.created_at),
        "notification":res.message
      })))
      setPagination(prevPagination => ({...prevPagination, total:totalCount}))
    }else{
      setNotification([]);
    }
  }

  useEffect(() => {
    getNotifications();
  },[JSON.stringify(pagination), searchText]);

  const columns = [
    {
      title: (
        <Checkbox
          indeterminate={selectedRows.length > 0 && selectedRows.length < notification.length}
          checked={selectedRows.length === notification.length}
          onChange={handleSelectAllRows}
        />
      ),
      dataIndex: "selected",
      key: "selected",
      render: (_: any, record: any) => (
        <Checkbox
          checked={selectedRows.includes(record.key as Key)}
          onChange={() => handleSelectRow(record)}
        />
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a: any, b: any) => a.date.localeCompare(b.date),
      sortOrder: sortedInfo.columnKey === 'date' ? sortedInfo.order : null,
    },
    {
      title: "Notification",
      dataIndex: "notification",
      key: "notification",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_: any, record: any) => (
        <div className={"table-actions"}>
          <Button onClick={() => handleViewMore(record.application, record.key)} style={{backgroundColor: record.isRead ? "#fff": "#2816EE", color: record.isRead ? "black": "#fff", border: record.isRead ? "1px solid rgba(214, 215, 224, 0.40)": "" }} className={"table-btn-view"}>View More</Button>
          <Button onClick={() => deletedNotification(record.key)} className={"table-btn-delete"}><DeleteOutlined /></Button>
        </div>
      ),
    },
  ];

    const handleTableChange = (
      pagination: TablePaginationConfig,
      sorter: SorterResult<DataType>,
    ) => {
      setPagination(prevPagination => ({...prevPagination, current:pagination.current}))
      setSortedInfo(sorter);
    };


  return (
    <Section className={"notifications-section"}>
      <Breadcrumb>
        <Breadcrumb.Item href={"/"}>
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>Notifications</Breadcrumb.Item>
      </Breadcrumb>
      <h2 className={"notifications-section-title"}>Notifications</h2>
      <AutoComplete
        dropdownMatchSelectWidth={252}
        style={{ width: 300, marginBottom: 32 }}
        onSearch={handleSearch}
      >
        <Input.Search
          size={"large"}
          placeholder={"Search Notifications"}
          enterButton
        />
      </AutoComplete>
      <div className={"table-wrapper"}>
        <Table
          dataSource={notification}
          columns={columns}
          onChange={handleTableChange}
          pagination={{
            ...pagination,
            position: ['bottomRight'],
            style: { marginTop: '24px' },
            className: "pagination"
          }}
          bordered={true}
        />
      </div>
    </Section>
  );
};

export default NotificationsTutor;

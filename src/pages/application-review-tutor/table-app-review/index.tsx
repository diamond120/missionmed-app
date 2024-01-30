

import "./index.less"
import React, { useEffect, useState } from "react"
import { Table, Tabs, Pagination } from 'antd';
import { useApplicationsQuery } from "../../../graphql"
import { formatDistanceToNow, format, parseISO } from 'date-fns';
import { Link } from "react-router-dom"
const { TabPane } = Tabs;

const TableAppReview = () => {
  const [activeTab, setActiveTab] = useState('New Application');
  //const [updateApplication] = useUpdateApplicationMutation();
  //const applications = useApplicationsQuery().data?.applications?.data;
  const applications = [];

  const application = applications?.map((item) => {

    let statusApp = "";
    if (item.attributes?.stage === "Initial_Draft") {
      statusApp = "Initial Draft";
    }
    if (item.attributes?.stage === "In_Progress") {
      statusApp = "New Application";
    }
    if (item.attributes?.stage === "In_Progress" && item.attributes.reviewer?.data?.id !== undefined) {
      statusApp = "In Progress";
    }
    if (item.attributes?.stage === "Initial_Review_Complete") {
      statusApp = "Initial Review Complete";
    }
    if (item.attributes?.stage === "Final_Review") {
      statusApp = "Final Review";
    }
    if (item.attributes?.stage === "In_Progress_Final") {
      statusApp = "In Progress";
    }
    if (item.attributes?.stage === "Final_Review_Complete") {
      statusApp = "Final Review Complete";
    }

    const deadline = item.attributes?.deadline
      ? formatDistanceToNow(parseISO(item.attributes.deadline))
      : '';

    let deadlineColor = '';
    if (deadline.includes('day')) {
      const daysLeft = Number(deadline.split(' ')[0]);
      if (daysLeft <= 1) {
        deadlineColor = '#FF4D4F';
      } else if (daysLeft <= 3) {
        deadlineColor = '#FAAD14';
      } else {
        deadlineColor = '#52C41A';
      }
    }

    return {
      ...item,
      key: item.id,
      name: item.attributes?.student?.data?.attributes?.full_name!,
      type: item.attributes?.title!,
      status: (
        <span
          className={statusApp === "Final Review Complete" ? "green-status" : "blue-status"}
        >
          {statusApp}
        </span>
      ),
      deadline: activeTab === "Final Review Complete" ?

        format(item.attributes?.updatedAt ? new Date(item?.attributes?.updatedAt) : new Date(), 'dd MMM, yyyy')

        :
        (
          <span
            className={"deadline"}
            style={{
              color:
              deadlineColor,
            }}
          >
          {item.attributes?.deadline ? formatDistanceToNow(parseISO(item.attributes.deadline)) : ''}
        </span>
        ),
    };
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };


  const filteredApplications = application?.filter((item) => {
    if (activeTab === "Accepted" && item.status.props.children !== "Final Review Complete") {
      return item.attributes?.reviewer?.data?.id !== undefined;
    }else if (activeTab === "Final Review Complete"){
      return item.status.props.children === "Final Review Complete";
    } else  {
      return item.status.props.children === activeTab;
    }
  });




  const acceptedApplication =  (id:string) => {
    // try {
    //   updateApplication({
    //     variables: {
    //       id: id,
    //       input: {
    //         reviewer: "1",

    //       },
    //     },
    //   });

    // } catch (error) {
    //   console.error('Update application error:', error);
    // }
  };



  const columns = [
    {
      title: <h4 className={"table-col-title"}>Student Name</h4>,
      dataIndex: 'name',
      sorter: (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name),
    },
    {
      title: <h4 className={"table-col-title"}>Application Type</h4>,
      dataIndex: 'type',
    },
    {
      title: <h4 className={"table-col-title"}>Status</h4>,
      dataIndex: 'status',
      sorter: (a: { status: string }, b: { status: string }) => a.status.localeCompare(b.status),
    },
    {
      title: activeTab === "Final Review Complete" ? <h4 className={"table-col-title"}>Completion Date</h4> : <h4 className={"table-col-title"}>Deadline</h4>,
      dataIndex: 'deadline',
      sorter: (a: { deadline: string }, b: { deadline: string }) => a.deadline.localeCompare(b.deadline),
    },
    {
      title: <h4 className={"table-col-title"}>Action</h4>,
      dataIndex: 'action',
      render: (text: string, record: { key: string }) => {
        if (activeTab === "New Application") {
          return (
            <button onClick={()=>{acceptedApplication(record.key)}} className={"table-col-action-btn"}>
              Accept
            </button>
          );
        } else if (activeTab === "Accepted") {
          return (
            <Link to={`/tutor/reviewing_process/${record.key}`}><button className={"table-col-action-btn-review"}>
              Review
            </button></Link>
          );
        } else if (activeTab === "Final Review Complete") {
          return (
            <Link to={`/tutor/reviewing_process/${record.key}`}>
              <button  className={"table-col-action-btn-check"}>
                Check Details
              </button>
            </Link>
          );
        }
        return null;
      },
    },
  ];

  return (
    <div className={"app-review-table-wrap"}>
      <Tabs className={"app-review-table-tabs"} activeKey={activeTab} onChange={handleTabChange}>
        <TabPane className={"app-review-table-tab"} tab={"New Applications"} key={"New Application"}></TabPane>
        <TabPane className={"app-review-table-tab"} tab={"Accepted"} key={"Accepted"}></TabPane>
        <TabPane className={"app-review-table-tab"} tab={"Completed"} key={"Final Review Complete"}></TabPane>
      </Tabs>
      <Table
        className={"app-review-table"}
        dataSource={filteredApplications}
        columns={columns as any}
        pagination={{
          position: ['bottomRight'],
          style: { marginTop: '24px' },
          className: "pagination"
        }}
        bordered={true}
        footer={() => <div></div>}
      />
    </div>
  );
};

export default TableAppReview;
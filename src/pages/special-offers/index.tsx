import React from 'react'
import { Breadcrumb, Alert, Space, Divider, message, Tooltip } from 'antd'
import { HomeOutlined, QuestionCircleFilled } from "@ant-design/icons";
import "./index.less";
import Offer from '../../assets/images/offer.png'

function SpecialOffers() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [messageApi, contextHolder] = message.useMessage();

  // function copyCode(text: string) {
  //   try {
  //     navigator.clipboard.writeText(text)
  //     messageApi.success('Copied');
  //   } catch (error: any) {
  //     messageApi.error(error)
  //   }
  // }

  return (
    <React.Fragment>
      {/* {contextHolder} */}
      <Breadcrumb>
        <Breadcrumb.Item href={"/"}>
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>Special Offers</Breadcrumb.Item>
      </Breadcrumb>
      <div className={"con-section-wrap special-offers"}>
        <div className="flex">
          <h2 className={"tab-title"}>Special Offers</h2>
        </div>

        <h2 className={"secondary-title"}>Discounts from Partners
          <Tooltip title="We have partnered with other tutoring centres to offer you discounts as a MissionMed student.">
            <QuestionCircleFilled style={{ marginLeft: "8px" }} /></Tooltip>
        </h2>

        <Alert
          message="As a student of MissionMed you also get exclusive discounts with our official partners. These promotional codes will only work for those who are our students. You must enter the discount code exactly as it appears into the partner’s checkout page promotional code section."
          type="info"
          closable
          showIcon
        />

        <div className='card-container' onClick={() => window.open('https://zhangshsc.com.au/', '_blank')} >
          {Array.from({ length: 1 })?.map((item,index) => (
            <div className='card' key={index}>
              <div className='card-header'>
                <label>Zhang’s HSC Coaching</label>
                <span>11 State Ranks in Physics, Chemistry (2023)</span>
              </div>
              <img className='offer-img' src={Offer} />
              <div className='details'>
                <span className='helights-label'>Highlights</span>
                <div className='helights'>
                  <span>• Offers Chemistry, Physics</span>
                  <span>• 12 Full Mark 99.95s in 2023</span>
                  <span>• 11 State Ranks in 2023</span>
                </div>
                <Space split={<Divider type="vertical" />}>
                  <span>15% OFF</span>
                  <span
                  // style={{ cursor: 'pointer' }}
                  // onClick={() => copyCode('MISSIONMED')}
                  >MISSIONMED</span>
                </Space>
              </div>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment >
  )
}

export default SpecialOffers
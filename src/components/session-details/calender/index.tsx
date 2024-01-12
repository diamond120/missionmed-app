import "./index.less"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from '@fullcalendar/timegrid'
import { useEffect, useState } from "react";
import { Button, Form, Modal, Radio, Spin, message } from "antd";
import CommonService from "../../../api/services/Common";
import { LoadingOutlined } from '@ant-design/icons';
import { formatTime } from "../../../common/common";

function formatDate(inputDateStr) {
  const inputDate = new Date(inputDateStr);
  const year = inputDate.getFullYear();
  const month = (inputDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
  const day = inputDate.getDate().toString().padStart(2, '0');
  const hours = inputDate.getHours().toString().padStart(2, '0');
  const minutes = inputDate.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  // Convert hours from 24-hour format to 12-hour format
  const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-${day} ${formattedHours}:${minutes} ${ampm}`;
  return formattedDate;
}

const Calender = ({ tutorId, rescheduleDate, form, moduleType, timezone, next }) => {

  const [slotsList, setSlots] = useState([]);
  const [filterDate, setfilterDate] = useState({});
  const [filterDateSet, setFilterDateSet] = useState(false);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subSlotList, setSubSlotList] = useState<any>([]);
  const [spin, setSpin] = useState<boolean>(true);

  const handleDateClick = (dateInfo) => {
    console.log('handleDateClick');
    const dateObjectEnd = new Date(dateInfo.endStr);
    const dateObjectStart = new Date(dateInfo.startStr);
    const data = {
      'startDate': dateObjectStart.toISOString().split('T')[0],
      'endDate': dateObjectEnd.toISOString().split('T')[0],
    };
    setfilterDate(data);
    setFilterDateSet(true);
  }

  const getSlotsist = async (tutorId) => {
    console.log('getSlotsist');
    try {

      const data = {
        tutorId: tutorId,
        startDate: filterDate.startDate,
        endDate: filterDate.endDate,
        rescheduleDate: rescheduleDate,
        type: 'teachingsession',
      };

      let response = await CommonService.postAPI("/student/slots-list", data);

      if (response.data.success) {
        const slotList = response.data.data ?? [];
        setSlots(slotList);
        setSpin(false);
      } else {
        setSpin(false);
        throw new Error(response.data.message);
      }
    } catch (e) {
      setSpin(false);
      message.error(e.message);
    }
  };

  useEffect(() => {
    // if (filterDateSet == true) {
    getSlotsist(tutorId);
    // }
  }, [tutorId, filterDate, filterDateSet, subSlotList]);

  let selectedEvent = null;

  const handleEventClick = async (info) => {
    console.log('handleEventClick');
    const clickedEvent = info.event;
    if (clickedEvent.title == 'Available') {
      if (selectedEvent) {
        selectedEvent.setProp('backgroundColor', '#ffffff');
        selectedEvent.setProp('textColor', '#2816EE');
        // Reset the color to default (empty string)
      }
      clickedEvent.setProp('backgroundColor', '#2816EE');
      clickedEvent.setProp('textColor', '#ffffff');
      selectedEvent = clickedEvent;
      const startDate = formatDate(clickedEvent.start);
      const endDate = formatDate(clickedEvent.end);
      const date = clickedEvent.extendedProps.day;
      // form.setFieldValue('sessionStartTime', startDate);
      // form.setFieldValue('sessionEndTime', endDate);
      // form.setFieldValue('date', date);
      setSlot(startDate, endDate, date);
    }
  };

  const setSlot = async (startDate, endDate, date) => {
    setSpinning(true);
    try {
      const data = {
        tutorId: tutorId,
        startDate: startDate,
        endDate: endDate,
        date: date,
        type: 'teachingsession',
        timezone: timezone,
        rescheduleDate: rescheduleDate,
        start: filterDate.startDate,
        end: filterDate.endDate,
      };

      let response = await CommonService.postAPI("/student/multiple-slots", data);
      if (response.data.success && response.data.data.length > 0) {
        const list = response.data.data ?? [];
        setSubSlotList(list);
        setSpinning(false);
        setIsModalOpen(true);
      } else {
        setSpinning(false);
        throw new Error(response.data.message);
      }
    } catch (e) {
      setSpinning(false);
      message.error(e.message);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async () => {
    const data = form.getFieldsValue(true);
    if (subSlotList.length > 0 && data.subSlot >= 0) {
      const slot = subSlotList[data.subSlot];
      form.setFieldValue('sessionStartTime', slot.start);
      form.setFieldValue('sessionEndTime', slot.end);
      form.setFieldValue('date', slot.date);
    }
    await form.validateFields();
    setIsModalOpen(false);
    next();
  }

  return (
    <>
      {spinning && <> <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 24, marginRight: 10 }} spin />} /> <span> Finding available slot......</span> </>
      }
      <Form.Item name="date" hidden={true} rules={[{ required: true, message: "Please select date" }]}></Form.Item>
      <Form.Item name="sessionStartTime" hidden={true} rules={[{ required: true, message: "Please select slot" }]}></Form.Item>
      <Form.Item name="sessionEndTime" hidden={true} rules={[{ required: true, message: "Please select slot" }]}></Form.Item>
      {(slotsList.length == 0 && spin) ?
        <>
          <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 24, marginRight: 10 }} spin />} /> <span> Finding available slot......</span>
        </>
        :
        <>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            dayHeaders={true}
            headerToolbar={{
              left: 'today',
              center: "prev,title,next",
              right: "timeGridWeek,dayGridMonth"
            }}

            events={slotsList}
            selectable={true}
            eventClick={handleEventClick}
            eventBorderColor='0'
            datesSet={handleDateClick}
          />

          <Modal
            title={moduleType == 'ucatStudent' ? 'Available Slot For UCAT Teaching Session' : 'Available Slot For Student Teaching Session'}
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
                style={{ marginTop: "17px", marginBottom: "0px" }}
                label="Slot Timing"
                name="subSlot"
                rules={[{ required: true, message: "Please select slot." }]}
              >
                <Radio.Group >
                  {subSlotList.map((slot, index) => (
                    <Radio key={index} value={index}>{`${formatTime(slot.start)} - ${formatTime(slot.end)}`}</Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            </Form>
          </Modal>
        </>
      }

    </>
  )
}

export default Calender
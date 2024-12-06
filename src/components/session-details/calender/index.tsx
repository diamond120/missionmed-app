import "./index.less"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from '@fullcalendar/timegrid'
import { useContext, useEffect, useMemo, useState } from "react";
import { Button, Form, Modal, Radio, Spin, message } from "antd";
import CommonService from "../../../api/services/Common";
import { LoadingOutlined } from '@ant-design/icons';
import { formatTime } from "../../../common/common";
import { useTutor } from "../../../api/providers/TutorProvider";
import { UserContext } from "../../../api/providers/UserProvider";
import { useRef } from 'react';
import moment from "moment";

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

const Calender = ({ tutorId, studentId, rescheduleDate, form, moduleType, timezone, next, prev }) => {
  const calendarRef = useRef(null);
  const [slotsList, setSlots] = useState([]);
  const [filterDate, setfilterDate] = useState({});
  const [filterDateSet, setFilterDateSet] = useState(false);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subSlotList, setSubSlotList] = useState<any>([]);
  const [weekAvailable, setWeekAvailable] = useState(true);
  const [weekDates,setWeekDates]= useState(null)
  const tutor = useTutor();
  const { user } = useContext(UserContext);
  const handleDateClick = (dateInfo) => {
    const dateObjectEnd = new Date(dateInfo.endStr);
    const dateObjectStart = new Date(dateInfo.startStr);
    const data = {
      'startDate': dateObjectStart.toISOString().split('T')[0],
      'endDate': dateObjectEnd.toISOString().split('T')[0],
    };
    setfilterDate(data);
    setFilterDateSet(true);
  } 

  const getSlotsist = async(tutorId, studentId, role) => {
    setSpinning(true)
    try {
      if(user.role === 'tutor')
      {
        studentId = studentId;
        tutorId = tutor.id;
      }
      const data = {
        studentId: studentId,
        tutorId: tutorId,
        role: user.role,
        startDate: filterDate.startDate,
        endDate: filterDate.endDate,
        rescheduleDate: rescheduleDate,
        type: 'teachingsession',
      };

      const response = await CommonService.postAPI("/student/slots-list", data);

      if (response.data.success) {
        const slotList = response.data.data ?? [];
        setSlots(slotList);
        setTimeout(() => {
          setSpinning(false);
          applyZIndexToUnavailable();
        }, 3000);
      } else {
        setTimeout(() => {
          setSpinning(false);
          applyZIndexToUnavailable();
        }, 3000);
        prev();
        throw new Error(response.data.message);
      }
    } catch (e) {
      setTimeout(() => {
        setSpinning(false);
      }, 3000);
      prev();
      message.error(e.message);
    }
  };

  const getWeekAvailable = async (tutorId, studentId) => {
    try {
      const params = {
        startDate : filterDate.startDate,
        endDate : filterDate.endDate,
        type :'teachingsession',
        role : user.role,
      }

      if(user.role == 'student') { 
        params.tutorId = tutorId 
      } else {
        params.studentId = studentId,
        params.tutorId = tutor.id 
      } 

      const response = await CommonService.postAPI("/student/slots-available",params);
      if (response.data.success) {
            setWeekAvailable(response.data.data)
            if(!response.data.data) {
              getAvailableWeekDates(tutorId, studentId)
            }else
            setWeekDates(null)
            
        } else {
        throw new Error(response.data.message);
      }

    }catch(error){
      console.log(error)
    }
  }

  const getAvailableWeekDates = async (tutorId, studentId) => {
    try {
      const params = {
        startDate : filterDate.startDate,
        endDate : filterDate.endDate,
        type :'teachingsession',
        role : user.role,
      }

      if(user.role == 'student') { 
        params.tutorId = tutorId 
      } else {
        params.studentId = studentId 
        params.tutorId = tutor.id 
      } 

      const response = await CommonService.postAPI("/student/available-week-slots",params);
      if (response.data.success) {
            setWeekDates(response.data.data)
        } else {
        throw new Error(response.data.message);
      }

    }catch(error){
      console.log(error)
    }
  }

  const memoizedGetSlotsist = useMemo(() => getSlotsist, [tutorId, studentId, filterDate, rescheduleDate]);

  const applyZIndexToUnavailable = () => {
    const availableElement = document.querySelectorAll('.available');
    availableElement.forEach(element => {
      element.parentNode.style.setProperty('z-index', '2', 'important');
    });
    const unavailableElement = document.querySelectorAll('.unavailable');
    unavailableElement.forEach(element => {
      element.parentNode.style.setProperty('z-index', '7', 'important');
    });
    const elementsWithABCClass = document.querySelectorAll('.otherslot');
    elementsWithABCClass.forEach(element => {
      element.parentNode.style.setProperty('z-index', '7', 'important');
    });
  };

  useEffect(() => {
    if (filterDateSet) {
      memoizedGetSlotsist(tutorId, studentId);
      getWeekAvailable(tutorId, studentId);
    }
    const addClassToParentAfterDateChange = () => {
      applyZIndexToUnavailable();
    };
    const timeoutId = setTimeout(addClassToParentAfterDateChange, 3000);

    return () => clearTimeout(timeoutId);
  }, [memoizedGetSlotsist, tutorId, filterDateSet]);

  // useEffect(() => {
  //   if (filterDateSet == true) {
  //     getSlotsist(tutorId);
  //   }
  // }, [tutorId, filterDate, filterDateSet, subSlotList]);

  let selectedEvent = null;

  const handleEventClick = async (info) => {
    const clickedEvent = info.event;
    if (clickedEvent.title == 'Available') {
      if (selectedEvent) {
        // selectedEvent.setProp('backgroundColor', '#ffffff');
        // selectedEvent.setProp('textColor', '#2816EE');
        // Reset the color to default (empty string)
      }
      // clickedEvent.setProp('backgroundColor', '#2816EE');
      // clickedEvent.setProp('textColor', '#ffffff');
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
    try {
      setSpinning(true);
      if(user.role === 'tutor')
      {
        studentId = studentId;
        tutorId = tutor.id;
      }
      const data = {
        tutorId: tutorId,
        startDate: startDate,
        role: user.role,
        endDate: endDate,
        date: date,
        type: 'teachingsession',
        timezone: timezone,
        rescheduleDate: rescheduleDate,
        start: filterDate.startDate,
        end: filterDate.endDate,
        studentId: studentId,
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
      let studentId;
    
      const slot = subSlotList[data.subSlot];
      form.setFieldValue('sessionStartTime', slot.start);
      form.setFieldValue('sessionEndTime', slot.end);
      form.setFieldValue('date', slot.date);
      form.setFieldValue('isFreeze', slot.isFreeze);
      form.setFieldValue('role', user.role);
      form.setFieldValue('newTutorId', data.tutorId);
      if(user.role === 'tutor')
      {
        data.tutorId = tutor.id
      }
      form.setFieldValue('studentId', data.studentId);
      form.setFieldValue('tutorId', data.tutorId);
    }
    await form.validateFields();
    setIsModalOpen(false);
    next();
  }
  const getDayName = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString('default', { weekday: 'long' });
  };

  useEffect(() => {
    const addClassToParentAfterDateChange = () => {
      applyZIndexToUnavailable();
    };
    const timeoutId = setTimeout(addClassToParentAfterDateChange, 3000);

    return () => clearTimeout(timeoutId);
  }, []); 

  const handleGoToWeek = () => {
      const calendarApi = calendarRef.current.getApi();
      if(weekDates?.week_start){
      const date = new Date(weekDates?.week_start); // Convert the selected date string to a Date object
      calendarApi.gotoDate(date); // Navigate to the selected date
  } };

  const weekStart = moment(weekDates?.week_start);
   const weekNumber = weekStart.week();
  return (
    <>
       {spinning && (
        <div className="overlay">
          <div className="spin-container">
            <Spin
              size="large"
              indicator={<LoadingOutlined style={{ fontSize: 48, marginRight: 10 }} spin />}
            />
            <span style={{ fontSize: '23px', marginLeft: '10px', color: '#fff' }}>Finding available slot......</span>
          </div>
        </div>
      )}
      <Form.Item name="date" hidden={true} rules={[{ required: true, message: "Please select date" }]}></Form.Item>
      <Form.Item name="sessionStartTime" hidden={true} rules={[{ required: true, message: "Please select slot" }]}></Form.Item>
      <Form.Item name="sessionEndTime" hidden={true} rules={[{ required: true, message: "Please select slot" }]}></Form.Item>
      <Form.Item name="isFreeze" hidden={true}></Form.Item>
      <Form.Item name="studentId" hidden={true}></Form.Item>
      <Form.Item name="role" hidden={true}></Form.Item>
      <Form.Item name="newTutorId" hidden={true}></Form.Item>

      <div>
      {!weekAvailable && (
        <>
        <div className="cus-alert">
          <div className="text-center">Please switch to</div>
          <button style={{backgroundColor:'transparent',border:0,padding:0,height:22,color:'#2816EE', cursor:'pointer'}} onClick={handleGoToWeek}>
            <strong>
              {`Week ${weekNumber} (${moment(weekDates?.week_start).format('MMM D')} - ${moment(weekDates?.week_end).format("D, YYYY")})`}
            </strong>
          </button>
          <div className="text-center">for more available dates.</div>

        </div>
      </>
      )}
        <FullCalendar
        ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="timeGridWeek"
          dayHeaders={true}
          headerToolbar={{
            left: 'today',
            center: "prev,title,next",
            right: "timeGridWeek,dayGridMonth"
          }}

          datesSet={handleDateClick}
          events={slotsList}
          selectable={true}
          eventClick={handleEventClick}
          eventBorderColor='0'
          allDaySlot={false}
        />
      </div>

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
            {subSlotList.map((slot, index) => {
                // Check if the current slot date is different from the previous slot's date
                const showDate = index === 0 || slot.date !== subSlotList[index - 1].date;

                return (
                    <div key={index}>
                        {showDate && <div style={{fontSize: "15px",color: "#000000",fontWeight: 600}}>{moment(slot.date).format('MMM DD, YYYY')} ({getDayName(slot.date)})</div>}
                        <Radio value={index}>
                            {`${formatTime(slot.start)} - ${formatTime(slot.end)}`}
                        </Radio>
                    </div>
                );
            })}
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Calender
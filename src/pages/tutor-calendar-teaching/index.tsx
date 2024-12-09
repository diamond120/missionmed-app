import "./index.less"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from '@fullcalendar/timegrid'
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Form, Modal, Radio, Spin, message } from "antd";
import CommonService from "../../api/services/Common";
import { LoadingOutlined } from '@ant-design/icons';
import { formatTime } from "../../common/common";
import { useParams } from 'react-router-dom';
import { FilterDateType, WeekDateType } from "./type";
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

  const TutorCalendarTeaching = (tutorId, next, form) => {
  const [ipAddress, setIpAddress] = useState([]);
  const [timezoneNew, setTimezone] = useState('');
    useEffect(() => {
      const fetchIpAddress = async () => {
        try {
          const response = await fetch('https://api64.ipify.org?format=json');
          const data = await response.json();
          setIpAddress(data.ip);
        } catch (error) {
          console.error('Error fetching IP address:', error);
        }
      };

      fetchIpAddress();
    }, []);

    // Fetch timezone only when ipAddress is available
    useEffect(() => {
      if (ipAddress) {
          const fetchTimezone = async () => {
              try {
                  const timezoneResponse = await fetch(`https://ipapi.co/${ipAddress}/timezone/`);
                  const timezoneData = await timezoneResponse.text();
                  setTimezone(timezoneData);
              } catch (error) {
                  console.error('Error fetching timezone:', error);
              }
          };
          fetchTimezone();
      }
    }, [ipAddress]);

    const { ID } = useParams();
    const longTimeZone = timezoneNew;
    const calendarRef = useRef<FullCalendar>(null);
    const calTutorId = parseInt(ID); 
    const [slotsList, setSlots] = useState([]);
    const [filterDate, setFilterDate] = useState<FilterDateType>();
    const [filterDateSet, setFilterDateSet] = useState(false);
    const [spinning, setSpinning] = useState<boolean>(false);
    const [weekAvailable, setWeekAvailable] = useState<boolean>(true);
    const [weekDates,setWeekDates]= useState<WeekDateType|null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [subSlotList, setSubSlotList] = useState<any>([]);
    const [spin, setSpin] = useState<boolean>(true);

    const handleDateClick = (dateInfo) => {
      const dateObjectEnd = new Date(dateInfo.endStr);
      const dateObjectStart = new Date(dateInfo.startStr);
      const data: FilterDateType = {
        'startDate': dateObjectStart.toISOString().split('T')[0],
        'endDate': dateObjectEnd.toISOString().split('T')[0],
      };
      setFilterDate(data);
      setFilterDateSet(true);
    } 

    const getWeekAvailable = async (payload) => {
      try {
        setSpinning(true)
        const response = await CommonService.postAPI("/student/slots-available", payload);
        if (response.data.success) {
            setWeekAvailable(response.data.data)
            if(!response.data.data) {
              getAvailableWeekDates(payload)
            } else {
              setWeekDates(null)
              setSpinning(false)
            }
          } else {
          throw new Error(response.data.message);
        }
      } catch(error){
        setSpinning(false)
        console.log(error)
      }
    }

    const getAvailableWeekDates = async (payload) => {
      try {
        setSpinning(true)
        const response = await CommonService.postAPI("/student/available-week-slots", payload);
        if (response.data.success) {
          setWeekDates(response.data.data)
        } else {
          throw new Error(response.data.message);
        }
      } catch(error){
        console.log(error)
      } finally {
        setSpinning(false)
      }
    }

    const getSlotsist = async() => {
        try {
          setSpin(true);
          const data = {
            tutorId: calTutorId,
            role: 'student',
            startDate: filterDate?.startDate,
            endDate: filterDate?.endDate,
            type: 'teachingsession',
            timezone: longTimeZone
          };
    
          const response = await CommonService.postAPI("/tutors-calendar-list", data);
          getWeekAvailable(data)
    
          if (response.data.success) {
            const slotList = response.data.data ?? [];
            setSlots(slotList);
            setSpin(false);
          } else {
            setSpin(false);

            throw new Error(response.data.message);
          }
        } catch (e) {
          setSpin(false)
          message.error(e.message);
        }
      };

      const memoizedGetSlotsList = useMemo(() => getSlotsist, [tutorId, filterDate, timezoneNew]);

      useEffect(() => {
        if (filterDateSet && timezoneNew) {
          memoizedGetSlotsList(tutorId);
        }
        const addClassToParentAfterDateChange = () => {
          const elementsWithABCClass = document.querySelectorAll('.otherslot');
          elementsWithABCClass.forEach(element => {
            element.parentNode.classList.add('bookedslot');
          });
  
          const unavailableElement = document.querySelectorAll('.unavailable');
  
          unavailableElement.forEach(element => {
            element.parentNode.style.zIndex = 7;
          });
        };
        const timeoutId = setTimeout(addClassToParentAfterDateChange, 3000);
  
        return () => clearTimeout(timeoutId);
      }, [memoizedGetSlotsList, tutorId, filterDateSet, timezoneNew]);


      let selectedEvent = null;

    const handleEventClick = async (info) => {
      const clickedEvent = info.event;
      if (clickedEvent.title == 'Available') {
        if (selectedEvent) {
          // selectedEvent.setProp('backgroundColor', '#ffffff');
          // selectedEvent.setProp('textColor', '#2816EE');
          // Reset the color to default (empty string)
        }
        selectedEvent = clickedEvent;
    
        const startDate = formatDate(clickedEvent.start);
        const endDate = formatDate(clickedEvent.end);
        const date = clickedEvent.extendedProps.day;
        setSlot(startDate, endDate, date);
      }
    };

  const setSlot = async (startDate, endDate, date, studentId) => {
    try {
      setSpin(true);
     
      const data = {
        tutorId: calTutorId,
        startDate: startDate,
        role: 'student',
        endDate: endDate,
        date: date,
        type: 'teachingsession',
        timezone: longTimeZone,
        start: filterDate.startDate,
        end: filterDate.endDate,
      };

      const response = await CommonService.postAPI("/tutors-multipleslot-list", data);
      if (response.data.success && response.data.data.length > 0) {
        const list = response.data.data ?? [];
        setSubSlotList(list);
        setSpin(false);
        setIsModalOpen(true);
      } else {
        setSpin(false);
        throw new Error(response.data.message);
      }
    } catch (e) {
      setSpin(false);
      message.error(e.message);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleGoToWeek = () => {
    const calendarApi = calendarRef?.current?.getApi();
    if (weekDates?.week_start) {
        const date = new Date(weekDates?.week_start); // Convert the selected date string to a Date object
        calendarApi?.gotoDate(date); // Navigate to the selected date
    }
  };

  useEffect(() => {
    const addClassToParentAfterDateChange = () => {
      const availableElements = document.querySelectorAll('.available-index');
      availableElements.forEach(element => {
        element.parentNode.classList.add('available-index');
      });
      const elementsWithABCClass = document.querySelectorAll('.otherslot');
      elementsWithABCClass.forEach(element => {
        element.parentNode.classList.add('bookedslot');
      });

      const unavailableElement = document.querySelectorAll('.unavailable');

      unavailableElement.forEach(element => {
        element.parentNode.style.zIndex = 7;
      });
    };
    const timeoutId = setTimeout(addClassToParentAfterDateChange, 3000);

    return () => clearTimeout(timeoutId);
  }, []); 

    return (
        <>
          {(spin || spinning) && (
            <>
              <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 24, marginRight: 10 }} spin />} />
              <span> Finding {!spin && spinning ? 'next' : ''} available slot......</span>
            </>
          )}
          {!weekAvailable && weekDates?.week_start && (
            <>
            <div className="cus-alert">
              <div className="text-center">Please switch to</div>
              <button style={{backgroundColor:'transparent',border:0,padding:0,height:22,color:'#2816EE', cursor:'pointer'}} onClick={handleGoToWeek}>
                <strong>
                  {`Week ${moment(weekDates?.week_start).week()} (${moment(weekDates?.week_start).format('MMM D')} - ${moment(weekDates?.week_end).format("D, YYYY")})`}
                </strong>
              </button>
              <div className="text-center">for more available dates.</div>

            </div>
          </>
          )}
          <div style={{ width: "1155px",margin: '0 auto'}}>
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
          { <Modal
            title={'Available Slots'}
            open={isModalOpen}
            onCancel={handleCancel}
            className={"mock-interview-modal modal-without-login-slot"}
            width={"240px"}
            footer={[
              <div key="buttonGroup" className='button-group'>
                <Button key="discard" type="dashed" className={"secondary-button"} onClick={handleCancel}>
                  Close
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
          </Modal>}
        </>
    )
}

export default TutorCalendarTeaching;
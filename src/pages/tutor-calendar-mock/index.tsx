import "./index.less"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from '@fullcalendar/timegrid'
import { useEffect, useMemo, useState } from "react";
import { Button, Form, Modal, Radio, Spin, message } from "antd";
import CommonService from "../../api/services/Common";
import { LoadingOutlined } from '@ant-design/icons';
import { formatTime } from "../../common/common";
import { useParams } from 'react-router-dom';
import { timezoneMapping } from "../../components/layout/timezone";
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

const TutorCalendarMock = (tutorId, next, form) => {
    const { ID } = useParams();
    const calTutorId = parseInt(ID); 
    const { timezone } = useParams();
    const longTimeZone = timezoneMapping[timezone];
    const [slotsList, setSlots] = useState([]);
    const [filterDate, setfilterDate] = useState({});
    const [filterDateSet, setFilterDateSet] = useState(false);
    const [spinning, setSpinning] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [subSlotList, setSubSlotList] = useState<any>([]);
    const [spin, setSpin] = useState<boolean>(true);
    // const tutor = useTutor();
    // const user = useUser();
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

    const getSlotsist = async() => {
        
        try {
          const data = {
            tutorId: calTutorId,
            role: 'tutor',
            startDate: filterDate.startDate,
            endDate: filterDate.endDate,
            type: 'mockinterview',
            timezone: longTimeZone
          };
    
          const response = await CommonService.postAPI("/tutors-calendar-list", data);
    
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

      const memoizedGetSlotsist = useMemo(() => getSlotsist, [tutorId, filterDate]);

      useEffect(() => {
        if (filterDateSet) {
          memoizedGetSlotsist(tutorId);
        }
      }, [memoizedGetSlotsist, tutorId, filterDateSet]);


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
      setSpinning(true);
     
      const data = {
        tutorId: calTutorId,
        startDate: startDate,
        role: 'tutor',
        endDate: endDate,
        date: date,
        type: 'mockinterview',
        timezone: longTimeZone,
        start: filterDate.startDate,
        end: filterDate.endDate,
      };

      let response = await CommonService.postAPI("/tutors-multipleslot-list", data);
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

  useEffect(() => {
    const addClassToParent = () => {
      const elementsWithABCClass = document.querySelectorAll('.otherslot');
      elementsWithABCClass.forEach(element => {
        element.parentNode.classList.add('bookedslot');
      });
    };
    const timeoutId = setTimeout(addClassToParent, 5000);
    return () => clearTimeout(timeoutId);
  }, []); 

    return (
        <>
            {spinning && <> <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 24, marginRight: 10 }} spin />} /> <span> Finding available slot......</span> </>}
          <div style={{ display: spin ? 'block' : 'none' }}>
            <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 24, marginRight: 10 }} spin />} />
            <span> Finding available slot......</span>
          </div>
            <FullCalendar
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
           
          { <Modal
            title={'Available Slots'}
            open={isModalOpen}
            onCancel={handleCancel}
            className={"mock-interview-modal"}
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
                style={{ marginBottom: "0px" }}
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
          </Modal>    }
        </>
    )
}

export default TutorCalendarMock;

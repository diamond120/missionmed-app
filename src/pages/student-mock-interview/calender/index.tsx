import "./index.less"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from '@fullcalendar/timegrid'
import { useEffect, useState } from "react";

import {
  Form,
  message
} from "antd";
import CommonService from "../../../api/services/Common";

function formatDate(inputDate) {
  const date = new Date(inputDate);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

  return formattedDate;
}

const Calender = ({tutorId, form}) => {

  const [slotsList, setSlots] = useState([]);
    const data = {
      tutorId: tutorId,
    };
    console.log(tutorId)
    const getSlotsist = async () => {
      try {
        const response = await CommonService.getSlotslist(data);
        if (response.data.success) {
            const slotList = response.data.data ?? [];
            console.log(slotList)
            setSlots(slotList);       
          } else {
          throw new Error(response.data.message); 
        }
      } catch (e) {
        message.error(e.message);
      }
    };

    useEffect(() => {
      getSlotsist();
    }, []);
    
    let selectedEvent = null;
    const handleEventClick = async (info) => {
      const clickedEvent = info.event;

      console.log(clickedEvent);
      if(clickedEvent.title == 'availabel'){
        
        if (selectedEvent) {
          selectedEvent.setProp('backgroundColor', '#ffffff');
          selectedEvent.setProp('textColor', '#2816EE'); // Reset the color to default (empty string)
        }
        clickedEvent.setProp('backgroundColor', '#2816EE');
        clickedEvent.setProp('textColor', '#ffffff');

        selectedEvent = clickedEvent;
        const startDate = formatDate(clickedEvent.start);
        const endDate = formatDate(clickedEvent.end);
        const date = clickedEvent.extendedProps.day;
        
        form.setFieldValue('sessionStartTime', startDate);
        form.setFieldValue('sessionEndTime', endDate);
        //form.setFieldValue('date', date);
        form.setFieldValue('date', "2023-09-26");
        
        // console.log('Event title:', clickedEvent.title);
        // console.log('Event date:', clickedEvent.extendedProps.day);
        // console.log('Event Start:', startDate);
        // console.log('Event End:', endDate);
      }
    };

    return (
      <>
      <Form.Item name="date" hidden={true} rules={[{ required: true , message:"Please select date"}]}></Form.Item>
      <Form.Item name="sessionStartTime" hidden={true} rules={[{ required: true , message:"Please select slot"}]}></Form.Item>
      <Form.Item name="sessionEndTime" hidden={true} rules={[{ required: true,  message:"Please select slot"}]}></Form.Item>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        dayHeaders={true}    
        headerToolbar={{
          left:'today',
          center: "prev,title,next",
          right: "timeGridWeek,dayGridMonth" 
        }}

        events={slotsList}
        eventColor='#2816EE'
        selectable={true} 
        eventClick={handleEventClick}
        borderColor='0'
      />
      </>
      
  )

}

export default Calender




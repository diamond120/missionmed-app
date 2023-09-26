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


const Calender = ({tutorId, form}) => {

  const [slotsList, setSlots] = useState([]);
    const data = {
      tutorId: tutorId,
    };
    const getSlotsist = async () => {
      try {
        const response = await CommonService.getSlotslist(data);
        if (response.data.success) {
            const slotList = response.data.data ?? [];
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
      if(clickedEvent.title == 'availabel'){
        //console.log(clickedEvent)
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




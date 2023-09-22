import "./index.less"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from '@fullcalendar/timegrid'
import { useEffect, useState } from "react";
import {
  message
} from "antd";
import CommonService from "../../../api/services/Common";


const Calender = () => {

  const [slotsList, setSlots] = useState([]);
    const data = {
      tutorId: 1,
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
    console.log(slotsList)
    return (
      <FullCalendar
     plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        dayHeaders={true}
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        }}
        events={slotsList}
        eventColor='#378006'
       
      />
  )
}

export default Calender




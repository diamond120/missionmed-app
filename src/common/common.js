import moment from 'moment';
import Payment from 'payment'

export const getToken = () => {
    const token = localStorage.getItem('jwt');
    return token;
}

export const makeOptions = (options) => {
    return options.map(o => ({value:o.id, label:o.title}))
}

export const stringToBoolean = (value) => {
    switch(value.toString().toLowerCase()) {
        case "false": 
        case "no": 
        case "0": 
        case "": 
            return false; 
        default: 
            return true;
    }
}

const formatHours= (hours, format = 'HH:mm') => {
    if(hours && hours.length > 0){
        // return hours.map(hours => ({start: moment(hours.start, format), end: moment(hours.end, format)}))
        return hours.map(hours => ({start: hours.start, end: hours.end}))
    }else{
        return hours;
    }
}

export const tutorWorkingHours = (workingHours, format) => {
    if(workingHours != null) {
      const formattedWorkingHours = workingHours.reduce((obj, workingHour) => {
        if(workingHour.day == "Monday"){
            return {...obj , isMondayOff: workingHour.dayOff, Monday:workingHour.dayOff ? [{start:"", end: ""}] : formatHours(workingHour.hours, format)}
        }else if(workingHour.day == "Tuesday"){
            return {...obj , isTuesdayOff: workingHour.dayOff, Tuesday: workingHour.dayOff ? [{start:"", end: ""}] : formatHours(workingHour.hours, format) }
        }else if(workingHour.day == "Wednesday"){
            return {...obj , isWednesdayOff: workingHour.dayOff, Wednesday: workingHour.dayOff ? [{start:"", end: ""}] : formatHours(workingHour.hours, format) }
        }else if(workingHour.day == "Thursday"){
            return {...obj , isThursdayOff: workingHour.dayOff, Thursday: workingHour.dayOff ? [{start:"", end: ""}] : formatHours(workingHour.hours, format) }
        }else if(workingHour.day == "Friday"){
            return {...obj , isFridayOff: workingHour.dayOff, Friday: workingHour.dayOff ? [{start:"", end: ""}] : formatHours(workingHour.hours, format) }
        }else if(workingHour.day == "Saturday"){
            return {...obj , isSaturdayOff: workingHour.dayOff, Saturday: workingHour.dayOff ? [{start:"", end: ""}] : formatHours(workingHour.hours, format) }
        }else if(workingHour.day == "Sunday"){
            return {...obj , isSundayOff: workingHour.dayOff, Sunday: workingHour.dayOff ? [{start:"", end: ""}] : formatHours(workingHour.hours, format) }
        }else{
            return obj
        }

      }, {})
      return formattedWorkingHours;
    } else {
      return {};
    }
} 

export const formatDate = (dateTime) => {
    return moment(dateTime).format("MM/DD/YYYY");
}

export const formatDateV1 = (dateTime) => {
    return moment(dateTime).format("ddd, DD MMM YYYY");
}

export const formatTime = (dateTime, dateTimeFormat="YYYY-MM-DD hh:mm a", format="hh:mm a") => {
    return moment(dateTime, dateTimeFormat).format(format);
}

export const checkSessionOnToday = (sessionDate) => {
    return moment().isSameOrAfter(sessionDate)
}

export const groupSessionsByDate = (sessions, orderBy="asc") => {
    if(orderBy=="asc"){
        sessions.sort( function ( a, b ) { return moment(a.date) - moment(b.date); } );
    }else{
        sessions.sort( function ( a, b ) { return moment(b.date) - moment(a.date); } );
    }
    const formatedSessions = sessions.reduce((obj, session) => {
      obj[session.date] = obj[session.date] || [];
      obj[session.date].push(session);
      return obj;
    }, {});
    return formatedSessions;
  };

export const fileName = (url) => {
    let filename = '';
    try {
      filename = new URL(url).pathname.split('/').pop();
    } catch (e) {
      console.error(e);
    }
    return filename;
}


export const onDownload = (url) => {
    const link = document.createElement("a");
    link.download = `download.txt`;
    link.href = url;
    link.target = "_blank";
    //document.body.appendChild(link);
    link.click();
    //link.parentNode.removeChild(link)
};

export const AgeList = [
    'Female',
    'Male'
]

export const getDay = (dateTime) => {
    return moment(dateTime).format('dddd');
}

function clearNumber (value = '') {
    return value.replace(/\D+/g, '')
  }
  
  export function formatCreditCardNumber (value) {
    if (!value) {
      return value
    }
  
    const issuer = Payment.fns.cardType(value)
    const clearValue = clearNumber(value)
    let nextValue
  
    switch (issuer) {
      case 'amex':
        nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
          4,
          10
        )} ${clearValue.slice(10, 15)}`
        break
      case 'dinersclub':
        nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
          4,
          10
        )} ${clearValue.slice(10, 14)}`
        break
      default:
        nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
          4,
          8
        )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 19)}`
        break
    }
  
    return nextValue.trim()
  }
  
  export function formatCVC (value, prevValue, allValues = {}) {
    const clearValue = clearNumber(value)
    let maxLength = 3
  
    if (allValues.number) {
      const issuer = Payment.fns.cardType(allValues.number)
    }
  
    return clearValue.slice(0, maxLength)
  }
  
  export function formatExpirationDate (value) {
    const clearValue = clearNumber(value)
  
    if (clearValue.length >= 3) {
      return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`
    }
  
    return clearValue
  }
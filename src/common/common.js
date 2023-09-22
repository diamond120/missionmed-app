import moment from 'moment';

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

const formatHours= (hours) => {
    const format = 'HH:mm';
    if(hours && hours.length > 0){
        return hours.map(hours => ({start: moment(hours.start, format), end: moment(hours.end, format)}))
    }else{
        return hours;
    }
}

export const tutorWorkingHours = (workingHours) => {
    const formattedWorkingHours = workingHours.reduce((obj, workingHour) => {
        if(workingHour.day == "Monday"){
            return {...obj , isMondayOff: workingHour.dayOff, Monday:workingHour.dayOff ? [{start:"", end: ""}] : formatHours(workingHour.hours)}
        }else if(workingHour.day == "Tuesday"){
            return {...obj , isTuesdayOff: workingHour.dayOff, Tuesday: workingHour.dayOff ? [{start:"", end: ""}] : formatHours(workingHour.hours) }
        }else if(workingHour.day == "Wednesday"){
            return {...obj , isWednesdayOff: workingHour.dayOff, Wednesday: workingHour.dayOff ? [{start:"", end: ""}] : formatHours(workingHour.hours) }
        }else if(workingHour.day == "Thursday"){
            return {...obj , isThursdayOff: workingHour.dayOff, Thursday: workingHour.dayOff ? [{start:"", end: ""}] : formatHours(workingHour.hours) }
        }else if(workingHour.day == "Friday"){
            return {...obj , isFridayOff: workingHour.dayOff, Friday: workingHour.dayOff ? [{start:"", end: ""}] : formatHours(workingHour.hours) }
        }else if(workingHour.day == "Saturday"){
            return {...obj , isSaturdayOff: workingHour.dayOff, Saturday: workingHour.dayOff ? [{start:"", end: ""}] : formatHours(workingHour.hours) }
        }else if(workingHour.day == "Sunday"){
            return {...obj , isSundayOff: workingHour.dayOff, Sunday: workingHour.dayOff ? [{start:"", end: ""}] : formatHours(workingHour.hours) }
        }else{
            return obj
        }

    }, {})
    
    return formattedWorkingHours;
} 

export const formatDate = (dateTime) => {
    return moment(dateTime).format("MM/DD/YYYY");
}

export const formatDateV1 = (dateTime) => {
    return moment(dateTime).format("ddd, DD MMM YYYY");
}

export const checkSessionOnToday = (sessionDate) => {
    return moment().isSameOrAfter(sessionDate)
}
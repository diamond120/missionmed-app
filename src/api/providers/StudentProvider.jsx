import { createContext, useContext, useReducer } from 'react';
import { stringToBoolean } from '../../common/common';
import { useEffect, useState } from "react";

const StudentContext = createContext(null);

const StudentDispatchContext = createContext(null);

const initialStudent = {
  loading:false
};

export function StudentProvider({ children }) {
  const [student, dispatch] = useReducer(
    StudentReducer,
    initialStudent
  );


useEffect(() => {
  const storedStudent = localStorage.getItem('student');
  if (storedStudent) {
    dispatch({ type: 'update', student: JSON.parse(storedStudent) });
  }
}, []);

// Save student data to local storage whenever it changes
useEffect(() => {
  localStorage.setItem('student', JSON.stringify(student));
}, [student]);


  return (
    <StudentContext.Provider value={student}>
      <StudentDispatchContext.Provider value={dispatch}>
        {children}
      </StudentDispatchContext.Provider>
    </StudentContext.Provider>
  );
}


export function useStudent() {
  return useContext(StudentContext);
}

export function useStudentDispatch() {
  return useContext(StudentDispatchContext);
}

function StudentReducer(student, action) {
    switch (action.type) {
        case 'loading':{
          return{...student, loading:action.loading}
        }
        case 'add': {
          return {
              id:action.id,
              userId:action.userId,
              fullName:action.fullName,
              gender:action.gender,
              pronouns:action.pronouns,
              birthday:action.birthday,
              email:action.email,
              phoneNumber:action.phoneNumber,
              state:action.state,
              location:action.location,
              timezone:action.timezone,
              biography:action.biography,
              profilePicture:action.profilePicture,
              applicantCycle:action.applicantCycle,
              applicantTypeId:action.applicantTypeId,
              atar:action.atar,
              gpa:action.gpa,
              credit:action.credit,
              statusOfResidence:action.statusOfResidence,
              specification:action.specification,
              atsi:stringToBoolean(action.atsi),
              rural:stringToBoolean(action.rural),
              financialHardship:stringToBoolean(action.financialHardship),
              gws:stringToBoolean(action.gws),
              card_digit:action.card_digit,
              country: action.country,
              timezone_id:action.timezone_id,
              is_48_hour_remainder_enable: action.is_48_hour_remainder_enable,
              is_24_hour_remainder_enable: action.is_24_hour_remainder_enable,
              is_30_minute_remainder_enable: action.is_30_minute_remainder_enable
          };
        }
        case 'update': {
          return {...student, ...action.student}
        }
        case 'reset': {
          return {}
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}
import { createContext, useContext, useReducer } from 'react';

const StudentContext = createContext(null);

const StudentDispatchContext = createContext(null);

const initialStudent = {};

export function StudentProvider({ children }) {
  const [student, dispatch] = useReducer(
    StudentReducer,
    initialStudent
  );

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
  console.log(student, action);
    switch (action.type) {
        case 'add': {
          console.log("action", action);
          return {
              id:action.id,
              userId:action.user_id,
              fullName:action.full_name,
              gender:action.gender,
              pronouns:action.pronouns,
              birthday:action.birthday,
              email:action.email,
              phoneNumber:action.phone_number,
              stateId:action.state_id,
              locationId:action.location_id,
              timezoneId:action.timezone_id,
              biography:action.biography,
              profilePicture:action.profile_picture,
              applicantCycle:action.applicant_cycle,
              applicantTypeId:action.applicant_type_id,
              atar:action.atar,
              gpa:action.gpa,
              statusOfResidence:action.status_of_residence,
              specification:action.specification,
              atsi:action.atsi,
              rural:action.rural,
              financialHardship:action.financial_hardship,
              gws:action.gws,
          };
        }
        case 'update': {
          return action.student;
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}
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
    switch (action.type) {
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
              statusOfResidence:action.statusOfResidence,
              specification:action.specification,
              atsi:action.atsi,
              rural:action.rural,
              financialHardship:action.financialHardship,
              gws:action.gws,
          };
        }
        case 'update': {
          return {...student, ...action.student}
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}
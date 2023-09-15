import { createContext, useContext, useReducer } from 'react';
import { stringToBoolean } from '../../common/common';

const TutorContext = createContext(null);

const TutorDispatchContext = createContext(null);

const initialTutor = {};

export function TutorProvider({ children }) {
  const [tutor, dispatch] = useReducer(
    TutorReducer,
    initialTutor
  );

  return (
    <TutorContext.Provider value={tutor}>
      <TutorDispatchContext.Provider value={dispatch}>
        {children}
      </TutorDispatchContext.Provider>
    </TutorContext.Provider>
  );
}

export function useTutor() {
  return useContext(TutorContext);
}

export function useTutorDispatch() {
  return useContext(TutorDispatchContext);
}

function TutorReducer(tutor, action) {
    switch (action.type) {
        case 'add': {
          return {
            id:action.id,
            userId:action.userId,
            fullName:action.fullName,
            preferredName:action.preferredName,
            gender:action.gender,
            pronouns:action.pronouns,
            email:action.email,
            location:action.location,
            timezone:action.timezone,
            biography:action.biography,
            lessionType:action.lessionType,
            bufferTime:action.bufferTime,
            workingHours:action.workingHours,
            ucatTutoring:stringToBoolean(action.ucatTutoring),
            ucatTutoringPrice:action.ucatTutoringPrice,
            interviewTutoring:stringToBoolean(action.interviewTutoring),
            interviewTutoringPrice:action.interviewTutoringPrice,
            mockInterview:stringToBoolean(action.mockInterview),
            mockInterviewPrice:action.mockInterviewPrice,
            applicationReview:stringToBoolean(action.applicationReview),
            applicationReviewPrice:action.applicationReviewPrice,
            // profilePicture:action.profilePicture,
            tutorEducations:action.tutorEducations,
          };
        }
        case 'update': {
          return {...tutor, ...action.tutor}
        }
        case 'reset': {
          return {}
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}
import { createContext, useContext } from "react";

const StudentProfileStaticDataContext = createContext(null);

export function useStudentProfileStaticDataContext() {
  return useContext(StudentProfileStaticDataContext);
}

export default StudentProfileStaticDataContext;
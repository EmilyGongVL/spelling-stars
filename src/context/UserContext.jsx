import { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [currentStudent, setCurrentStudent] = useState(() => {
    try {
      const stored = sessionStorage.getItem('currentStudent');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isParent, setIsParent] = useState(false);

  const selectStudent = (student) => {
    setCurrentStudent(student);
    setIsParent(false);
    sessionStorage.setItem('currentStudent', JSON.stringify(student));
  };

  const enterParentMode = () => {
    setIsParent(true);
    setCurrentStudent(null);
    sessionStorage.removeItem('currentStudent');
  };

  const logout = () => {
    setCurrentStudent(null);
    setIsParent(false);
    sessionStorage.removeItem('currentStudent');
  };

  return (
    <UserContext.Provider value={{ currentStudent, isParent, selectStudent, enterParentMode, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  return useContext(UserContext);
}

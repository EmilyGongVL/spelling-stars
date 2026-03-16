import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isParent, setIsParent] = useState(false);

  // Restore from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('currentStudent');
    if (stored) {
      try { setCurrentStudent(JSON.parse(stored)); } catch {}
    }
  }, []);

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

export function useUser() {
  return useContext(UserContext);
}

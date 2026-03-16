import { useState, useCallback } from 'react';
import { getData, getAllStudents, upsertStudent, appendSession } from '../utils/storage';

export function useProgress() {
  const [, forceUpdate] = useState(0);
  const refresh = useCallback(() => forceUpdate(n => n + 1), []);

  const students = getAllStudents();

  const createStudent = useCallback((name, grade, avatar) => {
    const id = 'student_' + Math.random().toString(36).slice(2, 9);
    const student = {
      id,
      name,
      grade,
      avatar,
      createdAt: new Date().toISOString(),
      sessions: [],
    };
    upsertStudent(student);
    refresh();
    return student;
  }, [refresh]);

  const saveSession = useCallback((studentId, session) => {
    appendSession(studentId, session);
    refresh();
  }, [refresh]);

  const getStudentData = useCallback((id) => {
    const data = getData();
    return data.students[id] || null;
  }, []);

  return { students, createStudent, saveSession, getStudentData, refresh };
}

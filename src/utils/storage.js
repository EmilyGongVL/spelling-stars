const STORAGE_KEY = 'spelling_app_data';
const MAX_SESSIONS = 200;

const defaultData = {
  version: 1,
  students: {},
  parentPin: '1234',
};

export function getData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { ...defaultData };
  } catch {
    return { ...defaultData };
  }
}

export function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getAllStudents() {
  const data = getData();
  return Object.values(data.students);
}

export function upsertStudent(student) {
  const data = getData();
  data.students[student.id] = student;
  saveData(data);
  return student;
}

export function appendSession(studentId, session) {
  const data = getData();
  const student = data.students[studentId];
  if (!student) return;
  student.sessions = student.sessions || [];
  student.sessions.push(session);
  if (student.sessions.length > MAX_SESSIONS) {
    student.sessions = student.sessions.slice(-MAX_SESSIONS);
  }
  data.students[studentId] = student;
  saveData(data);
}

export function deleteStudent(studentId) {
  const data = getData();
  delete data.students[studentId];
  saveData(data);
}

export function getParentPin() {
  return getData().parentPin;
}

import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import StudentDashboard from './pages/StudentDashboard';
import CheckMode from './pages/CheckMode';
import LearnMode from './pages/LearnMode';
import ResultsSummary from './pages/ResultsSummary';
import ParentDashboard from './pages/ParentDashboard';

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/dashboard', element: <StudentDashboard /> },
  { path: '/check', element: <CheckMode /> },
  { path: '/learn', element: <LearnMode /> },
  { path: '/results', element: <ResultsSummary /> },
  { path: '/parent', element: <ParentDashboard /> },
]);

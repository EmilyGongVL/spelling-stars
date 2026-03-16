import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

export function AppShell({ children, title, showBack = true }) {
  const navigate = useNavigate();
  const { currentStudent, isParent, logout } = useUser();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <nav className="flex items-center justify-between px-4 py-3 bg-white/10 backdrop-blur no-print" aria-label="App navigation">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="text-white text-2xl font-bold bg-white/20 hover:bg-white/30 rounded-xl px-3 py-2 min-h-[48px] min-w-[48px] focus:outline-none focus:ring-4 focus:ring-white/50"
              aria-label="Go back"
            >
              ←
            </button>
          )}
          <span className="text-white text-2xl font-black">✏️ SpellingStars</span>
        </div>
        <div className="flex items-center gap-2">
          {currentStudent && (
            <span className="text-white font-bold text-lg hidden sm:block">
              {currentStudent.avatar} {currentStudent.name}
            </span>
          )}
          {isParent && (
            <span className="text-white font-bold text-lg hidden sm:block">👨‍👩‍👧 Parent View</span>
          )}
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="text-white bg-white/20 hover:bg-white/30 rounded-xl px-4 py-2 font-bold text-base min-h-[48px] focus:outline-none focus:ring-4 focus:ring-white/50"
          >
            Home
          </button>
        </div>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {title && (
          <h1 className="text-white text-3xl sm:text-4xl font-black mb-6 text-center drop-shadow-lg">{title}</h1>
        )}
        {children}
      </main>
    </div>
  );
}

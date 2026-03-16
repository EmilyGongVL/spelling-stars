import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useProgress } from '../hooks/useProgress';
import { AppShell } from '../components/shared/AppShell';
import { Card } from '../components/ui/Card';
import { GradeSelector } from '../components/shared/GradeSelector';
import { StarRating } from '../components/ui/StarRating';
import { calcStreak } from '../utils/scoring';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { currentStudent } = useUser();
  const { getStudentData } = useProgress();
  const studentData = currentStudent ? getStudentData(currentStudent.id) : null;
  const sessions = studentData?.sessions || [];
  const streak = calcStreak(sessions);
  const [selectedGrade, setSelectedGrade] = useState(currentStudent?.grade || 'year1');

  const totalStars = sessions.reduce((sum, s) => {
    const pct = s.scorePercent || 0;
    return sum + (pct >= 90 ? 3 : pct >= 60 ? 2 : 1);
  }, 0);

  return (
    <AppShell showBack={false}>
      <div className="w-full max-w-lg space-y-4">
        {/* Welcome */}
        <Card className="text-center">
          <div className="text-5xl mb-2">{currentStudent?.avatar || '⭐'}</div>
          <h2 className="text-3xl font-black text-gray-800">Hi, {currentStudent?.name || 'Learner'}!</h2>
          {sessions.length > 0 && (
            <div className="flex justify-center gap-8 mt-4">
              <div className="text-center">
                <div className="text-3xl font-black text-yellow-500">{totalStars}★</div>
                <div className="text-sm text-gray-500 font-bold">Total Stars</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-orange-500">{streak}🔥</div>
                <div className="text-sm text-gray-500 font-bold">Streak</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-indigo-600">{sessions.length}</div>
                <div className="text-sm text-gray-500 font-bold">Sessions</div>
              </div>
            </div>
          )}
        </Card>

        {/* Grade Selector */}
        <Card>
          <h3 className="text-xl font-black text-gray-700 mb-3">Choose your year group</h3>
          <GradeSelector selected={selectedGrade} onSelect={setSelectedGrade} />
        </Card>

        {/* Mode Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate(`/learn?grade=${selectedGrade}`)}
            className="bg-teal-500 hover:bg-teal-600 text-white rounded-3xl p-6 text-left transition-all active:scale-95 focus:outline-none focus:ring-4 focus:ring-teal-400 min-h-[120px]"
          >
            <div className="text-4xl mb-2">📖</div>
            <div className="text-2xl font-black">Learn Mode</div>
            <div className="text-sm opacity-80 font-bold">Browse and explore words</div>
          </button>
          <button
            onClick={() => navigate(`/check?grade=${selectedGrade}`)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl p-6 text-left transition-all active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-400 min-h-[120px]"
          >
            <div className="text-4xl mb-2">✅</div>
            <div className="text-2xl font-black">Check Mode</div>
            <div className="text-sm opacity-80 font-bold">Listen and fill the blank</div>
          </button>
        </div>

        {/* Recent sessions */}
        {sessions.length > 0 && (
          <Card>
            <h3 className="text-lg font-black text-gray-700 mb-3">Recent sessions</h3>
            <div className="space-y-2">
              {[...sessions].reverse().slice(0, 3).map((s, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                  <div>
                    <span className="font-bold text-gray-700">
                      {s.mode === 'check' ? '✅' : s.mode === 'audio' ? '🔊' : '📝'}{' '}
                      {s.mode === 'check' ? 'Check' : s.mode}
                    </span>
                    <span className="text-gray-500 text-sm ml-2">{new Date(s.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-bold">{s.correctCount}/{s.totalWords}</span>
                    <StarRating stars={s.scorePercent >= 90 ? 3 : s.scorePercent >= 60 ? 2 : 1} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}

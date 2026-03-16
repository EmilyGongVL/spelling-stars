import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useProgress } from '../hooks/useProgress';
import { AppShell } from '../components/shared/AppShell';
import { Card } from '../components/ui/Card';
import { StarRating } from '../components/ui/StarRating';
import { Button } from '../components/ui/Button';
import { calcStars } from '../utils/scoring';

export default function ResultsSummary() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { currentStudent } = useUser();
  const { saveSession } = useProgress();
  const saved = useRef(false);

  const { results = [], correctCount = 0, totalWords = 0, scorePercent = 0, durationSeconds = 0, grade = 'year1', mode = 'audio' } = state || {};
  const stars = calcStars(scorePercent);

  useEffect(() => {
    if (!saved.current && currentStudent && results.length > 0) {
      saved.current = true;
      const session = {
        sessionId: 'sess_' + Math.random().toString(36).slice(2, 9),
        date: new Date().toISOString(),
        grade,
        mode,
        totalWords,
        correctCount,
        scorePercent,
        durationSeconds,
        words: results,
      };
      saveSession(currentStudent.id, session);
    }
  }, []);

  const starMessages = {
    3: '⭐ Amazing! Perfect spelling! ⭐',
    2: '👏 Great job! Keep practising!',
    1: '💪 Good effort! Try again to improve!',
  };

  return (
    <AppShell title="Your Results!">
      <div className="w-full max-w-lg space-y-4">
        <Card className="text-center">
          <StarRating stars={stars} size="xl" />
          <p className="text-2xl font-black text-gray-800 mt-4">{starMessages[stars]}</p>
          <div className="flex justify-center gap-8 mt-4">
            <div className="text-center">
              <div className="text-4xl font-black text-green-600">{correctCount}</div>
              <div className="text-sm text-gray-500 font-bold">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-red-500">{totalWords - correctCount}</div>
              <div className="text-sm text-gray-500 font-bold">Missed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-indigo-600">{Math.floor(durationSeconds / 60)}:{String(durationSeconds % 60).padStart(2,'0')}</div>
              <div className="text-sm text-gray-500 font-bold">Time</div>
            </div>
          </div>
        </Card>

        {/* Word breakdown */}
        <Card>
          <h3 className="text-xl font-black text-gray-800 mb-3">Word Breakdown</h3>
          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={i} className={`flex items-center justify-between rounded-xl p-3 ${r.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{r.correct ? '✅' : '❌'}</span>
                  <span className={`text-lg font-black ${r.correct ? 'text-green-800' : 'text-red-800'}`}>{r.word}</span>
                </div>
                {!r.correct && (
                  <span className="text-sm text-gray-500">You wrote: <span className="font-bold">{r.attempt}</span></span>
                )}
              </div>
            ))}
          </div>
        </Card>

        <div className="flex gap-3">
          <Button variant="secondary" size="lg" onClick={() => navigate('/dashboard')} className="flex-1 bg-white text-indigo-700">
            Dashboard
          </Button>
          <Button size="lg" onClick={() => navigate(-2)} className="flex-1">
            Try Again 🔄
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

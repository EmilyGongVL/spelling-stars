import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';
import { AppShell } from '../components/shared/AppShell';
import { Card } from '../components/ui/Card';
import { StarRating } from '../components/ui/StarRating';
import { calcStars, getMostMissedWords } from '../utils/scoring';

export default function ParentDashboard() {
  const navigate = useNavigate();
  const { students, getStudentData } = useProgress();
  const [selectedId, setSelectedId] = useState(students[0]?.id || null);

  const studentData = selectedId ? getStudentData(selectedId) : null;
  const sessions = studentData?.sessions || [];
  const mostMissed = getMostMissedWords(sessions, 10);

  return (
    <AppShell title="Parent Dashboard 👨‍👩‍👧" showBack={false}>
      <div className="w-full max-w-2xl space-y-4">
        {students.length === 0 ? (
          <Card className="text-center">
            <div className="text-5xl mb-4">👦</div>
            <p className="text-xl font-bold text-gray-600">No students yet. Add a student profile to see progress here.</p>
            <button onClick={() => navigate('/')} className="mt-4 text-indigo-600 font-bold underline text-lg">Go to Home</button>
          </Card>
        ) : (
          <>
            {/* Student Selector */}
            <Card>
              <h2 className="text-xl font-black text-gray-700 mb-3">Select Student</h2>
              <div className="flex flex-wrap gap-2">
                {students.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedId(s.id)}
                    className={`flex items-center gap-2 rounded-2xl px-4 py-3 font-bold text-lg transition-all focus:outline-none focus:ring-4 focus:ring-indigo-400 min-h-[52px] ${selectedId === s.id ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}`}
                    aria-pressed={selectedId === s.id}
                  >
                    <span className="text-2xl">{s.avatar}</span>
                    <span>{s.name}</span>
                  </button>
                ))}
              </div>
            </Card>

            {studentData && (
              <>
                {/* Stats */}
                <Card>
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-black text-gray-700">{studentData.name}'s Progress</h2>
                    <button
                      onClick={() => window.print()}
                      className="no-print bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl px-4 py-2 font-bold text-base min-h-[44px] focus:outline-none focus:ring-4 focus:ring-gray-400"
                    >
                      🖨️ Print
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-indigo-50 rounded-2xl p-3">
                      <div className="text-3xl font-black text-indigo-700">{sessions.length}</div>
                      <div className="text-sm text-gray-500 font-bold">Sessions</div>
                    </div>
                    <div className="bg-green-50 rounded-2xl p-3">
                      <div className="text-3xl font-black text-green-700">
                        {sessions.length > 0 ? Math.round(sessions.reduce((s, ses) => s + ses.scorePercent, 0) / sessions.length) : 0}%
                      </div>
                      <div className="text-sm text-gray-500 font-bold">Avg Score</div>
                    </div>
                    <div className="bg-yellow-50 rounded-2xl p-3">
                      <div className="text-3xl font-black text-yellow-600">
                        {sessions.reduce((sum, s) => sum + (s.scorePercent >= 90 ? 3 : s.scorePercent >= 60 ? 2 : 1), 0)}★
                      </div>
                      <div className="text-sm text-gray-500 font-bold">Total Stars</div>
                    </div>
                  </div>
                </Card>

                {/* Most Missed Words */}
                {mostMissed.length > 0 && (
                  <Card>
                    <h3 className="text-xl font-black text-gray-700 mb-3">Most Missed Words</h3>
                    <div className="space-y-2">
                      {mostMissed.map((item, i) => (
                        <div key={i} className="flex items-center justify-between bg-red-50 rounded-xl px-4 py-3">
                          <span className="text-xl font-black text-red-800">{item.word}</span>
                          <span className="bg-red-200 text-red-800 font-bold text-sm rounded-full px-3 py-1">
                            missed {item.count}×
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Session History */}
                {sessions.length > 0 && (
                  <Card>
                    <h3 className="text-xl font-black text-gray-700 mb-3">Session History</h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {[...sessions].reverse().map((s, i) => (
                        <div key={i} className="border border-gray-200 rounded-2xl p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-black text-gray-800">{s.mode === 'audio' ? '🔊 Audio' : '📝 Fill Blank'}</span>
                              <span className="text-gray-500 text-sm ml-2">{new Date(s.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <StarRating stars={calcStars(s.scorePercent)} size="sm" />
                          </div>
                          <div className="flex gap-4 text-sm">
                            <span className="text-green-700 font-bold">✅ {s.correctCount}/{s.totalWords} correct</span>
                            <span className="text-gray-500">{s.grade?.replace('year','Year ')}</span>
                          </div>
                          {s.words?.filter(w => !w.correct).length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {s.words.filter(w => !w.correct).map((w, j) => (
                                <span key={j} className="bg-red-100 text-red-700 text-sm font-bold rounded-lg px-2 py-1">{w.word}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}

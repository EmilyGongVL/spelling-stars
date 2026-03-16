export function calcStars(scorePercent) {
  if (scorePercent >= 90) return 3;
  if (scorePercent >= 60) return 2;
  return 1;
}

export function calcStreak(sessions) {
  if (!sessions || sessions.length === 0) return 0;
  let streak = 0;
  const sorted = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date));
  for (const s of sorted) {
    if (s.scorePercent >= 60) streak++;
    else break;
  }
  return streak;
}

export function getMostMissedWords(sessions, limit = 10) {
  const missed = {};
  for (const session of sessions) {
    for (const w of session.words || []) {
      if (!w.correct) {
        missed[w.word] = (missed[w.word] || 0) + 1;
      }
    }
  }
  return Object.entries(missed)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

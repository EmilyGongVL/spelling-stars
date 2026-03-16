import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuiz';
import { useSpeech } from '../hooks/useSpeech';
import { AppShell } from '../components/shared/AppShell';
import { Card } from '../components/ui/Card';
import { WordInput } from '../components/shared/WordInput';
import { FeedbackBanner } from '../components/shared/FeedbackBanner';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';

export default function CheckMode() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const grade = searchParams.get('grade') || 'year1';
  const quiz = useQuiz(grade, 10);
  const { supported, speaking, speak, cancel } = useSpeech();
  const [input, setInput] = useState('');
  const [showHint, setShowHint] = useState(false);

  // Auto-play word when entering PLAYING state
  useEffect(() => {
    if (quiz.state === quiz.states.PLAYING && quiz.currentWord && supported) {
      const sentence = quiz.currentWord.sentence.replace('___', quiz.currentWord.word);
      const t = setTimeout(() => speak(sentence), 400);
      return () => clearTimeout(t);
    }
  }, [quiz.state, quiz.states.PLAYING, quiz.currentWord, supported, speak]);

  // Auto-navigate on complete
  useEffect(() => {
    if (quiz.state === quiz.states.COMPLETE) {
      navigate('/results', {
        state: {
          results: quiz.results,
          correctCount: quiz.correctCount,
          totalWords: quiz.totalWords,
          scorePercent: quiz.scorePercent,
          durationSeconds: quiz.durationSeconds,
          grade,
          mode: 'check',
        }
      });
    }
  }, [quiz.state, quiz.states.COMPLETE, navigate, quiz.results, quiz.correctCount, quiz.totalWords, quiz.scorePercent, quiz.durationSeconds, grade]);

  const handleSubmit = (val) => {
    cancel();
    quiz.submitAnswer(val);
    setInput('');
    setShowHint(false);
  };

  const handleNext = () => {
    quiz.nextWord();
    setInput('');
    setShowHint(false);
  };

  const renderSentence = (sentence) => {
    const parts = sentence.split('___');
    return (
      <p className="text-xl font-bold text-gray-700 text-center leading-relaxed">
        {parts[0]}
        <span className="inline-block border-b-4 border-indigo-500 min-w-[120px] mx-1 text-center font-black text-indigo-700">
          {input || '______'}
        </span>
        {parts[1]}
      </p>
    );
  };

  if (quiz.state === quiz.states.IDLE) {
    return (
      <AppShell title="Check Mode ✅">
        <Card className="max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Listen and Fill the Blank!</h2>
          <p className="text-lg text-gray-600 mb-2">You will hear the word and see it in a sentence.</p>
          <p className="text-base text-gray-500 mb-6">Type the missing word and press Enter or ✓</p>
          {!supported && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4 text-sm text-yellow-800 font-bold">
              🔇 Audio not supported in this browser — sentence-only mode
            </div>
          )}
          <p className="text-lg font-bold text-indigo-700 mb-6">{grade.replace('year', 'Year ')} — 10 words</p>
          <Button size="lg" onClick={quiz.startQuiz} className="w-full">Start! 🚀</Button>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="w-full max-w-lg space-y-4">
        <ProgressBar current={quiz.currentIndex + 1} total={quiz.totalWords} />

        <Card>
          {quiz.state === quiz.states.PLAYING && (
            <>
              <div className="text-center mb-5">
                {supported ? (
                  <>
                    <p className="text-sm text-gray-500 font-bold mb-3">Listen to the word and complete the sentence:</p>
                    <div className="flex gap-3 justify-center flex-wrap mb-4">
                      <button
                        onClick={() => speak(quiz.currentWord.sentence.replace('___', quiz.currentWord.word))}
                        disabled={speaking}
                        className={`bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-2xl px-6 py-3 text-3xl font-bold transition-all active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-400 min-h-[60px] min-w-[100px] ${speaking ? 'animate-pulse' : ''}`}
                        aria-label={speaking ? 'Speaking...' : 'Hear the sentence'}
                      >
                        {speaking ? '🔊...' : '🔊'}
                      </button>
                      <button
                        onClick={() => speak(quiz.currentWord.sentence.replace('___', quiz.currentWord.word), { rate: 0.5 })}
                        disabled={speaking}
                        className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-2xl px-4 py-3 text-lg font-bold transition-all active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-400 min-h-[60px]"
                        aria-label="Hear the word slowly"
                      >
                        🐢 Slow
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-500 font-bold mb-3">Complete the sentence:</p>
                )}

                <div className="bg-indigo-50 rounded-2xl p-4 mb-4">
                  {quiz.currentWord && renderSentence(quiz.currentWord.sentence)}
                </div>

                {showHint && (
                  <p className="text-xl text-indigo-700 font-bold bg-indigo-50 rounded-xl py-2 px-4 mb-3" aria-live="polite">
                    Hint: starts with <span className="text-3xl font-black">"{quiz.currentWord?.hint}"</span>
                  </p>
                )}
                {!showHint && (
                  <button
                    onClick={() => { setShowHint(true); quiz.useHint(); }}
                    className="text-indigo-500 hover:text-indigo-700 font-bold text-base underline focus:outline-none mb-3"
                  >
                    Show hint
                  </button>
                )}
              </div>
              <WordInput
                value={input}
                onChange={setInput}
                onSubmit={handleSubmit}
              />
            </>
          )}

          {quiz.state === quiz.states.FEEDBACK && (
            <>
              {quiz.currentWord && (
                <div className="bg-indigo-50 rounded-2xl p-4 mb-4">
                  <p className="text-xl font-bold text-gray-700 text-center leading-relaxed">
                    {quiz.currentWord.sentence.replace('___', quiz.currentWord.word)}
                  </p>
                </div>
              )}
              <FeedbackBanner
                correct={quiz.lastCorrect}
                correctWord={quiz.currentWord?.word}
                attempt={quiz.attempt}
                onNext={handleNext}
                autoAdvance={quiz.lastCorrect}
              />
            </>
          )}
        </Card>
      </div>
    </AppShell>
  );
}

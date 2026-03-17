import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSpeech } from '../hooks/useSpeech';
import { AppShell } from '../components/shared/AppShell';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import wordLists from '../data/wordLists';

export default function LearnMode() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const grade = searchParams.get('grade') || 'year1';
  const words = wordLists[grade] || wordLists.year1;

  const [index, setIndex] = useState(0);
  const [activeAudio, setActiveAudio] = useState(null); // 'word' | 'sentence' | null
  const { supported, speaking, speak, cancel } = useSpeech();

  const currentWord = words[index];

  // Clear active indicator when speech ends
  useEffect(() => {
    if (!speaking) setActiveAudio(null); // eslint-disable-line react-hooks/set-state-in-effect
  }, [speaking]);

  const speakWord = () => {
    cancel();
    setActiveAudio('word');
    speak(currentWord.word);
  };

  const speakSentence = () => {
    cancel();
    setActiveAudio('sentence');
    speak(currentWord.sentence.replace('___', currentWord.word));
  };

  const goNext = useCallback(() => {
    cancel();
    setIndex((i) => Math.min(i + 1, words.length - 1));
  }, [cancel, words.length]);

  const goPrev = useCallback(() => {
    cancel();
    setIndex((i) => Math.max(i - 1, 0));
  }, [cancel]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev]);

  const sentenceParts = currentWord.sentence.split('___');

  return (
    <AppShell title="Learn Mode 📖">
      <div className="w-full max-w-lg space-y-4">

        {/* Navigation */}
        <div className="flex items-center justify-between px-1">
          <Button variant="ghost" onClick={goPrev} disabled={index === 0} className="text-lg font-bold">
            ← Prev
          </Button>
          <span className="text-sm font-bold text-white tracking-wide uppercase">
            {index + 1} / {words.length}
          </span>
          <Button variant="ghost" onClick={goNext} disabled={index === words.length - 1} className="text-lg font-bold">
            Next →
          </Button>
        </div>

        <Card className="space-y-5">

          {/* Word + word audio */}
          <div className="flex items-center justify-between gap-4 pb-5 border-b border-gray-100">
            <span className="text-5xl font-black text-teal-700 tracking-wide leading-none">
              {currentWord.word}
            </span>
            {supported && (
              <button
                onClick={speakWord}
                disabled={speaking}
                className={`flex-shrink-0 rounded-2xl px-5 py-3 text-xl font-bold transition-all active:scale-95 focus:outline-none focus:ring-4 focus:ring-teal-400 min-h-[52px] min-w-[64px]
                  ${activeAudio === 'word'
                    ? 'bg-teal-600 text-white scale-95 animate-pulse'
                    : 'bg-teal-100 hover:bg-teal-200 text-teal-700'
                  } ${speaking && activeAudio !== 'word' ? 'opacity-40 cursor-not-allowed' : ''}`}
                aria-label="Hear the word"
              >
                🔊
              </button>
            )}
          </div>

          {/* Sentence + sentence audio */}
          <div className="flex items-start gap-4">
            <p className="flex-1 text-lg font-semibold text-gray-600 leading-relaxed">
              {sentenceParts[0]}
              <span className="text-teal-700 font-black bg-teal-100 rounded-lg px-2 py-0.5 mx-0.5">
                {currentWord.word}
              </span>
              {sentenceParts[1]}
            </p>
            {supported && (
              <button
                onClick={speakSentence}
                disabled={speaking}
                className={`flex-shrink-0 rounded-xl px-2 py-1 text-lg font-bold transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-teal-400
                  ${activeAudio === 'sentence'
                    ? 'bg-teal-600 text-white scale-95 animate-pulse'
                    : 'bg-teal-100 hover:bg-teal-200 text-teal-700'
                  } ${speaking && activeAudio !== 'sentence' ? 'opacity-40 cursor-not-allowed' : ''}`}
                aria-label="Hear the sentence"
              >
                🔊
              </button>
            )}
          </div>

          {!supported && (
            <p className="text-center text-sm text-gray-400 font-bold">🔇 Audio not supported in this browser</p>
          )}

        </Card>

        <Button variant="secondary" className="w-full" onClick={() => navigate('/dashboard')}>
          Done browsing
        </Button>

      </div>
    </AppShell>
  );
}

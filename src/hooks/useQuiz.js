import { useState, useCallback, useRef } from 'react';
import { getSessionWords } from '../data/wordLists';

const STATES = {
  IDLE: 'idle',
  PLAYING: 'playing',
  FEEDBACK: 'feedback',
  COMPLETE: 'complete',
};

export function useQuiz(yearKey, wordCount = 10) {
  const [state, setState] = useState(STATES.IDLE);
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [lastCorrect, setLastCorrect] = useState(null);
  const [attempt, setAttempt] = useState('');
  const startTimeRef = useRef(null);
  const sessionStartRef = useRef(null);

  const startQuiz = useCallback(() => {
    const sessionWords = getSessionWords(yearKey, wordCount);
    setWords(sessionWords);
    setCurrentIndex(0);
    setResults([]);
    setHintsUsed(0);
    setLastCorrect(null);
    setAttempt('');
    setState(STATES.PLAYING);
    sessionStartRef.current = Date.now();
    startTimeRef.current = Date.now();
  }, [yearKey, wordCount]);

  const normalise = (str) =>
    str.trim().toLowerCase().replace(/[.,!?;:'"]+$/, '');

  const submitAnswer = useCallback((input) => {
    if (state !== STATES.PLAYING) return;
    const currentWord = words[currentIndex];
    const isCorrect = normalise(input) === normalise(currentWord.word);
    setLastCorrect(isCorrect);
    setAttempt(input);
    setResults(prev => [...prev, {
      wordId: currentWord.id,
      word: currentWord.word,
      correct: isCorrect,
      attempt: input,
      hintsUsed,
    }]);
    setState(STATES.FEEDBACK);
  }, [state, words, currentIndex, hintsUsed]);

  const nextWord = useCallback(() => {
    const next = currentIndex + 1;
    if (next >= words.length) {
      setState(STATES.COMPLETE);
    } else {
      setCurrentIndex(next);
      setHintsUsed(0);
      setLastCorrect(null);
      setAttempt('');
      startTimeRef.current = Date.now();
      setState(STATES.PLAYING);
    }
  }, [currentIndex, words.length]);

  const useHint = useCallback(() => {
    setHintsUsed(h => h + 1);
  }, []);

  const reset = useCallback(() => {
    setState(STATES.IDLE);
    setWords([]);
    setCurrentIndex(0);
    setResults([]);
    setHintsUsed(0);
    setLastCorrect(null);
    setAttempt('');
  }, []);

  const currentWord = words[currentIndex] || null;
  const correctCount = results.filter(r => r.correct).length;
  const scorePercent = results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0;
  const durationSeconds = sessionStartRef.current
    ? Math.round((Date.now() - sessionStartRef.current) / 1000)
    : 0;

  return {
    state,
    states: STATES,
    currentWord,
    currentIndex,
    totalWords: words.length,
    results,
    correctCount,
    scorePercent,
    durationSeconds,
    lastCorrect,
    attempt,
    hintsUsed,
    startQuiz,
    submitAnswer,
    nextWord,
    useHint,
    reset,
  };
}

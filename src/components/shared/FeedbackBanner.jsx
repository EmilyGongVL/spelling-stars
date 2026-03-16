import { useEffect } from 'react';

export function FeedbackBanner({ correct, correctWord, attempt, onNext, autoAdvance = true }) {
  useEffect(() => {
    if (autoAdvance) {
      const t = setTimeout(onNext, 2000);
      return () => clearTimeout(t);
    }
  }, [autoAdvance, onNext]);

  return (
    <div className={`rounded-3xl p-6 text-center ${correct ? 'bg-green-100 border-4 border-green-400' : 'bg-red-100 border-4 border-red-400'}`}
      role="alert"
      aria-live="assertive"
    >
      {correct ? (
        <>
          <div className="text-5xl mb-2">🎉</div>
          <p className="text-3xl font-black text-green-700">Correct!</p>
          <p className="text-xl text-green-600 mt-1 font-bold">{correctWord}</p>
        </>
      ) : (
        <>
          <div className="text-5xl mb-2">😕</div>
          <p className="text-2xl font-black text-red-700">Not quite!</p>
          <p className="text-lg text-red-600 mt-1">You wrote: <span className="font-bold">{attempt}</span></p>
          <p className="text-xl mt-2 text-gray-700">
            Correct spelling: <span className="font-black text-red-800 text-2xl">{correctWord}</span>
          </p>
        </>
      )}
      <button
        onClick={onNext}
        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-6 py-3 text-lg font-bold focus:outline-none focus:ring-4 focus:ring-indigo-400 min-h-[52px]"
      >
        Next →
      </button>
    </div>
  );
}

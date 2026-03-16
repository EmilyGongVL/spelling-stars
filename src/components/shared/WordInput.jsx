import { useRef, useEffect } from 'react';

export function WordInput({ value, onChange, onSubmit, placeholder = 'Type your answer...', disabled = false, autoFocus = true }) {
  const ref = useRef(null);

  useEffect(() => {
    if (autoFocus && ref.current) ref.current.focus();
  }, [autoFocus]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && value.trim()) onSubmit?.(value);
  };

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex gap-3 items-center w-full max-w-md mx-auto">
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKey}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        className="flex-1 border-4 border-indigo-300 rounded-2xl px-5 py-3 text-xl font-bold text-gray-800 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200 disabled:bg-gray-100 placeholder:text-gray-400"
        aria-label="Spell the word"
      />
      <button
        onClick={() => value.trim() && onSubmit?.(value)}
        disabled={disabled || !value.trim()}
        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-5 py-3 text-xl font-bold transition-all disabled:opacity-40 min-w-[56px] min-h-[56px] focus:outline-none focus:ring-4 focus:ring-indigo-400"
        aria-label="Submit answer"
      >
        ✓
      </button>
    </div>
  );
}

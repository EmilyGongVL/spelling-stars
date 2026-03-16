import { useState, useCallback } from 'react';

export function useSpeech() {
  const [supported] = useState(() => 'speechSynthesis' in window);
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback((text, options = {}) => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 0.8;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    // Try to use a clear English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) utterance.voice = englishVoice;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [supported]);

  const cancel = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, [supported]);

  return { supported, speaking, speak, cancel };
}

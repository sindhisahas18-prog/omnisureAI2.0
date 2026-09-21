import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle, Loader2, Sparkles, Volume2, Send, Check } from 'lucide-react';
import { Language } from '../types';
import { speechService } from '../services/speechService';

interface VoiceCopilotProps {
  language: Language;
  onTranscriptReady: (text: string) => void;
  onTranscriptSubmit?: (text: string) => void;
  disabled?: boolean;
  contextLabel?: string;
  autoSubmitOnDone?: boolean;
}

type CopilotState = 'idle' | 'requesting' | 'listening' | 'processing' | 'try_again' | 'permission_denied' | 'unsupported';

// Global singleton manager guaranteeing only one SpeechRecognition instance runs at a time
let globalActiveRecognition: any = null;
let globalActiveInstanceId: string | null = null;
let globalActiveCleanup: (() => void) | null = null;

const stopGlobalActiveRecognition = () => {
  if (globalActiveCleanup) {
    try {
      globalActiveCleanup();
    } catch {
      // ignore
    }
    globalActiveCleanup = null;
  }
  if (globalActiveRecognition) {
    try {
      // Detach listeners first so abort() doesn't fire an error handler
      globalActiveRecognition.onstart = null;
      globalActiveRecognition.onresult = null;
      globalActiveRecognition.onerror = null;
      globalActiveRecognition.onend = null;
      globalActiveRecognition.abort();
    } catch {
      // ignore
    }
    globalActiveRecognition = null;
  }
  globalActiveInstanceId = null;
};

// Cross-browser SpeechRecognition resolution
export const getSpeechRecognitionClass = () => {
  if (typeof window === 'undefined') return null;
  return (
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition ||
    null
  );
};

export const VoiceCopilot: React.FC<VoiceCopilotProps> = ({
  language,
  onTranscriptReady,
  onTranscriptSubmit,
  disabled = false,
  contextLabel = "AI Chat",
  autoSubmitOnDone = false
}) => {
  const [state, setState] = useState<CopilotState>('idle');
  const [interimText, setInterimText] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Unique instance ID for this component
  const instanceIdRef = useRef<string>(`vc-${Math.random().toString(36).substring(2, 9)}`);
  const isListeningRef = useRef<boolean>(false);
  const isMountedRef = useRef<boolean>(true);
  const interimTextRef = useRef<string>('');
  const fullTranscriptRef = useRef<string>('');
  const finalizedIndicesRef = useRef<Set<number>>(new Set());
  const resetTimerRef = useRef<any>(null);
  const processTimerRef = useRef<any>(null);

  // Schedule clearing of temporary statuses like "Try Again"
  const scheduleResetStatus = (delayMs = 3500) => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setState(prev => (prev === 'try_again' ? 'idle' : prev));
        setStatusMessage(null);
      }
    }, delayMs);
  };

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      if (processTimerRef.current) clearTimeout(processTimerRef.current);
      if (globalActiveInstanceId === instanceIdRef.current) {
        stopGlobalActiveRecognition();
      }
    };
  }, []);

  // When language switches (English <-> Hindi) while listening, restart recognition with the new locale
  useEffect(() => {
    if (isListeningRef.current) {
      stopListening(false);
      const restartTimeout = setTimeout(() => {
        if (isMountedRef.current) {
          startListening();
        }
      }, 200);
      return () => clearTimeout(restartTimeout);
    }
  }, [language]);

  // When disabled changes to true while listening, stop recognition immediately
  useEffect(() => {
    if (disabled && isListeningRef.current) {
      stopListening(false);
    }
  }, [disabled]);

  const startListening = () => {
    // Interruption requirement: Stop any AI speech immediately when user starts speaking!
    try {
      speechService.stop();
    } catch {
      // ignore
    }

    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    if (processTimerRef.current) clearTimeout(processTimerRef.current);

    const SpeechRecognitionClass = getSpeechRecognitionClass();
    if (!SpeechRecognitionClass) {
      setState('unsupported');
      setStatusMessage(
        language === 'hi'
          ? 'ब्राउज़र में वॉइस सपोर्ट नहीं है'
          : 'Voice input not supported in browser'
      );
      scheduleResetStatus(4000);
      return;
    }

    // Stop any existing recognition instance before starting a new one
    stopGlobalActiveRecognition();

    finalizedIndicesRef.current.clear();
    interimTextRef.current = '';
    fullTranscriptRef.current = '';
    setInterimText('');
    setStatusMessage(null);
    setState('requesting');
    isListeningRef.current = true;

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      // Locale: en-IN for English, hi-IN for Hindi
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        if (!isMountedRef.current || globalActiveInstanceId !== instanceIdRef.current) return;
        isListeningRef.current = true;
        setState('listening');
        setStatusMessage(null);
      };

      recognition.onresult = (event: any) => {
        if (!isMountedRef.current || globalActiveInstanceId !== instanceIdRef.current) return;

        let newlyFinalized = '';
        let currentInterim = '';

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          const chunk = result[0]?.transcript || '';
          if (result.isFinal) {
            if (!finalizedIndicesRef.current.has(i)) {
              finalizedIndicesRef.current.add(i);
              newlyFinalized += (newlyFinalized ? ' ' : '') + chunk.trim();
            }
          } else {
            currentInterim += (currentInterim ? ' ' : '') + chunk.trim();
          }
        }

        if (newlyFinalized.trim()) {
          setState('processing');
          setInterimText('');
          interimTextRef.current = '';

          fullTranscriptRef.current = fullTranscriptRef.current
            ? `${fullTranscriptRef.current} ${newlyFinalized.trim()}`
            : newlyFinalized.trim();

          // Push the newly finalized transcribed text to the chat input
          onTranscriptReady(newlyFinalized.trim());

          // Resume listening state smoothly after brief transcription indicator
          if (processTimerRef.current) clearTimeout(processTimerRef.current);
          processTimerRef.current = setTimeout(() => {
            if (isMountedRef.current && isListeningRef.current) {
              setState('listening');
            }
          }, 450);
        } else if (currentInterim) {
          interimTextRef.current = currentInterim;
          setInterimText(currentInterim);
        }
      };

      recognition.onerror = (event: any) => {
        if (!isMountedRef.current || globalActiveInstanceId !== instanceIdRef.current) return;
        const err = event.error;

        // 'aborted' is expected when stopping/aborting cleanly. Never display as an error.
        if (err === 'aborted') {
          return;
        }

        if (err === 'no-speech') {
          // User paused or stayed silent; offer gentle retry badge without a large error
          isListeningRef.current = false;
          setState('try_again');
          setStatusMessage(language === 'hi' ? 'कोई आवाज़ नहीं मिली' : 'No speech detected');
          scheduleResetStatus(3500);
          return;
        }

        if (err === 'not-allowed' || err === 'service-not-allowed') {
          isListeningRef.current = false;
          setState('permission_denied');
          setStatusMessage(language === 'hi' ? 'माइक अनुमति नहीं मिली' : 'Microphone blocked');
          return;
        }

        if (err === 'audio-capture') {
          isListeningRef.current = false;
          setState('try_again');
          setStatusMessage(language === 'hi' ? 'माइक उपलब्ध नहीं है' : 'Microphone unavailable');
          scheduleResetStatus(3500);
          return;
        }

        if (err === 'network') {
          isListeningRef.current = false;
          setState('try_again');
          setStatusMessage(language === 'hi' ? 'नेटवर्क समस्या' : 'Network error');
          scheduleResetStatus(3500);
          return;
        }

        // Generic error fallback: show small "Try Again" status instead of a large popup
        isListeningRef.current = false;
        setState('try_again');
        setStatusMessage(language === 'hi' ? 'पुनः प्रयास करें' : 'Try Again');
        scheduleResetStatus(3500);
      };

      recognition.onend = () => {
        if (!isMountedRef.current || globalActiveInstanceId !== instanceIdRef.current) return;

        // If any interim text was left unfinalized when recognition finished, push it to input
        if (interimTextRef.current && interimTextRef.current.trim()) {
          const leftover = interimTextRef.current.trim();
          fullTranscriptRef.current = fullTranscriptRef.current
            ? `${fullTranscriptRef.current} ${leftover}`
            : leftover;
          onTranscriptReady(leftover);
          interimTextRef.current = '';
          setInterimText('');
        }

        isListeningRef.current = false;
        globalActiveRecognition = null;
        globalActiveInstanceId = null;

        setState(prev => {
          if (prev === 'permission_denied' || prev === 'try_again' || prev === 'unsupported') {
            return prev;
          }
          return 'idle';
        });
      };

      // Register global active pointers
      globalActiveRecognition = recognition;
      globalActiveInstanceId = instanceIdRef.current;
      globalActiveCleanup = () => {
        isListeningRef.current = false;
        try {
          recognition.onstart = null;
          recognition.onresult = null;
          recognition.onerror = null;
          recognition.onend = null;
          recognition.abort();
        } catch {
          // ignore
        }
      };

      recognition.start();
    } catch (err: any) {
      console.warn('[VoiceCopilot] start exception:', err);
      isListeningRef.current = false;
      setState('try_again');
      setStatusMessage(language === 'hi' ? 'पुनः प्रयास करें' : 'Try Again');
      scheduleResetStatus(3000);
    }
  };

  const stopListening = (shouldTriggerSubmit: boolean = false) => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    if (processTimerRef.current) clearTimeout(processTimerRef.current);
    isListeningRef.current = false;

    // Flush any pending interim speech into the input field
    let pendingChunk = '';
    if (interimTextRef.current && interimTextRef.current.trim()) {
      pendingChunk = interimTextRef.current.trim();
      fullTranscriptRef.current = fullTranscriptRef.current
        ? `${fullTranscriptRef.current} ${pendingChunk}`
        : pendingChunk;
      onTranscriptReady(pendingChunk);
      interimTextRef.current = '';
      setInterimText('');
    }

    if (globalActiveInstanceId === instanceIdRef.current && globalActiveRecognition) {
      try {
        // Calling .stop() gracefully completes recognition and processes any pending audio
        globalActiveRecognition.stop();
      } catch {
        stopGlobalActiveRecognition();
      }
    }

    setState('idle');
    setStatusMessage(null);

    // If submit requested and we have text, trigger callback
    if (shouldTriggerSubmit && onTranscriptSubmit && fullTranscriptRef.current.trim()) {
      const textToSubmit = fullTranscriptRef.current.trim();
      fullTranscriptRef.current = '';
      setTimeout(() => {
        if (isMountedRef.current) {
          onTranscriptSubmit(textToSubmit);
        }
      }, 100);
    }
  };

  const handleToggle = () => {
    if (state === 'listening' || state === 'requesting' || state === 'processing') {
      stopListening(autoSubmitOnDone);
    } else {
      startListening();
    }
  };

  const localeBadge = language === 'hi' ? 'hi-IN' : 'en-IN';

  return (
    <div className="relative inline-flex items-center">
      
      {/* 1. Small Listening Banner with Animated Rhythm Waveform */}
      {state === 'listening' && (
        <div className="absolute bottom-full mb-2 right-0 z-40 flex items-center gap-2 px-2.5 py-1 bg-slate-900/95 border border-rose-500/50 backdrop-blur-md rounded-xl shadow-xl shadow-rose-950/40 text-xs text-rose-200 whitespace-nowrap animate-in fade-in slide-in-from-bottom-1">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span className="font-semibold text-[11px]">
            {language === 'hi' ? `सुन रहा हूँ... (${localeBadge})` : `Listening... (${localeBadge})`}
          </span>

          {/* Smooth animated rhythm bars */}
          <div className="flex items-center gap-0.5 px-1 py-0.5 bg-slate-950/50 rounded">
            <span className="w-0.5 h-2 bg-rose-400 rounded-full animate-pulse" />
            <span className="w-0.5 h-3.5 bg-rose-300 rounded-full animate-pulse delay-75" />
            <span className="w-0.5 h-2.5 bg-rose-400 rounded-full animate-pulse delay-150" />
            <span className="w-0.5 h-3 bg-cyan-400 rounded-full animate-pulse delay-100" />
          </div>

          {interimText && (
            <span className="max-w-[130px] truncate text-[10px] text-slate-300 italic">
              "{interimText}"
            </span>
          )}

          {/* Stop / Submit Button */}
          {onTranscriptSubmit ? (
            <button
              type="button"
              onClick={() => stopListening(true)}
              title={language === 'hi' ? 'बोलना समाप्त और भेजें' : 'Done & Send'}
              className="ml-0.5 flex items-center gap-1 text-[10px] bg-rose-500/25 hover:bg-rose-500/40 text-rose-200 px-2 py-0.5 rounded font-bold cursor-pointer transition-colors border border-rose-500/30"
            >
              <Send className="w-2.5 h-2.5" />
              <span>{language === 'hi' ? 'भेजें' : 'Send'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => stopListening(false)}
              className="ml-0.5 text-[10px] bg-rose-500/20 hover:bg-rose-500/40 text-rose-200 px-1.5 py-0.5 rounded font-bold cursor-pointer transition-colors"
            >
              {language === 'hi' ? 'पूर्ण' : 'Done'}
            </button>
          )}
        </div>
      )}

      {/* 2. Small Processing Status Banner */}
      {state === 'processing' && (
        <div className="absolute bottom-full mb-2 right-0 z-40 flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/95 border border-cyan-500/40 backdrop-blur-md rounded-xl shadow-lg text-[11px] text-cyan-300 whitespace-nowrap animate-in fade-in slide-in-from-bottom-1">
          <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
          <span>{language === 'hi' ? 'आवाज़ प्रोसेस हो रही है...' : 'Processing voice...'}</span>
        </div>
      )}

      {/* 3. Small Requesting Status */}
      {state === 'requesting' && (
        <div className="absolute bottom-full mb-2 right-0 z-40 flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/95 border border-cyan-500/40 backdrop-blur-md rounded-xl shadow-lg text-[11px] text-cyan-300 whitespace-nowrap animate-in fade-in slide-in-from-bottom-1">
          <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
          <span>{language === 'hi' ? 'माइक शुरू हो रहा है...' : 'Starting microphone...'}</span>
        </div>
      )}

      {/* 4. Small User-Friendly Try Again / Error Status */}
      {state === 'try_again' && (
        <div className="absolute bottom-full mb-2 right-0 z-40 flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/95 border border-amber-500/40 backdrop-blur-md rounded-xl shadow-lg text-[11px] text-amber-300 whitespace-nowrap animate-in fade-in slide-in-from-bottom-1">
          <AlertCircle className="w-3 h-3 text-amber-400" />
          <span>{statusMessage || (language === 'hi' ? 'पुनः प्रयास करें' : 'Try Again')}</span>
          <button
            type="button"
            onClick={startListening}
            className="ml-1 text-[10px] bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 px-1.5 py-0.5 rounded font-bold cursor-pointer transition-colors"
          >
            {language === 'hi' ? 'बोलें' : 'Retry'}
          </button>
        </div>
      )}

      {/* 5. Small Permission Denied Status */}
      {state === 'permission_denied' && (
        <div className="absolute bottom-full mb-2 right-0 z-40 flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/95 border border-amber-500/50 backdrop-blur-md rounded-xl shadow-lg text-[11px] text-amber-300 whitespace-nowrap animate-in fade-in slide-in-from-bottom-1">
          <MicOff className="w-3 h-3 text-amber-400" />
          <span>{statusMessage || (language === 'hi' ? 'माइक अनुमति ब्लॉक है' : 'Microphone blocked')}</span>
          <button
            type="button"
            onClick={startListening}
            className="ml-1 text-[10px] bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 px-1.5 py-0.5 rounded font-bold cursor-pointer transition-colors"
          >
            {language === 'hi' ? 'पुनः प्रयास करें' : 'Retry'}
          </button>
        </div>
      )}

      {/* 6. Unsupported Browser Status */}
      {state === 'unsupported' && (
        <div className="absolute bottom-full mb-2 right-0 z-40 flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/95 border border-slate-700 backdrop-blur-md rounded-xl shadow-lg text-[11px] text-slate-300 whitespace-nowrap animate-in fade-in slide-in-from-bottom-1">
          <AlertCircle className="w-3 h-3 text-slate-400" />
          <span>{statusMessage || 'Speech recognition not supported'}</span>
        </div>
      )}

      {/* Main Microphone Button */}
      <button
        type="button"
        id={`voice-copilot-btn-${contextLabel.toLowerCase().replace(/\s+/g, '-')}`}
        onClick={handleToggle}
        disabled={disabled}
        title={
          state === 'listening'
            ? language === 'hi' ? 'सुनना बंद करें' : 'Stop listening'
            : language === 'hi'
            ? `वॉयस कोपायलट से बोलें (हिंदी ${localeBadge})`
            : `Speak with Voice Copilot (English ${localeBadge})`
        }
        className={`relative p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center ${
          state === 'listening'
            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 ring-2 ring-rose-400/50 scale-105'
            : state === 'requesting' || state === 'processing'
            ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 animate-pulse'
            : state === 'try_again'
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
            : state === 'permission_denied'
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
            : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500/40'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {state === 'listening' ? (
          <div className="flex items-center gap-1">
            <Mic className="w-4 h-4 animate-pulse" />
            <span className="flex space-x-0.5 items-center">
              <span className="w-1 h-3 bg-white rounded-full animate-bounce" />
              <span className="w-1 h-4 bg-white rounded-full animate-bounce delay-75" />
              <span className="w-1 h-2 bg-white rounded-full animate-bounce delay-150" />
            </span>
          </div>
        ) : state === 'processing' || state === 'requesting' ? (
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
        ) : state === 'permission_denied' ? (
          <MicOff className="w-4 h-4 text-amber-400" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>

    </div>
  );
};

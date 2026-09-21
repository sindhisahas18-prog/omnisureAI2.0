import React from 'react';
import { Volume2, VolumeX, Play, Pause, Square, RotateCcw } from 'lucide-react';
import { Language } from '../types';
import { SpeechPlaybackState } from '../services/speechService';

interface VoicePlaybackBarProps {
  playbackState: SpeechPlaybackState;
  activeMessageId: string | null;
  language: Language;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReplay?: () => void;
}

export const VoicePlaybackBar: React.FC<VoicePlaybackBarProps> = ({
  playbackState,
  activeMessageId,
  language,
  onPlay,
  onPause,
  onResume,
  onStop,
  onReplay
}) => {
  if (playbackState === 'idle' || !activeMessageId) {
    return null;
  }

  const isPlaying = playbackState === 'playing';
  const isPaused = playbackState === 'paused';
  const localeBadge = language === 'hi' ? 'hi-IN' : 'en-IN';

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-cyan-500/40 rounded-2xl shadow-lg backdrop-blur-md mb-3 animate-in fade-in slide-in-from-bottom-2">
      {/* Visualizer & Label */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
          <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse text-cyan-400' : 'text-slate-400'}`} />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">
              {language === 'hi' ? 'AI वॉयस प्रतिक्रिया' : 'AI Voice Response'}
            </span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {localeBadge}
            </span>
            <span className="text-[10px] text-slate-400">
              {isPlaying ? (language === 'hi' ? 'बोल रहा है...' : 'Speaking...') : (language === 'hi' ? 'विराम (Paused)' : 'Paused')}
            </span>
          </div>

          {/* Equalizer animation */}
          <div className="flex items-center gap-1 mt-0.5">
            <span className={`w-1 h-2 rounded-full ${isPlaying ? 'bg-cyan-400 animate-bounce' : 'bg-slate-600'}`} />
            <span className={`w-1 h-3.5 rounded-full ${isPlaying ? 'bg-blue-400 animate-bounce delay-75' : 'bg-slate-600'}`} />
            <span className={`w-1 h-2.5 rounded-full ${isPlaying ? 'bg-indigo-400 animate-bounce delay-150' : 'bg-slate-600'}`} />
            <span className={`w-1 h-4 rounded-full ${isPlaying ? 'bg-cyan-300 animate-bounce delay-100' : 'bg-slate-600'}`} />
            <span className={`w-1 h-1.5 rounded-full ${isPlaying ? 'bg-blue-400 animate-bounce delay-200' : 'bg-slate-600'}`} />
          </div>
        </div>
      </div>

      {/* Audio Controls */}
      <div className="flex items-center gap-1.5">
        {/* Play / Pause Toggle */}
        {isPlaying ? (
          <button
            type="button"
            onClick={onPause}
            title={language === 'hi' ? 'रोकें (Pause)' : 'Pause Speech'}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onResume}
            title={language === 'hi' ? 'जारी रखें (Resume)' : 'Resume Speech'}
            className="p-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>
        )}

        {/* Replay */}
        {onReplay && (
          <button
            type="button"
            onClick={onReplay}
            title={language === 'hi' ? 'फिर से सुनें' : 'Replay Message'}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Stop (Interrupt) */}
        <button
          type="button"
          onClick={onStop}
          title={language === 'hi' ? 'बंद करें (Stop)' : 'Stop / Interrupt Speech'}
          className="p-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-colors cursor-pointer"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
        </button>
      </div>
    </div>
  );
};

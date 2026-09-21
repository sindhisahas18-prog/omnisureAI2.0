/**
 * OMNISURE Speech Synthesis & Text-to-Speech (TTS) Service
 * Provides natural bilingual (English & Hindi) voice playback with:
 * - en-IN and hi-IN voice detection
 * - Markdown & symbol cleaning for natural human speech
 * - Sentence chunking to prevent Chromium utterance freeze
 * - Strict singleton management to prevent overlapping audio
 * - Play / Pause / Resume / Stop capabilities
 */

import { Language } from '../types';

export type SpeechPlaybackState = 'idle' | 'playing' | 'paused';

export type SpeechPlaybackListener = (state: SpeechPlaybackState, messageId: string | null) => void;

class SpeechService {
  private currentUtteranceIndex: number = 0;
  private utteranceChunks: SpeechSynthesisUtterance[] = [];
  private state: SpeechPlaybackState = 'idle';
  private currentMessageId: string | null = null;
  private listeners: Set<SpeechPlaybackListener> = new Set();
  private voices: SpeechSynthesisVoice[] = [];
  private keepAliveInterval: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    }
  }

  private loadVoices() {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        this.voices = window.speechSynthesis.getVoices();
      }
    } catch {
      this.voices = [];
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public subscribe(listener: SpeechPlaybackListener): () => void {
    this.listeners.add(listener);
    // Initial emit
    listener(this.state, this.currentMessageId);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.state, this.currentMessageId);
      } catch (err) {
        console.warn('[SpeechService] Listener error:', err);
      }
    }
  }

  /**
   * Cleans markdown formatting, emojis, and symbols so TTS reads clean conversational prose
   */
  public cleanTextForSpeech(text: string): string {
    if (!text) return '';

    return text
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '')
      // Remove inline code
      .replace(/`([^`]+)`/g, '$1')
      // Remove Markdown headers (### Header)
      .replace(/#{1,6}\s*/g, '')
      // Remove bold/italic (**bold**, *italic*, __bold__)
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      // Remove bullet points / numbering prefixes
      .replace(/^\s*[-*•]\s+/gm, '')
      .replace(/^\s*\d+\.\s+/gm, '')
      // Remove links [text](url)
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Clean Indian rupee symbol for natural reading
      .replace(/₹\s*(\d+(?:,\d+)*(?:\.\d+)?)/g, 'Rs. $1')
      // Remove standalone emojis and decorative symbols
      .replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      // Replace multiple newlines or spaces with single space
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Split long text into conversational sentences (max ~160 chars) to prevent Chromium synthesis drops
   */
  private splitIntoChunks(text: string): string[] {
    const cleaned = this.cleanTextForSpeech(text);
    if (!cleaned) return [];

    // Split by punctuation: period, question mark, exclamation, or Hindi purna viram (।)
    const sentenceRegex = /[^.!?|।\n]+[.!?|।\n]+/g;
    const matches = cleaned.match(sentenceRegex);

    if (!matches || matches.length === 0) {
      return [cleaned];
    }

    const chunks: string[] = [];
    let currentChunk = '';

    for (const rawSentence of matches) {
      const sentence = rawSentence.trim();
      if (!sentence) continue;

      if ((currentChunk + ' ' + sentence).length <= 160) {
        currentChunk = currentChunk ? `${currentChunk} ${sentence}` : sentence;
      } else {
        if (currentChunk) chunks.push(currentChunk);
        if (sentence.length > 160) {
          // If a single sentence is very long, split by comma or semi-colon
          const clauses = sentence.split(/[,;:—]/);
          let subChunk = '';
          for (const clause of clauses) {
            const trimmedClause = clause.trim();
            if ((subChunk + ' ' + trimmedClause).length <= 160) {
              subChunk = subChunk ? `${subChunk}, ${trimmedClause}` : trimmedClause;
            } else {
              if (subChunk) chunks.push(subChunk);
              subChunk = trimmedClause;
            }
          }
          if (subChunk) chunks.push(subChunk);
          currentChunk = '';
        } else {
          currentChunk = sentence;
        }
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks.length > 0 ? chunks : [cleaned];
  }

  /**
   * Finds the best matching voice for English (en-IN) or Hindi (hi-IN)
   */
  private selectVoice(language: Language): SpeechSynthesisVoice | null {
    this.loadVoices();
    if (!this.voices || this.voices.length === 0) return null;

    if (language === 'hi') {
      // 1. Exact hi-IN voice
      const hiInVoice = this.voices.find(v => v.lang === 'hi-IN' || v.lang === 'hi_IN');
      if (hiInVoice) return hiInVoice;

      // 2. Any voice containing 'hi' or 'hindi'
      const hindiVoice = this.voices.find(v => 
        v.lang.toLowerCase().startsWith('hi') || 
        v.name.toLowerCase().includes('hindi') || 
        v.name.toLowerCase().includes('हिन्दी')
      );
      if (hindiVoice) return hindiVoice;

      // 3. Fallback to Indian English voice or default
      const inVoice = this.voices.find(v => v.lang.includes('IN') || v.name.includes('India'));
      if (inVoice) return inVoice;
    } else {
      // English (Prefer Indian English en-IN for insurance context)
      const enInVoice = this.voices.find(v => v.lang === 'en-IN' || v.lang === 'en_IN');
      if (enInVoice) return enInVoice;

      const anyInVoice = this.voices.find(v => 
        v.name.toLowerCase().includes('india') || 
        v.name.toLowerCase().includes('ravi') || 
        v.name.toLowerCase().includes('heera') ||
        v.name.toLowerCase().includes('neerja')
      );
      if (anyInVoice) return anyInVoice;

      // Fallback to en-GB or en-US
      const enGbVoice = this.voices.find(v => v.lang === 'en-GB');
      if (enGbVoice) return enGbVoice;

      const enUsVoice = this.voices.find(v => v.lang === 'en-US' || v.lang.startsWith('en'));
      if (enUsVoice) return enUsVoice;
    }

    return this.voices.find(v => v.default) || this.voices[0] || null;
  }

  /**
   * Speak a message text out loud
   */
  public speak(
    messageId: string, 
    text: string, 
    language: Language,
    onFinishCallback?: () => void
  ) {
    if (!this.isSupported()) {
      console.warn('[SpeechService] Speech synthesis not supported in this environment');
      return;
    }

    // Stop any currently playing speech first (Prevent overlapping audio)
    this.stop();

    const chunks = this.splitIntoChunks(text);
    if (chunks.length === 0) return;

    this.currentMessageId = messageId;
    this.currentUtteranceIndex = 0;
    this.utteranceChunks = [];
    const selectedVoice = this.selectVoice(language);

    // Build utterances for each sentence chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunkText = chunks[i];
      const utterance = new SpeechSynthesisUtterance(chunkText);
      
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      // Slightly tuned rate for warm, natural conversational clarity
      utterance.rate = language === 'hi' ? 0.95 : 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        if (i === 0) {
          this.state = 'playing';
          this.notify();
          this.startKeepAlive();
        }
      };

      utterance.onend = () => {
        if (i === chunks.length - 1) {
          // Last chunk finished
          this.stopKeepAlive();
          this.state = 'idle';
          this.currentMessageId = null;
          this.notify();
          if (onFinishCallback) onFinishCallback();
        }
      };

      utterance.onerror = (e) => {
        console.warn('[SpeechService] Utterance error:', e.error);
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          this.stopKeepAlive();
          this.state = 'idle';
          this.currentMessageId = null;
          this.notify();
        }
      };

      this.utteranceChunks.push(utterance);
    }

    this.state = 'playing';
    this.notify();

    // Enqueue chunks sequentially in browser synthesis queue
    try {
      window.speechSynthesis.cancel();
      for (const utt of this.utteranceChunks) {
        window.speechSynthesis.speak(utt);
      }
    } catch (err) {
      console.error('[SpeechService] Speak failed:', err);
      this.stop();
    }
  }

  /**
   * Pause ongoing speech
   */
  public pause() {
    if (!this.isSupported() || this.state !== 'playing') return;
    try {
      window.speechSynthesis.pause();
      this.state = 'paused';
      this.notify();
    } catch (err) {
      console.warn('[SpeechService] Pause failed:', err);
    }
  }

  /**
   * Resume paused speech
   */
  public resume() {
    if (!this.isSupported() || this.state !== 'paused') return;
    try {
      window.speechSynthesis.resume();
      this.state = 'playing';
      this.notify();
    } catch (err) {
      console.warn('[SpeechService] Resume failed:', err);
    }
  }

  /**
   * Stop all ongoing and pending speech immediately
   */
  public stop() {
    this.stopKeepAlive();
    if (this.isSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    this.state = 'idle';
    this.currentMessageId = null;
    this.utteranceChunks = [];
    this.notify();
  }

  public getState(): { state: SpeechPlaybackState; messageId: string | null } {
    return {
      state: this.state,
      messageId: this.currentMessageId
    };
  }

  /**
   * Chromium bug workaround: Keep long speech synthesis alive
   */
  private startKeepAlive() {
    this.stopKeepAlive();
    this.keepAliveInterval = setInterval(() => {
      if (this.state === 'playing' && this.isSupported()) {
        try {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        } catch {
          // ignore
        }
      }
    }, 12000);
  }

  private stopKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }
}

export const speechService = new SpeechService();

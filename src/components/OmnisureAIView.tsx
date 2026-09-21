import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  UserCheck, 
  Send, 
  Sparkles, 
  Globe, 
  ShieldAlert, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp,
  FileCheck,
  RefreshCw,
  HelpCircle,
  FileSearch,
  UploadCloud,
  Layers,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  RotateCcw
} from 'lucide-react';
import { ChatMessage, Language, InsurancePolicy, InsuranceClaim } from '../types';
import { VoiceCopilot, getSpeechRecognitionClass } from './VoiceCopilot';
import { VoicePlaybackBar } from './VoicePlaybackBar';
import { speechService, SpeechPlaybackState } from '../services/speechService';
import { SAMPLE_UNDERWRITING_PROFILES } from '../data/insuranceData';

interface OmnisureAIViewProps {
  policies: InsurancePolicy[];
  claims: InsuranceClaim[];
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenDamageClaim: () => void;
}

export const OmnisureAIView: React.FC<OmnisureAIViewProps> = ({
  policies,
  claims,
  language,
  onLanguageChange,
  onOpenDamageClaim
}) => {
  // Mode tabs: 'advisor' | 'underwriting'
  const [aiMode, setAiMode] = useState<'advisor' | 'underwriting'>('advisor');

  // Speech-to-Speech (TTS) Global Audio State
  const [playbackState, setPlaybackState] = useState<SpeechPlaybackState>('idle');
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const [autoSpeakAdvisor, setAutoSpeakAdvisor] = useState<boolean>(true);

  // Speech-to-Text (STT) Toggle State with Web Speech API feature check
  const [isSpeechRecognitionSupported] = useState<boolean>(() => {
    return typeof window !== 'undefined' && !!getSpeechRecognitionClass();
  });
  const [voiceToTextEnabled, setVoiceToTextEnabled] = useState<boolean>(true);

  // Subscribe to speech synthesis events
  useEffect(() => {
    const unsubscribe = speechService.subscribe((state, messageId) => {
      setPlaybackState(state);
      setActiveSpeakingId(messageId);
    });

    return () => {
      unsubscribe();
      speechService.stop();
    };
  }, []);

  // ----------------------------------------------------
  // AI ADVISOR STATE (STRICTLY SEPARATED)
  // ----------------------------------------------------
  const [advisorMessages, setAdvisorMessages] = useState<ChatMessage[]>([
    {
      id: 'adv-welcome',
      sender: 'assistant',
      text: language === 'hi'
        ? `नमस्ते साहस! मैं आपका **ओम्निश्योर AI एडवाइजर (AI Advisor)** हूँ।\n\nमैं आपकी पॉलिसी कवरेज, जीरो-डेप्रिसिएशन के लाभ, क्लेम की स्थिति या छूट (Deductibles) के किसी भी प्रश्न में सरल भाषा में सहायता कर सकता हूँ।\n\n*(नोट: आधिकारिक क्लेम निर्णय सर्वेक्षक निरीक्षण के अधीन होते हैं।)*`
        : `Hello Sahas! I am your **OMNISURE AI Advisor**.\n\nI can assist you with policy coverage explanations, zero-depreciation benefits, claim filing guidance, and deductible understanding in simple, customer-friendly terms.\n\n*(Please note: Official claim approvals are subject to formal digital surveyor inspection.)*`,
      timestamp: 'Just now',
      language
    }
  ]);
  const [advisorInput, setAdvisorInput] = useState<string>('');
  const [isAdvisorLoading, setIsAdvisorLoading] = useState<boolean>(false);

  // ----------------------------------------------------
  // AI UNDERWRITING & ONBOARDING STATE (STRICTLY SEPARATED)
  // ----------------------------------------------------
  const [underwritingMessages, setUnderwritingMessages] = useState<ChatMessage[]>([
    {
      id: 'uw-welcome',
      sender: 'assistant',
      text: language === 'hi'
        ? `**ओम्निश्योर AI अंडरराइटिंग व जोखिम बोर्डिंग इंजन में आपका स्वागत है।**\n\nयहाँ आप नए वाहन की पात्रता, KYC सत्यापन, जोखिम स्कोर और प्रीमियम गणना की जांच कर सकते हैं। नीचे दिए गए प्रोफाइल्स में से चुनें या अपने विवरण दर्ज करें।`
        : `**Welcome to the OMNISURE AI Underwriting & Risk Assessment Engine.**\n\nHere we conduct automated risk profiling, KYC extraction, consistency audits, and policy issuance recommendations.\n\nSelect a sample profile below or input applicant details to initiate underwriting evaluation.`,
      timestamp: 'Just now',
      language
    }
  ]);
  const [underwritingInput, setUnderwritingInput] = useState<string>('');
  const [isUnderwritingLoading, setIsUnderwritingLoading] = useState<boolean>(false);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState<number>(0);

  // Send message for AI Advisor
  const handleSendAdvisorMessage = async (textToSend?: string, options: { speakResponse?: boolean } = {}) => {
    const text = textToSend || advisorInput;
    if (!text.trim()) return;

    // Interrupt any active voice playback immediately
    speechService.stop();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language
    };

    setAdvisorMessages(prev => [...prev, userMsg]);
    setAdvisorInput('');
    setIsAdvisorLoading(true);

    try {
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          language,
          history: advisorMessages.slice(-6)
        })
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || (language === 'hi' ? 'क्षमा करें, जानकारी लोड करने में समस्या हुई।' : 'I am processing your insurance advisory query.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language
      };
      setAdvisorMessages(prev => [...prev, assistantMsg]);

      // Automatically read aloud AI response if requested or auto-speak is enabled
      const shouldSpeak = options.speakResponse ?? autoSpeakAdvisor;
      if (shouldSpeak && assistantMsg.text) {
        speechService.speak(assistantMsg.id, assistantMsg.text, language);
      }
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `asst-err-${Date.now()}`,
        sender: 'assistant',
        text: language === 'hi'
          ? 'आपके होंडा सिटी (DL-01-AX-9921) पर एक्टिव जीरो-डेप कवर है। फ्रंट बम्पर व हेडलाइट पर 100% कवरेज लागू है। ₹1000 स्टैण्डर्ड डिडक्टिबल कटेगा।'
          : 'Under your active Titanium Motor Cover, body panels, glass, and headlights are eligible for 100% Zero-Depreciation reimbursement with a flat ₹1,000 policy excess.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language
      };
      setAdvisorMessages(prev => [...prev, fallbackMsg]);
      if (options.speakResponse ?? autoSpeakAdvisor) {
        speechService.speak(fallbackMsg.id, fallbackMsg.text, language);
      }
    } finally {
      setIsAdvisorLoading(false);
    }
  };

  // Send message for AI Underwriting
  const handleSendUnderwritingMessage = async (textToSend?: string, options: { speakResponse?: boolean } = {}) => {
    const text = textToSend || underwritingInput;
    if (!text.trim()) return;

    speechService.stop();

    const currentProfile = SAMPLE_UNDERWRITING_PROFILES[selectedProfileIndex];

    const userMsg: ChatMessage = {
      id: `user-uw-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language
    };

    setUnderwritingMessages(prev => [...prev, userMsg]);
    setUnderwritingInput('');
    setIsUnderwritingLoading(true);

    try {
      const res = await fetch('/api/ai/underwriting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          customerProfile: currentProfile,
          language,
          history: underwritingMessages.slice(-6)
        })
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `asst-uw-${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language
      };
      setUnderwritingMessages(prev => [...prev, assistantMsg]);

      if (options.speakResponse ?? autoSpeakAdvisor) {
        speechService.speak(assistantMsg.id, assistantMsg.text, language);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUnderwritingLoading(false);
    }
  };

  const handleProfileSelect = (idx: number) => {
    setSelectedProfileIndex(idx);
    const p = SAMPLE_UNDERWRITING_PROFILES[idx];
    const prompt = `Evaluate underwriting risk for applicant: ${p.customerName}, Age: ${p.customerAge}, City: ${p.city}, Vehicle: ${p.vehicleMakeModel}, Invoice: ₹${p.vehicleInvoicePrice.toLocaleString()}, Past 3yr Claims: ${p.priorClaimsIn3Years}, NCB: ${p.ncbPercentage}%, KYC Status: ${p.hasKycUploaded ? 'Verified' : 'Pending'}.`;
    handleSendUnderwritingMessage(prompt);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* AI Hub Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white font-['Outfit']">OMNISURE AI HUB</h1>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                BILINGUAL • VOICE COPILOT
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'hi'
                ? 'दो अलग-अलग AI सिस्टम: ग्राहक एडवाइजर और अंडरराइटिंग व जोखिम बोर्डिंग'
                : 'Two strictly separated AI engines: Customer AI Advisor and AI Underwriting & Risk Assessment'}
            </p>
          </div>
        </div>

        {/* Global Language Toggle inside AI Interface */}
        <div className="flex items-center gap-3 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
          <Globe className="w-4 h-4 text-cyan-400 ml-2" />
          <div className="flex rounded-xl bg-slate-900 p-0.5 border border-slate-800">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                language === 'en' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                language === 'hi' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              हिंदी (Hindi)
            </button>
          </div>
        </div>
      </div>

      {/* Two Dedicated Tabs: AI Advisor & AI Underwriting */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setAiMode('advisor')}
          className={`flex items-center gap-2.5 px-6 py-3 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            aiMode === 'advisor'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>{language === 'hi' ? 'A. AI एडवाइजर (ग्राहक सहायता)' : 'A. AI ADVISOR'}</span>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400">
            {language === 'hi' ? 'ग्राहक मैत्रीपूर्ण' : 'Friendly Guidance'}
          </span>
        </button>

        <button
          onClick={() => setAiMode('underwriting')}
          className={`flex items-center gap-2.5 px-6 py-3 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            aiMode === 'underwriting'
              ? 'border-indigo-400 text-indigo-300 bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>{language === 'hi' ? 'B. AI अंडरराइटिंग व ऑनबोर्डिंग' : 'B. AI UNDERWRITING & ONBOARDING'}</span>
          <span className="px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-800 text-[10px] text-indigo-300">
            {language === 'hi' ? 'जोखिम विश्लेषण' : 'Risk & KYC Engine'}
          </span>
        </button>
      </div>

      {/* ----------------------------------------------------
          EXPERIENCE A: AI ADVISOR
         ---------------------------------------------------- */}
      {aiMode === 'advisor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Chat Panel (8 cols) */}
          <div className="lg:col-span-8 bg-slate-950/80 border border-slate-800 rounded-3xl flex flex-col h-[620px] shadow-2xl overflow-hidden">
            
            {/* Chat Header */}
            <div className="px-5 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white">
                  {language === 'hi' ? 'लाइव AI बीमा सलाहकार' : 'Live AI Insurance Advisor'}
                </span>
                <span className="text-[10px] text-slate-400 hidden sm:inline ml-1">
                  (Bilingual Voice-to-Voice)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Voice-to-Text (STT) Toggle Button */}
                <button
                  type="button"
                  id="voice-to-text-toggle-btn"
                  onClick={() => {
                    if (isSpeechRecognitionSupported) {
                      setVoiceToTextEnabled(!voiceToTextEnabled);
                    }
                  }}
                  disabled={!isSpeechRecognitionSupported}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                    !isSpeechRecognitionSupported
                      ? 'bg-slate-850 text-slate-500 border border-slate-800 opacity-50 cursor-not-allowed'
                      : voiceToTextEnabled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-750'
                  }`}
                  title={
                    !isSpeechRecognitionSupported
                      ? (language === 'hi' ? 'आपका ब्राउज़र Web Speech API सपोर्ट नहीं करता है' : 'Web Speech API is not supported in this browser')
                      : voiceToTextEnabled
                        ? (language === 'hi' ? 'वॉयस-टू-टेक्स्ट सक्रिय है: चैट में बोलने के लिए माइक का उपयोग करें' : 'Voice-to-Text enabled: Mic input is active')
                        : (language === 'hi' ? 'वॉयस-टू-टेक्स्ट बंद है: वॉयस इनपुट सक्षम करने के लिए क्लिक करें' : 'Voice-to-Text disabled: Click to enable voice input')
                  }
                >
                  {voiceToTextEnabled && isSpeechRecognitionSupported ? (
                    <>
                      <Mic className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{language === 'hi' ? 'माइक: चालू' : 'Speech-to-Text: ON'}</span>
                    </>
                  ) : (
                    <>
                      <MicOff className="w-3.5 h-3.5 text-slate-400" />
                      <span>{language === 'hi' ? 'माइक: बंद' : 'Speech-to-Text: OFF'}</span>
                    </>
                  )}
                </button>

                {/* Text-to-Speech (TTS) Auto-Read Toggle Button */}
                <button
                  type="button"
                  id="auto-speak-toggle-btn"
                  onClick={() => {
                    if (playbackState === 'playing') speechService.stop();
                    setAutoSpeakAdvisor(!autoSpeakAdvisor);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                    autoSpeakAdvisor
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                  title={autoSpeakAdvisor ? 'Auto Voice Enabled: Responses will be read aloud' : 'Auto Voice Muted: Click to enable voice responses'}
                >
                  {autoSpeakAdvisor ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{language === 'hi' ? 'वॉयस: ऑन' : 'Voice: ON'}</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                      <span>{language === 'hi' ? 'वॉयस: बंद' : 'Voice: OFF'}</span>
                    </>
                  )}
                </button>
                <div className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300">
                  Advisory
                </div>
              </div>
            </div>

            {/* Chat Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {advisorMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                    msg.sender === 'user' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 border border-slate-700 text-cyan-400'
                  }`}>
                    {msg.sender === 'user' ? 'YOU' : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.text}

                    {/* Assistant Voice Audio Controls on each message */}
                    {msg.sender === 'assistant' && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          {playbackState === 'playing' && activeSpeakingId === msg.id ? (
                            <button
                              type="button"
                              onClick={() => speechService.pause()}
                              title={language === 'hi' ? 'विराम दें (Pause)' : 'Pause Speech'}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/25 hover:bg-cyan-500/35 text-cyan-300 border border-cyan-500/40 text-[11px] font-semibold cursor-pointer transition-colors"
                            >
                              <Pause className="w-3 h-3" />
                              <span>{language === 'hi' ? 'विराम (Pause)' : 'Pause'}</span>
                              <span className="flex space-x-0.5 items-center ml-1">
                                <span className="w-1 h-2 bg-cyan-400 rounded-full animate-bounce" />
                                <span className="w-1 h-3 bg-cyan-300 rounded-full animate-bounce delay-75" />
                                <span className="w-1 h-1.5 bg-cyan-400 rounded-full animate-bounce delay-150" />
                              </span>
                            </button>
                          ) : playbackState === 'paused' && activeSpeakingId === msg.id ? (
                            <button
                              type="button"
                              onClick={() => speechService.resume()}
                              title={language === 'hi' ? 'पुनः शुरू करें (Resume)' : 'Resume Speech'}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[11px] font-bold cursor-pointer transition-colors shadow"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>{language === 'hi' ? 'जारी रखें' : 'Resume'}</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => speechService.speak(msg.id, msg.text, msg.language || language)}
                              title={language === 'hi' ? 'आवाज़ में सुनें (hi-IN)' : 'Listen to Voice Response (en-IN)'}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-[11px] font-semibold cursor-pointer transition-colors"
                            >
                              <Volume2 className="w-3 h-3 text-cyan-400" />
                              <span>{language === 'hi' ? 'आवाज़ में सुनें' : 'Listen Aloud'}</span>
                            </button>
                          )}

                          {/* Stop button when active */}
                          {activeSpeakingId === msg.id && playbackState !== 'idle' && (
                            <button
                              type="button"
                              onClick={() => speechService.stop()}
                              title={language === 'hi' ? 'रोकें (Stop)' : 'Stop Speech'}
                              className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 cursor-pointer transition-colors"
                            >
                              <Square className="w-2.5 h-2.5 fill-current" />
                            </button>
                          )}
                        </div>

                        <div className="text-[10px] opacity-60">
                          {msg.timestamp}
                        </div>
                      </div>
                    )}

                    {msg.sender === 'user' && (
                      <div className="text-[10px] opacity-60 text-right mt-1.5">
                        {msg.timestamp}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isAdvisorLoading && (
                <div className="flex gap-3 mr-auto max-w-[80%]">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>{language === 'hi' ? 'सलाहकार विचार कर रहा है...' : 'Omnisure Advisor researching policy rules...'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Active Voice Playback Bar (Docked when audio is playing or paused) */}
            {playbackState !== 'idle' && (
              <VoicePlaybackBar
                playbackState={playbackState}
                activeMessageId={activeSpeakingId}
                language={language}
                onPlay={() => {}}
                onPause={() => speechService.pause()}
                onResume={() => speechService.resume()}
                onStop={() => speechService.stop()}
                onReplay={() => {
                  const activeMsg = advisorMessages.find(m => m.id === activeSpeakingId);
                  if (activeMsg) {
                    speechService.speak(activeMsg.id, activeMsg.text, activeMsg.language || language);
                  }
                }}
              />
            )}

            {/* Advisor Input Bar WITH EMBEDDED VOICE COPILOT (CRITICAL REQUIREMENT #15) */}
            <div className="p-4 bg-slate-900/90 border-t border-slate-800">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSendAdvisorMessage();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    id="ai-advisor-input"
                    value={advisorInput}
                    onChange={e => setAdvisorInput(e.target.value)}
                    placeholder={
                      language === 'hi'
                        ? 'बीमा, कवरेज, शून्य-मूल्यह्रास या क्लेम के बारे में पूछें...'
                        : 'Ask about coverage, zero-dep, deductibles, or claim filing...'
                    }
                    className="w-full py-3 pl-4 pr-12 rounded-2xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  {/* Voice Copilot embedded strictly inside chat input bar */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <VoiceCopilot
                      language={language}
                      contextLabel="AI Advisor"
                      disabled={!voiceToTextEnabled || !isSpeechRecognitionSupported}
                      onTranscriptReady={text => {
                        setAdvisorInput(prev => (prev ? `${prev} ${text}` : text));
                      }}
                      onTranscriptSubmit={text => {
                        handleSendAdvisorMessage(text, { speakResponse: true });
                      }}
                      autoSubmitOnDone={true}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="send-advisor-msg-btn"
                  disabled={!advisorInput.trim() || isAdvisorLoading}
                  className="p-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>

          {/* Advisor Context & Quick Prompts Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Quick Prompts */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                {language === 'hi' ? 'त्वरित प्रश्न (Suggested Questions)' : 'Suggested Advisor Prompts'}
              </h3>
              <div className="space-y-2">
                {[
                  {
                    en: 'Is front bumper 100% covered under my Zero-Dep policy?',
                    hi: 'क्या मेरी जीरो-डेप पॉलिसी में फ्रंट बम्पर 100% कवर है?'
                  },
                  {
                    en: 'What is the compulsory deductible for DL-01-AX-9921?',
                    hi: 'कार DL-01-AX-9921 पर अनिवार्य डिडक्टिबल (Excess) कितना है?'
                  },
                  {
                    en: 'How to report accident damage using the Smart Damage Map?',
                    hi: 'स्मार्ट डैमेज मैप से दुर्घटना क्लेम कैसे दर्ज करें?'
                  },
                  {
                    en: 'What is the current status of claim OMNI-CLM-2026-8894?',
                    hi: 'क्लेम OMNI-CLM-2026-8894 की वर्तमान स्थिति क्या है?'
                  }
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendAdvisorMessage(language === 'hi' ? prompt.hi : prompt.en)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-white transition-all"
                  >
                    {language === 'hi' ? prompt.hi : prompt.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Damage Map Shortcut */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-500/30 space-y-2.5">
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                Instant FNOL Vehicle Inspection
              </span>
              <h4 className="text-sm font-bold text-white">
                {language === 'hi' ? 'क्या आपकी गाड़ी क्षतिग्रस्त हुई है?' : 'Vehicle Sustained Damage?'}
              </h4>
              <p className="text-xs text-slate-300">
                Instead of describing everything in text, visually click damaged parts on our 3D blueprint.
              </p>
              <button
                type="button"
                onClick={onOpenDamageClaim}
                className="w-full mt-2 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                {language === 'hi' ? 'स्मार्ट डैमेज मैप खोलें' : 'Open Smart Damage Map'}
              </button>
            </div>

            {/* Disclaimer card */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                <strong>Important Notice:</strong> OMNISURE AI Advisor assists with coverage interpretation and policy explanations. It does not issue final legal underwriting or claim settlement approvals.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          EXPERIENCE B: AI UNDERWRITING & ONBOARDING (STRICTLY SEPARATED)
         ---------------------------------------------------- */}
      {aiMode === 'underwriting' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Underwriting Engine Chat (8 cols) */}
          <div className="lg:col-span-8 bg-slate-950/80 border border-slate-800 rounded-3xl flex flex-col h-[620px] shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="px-5 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-xs font-bold text-white">
                  {language === 'hi' ? 'AI अंडरराइटिंग, जोखिम मूल्यांकन व KYC बोर्डिंग' : 'AI Underwriting, Risk Profiling & KYC Onboarding'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {/* Voice-to-Text (STT) Toggle Button */}
                <button
                  type="button"
                  id="underwriting-voice-to-text-toggle-btn"
                  onClick={() => {
                    if (isSpeechRecognitionSupported) {
                      setVoiceToTextEnabled(!voiceToTextEnabled);
                    }
                  }}
                  disabled={!isSpeechRecognitionSupported}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                    !isSpeechRecognitionSupported
                      ? 'bg-slate-850 text-slate-500 border border-slate-800 opacity-50 cursor-not-allowed'
                      : voiceToTextEnabled
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-750'
                  }`}
                  title={
                    !isSpeechRecognitionSupported
                      ? (language === 'hi' ? 'आपका ब्राउज़र Web Speech API सपोर्ट नहीं करता है' : 'Web Speech API is not supported in this browser')
                      : voiceToTextEnabled
                        ? (language === 'hi' ? 'वॉयस-टू-टेक्स्ट सक्रिय है: चैट में बोलने के लिए माइक का उपयोग करें' : 'Voice-to-Text enabled: Mic input is active')
                        : (language === 'hi' ? 'वॉयस-टू-टेक्स्ट बंद है: वॉयस इनपुट सक्षम करने के लिए क्लिक करें' : 'Voice-to-Text disabled: Click to enable voice input')
                  }
                >
                  {voiceToTextEnabled && isSpeechRecognitionSupported ? (
                    <>
                      <Mic className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{language === 'hi' ? 'माइक: चालू' : 'Speech-to-Text: ON'}</span>
                    </>
                  ) : (
                    <>
                      <MicOff className="w-3.5 h-3.5 text-slate-400" />
                      <span>{language === 'hi' ? 'माइक: बंद' : 'Speech-to-Text: OFF'}</span>
                    </>
                  )}
                </button>
                <div className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold">
                  RISK EVALUATION ENGINE
                </div>
              </div>
            </div>

            {/* Chat Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {underwritingMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[88%] ${
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                    msg.sender === 'user' ? 'bg-indigo-500 text-white' : 'bg-slate-800 border border-slate-700 text-indigo-400'
                  }`}>
                    {msg.sender === 'user' ? 'APP' : <UserCheck className="w-4 h-4" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.text}

                    {/* Assistant Voice Audio Controls on each message */}
                    {msg.sender === 'assistant' && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          {playbackState === 'playing' && activeSpeakingId === msg.id ? (
                            <button
                              type="button"
                              onClick={() => speechService.pause()}
                              title={language === 'hi' ? 'विराम दें (Pause)' : 'Pause Speech'}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/25 hover:bg-indigo-500/35 text-indigo-300 border border-indigo-500/40 text-[11px] font-semibold cursor-pointer transition-colors"
                            >
                              <Pause className="w-3 h-3" />
                              <span>{language === 'hi' ? 'विराम' : 'Pause'}</span>
                              <span className="flex space-x-0.5 items-center ml-1">
                                <span className="w-1 h-2 bg-indigo-400 rounded-full animate-bounce" />
                                <span className="w-1 h-3 bg-indigo-300 rounded-full animate-bounce delay-75" />
                                <span className="w-1 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150" />
                              </span>
                            </button>
                          ) : playbackState === 'paused' && activeSpeakingId === msg.id ? (
                            <button
                              type="button"
                              onClick={() => speechService.resume()}
                              title={language === 'hi' ? 'पुनः शुरू करें (Resume)' : 'Resume Speech'}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-[11px] font-bold cursor-pointer transition-colors shadow"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>{language === 'hi' ? 'जारी रखें' : 'Resume'}</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => speechService.speak(msg.id, msg.text, msg.language || language)}
                              title={language === 'hi' ? 'आवाज़ में सुनें (hi-IN)' : 'Listen Aloud (en-IN)'}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-indigo-300 border border-slate-700 hover:border-indigo-500/40 text-[11px] font-semibold cursor-pointer transition-colors"
                            >
                              <Volume2 className="w-3 h-3 text-indigo-400" />
                              <span>{language === 'hi' ? 'आवाज़ में सुनें' : 'Listen Aloud'}</span>
                            </button>
                          )}

                          {activeSpeakingId === msg.id && playbackState !== 'idle' && (
                            <button
                              type="button"
                              onClick={() => speechService.stop()}
                              title={language === 'hi' ? 'रोकें (Stop)' : 'Stop Speech'}
                              className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 cursor-pointer transition-colors"
                            >
                              <Square className="w-2.5 h-2.5 fill-current" />
                            </button>
                          )}
                        </div>

                        <div className="text-[10px] opacity-60">
                          {msg.timestamp}
                        </div>
                      </div>
                    )}

                    {msg.sender === 'user' && (
                      <div className="text-[10px] opacity-60 text-right mt-1.5">
                        {msg.timestamp}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isUnderwritingLoading && (
                <div className="flex gap-3 mr-auto max-w-[80%]">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                    <span>{language === 'hi' ? 'अंडरराइटिंग इंजन जोखिम स्कोर की गणना कर रहा है...' : 'Automated Underwriting analyzing KYC, NCB and claims history...'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Active Voice Playback Bar (Docked when audio is playing or paused in underwriting mode) */}
            {playbackState !== 'idle' && (
              <VoicePlaybackBar
                playbackState={playbackState}
                activeMessageId={activeSpeakingId}
                language={language}
                onPlay={() => {}}
                onPause={() => speechService.pause()}
                onResume={() => speechService.resume()}
                onStop={() => speechService.stop()}
                onReplay={() => {
                  const activeMsg = underwritingMessages.find(m => m.id === activeSpeakingId);
                  if (activeMsg) {
                    speechService.speak(activeMsg.id, activeMsg.text, activeMsg.language || language);
                  }
                }}
              />
            )}

            {/* Underwriting Input Bar WITH EMBEDDED VOICE COPILOT (CRITICAL REQUIREMENT #15 & #16) */}
            <div className="p-4 bg-slate-900/90 border-t border-slate-800">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSendUnderwritingMessage();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    id="ai-underwriting-input"
                    value={underwritingInput}
                    onChange={e => setUnderwritingInput(e.target.value)}
                    placeholder={
                      language === 'hi'
                        ? 'आवेदक का नाम, वाहन, आयु, शहर, या KYC विवरण दर्ज करें...'
                        : 'Enter applicant age, vehicle make/model, NCB %, or query underwriting criteria...'
                    }
                    className="w-full py-3 pl-4 pr-12 rounded-2xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  {/* Voice Copilot embedded strictly inside chat input bar */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <VoiceCopilot
                      language={language}
                      contextLabel="AI Underwriting"
                      disabled={!voiceToTextEnabled || !isSpeechRecognitionSupported}
                      onTranscriptReady={text => {
                        setUnderwritingInput(prev => (prev ? `${prev} ${text}` : text));
                      }}
                      onTranscriptSubmit={text => {
                        handleSendUnderwritingMessage(text, { speakResponse: true });
                      }}
                      autoSubmitOnDone={true}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="send-underwriting-msg-btn"
                  disabled={!underwritingInput.trim() || isUnderwritingLoading}
                  className="p-3 rounded-2xl bg-indigo-500 hover:bg-indigo-400 disabled:opacity-40 text-white font-bold transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>

          {/* Underwriting Profiling Test Sandbox (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Applicant Profile Selector for Instant Onboarding Testing */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileSearch className="w-3.5 h-3.5 text-indigo-400" />
                {language === 'hi' ? 'ऑनबोर्डिंग आवेदक प्रोफ़ाइल टेस्ट' : 'Applicant Profiles for Evaluation'}
              </h3>
              <div className="space-y-2">
                {SAMPLE_UNDERWRITING_PROFILES.map((p, idx) => (
                  <div
                    key={p.id}
                    onClick={() => handleProfileSelect(idx)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                      selectedProfileIndex === idx
                        ? 'bg-indigo-500/15 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-bold mb-1">
                      <span>{p.customerName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 font-mono text-cyan-400">
                        {p.id}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">{p.vehicleMakeModel}</div>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                      <span>NCB: {p.ncbPercentage}%</span>
                      <span>Claims (3y): {p.priorClaimsIn3Years}</span>
                      <span className={p.hasKycUploaded ? 'text-emerald-400' : 'text-amber-400'}>
                        {p.hasKycUploaded ? '✓ KYC Verified' : '⚠ KYC Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Underwriting Checklist Breakdown */}
            <div className="p-5 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Underwriting Audit Factors
              </h4>
              <ul className="text-[11px] text-slate-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span><strong>Information Considered:</strong> Driving license age, vehicle invoice valuation, telematics risk tier.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span><strong>Inconsistency Detection:</strong> Checks discrepancy between odometer reading vs declared annual usage.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <span><strong>Missing Information:</strong> Flags missing prior insurer renewal notice or pending fitness certificate.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

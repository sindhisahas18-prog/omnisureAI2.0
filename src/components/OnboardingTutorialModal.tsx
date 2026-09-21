import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Bot, 
  Mic, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Sparkles, 
  Car, 
  HeartPulse, 
  Home, 
  Smartphone, 
  Plane, 
  Shield, 
  Bike,
  Activity,
  Layers,
  Zap,
  Building2
} from 'lucide-react';
import { Language, NavigationTab } from '../types';

interface OnboardingTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onNavigateTab: (tab: NavigationTab) => void;
}

export const OnboardingTutorialModal: React.FC<OnboardingTutorialModalProps> = ({
  isOpen,
  onClose,
  language,
  onNavigateTab
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const slides = [
    // SLIDE 1 — WELCOME TO OMNISURE
    {
      id: 'welcome',
      icon: ShieldCheck,
      iconBg: 'bg-sky-50 text-sky-600 border-sky-100',
      badge: 'Step 1 of 6',
      titleEn: 'Welcome to OMNISURE',
      titleHi: 'ओम्निश्योर में आपका स्वागत है',
      subtitleEn: 'Next-Generation Indian InsurTech Platform',
      subtitleHi: 'अग्रणी भारतीय इंश्योरटेक प्लेटफ़ॉर्म',
      descEn: 'A modern, unified platform for managing insurance policies, filing First Notice of Loss (FNOL) claims, and receiving policy-aware AI advisory.',
      descHi: 'स्मार्ट पॉलिसियों, आसान क्लेम्स और व्यक्तिगत बीमा सहायता के लिए आपका एकीकृत एआई-संचालित इंश्योरटेक प्लेटफ़ॉर्म।',
      visualType: 'welcome-card',
      bulletsEn: [
        'Centralized dashboard for all personal, motor, property & family policies',
        'Direct IRDAI-compliant digital FNOL claim lodging with fast-track processing',
        'Bilingual assistance in English and Hindi powered by specialized AI'
      ],
      bulletsHi: [
        'सभी व्यक्तिगत, मोटर, संपत्ति व पारिवारिक पॉलिसियों का एकीकृत डैशबोर्ड',
        'आईआरडीएआई नियमों के तहत सीधा डिजिटल एफएनओएल त्वरित क्लेम पंजीकरण',
        'पॉलिसी संदर्भ-जागरूक एआई द्वारा द्विभाषी सहायता (अंग्रेजी व हिंदी)'
      ]
    },

    // SLIDE 2 — MANAGE POLICIES
    {
      id: 'policies',
      icon: FileText,
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      badge: 'Step 2 of 6',
      titleEn: 'Manage Your Policies',
      titleHi: 'अपनी पॉलिसियाँ प्रबंधित करें',
      subtitleEn: 'Comprehensive Policy Dossiers & Coverage Verification',
      subtitleHi: 'संपूर्ण पॉलिसी डॉजियर और कवरेज सत्यापन',
      descEn: 'Inspect active covers, sum insured, IDV, compulsory deductibles, active riders, and renewal schedules all in one structured view.',
      descHi: 'अपनी सक्रिय पॉलिसियाँ, कवरेज, आईडीवी, कटौती, सक्रिय राइडर्स और नवीनीकरण की तारीखें एक ही जगह देखें।',
      visualType: 'policies-preview',
      bulletsEn: [
        'Live Insured Declared Value (IDV) and zero-depreciation audit',
        'Automated renewal calendar with advance premium notifications',
        'Instant one-click download of official IRDAI schedule certificates'
      ],
      bulletsHi: [
        'बीमित घोषित मूल्य (IDV) और जीरो-डेप्रिसिएशन पात्रता का वास्तविक समय ऑडिट',
        'स्वचालित नवीनीकरण कैलेंडर और अग्रिम प्रीमियम रिमाइंडर',
        'आधिकारिक IRDAI पॉलिसी शेड्यूल प्रमाणपत्र तुरंत डाउनलोड करें'
      ]
    },

    // SLIDE 3 — MULTI-INSURANCE CLAIM WORKFLOW
    {
      id: 'claims',
      icon: Layers,
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      badge: 'Step 3 of 6',
      titleEn: 'Type-Specific Claim Workflow',
      titleHi: 'विशिष्ट क्लेम वर्कफ़्लो',
      subtitleEn: 'Tailored Questionnaires for Every Insurance Category',
      subtitleHi: 'प्रत्येक बीमा श्रेणी के लिए समर्पित प्रश्नोत्तरी',
      descEn: 'File claims with category-specific forms — from interactive 3D car part selectors to TPA hospital pre-authorization and airline PIR reports.',
      descHi: 'प्रत्येक श्रेणी के लिए अनुकूलित फॉर्म — इंटरएक्टिव कार ब्लूप्रिंट से लेकर अस्पताल टीपीए और एयरलाइन पीआईआर रिपोर्ट तक।',
      visualType: 'types-grid',
      bulletsEn: [
        'Motor & Bike: Part damage mapping and cashless workshop routing',
        'Health & Accident: Cashless hospital TPA desk and disability benefits',
        'Home, Travel, Gadget & Life: Purpose-built questions & statutory checklists'
      ],
      bulletsHi: [
        'कार व बाइक: पार्ट डैमेज मैपिंग और कैशलेस वर्कशॉप असाइनमेंट',
        'स्वास्थ्य व दुर्घटना: अस्पताल टीपीए प्री-ऑथ और दिव्यांगता लाभ',
        'होम, ट्रैवल, गैजेट व लाइफ: समर्पित प्रश्न और आईआरडीएआई दस्तावेज चेकलिस्ट'
      ]
    },

    // SLIDE 4 — OMNISURE AI ADVISOR & UNDERWRITING
    {
      id: 'omnisure-ai',
      icon: Bot,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
      badge: 'Step 4 of 6',
      titleEn: 'OmniSure AI Assistant',
      titleHi: 'ओम्निश्योर AI असिस्टेंट',
      subtitleEn: 'Policy-Aware Guidance & Instant Risk Assessment',
      subtitleHi: 'पॉलिसी संदर्भ-जागरूक मार्गदर्शन व त्वरित जोखिम मूल्यांकन',
      descEn: 'Consult our AI Advisor on coverage clauses, deductibles, or claim probabilities, and run instant underwriting assessments for customized quotes.',
      descHi: 'पॉलिसी क्लॉज, डिडक्टिबल और क्लेम संभावनाओं पर सलाह लें, और नए बीमा के लिए त्वरित अंडरराइटिंग मूल्यांकन करें।',
      visualType: 'ai-split',
      bulletsEn: [
        'AI Advisor explains complex policy wording and exclusions in simple terms',
        'AI Underwriting dynamically calculates personalized premium quotes',
        'Supports natural language voice interaction in Hindi and English'
      ],
      bulletsHi: [
        'एआई एडवाइजर जटिल पॉलिसी शर्तों और बहिष्करणों को सरल भाषा में समझाता है',
        'एआई अंडरराइटिंग आपकी प्रोफ़ाइल के अनुसार सटीक प्रीमियम कोट तैयार करता है',
        'हिंदी और अंग्रेजी में प्राकृतिक वॉयस इंटरैक्शन की पूरी सुविधा'
      ]
    },

    // SLIDE 5 — BILINGUAL VOICE COPILOT
    {
      id: 'voice',
      icon: Mic,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badge: 'Step 5 of 6',
      titleEn: 'Voice-First Experience',
      titleHi: 'वॉयस-फर्स्ट अनुभव',
      subtitleEn: 'Hands-Free Assistance in English & Hindi',
      subtitleHi: 'अंग्रेजी व हिंदी में हैंड्स-फ्री संवाद',
      descEn: 'Tap the microphone icon anywhere across the application to ask policy questions, check claim status, or initiate voice-assisted claim lodging.',
      descHi: 'एप्लिकेशन में कहीं भी माइक्रोफ़ोन दबाकर प्रश्न पूछें, क्लेम स्थिति जानें या वॉयस द्वारा क्लेम दर्ज करें।',
      visualType: 'voice-pipeline',
      bulletsEn: [
        'Zero typing required: speak naturally in English or Hindi',
        'Real-time audio speech response with browser native speech synthesis',
        'Auto-fills claim forms and policy search criteria directly from voice input'
      ],
      bulletsHi: [
        'टाइपिंग की कोई जरूरत नहीं: स्वाभाविक रूप से हिंदी या अंग्रेजी में बोलें',
        'ब्राउज़र वॉयस सिंथेसिस के साथ रीयल-टाइम ऑडियो उत्तर',
        'वॉयस इनपुट से क्लेम फॉर्म और पॉलिसी सर्च अपने आप भर जाती है'
      ]
    },

    // SLIDE 6 — GETTING STARTED
    {
      id: 'start',
      icon: Sparkles,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      badge: 'Step 6 of 6',
      titleEn: "You're All Set!",
      titleHi: 'आप पूरी तरह तैयार हैं!',
      subtitleEn: 'Explore Your InsurTech Dashboard Today',
      subtitleHi: 'आज ही अपने इंश्योरटेक डैशबोर्ड का उपयोग करें',
      descEn: 'Jump straight into your active policies or file a new claim now. You can revisit this guide anytime from the top navigation bar.',
      descHi: 'अपनी सक्रिय पॉलिसियां देखें या अभी नया क्लेम दर्ज करें। आप शीर्ष नेविगेशन बार से कभी भी यह गाइड दोबारा देख सकते हैं।',
      visualType: 'quick-start',
      bulletsEn: [
        'Explore your 6 pre-loaded active policies across Motor, Health, Home & Travel',
        'Test the interactive claim filing modal with real-time settlement timeline',
        'Ask the AI Advisor about policy exclusions or zero-depreciation coverage'
      ],
      bulletsHi: [
        'मोटर, हेल्थ, होम और ट्रैवल की 6 सक्रिय पॉलिसियां एक्सप्लोर करें',
        'रीयल-टाइम सेटलमेंट टाइमलाइन के साथ इंटरएक्टिव क्लेम फॉर्म आज़माएं',
        'पॉलिसी नियमों और जीरो-डेप सुरक्षा के बारे में AI एडवाइजर से पूछें'
      ]
    }
  ];

  const active = slides[currentStep];
  const StepIcon = active.icon;

  const handleNext = () => {
    if (currentStep < slides.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200/90 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#F8FAFC]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-100 px-2.5 py-0.5 rounded-full">
              OMNISURE Guide
            </span>
            <span className="text-xs font-semibold text-[#667085]">
              {active.badge}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleFinish}
              className="text-xs font-semibold text-[#667085] hover:text-[#172033] px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {language === 'hi' ? 'छोड़ें (Skip)' : 'Skip Tutorial'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[#667085] hover:text-[#172033] transition-colors cursor-pointer shadow-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 bg-white overflow-y-auto max-h-[75vh]">
          
          {/* Centered Hero Section */}
          <div className="text-center space-y-3">
            <div className={`mx-auto w-16 h-16 rounded-2xl ${active.iconBg} border flex items-center justify-center shadow-xs`}>
              <StepIcon className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-[#172033] font-['Outfit'] tracking-tight">
                {language === 'hi' ? active.titleHi : active.titleEn}
              </h2>
              <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">
                {language === 'hi' ? active.subtitleHi : active.subtitleEn}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed max-w-lg mx-auto">
              {language === 'hi' ? active.descHi : active.descEn}
            </p>
          </div>

          {/* Interactive Visual Element per Slide */}
          {active.visualType === 'types-grid' && (
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {[
                { label: 'Car', icon: Car, color: 'text-sky-600' },
                { label: 'Bike', icon: Bike, color: 'text-emerald-600' },
                { label: 'Health', icon: HeartPulse, color: 'text-rose-600' },
                { label: 'Home', icon: Home, color: 'text-amber-600' },
                { label: 'Gadget', icon: Smartphone, color: 'text-indigo-600' },
                { label: 'Travel', icon: Plane, color: 'text-sky-600' },
                { label: 'Accident', icon: Activity, color: 'text-teal-600' },
                { label: 'Life', icon: Shield, color: 'text-red-600' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 flex flex-col items-center gap-1">
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <span className="font-semibold text-[#172033] text-[11px]">{item.label}</span>
                  </div>
                );
              })}
            </div>
          )}

          {active.visualType === 'voice-pipeline' && (
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200">
              <div className="text-[10px] font-bold text-sky-700 uppercase tracking-wider mb-2 text-center">
                Hands-Free Bilingual Voice Pipeline
              </div>
              <div className="flex items-center justify-between text-center gap-1.5 text-xs font-semibold text-[#172033]">
                <div className="flex-1 p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-base block mb-0.5">🎤</span>
                  <span className="text-[11px]">Speak Query</span>
                </div>
                <span className="text-sky-500 font-bold">→</span>
                <div className="flex-1 p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-base block mb-0.5">🧠</span>
                  <span className="text-[11px]">AI Analyzes</span>
                </div>
                <span className="text-sky-500 font-bold">→</span>
                <div className="flex-1 p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-base block mb-0.5">💬</span>
                  <span className="text-[11px]">Answers</span>
                </div>
                <span className="text-sky-500 font-bold">→</span>
                <div className="flex-1 p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-base block mb-0.5">🔊</span>
                  <span className="text-[11px]">Speaks Back</span>
                </div>
              </div>
            </div>
          )}

          {/* Key Feature Bullets */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2.5">
            {(language === 'hi' ? active.bulletsHi : active.bulletsEn).map((pt, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-[#172033]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{pt}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Footer Navigation: Progress Dots & Next/Prev/Get Started */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-[#F8FAFC]">
          
          {/* Progress Dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentStep(i)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  i === currentStep 
                    ? 'w-6 bg-sky-600' 
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                title={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-xs font-semibold text-[#172033] border border-slate-200 flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'पिछला' : 'Previous'}</span>
            </button>

            <button
              type="button"
              id="tutorial-action-btn"
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98 transition-all"
            >
              {currentStep === slides.length - 1 ? (
                <>
                  <span>{language === 'hi' ? 'शुरू करें (Get Started)' : 'Get Started'}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>{language === 'hi' ? 'आगे बढ़ें' : 'Next'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

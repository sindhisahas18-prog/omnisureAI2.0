import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Car, 
  Bot, 
  FileText, 
  Clock, 
  Volume2, 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  Layers,
  HeartPulse,
  Smartphone,
  Plane,
  RotateCcw
} from 'lucide-react';
import { Language, NavigationTab } from '../types';

interface HowItWorksViewProps {
  language: Language;
  onNavigate: (tab: NavigationTab) => void;
  onOpenDamageClaim: (policyId?: string) => void;
  onOpenTutorial?: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({
  language,
  onNavigate,
  onOpenDamageClaim,
  onOpenTutorial
}) => {
  const pillarCards = [
    {
      titleEn: '1. Intelligent Policy Management',
      titleHi: '1. इंटेलिजेंट पॉलिसी प्रबंधन',
      descEn: 'Access zero-depreciation motor covers, family health floaters, and life policies with instant digital schedule downloads.',
      descHi: 'जीरो-डेप्रिसिएशन मोटर कवर, फैमिली हेल्थ और लाइफ पॉलिसियों को तत्काल डिजिटल डाउनलोड के साथ प्रबंधित करें।',
      icon: FileText,
      iconColor: 'text-sky-600',
      actionTab: 'policies' as NavigationTab,
      actionLabelEn: 'View Policies',
      actionLabelHi: 'पॉलिसियाँ देखें'
    },
    {
      titleEn: '2. Smart Claims & Category Routing',
      titleHi: '2. स्मार्ट क्लेम व श्रेणी-आधारित रूटिंग',
      descEn: 'Dedicated First Notice of Loss (FNOL) forms tailored for Health, Motor, Home, Travel, Gadgets, Life, and Accident claims.',
      descHi: 'हेल्थ, मोटर, होम, ट्रैवल, गैजेट, लाइफ और पर्सनल एक्सीडेंट के लिए समर्पित और अनुकूलित क्लेम फॉर्म।',
      icon: Car,
      iconColor: 'text-emerald-600',
      customAction: () => onOpenDamageClaim(),
      actionLabelEn: 'File a Claim',
      actionLabelHi: 'क्लेम दर्ज करें'
    },
    {
      titleEn: '3. Dual-Engine OMNISURE AI',
      titleHi: '3. ड्यूल-इंजन ओम्निश्योर AI',
      descEn: 'Two distinct systems: An advisory co-pilot for coverage questions, and an underwriting engine for instant risk profiling and quote calculation.',
      descHi: 'दो अलग प्रणालियाँ: पॉलिसी व कवरेज प्रश्नों के लिए सलाहकार, और जोखिम मूल्यांकन के लिए अंडरराइटिंग इंजन।',
      icon: Bot,
      iconColor: 'text-indigo-600',
      actionTab: 'ai' as NavigationTab,
      actionLabelEn: 'Open AI Advisor',
      actionLabelHi: 'एआई खोलें'
    },
    {
      titleEn: '4. Bilingual Voice Copilot',
      titleHi: '4. द्विभाषी वॉयस कोपायलट',
      descEn: 'Speak naturally in English or Hindi inside our AI panels. Enjoy real-time speech recognition and clear voice audio playback.',
      descHi: 'अंग्रेजी या हिंदी में बोलकर प्रश्न पूछें। रीयल-टाइम वॉइस रिकग्निशन और स्पष्ट ऑडियो रिस्पॉन्स प्राप्त करें।',
      icon: Volume2,
      iconColor: 'text-teal-600',
      actionTab: 'ai' as NavigationTab,
      actionLabelEn: 'Try Voice Copilot',
      actionLabelHi: 'वॉयस आज़माएँ'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Banner: Clean White Card with Subtle Accent */}
      <div className="relative rounded-2xl bg-white border border-slate-200/90 p-6 sm:p-10 shadow-xs">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>{language === 'hi' ? 'प्लेटफ़ॉर्म ओवरव्यू' : 'Platform Architecture'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight font-['Outfit']">
            {language === 'hi' 
              ? 'ओम्निश्योर कैसे काम करता है' 
              : 'How OMNISURE Works'}
          </h1>

          <p className="text-[#667085] text-sm sm:text-base leading-relaxed max-w-2xl">
            {language === 'hi'
              ? 'ओम्निश्योर आपके सभी बीमा अनुभवों को सरल, पारदर्शी और डिजिटल बनाता है — तत्काल पॉलिसी प्रबंधन से लेकर श्रेणी-आधारित स्मार्ट क्लेम और एआई सहायता तक।'
              : 'Experience modern InsurTech: simplified policy management, category-specific damage claim filing, and policy-grounded AI guidance in English and Hindi.'}
          </p>

          {/* Launch Interactive Onboarding Tutorial Button */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {onOpenTutorial && (
              <button
                type="button"
                id="launch-tutorial-btn"
                onClick={onOpenTutorial}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm tracking-wide shadow-xs flex items-center gap-2 cursor-pointer active:scale-98 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{language === 'hi' ? '7-चरणीय इंटरएक्टिव ट्यूटोरियल देखें' : 'View 7-Step Interactive Tutorial'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#172033] font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <span>{language === 'hi' ? 'डैशबोर्ड पर वापस जाएं' : 'Back to Dashboard'}</span>
              <ArrowRight className="w-4 h-4 text-[#667085]" />
            </button>
          </div>
        </div>
      </div>

      {/* Clean 4-Pillar Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#172033] font-['Outfit']">
            {language === 'hi' ? 'मुख्य तकनीकी स्तंभ' : 'Core Platform Capabilities'}
          </h2>
          <span className="text-xs text-[#667085]">
            {language === 'hi' ? 'पारदर्शी व सरल प्रक्रिया' : 'Transparent & Intuitive'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pillarCards.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 shadow-xs flex flex-col justify-between space-y-4 transition-all"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${pillar.iconColor}`} />
                  </div>

                  <h3 className="text-base font-bold text-[#172033] font-['Outfit']">
                    {language === 'hi' ? pillar.titleHi : pillar.titleEn}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                    {language === 'hi' ? pillar.descHi : pillar.descEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      if (pillar.customAction) {
                        pillar.customAction();
                      } else if (pillar.actionTab) {
                        onNavigate(pillar.actionTab);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors cursor-pointer"
                  >
                    <span>{language === 'hi' ? pillar.actionLabelHi : pillar.actionLabelEn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Supported Insurance Types Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-[#172033] font-['Outfit']">
              {language === 'hi' ? 'समर्थित बीमा श्रेणियाँ' : 'Supported Insurance Categories'}
            </h3>
            <p className="text-xs text-[#667085] mt-0.5">
              {language === 'hi' ? 'केवल मोटर नहीं — सभी प्रमुख श्रेणियों में समर्पित क्लेम वर्कफ़्लो उपलब्ध हैं' : 'Dedicated digital workflows tailored for each policy category'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenDamageClaim()}
            className="px-4 py-2 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-sky-700 flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>{language === 'hi' ? 'क्लेम शुरू करें' : 'Start Any Claim'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'Motor (Car)', desc: '3D Damage Map & Zero-Dep' },
            { name: 'Two-Wheeler', desc: 'Bike accidental cover' },
            { name: 'Health Shield', desc: 'Cashless hospital network' },
            { name: 'Home & Contents', desc: 'Structure and all-risk' },
            { name: 'Device / Gadget', desc: 'Screen & hardware damage' },
            { name: 'Global Travel', desc: 'Baggage & medical triage' },
            { name: 'Pure Term Life', desc: 'Nominee claim settlement' },
            { name: 'Personal Accident', desc: '24x7 worldwide protection' }
          ].map((cat, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
              <span className="text-xs font-bold text-[#172033] block">{cat.name}</span>
              <span className="text-[11px] text-[#667085] block">{cat.desc}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

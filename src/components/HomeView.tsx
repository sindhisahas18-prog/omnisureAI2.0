import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Car, 
  Bot, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  Shield, 
  Zap, 
  Calendar,
  AlertCircle,
  HelpCircle,
  RotateCw,
  FileSearch
} from 'lucide-react';
import { InsurancePolicy, InsuranceClaim, Language, NavigationTab } from '../types';
import { PolicyExpiryWidget, calculateDaysUntilExpiry } from './PolicyExpiryWidget';
import { PolicyCoverageOverview } from './PolicyCoverageOverview';

interface HomeViewProps {
  policies: InsurancePolicy[];
  claims: InsuranceClaim[];
  language: Language;
  onNavigate: (tab: NavigationTab) => void;
  onOpenDamageClaim: () => void;
  onRenewPolicy?: (policyId: string, updatedPolicy: Partial<InsurancePolicy>) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  policies,
  claims,
  language,
  onNavigate,
  onOpenDamageClaim,
  onRenewPolicy
}) => {
  const primaryMotorPolicy = policies.find(p => p.type === 'motor') || policies[0];
  const activeClaim = claims[0];
  const activePoliciesCount = policies.filter(p => p.status === 'active').length || policies.length;

  // Find nearest expiring policy for the summary card
  const sortedByExpiry = [...policies].sort((a, b) => {
    return calculateDaysUntilExpiry(a.expiryDate) - calculateDaysUntilExpiry(b.expiryDate);
  });
  const nearestExpiringPolicy = sortedByExpiry[0] || primaryMotorPolicy;
  const nearestDays = calculateDaysUntilExpiry(nearestExpiringPolicy.expiryDate);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-['Plus_Jakarta_Sans']">
      
      {/* ----------------------------------------------------
          1. WELCOME GREETING BANNER
         ---------------------------------------------------- */}
      <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200/90 p-6 sm:p-10 shadow-xs">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>{language === 'hi' ? 'एआई-पावर्ड इंश्योरटेक' : 'Next-Gen InsurTech Platform'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#172033] tracking-tight font-['Outfit']">
            {language === 'hi' 
              ? 'नमस्ते साहस सिंधी!' 
              : 'Welcome, Sahas Sindhi'}
          </h1>

          <p className="text-[#667085] text-sm sm:text-base leading-relaxed max-w-2xl">
            {language === 'hi'
              ? 'आपके सभी बीमा कवर, सक्रिय क्लेम्स और एआई एडवाइजर एक ही स्थान पर सुरक्षित रूप से उपलब्ध हैं।'
              : 'Your active policies, ongoing claims, and bilingual AI assistance are synchronized and ready.'}
          </p>

          {/* Core Shortcuts */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              id="home-quick-claim-btn"
              onClick={onOpenDamageClaim}
              className="px-5 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm tracking-wide shadow-sm flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'hi' ? 'स्मार्ट क्लेम दर्ज करें' : 'File a Claim'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              id="home-quick-ai-btn"
              onClick={() => onNavigate('ai')}
              className="px-5 py-3 rounded-2xl bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 text-[#172033] font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Bot className="w-4 h-4 text-sky-600" />
              <span>{language === 'hi' ? 'एआई एडवाइजर' : 'Ask AI Advisor'}</span>
            </button>

            <button
              type="button"
              id="home-quick-policies-btn"
              onClick={() => onNavigate('policies')}
              className="px-5 py-3 rounded-2xl bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 text-[#172033] font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <FileText className="w-4 h-4 text-blue-600" />
              <span>{language === 'hi' ? 'मेरी पॉलिसियाँ' : 'My Policies'}</span>
            </button>
          </div>
        </div>

        {/* Ambient background soft tint */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-sky-50/50 to-transparent pointer-events-none" />
      </div>

      {/* ----------------------------------------------------
          POLICY EXPIRY NOTIFICATION WIDGET
          Highlights policies expiring within 30 days with Renew Now actions
         ---------------------------------------------------- */}
      <PolicyExpiryWidget
        policies={policies}
        language={language}
        onRenewPolicy={onRenewPolicy}
      />

      {/* ----------------------------------------------------
          2. SUMMARY ROW: ACTIVE POLICIES | ACTIVE CLAIMS | UPCOMING RENEWAL
         ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Active Policies Summary */}
        <div 
          onClick={() => onNavigate('policies')}
          className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-sky-300 shadow-xs hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              {language === 'hi' ? 'सभी सक्रिय' : 'All Active'}
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider block">
              {language === 'hi' ? 'सक्रिय पॉलिसियाँ' : 'Active Policies Summary'}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#172033] font-['Outfit'] mt-1">
              {activePoliciesCount} {language === 'hi' ? 'पॉलिसियाँ' : 'Policies'}
            </div>
            <p className="text-xs text-[#667085] mt-1">
              {language === 'hi' ? 'कार, बाइक, हेल्थ, होम और गैजेट कवर शामिल हैं।' : 'Motor, Health, Home, Device & Life covers bound.'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-sky-600 font-semibold group-hover:text-sky-700">
            <span>{language === 'hi' ? 'पॉलिसियाँ देखें' : 'View All Policies'}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Active Claims Summary */}
        <div 
          onClick={() => onNavigate('claims')}
          className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-amber-300 shadow-xs hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200">
              {claims.length} {language === 'hi' ? 'दर्ज क्लेम' : 'In Progress'}
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider block">
              {language === 'hi' ? 'सक्रिय क्लेम्स' : 'Active Claims Summary'}
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#172033] font-['Outfit'] mt-1">
              {activeClaim ? activeClaim.claimStatus : '0 Active'}
            </div>
            <p className="text-xs text-[#667085] mt-1 truncate">
              {activeClaim 
                ? `${activeClaim.claimNumber} • ₹${(activeClaim.approvedAmount || activeClaim.estimatedAmount || 31500).toLocaleString()} approved estimate`
                : 'No pending claims. All prior incidents settled.'}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-amber-600 font-semibold group-hover:text-amber-700">
            <span>{language === 'hi' ? 'क्लेम ट्रैकर खोलें' : 'Track Claims Timeline'}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Upcoming Renewal Summary */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Calendar className="w-6 h-6" />
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
              nearestDays <= 7 
                ? 'bg-rose-50 text-rose-700 border-rose-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {nearestDays <= 0 
                ? (language === 'hi' ? 'आज समाप्त' : 'Expires Today')
                : (language === 'hi' ? `${nearestDays} दिन में नवीनीकरण` : `${nearestDays} Days Remaining`)}
            </span>
          </div>

          <div>
            <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider block">
              {language === 'hi' ? 'निकटतम नवीनीकरण' : 'Nearest Upcoming Renewal'}
            </span>
            <div className="text-lg sm:text-xl font-bold text-[#172033] font-['Outfit'] mt-1">
              {nearestExpiringPolicy.expiryDate}
            </div>
            <p className="text-xs text-[#667085] mt-1 line-clamp-1">
              {language === 'hi' ? nearestExpiringPolicy.titleHi : nearestExpiringPolicy.title}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-amber-600 font-semibold">
            <span>{language === 'hi' ? 'नो-क्लेम बोनस सुरक्षित' : 'NCB Shield Preserved'}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
        </div>

      </div>
 
      {/* ----------------------------------------------------
          3. POLICY COVERAGE OVERVIEW (RECHARTS DONUT CHART & RISK BREAKDOWN)
         ---------------------------------------------------- */}
      <PolicyCoverageOverview
        policies={policies}
        language={language}
        onNavigate={onNavigate}
      />

      {/* ----------------------------------------------------
          4. QUICK ACTIONS SHORTCUTS (Spacious Cards with Clear Hierarchy)
         ---------------------------------------------------- */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-[#172033] font-['Outfit']">
          {language === 'hi' ? 'त्वरित कार्य (Quick Actions)' : 'Quick Actions'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* AI Advisor Shortcut */}
          <div 
            id="quick-action-ai"
            onClick={() => onNavigate('ai')}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-sky-300 shadow-xs hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#172033] font-['Outfit']">
                {language === 'hi' ? 'एआई एडवाइजर (AI Advisor)' : 'OMNISURE AI Advisor'}
              </h3>
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                {language === 'hi' 
                  ? 'अपनी पॉलिसी कवरेज, जीरो-डेप्रिसिएशन के लाभ, डिडक्टिबल्स या क्लेम स्थिति पर तुरंत स्पष्ट उत्तर प्राप्त करें।'
                  : 'Ask about exact policy coverage, zero-depreciation benefits, excess deductibles, or nearby network garages.'}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-sky-600 font-bold group-hover:text-sky-700">
              <span>{language === 'hi' ? 'बातचीत शुरू करें' : 'Open Advisor Chat'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* File a Claim Shortcut */}
          <div 
            id="quick-action-claim"
            onClick={onOpenDamageClaim}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-amber-300 shadow-xs hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#172033] font-['Outfit']">
                {language === 'hi' ? 'स्मार्ट क्लेम दर्ज करें' : 'File a Smart Claim'}
              </h3>
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                {language === 'hi'
                  ? 'वाहनों के लिए 3D डैमेज मैप पर सीधे पार्ट्स चुनें, अथवा हेल्थ, बाइक, होम व गैजेट के लिए समर्पित क्लेम दर्ज करें।'
                  : 'Tap damaged components on the interactive 3D blueprint for vehicles, or file health, bike & device claims.'}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-amber-600 font-bold group-hover:text-amber-700">
              <span>{language === 'hi' ? 'नया क्लेम शुरू करें' : 'Start Digital Claim'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* My Policies Shortcut */}
          <div 
            id="quick-action-policies"
            onClick={() => onNavigate('policies')}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-300 shadow-xs hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#172033] font-['Outfit']">
                {language === 'hi' ? 'मेरी पॉलिसियाँ (My Policies)' : 'My Policies Portfolio'}
              </h3>
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                {language === 'hi'
                  ? 'अपनी सभी सक्रिय पॉलिसियों का विवरण, आईडीवी, ऐड-ऑन शील्ड्स और आधिकारिक आईआरडीएआई प्रमाणपत्र डाउनलोड करें।'
                  : 'Review full coverage breakdown, zero-dep add-ons, bundled protections, and download official policy schedules.'}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-bold group-hover:text-blue-700">
              <span>{language === 'hi' ? 'पोर्टफोलियो खोलें' : 'View Policy Portfolio'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>

      {/* ----------------------------------------------------
          4. FEATURED POLICY COVERAGE HIGHLIGHT (Clear Hierarchy)
         ---------------------------------------------------- */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-sky-600 tracking-wider">
                {language === 'hi' ? 'प्राथमिक सक्रिय पॉलिसी' : 'PRIMARY ACTIVE POLICY'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#172033] font-['Outfit']">
                {language === 'hi' ? primaryMotorPolicy.titleHi : primaryMotorPolicy.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('policies')}
            className="px-4 py-2 rounded-xl bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-sky-700 flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer shadow-xs"
          >
            <span>{language === 'hi' ? 'कवरेज विस्तार देखें' : 'View Full Schedule'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Policy Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 text-xs">
          <div>
            <span className="text-[#667085] block mb-1">
              {language === 'hi' ? 'बीमित वाहन (Vehicle):' : 'Insured Asset:'}
            </span>
            <span className="text-sm font-bold text-[#172033]">
              {primaryMotorPolicy.vehicleDetails?.make} {primaryMotorPolicy.vehicleDetails?.model}
            </span>
            <span className="font-mono text-sky-700 font-semibold ml-2">
              ({primaryMotorPolicy.vehicleDetails?.regNumber || 'DL-01-AX-9921'})
            </span>
          </div>

          <div>
            <span className="text-[#667085] block mb-1">
              {language === 'hi' ? 'बीमित घोषित मूल्य (IDV):' : 'Sum Insured (IDV):'}
            </span>
            <span className="text-sm font-bold text-[#172033]">
              ₹{(primaryMotorPolicy.sumInsured ?? primaryMotorPolicy.insuredDeclaredValue ?? 1450000).toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-[#667085] block mb-1">
              {language === 'hi' ? 'अनिवार्य कटौती (Excess):' : 'Compulsory Deductible:'}
            </span>
            <span className="text-sm font-bold text-emerald-700">
              ₹{primaryMotorPolicy.deductible || 1000} per claim
            </span>
          </div>
        </div>

        {/* Bundled Protections */}
        <div>
          <span className="text-xs font-semibold text-[#667085] uppercase tracking-wider block mb-2.5">
            {language === 'hi' ? 'शामिल सुरक्षा व ऐड-ऑन:' : 'Bundled Premium Protections & Add-Ons:'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            {primaryMotorPolicy.addons.map((addon, i) => (
              <div key={i} className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span className="text-[#172033] font-medium truncate">{addon}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

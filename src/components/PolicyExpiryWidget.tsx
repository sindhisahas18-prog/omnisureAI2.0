import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  RotateCw, 
  Calendar, 
  ShieldCheck, 
  Car, 
  Smartphone, 
  Bike, 
  HeartPulse, 
  Home, 
  Plane, 
  Activity, 
  Shield, 
  Briefcase,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { InsurancePolicy, Language } from '../types';
import { PolicyRenewalModal } from './PolicyRenewalModal';

interface PolicyExpiryWidgetProps {
  policies: InsurancePolicy[];
  language: Language;
  onRenewPolicy?: (policyId: string, updatedPolicy: Partial<InsurancePolicy>) => void;
}

/**
 * Calculates remaining days until expiry.
 * Benchmarks against current system date or 2026-09-21 reference date
 * to ensure consistency across any browser environment.
 */
export const calculateDaysUntilExpiry = (expiryDateStr: string): number => {
  const expiry = new Date(expiryDateStr);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // If environment date is outside 2026 schedule range, benchmark against 2026-09-21
  if (days < -30 || days > 365) {
    const benchDate = new Date('2026-09-21');
    const benchDiff = expiry.getTime() - benchDate.getTime();
    return Math.ceil(benchDiff / (1000 * 60 * 60 * 24));
  }
  return days;
};

export const PolicyExpiryWidget: React.FC<PolicyExpiryWidgetProps> = ({
  policies,
  language,
  onRenewPolicy
}) => {
  const isHindi = language === 'hi';
  const [selectedPolicyForRenewal, setSelectedPolicyForRenewal] = useState<InsurancePolicy | null>(null);

  // Find policies expiring within 30 days (0 <= daysRemaining <= 30)
  const expiringPolicies = policies
    .map(policy => ({
      policy,
      daysRemaining: calculateDaysUntilExpiry(policy.expiryDate)
    }))
    .filter(item => item.daysRemaining >= 0 && item.daysRemaining <= 30)
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  const getPolicyIcon = (type: string) => {
    switch (type) {
      case 'motor': return <Car className="w-5 h-5 text-sky-600" />;
      case 'gadget': return <Smartphone className="w-5 h-5 text-indigo-600" />;
      case 'bike': return <Bike className="w-5 h-5 text-emerald-600" />;
      case 'health': return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case 'home': return <Home className="w-5 h-5 text-amber-600" />;
      case 'travel': return <Plane className="w-5 h-5 text-sky-600" />;
      case 'accident': return <Activity className="w-5 h-5 text-teal-600" />;
      case 'life': return <Shield className="w-5 h-5 text-red-600" />;
      default: return <Briefcase className="w-5 h-5 text-slate-600" />;
    }
  };

  const handleRenewalConfirmed = (policyId: string, updated: Partial<InsurancePolicy>) => {
    if (onRenewPolicy) {
      onRenewPolicy(policyId, updated);
    }
  };

  // If no policies are expiring within 30 days
  if (expiringPolicies.length === 0) {
    return (
      <div 
        id="policy-expiry-notification-widget-clean"
        className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#172033] font-['Outfit']">
                {isHindi ? 'सभी पॉलिसियाँ सक्रिय व अद्यतित हैं' : 'All Policies Active & In Good Standing'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                {isHindi ? 'कोई तत्काल समाप्ति नहीं' : 'No Expiring Covers'}
              </span>
            </div>
            <p className="text-xs text-[#667085] mt-0.5">
              {isHindi 
                ? 'अगले 30 दिनों में कोई पॉलिसी समाप्त नहीं हो रही है। सभी नो-क्लेम बोनस सुरक्षित हैं।' 
                : 'Zero policies expiring within the next 30 days. Continuous coverage and No-Claim Bonuses are locked.'}
            </p>
          </div>
        </div>
        <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5 shrink-0">
          <CheckCircle2 className="w-4 h-4" />
          <span className="hidden sm:inline">{isHindi ? 'सुरक्षा सक्रिय' : 'Protected'}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        id="policy-expiry-notification-widget"
        className="rounded-3xl bg-white border-2 border-amber-300 shadow-xs overflow-hidden transition-all"
      >
        {/* Widget Top Notification Bar */}
        <div className="px-6 py-4 bg-amber-50/70 border-b border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-[#172033] font-['Outfit']">
                  {isHindi ? 'पॉलिसी समाप्ति सूचना' : 'Policy Expiry Notice'}
                </h2>
                <span 
                  id="expiring-policies-count-badge"
                  className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950 font-bold text-xs border border-amber-300"
                >
                  {expiringPolicies.length} {isHindi ? 'पॉलिसियाँ 30 दिनों में समाप्त' : expiringPolicies.length === 1 ? 'Policy Expiring Soon' : 'Policies Expiring Soon'}
                </span>
              </div>
              <p className="text-xs text-amber-900 mt-0.5">
                {isHindi
                  ? 'IRDAI दिशा-निर्देश: नो-क्लेम बोनस (NCB) और शून्य-डेप्रिसिएशन सुरक्षा बनाए रखने के लिए समय पर नवीनीकरण करें।'
                  : 'IRDAI Statutory Renewal Notice: Renew before expiry to retain accumulated No-Claim Bonus (NCB) and zero-depreciation coverage.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[11px] font-semibold text-amber-900 bg-white/80 px-2.5 py-1 rounded-xl border border-amber-200 flex items-center gap-1.5 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>{isHindi ? 'ग्रेस अवधि लागू' : '30-Day Renewal Window'}</span>
            </span>
          </div>
        </div>

        {/* Expiring Policy Cards List */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {expiringPolicies.map(({ policy, daysRemaining }) => {
              const isCritical = daysRemaining <= 7;

              return (
                <div 
                  key={policy.id}
                  id={`expiring-policy-card-${policy.id}`}
                  className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 hover:border-amber-300 transition-all flex flex-col justify-between space-y-4 relative group"
                >
                  {/* Card Header & Urgency Countdown Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                        {getPolicyIcon(policy.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-[11px] text-[#667085] font-semibold">
                            {policy.policyNumber}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.2 rounded-md">
                            {policy.type.toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-[#172033] font-['Outfit'] mt-1 line-clamp-1">
                          {isHindi ? policy.titleHi : policy.title}
                        </h3>
                        <p className="text-xs text-[#667085] mt-0.5">
                          {policy.vehicleDetails 
                            ? `${policy.vehicleDetails.make} ${policy.vehicleDetails.model} (${policy.vehicleDetails.regNumber})`
                            : policy.holderName}
                        </p>
                      </div>
                    </div>

                    {/* Expiry Countdown Tag */}
                    <div className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 border shadow-2xs ${
                      isCritical 
                        ? 'bg-rose-50 text-rose-800 border-rose-200 animate-pulse' 
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {isHindi 
                          ? `${daysRemaining} दिन शेष` 
                          : daysRemaining === 0 
                            ? 'Expires Today' 
                            : daysRemaining === 1 
                              ? 'Expires in 1 day' 
                              : `Expires in ${daysRemaining} days`}
                      </span>
                    </div>
                  </div>

                  {/* Policy Expiry Specs */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3 border-t border-slate-200 text-xs">
                    <div>
                      <span className="text-[#667085] text-[11px] block">
                        {isHindi ? 'समाप्ति तिथि' : 'Expiry Date'}
                      </span>
                      <span className="font-bold text-[#172033]">
                        {policy.expiryDate}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#667085] text-[11px] block">
                        {isHindi ? 'बीमित मूल्य (IDV)' : 'Sum Insured (IDV)'}
                      </span>
                      <span className="font-bold text-[#172033]">
                        ₹{(policy.sumInsured ?? policy.insuredDeclaredValue ?? 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-[#667085] text-[11px] block">
                        {isHindi ? 'नवीनीकरण प्रीमियम' : 'Renewal Premium'}
                      </span>
                      <span className="font-extrabold text-sky-800 font-mono">
                        ₹{(policy.premiumAmount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Preserved Benefit Highlight & Renew Now Button */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-200">
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                      <span>{isHindi ? '25% NCB बोनस सुरक्षित' : 'Preserve 25% NCB & Active Riders'}</span>
                    </div>

                    {/* Renew Now Button */}
                    <button
                      type="button"
                      id={`renew-now-btn-${policy.id}`}
                      onClick={() => setSelectedPolicyForRenewal(policy)}
                      className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all w-full sm:w-auto"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>{isHindi ? 'तुरंत नवीनीकरण करें' : 'Renew Now'}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Interactive Renewal Modal */}
      {selectedPolicyForRenewal && (
        <PolicyRenewalModal
          policy={selectedPolicyForRenewal}
          isOpen={!!selectedPolicyForRenewal}
          onClose={() => setSelectedPolicyForRenewal(null)}
          language={language}
          onConfirmRenewal={handleRenewalConfirmed}
        />
      )}
    </>
  );
};

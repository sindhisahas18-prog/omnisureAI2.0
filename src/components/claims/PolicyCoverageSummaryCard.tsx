import React from 'react';
import { ShieldCheck, CheckCircle2, Info } from 'lucide-react';
import { InsurancePolicy, Language } from '../../types';
import { INDIAN_INSURANCE_KNOWLEDGE } from '../../data/indianInsuranceKnowledge';

interface PolicyCoverageSummaryCardProps {
  policy: InsurancePolicy;
  language: Language;
}

export const PolicyCoverageSummaryCard: React.FC<PolicyCoverageSummaryCardProps> = ({
  policy,
  language
}) => {
  const knowledge = INDIAN_INSURANCE_KNOWLEDGE[policy.type] || INDIAN_INSURANCE_KNOWLEDGE.other;
  const isHindi = language === 'hi';

  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider block">
              {isHindi ? 'पॉलिसी कवरेज व नियम (Policy Coverage Check)' : 'OMNISURE Policy Coverage & Deductible Audit'}
            </span>
            <h4 className="text-xs font-bold text-[#172033] line-clamp-1">{policy.title}</h4>
          </div>
        </div>

        <div className="flex items-center gap-2 text-right">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
            ✓ Active Policy
          </span>
          <span className="text-xs font-mono text-[#667085] font-semibold">{policy.policyNumber}</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200">
          <span className="text-[10px] text-[#667085] block">{isHindi ? 'बीमा राशि (Sum Insured)' : 'Sum Insured / IDV'}</span>
          <span className="font-bold text-[#172033] text-sm">₹{(policy.sumInsured || policy.insuredDeclaredValue || 0).toLocaleString()}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200">
          <span className="text-[10px] text-[#667085] block">{isHindi ? 'पॉलिसी डिडक्टिबल (Excess)' : 'Compulsory Deductible'}</span>
          <span className="font-bold text-rose-600 text-sm">{policy.deductible === 0 ? '₹0 (Zero Excess)' : `₹${(policy.deductible || 0).toLocaleString()}`}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200">
          <span className="text-[10px] text-[#667085] block">{isHindi ? 'मानक ढाँचा (Framework)' : 'Regulatory Standard'}</span>
          <span className="font-bold text-sky-700 text-[11px] truncate block">{knowledge.regulatoryFramework.split('(')[0].trim()}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200">
          <span className="text-[10px] text-[#667085] block">{isHindi ? 'सक्रिय राइडर्स' : 'Active Add-ons'}</span>
          <span className="font-bold text-emerald-700 text-xs">{(policy.addons || []).length} Opted</span>
        </div>
      </div>

      {/* Opted Add-ons & Benefits */}
      {policy.addons && policy.addons.length > 0 && (
        <div className="pt-1">
          <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider block mb-1.5">
            {isHindi ? 'सक्रिय विशेष सुरक्षा व राइडर्स:' : 'Opted Endorsements & Riders:'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {policy.addons.map((addon, idx) => (
              <span 
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-slate-200 text-[#172033] text-[11px] flex items-center gap-1.5 font-medium"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>{addon}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* IRDAI Notice note */}
      <div className="p-2.5 rounded-xl bg-sky-50/50 border border-sky-100 flex items-start gap-2 text-[11px] text-[#667085]">
        <Info className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
        <span>
          {isHindi 
            ? 'IRDAI दिशा-निर्देश: आपका दावा स्वचालित रूप से इस पॉलिसी अनुसूची और संबंधित कटौती नियमों के साथ सत्यापित किया जाएगा।'
            : `IRDAI statutory benchmark: Claims audited against ${knowledge.standardPolicyName || knowledge.regulatoryFramework}. Cashless authorization and direct NEFT processing enabled.`
          }
        </span>
      </div>
    </div>
  );
};

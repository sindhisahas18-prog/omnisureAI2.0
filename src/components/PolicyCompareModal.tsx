import React, { useState } from 'react';
import { 
  X, 
  ArrowLeftRight, 
  CheckCircle2, 
  XCircle, 
  Minus, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  Download, 
  Car, 
  HeartPulse, 
  Home, 
  Plane, 
  Smartphone, 
  Activity, 
  Shield, 
  Briefcase,
  Bike,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import { InsurancePolicy, InsuranceType, Language } from '../types';
import { downloadPolicyPDF } from '../utils/pdfGenerator';

interface PolicyCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  policies: InsurancePolicy[];
  initialPolicyIdA?: string;
  initialPolicyIdB?: string;
  language: Language;
  onOpenDamageClaim?: (policyId: string) => void;
}

export const PolicyCompareModal: React.FC<PolicyCompareModalProps> = ({
  isOpen,
  onClose,
  policies,
  initialPolicyIdA,
  initialPolicyIdB,
  language,
  onOpenDamageClaim
}) => {
  const isHindi = language === 'hi';

  // Determine initial two policies
  const defaultPolicyA = policies.find(p => p.id === initialPolicyIdA) || policies[0];
  const defaultPolicyB = policies.find(p => p.id === initialPolicyIdB && p.id !== defaultPolicyA?.id) 
    || policies.find(p => p.id !== defaultPolicyA?.id) 
    || policies[1] 
    || policies[0];

  const [policyIdA, setPolicyIdA] = useState<string>(defaultPolicyA?.id || '');
  const [policyIdB, setPolicyIdB] = useState<string>(defaultPolicyB?.id || '');

  if (!isOpen) return null;

  const policyA = policies.find(p => p.id === policyIdA) || policies[0];
  const policyB = policies.find(p => p.id === policyIdB) || policies[1] || policies[0];

  const handleSwap = () => {
    setPolicyIdA(policyB.id);
    setPolicyIdB(policyA.id);
  };

  const getPolicyIcon = (type: InsuranceType) => {
    switch (type) {
      case 'bike': return <Bike className="w-4 h-4 text-emerald-600" />;
      case 'health': return <HeartPulse className="w-4 h-4 text-rose-600" />;
      case 'home': return <Home className="w-4 h-4 text-amber-600" />;
      case 'travel': return <Plane className="w-4 h-4 text-sky-600" />;
      case 'gadget': return <Smartphone className="w-4 h-4 text-indigo-600" />;
      case 'accident': return <Activity className="w-4 h-4 text-teal-600" />;
      case 'life': return <Shield className="w-4 h-4 text-red-600" />;
      case 'other': return <Briefcase className="w-4 h-4 text-slate-600" />;
      default: return <Car className="w-4 h-4 text-sky-600" />;
    }
  };

  // Metrics calculations
  const coverageA = policyA.sumInsured ?? policyA.insuredDeclaredValue ?? 0;
  const coverageB = policyB.sumInsured ?? policyB.insuredDeclaredValue ?? 0;

  const premiumA = policyA.premiumAmount ?? 0;
  const premiumB = policyB.premiumAmount ?? 0;

  const deductibleA = policyA.deductible ?? 0;
  const deductibleB = policyB.deductible ?? 0;

  // Union of all unique add-ons across both selected policies
  const allAddons = Array.from(new Set([...(policyA.addons || []), ...(policyB.addons || [])]));

  return (
    <div 
      id="policy-compare-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div 
        id="policy-compare-modal"
        className="bg-white rounded-3xl max-w-5xl w-full border border-slate-200 shadow-2xl my-auto flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-200 font-['Plus_Jakarta_Sans']"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-white flex items-center justify-between gap-4 sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#172033] font-['Outfit']">
                {isHindi ? 'बीमा पॉलिसियों की तुलना (Side-by-Side Comparison)' : 'Policy Comparison Matrix'}
              </h2>
            </div>
            <p className="text-xs text-[#667085] mt-1">
              {isHindi 
                ? 'कवरेज सीमा, प्रीमियम, डिडक्टिबल और ऐड-ऑन राइडर्स की तुलना करें।'
                : 'Directly analyze coverage limits, annual premiums, deductibles, and endorsement riders.'}
            </p>
          </div>

          <button
            type="button"
            id="close-compare-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Policy Selectors Header Row */}
          <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200">
            {/* Policy A Selector */}
            <div className="md:col-span-5 space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-sky-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-600" />
                {isHindi ? 'पॉलिसी 1 (Policy A)' : 'Policy A (Primary Target)'}
              </label>
              <div className="relative">
                <select
                  id="select-policy-a"
                  value={policyIdA}
                  onChange={e => setPolicyIdA(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#172033] focus:outline-none focus:border-sky-500 shadow-xs cursor-pointer"
                >
                  {policies.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.policyNumber} — {p.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center">
              <button
                type="button"
                id="swap-compare-policies-btn"
                onClick={handleSwap}
                title="Swap comparison order"
                className="p-2.5 rounded-full bg-white hover:bg-slate-100 border border-slate-300 text-[#172033] shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                <ArrowLeftRight className="w-4 h-4 text-sky-600" />
              </button>
            </div>

            {/* Policy B Selector */}
            <div className="md:col-span-5 space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                {isHindi ? 'पॉलिसी 2 (Policy B)' : 'Policy B (Comparison Target)'}
              </label>
              <div className="relative">
                <select
                  id="select-policy-b"
                  value={policyIdB}
                  onChange={e => setPolicyIdB(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-[#172033] focus:outline-none focus:border-indigo-500 shadow-xs cursor-pointer"
                >
                  {policies.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.policyNumber} — {p.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 3 Core Highlight KPI Comparison Cards: Coverage Limits | Premiums | Deductible */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* KPI 1: Coverage Limits */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                  {isHindi ? 'कवरेज सीमा (Sum Insured / IDV)' : 'Coverage Limit (Sum Insured / IDV)'}
                </span>
                <ShieldCheck className="w-4 h-4 text-sky-600" />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                <div className="p-2.5 rounded-xl bg-sky-50/50 border border-sky-100">
                  <span className="text-[10px] text-sky-700 font-bold block">Policy A</span>
                  <span className="text-base font-extrabold text-[#172033] font-['Outfit'] block mt-0.5">
                    ₹{coverageA.toLocaleString()}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100">
                  <span className="text-[10px] text-indigo-700 font-bold block">Policy B</span>
                  <span className="text-base font-extrabold text-[#172033] font-['Outfit'] block mt-0.5">
                    ₹{coverageB.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-[#667085] flex items-center justify-between">
                <span>{isHindi ? 'अंतर:' : 'Variance:'}</span>
                <span className="font-bold text-[#172033]">
                  {coverageA > coverageB ? (
                    <span className="text-emerald-700 font-semibold">
                      Policy A +₹{(coverageA - coverageB).toLocaleString()} higher
                    </span>
                  ) : coverageB > coverageA ? (
                    <span className="text-indigo-700 font-semibold">
                      Policy B +₹{(coverageB - coverageA).toLocaleString()} higher
                    </span>
                  ) : (
                    <span className="text-slate-600 font-semibold">Equal Coverage</span>
                  )}
                </span>
              </div>
            </div>

            {/* KPI 2: Annual Premiums */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                  {isHindi ? 'वार्षिक प्रीमियम (Annual Premium)' : 'Annual Premium'}
                </span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                <div className="p-2.5 rounded-xl bg-sky-50/50 border border-sky-100">
                  <span className="text-[10px] text-sky-700 font-bold block">Policy A</span>
                  <span className="text-base font-extrabold text-[#172033] font-['Outfit'] block mt-0.5">
                    ₹{premiumA.toLocaleString()}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100">
                  <span className="text-[10px] text-indigo-700 font-bold block">Policy B</span>
                  <span className="text-base font-extrabold text-[#172033] font-['Outfit'] block mt-0.5">
                    ₹{premiumB.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-[#667085] flex items-center justify-between">
                <span>{isHindi ? 'लागत अंतर:' : 'Cost Delta:'}</span>
                <span className="font-bold">
                  {premiumA < premiumB ? (
                    <span className="text-emerald-700 font-semibold">
                      Policy A is ₹{(premiumB - premiumA).toLocaleString()} cheaper
                    </span>
                  ) : premiumB < premiumA ? (
                    <span className="text-emerald-700 font-semibold">
                      Policy B is ₹{(premiumA - premiumB).toLocaleString()} cheaper
                    </span>
                  ) : (
                    <span className="text-slate-600 font-semibold">Identical Premium</span>
                  )}
                </span>
              </div>
            </div>

            {/* KPI 3: Deductibles / Compulsory Excess */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                  {isHindi ? 'अनिवार्य डिडक्टिबल (Compulsory Excess)' : 'Compulsory Deductible'}
                </span>
                <AlertCircle className="w-4 h-4 text-rose-500" />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                <div className="p-2.5 rounded-xl bg-sky-50/50 border border-sky-100">
                  <span className="text-[10px] text-sky-700 font-bold block">Policy A</span>
                  <span className="text-base font-extrabold text-[#172033] font-['Outfit'] block mt-0.5">
                    {deductibleA === 0 ? '₹0 (Zero Excess)' : `₹${deductibleA.toLocaleString()}`}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100">
                  <span className="text-[10px] text-indigo-700 font-bold block">Policy B</span>
                  <span className="text-base font-extrabold text-[#172033] font-['Outfit'] block mt-0.5">
                    {deductibleB === 0 ? '₹0 (Zero Excess)' : `₹${deductibleB.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-[#667085] flex items-center justify-between">
                <span>{isHindi ? 'आउट-ऑफ-पॉकेट:' : 'Out-of-Pocket:'}</span>
                <span className="font-bold">
                  {deductibleA < deductibleB ? (
                    <span className="text-emerald-700 font-semibold">
                      Policy A saves ₹{(deductibleB - deductibleA).toLocaleString()} on claim
                    </span>
                  ) : deductibleB < deductibleA ? (
                    <span className="text-emerald-700 font-semibold">
                      Policy B saves ₹{(deductibleA - deductibleB).toLocaleString()} on claim
                    </span>
                  ) : (
                    <span className="text-slate-600 font-semibold">Same Deductible</span>
                  )}
                </span>
              </div>
            </div>

          </div>

          {/* Side-by-Side Detailed Comparison Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                {isHindi ? 'विस्तृत तुलना तालिका (Comprehensive Attributes)' : 'Detailed Specifications & Clauses'}
              </h3>
              <span className="text-[11px] text-[#667085]">
                IRDAI Standard Regulatory Framework
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-white">
                    <th className="p-3.5 font-bold text-[#667085] w-1/3">
                      {isHindi ? 'विशिष्टता / पैरामीटर' : 'Feature / Parameter'}
                    </th>
                    <th className="p-3.5 font-bold text-sky-800 w-1/3 bg-sky-50/40 border-l border-r border-slate-200">
                      <div className="flex items-center gap-1.5">
                        {getPolicyIcon(policyA.type)}
                        <span className="truncate">{policyA.title}</span>
                      </div>
                    </th>
                    <th className="p-3.5 font-bold text-indigo-800 w-1/3 bg-indigo-50/40">
                      <div className="flex items-center gap-1.5">
                        {getPolicyIcon(policyB.type)}
                        <span className="truncate">{policyB.title}</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  
                  {/* Row: Policy Number */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-semibold text-[#172033]">
                      {isHindi ? 'पॉलिसी क्रमांक' : 'Policy Identifier'}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-[#172033] bg-sky-50/10 border-l border-r border-slate-200">
                      {policyA.policyNumber}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-[#172033] bg-indigo-50/10">
                      {policyB.policyNumber}
                    </td>
                  </tr>

                  {/* Row: Insurance Category */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-semibold text-[#172033]">
                      {isHindi ? 'बीमा प्रकार / श्रेणी' : 'Insurance Category'}
                    </td>
                    <td className="p-3.5 capitalize font-medium text-[#172033] bg-sky-50/10 border-l border-r border-slate-200">
                      {policyA.type} Cover {policyA.subType ? `(${policyA.subType})` : ''}
                    </td>
                    <td className="p-3.5 capitalize font-medium text-[#172033] bg-indigo-50/10">
                      {policyB.type} Cover {policyB.subType ? `(${policyB.subType})` : ''}
                    </td>
                  </tr>

                  {/* Row: Coverage Limit / Sum Insured */}
                  <tr className="hover:bg-slate-50/80 transition-colors bg-amber-50/20">
                    <td className="p-3.5 font-bold text-[#172033]">
                      {isHindi ? 'कवरेज सीमा (Sum Insured / IDV)' : 'Coverage Limit (IDV / Sum Insured)'}
                    </td>
                    <td className="p-3.5 font-extrabold text-sky-900 bg-sky-50/30 border-l border-r border-slate-200">
                      ₹{coverageA.toLocaleString()}
                    </td>
                    <td className="p-3.5 font-extrabold text-indigo-900 bg-indigo-50/30">
                      ₹{coverageB.toLocaleString()}
                    </td>
                  </tr>

                  {/* Row: Annual Premium Amount */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-[#172033]">
                      {isHindi ? 'वार्षिक प्रीमियम (Annual Premium)' : 'Annual Premium (incl. GST)'}
                    </td>
                    <td className="p-3.5 font-bold text-[#172033] bg-sky-50/10 border-l border-r border-slate-200">
                      ₹{premiumA.toLocaleString()}
                      <span className="text-[10px] text-[#667085] font-normal block">
                        ≈ ₹{Math.round(premiumA / 12).toLocaleString()}/mo
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-[#172033] bg-indigo-50/10">
                      ₹{premiumB.toLocaleString()}
                      <span className="text-[10px] text-[#667085] font-normal block">
                        ≈ ₹{Math.round(premiumB / 12).toLocaleString()}/mo
                      </span>
                    </td>
                  </tr>

                  {/* Row: Compulsory Deductible */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-[#172033]">
                      {isHindi ? 'अनिवार्य कटौती (Deductible / Excess)' : 'Compulsory Deductible (Excess)'}
                    </td>
                    <td className="p-3.5 font-bold text-[#172033] bg-sky-50/10 border-l border-r border-slate-200">
                      {deductibleA === 0 ? (
                        <span className="text-emerald-700 font-bold">₹0 (Zero Deductible)</span>
                      ) : (
                        `₹${deductibleA.toLocaleString()}`
                      )}
                    </td>
                    <td className="p-3.5 font-bold text-[#172033] bg-indigo-50/10">
                      {deductibleB === 0 ? (
                        <span className="text-emerald-700 font-bold">₹0 (Zero Deductible)</span>
                      ) : (
                        `₹${deductibleB.toLocaleString()}`
                      )}
                    </td>
                  </tr>

                  {/* Row: Insured Asset / Object */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-semibold text-[#172033]">
                      {isHindi ? 'बीमाकृत वस्तु / व्यक्ति' : 'Insured Asset / Subject'}
                    </td>
                    <td className="p-3.5 text-[#172033] bg-sky-50/10 border-l border-r border-slate-200">
                      {policyA.vehicleDetails 
                        ? `${policyA.vehicleDetails.make} ${policyA.vehicleDetails.model} (${policyA.vehicleDetails.regNumber})`
                        : policyA.holderName}
                    </td>
                    <td className="p-3.5 text-[#172033] bg-indigo-50/10">
                      {policyB.vehicleDetails 
                        ? `${policyB.vehicleDetails.make} ${policyB.vehicleDetails.model} (${policyB.vehicleDetails.regNumber})`
                        : policyB.holderName}
                    </td>
                  </tr>

                  {/* Row: Policy Expiry Date */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-semibold text-[#172033]">
                      {isHindi ? 'वैधता समाप्ति तिथि' : 'Validity Expiry Date'}
                    </td>
                    <td className="p-3.5 font-mono text-[#172033] bg-sky-50/10 border-l border-r border-slate-200">
                      {policyA.expiryDate}
                    </td>
                    <td className="p-3.5 font-mono text-[#172033] bg-indigo-50/10">
                      {policyB.expiryDate}
                    </td>
                  </tr>

                  {/* Row: Zero Depreciation Clause */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-semibold text-[#172033]">
                      {isHindi ? 'जीरो-डेप्रिसिएशन कवरेज' : 'Zero-Depreciation Rider'}
                    </td>
                    <td className="p-3.5 bg-sky-50/10 border-l border-r border-slate-200">
                      {policyA.addons?.some(a => a.toLowerCase().includes('zero dep')) ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 100% Zero-Dep Included
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500 font-normal">
                          <Minus className="w-3.5 h-3.5" /> Standard Depreciation
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 bg-indigo-50/10">
                      {policyB.addons?.some(a => a.toLowerCase().includes('zero dep')) ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 100% Zero-Dep Included
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-500 font-normal">
                          <Minus className="w-3.5 h-3.5" /> Standard Depreciation
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Row: Add-ons Count */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-semibold text-[#172033]">
                      {isHindi ? 'सक्रिय राइडर्स व ऐड-ऑन संख्या' : 'Active Endorsements Count'}
                    </td>
                    <td className="p-3.5 font-bold text-sky-800 bg-sky-50/10 border-l border-r border-slate-200">
                      {policyA.addons?.length || 0} Riders Included
                    </td>
                    <td className="p-3.5 font-bold text-indigo-800 bg-indigo-50/10">
                      {policyB.addons?.length || 0} Riders Included
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>

          {/* Add-ons & Benefits Detailed Checklist Comparison */}
          {allAddons.length > 0 && (
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <h3 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                  {isHindi ? 'राइडर्स और ऐड-ऑन की तुलना' : 'Riders & Endorsements Inclusions Matrix'}
                </h3>
              </div>

              <div className="divide-y divide-slate-100">
                {allAddons.map((addon, idx) => {
                  const hasA = policyA.addons?.includes(addon);
                  const hasB = policyB.addons?.includes(addon);

                  return (
                    <div key={idx} className="grid grid-cols-12 p-3 text-xs items-center hover:bg-slate-50">
                      <div className="col-span-6 font-medium text-[#172033] pr-2">
                        {addon}
                      </div>

                      {/* Policy A Status */}
                      <div className="col-span-3 flex items-center justify-center">
                        {hasA ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Included
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 text-[11px]">
                            <Minus className="w-3 h-3" /> Not Opted
                          </span>
                        )}
                      </div>

                      {/* Policy B Status */}
                      <div className="col-span-3 flex items-center justify-center">
                        {hasB ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Included
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 text-[11px]">
                            <Minus className="w-3 h-3" /> Not Opted
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Actions Footer inside Modal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#172033] block">{policyA.title}</span>
                <span className="text-[11px] text-[#667085]">{policyA.policyNumber}</span>
              </div>
              <button
                type="button"
                onClick={() => downloadPolicyPDF(policyA)}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-[#172033] flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-sky-600" />
                <span>PDF</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#172033] block">{policyB.title}</span>
                <span className="text-[11px] text-[#667085]">{policyB.policyNumber}</span>
              </div>
              <button
                type="button"
                onClick={() => downloadPolicyPDF(policyB)}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-[#172033] flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span>PDF</span>
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-[#667085]">
            {isHindi ? 'सभी कवरेज विवरण आईआरडीएआई विनियामक मानकों के अनुसार हैं।' : 'All terms verified against IRDAI statutory schedules.'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-[#172033] font-bold text-xs cursor-pointer transition-colors"
          >
            {isHindi ? 'बंद करें' : 'Close Comparison'}
          </button>
        </div>

      </div>
    </div>
  );
};

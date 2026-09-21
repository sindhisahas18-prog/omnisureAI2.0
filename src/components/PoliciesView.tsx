import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Car, 
  HeartPulse, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Search, 
  Download, 
  ArrowRight,
  HelpCircle,
  ExternalLink,
  Sparkles,
  Bike,
  Home,
  Plane,
  Smartphone,
  Activity,
  Shield,
  Briefcase,
  ArrowLeftRight,
  Scale,
  Check
} from 'lucide-react';
import { InsurancePolicy, InsuranceType, Language } from '../types';
import { VEHICLE_PARTS } from '../data/insuranceData';
import { downloadPolicyPDF } from '../utils/pdfGenerator';
import { PolicyCompareModal } from './PolicyCompareModal';

interface PoliciesViewProps {
  policies: InsurancePolicy[];
  language: Language;
  onOpenDamageClaim: (policyId?: string) => void;
}

export const PoliciesView: React.FC<PoliciesViewProps> = ({
  policies,
  language,
  onOpenDamageClaim
}) => {
  const isHindi = language === 'hi';
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>(policies[0]?.id || '');
  const [partSearchQuery, setPartSearchQuery] = useState<string>('');
  
  // State for Compare Policies feature
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([
    policies[0]?.id || '',
    policies[1]?.id || ''
  ].filter(Boolean));

  const activePolicy = policies.find(p => p.id === selectedPolicyId) || policies[0];

  const handleToggleCompare = (policyId: string) => {
    setSelectedForComparison(prev => {
      if (prev.includes(policyId)) {
        return prev.filter(id => id !== policyId);
      }
      if (prev.length >= 2) {
        // Replace second one if already 2
        return [prev[0], policyId];
      }
      return [...prev, policyId];
    });
  };

  const handleOpenComparison = () => {
    // If fewer than 2 selected, ensure we default to 2 policies
    if (selectedForComparison.length < 2 && policies.length >= 2) {
      const pA = selectedForComparison[0] || policies[0].id;
      const pB = policies.find(p => p.id !== pA)?.id || policies[1].id;
      setSelectedForComparison([pA, pB]);
    }
    setIsCompareModalOpen(true);
  };

  const getPolicyIcon = (type: InsuranceType) => {
    switch (type) {
      case 'bike': return <Bike className="w-5 h-5 text-emerald-600" />;
      case 'health': return <HeartPulse className="w-5 h-5 text-rose-600" />;
      case 'home': return <Home className="w-5 h-5 text-amber-600" />;
      case 'travel': return <Plane className="w-5 h-5 text-sky-600" />;
      case 'gadget': return <Smartphone className="w-5 h-5 text-indigo-600" />;
      case 'accident': return <Activity className="w-5 h-5 text-teal-600" />;
      case 'life': return <Shield className="w-5 h-5 text-red-600" />;
      case 'other': return <Briefcase className="w-5 h-5 text-slate-600" />;
      default: return <Car className="w-5 h-5 text-sky-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-['Plus_Jakarta_Sans']">
      
      {/* Header with Compare Policies Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-[#172033] font-['Outfit']">
              {isHindi ? 'मेरी बीमा पॉलिसियाँ (My Policies)' : 'My Active Insurance Policies'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-xs font-bold">
              {policies.length} Active
            </span>
          </div>
          <p className="text-xs text-[#667085] mt-1">
            {isHindi 
              ? 'कवरेज सीमा, प्रीमियम, शून्य मूल्यह्रास नियम एवं साइड-बाय-साइड तुलना तालिका।' 
              : 'Review coverage limits, zero-depreciation endorsements, IDV schedules, and compare policies side-by-side.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Compare Policies Action Button */}
          <button
            type="button"
            id="open-compare-policies-btn"
            onClick={handleOpenComparison}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-sky-50 border border-sky-300 text-sky-700 font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all active:scale-98"
          >
            <ArrowLeftRight className="w-4 h-4 text-sky-600" />
            <span>{isHindi ? 'पॉलिसियों की तुलना करें' : 'Compare Policies'}</span>
            {selectedForComparison.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-sky-600 text-white text-[10px] font-bold">
                {selectedForComparison.length}
              </span>
            )}
          </button>

          {activePolicy && (
            <button
              type="button"
              id="policies-file-claim-btn"
              onClick={() => onOpenDamageClaim(activePolicy.id)}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isHindi ? 'इस पॉलिसी पर क्लेम करें' : 'File Claim for Selected Policy'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Policy Selector Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {policies.map(p => {
          const isSelected = p.id === selectedPolicyId;
          const isCompared = selectedForComparison.includes(p.id);

          return (
            <div
              key={p.id}
              id={`policy-card-${p.id}`}
              onClick={() => setSelectedPolicyId(p.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 relative ${
                isSelected
                  ? 'bg-white border-sky-500 shadow-sm ring-2 ring-sky-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs text-[#172033]'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 shadow-xs">
                    {getPolicyIcon(p.type)}
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-[#667085] block">{p.policyNumber}</span>
                    <span className="text-[10px] font-bold text-sky-600 uppercase">{p.type} Cover</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Compare Pill Trigger */}
                  <button
                    type="button"
                    title={isCompared ? 'Remove from comparison' : 'Add to side-by-side comparison'}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleCompare(p.id);
                    }}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      isCompared
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-[#667085]'
                    }`}
                  >
                    <ArrowLeftRight className="w-2.5 h-2.5" />
                    <span>{isCompared ? (isHindi ? 'तुलना में' : 'Comparing') : (isHindi ? '+ तुलना' : '+ Compare')}</span>
                  </button>

                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                    ✓ Active
                  </span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-[#172033] mb-1 line-clamp-1">{p.title}</h3>
              <p className="text-xs text-[#667085] mb-3 line-clamp-2 leading-relaxed">{isHindi ? p.titleHi || p.title : p.title}</p>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-[#667085] block">
                    {isHindi ? 'कवरेज सीमा / IDV:' : 'Coverage Limit / IDV:'}
                  </span>
                  <span className="font-bold text-[#172033]">₹{(p.sumInsured ?? p.insuredDeclaredValue ?? 0).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#667085] block">
                    {isHindi ? 'अनिवार्य डिडक्टिबल:' : 'Compulsory Deductible:'}
                  </span>
                  <span className="font-bold text-[#172033]">{p.deductible === 0 ? '₹0 (Zero Excess)' : `₹${p.deductible}`}</span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100/60 flex items-center justify-between text-[11px]">
                <span className="text-[#667085]">
                  {isHindi ? 'वार्षिक प्रीमियम:' : 'Annual Premium:'}
                </span>
                <span className="font-bold text-sky-700 font-mono">
                  ₹{p.premiumAmount.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Comparison Action Pill */}
      {selectedForComparison.length > 0 && (
        <div 
          id="floating-compare-dock"
          className="p-3 sm:p-4 rounded-2xl bg-[#172033] text-white shadow-xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold font-['Outfit'] flex items-center gap-2">
                <span>{isHindi ? 'पॉलिसी तुलना चयन:' : 'Side-by-Side Comparison Selection:'}</span>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/30 text-sky-300 text-[10px]">
                  {selectedForComparison.length}/2 {isHindi ? 'पॉलिसियाँ चयनित' : 'Selected'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                {selectedForComparison.map(id => policies.find(p => p.id === id)?.title).join(' vs ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setSelectedForComparison([])}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
            >
              {isHindi ? 'हटाएँ' : 'Clear'}
            </button>
            <button
              type="button"
              id="view-comparison-table-dock-btn"
              onClick={handleOpenComparison}
              className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>{isHindi ? 'तुलना तालिका देखें' : 'View Comparison Table'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Selected Policy Detail Breakdown */}
      {activePolicy && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 block">
                {isHindi ? 'पॉलिसी दस्तावेज़ एवं कवरेज संरचना' : 'Policy Document & Coverage Architecture'}
              </span>
              <h2 className="text-lg font-bold text-[#172033] font-['Outfit'] mt-0.5">
                {isHindi ? activePolicy.titleHi || activePolicy.title : activePolicy.title}
              </h2>
              {activePolicy.vehicleDetails && (
                <p className="text-xs text-[#667085] mt-1">
                  Insured Asset: {activePolicy.vehicleDetails.make} {activePolicy.vehicleDetails.model} ({activePolicy.vehicleDetails.regNumber}) • Engine: {activePolicy.vehicleDetails.engineNumber}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                id="compare-with-another-btn"
                onClick={() => {
                  setSelectedForComparison([
                    activePolicy.id,
                    policies.find(p => p.id !== activePolicy.id)?.id || policies[0].id
                  ]);
                  setIsCompareModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-sky-600" />
                <span>{isHindi ? 'अन्य से तुलना करें' : 'Compare with Another'}</span>
              </button>
              <button
                type="button"
                onClick={() => downloadPolicyPDF(activePolicy)}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#172033] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-[#667085]" />
                <span>Download Schedule (PDF)</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenDamageClaim(activePolicy.id)}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-98 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{activePolicy.type === 'motor' ? 'Report Car Damage' : 'File Policy Claim'}</span>
              </button>
            </div>
          </div>

          {/* Add-ons & Benefits Matrix */}
          <div>
            <h3 className="text-xs font-bold text-[#667085] uppercase tracking-wider mb-3">
              {isHindi ? 'शामिल राइडर्स एवं कवरेज लाभ:' : 'Included Endorsements, Riders & Coverage Benefits:'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {activePolicy.addons.map((addon, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-medium text-[#172033]">{addon}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Component Coverage Search Matrix */}
          {activePolicy.type === 'motor' && (
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-[#172033] font-['Outfit']">
                    Vehicle Component Coverage Transparency Matrix
                  </h3>
                  <p className="text-xs text-[#667085]">
                    Review how this policy treats specific vehicle components before filing a claim.
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-[#667085] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={partSearchQuery}
                    onChange={e => setPartSearchQuery(e.target.value)}
                    placeholder="Search part (bumper, glass, mirror)..."
                    className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs text-[#172033] focus:outline-none focus:border-sky-500 shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {VEHICLE_PARTS
                  .filter(p => !partSearchQuery || p.name.toLowerCase().includes(partSearchQuery.toLowerCase()))
                  .slice(0, 12)
                  .map(part => {
                    const rule = activePolicy.partCoverageRules?.[part.id];
                    const status = rule ? rule.status : (activePolicy.coveredPartIds?.includes(part.id) ? 'covered' : 'not_covered');
                    const reason = rule ? rule.reason : 'Standard policy terms apply.';

                    return (
                      <div
                        key={part.id}
                        className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 flex flex-col justify-between space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#172033]">{part.name}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            status === 'covered' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' :
                            status === 'requires_verification' ? 'bg-amber-50 border border-amber-200 text-amber-800' :
                            'bg-rose-50 border border-rose-200 text-rose-700'
                          }`}>
                            {status === 'covered' ? '✓ Covered' :
                             status === 'requires_verification' ? '⚠ Verification' : '✕ Excluded'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#667085] leading-relaxed">
                          {reason}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Side-by-Side Policy Comparison Modal */}
      <PolicyCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        policies={policies}
        initialPolicyIdA={selectedForComparison[0] || policies[0]?.id}
        initialPolicyIdB={selectedForComparison[1] || policies[1]?.id}
        language={language}
        onOpenDamageClaim={onOpenDamageClaim}
      />

    </div>
  );
};


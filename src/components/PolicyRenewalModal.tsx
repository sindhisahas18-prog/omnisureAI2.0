import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Calendar, 
  RotateCw, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Download, 
  CreditCard, 
  Car, 
  Smartphone, 
  Bike, 
  HeartPulse, 
  Home, 
  Plane, 
  Activity, 
  Shield, 
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { InsurancePolicy, Language } from '../types';
import { downloadPolicyPDF } from '../utils/pdfGenerator';

interface PolicyRenewalModalProps {
  policy: InsurancePolicy;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onConfirmRenewal: (policyId: string, updatedPolicy: Partial<InsurancePolicy>) => void;
}

export const PolicyRenewalModal: React.FC<PolicyRenewalModalProps> = ({
  policy,
  isOpen,
  onClose,
  language,
  onConfirmRenewal
}) => {
  const isHindi = language === 'hi';

  // Calculate new renewal dates (1 year extension)
  const currentExpiry = new Date(policy.expiryDate);
  const newExpiry = new Date(currentExpiry);
  newExpiry.setFullYear(newExpiry.getFullYear() + 1);
  const newExpiryStr = newExpiry.toISOString().split('T')[0];

  // Renewal settings
  const [ncbDiscountPercent, setNcbDiscountPercent] = useState<number>(25); // 25% No-Claim Bonus
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [renewalSuccess, setRenewalSuccess] = useState<boolean>(false);
  const [renewedPolicyRecord, setRenewedPolicyRecord] = useState<InsurancePolicy | null>(null);

  if (!isOpen) return null;

  // Premium calculations
  const basePremium = policy.premiumAmount || 12000;
  const ncbDiscountAmount = Math.round((basePremium * ncbDiscountPercent) / 100);
  const discountedPremium = basePremium - ncbDiscountAmount;
  const gstAmount = Math.round(discountedPremium * 0.18);
  const totalPayable = discountedPremium + gstAmount;

  const handleProcessRenewal = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const updated: InsurancePolicy = {
        ...policy,
        expiryDate: newExpiryStr,
        status: 'active',
        documents: [
          {
            name: `Renewal_Certificate_${policy.policyNumber}_2026.pdf`,
            size: '2.1 MB',
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          },
          ...policy.documents
        ]
      };

      setRenewedPolicyRecord(updated);
      setRenewalSuccess(true);
      onConfirmRenewal(policy.id, updated);
    }, 1200);
  };

  const getPolicyIcon = () => {
    switch (policy.type) {
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

  return (
    <div 
      id="policy-renewal-modal-overlay"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div 
        id="policy-renewal-modal"
        className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
              {getPolicyIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  {isHindi ? 'पॉलिसी नवीनीकरण' : 'INSTANT POLICY RENEWAL'}
                </span>
                <span className="font-mono text-xs text-[#667085] font-semibold">{policy.policyNumber}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#172033] font-['Outfit'] mt-0.5">
                {isHindi ? policy.titleHi : policy.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            id="close-renewal-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {!renewalSuccess ? (
          <div className="p-6 sm:p-7 space-y-6">
            
            {/* Expiry Timeline Extension Visual */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-[#667085] uppercase tracking-wider block">
                {isHindi ? 'कवरेज अवधि विस्तार (1 वर्ष अतिरिक्त)' : 'Coverage Period Extension (+1 Year)'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-amber-200 space-y-1">
                  <span className="text-[#667085] block text-[11px]">
                    {isHindi ? 'वर्तमान समाप्ति तिथि:' : 'Current Expiry Date:'}
                  </span>
                  <div className="flex items-center gap-2 font-bold text-amber-800">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>{policy.expiryDate}</span>
                  </div>
                  <span className="text-[10px] text-amber-700 block font-medium">
                    {isHindi ? 'आईआरडीएआई ग्रेस विंडो सक्रिय' : 'IRDAI 30-Day Renewal Window'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-emerald-200 space-y-1">
                  <span className="text-[#667085] block text-[11px]">
                    {isHindi ? 'नई नवीनीकृत समाप्ति तिथि:' : 'New Renewed Expiry Date:'}
                  </span>
                  <div className="flex items-center gap-2 font-bold text-emerald-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{newExpiryStr}</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 block font-medium">
                    {isHindi ? '365 दिनों का निर्बाध सुरक्षा कवच' : '365 Days Seamless Continuous Cover'}
                  </span>
                </div>
              </div>
            </div>

            {/* Insured Asset & Retained NCB Tier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
                <span className="text-[#667085] block text-[11px]">
                  {isHindi ? 'बीमित परिसंपत्ति / घोषित मूल्य (IDV):' : 'Insured Asset / Sum Insured:'}
                </span>
                <span className="font-bold text-[#172033] block">
                  {policy.vehicleDetails 
                    ? `${policy.vehicleDetails.make} ${policy.vehicleDetails.model} (${policy.vehicleDetails.regNumber})`
                    : policy.holderName}
                </span>
                <span className="font-mono text-sky-700 font-bold">
                  ₹{(policy.sumInsured ?? policy.insuredDeclaredValue ?? 0).toLocaleString()} IDV
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
                <span className="text-[#667085] block text-[11px]">
                  {isHindi ? 'नो-क्लेम बोनस (NCB) छूट दर:' : 'No-Claim Bonus (NCB) Discount Tier:'}
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-700">{ncbDiscountPercent}% NCB Reward</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[10px]">
                    Claim-Free Year
                  </span>
                </div>
                <p className="text-[11px] text-[#667085]">
                  {isHindi ? 'समय पर नवीनीकरण करने से आपका संचित बोनस सुरक्षित रहेगा।' : 'Early renewal guarantees zero loss of accumulated NCB.'}
                </p>
              </div>
            </div>

            {/* Bundled Add-ons Continuous Shield */}
            {policy.addons && policy.addons.length > 0 && (
              <div>
                <span className="text-xs font-bold text-[#667085] uppercase tracking-wider block mb-2">
                  {isHindi ? 'शामिल राइडर्स व सुरक्षा (स्वतः नवीनीकृत):' : 'Renewed Endorsements & Coverage Riders:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {policy.addons.slice(0, 4).map((addon, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-[#172033] font-medium truncate">{addon}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Premium Calculation Breakdown */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2 text-xs">
              <span className="text-xs font-bold text-[#172033] uppercase tracking-wider block pb-1 border-b border-slate-200">
                {isHindi ? 'प्रीमियम व कर विवरण (IRDAI अनुरूप)' : 'Statutory Premium & Tax Breakdown'}
              </span>

              <div className="flex items-center justify-between text-[#667085]">
                <span>{isHindi ? 'वार्षिक आधार प्रीमियम' : 'Annual Base Premium'}</span>
                <span className="font-mono text-[#172033]">₹{basePremium.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-emerald-700 font-medium">
                <span>{isHindi ? `नो-क्लेम बोनस छूट (${ncbDiscountPercent}%)` : `No-Claim Bonus Discount (${ncbDiscountPercent}%)`}</span>
                <span className="font-mono">-₹{ncbDiscountAmount.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-[#667085]">
                <span>{isHindi ? 'वस्तु एवं सेवा कर (GST @ 18%)' : 'IRDAI Mandated GST (18%)'}</span>
                <span className="font-mono text-[#172033]">₹{gstAmount.toLocaleString()}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-bold text-[#172033]">
                <span>{isHindi ? 'कुल देय नवीनीकरण प्रीमियम:' : 'Total Payable Renewal Premium:'}</span>
                <span className="text-base font-extrabold text-sky-700 font-mono">
                  ₹{totalPayable.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#667085] uppercase tracking-wider block">
                {isHindi ? 'भुगतान विधि चुनें' : 'Select Payment Method'}
              </span>

              <div className="grid grid-cols-3 gap-2.5 text-xs">
                {[
                  { id: 'upi', label: 'UPI / QR', sub: 'GPay, PhonePe, Paytm' },
                  { id: 'card', label: 'Debit / Card', sub: 'Visa, Mastercard, RuPay' },
                  { id: 'netbanking', label: 'Net Banking', sub: 'HDFC, ICICI, SBI' }
                ].map(method => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedPaymentMethod(method.id as any)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedPaymentMethod === method.id
                        ? 'bg-sky-50 border-sky-500 text-sky-900 ring-2 ring-sky-500/20'
                        : 'bg-white border-slate-200 text-[#667085] hover:border-slate-300'
                    }`}
                  >
                    <span className="font-bold block text-[#172033]">{method.label}</span>
                    <span className="text-[10px] text-[#667085] block truncate mt-0.5">{method.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#667085] hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </button>

              <button
                type="button"
                id="confirm-renewal-btn"
                disabled={isProcessing}
                onClick={handleProcessRenewal}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                {isProcessing ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>{isHindi ? 'नवीनीकरण हो रहा है...' : 'Processing Renewal...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{isHindi ? `भुगतान करें और नवीनीकृत करें (₹${totalPayable.toLocaleString()})` : `Pay & Renew (₹${totalPayable.toLocaleString()})`}</span>
                  </>
                )}
              </button>
            </div>

          </div>
        ) : (
          /* Renewal Success View */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-sm animate-in zoom-in-50 duration-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                {isHindi ? 'पॉलिसी नवीनीकृत हो गई' : 'Policy Renewed Successfully'}
              </span>
              <h3 className="text-xl font-bold text-[#172033] font-['Outfit'] mt-2">
                {isHindi ? 'पॉलिसी का सफल नवीनीकरण!' : 'Continuous Cover Secured for 365 Days'}
              </h3>
              <p className="text-xs text-[#667085] leading-relaxed">
                {isHindi
                  ? `आपकी पॉलिसी ${policy.policyNumber} को 1 वर्ष के लिए बढ़ा दिया गया है। नई समाप्ति तिथि ${newExpiryStr} है।`
                  : `Your policy ${policy.policyNumber} has been renewed. The revised expiry date is ${newExpiryStr} with full No-Claim Bonus protection.`}
              </p>
            </div>

            {/* Receipt Details Card */}
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between items-center text-[#667085]">
                <span>{isHindi ? 'नवीनीकरण संदर्भ संख्या:' : 'Renewal Ref Number:'}</span>
                <span className="font-mono font-bold text-[#172033]">OMNI-REN-{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex justify-between items-center text-[#667085]">
                <span>{isHindi ? 'वैधता अवधि:' : 'Validity Period:'}</span>
                <span className="font-bold text-emerald-700">{policy.expiryDate} to {newExpiryStr}</span>
              </div>
              <div className="flex justify-between items-center text-[#667085]">
                <span>{isHindi ? 'भुगतान किया गया प्रीमियम:' : 'Premium Paid:'}</span>
                <span className="font-bold font-mono text-[#172033]">₹{totalPayable.toLocaleString()} (Incl. 18% GST)</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {renewedPolicyRecord && (
                <button
                  type="button"
                  id="download-renewed-policy-btn"
                  onClick={() => downloadPolicyPDF(renewedPolicyRecord)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#172033] text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <Download className="w-4 h-4 text-sky-600" />
                  <span>{isHindi ? 'पॉलिसी अनुसूची (PDF) डाउनलोड करें' : 'Download Renewed Certificate (PDF)'}</span>
                </button>
              )}

              <button
                type="button"
                id="close-success-renewal-btn"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                {isHindi ? 'पूर्ण' : 'Done'}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

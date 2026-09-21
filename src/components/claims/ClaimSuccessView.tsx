import React from 'react';
import { 
  CheckCircle2, 
  FileText, 
  Calendar, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Download, 
  ExternalLink,
  Sparkles,
  Car,
  Bike,
  HeartPulse,
  Home,
  Plane,
  Smartphone,
  Activity,
  Heart,
  Briefcase
} from 'lucide-react';
import { InsuranceClaim, Language, InsuranceType } from '../../types';
import { INDIAN_INSURANCE_KNOWLEDGE } from '../../data/indianInsuranceKnowledge';

interface ClaimSuccessViewProps {
  claim: InsuranceClaim;
  language: Language;
  onViewClaimsTracker: () => void;
  onCloseModal: () => void;
}

export const ClaimSuccessView: React.FC<ClaimSuccessViewProps> = ({
  claim,
  language,
  onViewClaimsTracker,
  onCloseModal
}) => {
  const isHindi = language === 'hi';
  const type = claim.insuranceType;
  const knowledge = INDIAN_INSURANCE_KNOWLEDGE[type] || INDIAN_INSURANCE_KNOWLEDGE.other;
  const specialized = claim.specializedDetails || {};

  // Category Configuration
  const getCategoryConfig = (cat: InsuranceType) => {
    switch (cat) {
      case 'home':
        return {
          title: isHindi ? 'गृह बीमा क्लेम सफलतापूर्वक दर्ज हुआ!' : 'Home Insurance Claim Lodged Successfully',
          badgeText: 'HOME INSURANCE',
          badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: Home,
          assetLabel: isHindi ? 'बीमित आवासीय संपत्ति' : 'Insured Property & Structure',
          primaryDetailLabel: 'Affected Rooms',
          primaryDetailValue: specialized.affectedRooms ? specialized.affectedRooms.join(', ') : 'Living Room & Structure',
          secondaryDetailLabel: 'Peril / Incident Cause',
          secondaryDetailValue: specialized.incidentType || specialized.damageCause || 'Water Pipe Burst & Ingress',
          nextStep: 'IRDAI Empanelled Loss Assessor / Surveyor assigned for on-site physical property inspection within 24-48 hours.',
          supportNote: 'Please maintain damaged property in as-is condition without removing debris until surveyor physical inspection.'
        };
      case 'travel':
        return {
          title: isHindi ? 'यात्रा बीमा क्लेम सफलतापूर्वक दर्ज हुआ!' : 'Travel Insurance Claim Lodged Successfully',
          badgeText: 'TRAVEL INSURANCE',
          badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
          icon: Plane,
          assetLabel: isHindi ? 'उड़ान व गंतव्य विवरण' : 'Insured Itinerary & Destination',
          primaryDetailLabel: 'Airline & PNR Ref',
          primaryDetailValue: specialized.airlineCarrier && specialized.pnrNumber ? `${specialized.airlineCarrier} (PNR: ${specialized.pnrNumber})` : 'Air France (PNR: AF782910)',
          secondaryDetailLabel: 'Disruption Event / PIR',
          secondaryDetailValue: specialized.carrierPIRNumber ? `${specialized.travelLossType || 'Baggage Delay'} (PIR: ${specialized.carrierPIRNumber})` : specialized.travelLossType || 'Flight Disruption / Delay',
          nextStep: 'Overseas Assistance Desk verifying airline carrier Property Irregularity Report (PIR) & flight boarding documents.',
          supportNote: 'Retain original boarding pass stubs, baggage claim tags, and emergency expense invoices for forex audit.'
        };
      case 'gadget':
        return {
          title: isHindi ? 'गैजेट बीमा क्लेम सफलतापूर्वक दर्ज हुआ!' : 'Device / Gadget Claim Lodged Successfully',
          badgeText: 'DEVICE / GADGET',
          badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          icon: Smartphone,
          assetLabel: isHindi ? 'बीमित उपकरण व आईएमईआई' : 'Insured Device Model & Serial/IMEI',
          primaryDetailLabel: 'Hardware Component',
          primaryDetailValue: specialized.damagedComponent || 'Display & Housing Assembly',
          secondaryDetailLabel: 'Authorized Service Center',
          secondaryDetailValue: specialized.authorizedServiceCenter || 'Apple Saket OEM Service Hub',
          nextStep: 'Doorstep pickup initiated & Apple Authorized Service Center inspection scheduled.',
          supportNote: 'Backup your device data and disable Find My iPhone / Device Lock before handing over to courier.'
        };
      case 'accident':
        return {
          title: isHindi ? 'दुर्घटना बीमा क्लेम सफलतापूर्वक दर्ज हुआ!' : 'Personal Accident Claim Registered Successfully',
          badgeText: 'PERSONAL ACCIDENT',
          badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
          icon: Activity,
          assetLabel: isHindi ? 'बीमित व्यक्ति व चोट विवरण' : 'Injured Insured & Disablement Cover',
          primaryDetailLabel: 'Nature of Injury',
          primaryDetailValue: specialized.injuryNature || 'Compound Fracture & Disablement',
          secondaryDetailLabel: 'Doctor & Hospital',
          secondaryDetailValue: specialized.doctorName ? `${specialized.doctorName} (${specialized.hospitalClinic || 'Attending Hospital'})` : 'AIIMS Trauma Center Orthopedic Board',
          nextStep: 'Medical scrutiny committee auditing attending physician certificate and Medico-Legal record (MLC).',
          supportNote: 'Retain original diagnostic radiological X-Ray/MRI imaging films and attending physician fitness certificates.'
        };
      case 'life':
        return {
          title: isHindi ? 'जीवन बीमा दावा सफलतापूर्वक दर्ज हुआ!' : 'Life Insurance Claim Registered Successfully',
          badgeText: 'LIFE / TERM INSURANCE',
          badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
          icon: Heart,
          assetLabel: isHindi ? 'बीमित व्यक्ति व पंजीकृत नॉमिनी' : 'Life Assured & Registered Beneficiary',
          primaryDetailLabel: 'Registered Nominee',
          primaryDetailValue: specialized.nomineeName ? `${specialized.nomineeName} (${specialized.nomineeRelation || 'Spouse'})` : 'Smt. Ananya Sindhi (Spouse)',
          secondaryDetailLabel: 'Settlement Account',
          secondaryDetailValue: specialized.nomineeBankAccount ? `A/C: ${specialized.nomineeBankAccount} (${specialized.bankIfscCode || 'NEFT'})` : 'Direct NEFT Mandate',
          nextStep: 'Section 45 Statutory Scrutiny & fast-track National Claims Committee review for direct NEFT payout.',
          supportNote: 'Our dedicated Nominee Care Executive will personally coordinate document verification for priority disbursement.'
        };
      case 'health':
        return {
          title: isHindi ? 'स्वास्थ्य क्लेम सफलतापूर्वक दर्ज हुआ!' : 'Health Insurance Claim Lodged Successfully',
          badgeText: 'HEALTH INSURANCE',
          badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: HeartPulse,
          assetLabel: isHindi ? 'मरीज व अस्पताल विवरण' : 'Patient & Network Hospital Details',
          primaryDetailLabel: 'Medical Diagnosis',
          primaryDetailValue: specialized.ailment || 'Acute Dengue / Indoor Admission',
          secondaryDetailLabel: 'Settlement Mode',
          secondaryDetailValue: specialized.isCashless ? `Cashless TPA Desk (Ref: ${specialized.tpaPreAuthId || 'MAX-TPA-992140'})` : 'Reimbursement Claim',
          nextStep: specialized.isCashless
            ? 'TPA Desk pre-authorization guarantee letter transmitted to network hospital billing desk.'
            : 'Reimbursement dossier under medical audit for direct NEFT settlement.',
          supportNote: 'Hospital bills and indoor pharmacy receipts will be settled directly with zero room rent deductions.'
        };
      case 'bike':
        return {
          title: isHindi ? 'टू-व्हीलर क्लेम सफलतापूर्वक दर्ज हुआ!' : 'Two-Wheeler Claim Lodged Successfully',
          badgeText: 'BIKE / TWO-WHEELER',
          badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: Bike,
          assetLabel: isHindi ? 'बीमित बाइक व रजिस्ट्रेशन' : 'Insured Motorcycle & Registration',
          primaryDetailLabel: 'Safety Compliance',
          primaryDetailValue: specialized.helmetWorn ? 'ISI Helmet Worn (Compliant)' : 'Standard Review',
          secondaryDetailLabel: 'Odometer Reading',
          secondaryDetailValue: specialized.odometerKm ? `${specialized.odometerKm.toLocaleString()} KM` : '14,250 KM',
          nextStep: 'Authorized Two-Wheeler Workshop deputation & Zero-Depreciation survey approval.',
          supportNote: 'Cashless garage will commence authorized parts replacement with zero depreciation deductions.'
        };
      case 'other':
        return {
          title: isHindi ? 'व्यावसायिक बीमा क्लेम दर्ज हुआ!' : 'Commercial Asset Claim Lodged Successfully',
          badgeText: 'COMMERCIAL / OTHER',
          badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
          icon: Briefcase,
          assetLabel: isHindi ? 'बीमित परिसंपत्ति विवरण' : 'Insured Commercial Asset & Consignment',
          primaryDetailLabel: 'Loss Incident Category',
          primaryDetailValue: specialized.incidentCategory || 'Goods in Transit & Impact Damage',
          secondaryDetailLabel: 'Claimant Contact',
          secondaryDetailValue: specialized.contactNumber ? `${specialized.claimantName || 'Policyholder'} (${specialized.contactNumber})` : 'Commercial Desk',
          nextStep: 'Empanelled commercial surveyor appointed for physical loss inspection and invoice cross-verification.',
          supportNote: 'Retain all consignment waybills, transporter challans, and delivery logs for physical audit.'
        };
      case 'motor':
      default:
        return {
          title: isHindi ? 'मोटर वाहन क्लेम सफलतापूर्वक दर्ज हुआ!' : 'Motor Damage Claim Lodged Successfully',
          badgeText: 'CAR / MOTOR',
          badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
          icon: Car,
          assetLabel: isHindi ? 'बीमित वाहन विवरण' : 'Insured Vehicle & Registration',
          primaryDetailLabel: 'Policy Coverage',
          primaryDetailValue: 'Zero Depreciation Titanium Bumper-to-Bumper',
          secondaryDetailLabel: 'Workshop Deputation',
          secondaryDetailValue: 'Cashless Network Workshop Assigned',
          nextStep: 'Automated survey report generated; vehicle towed or driven to authorized network garage.',
          supportNote: 'Zero depreciation add-on applies. Compulsory excess of ₹1,000 will be settled at vehicle delivery.'
        };
    }
  };

  const config = getCategoryConfig(type);
  const CategoryIcon = config.icon;

  return (
    <div className="space-y-6 py-2 animate-in fade-in zoom-in-95 duration-200">
      {/* Top Banner with Dynamic Icon and Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 text-center space-y-4 shadow-sm">
        
        {/* Animated Check Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
          <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
        </div>

        {/* Dynamic Title */}
        <div className="space-y-1.5">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.badgeColor}`}>
            <CategoryIcon className="w-3.5 h-3.5" />
            <span>{config.badgeText}</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#172033] font-['Outfit'] tracking-tight">
            {config.title}
          </h2>
          <p className="text-xs text-[#667085] max-w-lg mx-auto">
            {isHindi 
              ? 'आपका क्लेम सफलतापूर्वक आईआरडीएआई दिशानिर्देशों के अनुसार दर्ज कर लिया गया है।'
              : 'Your claim dossier has been successfully recorded in accordance with IRDAI statutory timelines.'}
          </p>
        </div>

        {/* Claim Reference Card */}
        <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#667085] font-semibold">{isHindi ? 'क्लेम संदर्भ संख्या (Ref No.)' : 'OMNISURE Claim Reference'}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
              ✓ FNOL Generated
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-mono font-black text-sky-700 tracking-wider">
            {claim.claimNumber}
          </div>
          <div className="text-[11px] text-[#667085] flex items-center justify-center gap-2 font-medium">
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            <span>Intimation Timestamp: {claim.createdAt || new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Specific Claim Summary Data Grid */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <h4 className="text-xs font-bold text-[#667085] uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center justify-between">
          <span>{isHindi ? 'दावे का आधिकारिक विवरण' : 'Claim Verification Summary & Asset Record'}</span>
          <span className="font-mono text-sky-700 text-[11px] font-semibold">{knowledge.standardPolicyName.split('/')[0]}</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Insured Asset */}
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
            <span className="text-[10px] text-[#667085] uppercase font-semibold block">{config.assetLabel}</span>
            <span className="font-bold text-[#172033] text-sm line-clamp-1">{claim.assetName}</span>
          </div>

          {/* Insurer & Policy */}
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
            <span className="text-[10px] text-[#667085] uppercase font-semibold block">Underwriting Policy</span>
            <span className="font-bold text-sky-700 text-sm line-clamp-1">{claim.policyTitle}</span>
            <span className="text-[10px] font-mono text-[#667085] block">{claim.policyNumber}</span>
          </div>

          {/* Category-Specific Detail 1 */}
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
            <span className="text-[10px] text-[#667085] uppercase font-semibold block">{config.primaryDetailLabel}</span>
            <span className="font-semibold text-[#172033] block">{config.primaryDetailValue}</span>
          </div>

          {/* Category-Specific Detail 2 */}
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
            <span className="text-[10px] text-[#667085] uppercase font-semibold block">{config.secondaryDetailLabel}</span>
            <span className="font-semibold text-[#172033] block">{config.secondaryDetailValue}</span>
          </div>

          {/* Financial Breakdown */}
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
            <span className="text-[10px] text-[#667085] uppercase font-semibold block">Estimated Claim Valuation</span>
            <span className="text-base font-bold text-emerald-700 font-mono">
              ₹{(claim.estimatedAmount || 0).toLocaleString()}
            </span>
            <span className="text-[10px] text-[#667085] block">
              Deductible Applied: {claim.deductibleApplied === 0 ? '₹0 (Zero Excess)' : `₹${claim.deductibleApplied.toLocaleString()}`}
            </span>
          </div>

          {/* Expected Payout */}
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
            <span className="text-[10px] text-[#667085] uppercase font-semibold block">Net Payable Payout Estimate</span>
            <span className="text-base font-bold text-[#172033] font-mono">
              ₹{(claim.netPayoutEstimate || claim.estimatedAmount || 0).toLocaleString()}
            </span>
            <span className="text-[10px] text-sky-700 font-semibold block">
              Direct NEFT Electronic Settlement
            </span>
          </div>
        </div>

        {/* Tailored Next Step Box */}
        <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100 space-y-2">
          <div className="flex items-center gap-2 text-sky-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>{isHindi ? 'अगला कदम (Next Action):' : 'Immediate Next Procedural Step:'}</span>
          </div>
          <p className="text-xs text-[#172033] leading-relaxed font-medium">
            {claim.nextStep || config.nextStep}
          </p>
          <p className="text-[11px] text-[#667085] italic">
            {config.supportNote}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(claim, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `${claim.claimNumber}_FNOL_Dossier.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
          }}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#172033] font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-[#667085]" />
          <span>{isHindi ? 'क्लेम डोजियर डाउनलोड करें' : 'Download Claim FNOL Dossier (JSON)'}</span>
        </button>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={onCloseModal}
            className="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#667085] hover:text-[#172033] font-semibold text-xs border border-slate-200 cursor-pointer shadow-xs"
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>
          <button
            type="button"
            onClick={onViewClaimsTracker}
            className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98"
          >
            <span>{isHindi ? 'क्लेम ट्रैकर में देखें' : 'View in Claims Tracker'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

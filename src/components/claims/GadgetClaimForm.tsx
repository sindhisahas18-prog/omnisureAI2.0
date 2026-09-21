import React, { useState } from 'react';
import { 
  Smartphone, 
  Calendar, 
  Upload, 
  FileText, 
  CheckSquare, 
  Square, 
  Camera, 
  DollarSign, 
  CheckCircle2, 
  Cpu, 
  Wrench,
  Hash,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { InsurancePolicy, Language, InsuranceClaim } from '../../types';
import { PolicyCoverageSummaryCard } from './PolicyCoverageSummaryCard';
import { INDIAN_INSURANCE_KNOWLEDGE } from '../../data/indianInsuranceKnowledge';

interface GadgetClaimFormProps {
  policy: InsurancePolicy;
  language: Language;
  onSubmit: (claimData: Partial<InsuranceClaim>) => void;
  isSubmitting: boolean;
}

export const GadgetClaimForm: React.FC<GadgetClaimFormProps> = ({
  policy,
  language,
  onSubmit,
  isSubmitting
}) => {
  const isHindi = language === 'hi';
  const gadgetKnowledge = INDIAN_INSURANCE_KNOWLEDGE.gadget;

  const [deviceType, setDeviceType] = useState<string>('Smartphone (Flagship)');
  const [deviceBrand, setDeviceBrand] = useState<string>('Apple');
  const [deviceModel, setDeviceModel] = useState<string>('iPhone 16 Pro Max (256GB - Desert Titanium)');
  const [purchaseDate, setPurchaseDate] = useState<string>('2025-10-15');
  const [purchaseInvoiceNo, setPurchaseInvoiceNo] = useState<string>('INV-APL-DEL-99214');
  const [originalPrice, setOriginalPrice] = useState<number>(144900);

  const [damagedComponent, setDamagedComponent] = useState<string>('Front Super Retina XDR OLED Screen & Digitizer');
  const [gadgetDamageNature, setGadgetDamageNature] = useState<string>(gadgetKnowledge.incidentOptions[0]);
  const [damageSeverity, setDamageSeverity] = useState<string>('Moderate (Glass cracked, OLED responsive)');
  const [imeiNumber, setImeiNumber] = useState<string>('358921094892104');
  const [serialNumber, setSerialNumber] = useState<string>('DNPX882910M');
  const [warrantyStatus, setWarrantyStatus] = useState<string>('AppleCare+ Active & Covered');
  const [authorizedServiceCenter, setAuthorizedServiceCenter] = useState<string>('Apple Saket (Select CityWalk OEM Center)');

  const [incidentDate, setIncidentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [incidentDescription, setIncidentDescription] = useState<string>(
    'Accidentally slipped from jacket pocket onto tiled pavement while walking. Front ceramic shield glass severely cracked across upper speaker ear-piece and hairline fracture diagonally across display.'
  );

  const [estimatedCost, setEstimatedCost] = useState<number>(28900);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'iPhone16Pro_Display_Fracture_Front.jpg',
    'IMEI_Screen_Verification_Settings.jpg'
  ]);

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([
    'DOC-DEV-01',
    'DOC-DEV-02',
    'DOC-DEV-03',
    'DOC-DEV-05'
  ]);

  const toggleDocument = (code: string) => {
    setSelectedDocuments(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const deductible = policy.deductible || 1000;
    const netPayout = Math.max(0, estimatedCost - deductible);

    const claimPayload: Partial<InsuranceClaim> = {
      insuranceType: 'gadget',
      policyId: policy.id,
      policyNumber: policy.policyNumber,
      policyTitle: policy.title,
      assetName: `${deviceBrand} ${deviceModel} (IMEI: ${imeiNumber})`,
      incidentDate,
      incidentLocation: 'New Delhi',
      incidentDescription,
      damagedParts: [],
      photos: uploadedPhotos,
      estimatedAmount: estimatedCost,
      approvedAmount: netPayout,
      deductibleApplied: deductible,
      netPayoutEstimate: netPayout,
      nextStep: 'Doorstep courier pickup / Apple Authorized Service Center job card inspection scheduled.',
      questionsAnswered: [
        { question: 'Device Model & Brand', answer: `${deviceBrand} ${deviceModel}` },
        { question: 'IMEI / Serial Number', answer: `${imeiNumber} (SN: ${serialNumber})` },
        { question: 'Damaged Hardware Component', answer: damagedComponent },
        { question: 'Damage Severity', answer: damageSeverity },
        { question: 'Damage Nature / Cause', answer: gadgetDamageNature },
        { question: 'Authorized OEM Service Center', answer: authorizedServiceCenter },
        { question: 'Original Purchase Invoice', answer: `${purchaseInvoiceNo} (₹${originalPrice.toLocaleString()})` }
      ],
      specializedDetails: {
        deviceType,
        deviceBrand,
        deviceModel,
        purchaseDate,
        purchaseInvoiceNo,
        originalPrice,
        damagedComponent,
        gadgetDamageNature,
        damageSeverity,
        imeiNumber,
        serialNumber,
        warrantyStatus,
        authorizedServiceCenter
      }
    };

    onSubmit(claimPayload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Policy Coverage Check */}
      <PolicyCoverageSummaryCard policy={policy} language={language} />

      {/* 2. Device Specifications & Identification */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <Smartphone className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">
            {isHindi ? '1. डिवाइस व खरीद विवरण' : '1. Device Specifications & Purchase Identity'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Device Category</label>
            <select
              value={deviceType}
              onChange={e => setDeviceType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="Smartphone (Flagship)">Smartphone / Mobile Phone</option>
              <option value="Laptop / MacBook">Laptop / MacBook / Ultrabook</option>
              <option value="Tablet / iPad">Tablet / Apple iPad / Galaxy Tab</option>
              <option value="Smartwatch">Smartwatch / Apple Watch Ultra</option>
              <option value="DSLR Camera">DSLR / Mirrorless Camera</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Device Brand</label>
            <input
              type="text"
              required
              value={deviceBrand}
              onChange={e => setDeviceBrand(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Exact Model & Storage</label>
            <input
              type="text"
              required
              value={deviceModel}
              onChange={e => setDeviceModel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Hash className="w-3 h-3 text-cyan-400" />
              <span>IMEI Number (15-Digits)</span>
            </label>
            <input
              type="text"
              required
              pattern="[0-9]{15}"
              maxLength={15}
              value={imeiNumber}
              onChange={e => setImeiNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-500 tracking-wider"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Serial Number</label>
            <input
              type="text"
              required
              value={serialNumber}
              onChange={e => setSerialNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-500 uppercase"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Invoice Number</label>
            <input
              type="text"
              required
              value={purchaseInvoiceNo}
              onChange={e => setPurchaseInvoiceNo(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Damage Nature, Severity & Component */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <Wrench className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">
            {isHindi ? '2. घटक क्षति व गंभीरता' : '2. Damaged Component, Severity & Root Cause'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Primary Damaged Component</label>
            <select
              value={damagedComponent}
              onChange={e => setDamagedComponent(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            >
              {gadgetKnowledge.componentOptions.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Incident / Damage Type</label>
            <select
              value={gadgetDamageNature}
              onChange={e => setGadgetDamageNature(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            >
              {gadgetKnowledge.incidentOptions.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Damage Severity Level</label>
            <select
              value={damageSeverity}
              onChange={e => setDamageSeverity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="Minor (Hairline crack, fully operable)">Minor (Hairline glass crack, fully operable)</option>
              <option value="Moderate (Deep fracture, touchscreen responsive)">Moderate (Deep fracture, touchscreen responsive)</option>
              <option value="Severe (Black ink bleed, touch failure)">Severe (Black ink bleed, touch digitizer failure)</option>
              <option value="Completely inoperable / Liquid dead">Completely inoperable / Liquid dead logic board</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Authorized OEM Repair Center</label>
            <input
              type="text"
              value={authorizedServiceCenter}
              onChange={e => setAuthorizedServiceCenter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Narrative */}
        <div className="space-y-1 pt-1">
          <label className="text-xs font-semibold text-slate-300 block">
            Incident Description (How damage occurred):
          </label>
          <textarea
            rows={2}
            required
            value={incidentDescription}
            onChange={e => setIncidentDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500 leading-relaxed"
          />
        </div>
      </div>

      {/* 4. Repair Estimate & Documents */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">
            3. OEM Repair Estimate & Verification Documents
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Authorized Repair Cost Estimate (₹)</label>
            <input
              type="number"
              min={500}
              value={estimatedCost}
              onChange={e => setEstimatedCost(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-cyan-500 font-mono"
            />
            <span className="text-[10px] text-slate-400">
              Standard Deductible: ₹{policy.deductible.toLocaleString()} (Net Payout: ₹{Math.max(0, estimatedCost - policy.deductible).toLocaleString()})
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Photos of Damaged Device</span>
              <span className="text-[10px] text-cyan-400 font-mono">{uploadedPhotos.length} photos verified</span>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
              Attached
            </span>
          </div>
        </div>

        {/* Documents */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            AppleCare+ / Digit Insurance Required Documents:
          </span>
          <div className="space-y-2">
            {gadgetKnowledge.mandatoryClaimDocuments.map(doc => {
              const isChecked = selectedDocuments.includes(doc.code);
              return (
                <div
                  key={doc.code}
                  onClick={() => toggleDocument(doc.code)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-slate-900 border-cyan-500/40 text-slate-200'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-cyan-400 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                    <div>
                      <span className="text-xs font-bold text-white block">{doc.name}</span>
                      <span className="text-[10px] text-slate-400">{doc.description}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-800 text-slate-400">
                    {doc.code}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
        >
          <Smartphone className="w-4 h-4" />
          <span>
            {isSubmitting
              ? (isHindi ? 'गैजेट क्लेम दर्ज हो रहा है...' : 'Initiating OEM Pickup & Lodging Claim...')
              : (isHindi ? 'गैजेट क्लेम दर्ज करें (Submit Device Claim)' : 'Submit Device / Gadget Claim')}
          </span>
        </button>
      </div>
    </form>
  );
};

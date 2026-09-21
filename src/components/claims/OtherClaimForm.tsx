import React, { useState } from 'react';
import { 
  Briefcase, 
  Calendar, 
  Clock, 
  MapPin, 
  Upload, 
  FileText, 
  DollarSign, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle,
  Plus,
  Trash2
} from 'lucide-react';
import { InsurancePolicy, Language, InsuranceClaim } from '../../types';
import { PolicyCoverageSummaryCard } from './PolicyCoverageSummaryCard';

interface OtherClaimFormProps {
  policy: InsurancePolicy;
  language: Language;
  onSubmit: (claimData: Partial<InsuranceClaim>) => void;
  isSubmitting: boolean;
}

export const OtherClaimForm: React.FC<OtherClaimFormProps> = ({
  policy,
  language,
  onSubmit,
  isSubmitting
}) => {
  const isHindi = language === 'hi';

  const [claimTitle, setClaimTitle] = useState<string>('Commercial Equipment & Goods in Transit Damage');
  const [incidentCategory, setIncidentCategory] = useState<string>('Accidental Physical Damage');
  const [incidentDate, setIncidentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [incidentTime, setIncidentTime] = useState<string>('11:00');
  const [incidentLocation, setIncidentLocation] = useState<string>('Okhla Industrial Area, Phase-III, New Delhi');
  const [incidentDescription, setIncidentDescription] = useState<string>(
    'During transit consignment unloading, heavy machinery sustained structural impact damage to the primary pneumatic enclosure and motor mount.'
  );

  const [damagedItems, setDamagedItems] = useState<string[]>([
    'High-Precision Pneumatic Pump Enclosure',
    'Electronic Control Unit (ECU) Assembly'
  ]);
  const [newItemInput, setNewItemInput] = useState<string>('');
  const [estimatedLoss, setEstimatedLoss] = useState<number>(75000);
  const [claimantName, setClaimantName] = useState<string>(policy.holderName || 'Sahas Sindhi');
  const [contactNumber, setContactNumber] = useState<string>('+91 98112 34567');

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([
    'Commercial Bill of Lading / Invoices',
    'Incident FIR / Police GD Intimation',
    'Surveyor Estimate of Repairs / Loss',
    'Photographic Evidence of Damaged Goods'
  ]);

  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'transit_damage_machinery_01.jpg',
    'impact_dent_crush_report_02.jpg'
  ]);

  const addItem = () => {
    if (newItemInput.trim()) {
      setDamagedItems(prev => [...prev, newItemInput.trim()]);
      setNewItemInput('');
    }
  };

  const removeItem = (idx: number) => {
    setDamagedItems(prev => prev.filter((_, i) => i !== idx));
  };

  const toggleDocument = (doc: string) => {
    setSelectedDocuments(prev =>
      prev.includes(doc) ? prev.filter(d => d !== doc) : [...prev, doc]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const deductible = policy.deductible || 2000;
    const netPayout = Math.max(0, estimatedLoss - deductible);

    const payload: Partial<InsuranceClaim> = {
      insuranceType: 'other',
      policyId: policy.id,
      policyNumber: policy.policyNumber,
      policyTitle: policy.title,
      assetName: claimTitle,
      incidentDate,
      incidentLocation,
      incidentDescription,
      damagedParts: [],
      photos: uploadedPhotos,
      estimatedAmount: estimatedLoss,
      approvedAmount: netPayout,
      deductibleApplied: deductible,
      netPayoutEstimate: netPayout,
      nextStep: 'Empanelled commercial surveyor appointed for physical loss inspection and invoice cross-verification.',
      questionsAnswered: [
        { question: 'Loss Category', answer: incidentCategory },
        { question: 'Incident Location', answer: incidentLocation },
        { question: 'Damaged Items', answer: damagedItems.join(', ') },
        { question: 'Claimant Contact', answer: `${claimantName} (${contactNumber})` }
      ],
      specializedDetails: {
        claimTitle,
        incidentCategory,
        incidentTime,
        damagedItems,
        claimantName,
        contactNumber,
        selectedDocuments
      }
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PolicyCoverageSummaryCard policy={policy} language={language} />

      {/* Incident & Asset Information */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Briefcase className="w-4 h-4 text-sky-600" />
          <h3 className="text-sm font-bold text-[#172033] font-['Outfit'] uppercase tracking-wider">
            {isHindi ? '1. दावा व क्षति विवरण (Claim & Incident Information)' : '1. Claim & Incident Information'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1.5">
              {isHindi ? 'दावे का शीर्षक / संपत्ति विवरण' : 'Claim Title / Insured Asset Name'}
            </label>
            <input
              type="text"
              value={claimTitle}
              onChange={e => setClaimTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-[#172033] text-xs font-medium focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1.5">
              {isHindi ? 'घटना की श्रेणी (Incident Category)' : 'Incident Category'}
            </label>
            <select
              value={incidentCategory}
              onChange={e => setIncidentCategory(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-[#172033] text-xs font-medium focus:outline-none focus:border-sky-500"
            >
              <option value="Accidental Physical Damage">Accidental Physical Damage</option>
              <option value="Goods in Transit Loss">Goods in Transit / Cargo Loss</option>
              <option value="Commercial Fire & Peril">Commercial Fire & Allied Peril</option>
              <option value="Burglary / Theft of Stock">Burglary / Theft of Stock</option>
              <option value="Machinery Breakdown">Machinery Breakdown</option>
              <option value="Electronic Equipment Damage">Electronic Equipment Damage</option>
              <option value="Public Liability / Third-Party">Public / Third-Party Liability</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              <span>{isHindi ? 'घटना की तारीख' : 'Incident Date'}</span>
            </label>
            <input
              type="date"
              value={incidentDate}
              onChange={e => setIncidentDate(e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-[#172033] text-xs font-medium focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>{isHindi ? 'घटना का समय' : 'Incident Time'}</span>
            </label>
            <input
              type="time"
              value={incidentTime}
              onChange={e => setIncidentTime(e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-[#172033] text-xs font-medium focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#172033] mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
              <span>{isHindi ? 'घटना का स्थान (Incident Location)' : 'Incident Location'}</span>
            </label>
            <input
              type="text"
              value={incidentLocation}
              onChange={e => setIncidentLocation(e.target.value)}
              required
              placeholder="e.g. Warehouse No. 4, Okhla, New Delhi"
              className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-[#172033] text-xs font-medium focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#172033] mb-1.5">
              {isHindi ? 'घटना का विस्तृत विवरण (Incident Description)' : 'Incident Description'}
            </label>
            <textarea
              rows={3}
              value={incidentDescription}
              onChange={e => setIncidentDescription(e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-[#172033] text-xs font-medium focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Damaged Items & Estimated Loss */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-[#172033] font-['Outfit'] uppercase tracking-wider">
            {isHindi ? '2. क्षतिग्रस्त वस्तुएं व अनुमानित लागत' : '2. Damaged Items & Financial Valuation'}
          </h3>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#172033] mb-1.5">
            {isHindi ? 'क्षतिग्रस्त मदें / उपकरण (Damaged Items)' : 'Key Damaged Items / Articles'}
          </label>
          <div className="flex gap-2 mb-2.5">
            <input
              type="text"
              value={newItemInput}
              onChange={e => setNewItemInput(e.target.value)}
              placeholder="Add damaged component, material or stock item..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-[#172033] text-xs font-medium focus:outline-none focus:border-sky-500"
            />
            <button
              type="button"
              onClick={addItem}
              className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {damagedItems.map((item, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs text-[#172033] flex items-center gap-2"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="text-slate-400 hover:text-rose-500 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1.5">
              {isHindi ? 'अनुमानित हानि / मरम्मत लागत (₹)' : 'Total Estimated Loss / Repair Cost (₹)'}
            </label>
            <input
              type="number"
              value={estimatedLoss}
              onChange={e => setEstimatedLoss(Number(e.target.value))}
              required
              className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-[#172033] text-xs font-bold focus:outline-none focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#172033] mb-1.5">
              {isHindi ? 'दावाकर्ता का संपर्क नंबर' : 'Claimant Mobile Number'}
            </label>
            <input
              type="tel"
              value={contactNumber}
              onChange={e => setContactNumber(e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-[#172033] text-xs font-medium focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>
      </div>

      {/* Supporting Documents & Photos */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <FileText className="w-4 h-4 text-sky-600" />
          <h3 className="text-sm font-bold text-[#172033] font-['Outfit'] uppercase tracking-wider">
            {isHindi ? '3. सहायक दस्तावेज व साक्ष्य' : '3. Statutory Documents & Photographic Evidence'}
          </h3>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#667085] block">
            Select Enclosed Proofs & Documents:
          </span>
          {[
            'Commercial Bill of Lading / Invoices',
            'Incident FIR / Police GD Intimation',
            'Surveyor Estimate of Repairs / Loss',
            'Photographic Evidence of Damaged Goods',
            'Delivery Challan & Transporter Loss Certificate'
          ].map((doc, idx) => {
            const isChecked = selectedDocuments.includes(doc);
            return (
              <div
                key={idx}
                onClick={() => toggleDocument(doc)}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-colors ${
                  isChecked
                    ? 'bg-sky-50/60 border-sky-300 text-sky-900 font-semibold'
                    : 'bg-[#F8FAFC] border-slate-200 text-[#667085]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${isChecked ? 'text-sky-600' : 'text-slate-300'}`} />
                  <span>{doc}</span>
                </div>
                <span className="text-[10px] font-mono text-[#667085]">
                  {isChecked ? 'Attached' : 'Optional'}
                </span>
              </div>
            );
          })}
        </div>

        <div className="pt-2">
          <span className="text-xs font-semibold text-[#667085] block mb-2">
            Uploaded Photos / Inspection Files ({uploadedPhotos.length}):
          </span>
          <div className="flex flex-wrap gap-2 text-xs">
            {uploadedPhotos.map((file, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-[#172033] font-mono text-[11px] flex items-center gap-2"
              >
                <Upload className="w-3.5 h-3.5 text-sky-600" />
                <span>{file}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
        <div className="text-xs text-[#667085]">
          Estimated payout after excess: <strong className="text-emerald-700 font-bold">₹{Math.max(0, estimatedLoss - (policy.deductible || 2000)).toLocaleString()}</strong>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{isSubmitting ? 'Lodging Claim...' : 'Submit Claim Dossier'}</span>
        </button>
      </div>
    </form>
  );
};

import React, { useState } from 'react';
import { 
  Home, 
  MapPin, 
  Calendar, 
  Clock, 
  Upload, 
  FileText, 
  CheckSquare, 
  Square, 
  ShieldAlert, 
  Plus, 
  Trash2,
  DollarSign,
  Camera,
  Flame,
  Droplets,
  AlertTriangle
} from 'lucide-react';
import { InsurancePolicy, Language, InsuranceClaim } from '../../types';
import { PolicyCoverageSummaryCard } from './PolicyCoverageSummaryCard';
import { INDIAN_INSURANCE_KNOWLEDGE } from '../../data/indianInsuranceKnowledge';

interface HomeClaimFormProps {
  policy: InsurancePolicy;
  language: Language;
  onSubmit: (claimData: Partial<InsuranceClaim>) => void;
  isSubmitting: boolean;
}

export const HomeClaimForm: React.FC<HomeClaimFormProps> = ({
  policy,
  language,
  onSubmit,
  isSubmitting
}) => {
  const isHindi = language === 'hi';
  const homeKnowledge = INDIAN_INSURANCE_KNOWLEDGE.home;

  const defaultAddress = policy.propertyDetails?.address || 'B-42, Gulmohar Park, South Extension, New Delhi - 110049';
  const defaultPropertyType = policy.propertyDetails?.propertyType || 'Independent Residential Floor';

  const [propertyAddress, setPropertyAddress] = useState<string>(defaultAddress);
  const [propertyType, setPropertyType] = useState<string>(defaultPropertyType);
  const [incidentType, setIncidentType] = useState<string>(homeKnowledge.incidentOptions[0]);
  const [incidentDate, setIncidentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [incidentTime, setIncidentTime] = useState<string>('14:30');
  const [incidentDescription, setIncidentDescription] = useState<string>(
    'Main concealed plumbing pipe rupture behind false ceiling resulted in heavy water seepage across living room vitrified flooring and plaster damage.'
  );

  const [affectedRooms, setAffectedRooms] = useState<string[]>([
    'Living Room & Foyer',
    'Modular Kitchen',
    'Master Bedroom'
  ]);

  const [damagedItems, setDamagedItems] = useState<string[]>([
    'Gypsum False Ceiling with LED Profiles',
    'Hardwood Flooring Underlay',
    'Sony Bravia 65" OLED TV & Console'
  ]);

  const [newItemInput, setNewItemInput] = useState<string>('');
  const [estimatedCost, setEstimatedCost] = useState<number>(145000);
  const [structuralDamage, setStructuralDamage] = useState<boolean>(false);
  const [firFiled, setFirFiled] = useState<boolean>(false);
  const [firNumber, setFirNumber] = useState<string>('');
  const [fireReportAttached, setFireReportAttached] = useState<boolean>(false);

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([
    'DOC-HOM-01',
    'DOC-HOM-02',
    'DOC-HOM-03',
    'DOC-HOM-04',
    'DOC-HOM-07'
  ]);

  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'Water_Damage_Ceiling_Seepage_01.jpg',
    'Flooring_Swelling_Survey_02.jpg'
  ]);

  const toggleRoom = (room: string) => {
    setAffectedRooms(prev => 
      prev.includes(room) ? prev.filter(r => r !== room) : [...prev, room]
    );
  };

  const addDamagedItem = () => {
    if (newItemInput.trim()) {
      setDamagedItems(prev => [...prev, newItemInput.trim()]);
      setNewItemInput('');
    }
  };

  const removeDamagedItem = (idx: number) => {
    setDamagedItems(prev => prev.filter((_, i) => i !== idx));
  };

  const toggleDocument = (code: string) => {
    setSelectedDocuments(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const deductible = policy.deductible || 2500;
    const netPayout = Math.max(0, estimatedCost - deductible);

    const claimPayload: Partial<InsuranceClaim> = {
      insuranceType: 'home',
      policyId: policy.id,
      policyNumber: policy.policyNumber,
      policyTitle: policy.title,
      assetName: `Property: ${propertyAddress.split(',')[0]} (${propertyType})`,
      incidentDate,
      incidentLocation: propertyAddress,
      incidentDescription,
      damagedParts: [],
      photos: uploadedPhotos,
      estimatedAmount: estimatedCost,
      approvedAmount: netPayout,
      deductibleApplied: deductible,
      netPayoutEstimate: netPayout,
      nextStep: 'IRDAI Empanelled Surveyor assigned for on-site physical property loss inspection.',
      questionsAnswered: [
        { question: 'Property Type', answer: propertyType },
        { question: 'Peril / Incident Cause', answer: incidentType },
        { question: 'Incident Date & Time', answer: `${incidentDate} at ${incidentTime}` },
        { question: 'Damaged Rooms', answer: affectedRooms.join(', ') },
        { question: 'Key Damaged Items', answer: damagedItems.join(', ') },
        { question: 'Structural Damage Present', answer: structuralDamage ? 'Yes' : 'No (Contents & Finishes Only)' },
        { question: 'Police FIR Filed', answer: firFiled ? `Yes (FIR: ${firNumber || 'Pending'})` : 'Not Applicable (Non-burglary event)' }
      ],
      specializedDetails: {
        propertyAddress,
        propertyType,
        damageCause: incidentType,
        incidentType,
        incidentTime,
        affectedRooms,
        damagedItems,
        structuralDamage,
        firFiled,
        firNumber: firFiled ? firNumber : undefined,
        fireReportAttached
      }
    };

    onSubmit(claimPayload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Policy Coverage Check Card */}
      <PolicyCoverageSummaryCard policy={policy} language={language} />

      {/* 2. Property & Address Details */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <Home className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">
            {isHindi ? '1. संपत्ति व स्थान विवरण' : '1. Insured Property & Address Details'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isHindi ? 'बीमित संपत्ति का पूरा पता (Property Address)' : 'Insured Property Address'}</span>
            </label>
            <input
              type="text"
              required
              value={propertyAddress}
              onChange={e => setPropertyAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              {isHindi ? 'संपत्ति का प्रकार (Property Type)' : 'Property Structure Category'}
            </label>
            <select
              value={propertyType}
              onChange={e => setPropertyType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="Independent Residential Floor">Independent Residential Floor / Apartment</option>
              <option value="Independent Villa / Bungalow">Independent Villa / Bungalow</option>
              <option value="Multi-Storey Gated High-Rise Flat">Multi-Storey Gated High-Rise Flat</option>
              <option value="Row House / Duplex">Row House / Duplex</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              {isHindi ? 'घटना का मुख्य कारण (Incident Type / Peril)' : 'Cause of Loss (Covered Peril)'}
            </label>
            <select
              value={incidentType}
              onChange={e => setIncidentType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            >
              {homeKnowledge.incidentOptions.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isHindi ? 'घटना की तारीख (Incident Date)' : 'Date of Loss / Occurrence'}</span>
            </label>
            <input
              type="date"
              required
              value={incidentDate}
              onChange={e => setIncidentDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isHindi ? 'घटना का समय (Incident Time)' : 'Approximate Time of Occurrence'}</span>
            </label>
            <input
              type="time"
              value={incidentTime}
              onChange={e => setIncidentTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Damaged Rooms & Contents */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">
              {isHindi ? '2. क्षतिग्रस्त कमरे व घरेलू सामग्री' : '2. Damaged Rooms, Property & Contents'}
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {affectedRooms.length} rooms selected
          </span>
        </div>

        {/* Room selector chips */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 block">
            {isHindi ? 'प्रभावित कमरे / क्षेत्र चुनें:' : 'Select Affected Rooms / Areas:'}
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              'Living Room & Foyer',
              'Modular Kitchen',
              'Master Bedroom',
              'Guest Bedroom / Kids Room',
              'Bathrooms & Plumbing Shaft',
              'Balcony & Utility Area',
              'Roof / Terrace Slab'
            ].map(room => {
              const isSelected = affectedRooms.includes(room);
              return (
                <button
                  type="button"
                  key={room}
                  onClick={() => toggleRoom(room)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isSelected 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isSelected ? <CheckSquare className="w-3.5 h-3.5 text-cyan-400" /> : <Square className="w-3.5 h-3.5" />}
                  <span>{room}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Itemized Damaged Contents */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-slate-300 block">
            {isHindi ? 'क्षतिग्रस्त वस्तुओं / फिटिंग्स की सूची:' : 'Itemized Damaged Articles, Fixtures & Electronics:'}
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder={isHindi ? 'जैसे: एलजी 1.5 टन एसी, सोफा सेट, सीलिंग फैन...' : 'e.g. Inverter AC Unit, Hardwood TV Unit, Imported Dining Table...'}
              value={newItemInput}
              onChange={e => setNewItemInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addDamagedItem(); } }}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
            <button
              type="button"
              onClick={addDamagedItem}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {damagedItems.map((item, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs flex items-center gap-2"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeDamagedItem(idx)}
                  className="text-rose-400 hover:text-rose-300"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1 pt-2">
          <label className="text-xs font-semibold text-slate-300 block">
            {isHindi ? 'विस्तृत क्षति विवरण (Detailed Damage Narrative):' : 'Detailed Narrative of Damage & How Incident Occurred:'}
          </label>
          <textarea
            rows={3}
            required
            value={incidentDescription}
            onChange={e => setIncidentDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500 leading-relaxed"
            placeholder="Describe the cause, discovery time, and extent of water or structural damage..."
          />
        </div>

        {/* Structural Damage & Police Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-xs font-bold text-white block">Structural Masonry Damage</span>
              <span className="text-[10px] text-slate-400">Load-bearing columns or wall cracking</span>
            </div>
            <input
              type="checkbox"
              checked={structuralDamage}
              onChange={e => setStructuralDamage(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-500"
            />
          </label>

          <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-xs font-bold text-white">Police FIR Logged</span>
              <span className="text-[10px] text-slate-400 block">Required for theft / burglary / arson</span>
            </div>
            <input
              type="checkbox"
              checked={firFiled}
              onChange={e => setFirFiled(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-500"
            />
          </label>
        </div>

        {firFiled && (
          <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-1 animate-in fade-in">
            <label className="text-xs font-semibold text-cyan-300">Police FIR / GD Entry Number & Police Station:</label>
            <input
              type="text"
              placeholder="e.g. FIR-2026/892, Hauz Khas PS, New Delhi"
              value={firNumber}
              onChange={e => setFirNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono"
            />
          </div>
        )}
      </div>

      {/* 4. Repair Cost Estimate & Documents Checklist */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <FileText className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">
            {isHindi ? '3. अनुमानित मरम्मत लागत व अनिवार्य दस्तावेज़' : '3. Estimated Repair Valuation & IRDAI Document Checklist'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isHindi ? 'कुल अनुमानित मरम्मत लागत (₹)' : 'Total Estimated Repair / Replacement (₹)'}</span>
            </label>
            <input
              type="number"
              min={1000}
              max={policy.sumInsured || 15000000}
              value={estimatedCost}
              onChange={e => setEstimatedCost(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-cyan-500 font-mono"
            />
            <span className="text-[10px] text-slate-400 block">
              Compulsory Policy Excess: ₹{policy.deductible.toLocaleString()} (Net Payable: ₹{Math.max(0, estimatedCost - policy.deductible).toLocaleString()})
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isHindi ? 'क्षतिग्रस्त तस्वीरें व साक्ष्य' : 'Photographic Evidence Attached'}</span>
            </label>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-mono">{uploadedPhotos.length} photos ready</span>
              <span className="text-cyan-400 font-bold">+ Upload More</span>
            </div>
          </div>
        </div>

        {/* IRDAI Standard Mandatory Document Checklist */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            {isHindi ? 'भारत गृह रक्षा मानक दस्तावेज़ चेकलिस्ट:' : 'Bharat Griha Raksha Standard Documents Checklist:'}
          </span>

          <div className="space-y-2">
            {homeKnowledge.mandatoryClaimDocuments.map(doc => {
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
          <Home className="w-4 h-4" />
          <span>
            {isSubmitting
              ? (isHindi ? 'गृह क्लेम दर्ज हो रहा है...' : 'Registering Home Claim with Surveyor...')
              : (isHindi ? 'गृह क्लेम दर्ज करें (Submit Home Claim)' : 'Submit Home Insurance Claim')}
          </span>
        </button>
      </div>
    </form>
  );
};

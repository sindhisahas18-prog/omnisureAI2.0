import React, { useState } from 'react';
import { 
  Bike, 
  MapPin, 
  Calendar, 
  Clock, 
  FileText, 
  CheckSquare, 
  Square, 
  ShieldCheck, 
  Gauge, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle,
  Camera
} from 'lucide-react';
import { InsurancePolicy, Language, InsuranceClaim } from '../../types';
import { PolicyCoverageSummaryCard } from './PolicyCoverageSummaryCard';
import { INDIAN_INSURANCE_KNOWLEDGE } from '../../data/indianInsuranceKnowledge';

interface BikeClaimFormProps {
  policy: InsurancePolicy;
  language: Language;
  onSubmit: (claimData: Partial<InsuranceClaim>) => void;
  isSubmitting: boolean;
}

export const BikeClaimForm: React.FC<BikeClaimFormProps> = ({
  policy,
  language,
  onSubmit,
  isSubmitting
}) => {
  const isHindi = language === 'hi';
  const bikeKnowledge = INDIAN_INSURANCE_KNOWLEDGE.bike;

  const defaultBikeModel = policy.bikeDetails ? `${policy.bikeDetails.make} ${policy.bikeDetails.model}` : 'Royal Enfield Classic 350';
  const defaultRegNumber = policy.bikeDetails?.regNumber || 'DL-03-CB-1904';

  const [bikeModel, setBikeModel] = useState<string>(defaultBikeModel);
  const [regNumber, setRegNumber] = useState<string>(defaultRegNumber);
  const [incidentDate, setIncidentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [incidentLocation, setIncidentLocation] = useState<string>('Outer Ring Road near Nehru Place Flyover, New Delhi');
  const [odometerKm, setOdometerKm] = useState<number>(14250);
  const [helmetWorn, setHelmetWorn] = useState<boolean>(true);
  const [pillionPresent, setPillionPresent] = useState<boolean>(false);
  const [estimatedCost, setEstimatedCost] = useState<number>(18500);

  const [incidentDescription, setIncidentDescription] = useState<string>(
    'Motorcycle skidded on wet road while braking to avoid dog. Right crash guard bent, exhaust silencer dented and scraped against asphalt, and front brake lever snapped.'
  );

  const [damagedComponents, setDamagedComponents] = useState<string[]>([
    'Chrome Exhaust Silencer & Heat Shield',
    'Engine Crash Guard & Leg Protector',
    'Handlebar & Front Brake / Clutch Levers'
  ]);

  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'Silencer_Scrape_Damage.jpg',
    'Crash_Guard_Bend_Photo.jpg'
  ]);

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([
    'DOC-BIK-01',
    'DOC-BIK-02',
    'DOC-BIK-03',
    'DOC-BIK-04',
    'DOC-BIK-05'
  ]);

  const toggleComponent = (comp: string) => {
    setDamagedComponents(prev => 
      prev.includes(comp) ? prev.filter(c => c !== comp) : [...prev, comp]
    );
  };

  const toggleDocument = (code: string) => {
    setSelectedDocuments(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const deductible = policy.deductible || 500;
    const netPayout = Math.max(0, estimatedCost - deductible);

    const claimPayload: Partial<InsuranceClaim> = {
      insuranceType: 'bike',
      policyId: policy.id,
      policyNumber: policy.policyNumber,
      policyTitle: policy.title,
      assetName: `${bikeModel} (${regNumber})`,
      incidentDate,
      incidentLocation,
      incidentDescription,
      damagedParts: [],
      photos: uploadedPhotos,
      estimatedAmount: estimatedCost,
      approvedAmount: netPayout,
      deductibleApplied: deductible,
      netPayoutEstimate: netPayout,
      nextStep: 'Authorized Two-Wheeler Workshop deputation & Zero-Depreciation survey approval.',
      questionsAnswered: [
        { question: 'Bike Make & Model', answer: `${bikeModel} (${regNumber})` },
        { question: 'Odometer Reading', answer: `${odometerKm.toLocaleString()} KM` },
        { question: 'ISI Helmet Compliance (MV Act Sec 129)', answer: helmetWorn ? 'Yes, ISI Helmet Worn (Compliant)' : 'No' },
        { question: 'Pillion Passenger Present', answer: pillionPresent ? 'Yes' : 'Solo Rider' },
        { question: 'Damaged Components', answer: damagedComponents.join(', ') }
      ],
      specializedDetails: {
        bikeModel,
        helmetWorn,
        odometerKm
      }
    };

    onSubmit(claimPayload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Policy Coverage Check */}
      <PolicyCoverageSummaryCard policy={policy} language={language} />

      {/* 2. Bike Details & Location */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <Bike className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">
            1. Motorcycle Identity & Accident Location
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Bike Make & Model</label>
            <input
              type="text"
              required
              value={bikeModel}
              onChange={e => setBikeModel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Registration Number</label>
            <input
              type="text"
              required
              value={regNumber}
              onChange={e => setRegNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono uppercase focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Accident Location</span>
            </label>
            <input
              type="text"
              required
              value={incidentLocation}
              onChange={e => setIncidentLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span>Odometer Reading (KM)</span>
            </label>
            <input
              type="number"
              required
              value={odometerKm}
              onChange={e => setOdometerKm(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Helmet Compliance & Pillion */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <label className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-xs font-bold text-white block">ISI Helmet Worn (Section 129 Compliance)</span>
              <span className="text-[10px] text-emerald-400 font-semibold">Motor Vehicles Act Compliant</span>
            </div>
            <input
              type="checkbox"
              checked={helmetWorn}
              onChange={e => setHelmetWorn(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500"
            />
          </label>

          <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-xs font-bold text-white block">Pillion Passenger Present</span>
              <span className="text-[10px] text-slate-400">Covered under co-passenger rider</span>
            </div>
            <input
              type="checkbox"
              checked={pillionPresent}
              onChange={e => setPillionPresent(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-500"
            />
          </label>
        </div>
      </div>

      {/* 3. Damaged Bike Components */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">
            2. Damaged Two-Wheeler Parts Selection
          </h3>
          <span className="text-[11px] font-mono text-cyan-400">{damagedComponents.length} parts marked</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {bikeKnowledge.componentOptions.map(comp => {
            const isSelected = damagedComponents.includes(comp);
            return (
              <button
                type="button"
                key={comp}
                onClick={() => toggleComponent(comp)}
                className={`p-3 rounded-xl text-left border flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-medium">{comp}</span>
                {isSelected ? <CheckCircle2 className="w-4 h-4 text-cyan-400" /> : <Square className="w-4 h-4 text-slate-600" />}
              </button>
            );
          })}
        </div>

        {/* Narrative */}
        <div className="space-y-1 pt-2">
          <label className="text-xs font-semibold text-slate-300 block">Accident Narrative:</label>
          <textarea
            rows={2}
            required
            value={incidentDescription}
            onChange={e => setIncidentDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500 leading-relaxed"
          />
        </div>
      </div>

      {/* 4. Estimate & Documents */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">
            3. Workshop Estimate & Required Documents
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Estimated Repair Bill (₹)</label>
            <input
              type="number"
              min={500}
              value={estimatedCost}
              onChange={e => setEstimatedCost(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-cyan-500 font-mono"
            />
            <span className="text-[10px] text-slate-400">Compulsory Excess: ₹{policy.deductible.toLocaleString()}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Photos of Damaged Bike</span>
              <span className="text-[10px] text-cyan-400 font-mono">{uploadedPhotos.length} photos ready</span>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
              Attached
            </span>
          </div>
        </div>

        {/* Documents */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Mandatory Documents Checklist:
          </span>
          <div className="space-y-2">
            {bikeKnowledge.mandatoryClaimDocuments.map(doc => {
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
          <Bike className="w-4 h-4" />
          <span>
            {isSubmitting
              ? 'Scheduling Workshop Survey & Registering Claim...'
              : 'Submit Two-Wheeler Claim'}
          </span>
        </button>
      </div>
    </form>
  );
};

import React, { useState } from 'react';
import { 
  Activity, 
  MapPin, 
  Calendar, 
  Clock, 
  FileText, 
  CheckSquare, 
  Square, 
  User, 
  Building2, 
  Stethoscope, 
  FileCheck,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { InsurancePolicy, Language, InsuranceClaim } from '../../types';
import { PolicyCoverageSummaryCard } from './PolicyCoverageSummaryCard';
import { INDIAN_INSURANCE_KNOWLEDGE } from '../../data/indianInsuranceKnowledge';

interface AccidentClaimFormProps {
  policy: InsurancePolicy;
  language: Language;
  onSubmit: (claimData: Partial<InsuranceClaim>) => void;
  isSubmitting: boolean;
}

export const AccidentClaimForm: React.FC<AccidentClaimFormProps> = ({
  policy,
  language,
  onSubmit,
  isSubmitting
}) => {
  const isHindi = language === 'hi';
  const accidentKnowledge = INDIAN_INSURANCE_KNOWLEDGE.accident;

  const [claimantName, setClaimantName] = useState<string>(policy.holderName || 'Sahas Sindhi');
  const [incidentDate, setIncidentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [incidentTime, setIncidentTime] = useState<string>('08:45');
  const [incidentLocation, setIncidentLocation] = useState<string>('Ring Road near Moolchand Flyover, New Delhi');

  const [injuryCategory, setInjuryCategory] = useState<string>(
    'Temporary Total Disablement (Bone Fracture & Recommended Bed Rest)'
  );
  const [injuryNature, setInjuryNature] = useState<string>('Right Tibia & Fibula Compound Hairline Fracture');
  const [doctorName, setDoctorName] = useState<string>('Dr. Rajeshwar Sharma, MS (Ortho)');
  const [doctorRegNo, setDoctorRegNo] = useState<string>('DMC-38910');
  const [hospitalClinic, setHospitalClinic] = useState<string>('AIIMS Trauma Centre / Max Healthcare');
  const [daysBedRest, setDaysBedRest] = useState<number>(45);
  const [disabilityPercentage, setDisabilityPercentage] = useState<number>(0);
  const [mlcFirNumber, setMlcFirNumber] = useState<string>('MLC-DEL-2026/89102');

  const [incidentDescription, setIncidentDescription] = useState<string>(
    'Motorbike slipped on slick oil patch near intersection resulting in direct blunt trauma to right lower leg. Admitted to emergency casualty, plaster cast applied, and advised 6 weeks strict non-weight bearing immobilization.'
  );

  const [estimatedCost, setEstimatedCost] = useState<number>(120000);

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([
    'DOC-ACC-01',
    'DOC-ACC-02',
    'DOC-ACC-03',
    'DOC-ACC-05',
    'DOC-ACC-07'
  ]);

  const toggleDocument = (code: string) => {
    setSelectedDocuments(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const deductible = policy.deductible || 0;
    const netPayout = Math.max(0, estimatedCost - deductible);

    const claimPayload: Partial<InsuranceClaim> = {
      insuranceType: 'accident',
      policyId: policy.id,
      policyNumber: policy.policyNumber,
      policyTitle: policy.title,
      assetName: `Personal Accident Cover: ${claimantName} (${injuryNature})`,
      incidentDate,
      incidentLocation,
      incidentDescription,
      damagedParts: [],
      photos: [],
      estimatedAmount: estimatedCost,
      approvedAmount: netPayout,
      deductibleApplied: deductible,
      netPayoutEstimate: netPayout,
      nextStep: 'Medical scrutiny committee auditing attending physician certificate and Medico-Legal record (MLC).',
      questionsAnswered: [
        { question: 'Claimant Insured Name', answer: claimantName },
        { question: 'Injury Benefit Category', answer: injuryCategory },
        { question: 'Specific Nature of Injury', answer: injuryNature },
        { question: 'Attending Physician & Reg No.', answer: `${doctorName} (MCI: ${doctorRegNo})` },
        { question: 'Hospital / Clinic', answer: hospitalClinic },
        { question: 'Advised Bed Rest / Disablement', answer: `${daysBedRest} Days Strict Immobilization` },
        { question: 'Police Medico-Legal Record (MLC)', answer: mlcFirNumber }
      ],
      specializedDetails: {
        accidentDetails: incidentDescription,
        injuryCategory,
        injuryNature,
        doctorName,
        doctorRegNo,
        hospitalClinic,
        daysBedRest,
        disabilityPercentage,
        mlcFirNumber
      }
    };

    onSubmit(claimPayload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Policy Coverage Check */}
      <PolicyCoverageSummaryCard policy={policy} language={language} />

      {/* 2. Incident & Location Details */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">
            1. Accident Circumstances & Incident Location
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Injured Policyholder Name</span>
            </label>
            <input
              type="text"
              required
              value={claimantName}
              onChange={e => setClaimantName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Accident Location & Spot Description</span>
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
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Date of Accident</span>
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
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Time of Accident</span>
            </label>
            <input
              type="time"
              value={incidentTime}
              onChange={e => setIncidentTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Narrative */}
        <div className="space-y-1 pt-1">
          <label className="text-xs font-semibold text-slate-300 block">
            Accident Description & Impact Details:
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

      {/* 3. Injury Classification & Medical Treatment */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <Stethoscope className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">
            2. Injury Category & Medical Certification Details
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-semibold text-slate-300">
              Saral Suraksha Bima Benefit Category Claimed
            </label>
            <select
              value={injuryCategory}
              onChange={e => setInjuryCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="Temporary Total Disablement (Bone Fracture & Recommended Bed Rest)">
                Temporary Total Disablement (TTD - Weekly Cash Allowance for Fracture / Bed Rest)
              </option>
              <option value="Permanent Partial Disablement (Loss of single limb / finger / eye)">
                Permanent Partial Disablement (PPD - Graded Percentage Scale)
              </option>
              <option value="Permanent Total Disablement (Total loss of mobility / sight / paralysis)">
                Permanent Total Disablement (PTD - 100% Capital Sum Insured)
              </option>
              <option value="Accidental In-Patient Hospitalization Medical Expenses">
                Accidental In-Patient Hospitalization Medical Expenses Reimbursement
              </option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Nature of Injury & Anatomical Site</label>
            <input
              type="text"
              required
              value={injuryNature}
              onChange={e => setInjuryNature(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Hospital / Clinic Attended</label>
            <input
              type="text"
              required
              value={hospitalClinic}
              onChange={e => setHospitalClinic(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Attending Doctor & Specialization</label>
            <input
              type="text"
              required
              value={doctorName}
              onChange={e => setDoctorName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Doctor Medical Council Reg No.</label>
            <input
              type="text"
              required
              value={doctorRegNo}
              onChange={e => setDoctorRegNo(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-500 uppercase"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Doctor Advised Bed Rest (Days)</label>
            <input
              type="number"
              min={1}
              max={365}
              value={daysBedRest}
              onChange={e => setDaysBedRest(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Police MLC / FIR Number</label>
            <input
              type="text"
              required
              value={mlcFirNumber}
              onChange={e => setMlcFirNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-500 uppercase"
            />
          </div>
        </div>
      </div>

      {/* 4. Benefit Valuation & Documents */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">
            3. Claim Benefit Amount & Documents Checklist
          </h3>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Total Accidental Claim Benefit Amount (₹)</label>
          <input
            type="number"
            min={1000}
            max={policy.sumInsured || 5000000}
            value={estimatedCost}
            onChange={e => setEstimatedCost(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-cyan-500 font-mono"
          />
          <span className="text-[10px] text-slate-400">Zero deductible applies to Personal Accident policy benefits</span>
        </div>

        {/* Documents */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            IRDAI Saral Suraksha Bima Mandatory Documents Checklist:
          </span>
          <div className="space-y-2">
            {accidentKnowledge.mandatoryClaimDocuments.map(doc => {
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
          <Activity className="w-4 h-4" />
          <span>
            {isSubmitting
              ? 'Auditing Medical Certificate & Registering Claim...'
              : 'Submit Personal Accident Claim'}
          </span>
        </button>
      </div>
    </form>
  );
};

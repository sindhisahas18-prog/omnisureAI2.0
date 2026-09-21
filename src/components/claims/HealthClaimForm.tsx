import React, { useState } from 'react';
import { 
  HeartPulse, 
  Building2, 
  Calendar, 
  User, 
  FileText, 
  CheckSquare, 
  Square, 
  DollarSign, 
  CreditCard, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { InsurancePolicy, Language, InsuranceClaim } from '../../types';
import { PolicyCoverageSummaryCard } from './PolicyCoverageSummaryCard';
import { INDIAN_INSURANCE_KNOWLEDGE } from '../../data/indianInsuranceKnowledge';

interface HealthClaimFormProps {
  policy: InsurancePolicy;
  language: Language;
  onSubmit: (claimData: Partial<InsuranceClaim>) => void;
  isSubmitting: boolean;
}

export const HealthClaimForm: React.FC<HealthClaimFormProps> = ({
  policy,
  language,
  onSubmit,
  isSubmitting
}) => {
  const isHindi = language === 'hi';
  const healthKnowledge = INDIAN_INSURANCE_KNOWLEDGE.health;

  const [patientName, setPatientName] = useState<string>(policy.holderName || 'Sahas Sindhi');
  const [hospitalName, setHospitalName] = useState<string>('Max Super Speciality Hospital, Saket, New Delhi');
  const [ailment, setAilment] = useState<string>('Acute Dengue Hemorrhagic Fever with Severe Thrombocytopenia');
  const [isCashless, setIsCashless] = useState<boolean>(true);
  const [roomCategory, setRoomCategory] = useState<string>('Single Private AC Room (Zero Capping)');
  const [admissionDate, setAdmissionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dischargeDate, setDischargeDate] = useState<string>('2026-08-22');
  const [tpaPreAuthId, setTpaPreAuthId] = useState<string>('MAX-TPA-992140');
  const [estimatedCost, setEstimatedCost] = useState<number>(88500);

  const [incidentDescription, setIncidentDescription] = useState<string>(
    'Patient admitted to emergency care with high fever, vomiting, and platelet drop to 32,000/mcL. Managed with continuous IV fluid hydration, platelet monitoring, and supportive therapy in Single Private AC Room.'
  );

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([
    'DOC-HLT-01',
    'DOC-HLT-02',
    'DOC-HLT-03',
    'DOC-HLT-04',
    'DOC-HLT-05'
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
      insuranceType: 'health',
      policyId: policy.id,
      policyNumber: policy.policyNumber,
      policyTitle: policy.title,
      assetName: `Patient: ${patientName} (${hospitalName.split(',')[0]})`,
      incidentDate: admissionDate,
      incidentLocation: hospitalName,
      incidentDescription,
      damagedParts: [],
      photos: [],
      estimatedAmount: estimatedCost,
      approvedAmount: netPayout,
      deductibleApplied: deductible,
      netPayoutEstimate: netPayout,
      nextStep: isCashless 
        ? 'TPA Desk pre-authorization guarantee letter transmitted to Max Super Speciality billing desk.'
        : 'Reimbursement dossier under medical audit for direct NEFT settlement.',
      questionsAnswered: [
        { question: 'Patient Full Name', answer: patientName },
        { question: 'Network Hospital', answer: hospitalName },
        { question: 'Primary Medical Diagnosis', answer: ailment },
        { question: 'Settlement Mode', answer: isCashless ? 'Direct Cashless at TPA Desk' : 'Reimbursement Claim' },
        { question: 'Room Category', answer: roomCategory },
        { question: 'Admission to Discharge', answer: `${admissionDate} to ${dischargeDate}` }
      ],
      specializedDetails: {
        hospitalName,
        patientName,
        ailment,
        isCashless,
        roomCategory,
        admissionDate,
        dischargeDate,
        tpaPreAuthId: isCashless ? tpaPreAuthId : undefined
      }
    };

    onSubmit(claimPayload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Policy Coverage Check */}
      <PolicyCoverageSummaryCard policy={policy} language={language} />

      {/* 2. Hospital & Patient Details */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <Building2 className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">
            1. Hospitalization & Medical Diagnosis Information
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Patient Name</span>
            </label>
            <input
              type="text"
              required
              value={patientName}
              onChange={e => setPatientName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hospital Name & Location</span>
            </label>
            <input
              type="text"
              required
              value={hospitalName}
              onChange={e => setHospitalName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-semibold text-slate-300">Diagnosis / Chief Complaint</label>
            <input
              type="text"
              required
              value={ailment}
              onChange={e => setAilment(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Room Category Occupied</label>
            <select
              value={roomCategory}
              onChange={e => setRoomCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="Single Private AC Room (Zero Capping)">Single Private AC Room (Zero Capping)</option>
              <option value="Twin Sharing AC Room">Twin Sharing AC Room</option>
              <option value="Deluxe Suite Room">Deluxe Suite Room</option>
              <option value="Intensive Care Unit (ICU)">Intensive Care Unit (ICU)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Settlement Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsCashless(true)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  isCashless
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Cashless TPA Desk
              </button>
              <button
                type="button"
                onClick={() => setIsCashless(false)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  !isCashless
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                Reimbursement
              </button>
            </div>
          </div>
        </div>

        {/* Admission Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admission Date</span>
            </label>
            <input
              type="date"
              required
              value={admissionDate}
              onChange={e => setAdmissionDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Discharge Date (Expected / Actual)</span>
            </label>
            <input
              type="date"
              value={dischargeDate}
              onChange={e => setDischargeDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Clinical Summary & Cost Valuation */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <FileText className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">
            2. Clinical Summary & Hospital Expenses
          </h3>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300 block">
            Clinical Treatment Summary & Progress Notes:
          </label>
          <textarea
            rows={2}
            required
            value={incidentDescription}
            onChange={e => setIncidentDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Estimated Total Hospital Bill (₹)</label>
            <input
              type="number"
              min={1000}
              value={estimatedCost}
              onChange={e => setEstimatedCost(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-emerald-500 font-mono"
            />
            <span className="text-[10px] text-slate-400">Zero Room Rent Capping applies (100% admissible)</span>
          </div>

          {isCashless && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Hospital TPA Desk Pre-Auth Ref No.</label>
              <input
                type="text"
                value={tpaPreAuthId}
                onChange={e => setTpaPreAuthId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono uppercase focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}
        </div>

        {/* Documents */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            IRDAI Health Insurance Claim Required Documents:
          </span>
          <div className="space-y-2">
            {healthKnowledge.mandatoryClaimDocuments.map(doc => {
              const isChecked = selectedDocuments.includes(doc.code);
              return (
                <div
                  key={doc.code}
                  onClick={() => toggleDocument(doc.code)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-slate-900 border-emerald-500/40 text-slate-200'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
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
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
        >
          <HeartPulse className="w-4 h-4" />
          <span>
            {isSubmitting
              ? 'Transmitting Pre-Auth Guarantee to TPA Desk...'
              : 'Submit Health Insurance Claim'}
          </span>
        </button>
      </div>
    </form>
  );
};

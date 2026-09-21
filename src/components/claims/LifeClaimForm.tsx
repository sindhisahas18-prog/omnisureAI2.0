import React, { useState } from 'react';
import { 
  Heart, 
  User, 
  Calendar, 
  FileText, 
  CheckSquare, 
  Square, 
  Building, 
  CreditCard, 
  Phone, 
  ShieldCheck, 
  DollarSign, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { InsurancePolicy, Language, InsuranceClaim } from '../../types';
import { PolicyCoverageSummaryCard } from './PolicyCoverageSummaryCard';
import { INDIAN_INSURANCE_KNOWLEDGE } from '../../data/indianInsuranceKnowledge';

interface LifeClaimFormProps {
  policy: InsurancePolicy;
  language: Language;
  onSubmit: (claimData: Partial<InsuranceClaim>) => void;
  isSubmitting: boolean;
}

export const LifeClaimForm: React.FC<LifeClaimFormProps> = ({
  policy,
  language,
  onSubmit,
  isSubmitting
}) => {
  const isHindi = language === 'hi';
  const lifeKnowledge = INDIAN_INSURANCE_KNOWLEDGE.life;

  const [lifeAssuredName, setLifeAssuredName] = useState<string>(policy.holderName || 'Late Shri Vikram Sindhi');
  const [demiseDate, setDemiseDate] = useState<string>('2026-07-14');
  const [causeOfDeath, setCauseOfDeath] = useState<string>('Sudden Acute Myocardial Infarction (Hospital In-Patient)');
  const [placeOfDeath, setPlaceOfDeath] = useState<string>('Max Super Speciality Hospital, Saket, New Delhi');
  const [deathCertificateNo, setDeathCertificateNo] = useState<string>('NDMC-D-2026-09281');

  // Nominee Details
  const [nomineeName, setNomineeName] = useState<string>('Smt. Ananya Sindhi');
  const [nomineeRelation, setNomineeRelation] = useState<string>('Spouse / Legal Wife (Primary Nominee)');
  const [nomineeContact, setNomineeContact] = useState<string>('+91 98101 23456');
  const [nomineePan, setNomineePan] = useState<string>('ABCPS8912E');
  const [nomineeBankAccount, setNomineeBankAccount] = useState<string>('50100492810921');
  const [bankIfscCode, setBankIfscCode] = useState<string>('HDFC0000043');
  const [claimantStatementSigned, setClaimantStatementSigned] = useState<boolean>(true);

  const [sumAssuredPayout, setSumAssuredPayout] = useState<number>(policy.sumInsured || 10000000);

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([
    'DOC-LIF-01',
    'DOC-LIF-02',
    'DOC-LIF-03',
    'DOC-LIF-04',
    'DOC-LIF-06',
    'DOC-LIF-07'
  ]);

  const toggleDocument = (code: string) => {
    setSelectedDocuments(prev => 
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const claimPayload: Partial<InsuranceClaim> = {
      insuranceType: 'life',
      policyId: policy.id,
      policyNumber: policy.policyNumber,
      policyTitle: policy.title,
      assetName: `Life Cover: ${lifeAssuredName} (Nominee: ${nomineeName})`,
      incidentDate: demiseDate,
      incidentLocation: placeOfDeath,
      incidentDescription: `Death Claim Intimation for Life Assured ${lifeAssuredName} who passed away on ${demiseDate}. Cause: ${causeOfDeath}. Claim initiated by registered nominee ${nomineeName} (${nomineeRelation}).`,
      damagedParts: [],
      photos: [],
      estimatedAmount: sumAssuredPayout,
      approvedAmount: sumAssuredPayout,
      deductibleApplied: 0,
      netPayoutEstimate: sumAssuredPayout,
      nextStep: 'Section 45 Statutory Scrutiny & fast-track National Claims Committee review for direct NEFT payout.',
      questionsAnswered: [
        { question: 'Life Assured Name', answer: lifeAssuredName },
        { question: 'Date of Demise', answer: demiseDate },
        { question: 'Cause of Demise', answer: causeOfDeath },
        { question: 'Municipal Death Certificate No.', answer: deathCertificateNo },
        { question: 'Claimant / Nominee Name', answer: nomineeName },
        { question: 'Relationship to Life Assured', answer: nomineeRelation },
        { question: 'Nominee PAN Card', answer: nomineePan },
        { question: 'Settlement Bank Account & IFSC', answer: `${nomineeBankAccount} (${bankIfscCode})` }
      ],
      specializedDetails: {
        demiseDate,
        causeOfDeath,
        placeOfDeath,
        deathCertificateNo,
        nomineeName,
        nomineeRelation,
        nomineeContact,
        nomineePan,
        nomineeBankAccount,
        bankIfscCode,
        claimantStatementSigned
      }
    };

    onSubmit(claimPayload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Policy Coverage Check */}
      <PolicyCoverageSummaryCard policy={policy} language={language} />

      {/* 2. Life Assured & Demise Details */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <Heart className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">
            1. Life Assured & Event Information
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Name of Deceased Life Assured</label>
            <input
              type="text"
              required
              value={lifeAssuredName}
              onChange={e => setLifeAssuredName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Date of Demise</span>
            </label>
            <input
              type="date"
              required
              value={demiseDate}
              onChange={e => setDemiseDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-semibold text-slate-300">Cause of Demise</label>
            <select
              value={causeOfDeath}
              onChange={e => setCauseOfDeath(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="Sudden Acute Myocardial Infarction (Hospital In-Patient)">
                Sudden Acute Myocardial Infarction / Cardiac Arrest (Hospital Demise)
              </option>
              <option value="Natural Demise due to Age / Terminal Organ Failure">
                Natural Demise due to Advanced Age / Organ Failure at Residence
              </option>
              <option value="Road Traffic / Vehicular Accident (Double Accident Rider Applies)">
                Road Traffic / Vehicular Accident (Double Accident Benefit Rider Applies)
              </option>
              <option value="Advanced Oncological Illness / Cancer">
                Advanced Oncological Complications / Cancer
              </option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Place of Demise / Hospital Name</label>
            <input
              type="text"
              required
              value={placeOfDeath}
              onChange={e => setPlaceOfDeath(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Municipal Death Certificate Registration No.</label>
            <input
              type="text"
              required
              value={deathCertificateNo}
              onChange={e => setDeathCertificateNo(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono uppercase focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Nominee & NEFT Settlement Details */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <User className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">
            2. Beneficiary / Nominee & NEFT Payout Mandate
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Registered Nominee Full Name</label>
            <input
              type="text"
              required
              value={nomineeName}
              onChange={e => setNomineeName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Relationship to Life Assured</label>
            <input
              type="text"
              required
              value={nomineeRelation}
              onChange={e => setNomineeRelation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Phone className="w-3 h-3 text-cyan-400" />
              <span>Nominee Mobile Number</span>
            </label>
            <input
              type="tel"
              required
              value={nomineeContact}
              onChange={e => setNomineeContact(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Nominee PAN Card Number</label>
            <input
              type="text"
              required
              maxLength={10}
              value={nomineePan}
              onChange={e => setNomineePan(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono uppercase focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-cyan-400" />
              <span>Nominee Bank Account Number (for NEFT)</span>
            </label>
            <input
              type="text"
              required
              value={nomineeBankAccount}
              onChange={e => setNomineeBankAccount(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Bank IFSC Code</label>
            <input
              type="text"
              required
              maxLength={11}
              value={bankIfscCode}
              onChange={e => setBankIfscCode(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono uppercase focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Declaration */}
        <label className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3 cursor-pointer mt-2">
          <input
            type="checkbox"
            required
            checked={claimantStatementSigned}
            onChange={e => setClaimantStatementSigned(e.target.checked)}
            className="w-4 h-4 rounded text-cyan-500 mt-0.5"
          />
          <span className="text-xs text-slate-300 leading-relaxed">
            I hereby declare that I am the bonafide registered nominee / legal heir of the Life Assured under Section 45 of Insurance Act, 1938 and all statement details and death certificate credentials provided are authentic.
          </span>
        </label>
      </div>

      {/* 4. Sum Assured & Documents */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">
            3. Capital Sum Assured Payout & Mandated Documents
          </h3>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block">Total Guaranteed Capital Sum Assured</span>
            <span className="text-xl font-bold text-white font-mono">₹{sumAssuredPayout.toLocaleString()}</span>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            Direct NEFT (No Tax Deduction)
          </span>
        </div>

        {/* Documents Checklist */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Statutory Death Claim Documents Checklist:
          </span>
          <div className="space-y-2">
            {lifeKnowledge.mandatoryClaimDocuments.map(doc => {
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
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-bold text-sm shadow-xl shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
        >
          <Heart className="w-4 h-4" />
          <span>
            {isSubmitting
              ? 'Registering Priority Nominee Claim...'
              : 'Register Life Insurance Claim'}
          </span>
        </button>
      </div>
    </form>
  );
};

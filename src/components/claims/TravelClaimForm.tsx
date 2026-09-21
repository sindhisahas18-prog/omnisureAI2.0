import React, { useState } from 'react';
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Clock, 
  FileText, 
  CheckSquare, 
  Square, 
  Luggage, 
  AlertCircle, 
  CheckCircle2,
  DollarSign,
  Building2,
  Ticket
} from 'lucide-react';
import { InsurancePolicy, Language, InsuranceClaim } from '../../types';
import { PolicyCoverageSummaryCard } from './PolicyCoverageSummaryCard';
import { INDIAN_INSURANCE_KNOWLEDGE } from '../../data/indianInsuranceKnowledge';

interface TravelClaimFormProps {
  policy: InsurancePolicy;
  language: Language;
  onSubmit: (claimData: Partial<InsuranceClaim>) => void;
  isSubmitting: boolean;
}

export const TravelClaimForm: React.FC<TravelClaimFormProps> = ({
  policy,
  language,
  onSubmit,
  isSubmitting
}) => {
  const isHindi = language === 'hi';
  const travelKnowledge = INDIAN_INSURANCE_KNOWLEDGE.travel;

  const [originCity, setOriginCity] = useState<string>('New Delhi (DEL - Indira Gandhi Intl)');
  const [destinationCountry, setDestinationCountry] = useState<string>('France (Paris)');
  const [destinationCity, setDestinationCity] = useState<string>('Paris Charles de Gaulle (CDG)');
  const [airlineCarrier, setAirlineCarrier] = useState<string>('Air France (Flight AF-225)');
  const [pnrNumber, setPnrNumber] = useState<string>('AF782910');
  const [carrierPIRNumber, setCarrierPIRNumber] = useState<string>('CDGAF88192');

  const [travelLossType, setTravelLossType] = useState<string>(travelKnowledge.incidentOptions[0]);
  const [incidentDate, setIncidentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [departureDate, setDepartureDate] = useState<string>('2026-08-10');
  const [returnDate, setReturnDate] = useState<string>('2026-08-25');
  const [delayHours, setDelayHours] = useState<number>(18);
  const [estimatedCost, setEstimatedCost] = useState<number>(48500);

  const [incidentDescription, setIncidentDescription] = useState<string>(
    'Checked-in baggage tagged from DEL did not arrive on baggage carousel at Paris CDG. Airline ground staff issued Property Irregularity Report (PIR) CDGAF88192 confirming bag is delayed in Frankfurt transit.'
  );

  const [baggageItems, setBaggageItems] = useState<string[]>([
    'Delsey Hardcase 28" Luggage Bag',
    'Winter Coat & Formal Business Suit',
    'Prescription Medications & Toiletries'
  ]);

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([
    'DOC-TRV-01',
    'DOC-TRV-02',
    'DOC-TRV-03',
    'DOC-TRV-04',
    'DOC-TRV-06',
    'DOC-TRV-07'
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
      insuranceType: 'travel',
      policyId: policy.id,
      policyNumber: policy.policyNumber,
      policyTitle: policy.title,
      assetName: `Travel Policy: ${destinationCountry} (${travelLossType})`,
      incidentDate,
      incidentLocation: `${destinationCity}, ${destinationCountry}`,
      incidentDescription,
      damagedParts: [],
      photos: [],
      estimatedAmount: estimatedCost,
      approvedAmount: netPayout,
      deductibleApplied: deductible,
      netPayoutEstimate: netPayout,
      nextStep: 'Overseas Assistance Desk verifying airline carrier Property Irregularity Report (PIR) & boarding pass.',
      questionsAnswered: [
        { question: 'Route & Destination', answer: `${originCity} to ${destinationCountry}` },
        { question: 'Airline & Flight No.', answer: `${airlineCarrier} (PNR: ${pnrNumber})` },
        { question: 'Disruption / Incident Type', answer: travelLossType },
        { question: 'Carrier PIR / Delay Reference', answer: carrierPIRNumber },
        { question: 'Duration of Delay', answer: `${delayHours} Hours` },
        { question: 'Baggage Items / Lost Effects', answer: baggageItems.join(', ') },
        { question: 'Travel Period', answer: `${departureDate} to ${returnDate}` }
      ],
      specializedDetails: {
        originCity,
        destinationCountry,
        destinationCity,
        airlineCarrier,
        pnrNumber,
        carrierPIRNumber,
        travelLossType,
        departureDate,
        returnDate,
        delayHours,
        baggageItemsLost: baggageItems
      }
    };

    onSubmit(claimPayload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Policy Coverage Check */}
      <PolicyCoverageSummaryCard policy={policy} language={language} />

      {/* 2. Flight & Trip Details */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <Plane className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">
            {isHindi ? '1. यात्रा व उड़ान का विवरण (Trip & Carrier Details)' : '1. Flight, Route & Common Carrier Details'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              {isHindi ? 'प्रस्थान शहर / हवाई अड्डा (Origin City)' : 'Departure Airport / Origin City'}
            </label>
            <input
              type="text"
              required
              value={originCity}
              onChange={e => setOriginCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              {isHindi ? 'गंतव्य देश व शहर (Destination)' : 'Destination Country & City / Airport'}
            </label>
            <input
              type="text"
              required
              value={destinationCountry}
              onChange={e => setDestinationCountry(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              {isHindi ? 'एयरलाइन व उड़ान संख्या (Airline & Flight)' : 'Airline Carrier & Flight Number'}
            </label>
            <input
              type="text"
              required
              value={airlineCarrier}
              onChange={e => setAirlineCarrier(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              {isHindi ? 'पीएनआर / टिकट नंबर (PNR Booking Ref)' : 'Airline PNR / E-Ticket Number'}
            </label>
            <input
              type="text"
              required
              value={pnrNumber}
              onChange={e => setPnrNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono uppercase"
            />
          </div>
        </div>

        {/* Travel Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Departure Date</label>
            <input
              type="date"
              value={departureDate}
              onChange={e => setDepartureDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Incident Date</label>
            <input
              type="date"
              value={incidentDate}
              onChange={e => setIncidentDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Scheduled Return Date</label>
            <input
              type="date"
              value={returnDate}
              onChange={e => setReturnDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
            />
          </div>
        </div>
      </div>

      {/* 3. Incident & Loss Details */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <Luggage className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">
            {isHindi ? '2. यात्रा व्यवधान / सामान क्षति विवरण' : '2. Travel Disruption, Baggage or Medical Details'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1 sm:col-span-2">
            <label className="text-xs font-semibold text-slate-300">
              {isHindi ? 'दावे का प्रकार (Claim Category)' : 'Nature of Travel Claim Event'}
            </label>
            <select
              value={travelLossType}
              onChange={e => setTravelLossType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
            >
              {travelKnowledge.incidentOptions.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              {isHindi ? 'एयरलाइन पीआईआर नंबर (Property Irregularity Report)' : 'Airline PIR / Delay Certificate Ref No.'}
            </label>
            <input
              type="text"
              required
              placeholder="e.g. CDGAF88192 or DELAI90412"
              value={carrierPIRNumber}
              onChange={e => setCarrierPIRNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono uppercase"
            />
            <span className="text-[10px] text-slate-400">Issued at airline airport baggage / transit counter</span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              {isHindi ? 'देरी की कुल अवधि (घंटे)' : 'Duration of Delay / Misplacement (Hours)'}
            </label>
            <input
              type="number"
              min={1}
              value={delayHours}
              onChange={e => setDelayHours(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        {/* Narrative */}
        <div className="space-y-1 pt-1">
          <label className="text-xs font-semibold text-slate-300 block">
            {isHindi ? 'विस्तृत घटना विवरण:' : 'Detailed Incident Narrative & Circumstances:'}
          </label>
          <textarea
            rows={3}
            required
            value={incidentDescription}
            onChange={e => setIncidentDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500 leading-relaxed"
          />
        </div>
      </div>

      {/* 4. Financial Reimbursement & Documents */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white font-['Outfit'] uppercase tracking-wider">
            {isHindi ? '3. आपातकालीन खर्च व आवश्यक दस्तावेज़' : '3. Essential Expenses Claimed & Document Checklist'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              {isHindi ? 'कुल क्लेम राशि (₹)' : 'Total Incurred / Claim Amount (₹)'}
            </label>
            <input
              type="number"
              min={500}
              max={policy.sumInsured || 4200000}
              value={estimatedCost}
              onChange={e => setEstimatedCost(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-cyan-500 font-mono"
            />
            <span className="text-[10px] text-slate-400">Zero policy excess applies to global travel claims</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-[11px] text-cyan-400 font-bold block">Assistance Hotline</span>
            <p className="text-[10px] text-slate-400">
              24x7 Overseas Medical & Baggage Desk: +91 1800 266 7780 (Toll-Free Worldwide)
            </p>
          </div>
        </div>

        {/* Documents Checklist */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            {isHindi ? 'यात्रा दावा अनिवार्य दस्तावेज़ चेकलिस्ट:' : 'Tata AIG / HDFC ERGO Travel Claim Required Documents:'}
          </span>

          <div className="space-y-2">
            {travelKnowledge.mandatoryClaimDocuments.map(doc => {
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
          <Plane className="w-4 h-4" />
          <span>
            {isSubmitting
              ? (isHindi ? 'यात्रा क्लेम दर्ज हो रहा है...' : 'Verifying Airline PIR & Registering Claim...')
              : (isHindi ? 'यात्रा क्लेम दर्ज करें (Submit Travel Claim)' : 'Submit Travel Insurance Claim')}
          </span>
        </button>
      </div>
    </form>
  );
};

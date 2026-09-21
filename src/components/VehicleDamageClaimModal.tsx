import React, { useState } from 'react';
import { 
  X, 
  Car, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Camera, 
  Upload, 
  Sparkles, 
  ArrowRight, 
  ChevronLeft, 
  ShieldCheck, 
  HelpCircle,
  FileCheck,
  RotateCcw,
  Sliders,
  Layers,
  MapPin
} from 'lucide-react';
import { 
  InsurancePolicy, 
  PartDamageRecord, 
  DamageType, 
  DamageSeverity, 
  Language, 
  DynamicClaimQuestion 
} from '../types';
import { 
  VEHICLE_PARTS, 
  SAMPLE_DAMAGE_PHOTOS, 
  DYNAMIC_QUESTIONS_DICTIONARY 
} from '../data/insuranceData';

interface VehicleDamageClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  policies: InsurancePolicy[];
  initialPolicyId?: string;
  language: Language;
  onClaimSubmitted: (newClaim: any) => void;
}

export const VehicleDamageClaimModal: React.FC<VehicleDamageClaimModalProps> = ({
  isOpen,
  onClose,
  policies,
  initialPolicyId,
  language,
  onClaimSubmitted
}) => {
  // Step workflow: 1: Policy & Incident Info -> 2: Interactive Damage Map -> 3: Evidence & AI Vision -> 4: Smart Questions -> 5: Summary & Submit
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Selected Policy
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>(
    initialPolicyId || (policies.find(p => p.type === 'motor')?.id || policies[0]?.id || '')
  );

  // Accident Info
  const [incidentDate, setIncidentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [incidentTime, setIncidentTime] = useState<string>('14:30');
  const [incidentLocation, setIncidentLocation] = useState<string>('Connaught Place, New Delhi');
  const [incidentDescription, setIncidentDescription] = useState<string>(
    'Minor multi-car collision at traffic signal during stop-and-go congestion.'
  );

  // Selected damaged parts map: Record<partId, PartDamageRecord>
  const [damagedPartsMap, setDamagedPartsMap] = useState<Record<string, PartDamageRecord>>({
    front_bumper: {
      partId: 'front_bumper',
      partName: 'Front Bumper',
      partNameHi: 'फ्रंट बम्पर',
      damageType: 'Dented',
      severity: 'Moderate',
      coverageStatus: 'covered',
      coverageReason: 'Zero-Depreciation rider covers 100% replacement without plastic depreciation.',
      photos: []
    }
  });

  // Active currently inspecting part (for popup/panel)
  const [activeInspectingPartId, setActiveInspectingPartId] = useState<string>('front_bumper');

  // Filter category in diagram
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  // Photo analysis state
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState<boolean>(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

  // Dynamic Questions state
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentPolicy = policies.find(p => p.id === selectedPolicyId) || policies[0];

  // Helper to check policy coverage for a part
  const evaluateCoverage = (partId: string) => {
    if (!currentPolicy) {
      return {
        status: 'requires_verification' as const,
        reason: 'Policy document verification needed.'
      };
    }

    const rule = currentPolicy.partCoverageRules?.[partId];
    if (rule) {
      return {
        status: rule.status,
        reason: rule.reason
      };
    }

    // Default check
    const isCovered = currentPolicy.coveredPartIds?.includes(partId);
    if (isCovered) {
      return {
        status: 'covered' as const,
        reason: `Eligible for claim review under ${currentPolicy.title}. Deductible: ₹${currentPolicy.deductible}.`
      };
    }

    return {
      status: 'not_covered' as const,
      reason: `Component is not endorsed or is subject to wear-and-tear exclusions under this policy.`
    };
  };

  // Toggle or select part in the interactive diagram
  const handlePartClick = (partId: string) => {
    setActiveInspectingPartId(partId);
    
    // If not yet in damagedPartsMap, initialize it
    if (!damagedPartsMap[partId]) {
      const partDef = VEHICLE_PARTS.find(p => p.id === partId);
      const coverage = evaluateCoverage(partId);
      
      setDamagedPartsMap(prev => ({
        ...prev,
        [partId]: {
          partId,
          partName: partDef?.name || partId,
          partNameHi: partDef?.nameHi,
          damageType: 'Damaged',
          severity: 'Moderate',
          coverageStatus: coverage.status,
          coverageReason: coverage.reason,
          photos: []
        }
      }));
    }
  };

  const removeDamagedPart = (partId: string) => {
    setDamagedPartsMap(prev => {
      const updated = { ...prev };
      delete updated[partId];
      return updated;
    });
    const remainingIds = Object.keys(damagedPartsMap).filter(id => id !== partId);
    if (remainingIds.length > 0) {
      setActiveInspectingPartId(remainingIds[0]);
    }
  };

  const updateActivePartDamageType = (type: DamageType) => {
    if (!activeInspectingPartId) return;
    if (type === 'Not damaged') {
      removeDamagedPart(activeInspectingPartId);
      return;
    }
    setDamagedPartsMap(prev => ({
      ...prev,
      [activeInspectingPartId]: {
        ...prev[activeInspectingPartId],
        damageType: type
      }
    }));
  };

  const updateActivePartSeverity = (severity: DamageSeverity) => {
    if (!activeInspectingPartId) return;
    setDamagedPartsMap(prev => ({
      ...prev,
      [activeInspectingPartId]: {
        ...prev[activeInspectingPartId],
        severity
      }
    }));
  };

  // Handle Photo Upload / AI Analysis
  const handlePhotoUpload = async (photoUrl: string) => {
    if (!activeInspectingPartId) return;
    
    // Add photo to uploaded list
    setUploadedPhotos(prev => [...prev, photoUrl]);
    
    setDamagedPartsMap(prev => ({
      ...prev,
      [activeInspectingPartId]: {
        ...prev[activeInspectingPartId],
        photos: [...(prev[activeInspectingPartId]?.photos || []), photoUrl]
      }
    }));

    // Trigger AI Vision Inspection
    setIsAnalyzingPhoto(true);
    try {
      const res = await fetch('/api/ai/damage-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partId: activeInspectingPartId,
          partName: damagedPartsMap[activeInspectingPartId]?.partName,
          photoBase64: photoUrl
        })
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        setDamagedPartsMap(prev => ({
          ...prev,
          [activeInspectingPartId]: {
            ...prev[activeInspectingPartId],
            severity: data.analysis.estimatedSeverity || prev[activeInspectingPartId].severity,
            aiAnalysis: data.analysis
          }
        }));
      }
    } catch (err) {
      console.warn('AI Vision inspection error:', err);
    } finally {
      setIsAnalyzingPhoto(false);
    }
  };

  // Compute Dynamic Questions for selected parts
  const selectedPartIds = Object.keys(damagedPartsMap);
  const relevantQuestions: DynamicClaimQuestion[] = [];
  selectedPartIds.forEach(pId => {
    if (DYNAMIC_QUESTIONS_DICTIONARY[pId]) {
      relevantQuestions.push(...DYNAMIC_QUESTIONS_DICTIONARY[pId]);
    }
  });

  // Coverage counts
  const partsArray: PartDamageRecord[] = Object.values(damagedPartsMap) as PartDamageRecord[];
  const coveredCount = partsArray.filter(p => p.coverageStatus === 'covered').length;
  const verificationCount = partsArray.filter(p => p.coverageStatus === 'requires_verification').length;
  const notCoveredCount = partsArray.filter(p => p.coverageStatus === 'not_covered').length;

  // Estimated calculation
  const baseEstimatedRepair = partsArray.reduce((acc: number, part: PartDamageRecord) => {
    let cost = 6500;
    if (part.partId.includes('bumper')) cost = 12000;
    if (part.partId.includes('windshield')) cost = 14500;
    if (part.partId.includes('headlight')) cost = 18000;
    if (part.partId.includes('door')) cost = 9500;
    if (part.severity === 'Severe') cost *= 1.4;
    if (part.severity === 'Minor') cost *= 0.6;
    return acc + cost;
  }, 0);

  const policyDeductible = currentPolicy?.deductible || 1000;
  const netEstimatedPayout = Math.max(0, baseEstimatedRepair - policyDeductible);

  // Submit Claim
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const claimPayload = {
        policyId: currentPolicy.id,
        policyNumber: currentPolicy.policyNumber,
        policyTitle: currentPolicy.title,
        vehicleName: `${currentPolicy.vehicleDetails?.make || 'Vehicle'} ${currentPolicy.vehicleDetails?.model || ''}`,
        regNumber: currentPolicy.vehicleDetails?.regNumber || 'DL-01-AX-9921',
        incidentDate,
        incidentLocation,
        incidentDescription,
        damagedParts: partsArray,
        photos: uploadedPhotos,
        estimatedAmount: Math.round(baseEstimatedRepair),
        approvedAmount: Math.round(netEstimatedPayout),
        deductibleApplied: policyDeductible,
        netPayoutEstimate: Math.round(netEstimatedPayout),
        nextStep: 'Tele-inspection surveyor report being matched with network cashless garage.',
        questionsAnswered: Object.entries(answeredQuestions).map(([qId, ans]) => {
          const qObj = relevantQuestions.find(q => q.id === qId);
          return {
            question: qObj ? (language === 'hi' ? qObj.questionHi : qObj.questionEn) : qId,
            answer: ans
          };
        })
      };

      const res = await fetch('/api/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claimPayload)
      });
      const data = await res.json();
      if (data.success) {
        onClaimSubmitted(data.claim);
        onClose();
      }
    } catch (err) {
      console.error('Failed to submit claim:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activePart = damagedPartsMap[activeInspectingPartId] || null;
  const inspectingPartDef = VEHICLE_PARTS.find(p => p.id === activeInspectingPartId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-['Outfit']">
                  {language === 'hi' ? 'स्मार्ट वाहन डैमेज रिपोर्टिंग व क्लेम' : 'Smart Vehicle Damage Inspection & FNOL'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold">
                  OMNISURE SIGNATURE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'hi' 
                  ? 'कार डायग्राम पर सीधे क्लिक करें और क्षतिग्रस्त हिस्सों को दिखाएँ'
                  : 'Visually select damaged parts directly on the interactive vehicle blueprint'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="px-6 py-2.5 bg-slate-900/90 border-b border-slate-800/50 flex items-center justify-between overflow-x-auto text-xs">
          {[
            { num: 1, labelEn: '1. Policy & Incident', labelHi: '१. पॉलिसी व दुर्घटना' },
            { num: 2, labelEn: '2. Interactive Damage Map', labelHi: '२. डैमेज मैप' },
            { num: 3, labelEn: '3. Photo & AI Analysis', labelHi: '३. फोटो व AI जांच' },
            { num: 4, labelEn: '4. Dynamic Questions', labelHi: '४. क्लेम प्रश्न' },
            { num: 5, labelEn: '5. Summary & Submit', labelHi: '५. समरी व सबमिट' }
          ].map(s => (
            <button
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all whitespace-nowrap ${
                currentStep === s.num
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : currentStep > s.num
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-500'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                currentStep === s.num ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {s.num}
              </span>
              <span>{language === 'hi' ? s.labelHi : s.labelEn}</span>
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ----------------- STEP 1: POLICY & INCIDENT INFO ----------------- */}
          {currentStep === 1 && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  {language === 'hi' ? '1. वह मोटर पॉलिसी चुनें जिस पर क्लेम करना है:' : '1. Select Active Motor Policy for this Claim:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {policies.filter(p => p.type === 'motor').map(p => {
                    const isSelected = selectedPolicyId === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPolicyId(p.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/50'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold">
                            {p.policyNumber}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                            {p.subType.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1">{p.title}</h4>
                        <div className="text-xs text-slate-400">
                          {p.vehicleDetails?.make} {p.vehicleDetails?.model} ({p.vehicleDetails?.regNumber})
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                          <span className="text-slate-400">Compulsory Excess:</span>
                          <span className="font-semibold text-white">₹{p.deductible}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Accident Details Form */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  {language === 'hi' ? '2. दुर्घटना का विवरण (Incident Information)' : '2. Incident Information'}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      {language === 'hi' ? 'दुर्घटना की तारीख (Incident Date)' : 'Incident Date'}
                    </label>
                    <input
                      type="date"
                      value={incidentDate}
                      onChange={e => setIncidentDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      {language === 'hi' ? 'दुर्घटना का समय (Incident Time)' : 'Incident Time'}
                    </label>
                    <input
                      type="time"
                      value={incidentTime}
                      onChange={e => setIncidentTime(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">
                      {language === 'hi' ? 'दुर्घटना स्थल (Location / Landmark)' : 'Incident Location / Landmark'}
                    </label>
                    <input
                      type="text"
                      value={incidentLocation}
                      onChange={e => setIncidentLocation(e.target.value)}
                      placeholder="e.g. Ring Road, Near AIIMS Flyover, New Delhi"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-400 mb-1">
                      {language === 'hi' ? 'संक्षिप्त विवरण (Accident Description)' : 'Brief Description of How Incident Occurred'}
                    </label>
                    <textarea
                      rows={3}
                      value={incidentDescription}
                      onChange={e => setIncidentDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  id="step1-next-btn"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/25"
                >
                  <span>{language === 'hi' ? 'डैमेज मैप पर आगे बढ़ें' : 'Proceed to Interactive Damage Map'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ----------------- STEP 2: INTERACTIVE DAMAGE MAP ----------------- */}
          {currentStep === 2 && (
            <div className="space-y-4">
              
              {/* Top Filter Tabs & Helper Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    {language === 'hi' ? 'फ़िल्टर:' : 'Filter View:'}
                  </span>
                  {[
                    { key: 'all', label: 'All Parts' },
                    { key: 'front', label: 'Front Fascia' },
                    { key: 'left', label: 'Left Side' },
                    { key: 'right', label: 'Right Side' },
                    { key: 'rear', label: 'Rear Section' },
                    { key: 'cabin', label: 'Glass & Roof' },
                    { key: 'wheels', label: 'Wheels & Alloys' }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveCategoryFilter(tab.key)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        activeCategoryFilter === tab.key
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Selected:</span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                    {partsArray.length} {language === 'hi' ? 'हिस्से' : 'parts'}
                  </span>
                </div>
              </div>

              {/* Main Grid: Interactive Blueprint on Left, Inspection Panel on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Visual Car Schematic Blueprint (7 cols) */}
                <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 rounded-3xl p-4 flex flex-col items-center justify-center relative">
                  
                  <div className="w-full flex justify-between items-center mb-2 px-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-cyan-400 font-bold">
                      <Car className="w-4 h-4" />
                      {currentPolicy.vehicleDetails?.make} {currentPolicy.vehicleDetails?.model}
                    </span>
                    <span>Tap any part to mark damage</span>
                  </div>

                  {/* SVG Automotive Inspection Wireframe */}
                  <div className="relative w-full max-w-md aspect-[1/2] max-h-[460px] bg-slate-900/60 rounded-2xl border border-slate-800/80 p-4 flex items-center justify-center overflow-hidden">
                    
                    {/* SVG Blueprint */}
                    <svg viewBox="0 0 300 600" className="w-full h-full select-none">
                      {/* Car Body Outer Shell */}
                      <path
                        d="M 60,110 C 60,70 100,50 150,50 C 200,50 240,70 240,110 L 240,480 C 240,530 200,550 150,550 C 100,550 60,530 60,480 Z"
                        fill="#090d16"
                        stroke="#1e293b"
                        strokeWidth="3"
                      />

                      {/* Cabin Glass Outline */}
                      <path
                        d="M 75,190 C 75,165 105,150 150,150 C 195,150 225,165 225,190 L 220,400 C 220,420 190,430 150,430 C 110,430 80,420 80,400 Z"
                        fill="#0f172a"
                        stroke="#334155"
                        strokeWidth="2"
                      />

                      {/* Front Windshield */}
                      <path
                        d="M 85,190 L 215,190 L 205,240 L 95,240 Z"
                        fill={damagedPartsMap['windshield'] ? '#ef4444' : (activeInspectingPartId === 'windshield' ? '#06b6d4' : '#1e293b')}
                        fillOpacity={damagedPartsMap['windshield'] ? '0.7' : '0.4'}
                        stroke="#38bdf8"
                        strokeWidth={activeInspectingPartId === 'windshield' ? '2.5' : '1'}
                        className="cursor-pointer hover:opacity-80 transition-all"
                        onClick={() => handlePartClick('windshield')}
                      />
                      <text x="150" y="218" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">
                        Windshield {damagedPartsMap['windshield'] && '⚠️'}
                      </text>

                      {/* Roof */}
                      <rect
                        x="95"
                        y="250"
                        width="110"
                        height="90"
                        rx="6"
                        fill={damagedPartsMap['roof'] ? '#ef4444' : (activeInspectingPartId === 'roof' ? '#06b6d4' : '#1e293b')}
                        fillOpacity={damagedPartsMap['roof'] ? '0.7' : '0.3'}
                        stroke="#38bdf8"
                        strokeWidth={activeInspectingPartId === 'roof' ? '2.5' : '1'}
                        className="cursor-pointer hover:opacity-80"
                        onClick={() => handlePartClick('roof')}
                      />
                      <text x="150" y="300" textAnchor="middle" fill="#94a3b8" fontSize="10">
                        Roof / Sunroof
                      </text>

                      {/* Rear Windshield */}
                      <path
                        d="M 95,350 L 205,350 L 215,400 L 85,400 Z"
                        fill={damagedPartsMap['rear_windshield'] ? '#ef4444' : (activeInspectingPartId === 'rear_windshield' ? '#06b6d4' : '#1e293b')}
                        fillOpacity={damagedPartsMap['rear_windshield'] ? '0.7' : '0.4'}
                        stroke="#38bdf8"
                        strokeWidth={activeInspectingPartId === 'rear_windshield' ? '2.5' : '1'}
                        className="cursor-pointer hover:opacity-80"
                        onClick={() => handlePartClick('rear_windshield')}
                      />
                      <text x="150" y="380" textAnchor="middle" fill="#94a3b8" fontSize="10">
                        Rear Glass
                      </text>

                      {/* Front Bumper */}
                      <path
                        d="M 65,58 C 100,45 200,45 235,58 L 230,85 C 190,75 110,75 70,85 Z"
                        fill={damagedPartsMap['front_bumper'] ? '#ef4444' : (activeInspectingPartId === 'front_bumper' ? '#06b6d4' : '#1e293b')}
                        fillOpacity={damagedPartsMap['front_bumper'] ? '0.8' : '0.4'}
                        stroke="#06b6d4"
                        strokeWidth={activeInspectingPartId === 'front_bumper' ? '3' : '1.5'}
                        className="cursor-pointer hover:opacity-90 transition-all"
                        onClick={() => handlePartClick('front_bumper')}
                      />
                      <text x="150" y="68" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">
                        FRONT BUMPER {damagedPartsMap['front_bumper'] && '⚠️'}
                      </text>

                      {/* Bonnet / Hood */}
                      <path
                        d="M 72,90 L 228,90 L 222,175 L 78,175 Z"
                        fill={damagedPartsMap['bonnet_hood'] ? '#ef4444' : (activeInspectingPartId === 'bonnet_hood' ? '#06b6d4' : '#1e293b')}
                        fillOpacity={damagedPartsMap['bonnet_hood'] ? '0.7' : '0.3'}
                        stroke="#06b6d4"
                        strokeWidth={activeInspectingPartId === 'bonnet_hood' ? '2.5' : '1'}
                        className="cursor-pointer hover:opacity-80"
                        onClick={() => handlePartClick('bonnet_hood')}
                      />
                      <text x="150" y="135" textAnchor="middle" fill="#cbd5e1" fontSize="11">
                        Bonnet / Hood
                      </text>

                      {/* Headlights Left & Right */}
                      <polygon
                        points="64,82 92,82 86,110 64,105"
                        fill={damagedPartsMap['headlight_left'] ? '#ef4444' : (activeInspectingPartId === 'headlight_left' ? '#06b6d4' : '#fbbf24')}
                        fillOpacity="0.8"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                        className="cursor-pointer hover:opacity-90"
                        onClick={() => handlePartClick('headlight_left')}
                      />
                      <polygon
                        points="236,82 208,82 214,110 236,105"
                        fill={damagedPartsMap['headlight_right'] ? '#ef4444' : (activeInspectingPartId === 'headlight_right' ? '#06b6d4' : '#fbbf24')}
                        fillOpacity="0.8"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                        className="cursor-pointer hover:opacity-90"
                        onClick={() => handlePartClick('headlight_right')}
                      />

                      {/* Side Mirrors Left & Right */}
                      <rect
                        x="35"
                        y="180"
                        width="24"
                        height="36"
                        rx="6"
                        fill={damagedPartsMap['side_mirror_left'] ? '#ef4444' : (activeInspectingPartId === 'side_mirror_left' ? '#06b6d4' : '#1e293b')}
                        stroke="#06b6d4"
                        strokeWidth="1.5"
                        className="cursor-pointer hover:opacity-90"
                        onClick={() => handlePartClick('side_mirror_left')}
                      />
                      <rect
                        x="241"
                        y="180"
                        width="24"
                        height="36"
                        rx="6"
                        fill={damagedPartsMap['side_mirror_right'] ? '#ef4444' : (activeInspectingPartId === 'side_mirror_right' ? '#06b6d4' : '#1e293b')}
                        stroke="#06b6d4"
                        strokeWidth="1.5"
                        className="cursor-pointer hover:opacity-90"
                        onClick={() => handlePartClick('side_mirror_right')}
                      />

                      {/* Front Doors Left & Right */}
                      <path
                        d="M 60,205 L 75,205 L 75,295 L 60,295 Z"
                        fill={damagedPartsMap['front_left_door'] ? '#ef4444' : (activeInspectingPartId === 'front_left_door' ? '#06b6d4' : '#1e293b')}
                        stroke="#06b6d4"
                        strokeWidth="1"
                        className="cursor-pointer"
                        onClick={() => handlePartClick('front_left_door')}
                      />
                      <path
                        d="M 225,205 L 240,205 L 240,295 L 225,295 Z"
                        fill={damagedPartsMap['front_right_door'] ? '#ef4444' : (activeInspectingPartId === 'front_right_door' ? '#06b6d4' : '#1e293b')}
                        stroke="#06b6d4"
                        strokeWidth="1"
                        className="cursor-pointer"
                        onClick={() => handlePartClick('front_right_door')}
                      />

                      {/* Rear Doors Left & Right */}
                      <path
                        d="M 60,305 L 75,305 L 75,395 L 60,395 Z"
                        fill={damagedPartsMap['rear_left_door'] ? '#ef4444' : (activeInspectingPartId === 'rear_left_door' ? '#06b6d4' : '#1e293b')}
                        stroke="#06b6d4"
                        strokeWidth="1"
                        className="cursor-pointer"
                        onClick={() => handlePartClick('rear_left_door')}
                      />
                      <path
                        d="M 225,305 L 240,305 L 240,395 L 225,395 Z"
                        fill={damagedPartsMap['rear_right_door'] ? '#ef4444' : (activeInspectingPartId === 'rear_right_door' ? '#06b6d4' : '#1e293b')}
                        stroke="#06b6d4"
                        strokeWidth="1"
                        className="cursor-pointer"
                        onClick={() => handlePartClick('rear_right_door')}
                      />

                      {/* Rear Trunk / Boot */}
                      <path
                        d="M 78,410 L 222,410 L 230,490 L 70,490 Z"
                        fill={damagedPartsMap['boot_trunk'] ? '#ef4444' : (activeInspectingPartId === 'boot_trunk' ? '#06b6d4' : '#1e293b')}
                        fillOpacity={damagedPartsMap['boot_trunk'] ? '0.7' : '0.3'}
                        stroke="#06b6d4"
                        strokeWidth={activeInspectingPartId === 'boot_trunk' ? '2.5' : '1'}
                        className="cursor-pointer hover:opacity-80"
                        onClick={() => handlePartClick('boot_trunk')}
                      />
                      <text x="150" y="455" textAnchor="middle" fill="#cbd5e1" fontSize="11">
                        Boot / Trunk
                      </text>

                      {/* Rear Bumper */}
                      <path
                        d="M 70,495 C 110,505 190,505 230,495 L 235,530 C 190,545 110,545 65,530 Z"
                        fill={damagedPartsMap['rear_bumper'] ? '#ef4444' : (activeInspectingPartId === 'rear_bumper' ? '#06b6d4' : '#1e293b')}
                        fillOpacity={damagedPartsMap['rear_bumper'] ? '0.8' : '0.4'}
                        stroke="#06b6d4"
                        strokeWidth={activeInspectingPartId === 'rear_bumper' ? '3' : '1.5'}
                        className="cursor-pointer hover:opacity-90"
                        onClick={() => handlePartClick('rear_bumper')}
                      />
                      <text x="150" y="525" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">
                        REAR BUMPER {damagedPartsMap['rear_bumper'] && '⚠️'}
                      </text>

                      {/* Tail Lights */}
                      <polygon
                        points="66,480 92,480 88,495 66,495"
                        fill={damagedPartsMap['tail_light_left'] ? '#ef4444' : (activeInspectingPartId === 'tail_light_left' ? '#06b6d4' : '#dc2626')}
                        fillOpacity="0.8"
                        stroke="#b91c1c"
                        strokeWidth="1.5"
                        className="cursor-pointer"
                        onClick={() => handlePartClick('tail_light_left')}
                      />
                      <polygon
                        points="234,480 208,480 212,495 234,495"
                        fill={damagedPartsMap['tail_light_right'] ? '#ef4444' : (activeInspectingPartId === 'tail_light_right' ? '#06b6d4' : '#dc2626')}
                        fillOpacity="0.8"
                        stroke="#b91c1c"
                        strokeWidth="1.5"
                        className="cursor-pointer"
                        onClick={() => handlePartClick('tail_light_right')}
                      />

                      {/* 4 Wheels/Alloys */}
                      <rect
                        x="38"
                        y="100"
                        width="18"
                        height="45"
                        rx="4"
                        fill={damagedPartsMap['alloy_wheels'] ? '#ef4444' : '#334155'}
                        stroke="#64748b"
                        className="cursor-pointer"
                        onClick={() => handlePartClick('alloy_wheels')}
                      />
                      <rect
                        x="244"
                        y="100"
                        width="18"
                        height="45"
                        rx="4"
                        fill={damagedPartsMap['alloy_wheels'] ? '#ef4444' : '#334155'}
                        stroke="#64748b"
                        className="cursor-pointer"
                        onClick={() => handlePartClick('alloy_wheels')}
                      />
                      <rect
                        x="38"
                        y="410"
                        width="18"
                        height="45"
                        rx="4"
                        fill={damagedPartsMap['alloy_wheels'] ? '#ef4444' : '#334155'}
                        stroke="#64748b"
                        className="cursor-pointer"
                        onClick={() => handlePartClick('alloy_wheels')}
                      />
                      <rect
                        x="244"
                        y="410"
                        width="18"
                        height="45"
                        rx="4"
                        fill={damagedPartsMap['alloy_wheels'] ? '#ef4444' : '#334155'}
                        stroke="#64748b"
                        className="cursor-pointer"
                        onClick={() => handlePartClick('alloy_wheels')}
                      />
                    </svg>

                    {/* Quick Selected overlay chip on image */}
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 text-[10px] text-slate-300">
                      Top-Down Blueprint Inspection View
                    </div>
                  </div>

                  {/* Horizontal Scrollable Part Selector for Touch / Easy Mobile Access */}
                  <div className="w-full mt-3 overflow-x-auto pb-1 flex gap-1.5">
                    {VEHICLE_PARTS
                      .filter(p => activeCategoryFilter === 'all' || p.viewSection === activeCategoryFilter)
                      .map(p => {
                        const isSelected = !!damagedPartsMap[p.id];
                        const isInspecting = activeInspectingPartId === p.id;
                        return (
                          <button
                            key={p.id}
                            onClick={() => handlePartClick(p.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                              isInspecting
                                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                                : isSelected
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : 'bg-slate-900/90 text-slate-300 hover:text-white border-slate-800'
                            }`}
                          >
                            {isSelected && <span className="w-2 h-2 rounded-full bg-rose-400" />}
                            <span>{language === 'hi' && p.nameHi ? p.nameHi : p.name}</span>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Right Inspection Detail Card (5 cols) */}
                <div className="lg:col-span-5 flex flex-col space-y-4">
                  
                  {activePart && inspectingPartDef ? (
                    <div className="bg-slate-950/90 border border-cyan-500/40 rounded-3xl p-5 shadow-xl space-y-4">
                      
                      {/* Part Title and Remove Action */}
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">
                            {inspectingPartDef.category.replace('_', ' ')}
                          </span>
                          <h3 className="text-base font-bold text-white font-['Outfit']">
                            {language === 'hi' && inspectingPartDef.nameHi ? inspectingPartDef.nameHi : inspectingPartDef.name}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDamagedPart(activeInspectingPartId)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-rose-400 hover:bg-rose-500/10"
                        >
                          Remove
                        </button>
                      </div>

                      {/* Policy Coverage Status Badge (CRITICAL REQUIREMENT #10) */}
                      <div className={`p-3 rounded-2xl border ${
                        activePart.coverageStatus === 'covered'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : activePart.coverageStatus === 'requires_verification'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                          {activePart.coverageStatus === 'covered' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          {activePart.coverageStatus === 'requires_verification' && <AlertCircle className="w-4 h-4 text-amber-400" />}
                          {activePart.coverageStatus === 'not_covered' && <XCircle className="w-4 h-4 text-rose-400" />}
                          
                          <span>
                            {activePart.coverageStatus === 'covered' && (language === 'hi' ? '✓ आपकी पॉलिसी के अंतर्गत कवर है' : '✓ Covered Under Your Policy')}
                            {activePart.coverageStatus === 'requires_verification' && (language === 'hi' ? '⚠ कवरेज सत्यापन आवश्यक (सत्यापन अधीन)' : '⚠ Coverage Requires Verification')}
                            {activePart.coverageStatus === 'not_covered' && (language === 'hi' ? '✕ इस पॉलिसी में कवर नहीं है' : '✕ Not Covered Under This Policy')}
                          </span>
                        </div>
                        <p className="text-[11px] opacity-90 leading-relaxed">
                          {activePart.coverageReason}
                        </p>
                      </div>

                      {/* Damage Type Selector (CRITICAL REQUIREMENT #7) */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-2">
                          {language === 'hi' ? 'नुकसान का प्रकार (Damage Type):' : 'Damage Type:'}
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {(['Damaged', 'Broken', 'Scratched', 'Dented', 'Cracked', 'Missing', 'Not damaged'] as DamageType[]).map(type => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => updateActivePartDamageType(type)}
                              className={`py-1.5 px-2.5 rounded-xl text-xs font-medium border transition-all text-left ${
                                activePart.damageType === type
                                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 font-bold'
                                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Severity Selector (CRITICAL REQUIREMENT #8) */}
                      <div>
                        <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
                          <span>{language === 'hi' ? 'गंभीरता (Severity):' : 'Damage Severity:'}</span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            activePart.severity === 'Minor' ? 'bg-emerald-500/20 text-emerald-300' :
                            activePart.severity === 'Moderate' ? 'bg-amber-500/20 text-amber-300' :
                            activePart.severity === 'Severe' ? 'bg-orange-500/20 text-orange-300' :
                            'bg-rose-500/20 text-rose-300'
                          }`}>
                            {activePart.severity}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1">
                          {(['Minor', 'Moderate', 'Severe', 'Completely damaged'] as DamageSeverity[]).map(sev => (
                            <button
                              key={sev}
                              type="button"
                              onClick={() => updateActivePartSeverity(sev)}
                              className={`py-1.5 rounded-xl text-[11px] font-semibold border transition-all text-center ${
                                activePart.severity === sev
                                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md'
                                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                              }`}
                            >
                              {sev.split(' ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* AI Observation Card if available */}
                      {activePart.aiAnalysis && (
                        <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 text-indigo-300 font-bold text-[11px]">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            <span>AI Visual Damage Scan Result:</span>
                          </div>
                          <p className="text-slate-300 text-[11px] leading-relaxed">
                            {activePart.aiAnalysis.observations}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                            <span>Confidence: {Math.round((activePart.aiAnalysis.confidence || 0.9) * 100)}%</span>
                            <span>Observation only • Subject to physical surveyor</span>
                          </div>
                        </div>
                      )}

                    </div>
                  ) : (
                    <div className="bg-slate-950/60 border border-slate-800 rounded-3xl p-6 text-center text-slate-400 flex flex-col items-center justify-center h-full min-h-[300px]">
                      <Car className="w-10 h-10 text-slate-600 mb-3" />
                      <h4 className="text-sm font-bold text-white mb-1">
                        {language === 'hi' ? 'गाड़ी के किसी हिस्से को चुनें' : 'Select a Vehicle Component'}
                      </h4>
                      <p className="text-xs max-w-xs text-slate-400">
                        Click on the front bumper, windshield, side doors, or wheels in the diagram to inspect damage and verify policy coverage.
                      </p>
                    </div>
                  )}

                  {/* Selected Parts List Pills */}
                  <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Selected Damaged Components ({partsArray.length}):
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {partsArray.map(p => (
                        <span
                          key={p.partId}
                          onClick={() => setActiveInspectingPartId(p.partId)}
                          className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 cursor-pointer hover:border-cyan-500/50"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            p.coverageStatus === 'covered' ? 'bg-emerald-400' :
                            p.coverageStatus === 'requires_verification' ? 'bg-amber-400' : 'bg-rose-400'
                          }`} />
                          <span>{p.partName}</span>
                          <span className="opacity-60 text-[10px]">({p.severity})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Navigation Bar for Step 2 */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4 inline mr-1" />
                  Back
                </button>

                <button
                  type="button"
                  id="step2-next-btn"
                  onClick={() => setCurrentStep(3)}
                  disabled={partsArray.length === 0}
                  className={`px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-2 ${
                    partsArray.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-cyan-500/25'
                  }`}
                >
                  <span>{language === 'hi' ? 'फोटो अपलोड व AI विश्लेषण' : 'Proceed to Photo & AI Analysis'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* ----------------- STEP 3: PHOTO UPLOAD & AI DAMAGE ANALYSIS ----------------- */}
          {currentStep === 3 && (
            <div className="space-y-6 max-w-4xl mx-auto">
              
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white font-['Outfit']">
                    {language === 'hi' ? 'क्षतिग्रस्त वाहन की तस्वीरें अपलोड करें' : 'Upload Vehicle Damage Photographs'}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Support front, rear, and close-up damage angles. Our AI Vision model inspects the image to detect severity and ensure alignment with the reported parts.
                </p>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Important:</strong> AI image analysis provides assistive forensic observations only. The final claim approval is verified by the digital surveyor.
                  </span>
                </div>
              </div>

              {/* One-Click Sample Photos (Crucial for instant live evaluation without uploading) */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  {language === 'hi' ? 'त्वरित परीक्षण के लिए सैंपल डैमेज फोटो चुनें (Demo One-Click):' : 'Select Pre-loaded Vehicle Damage Evidence (Demo 1-Click Scan):'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {SAMPLE_DAMAGE_PHOTOS.map((sample, idx) => (
                    <div
                      key={idx}
                      onClick={() => handlePhotoUpload(sample.url)}
                      className="group p-2 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all flex flex-col"
                    >
                      <div className="w-full h-28 rounded-xl overflow-hidden mb-2 bg-slate-900 relative">
                        <img
                          src={sample.url}
                          alt={sample.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-slate-950/80 text-[10px] text-cyan-300 font-bold">
                          Run AI Scan
                        </span>
                      </div>
                      <span className="text-xs font-bold text-white truncate">{sample.name}</span>
                      <span className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{sample.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local File / Camera Upload Simulation */}
              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-800 hover:border-cyan-500/50 bg-slate-950/40 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-cyan-400">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">
                    {language === 'hi' ? 'डिवाइस या कैमरा से फोटो खींचें' : 'Take a photo or upload from device'}
                  </h4>
                  <p className="text-[11px] text-slate-400">PNG, JPG or WebP up to 10MB</p>
                </div>
                <label className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition-all">
                  Browse Files
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (typeof reader.result === 'string') {
                            handlePhotoUpload(reader.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              {/* AI Processing Banner */}
              {isAnalyzingPhoto && (
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-3 animate-pulse">
                  <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" />
                  <div className="text-xs">
                    <span className="font-bold text-cyan-300">OMNISURE AI Computer Vision Analyzing Damage...</span>
                    <p className="text-slate-400 text-[11px]">Identifying deformation, part alignment, and severity score.</p>
                  </div>
                </div>
              )}

              {/* Active Photos Uploaded */}
              {uploadedPhotos.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400">Uploaded Photographs ({uploadedPhotos.length}):</span>
                  <div className="flex flex-wrap gap-3">
                    {uploadedPhotos.map((url, i) => (
                      <div key={i} className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-800 relative bg-slate-900">
                        <img src={url} alt="Damage" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <span className="absolute top-1 left-1 px-1 py-0.2 bg-slate-950/80 rounded text-[9px] text-emerald-400 font-bold">
                          ✓ Scanned
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Bar for Step 3 */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4 inline mr-1" />
                  Back to Damage Map
                </button>

                <button
                  type="button"
                  id="step3-next-btn"
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/25"
                >
                  <span>{language === 'hi' ? 'प्रासंगिक प्रश्नों का उत्तर दें' : 'Proceed to Dynamic Questions'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* ----------------- STEP 4: DYNAMIC CLAIM QUESTIONS (CRITICAL REQUIREMENT #12) ----------------- */}
          {currentStep === 4 && (
            <div className="space-y-6 max-w-3xl mx-auto">
              
              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white font-['Outfit']">
                    {language === 'hi' ? 'AI-उत्पन्न प्रासंगिक प्रश्न (AI-Generated Claim Questions)' : 'AI-Generated Contextual Claim Questions'}
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  Questions are dynamically generated based exclusively on your selected damaged parts to eliminate redundant questionnaire fields.
                </p>
              </div>

              {relevantQuestions.length > 0 ? (
                <div className="space-y-4">
                  {relevantQuestions.map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                          {q.partName}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-white">
                        {language === 'hi' ? q.questionHi : q.questionEn}
                      </h4>
                      <div className="grid grid-cols-1 gap-2 pt-1">
                        {(language === 'hi' ? q.optionsHi : q.optionsEn).map((opt, oIdx) => {
                          const isSelected = answeredQuestions[q.id] === opt;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => setAnsweredQuestions(prev => ({ ...prev, [q.id]: opt }))}
                              className={`p-2.5 rounded-xl text-xs text-left border transition-all ${
                                isSelected
                                  ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500 font-semibold'
                                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-slate-400 text-xs">
                  No additional questionnaire required for the selected parts.
                </div>
              )}

              {/* Navigation Bar for Step 4 */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:text-white"
                >
                  <ChevronLeft className="w-4 h-4 inline mr-1" />
                  Back
                </button>

                <button
                  type="button"
                  id="step4-next-btn"
                  onClick={() => setCurrentStep(5)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/25"
                >
                  <span>{language === 'hi' ? 'क्लेम समरी की समीक्षा करें' : 'Review Structured Claim Summary'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* ----------------- STEP 5: SMART CLAIM SUMMARY & SUBMISSION (CRITICAL REQUIREMENT #11) ----------------- */}
          {currentStep === 5 && (
            <div className="space-y-6 max-w-4xl mx-auto">
              
              <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                      OMNISURE PRE-SUBMISSION AUDIT
                    </span>
                    <h3 className="text-lg font-bold text-white font-['Outfit']">
                      {language === 'hi' ? 'वाहन क्षति विवरण समरी (Vehicle Damage Summary)' : 'Structured Vehicle Damage Summary'}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Applicable Policy</span>
                    <span className="text-xs font-bold text-cyan-300">{currentPolicy.title}</span>
                  </div>
                </div>

                {/* Structured Damage Checklist Card */}
                <div className="space-y-3">
                  {partsArray.map(part => (
                    <div
                      key={part.partId}
                      className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          part.coverageStatus === 'covered' ? 'bg-emerald-400' :
                          part.coverageStatus === 'requires_verification' ? 'bg-amber-400' : 'bg-rose-400'
                        }`} />
                        <div>
                          <h4 className="text-sm font-bold text-white">{part.partName}</h4>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span>Status: <strong className="text-slate-200">{part.damageType}</strong></span>
                            <span>•</span>
                            <span>Severity: <strong className="text-slate-200">{part.severity}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="sm:text-right">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          part.coverageStatus === 'covered' ? 'bg-emerald-500/20 text-emerald-300' :
                          part.coverageStatus === 'requires_verification' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-rose-500/20 text-rose-300'
                        }`}>
                          {part.coverageStatus === 'covered' ? '✓ Covered' :
                           part.coverageStatus === 'requires_verification' ? '⚠ Requires Verification' : '✕ Not Covered'}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1 max-w-xs">{part.coverageReason}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coverage & Payout Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Total Damaged Parts</span>
                    <span className="text-lg font-bold text-white">{partsArray.length}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                    <span className="text-[11px] text-emerald-400 block">Covered Items</span>
                    <span className="text-lg font-bold text-emerald-300">{coveredCount}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                    <span className="text-[11px] text-amber-400 block">Verification Needed</span>
                    <span className="text-lg font-bold text-amber-300">{verificationCount}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-cyan-400 block">Est. Net Payout</span>
                    <span className="text-lg font-bold text-cyan-300">₹{netEstimatedPayout.toLocaleString()}</span>
                  </div>
                </div>

                {/* Specific actions requested in Prompt (Review Claim, Edit Damage, Add More Damage, Submit Claim) */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{language === 'hi' ? 'डैमेज एडिट करें' : 'Edit Damage'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                    >
                      <span>{language === 'hi' ? 'और डैमेज जोड़ें' : 'Add More Damage'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    id="submit-final-claim-btn"
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/30 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>
                      {isSubmitting
                        ? (language === 'hi' ? 'क्लेम सबमिट हो रहा है...' : 'Lodging FNOL Claim...')
                        : (language === 'hi' ? 'क्लेम सबमिट करें (Submit Claim)' : 'Submit Digital Claim')}
                    </span>
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

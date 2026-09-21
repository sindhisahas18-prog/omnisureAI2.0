import React, { useState, useEffect } from 'react';
import { 
  X, 
  Car, 
  Bike, 
  HeartPulse, 
  Home, 
  Plane, 
  Smartphone, 
  Activity, 
  Heart, 
  Briefcase, 
  ChevronLeft, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import { 
  InsurancePolicy, 
  InsuranceClaim, 
  InsuranceType, 
  Language, 
  ClaimTimelineEvent 
} from '../types';
import { VehicleDamageClaimModal } from './VehicleDamageClaimModal';
import { HomeClaimForm } from './claims/HomeClaimForm';
import { TravelClaimForm } from './claims/TravelClaimForm';
import { GadgetClaimForm } from './claims/GadgetClaimForm';
import { AccidentClaimForm } from './claims/AccidentClaimForm';
import { LifeClaimForm } from './claims/LifeClaimForm';
import { HealthClaimForm } from './claims/HealthClaimForm';
import { BikeClaimForm } from './claims/BikeClaimForm';
import { OtherClaimForm } from './claims/OtherClaimForm';
import { ClaimSuccessView } from './claims/ClaimSuccessView';

interface MultiInsuranceClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  policies: InsurancePolicy[];
  initialPolicyId?: string;
  initialType?: InsuranceType;
  language: Language;
  onClaimSubmitted: (newClaim: InsuranceClaim) => void;
}

interface InsuranceTypeOption {
  type: InsuranceType;
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
  icon: React.ReactNode;
  badge: string;
  borderHover: string;
}

const INSURANCE_TYPE_OPTIONS: InsuranceTypeOption[] = [
  {
    type: 'motor',
    titleEn: 'Car / Motor Insurance',
    titleHi: 'कार / मोटर बीमा',
    descEn: 'Interactive vehicle blueprint, part damage mapping & cashless workshop',
    descHi: 'इंटरएक्टिव ब्लूप्रिंट, डैमेज मैपिंग और कैशलेस गैरेज',
    icon: <Car className="w-5 h-5 text-sky-600" />,
    badge: 'Interactive Car Blueprint',
    borderHover: 'hover:border-sky-400'
  },
  {
    type: 'bike',
    titleEn: 'Bike / Two-Wheeler',
    titleHi: 'बाइक / टू-व्हीलर बीमा',
    descEn: 'Silencer, crash guard, fork, handlebar & zero-dep parts',
    descHi: 'साइलेंसर, क्रैश गार्ड, फोर्क, हैंडल और जीरो-डेप पार्ट्स',
    icon: <Bike className="w-5 h-5 text-emerald-600" />,
    badge: 'Two-Wheeler FNOL',
    borderHover: 'hover:border-emerald-400'
  },
  {
    type: 'health',
    titleEn: 'Health Insurance',
    titleHi: 'स्वास्थ्य बीमा (हेल्थ)',
    descEn: 'Cashless hospital pre-auth, discharge summary & medical bills',
    descHi: 'कैशलेस अस्पताल प्री-ऑथ, डिस्चार्ज समरी और मेडिकल बिल',
    icon: <HeartPulse className="w-5 h-5 text-rose-600" />,
    badge: 'Cashless Hospital TPA',
    borderHover: 'hover:border-rose-400'
  },
  {
    type: 'home',
    titleEn: 'Home / Property',
    titleHi: 'गृह बीमा (होम)',
    descEn: 'Structure, water ingress, fire, burglary & appliance surge',
    descHi: 'मकान संरचना, पानी रिसाव, आग, चोरी और इलेक्ट्रॉनिक उपकरण',
    icon: <Home className="w-5 h-5 text-amber-600" />,
    badge: 'Property & Contents',
    borderHover: 'hover:border-amber-400'
  },
  {
    type: 'travel',
    titleEn: 'Travel Insurance',
    titleHi: 'यात्रा बीमा (ट्रैवल)',
    descEn: 'Medical abroad, baggage loss / PIR, flight delay & passport theft',
    descHi: 'विदेश में मेडिकल, बैगेज देरी (PIR), पासपोर्ट चोरी व उड़ान रद्द',
    icon: <Plane className="w-5 h-5 text-sky-600" />,
    badge: 'Worldwide & Schengen',
    borderHover: 'hover:border-sky-400'
  },
  {
    type: 'gadget',
    titleEn: 'Device / Gadget',
    titleHi: 'गैजेट व मोबाइल बीमा',
    descEn: 'Screen fracture, liquid submersion, motherboard breakdown & IMEI check',
    descHi: 'स्क्रीन क्रैक, पानी में गिरना, मदरबोर्ड डैमेज व अधिकृत रिपेयर',
    icon: <Smartphone className="w-5 h-5 text-indigo-600" />,
    badge: 'Screen & Liquid Damage',
    borderHover: 'hover:border-indigo-400'
  },
  {
    type: 'accident',
    titleEn: 'Personal Accident',
    titleHi: 'व्यक्तिगत दुर्घटना बीमा',
    descEn: 'Disablement, fracture benefit, hospital confinement & weekly cash',
    descHi: 'अस्थायी / स्थायी दिव्यांगता, फ्रैक्चर व अस्पताल कैश बेनिफिट',
    icon: <Activity className="w-5 h-5 text-teal-600" />,
    badge: 'Accidental Disablement',
    borderHover: 'hover:border-teal-400'
  },
  {
    type: 'life',
    titleEn: 'Life / Term Insurance',
    titleHi: 'जीवन बीमा (टर्म लाइफ)',
    descEn: 'Death claim intimation, Section 45 protection & nominee NEFT settlement',
    descHi: 'डेथ क्लेम, धारा 45 सुरक्षा और नॉमिनी डायरेक्ट बैंक एनईएफटी',
    icon: <Heart className="w-5 h-5 text-red-600" />,
    badge: 'Term Life Settlement',
    borderHover: 'hover:border-red-400'
  },
  {
    type: 'other',
    titleEn: 'Commercial / Other',
    titleHi: 'व्यावसायिक व अन्य बीमा',
    descEn: 'Cyber liability, business transit & commercial risk claims',
    descHi: 'साइबर लायबिलिटी, व्यावसायिक क्षति और विविध क्लेम',
    icon: <Briefcase className="w-5 h-5 text-slate-600" />,
    badge: 'Commercial Line',
    borderHover: 'hover:border-slate-400'
  }
];

export const MultiInsuranceClaimModal: React.FC<MultiInsuranceClaimModalProps> = ({
  isOpen,
  onClose,
  policies,
  initialPolicyId,
  initialType,
  language,
  onClaimSubmitted
}) => {
  const isHindi = language === 'hi';

  const [selectedType, setSelectedType] = useState<InsuranceType | null>(null);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('');
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [submittedClaim, setSubmittedClaim] = useState<InsuranceClaim | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize or reset when modal opens or initial inputs change
  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setSubmittedClaim(null);
      setIsSubmitting(false);

      if (initialPolicyId) {
        const p = policies.find(pol => pol.id === initialPolicyId);
        if (p) {
          setSelectedType(p.type);
          setSelectedPolicyId(p.id);
          return;
        }
      }
      if (initialType) {
        setSelectedType(initialType);
        const matching = policies.filter(pol => pol.type === initialType);
        if (matching.length > 0) {
          setSelectedPolicyId(matching[0].id);
        } else {
          setSelectedPolicyId('');
        }
        return;
      }
      setSelectedType(null);
      setSelectedPolicyId('');
    }
  }, [isOpen, initialPolicyId, initialType, policies]);

  // When user clicks a category card
  const handleSelectCategory = (type: InsuranceType) => {
    setSelectedType(type);
    const matching = policies.filter(p => p.type === type);
    if (matching.length > 0) {
      setSelectedPolicyId(matching[0].id);
    } else {
      setSelectedPolicyId('');
    }
    setStep('form');
  };

  if (!isOpen) return null;

  // If user selected motor, launch the interactive car damage selector
  if (selectedType === 'motor' && step === 'form') {
    return (
      <VehicleDamageClaimModal
        isOpen={isOpen}
        onClose={() => {
          setSelectedType(null);
          onClose();
        }}
        policies={policies}
        initialPolicyId={initialPolicyId}
        language={language}
        onClaimSubmitted={(newClaim) => {
          onClaimSubmitted(newClaim);
          setSubmittedClaim(newClaim);
          setStep('success');
        }}
      />
    );
  }

  // Helper to generate default policy for any type if user has no pre-existing policy of that type
  const getDefaultPolicyForType = (type: InsuranceType): InsurancePolicy => {
    switch (type) {
      case 'home':
        return {
          id: 'POL-HOM-DEF',
          policyNumber: 'OMNI-HOM-8821',
          title: 'Omnisure Griha Raksha Comprehensive Cover',
          titleHi: 'ओम्नीश्योर गृह रक्षा संपूर्ण सुरक्षा',
          type: 'home',
          subType: 'comprehensive',
          holderName: 'Sahas Sindhi',
          sumInsured: 4500000,
          insuredDeclaredValue: 4500000,
          deductible: 2500,
          premiumAmount: 8500,
          startDate: '2026-01-01',
          expiryDate: '2027-01-01',
          status: 'active',
          addons: ['Burst Pipe / Water Ingress Cover', 'Burglary & Theft', 'Electronic Appliance Protection'],
          documents: [],
          coveredPartIds: [],
          partCoverageRules: {}
        };
      case 'travel':
        return {
          id: 'POL-TRV-DEF',
          policyNumber: 'OMNI-TRV-9932',
          title: 'Omnisure Global Travel Elite Shield',
          titleHi: 'ओम्नीश्योर ग्लोबल ट्रैवल एलीट शील्ड',
          type: 'travel',
          subType: 'comprehensive',
          holderName: 'Sahas Sindhi',
          sumInsured: 5000000,
          insuredDeclaredValue: 5000000,
          deductible: 0,
          premiumAmount: 4200,
          startDate: '2026-01-01',
          expiryDate: '2027-01-01',
          status: 'active',
          addons: ['Worldwide Cashless Hospitalization', 'PIR Baggage Delay & Loss Compensation', 'Trip Delay & Cancellation'],
          documents: [],
          coveredPartIds: [],
          partCoverageRules: {}
        };
      case 'gadget':
        return {
          id: 'POL-DEV-DEF',
          policyNumber: 'OMNI-DEV-7714',
          title: 'Omnisure Digital Device & Screen Protection',
          titleHi: 'ओम्नीश्योर डिजिटल डिवाइस व स्क्रीन प्रोटेक्शन',
          type: 'gadget',
          subType: 'comprehensive',
          holderName: 'Sahas Sindhi',
          sumInsured: 150000,
          insuredDeclaredValue: 150000,
          deductible: 1000,
          premiumAmount: 3200,
          startDate: '2026-01-01',
          expiryDate: '2027-01-01',
          status: 'active',
          addons: ['OEM Authorized Screen Replacement', 'Liquid Submersion Coverage', 'Doorstep Pickup & Delivery'],
          documents: [],
          coveredPartIds: [],
          partCoverageRules: {}
        };
      case 'accident':
        return {
          id: 'POL-ACC-DEF',
          policyNumber: 'OMNI-ACC-4491',
          title: 'Omnisure Saral Suraksha Bima (Personal Accident)',
          titleHi: 'ओम्नीश्योर सरल सुरक्षा बीमा (दुर्घटना)',
          type: 'accident',
          subType: 'comprehensive',
          holderName: 'Sahas Sindhi',
          sumInsured: 2500000,
          insuredDeclaredValue: 2500000,
          deductible: 0,
          premiumAmount: 2800,
          startDate: '2026-01-01',
          expiryDate: '2027-01-01',
          status: 'active',
          addons: ['Permanent Total Disability Cover', 'Bone Fracture Fixed Cash Benefit', 'Hospital Confinement Allowance'],
          documents: [],
          coveredPartIds: [],
          partCoverageRules: {}
        };
      case 'life':
        return {
          id: 'POL-LIF-DEF',
          policyNumber: 'OMNI-LIF-1082',
          title: 'Omnisure Sampoorn Raksha Term Life Shield',
          titleHi: 'ओम्नीश्योर संपूर्ण रक्षा टर्म लाइफ शील्ड',
          type: 'life',
          subType: 'comprehensive',
          holderName: 'Sahas Sindhi',
          sumInsured: 10000000,
          insuredDeclaredValue: 10000000,
          deductible: 0,
          premiumAmount: 18500,
          startDate: '2026-01-01',
          expiryDate: '2056-01-01',
          status: 'active',
          addons: ['Section 45 Non-Disputable Payout', 'Accidental Death Benefit Double Sum', 'Direct Nominee Fast-Track Settlement'],
          documents: [],
          coveredPartIds: [],
          partCoverageRules: {}
        };
      case 'bike':
        return {
          id: 'POL-BIK-DEF',
          policyNumber: 'OMNI-BIK-3390',
          title: 'Omnisure Two-Wheeler Comprehensive Package',
          titleHi: 'ओम्नीश्योर टू-व्हीलर पैकेज पॉलिसी',
          type: 'bike',
          subType: 'comprehensive',
          holderName: 'Sahas Sindhi',
          sumInsured: 180000,
          insuredDeclaredValue: 180000,
          deductible: 500,
          premiumAmount: 2200,
          startDate: '2026-01-01',
          expiryDate: '2027-01-01',
          status: 'active',
          addons: ['Zero-Depreciation Parts', 'Engine & Gearbox Protection', 'Roadside Assistance'],
          documents: [],
          coveredPartIds: [],
          partCoverageRules: {}
        };
      case 'health':
        return {
          id: 'POL-HLT-DEF',
          policyNumber: 'OMNI-HLT-5510',
          title: 'Omnisure Health Shield 360 (Family Floater)',
          titleHi: 'ओम्नीश्योर हेल्थ शील्ड 360',
          type: 'health',
          subType: 'comprehensive',
          holderName: 'Sahas Sindhi',
          sumInsured: 2000000,
          insuredDeclaredValue: 2000000,
          deductible: 0,
          premiumAmount: 14500,
          startDate: '2026-01-01',
          expiryDate: '2027-01-01',
          status: 'active',
          addons: ['Zero Room Rent Capping', 'Pre & Post Hospitalization 60/180 Days', 'Air Ambulance & Ayush Cover'],
          documents: [],
          coveredPartIds: [],
          partCoverageRules: {}
        };
      default:
        return {
          id: 'POL-OTH-DEF',
          policyNumber: 'OMNI-OTH-6612',
          title: 'Omnisure Enterprise & Commercial Asset Cover',
          titleHi: 'ओम्नीश्योर एंटरप्राइज व कमर्शियल एसेट कवर',
          type: 'other',
          subType: 'comprehensive',
          holderName: 'Sahas Sindhi',
          sumInsured: 3000000,
          insuredDeclaredValue: 3000000,
          deductible: 2000,
          premiumAmount: 11000,
          startDate: '2026-01-01',
          expiryDate: '2027-01-01',
          status: 'active',
          addons: ['Goods in Transit Coverage', 'Public Liability Protection', 'Allied Perils & Impact Damage'],
          documents: [],
          coveredPartIds: [],
          partCoverageRules: {}
        };
    }
  };

  // Get matching policies ONLY for the selected category
  const matchingPolicies = selectedType ? policies.filter(p => p.type === selectedType) : [];
  const activePolicy: InsurancePolicy = 
    (matchingPolicies.find(p => p.id === selectedPolicyId)) ||
    matchingPolicies[0] ||
    getDefaultPolicyForType(selectedType || 'other');

  // Helper to generate reference ID matching exact required format
  const generateClaimReference = (type: InsuranceType): string => {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    switch (type) {
      case 'home': return `OMNI-HOM-${year}-${rand}`;
      case 'travel': return `OMNI-TRV-${year}-${rand}`;
      case 'gadget': return `OMNI-DEV-${year}-${rand}`;
      case 'accident': return `OMNI-ACC-${year}-${rand}`;
      case 'life': return `OMNI-LIF-${year}-${rand}`;
      case 'health': return `OMNI-HLT-${year}-${rand}`;
      case 'bike': return `OMNI-BIK-${year}-${rand}`;
      case 'motor': return `OMNI-MTR-${year}-${rand}`;
      default: return `OMNI-CLM-${year}-${rand}`;
    }
  };

  // Build type-specific realistic timeline
  const buildTypeSpecificTimeline = (type: InsuranceType, policyTitle: string): ClaimTimelineEvent[] => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today';
    
    switch (type) {
      case 'home':
        return [
          { stage: 'Claim Submitted (FNOL)', stageKey: 'submitted', timestamp: timeNow, status: 'completed', description: `First Notice of Loss submitted with verified photographs under ${policyTitle}.` },
          { stage: 'IRDAI Surveyor Deputation', stageKey: 'verified', timestamp: 'Allotted within 24h', status: 'current', description: 'Empanelled Loss Assessor appointed for physical property structural inspection.' },
          { stage: 'Physical Loss & Debris Audit', stageKey: 'assessment', timestamp: 'Scheduled', status: 'pending', description: 'Assessment of structural damage, water ingress, and content loss estimate.' },
          { stage: 'Surveyor Report & Approval', stageKey: 'approval', timestamp: 'Pending Review', status: 'pending', description: 'Surveyor final loss assessment report submission and sanction.' },
          { stage: 'Direct NEFT Settlement', stageKey: 'settlement', timestamp: 'Fast-Track', status: 'pending', description: 'Direct bank account transfer for verified repair expenses.' }
        ];
      case 'travel':
        return [
          { stage: 'Travel Claim Intimation (FNOL)', stageKey: 'submitted', timestamp: timeNow, status: 'completed', description: `Disruption event registered with airline & boarding details under ${policyTitle}.` },
          { stage: 'Carrier & PIR Verification', stageKey: 'verified', timestamp: 'In Progress', status: 'current', description: 'Overseas Assistance Desk verifying airline Property Irregularity Report & flight logs.' },
          { stage: 'Expense & Forex Audit', stageKey: 'assessment', timestamp: 'Scheduled', status: 'pending', description: 'Foreign currency invoice conversion and emergency expense verification.' },
          { stage: 'Assistance Committee Sanction', stageKey: 'approval', timestamp: 'Pending Review', status: 'pending', description: 'Overseas travel claims approval and indemnity order.' },
          { stage: 'Direct Account Disbursement', stageKey: 'settlement', timestamp: 'Fast-Track', status: 'pending', description: 'Direct electronic settlement in INR to beneficiary account.' }
        ];
      case 'gadget':
        return [
          { stage: 'Digital Claim & IMEI Intimation', stageKey: 'submitted', timestamp: timeNow, status: 'completed', description: `Damage claim logged with serial/IMEI validation under ${policyTitle}.` },
          { stage: 'Authorized Service Center Allotment', stageKey: 'verified', timestamp: 'Pickup Initiated', status: 'current', description: 'OEM authorized center technician appointed for diagnostic audit.' },
          { stage: 'Hardware Diagnostics & Repair Quote', stageKey: 'assessment', timestamp: 'Scheduled', status: 'pending', description: 'OEM diagnostic scan, genuine part replacement estimate & testing.' },
          { stage: 'Repair Sanction Order', stageKey: 'approval', timestamp: 'Pending Review', status: 'pending', description: 'Cashless repair approval transmitted to authorized service hub.' },
          { stage: 'Doorstep Delivery & Handover', stageKey: 'settlement', timestamp: 'Fast-Track', status: 'pending', description: 'Repaired device delivered with OEM warranty certificate.' }
        ];
      case 'accident':
        return [
          { stage: 'Saral Suraksha Intimation (FNOL)', stageKey: 'submitted', timestamp: timeNow, status: 'completed', description: `Accidental injury intimation filed with medical proofs under ${policyTitle}.` },
          { stage: 'MLC & Hospitalization Audit', stageKey: 'verified', timestamp: 'In Progress', status: 'current', description: 'Verification of Medico-Legal case records and attending physician certificate.' },
          { stage: 'Disability / Benefit Calculation', stageKey: 'assessment', timestamp: 'Scheduled', status: 'pending', description: 'Medical advisory board assessment of disablement percentage & statutory benefit.' },
          { stage: 'Claims Scrutiny Committee Approval', stageKey: 'approval', timestamp: 'Pending Review', status: 'pending', description: 'Statutory sanction under Saral Suraksha Bima rules.' },
          { stage: 'Direct NEFT Benefit Payout', stageKey: 'settlement', timestamp: 'Fast-Track', status: 'pending', description: 'Direct NEFT transfer to insured / registered nominee bank account.' }
        ];
      case 'life':
        return [
          { stage: 'Death Claim Intimation (FNOL)', stageKey: 'submitted', timestamp: timeNow, status: 'completed', description: `Claim intimation registered by beneficiary under ${policyTitle}.` },
          { stage: 'Section 45 Statutory Scrutiny', stageKey: 'verified', timestamp: 'Priority Desk', status: 'current', description: 'Section 45 3-year non-disputable policy verification & nominee KYC validation.' },
          { stage: 'Medical Certificate Audit', stageKey: 'assessment', timestamp: 'Scheduled', status: 'pending', description: 'Attending physician statement and municipal death certificate verification.' },
          { stage: 'National Claims Committee Sanction', stageKey: 'approval', timestamp: 'Pending Review', status: 'pending', description: 'Executive Claims Committee final sanction for 100% sum assured.' },
          { stage: 'Direct Nominee NEFT Settlement', stageKey: 'settlement', timestamp: 'Fast-Track Priority', status: 'pending', description: 'Immediate wire transfer to registered nominee bank account.' }
        ];
      case 'health':
        return [
          { stage: 'Health Claim Intimated (TPA/FNOL)', stageKey: 'submitted', timestamp: timeNow, status: 'completed', description: `Hospitalization records and diagnosis submitted under ${policyTitle}.` },
          { stage: 'Pre-Authorization & TPA Desk Review', stageKey: 'verified', timestamp: 'In Progress', status: 'current', description: 'Third Party Administrator (TPA) doctor audit of admission note & indoor case sheet.' },
          { stage: 'Medical Scrutiny & Tariff Verification', stageKey: 'assessment', timestamp: 'Scheduled', status: 'pending', description: 'Room rent, surgical fees & pharmacy invoice audit according to policy schedule.' },
          { stage: 'Cashless / Settlement Sanction', stageKey: 'approval', timestamp: 'Pending Review', status: 'pending', description: 'Issuance of Final Guarantee Letter or reimbursement sanction.' },
          { stage: 'Direct Settlement / Hospital Clearance', stageKey: 'settlement', timestamp: 'Fast-Track', status: 'pending', description: 'Direct hospital bill settlement with zero deductions.' }
        ];
      case 'bike':
        return [
          { stage: 'Two-Wheeler Claim Lodged (FNOL)', stageKey: 'submitted', timestamp: timeNow, status: 'completed', description: `Accident details and part damage logged under ${policyTitle}.` },
          { stage: 'Digital Tele-Inspection / Garage Allocation', stageKey: 'verified', timestamp: 'In Progress', status: 'current', description: 'Cashless garage assigned; AI video survey link dispatched to rider.' },
          { stage: 'Zero-Dep Part & Labor Assessment', stageKey: 'assessment', timestamp: 'Scheduled', status: 'pending', description: 'Surveyor approval of replacement parts, paint, and zero-depreciation coverage.' },
          { stage: 'Workshop Cashless Approval', stageKey: 'approval', timestamp: 'Pending Review', status: 'pending', description: 'Workshop delivery order issued for cashless repair execution.' },
          { stage: 'Vehicle Delivery to Insured', stageKey: 'settlement', timestamp: 'Fast-Track', status: 'pending', description: 'Garage invoice settled directly with ₹500 excess paid by customer.' }
        ];
      default:
        return [
          { stage: 'Commercial Loss Intimation (FNOL)', stageKey: 'submitted', timestamp: timeNow, status: 'completed', description: `Loss intimation recorded under ${policyTitle}.` },
          { stage: 'Policy & Document Scrutiny', stageKey: 'verified', timestamp: 'In Progress', status: 'current', description: 'Automated verification against active commercial underwriting schedule.' },
          { stage: 'Surveyor Deputation & Loss Audit', stageKey: 'assessment', timestamp: 'Scheduled', status: 'pending', description: 'Empanelled commercial surveyor appointed for physical loss assessment.' },
          { stage: 'Sanction Committee Review', stageKey: 'approval', timestamp: 'Pending Review', status: 'pending', description: 'Final loss sanction order and settlement recommendation.' },
          { stage: 'Direct Electronic NEFT Settlement', stageKey: 'settlement', timestamp: 'Fast-Track', status: 'pending', description: 'Direct account transfer to commercial policyholder.' }
        ];
    }
  };

  // Unified submission processor for all specialized forms
  const handleSpecializedFormSubmit = async (claimPartial: Partial<InsuranceClaim>) => {
    setIsSubmitting(true);
    try {
      const type = selectedType || claimPartial.insuranceType || 'other';
      const claimNumber = generateClaimReference(type);
      const policy = activePolicy;

      const timeline: ClaimTimelineEvent[] = buildTypeSpecificTimeline(type, policy.title);

      const fullClaim: InsuranceClaim = {
        id: claimNumber,
        claimNumber,
        insuranceType: type,
        policyId: policy.id,
        policyNumber: policy.policyNumber,
        policyTitle: policy.title,
        assetName: claimPartial.assetName || policy.title,
        incidentDate: claimPartial.incidentDate || new Date().toISOString().split('T')[0],
        incidentLocation: claimPartial.incidentLocation || 'Delhi NCR',
        incidentDescription: claimPartial.incidentDescription || 'Claim recorded under active policy.',
        damagedParts: claimPartial.damagedParts || [],
        photos: claimPartial.photos || [],
        claimStatus: 'Claim Submitted',
        estimatedAmount: claimPartial.estimatedAmount || 15000,
        approvedAmount: claimPartial.approvedAmount ?? claimPartial.estimatedAmount ?? 15000,
        deductibleApplied: claimPartial.deductibleApplied ?? policy.deductible ?? 0,
        netPayoutEstimate: claimPartial.netPayoutEstimate ?? claimPartial.estimatedAmount ?? 15000,
        nextStep: claimPartial.nextStep || 'Document verification under process.',
        createdAt: new Date().toLocaleString(),
        timeline,
        questionsAnswered: claimPartial.questionsAnswered || [],
        specializedDetails: claimPartial.specializedDetails || {}
      };

      // Attempt server-side persistence
      try {
        await fetch('/api/claims', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fullClaim)
        });
      } catch (err) {
        console.warn('Server sync skipped, persisting locally:', err);
      }

      setSubmittedClaim(fullClaim);
      onClaimSubmitted(fullClaim);
      setStep('success');
    } catch (error) {
      console.error('Error lodging specialized claim:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the appropriate type-specific form component
  const renderCategoryForm = () => {
    if (!selectedType) return null;

    switch (selectedType) {
      case 'home':
        return (
          <HomeClaimForm
            policy={activePolicy}
            language={language}
            onSubmit={handleSpecializedFormSubmit}
            isSubmitting={isSubmitting}
          />
        );
      case 'travel':
        return (
          <TravelClaimForm
            policy={activePolicy}
            language={language}
            onSubmit={handleSpecializedFormSubmit}
            isSubmitting={isSubmitting}
          />
        );
      case 'gadget':
        return (
          <GadgetClaimForm
            policy={activePolicy}
            language={language}
            onSubmit={handleSpecializedFormSubmit}
            isSubmitting={isSubmitting}
          />
        );
      case 'accident':
        return (
          <AccidentClaimForm
            policy={activePolicy}
            language={language}
            onSubmit={handleSpecializedFormSubmit}
            isSubmitting={isSubmitting}
          />
        );
      case 'life':
        return (
          <LifeClaimForm
            policy={activePolicy}
            language={language}
            onSubmit={handleSpecializedFormSubmit}
            isSubmitting={isSubmitting}
          />
        );
      case 'health':
        return (
          <HealthClaimForm
            policy={activePolicy}
            language={language}
            onSubmit={handleSpecializedFormSubmit}
            isSubmitting={isSubmitting}
          />
        );
      case 'bike':
        return (
          <BikeClaimForm
            policy={activePolicy}
            language={language}
            onSubmit={handleSpecializedFormSubmit}
            isSubmitting={isSubmitting}
          />
        );
      case 'other':
      default:
        return (
          <OtherClaimForm
            policy={activePolicy}
            language={language}
            onSubmit={handleSpecializedFormSubmit}
            isSubmitting={isSubmitting}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#F8FAFC] shrink-0">
          <div className="flex items-center gap-3">
            {selectedType && step === 'form' && (
              <button
                type="button"
                onClick={() => setSelectedType(null)}
                className="p-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[#172033] text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Change Category</span>
              </button>
            )}
            <div>
              <h2 className="text-lg font-bold text-[#172033] font-['Outfit'] flex items-center gap-2">
                <span>
                  {step === 'success'
                    ? (language === 'hi' ? 'क्लेम पंजीकरण पुष्टि' : 'Claim Registration Confirmed')
                    : selectedType 
                      ? (language === 'hi' ? `${INSURANCE_TYPE_OPTIONS.find(o => o.type === selectedType)?.titleHi} - नया क्लेम` : `${INSURANCE_TYPE_OPTIONS.find(o => o.type === selectedType)?.titleEn} - File New Claim`)
                      : (language === 'hi' ? 'नया बीमा क्लेम दर्ज करें' : 'File a New Insurance Claim')}
                </span>
                {step !== 'success' && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-50 border border-sky-100 text-sky-700 font-bold uppercase">
                    IRDAI FNOL
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#667085]">
                {step === 'success'
                  ? (language === 'hi' ? 'दावा संदर्भ संख्या उत्पन्न और दर्ज कर ली गई है' : 'Claim reference generated and recorded in your account')
                  : selectedType 
                    ? (language === 'hi' ? 'विशेष क्लेम फॉर्म व आवश्यक दस्तावेज' : 'Tailored claim workflow, questions & statutory document checklist')
                    : (language === 'hi' ? 'कृपया अपने बीमा का प्रकार चुनें' : 'Select insurance category to start relevant claim flow')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[#667085] hover:text-[#172033] transition-colors cursor-pointer shadow-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F6F8FC]">

          {/* SCREEN 1: CATEGORY PICKER */}
          {!selectedType && step === 'form' && (
            <div className="space-y-6">
              <div className="text-center max-w-lg mx-auto">
                <span className="px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-xs font-semibold uppercase tracking-wider">
                  {language === 'hi' ? 'बीमा श्रेणी चुनें' : 'Step 1: Choose Insurance Category'}
                </span>
                <h3 className="text-xl font-bold text-[#172033] font-['Outfit'] mt-2">
                  {language === 'hi' ? 'आप किस बीमा के लिए क्लेम दर्ज करना चाहते हैं?' : 'What type of insurance claim are you filing today?'}
                </h3>
                <p className="text-xs text-[#667085] mt-1">
                  Each policy category loads its tailored inspection questionnaire, coverage verification, and IRDAI statutory document checklist.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {INSURANCE_TYPE_OPTIONS.map((opt) => (
                  <div
                    key={opt.type}
                    onClick={() => handleSelectCategory(opt.type)}
                    className={`p-4 rounded-2xl bg-white border border-slate-200 ${opt.borderHover} cursor-pointer transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between space-y-3 group shadow-xs`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 shadow-xs group-hover:border-sky-300 transition-colors">
                        {opt.icon}
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F8FAFC] border border-slate-200 text-[#667085] font-semibold">
                        {opt.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#172033] text-sm font-['Outfit'] group-hover:text-sky-600 transition-colors">
                        {isHindi ? opt.titleHi : opt.titleEn}
                      </h4>
                      <p className="text-[11px] text-[#667085] mt-1 line-clamp-2 leading-relaxed">
                        {isHindi ? opt.descHi : opt.descEn}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-sky-600 font-semibold">
                      <span>{isHindi ? 'क्लेम शुरू करें' : 'Start Claim'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCREEN 2: TYPE-SPECIFIC CLAIM FORM */}
          {selectedType && step === 'form' && (
            <div className="space-y-6">
              {/* Policy Selector if user has multiple policies of this type */}
              {matchingPolicies.length > 1 && (
                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-sky-600 uppercase font-bold tracking-wider block">
                      Underwriting Policy Selection:
                    </span>
                    <span className="text-xs text-[#172033] font-semibold">
                      Select which {selectedType} policy covers this loss incident
                    </span>
                  </div>
                  <select
                    value={selectedPolicyId}
                    onChange={e => setSelectedPolicyId(e.target.value)}
                    className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-[#172033] text-xs font-semibold focus:outline-none focus:border-sky-500 shadow-xs"
                  >
                    {matchingPolicies.map(pol => (
                      <option key={pol.id} value={pol.id}>
                        {pol.title} ({pol.policyNumber})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Specialized Form Render */}
              {renderCategoryForm()}
            </div>
          )}

          {/* SCREEN 3: DYNAMIC CLAIM SUCCESS VIEW */}
          {step === 'success' && submittedClaim && (
            <ClaimSuccessView
              claim={submittedClaim}
              language={language}
              onViewClaimsTracker={() => {
                setSelectedType(null);
                setStep('form');
                onClose();
              }}
              onCloseModal={() => {
                setSelectedType(null);
                setStep('form');
                onClose();
              }}
            />
          )}

        </div>

      </div>
    </div>
  );
};

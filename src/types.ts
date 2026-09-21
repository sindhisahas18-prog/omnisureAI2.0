export type NavigationTab = 'home' | 'policies' | 'claims' | 'ai' | 'docscan' | 'profile' | 'tutorial' | 'auth';

export type Language = 'en' | 'hi';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  city?: string;
  state?: string;
  vehicleRegNo?: string;
  preferredPolicyType?: string;
  avatar?: string;
  customerId?: string;
  kycVerified?: boolean;
  isLoggedIn: boolean;
  memberSince?: string;
}

export type DamageType = 
  | 'Damaged' 
  | 'Broken' 
  | 'Scratched' 
  | 'Dented' 
  | 'Cracked' 
  | 'Missing' 
  | 'Not damaged';

export type DamageSeverity = 'Minor' | 'Moderate' | 'Severe' | 'Completely damaged';

export type CoverageStatus = 'covered' | 'requires_verification' | 'not_covered';

export interface VehiclePartDefinition {
  id: string;
  name: string;
  nameHi: string;
  category: 'exterior_front' | 'exterior_rear' | 'exterior_sides' | 'glass_roof' | 'lighting' | 'wheels_chassis' | 'addons';
  defaultCovered: boolean;
  excessRule?: string;
  viewSection: 'front' | 'rear' | 'cabin' | 'left' | 'right' | 'wheels';
}

export interface PartDamageRecord {
  partId: string;
  partName: string;
  partNameHi?: string;
  damageType: DamageType;
  severity: DamageSeverity;
  coverageStatus: CoverageStatus;
  coverageReason: string;
  photos: string[];
  aiAnalysis?: {
    detectedDamageType: string;
    estimatedSeverity: DamageSeverity;
    relevanceScore: number;
    additionalPhotosRecommended: boolean;
    confidence: number;
    observations: string;
  };
  notes?: string;
}

export type InsuranceType = 
  | 'motor' 
  | 'bike' 
  | 'health' 
  | 'home' 
  | 'travel' 
  | 'gadget' 
  | 'accident' 
  | 'life' 
  | 'other';

export interface PolicyPartRule {
  covered: boolean;
  status: CoverageStatus;
  reason: string;
  deductible: number;
  depreciationRate?: number;
}

export interface InsurancePolicy {
  id: string;
  policyNumber: string;
  title: string;
  titleHi: string;
  type: InsuranceType;
  subType?: string;
  holderName: string;
  vehicleDetails?: {
    make: string;
    model: string;
    variant: string;
    year: number;
    regNumber: string;
    vin: string;
    engineNumber: string;
    fuelType: string;
  };
  bikeDetails?: {
    make: string;
    model: string;
    year: number;
    regNumber: string;
    engineCC: number;
  };
  propertyDetails?: {
    address: string;
    propertyType: string;
    carpetAreaSqFt: number;
  };
  insuredDeclaredValue: number; // IDV in INR
  sumInsured?: number; // Alias for IDV / Health sum insured
  premiumAmount: number;
  deductible: number; // Standard compulsory excess
  startDate: string;
  expiryDate: string;
  status: 'active' | 'expiring_soon' | 'expired';
  coveredPartIds: string[];
  partCoverageRules: Record<string, PolicyPartRule>;
  addons: string[];
  documents: {
    name: string;
    size: string;
    date: string;
  }[];
}

export interface ClaimTimelineEvent {
  stage: string;
  stageKey: 'submitted' | 'verified' | 'assessment' | 'review' | 'approval' | 'settlement';
  timestamp: string;
  status: 'completed' | 'current' | 'pending';
  description: string;
}

export interface ClaimDocumentRecord {
  name: string;
  documentType: string;
  size?: string;
  uploadedAt: string;
  status: 'verified' | 'pending' | 'rejected';
}

export interface InsuranceClaim {
  id: string;
  claimNumber: string;
  insuranceType: InsuranceType;
  policyId: string;
  policyNumber: string;
  policyTitle: string;
  assetName: string; // Vehicle name, Patient name, Property, Gadget name, etc.
  vehicleName?: string; // Backwards compatible with car views
  regNumber?: string;
  incidentDate: string;
  incidentLocation: string;
  incidentDescription: string;
  damagedParts: PartDamageRecord[];
  photos: string[];
  claimStatus: 'Claim Submitted' | 'Documents Verified' | 'Damage Assessment' | 'Claim Review' | 'Approved' | 'Settlement';
  estimatedAmount: number;
  approvedAmount?: number;
  deductibleApplied: number;
  netPayoutEstimate: number;
  nextStep: string;
  createdAt: string;
  timeline: ClaimTimelineEvent[];
  questionsAnswered: {
    question: string;
    answer: string;
  }[];
  // Specialized Claim Flow Data
  specializedDetails?: {
    // Health Claim
    hospitalName?: string;
    patientName?: string;
    ailment?: string;
    isCashless?: boolean;
    roomCategory?: string;
    admissionDate?: string;
    dischargeDate?: string;
    tpaPreAuthId?: string;

    // Bike Claim
    bikeModel?: string;
    helmetWorn?: boolean;
    odometerKm?: number;

    // Home Claim (Bharat Griha Raksha / Property)
    propertyAddress?: string;
    propertyType?: string;
    damageCause?: string;
    incidentType?: string;
    incidentTime?: string;
    affectedRooms?: string[];
    damagedItems?: string[];
    structuralDamage?: boolean;
    firFiled?: boolean;
    firNumber?: string;
    fireReportAttached?: boolean;
    surveyorName?: string;

    // Travel Claim (Tata AIG / HDFC ERGO)
    originCity?: string;
    destinationCountry?: string;
    destinationCity?: string;
    airlineCarrier?: string;
    pnrNumber?: string;
    carrierPIRNumber?: string;
    travelLossType?: string;
    departureDate?: string;
    returnDate?: string;
    delayHours?: number;
    delayDurationHours?: number;
    baggageItemsLost?: string[];
    overseasHospital?: string;
    passportNumber?: string;

    // Gadget Claim (AppleCare+ / Digit / ICICI Lombard)
    deviceType?: string;
    deviceBrand?: string;
    deviceModel?: string;
    purchaseDate?: string;
    purchaseInvoiceNo?: string;
    originalPrice?: number;
    damagedComponent?: string;
    gadgetDamageNature?: string;
    damageSeverity?: string;
    imeiNumber?: string;
    serialNumber?: string;
    warrantyStatus?: string;
    authorizedServiceCenter?: string;
    incidentDescription?: string;

    // Personal Accident (Saral Suraksha Bima / SBI General)
    accidentDetails?: string;
    injuryCategory?: string;
    injuryNature?: string;
    doctorName?: string;
    doctorRegNo?: string;
    hospitalClinic?: string;
    admissionPeriod?: string;
    disabilityPercentage?: number;
    daysBedRest?: number;
    mlcFirNumber?: string;

    // Life Claim / Term Insurance (LIC / HDFC Life)
    demiseDate?: string;
    causeOfDeath?: string;
    placeOfDeath?: string;
    deathCertificateNo?: string;
    nomineeName?: string;
    nomineeRelation?: string;
    nomineeContact?: string;
    nomineePan?: string;
    nomineeBankAccount?: string;
    bankIfscCode?: string;
    claimantStatementSigned?: boolean;

    // Commercial / Other / General claims
    claimTitle?: string;
    incidentCategory?: string;
    claimantName?: string;
    contactNumber?: string;
    selectedDocuments?: string[];
  };
  uploadedDocuments?: ClaimDocumentRecord[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  isVoiceInput?: boolean;
  language: Language;
  metadata?: {
    underwritingAssessment?: UnderwritingResult;
    suggestedActions?: string[];
    coverageVerification?: {
      partName: string;
      status: CoverageStatus;
      details: string;
    }[];
  };
}

export interface UnderwritingResult {
  customerName: string;
  vehicleModel: string;
  vehicleAgeYears: number;
  cityRiskTier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  idvAmount: number;
  annualPremiumQuote: number;
  riskScore: number; // 0 - 100
  riskLevel: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  eligibilityStatus: 'Pre-Approved' | 'Approved with Endorsement' | 'Manual Inspection Required';
  informationConsidered: string[];
  missingInformation: string[];
  inconsistenciesDetected: string[];
  requiredNextSteps: string[];
}

export interface DynamicClaimQuestion {
  id: string;
  partId: string;
  partName: string;
  questionEn: string;
  questionHi: string;
  optionsEn: string[];
  optionsHi: string[];
}

export type DocumentCategory = 
  | 'vehicle_rc' 
  | 'driving_license' 
  | 'medical_bill' 
  | 'hospital_discharge' 
  | 'repair_estimate' 
  | 'insurance_policy' 
  | 'identity_proof' 
  | 'police_fir' 
  | 'other';

export interface DocumentExtractedField {
  label: string;
  labelHi: string;
  value: string;
  confidence: number; // 0-100
  category: 'identity' | 'dates' | 'financial' | 'asset' | 'authorization' | 'medical' | 'other';
  status: 'valid' | 'warning' | 'missing';
}

export interface DocumentVerificationCheck {
  id: string;
  title: string;
  titleHi: string;
  status: 'passed' | 'warning' | 'failed';
  score: number; // 0-100
  details: string;
  detailsHi: string;
}

export interface MissingInfoItem {
  id: string;
  field: string;
  fieldHi: string;
  importance: 'critical' | 'required' | 'recommended';
  reason: string;
  reasonHi: string;
  recommendation: string;
  recommendationHi: string;
}

export interface FraudSignal {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  signalName: string;
  signalNameHi: string;
  description: string;
  descriptionHi: string;
  passed: boolean;
  confidence: number;
}

export interface DocumentScanResult {
  id: string;
  documentType: string;
  documentTypeHi: string;
  documentCategory: DocumentCategory;
  fileName: string;
  fileSize?: string;
  thumbnailUrl?: string;
  scannedAt: string;
  authenticityScore: number; // 0-100
  authenticityStatus: 'verified' | 'review_required' | 'suspicious' | 'rejected';
  fraudRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  fraudRiskScore: number; // 0-100 (0 = safe, 100 = extreme fraud risk)
  summaryEn: string;
  summaryHi: string;
  extractedFields: DocumentExtractedField[];
  verificationChecks: DocumentVerificationCheck[];
  missingInformation: MissingInfoItem[];
  fraudSignals: FraudSignal[];
  rawOcrSnippet?: string;
}


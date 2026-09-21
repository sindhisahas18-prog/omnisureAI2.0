import { InsuranceType } from '../types';

export interface InsurerProviderInfo {
  id: string;
  name: string;
  shortName: string;
  irdaRegNo: string;
  tollFree: string;
  claimSupportHours: string;
  networkSize: string;
  specialty: string;
}

export interface InsuranceCategoryKnowledge {
  type: InsuranceType;
  titleEn: string;
  titleHi: string;
  tagline: string;
  leadingInsurers: string[];
  standardPolicyName: string;
  regulatoryFramework: string;
  coveredPerils: {
    name: string;
    description: string;
    isStandard: boolean;
  }[];
  standardExclusions: string[];
  mandatoryClaimDocuments: {
    name: string;
    code: string;
    description: string;
    isMandatory: boolean;
    appliesTo?: string[];
  }[];
  proceduralSteps: {
    step: number;
    title: string;
    description: string;
    estimatedTime: string;
  }[];
  claimQuestions: {
    id: string;
    questionEn: string;
    questionHi: string;
    options: string[];
  }[];
  incidentOptions: string[];
  componentOptions: string[];
}

export const REPUTED_INDIAN_INSURERS: InsurerProviderInfo[] = [
  {
    id: 'hdfc-ergo',
    name: 'HDFC ERGO General Insurance Company Limited',
    shortName: 'HDFC ERGO',
    irdaRegNo: '146',
    tollFree: '1800 2666 400',
    claimSupportHours: '24x7 Digital FNOL & Spot Surveyor',
    networkSize: '14,000+ Cashless Hospitals & 9,800+ Cashless Garages',
    specialty: 'Optima Secure Health, Motor Zero-Depreciation & Home Bharat Griha Raksha'
  },
  {
    id: 'icici-lombard',
    name: 'ICICI Lombard General Insurance Company Ltd.',
    shortName: 'ICICI Lombard',
    irdaRegNo: '115',
    tollFree: '1800 2666',
    claimSupportHours: '24x7 Instant Live Video Inspection',
    networkSize: '10,000+ Cashless Garages & 7,500+ Healthcare Providers',
    specialty: 'InstaSpect Motor Claims, Mobile & Gadget Protection, Travel Shield'
  },
  {
    id: 'tata-aig',
    name: 'Tata AIG General Insurance Company Limited',
    shortName: 'Tata AIG',
    irdaRegNo: '108',
    tollFree: '1800 266 7780',
    claimSupportHours: '24x7 Global Assistance Desk',
    networkSize: '8,200+ Network Garages & Global Emergency Assistance',
    specialty: 'Travel Guard Worldwide, Home Property Shield, Auto Secure'
  },
  {
    id: 'bajaj-allianz',
    name: 'Bajaj Allianz General Insurance Co. Ltd.',
    shortName: 'Bajaj Allianz',
    irdaRegNo: '113',
    tollFree: '1800 209 5858',
    claimSupportHours: '24x7 Motor On-The-Spot (OTS) Claims',
    networkSize: '9,000+ Cashless Garages & 8,000+ Cashless Hospitals',
    specialty: 'DriveSmart Telematics, Health Guard, Travel Companion'
  },
  {
    id: 'sbi-general',
    name: 'SBI General Insurance Company Limited',
    shortName: 'SBI General',
    irdaRegNo: '144',
    tollFree: '1800 102 1111',
    claimSupportHours: '24x7 Claims Intimation',
    networkSize: '22,000+ SBI Branch Touchpoints across India',
    specialty: 'Saral Suraksha Bima (Personal Accident), Bharat Griha Raksha'
  },
  {
    id: 'new-india',
    name: 'The New India Assurance Company Limited',
    shortName: 'New India Assurance',
    irdaRegNo: '190',
    tollFree: '1800 209 1415',
    claimSupportHours: 'National 24x7 Emergency Helpdesk',
    networkSize: 'Largest Public Sector Insurer in India (Govt. of India Owned)',
    specialty: 'Standard IRDAI Fire, Home, Motor Tariff & Overseas Mediclaim'
  },
  {
    id: 'lic-india',
    name: 'Life Insurance Corporation of India (LIC)',
    shortName: 'LIC of India',
    irdaRegNo: '512',
    tollFree: '022 6827 6827',
    claimSupportHours: 'National Fast-Track Claim Desk',
    networkSize: '2,048 Branch Offices across all Indian Districts',
    specialty: 'Tech Term, Yuva Term, Jeevan Amar & Fast-Track Nominee NEFT Settlements'
  },
  {
    id: 'godigit',
    name: 'Go Digit General Insurance Limited',
    shortName: 'Digit Insurance',
    irdaRegNo: '158',
    tollFree: '1800 258 5956',
    claimSupportHours: '100% Paperless Mobile Self-Inspection',
    networkSize: '6,000+ Direct Cashless Repair Centers',
    specialty: 'Mobile & Electronics Shield, Zero-Depreciation Motor, Instant Flight Delay Payout'
  }
];

export const INDIAN_INSURANCE_KNOWLEDGE: Record<InsuranceType, InsuranceCategoryKnowledge> = {
  home: {
    type: 'home',
    titleEn: 'Home & Property Insurance',
    titleHi: 'गृह व संपत्ति बीमा (Bharat Griha Raksha)',
    tagline: 'Standard IRDAI Bharat Griha Raksha & Contents Coverage',
    leadingInsurers: ['HDFC ERGO', 'ICICI Lombard', 'Tata AIG', 'SBI General', 'New India Assurance'],
    standardPolicyName: 'Bharat Griha Raksha Home Structure & Contents Policy',
    regulatoryFramework: 'IRDAI Standardized Home Insurance Product (Ref: IRDAI/NL-GEN/GDL/2021)',
    coveredPerils: [
      { name: 'Fire & Lightning', description: 'Damage caused by accidental fire, explosion, or lightning strike to building structure or contents.', isStandard: true },
      { name: 'STFI (Storm, Cyclone, Typhoon, Tempest, Flood & Inundation)', description: 'Full indemnity against monsoon waterlogging, flooding, and torrential cyclone damage.', isStandard: true },
      { name: 'Earthquake & Subsidence', description: 'Earth tremor and ground movement affecting foundations or load-bearing masonry.', isStandard: true },
      { name: 'Bursting / Overflowing of Water Tanks & Pipes', description: 'Accidental pipe rupture, appliance leakage, or overhead tank overflow causing indoor damage.', isStandard: true },
      { name: 'Burglary, Housebreaking & Theft', description: 'Theft of valuable household appliances, electronics, furniture, or fixtures with evidence of forcible entry.', isStandard: true },
      { name: 'Impact Damage', description: 'Physical damage caused by falling trees, aerial devices, or external road vehicles impacting the boundary or wall.', isStandard: true }
    ],
    standardExclusions: [
      'Normal wear, tear, corrosion, or gradual wall seepage due to aging structure',
      'Wilful neglect or intentional destruction by the insured',
      'Loss of precious bullion, cash exceeding locker sub-limit (standard ₹50,000)',
      'War, invasion, acts of foreign enemies, and nuclear perils'
    ],
    mandatoryClaimDocuments: [
      { name: 'Duly Executed Claim Form', code: 'DOC-HOM-01', description: 'Formal statement signed by the policyholder detailing the cause and estimated loss.', isMandatory: true },
      { name: 'Policy Schedule & Endorsements', code: 'DOC-HOM-02', description: 'Active policy document showing structure and contents sum insured breakdown.', isMandatory: true },
      { name: 'Detailed Itemized Loss Assessment / Repair Bill', code: 'DOC-HOM-03', description: 'Contractor quotation or itemized inventory of damaged electronics, furniture, or flooring.', isMandatory: true },
      { name: 'Photographs & Video Walkthrough of Damaged Property', code: 'DOC-HOM-04', description: 'Clear geo-tagged visual evidence showing damage before repairs or clearing debris.', isMandatory: true },
      { name: 'Fire Brigade Report (in case of Fire)', code: 'DOC-HOM-05', description: 'Official municipal fire station incident report certifying time, cause, and response.', isMandatory: false, appliesTo: ['Fire & Lightning'] },
      { name: 'Police First Information Report (FIR) / Panchnama', code: 'DOC-HOM-06', description: 'Mandatory police report for burglary, theft, vandalism, or malicious physical damage.', isMandatory: false, appliesTo: ['Burglary, Housebreaking & Theft'] },
      { name: 'Cancelled Cheque for NEFT Payout', code: 'DOC-HOM-07', description: 'CTS-2010 compliant cancelled cheque with policyholder account details.', isMandatory: true }
    ],
    proceduralSteps: [
      { step: 1, title: 'Immediate Incident Intimation', description: 'Notify insurer within 24-48 hours. Generate FNOL reference number.', estimatedTime: 'Immediate (Instant)' },
      { step: 2, title: 'IRDAI Surveyor Deputation', description: 'Independent licensed surveyor assigned under Section 64UM of Insurance Act.', estimatedTime: 'Within 24-48 hours' },
      { step: 3, title: 'On-Site Loss Assessment & Verification', description: 'Surveyor inspects structural masonry, ceilings, electronics, and repair estimates.', estimatedTime: '2 to 3 days' },
      { step: 4, title: 'Survey Report & Settlement Approval', description: 'Direct Electronic NEFT payout credited to policyholder bank account.', estimatedTime: '5 to 7 working days' }
    ],
    claimQuestions: [
      {
        id: 'home_incident_nature',
        questionEn: 'What is the primary cause of damage to your residential property?',
        questionHi: 'आपकी आवासीय संपत्ति को हुई क्षति का मुख्य कारण क्या है?',
        options: ['Water Pipe Burst & Ceiling Seepage', 'Monsoon Flood & Inundation', 'Fire / Short-Circuit Breakdown', 'Burglary & Housebreaking Break-in', 'Impact from Falling Tree / External Object', 'Electronic Appliance Voltage Surge']
      },
      {
        id: 'home_occupancy_status',
        questionEn: 'Was the property occupied at the time the incident occurred?',
        questionHi: 'क्या घटना के समय संपत्ति में कोई निवास कर रहा था?',
        options: ['Yes, self-occupied by policyholder & family', 'Yes, occupied by authorized tenant', 'Unoccupied for less than 30 consecutive days', 'Unoccupied for more than 30 days']
      },
      {
        id: 'home_immediate_mitigation',
        questionEn: 'Have you taken immediate emergency steps to prevent further damage or water ingress?',
        questionHi: 'क्या आपने क्षति को और अधिक बढ़ने से रोकने हेतु त्वरित सुरक्षा उपाय किए हैं?',
        options: ['Yes, main water supply / power cut off immediately', 'Yes, professional contractor deployed to mitigate damage', 'Pending surveyor physical inspection']
      }
    ],
    incidentOptions: [
      'Water Pipe Burst & Ingress',
      'Fire & Short-Circuit Blaze',
      'Monsoon Flooding & Inundation (STFI)',
      'Burglary / Theft / Break-in',
      'Earthquake & Structural Masonry Crack',
      'High Voltage Appliance Surge Breakdown',
      'Storm & Heavy Rain Damage to Roof / Balcony'
    ],
    componentOptions: [
      'Living Room False Ceiling & Plaster',
      'Imported Hardwood / Vitrified Tile Flooring',
      'Kitchen Modular Cabinets & Gas Pipeline',
      'Smart TV, Home Theatre & Soundbar',
      'Inverter AC & HVAC Compressor Units',
      'Double Door Refrigerator & Washing Machine',
      'Master Bedroom Wardrobes & Woodwork',
      'Roofing & Waterproofing Membrane'
    ]
  },

  travel: {
    type: 'travel',
    titleEn: 'International & Domestic Travel Insurance',
    titleHi: 'अंतर्राष्ट्रीय व घरेलू यात्रा बीमा (Global Travel Guard)',
    tagline: 'Worldwide Overseas Mediclaim, Baggage & Flight Disruption Shield',
    leadingInsurers: ['Tata AIG', 'HDFC ERGO', 'Bajaj Allianz', 'ICICI Lombard', 'Digit Insurance'],
    standardPolicyName: 'Tata AIG Travel Guard / HDFC ERGO Global Explorer Plan',
    regulatoryFramework: 'IRDAI Overseas Mediclaim & Travel Insurance Regulations',
    coveredPerils: [
      { name: 'Emergency Cashless Medical Treatment & Evacuation', description: 'In-patient hospitalisation, ICU, and medical repatriation costs incurred outside India.', isStandard: true },
      { name: 'Flight Delay & Missed Connection Surcharge', description: 'Reimbursement of hotel accommodation, meals, and rebooking costs if carrier delayed >6 hours.', isStandard: true },
      { name: 'Checked-in Baggage Loss / Total Destruction', description: 'Indemnity up to policy sum insured for luggage misplaced or destroyed in airline custody.', isStandard: true },
      { name: 'Baggage Delay (>12 Hours)', description: 'Emergency reimbursement for purchasing essential clothing, toiletries, and medications.', isStandard: true },
      { name: 'Trip Cancellation & Curtailment', description: 'Refund of non-refundable flight and hotel bookings due to sickness, injury, or natural disaster.', isStandard: true },
      { name: 'Loss of Passport & Travel Documents', description: 'Expenses incurred in obtaining emergency certificates and duplicate passport reconstruction.', isStandard: true }
    ],
    standardExclusions: [
      'Pre-existing medical ailments unless covered under life-threatening emergency stabilization clause',
      'Traveling against medical advice or for medical tourism purposes',
      'Participation in hazardous extreme adventure sports without dedicated endorsement',
      'Loss of baggage left unattended in public vehicles or unverified transit'
    ],
    mandatoryClaimDocuments: [
      { name: 'Overseas Travel Claim Form', code: 'DOC-TRV-01', description: 'Completed claim document specifying airline, flight numbers, and dates.', isMandatory: true },
      { name: 'E-Ticket & Boarding Passes', code: 'DOC-TRV-02', description: 'Original airline tickets and boarding passes showing passenger name and date.', isMandatory: true },
      { name: 'Passport Copy with Immigration Exit & Entry Stamps', code: 'DOC-TRV-03', description: 'Full passport scan showing departure from India and arrival in destination country.', isMandatory: true },
      { name: 'Property Irregularity Report (PIR) from Airline', code: 'DOC-TRV-04', description: 'Mandatory carrier report issued at airport baggage counter for delayed or lost luggage.', isMandatory: false, appliesTo: ['Checked-in Baggage Loss / Total Destruction', 'Baggage Delay (>12 Hours)'] },
      { name: 'Airline Carrier Delay Certificate / Written Endorsement', code: 'DOC-TRV-05', description: 'Official written letter from airline certifying exact hours and reason for delay.', isMandatory: false, appliesTo: ['Flight Delay & Missed Connection Surcharge'] },
      { name: 'Itemized Purchase Receipts for Essential Goods / Meals', code: 'DOC-TRV-06', description: 'Original invoices for replacement toiletries, apparel, or hotel accommodation.', isMandatory: true },
      { name: 'Cancelled Cheque for NEFT Payout', code: 'DOC-TRV-07', description: 'Indian bank account cancelled cheque for electronic foreign exchange conversion.', isMandatory: true }
    ],
    proceduralSteps: [
      { step: 1, title: '24x7 Global Assistance Notification', description: 'Contact international helpline or log digital claim via OMNISURE App.', estimatedTime: 'Immediate' },
      { step: 2, title: 'Airport Airline Endorsement & PIR Issuance', description: 'Obtain Property Irregularity Report (PIR) or flight delay certification from airline desk.', estimatedTime: 'At airport transit' },
      { step: 3, title: 'Automated Document & Boarding Pass Audit', description: 'AI cross-verifies PNR records, flight tracker radar, and expense receipts.', estimatedTime: '24 hours' },
      { step: 4, title: 'Direct NEFT Settlement Disbursement', description: 'Approved claim amount credited directly to Indian bank account.', estimatedTime: '3 to 5 business days' }
    ],
    claimQuestions: [
      {
        id: 'travel_incident_type',
        questionEn: 'What travel disruption or incident are you claiming for?',
        questionHi: 'आप किस यात्रा व्यवधान या घटना के लिए क्लेम दर्ज कर रहे हैं?',
        options: ['Checked-in Baggage Delay (>12 Hours)', 'Total Baggage Misplacement / Loss', 'Flight Delay Exceeding 6 Hours', 'Emergency Overseas Hospitalization', 'Trip Cancellation Due to Medical Emergency', 'Emergency Passport Loss Assistance']
      },
      {
        id: 'travel_airline_compensation',
        questionEn: 'Has the airline common carrier provided any compensation or interim vouchers?',
        questionHi: 'क्या एयरलाइन कंपनी ने कोई मुआवजा या अंतरिम वाउचर प्रदान किया है?',
        options: ['No, no compensation received from airline', 'Yes, meal / hotel vouchers provided', 'Yes, preliminary partial baggage payout received']
      }
    ],
    incidentOptions: [
      'Checked-in Baggage Delay (>12 Hours)',
      'Total Baggage Loss / Misplacement',
      'Flight Delay Exceeding 6 Hours',
      'Missed Connecting Flight Surcharge',
      'Emergency Overseas Medical Hospitalization',
      'Trip Cancellation Due to Medical Emergency',
      'Emergency Passport Loss & Reconstruction'
    ],
    componentOptions: [
      'Hardcase Checked-in Luggage Trolley Bag',
      'Travel Clothing, Thermal Wear & Shoes',
      'Prescription Medications & Personal Toiletries',
      'Emergency Hotel Transit Room Charges',
      'Airport Meal & Refreshment Receipts',
      'Embassy Emergency Travel Certificate Fee',
      'Rebooked Flight Difference Ticket'
    ]
  },

  gadget: {
    type: 'gadget',
    titleEn: 'Device & Mobile Gadget Protection',
    titleHi: 'गैजेट व स्मार्टफोन बीमा (AppleCare+ / Mobile Protect)',
    tagline: 'Accidental Screen Crack, Liquid Ingress & Motherboard Breakdown',
    leadingInsurers: ['Digit Insurance', 'ICICI Lombard', 'HDFC ERGO', 'Bajaj Allianz'],
    standardPolicyName: 'Comprehensive Electronic Equipment & Gadget All-Risk Shield',
    regulatoryFramework: 'IRDAI Electronic Equipment Insurance (EEI) Guidelines',
    coveredPerils: [
      { name: 'Accidental Screen Fracture & OLED Panel Damage', description: 'Covers physical cracks on front display glass, OLED bleeding, touch digitization failure.', isStandard: true },
      { name: 'Liquid Damage & Complete Water Submersion', description: 'Internal short-circuit, corrosion, or speaker failure caused by accidental water or beverage spillage.', isStandard: true },
      { name: 'Motherboard & Logic Board Surge Breakdown', description: 'Electronic hardware failure of central chipset, processor, or charging IC.', isStandard: true },
      { name: 'Back Glass & Camera Module Breakage', description: 'Damage to rear ceramic/matte glass panel and multi-camera sapphire lens assembly.', isStandard: true },
      { name: 'Doorstep Pickup & OEM Certified Cashless Repair', description: 'Free logistics pickup and delivery with genuine OEM parts replacement.', isStandard: true }
    ],
    standardExclusions: [
      'Normal superficial cosmetic scratches or paint chipping that does not affect functionality',
      'Loss or breakdown caused by unauthorized third-party technician modification or jailbreaking',
      'Pre-existing damage prior to policy inception',
      'Mysterious disappearance without police report or corroborating evidence'
    ],
    mandatoryClaimDocuments: [
      { name: 'Original Purchase Tax Invoice', code: 'DOC-DEV-01', description: 'Retail tax invoice showing buyer name, purchase date, price, and matching IMEI/Serial.', isMandatory: true },
      { name: 'High-Resolution Photographs of Damaged Device', code: 'DOC-DEV-02', description: 'Photos showing screen damage, back panel, and device IMEI displayed or on original box.', isMandatory: true },
      { name: 'Authorized Service Center Diagnostic Estimate', code: 'DOC-DEV-03', description: 'Job sheet from Apple Authorized Service Provider, Samsung Care, or OEM center.', isMandatory: true },
      { name: 'Police FIR / Lost Report (in case of Theft/Snatching)', code: 'DOC-DEV-04', description: 'Mandatory police report filed within 24 hours of theft or snatching incident.', isMandatory: false, appliesTo: ['Theft & Robbery'] },
      { name: 'Cancelled Cheque for NEFT Payout', code: 'DOC-DEV-05', description: 'Policyholder bank account cheque for direct reimbursement if cashless not opted.', isMandatory: true }
    ],
    proceduralSteps: [
      { step: 1, title: 'Instant Online FNOL Lodgement', description: 'Log claim with IMEI and upload damaged device photos on OMNISURE.', estimatedTime: '5 minutes' },
      { step: 2, title: 'Doorstep Courier Pickup / Service Center Walk-in', description: 'Device picked up by courier or booked at nearest Apple / OEM authorized service center.', estimatedTime: 'Same day / Next day' },
      { step: 3, title: 'OEM Technical Inspection & Estimate Approval', description: 'Engineer inspects internal liquid sensors and physical components; automated approval issued.', estimatedTime: '24 to 48 hours' },
      { step: 4, title: 'Genuine Part Replacement & Return', description: 'Repaired device returned to doorstep or cashless settlement disbursed directly to center.', estimatedTime: '3 to 5 business days' }
    ],
    claimQuestions: [
      {
        id: 'gadget_cause',
        questionEn: 'How did the physical or liquid damage happen to your device?',
        questionHi: 'आपके उपकरण को भौतिक या तरल क्षति कैसे पहुँची?',
        options: ['Accidental slip from hand onto hard surface / pavement', 'Liquid spill (Water / Coffee / Tea) while in use', 'Accidental pressure / crushing impact in bag or vehicle', 'Electrical voltage spike during high-speed charging']
      },
      {
        id: 'gadget_operability',
        questionEn: 'Is the device currently powering on and responsive to touch input?',
        questionHi: 'क्या उपकरण वर्तमान में चालू हो रहा है और स्क्रीन रिस्पॉन्सिव है?',
        options: ['Yes, display works but glass is badly shattered', 'Display is completely black / bleeding ink pixels', 'Device is dead / does not power on after liquid ingress']
      }
    ],
    incidentOptions: [
      'Accidental Drop & Screen Fracture',
      'Liquid Spill & Water Ingress Submersion',
      'Back Glass & Camera Lens Shatter',
      'Motherboard Logic Board Power Surge',
      'Charging Port & Internal Battery Swelling'
    ],
    componentOptions: [
      'Front Super Retina XDR OLED Screen & Digitizer',
      'Rear Ceramic Shield Glass Panel',
      'Triple Camera Lens Module & Optical Zoom Sensor',
      'A18 Pro / Snapdragon 8 Gen 3 Logic Motherboard',
      'Titanium Frame Chassis & Midframe',
      'Internal Battery & Fast-Charging Sub-Board'
    ]
  },

  accident: {
    type: 'accident',
    titleEn: 'Personal Accident Insurance',
    titleHi: 'व्यक्तिगत दुर्घटना बीमा (Saral Suraksha Bima)',
    tagline: 'Standard IRDAI Table of Benefits for Accidental Death & Disability',
    leadingInsurers: ['SBI General', 'HDFC ERGO', 'Star Health', 'Bajaj Allianz', 'New India Assurance'],
    standardPolicyName: 'Saral Suraksha Bima / Comprehensive Personal Accident Shield',
    regulatoryFramework: 'IRDAI Guidelines on Standard Personal Accident Insurance (Ref: IRDAI/HLT/REG/CIR/037/02/2021)',
    coveredPerils: [
      { name: 'Accidental Death (100% Sum Insured)', description: 'Full 100% capital sum insured payable directly to registered nominee upon accidental demise.', isStandard: true },
      { name: 'Permanent Total Disablement (PTD - 100%)', description: 'Complete loss of sight in both eyes, loss of both hands/feet, or permanent paralysis.', isStandard: true },
      { name: 'Permanent Partial Disablement (PPD - Graded Scale)', description: 'Irrevocable loss of sight in one eye, one limb, or fingers based on IRDAI statutory percentage scale.', isStandard: true },
      { name: 'Temporary Total Disablement (TTD - Weekly Cash Allowance)', description: 'Weekly benefit (up to ₹25,000/week up to 104 weeks) for loss of earning capacity during fracture/confinement.', isStandard: true },
      { name: 'Accidental Hospitalization Medical Expense Cover', description: 'Reimbursement of in-patient hospital room, doctor surgeries, and diagnostic scans.', isStandard: true },
      { name: 'Children Education Grant Rider', description: 'Lump-sum educational security grant (up to ₹5 Lakh) for dependent children.', isStandard: true }
    ],
    standardExclusions: [
      'Self-inflicted injury, suicide attempt, or injuries sustained under influence of intoxicating alcohol/drugs',
      'Participation in criminal or unlawful activities',
      'Breach of law with criminal intent',
      'War, civil unrest, and radiation hazards'
    ],
    mandatoryClaimDocuments: [
      { name: 'Saral Suraksha Claim Intimation Form', code: 'DOC-ACC-01', description: 'Standard claimant statement signed by insured or legal heir detailing accident circumstances.', isMandatory: true },
      { name: 'Police First Information Report (FIR) or Medico-Legal Certificate (MLC)', code: 'DOC-ACC-02', description: 'Mandatory police MLC report certifying road/workplace accident occurred.', isMandatory: true },
      { name: 'Attending Physician & Surgeon Certificate', code: 'DOC-ACC-03', description: 'Detailed medical assessment describing nature of injury, bone fracture, or impairment.', isMandatory: true },
      { name: 'Disability Certificate from Government Medical Board', code: 'DOC-ACC-04', description: 'Required for Permanent Total or Partial Disablement claims certifying percentage disability.', isMandatory: false, appliesTo: ['Permanent Total Disablement', 'Permanent Partial Disablement'] },
      { name: 'Diagnostic X-Ray, MRI Scans & Radiologist Reports', code: 'DOC-ACC-05', description: 'Visual imaging confirming bone fracture, ligament tear, or orthopedic trauma.', isMandatory: true },
      { name: 'Employer Leave Certificate / Income Proof', code: 'DOC-ACC-06', description: 'Required for Temporary Total Disablement weekly cash allowance claims.', isMandatory: false, appliesTo: ['Temporary Total Disablement'] },
      { name: 'Cancelled Cheque for NEFT Payout', code: 'DOC-ACC-07', description: 'Insured bank details with IFSC code for electronic benefit transfer.', isMandatory: true }
    ],
    proceduralSteps: [
      { step: 1, title: 'Accident Intimation & MLC Record', description: 'Notify insurer within 7 days of accident; retain Police MLC & hospital emergency admission papers.', estimatedTime: 'Immediate' },
      { step: 2, title: 'Medical Scrutiny & In-Patient Verification', description: 'Medical panel audits injury severity, radiological reports, and physician certificate.', estimatedTime: '2 to 3 days' },
      { step: 3, title: 'Statutory Disability Assessment Audit', description: 'Evaluation against IRDAI standardized percentage entitlement table.', estimatedTime: '3 to 5 days' },
      { step: 4, title: 'Electronic Benefit Disbursement', description: 'Direct NEFT transfer of lump-sum or weekly disability allowance.', estimatedTime: '5 to 7 business days' }
    ],
    claimQuestions: [
      {
        id: 'accident_nature',
        questionEn: 'What category of injury or disability are you claiming under this policy?',
        questionHi: 'आप इस पॉलिसी के तहत किस प्रकार की चोट या विकलांगता के लिए क्लेम कर रहे हैं?',
        options: [
          'Temporary Total Disablement (Bone Fracture & Recommended Bed Rest)',
          'Permanent Partial Disablement (Loss of single limb / finger / eye)',
          'Permanent Total Disablement (Total loss of mobility / sight / paralysis)',
          'Accidental In-Patient Hospitalization Reimbursement',
          'Accidental Demise (Nominee Claim)'
        ]
      },
      {
        id: 'accident_mlc_status',
        questionEn: 'Was a Medico-Legal Certificate (MLC) or Police Station Intimation logged by the attending hospital?',
        questionHi: 'क्या अस्पताल द्वारा मेडिको-लीगल केस (MLC) या पुलिस सूचना दर्ज की गई थी?',
        options: ['Yes, MLC recorded in hospital emergency casualty', 'Yes, Police FIR registered at local station', 'Non-traffic domestic slip and fall (Doctor statement attached)']
      }
    ],
    incidentOptions: [
      'Road Traffic Accident (Two-Wheeler / Pedestrian / Car)',
      'Slip & Fall on Wet Surface / Staircase Trauma',
      'Sports / Physical Fitness Impact Fracture',
      'Industrial / Workplace Machinery Trauma',
      'Burn & Scald Injuries Requiring Grafting'
    ],
    componentOptions: [
      'Lower Limb Femur / Tibia Compound Fracture',
      'Upper Extremity Forearm / Wrist Scaphoid Fracture',
      'Spinal Vertebrae Compression & Mobility Restriction',
      'Soft Tissue Cruciate Ligament Rupture (ACL/PCL)',
      'Facial Bone & Dental Trauma Restoration'
    ]
  },

  life: {
    type: 'life',
    titleEn: 'Term & Pure Life Insurance',
    titleHi: 'टर्म लाइफ व जीवन बीमा (Life Protector Shield)',
    tagline: 'Section 45 Standard Fast-Track Nominee Death Claim Settlement',
    leadingInsurers: ['LIC of India', 'HDFC Life', 'ICICI Prudential Life', 'SBI Life', 'Tata AIA'],
    standardPolicyName: 'Pure Term Life Protector / LIC Tech Term Plan',
    regulatoryFramework: 'Insurance Act 1938 (Section 45: Indisputability of Life Policies) & IRDAI Protection of Policyholders Interests 2024',
    coveredPerils: [
      { name: 'Natural Death Sum Assured Payout', description: '100% Capital Sum Assured credited directly to nominee bank account via NEFT upon demise of life assured.', isStandard: true },
      { name: 'Accidental Death Benefit Booster Rider', description: 'Additional 50% to 100% rider payout if demise occurs due to vehicular or violent accident.', isStandard: true },
      { name: 'Accelerated Critical Illness Payout', description: 'Lump-sum advance payout of sum assured upon first diagnosis of 36 covered severe illnesses.', isStandard: true },
      { name: 'Waiver of Future Premiums on Total Disability', description: 'All future policy premiums waived while policy remains active till full term.', isStandard: true }
    ],
    standardExclusions: [
      'Suicide clause: Suicide within 12 months of policy commencement/revival is restricted to 80% of total premiums paid',
      'Fraudulent non-disclosure of material medical conditions within initial 3-year incontestability window under Section 45',
      'Death during active participation in civil war or mutiny'
    ],
    mandatoryClaimDocuments: [
      { name: 'Claimant Statement Form (Form 104)', code: 'DOC-LIF-01', description: 'Standard IRDAI death claim application completed and signed by the legal nominee.', isMandatory: true },
      { name: 'Original Certified Municipal Death Certificate', code: 'DOC-LIF-02', description: 'Official death certificate issued by Municipal Corporation or Registrar of Births & Deaths.', isMandatory: true },
      { name: 'Original Policy Document / e-Insurance Account (eIA) Bond', code: 'DOC-LIF-03', description: 'Physical policy schedule certificate or digital eIA account bond record.', isMandatory: true },
      { name: 'Attending Physician Statement & Hospital Indoor Case Records', code: 'DOC-LIF-04', description: 'Medical certificate specifying exact cause of demise, duration of illness, and treatment summary.', isMandatory: true },
      { name: 'Police FIR & Post-Mortem Report (for Accidental Demise)', code: 'DOC-LIF-05', description: 'Mandatory police records for accidental, road collision, or unnatural demise claims.', isMandatory: false, appliesTo: ['Accidental Death Benefit Booster Rider'] },
      { name: 'Nominee Photo Identity & Address Proof (Aadhaar / Passport / Voter ID)', code: 'DOC-LIF-06', description: 'Officially Valid Document (OVD) certifying legal identity and residential address of nominee.', isMandatory: true },
      { name: 'Nominee PAN Card & Cancelled Cheque / Bank Passbook Copy', code: 'DOC-LIF-07', description: 'CTS-compliant cheque with nominee name printed for electronic NEFT settlement transfer.', isMandatory: true }
    ],
    proceduralSteps: [
      { step: 1, title: 'Digital Intimation by Registered Nominee', description: 'Nominee registers claim with policy number and date of demise on OMNISURE portal.', estimatedTime: '10 minutes' },
      { step: 2, title: 'Statutory Section 45 Verification & Document Audit', description: 'Insurer audits death certificate with municipal registry and verifies nominee KYC.', estimatedTime: '3 to 5 working days' },
      { step: 3, title: 'Claims Committee Review & Settlement Approval', description: 'Fast-track settlement approval by National Claims Committee.', estimatedTime: '5 to 7 working days' },
      { step: 4, title: 'Direct NEFT Electronic Benefit Transfer', description: 'Full Capital Sum Assured transferred directly to Nominee bank account without co-pay or tax deduction.', estimatedTime: 'Within 24 hours of approval' }
    ],
    claimQuestions: [
      {
        id: 'life_claim_cause',
        questionEn: 'What is the primary cause of demise of the Life Assured?',
        questionHi: 'बीमित व्यक्ति की मृत्यु का प्राथमिक कारण क्या है?',
        options: ['Critical Illness / Cardiac Ailment / Hospital Demise', 'Sudden Road Traffic / Vehicular Accident', 'Natural Demise due to Age / Multiple Organ Failure', 'Critical Illness Advance Claim (Life Assured Living)']
      },
      {
        id: 'life_nominee_verification',
        questionEn: 'Is the claimant the official registered nominee listed in the policy schedule?',
        questionHi: 'क्या दावेदार पॉलिसी शेड्यूल में दर्ज आधिकारिक पंजीकृत नॉमिनी हैं?',
        options: ['Yes, I am the primary registered Nominee (Spouse / Child / Parent)', 'Yes, legal heir authorized with succession certificate / Will', 'Authorized representative holding Power of Attorney']
      }
    ],
    incidentOptions: [
      'Sudden Cardiac Arrest / Hospital Demise',
      'Road Traffic Accident / Vehicular Impact',
      'Advanced Cancer / Organ Failure Complications',
      'Critical Illness Accelerated Rider Claim',
      'Natural Demise at Residence'
    ],
    componentOptions: [
      'Basic Sum Assured Capital Payout (100%)',
      'Accidental Death Benefit Double Cover',
      'Accelerated Critical Illness Payout',
      'Direct NEFT Bank Transfer Payout Mandate'
    ]
  },

  health: {
    type: 'health',
    titleEn: 'Comprehensive Health Insurance',
    titleHi: 'स्वास्थ्य बीमा (Optima Secure Family Floater)',
    tagline: 'Cashless at 14,000+ Network Hospitals with Zero Room Rent Capping',
    leadingInsurers: ['HDFC ERGO', 'Care Health', 'Star Health', 'Niva Bupa', 'ICICI Lombard'],
    standardPolicyName: 'HDFC ERGO Optima Secure / Care Supreme Platinum Plan',
    regulatoryFramework: 'IRDAI Health Insurance Regulations 2024 & Cashless Everywhere Initiative',
    coveredPerils: [
      { name: 'In-Patient Hospitalization (Allergies, Infections, Surgeries)', description: 'Full medical coverage for hospitalization exceeding 24 hours in all network and non-network hospitals.', isStandard: true },
      { name: 'Zero Room Rent Capping', description: 'No proportionate deductions; stay in Single Private AC Room or Suite without penalty.', isStandard: true },
      { name: 'Pre & Post Hospitalization Expenses', description: 'Diagnostic tests and medicines covered for 60 days before and 180 days after hospital stay.', isStandard: true },
      { name: 'Day Care Treatments & Modern Surgeries', description: 'Advanced robotic surgeries, chemotherapy, and procedures requiring <24 hrs hospitalization.', isStandard: true },
      { name: 'AYUSH Treatment & Home Care Coverage', description: 'Ayurveda, Yoga, Unani, Siddha, and Homeopathy treatment at accredited institutions.', isStandard: true },
      { name: 'Cashless Everywhere Network', description: 'Cashless access available across any hospital in India with 48-hour prior intimation.', isStandard: true }
    ],
    standardExclusions: [
      'Cosmetic or plastic surgery unless necessitated by accidental trauma or burns',
      'Experimental or unproven treatments not recognized by Indian Medical Association (IMA)',
      'Hospitalization primarily for observation, diagnostic evaluation, or bed rest without active treatment',
      'Self-inflicted injuries or treatment arising from alcohol or narcotics abuse'
    ],
    mandatoryClaimDocuments: [
      { name: 'Health Insurance Claim Form (Part A & B)', code: 'DOC-HLT-01', description: 'Part A filled by policyholder, Part B certified by attending doctor and hospital.', isMandatory: true },
      { name: 'Hospital Discharge Summary', code: 'DOC-HLT-02', description: 'Comprehensive medical summary detailing diagnosis, clinical investigation, treatment, and discharge advice.', isMandatory: true },
      { name: 'Itemized Final Hospital Bill & Payment Receipts', code: 'DOC-HLT-03', description: 'Detailed break-up of room charges, nursing fees, surgical costs, and medicine bills with paid stamp.', isMandatory: true },
      { name: 'Diagnostic Investigation Reports (Lab Tests, X-Rays, Scans)', code: 'DOC-HLT-04', description: 'Original pathology, blood culture, CT, and MRI reports supporting clinical diagnosis.', isMandatory: true },
      { name: 'Prescriptions & Pharmacy Invoices', code: 'DOC-HLT-05', description: 'Original doctor prescriptions corresponding to all chemist medicine receipts.', isMandatory: true },
      { name: 'Cancelled Cheque for NEFT Payout', code: 'DOC-HLT-06', description: 'Required for reimbursement claims for direct bank deposit.', isMandatory: true }
    ],
    proceduralSteps: [
      { step: 1, title: 'Cashless TPA Desk Pre-Authorization', description: 'Hospital TPA desk submits pre-auth request form to OMNISURE / Insurer.', estimatedTime: '2 to 4 hours' },
      { step: 2, title: 'Interim Approval Guarantee', description: 'AI evaluates policy clauses (zero room rent capping) and issues cashless guarantee letter.', estimatedTime: 'Instant / 1 hour' },
      { step: 3, title: 'Medical Case Sheet & Pharmacy Monitoring', description: 'Daily hospitalization rounds and indoor case papers monitored digitally.', estimatedTime: 'During stay' },
      { step: 4, title: 'Discharge Final Cashless Clearance', description: 'Final bill audited; insurer settles bill directly with hospital accounts desk.', estimatedTime: 'Within 2 hours of discharge bill' }
    ],
    claimQuestions: [
      {
        id: 'health_admission_type',
        questionEn: 'Is this hospital admission an emergency or planned medical hospitalization?',
        questionHi: 'क्या यह अस्पताल में भर्ती आपातकालीन है अथवा पूर्व-नियोजित?',
        options: ['Emergency Admission (Immediate medical intervention needed)', 'Planned Hospitalization (Pre-scheduled surgery or treatment)', 'Post-Hospitalization Out-Patient Reimbursement']
      },
      {
        id: 'health_settlement_preference',
        questionEn: 'Which settlement mode do you prefer for this hospitalization?',
        questionHi: 'इस अस्पताल में भर्ती के लिए आप कौन सा निपटान मोड चुनना चाहते हैं?',
        options: ['Direct Cashless Settlement at Hospital TPA Desk', 'Reimbursement Claim (Pay bills now, claim funds via NEFT later)']
      }
    ],
    incidentOptions: [
      'Acute Viral Infection / Dengue / Typhoid Hospitalization',
      'Cardiology / Coronary Angioplasty Intervention',
      'Orthopedic Joint Replacement / Arthroscopy',
      'Gastroenterology & Laparoscopic Abdominal Surgery',
      'Pediatric Emergency Respiratory Hospitalization'
    ],
    componentOptions: [
      'Hospital Room Rent & Nursing Charges (Zero Capping)',
      'ICU & Critical Care Monitoring Allowance',
      'Surgical Specialist & Anesthetist Professional Fees',
      'Diagnostic Pathology, CT & MRI Scans',
      'Hospital Pharmacy & Surgical Consumables'
    ]
  },

  motor: {
    type: 'motor',
    titleEn: 'Comprehensive Four-Wheeler Motor Cover',
    titleHi: 'कार व मोटर वाहन बीमा (Titanium Zero-Dep Shield)',
    tagline: 'Interactive 3D Damage Blueprint & Instant Cashless Workshop Tie-up',
    leadingInsurers: ['HDFC ERGO', 'ICICI Lombard', 'Tata AIG', 'Bajaj Allianz', 'New India Assurance'],
    standardPolicyName: 'Omnisure Zero-Depreciation Titanium Motor Cover',
    regulatoryFramework: 'IRDAI All India Motor Tariff & General Insurance Rules',
    coveredPerils: [
      { name: 'Accidental External Damage & Collision', description: '100% repair or replacement of damaged panels, bumpers, mirrors, and chassis parts.', isStandard: true },
      { name: 'Zero Depreciation Add-on (Bumper-to-Bumper)', description: 'Zero deduction on plastic, fiber, glass, and rubber parts during replacement.', isStandard: true },
      { name: 'Engine & Gearbox Protector (Hydrostatic Lock)', description: 'Covers water ingress in engine, lubricating oil leakage, and hydrostatic lock during waterlogging.', isStandard: true },
      { name: 'Consumables & Fastener Kit Cover', description: 'Engine oil, coolant, AC refrigerant gas, nuts, bolts, and washers covered in full.', isStandard: true },
      { name: 'Return to Invoice (RTI) Cover', description: 'Full original invoice price plus road tax refunded in total loss or theft.', isStandard: true }
    ],
    standardExclusions: [
      'Driving without a valid Driving Licence (DL) at the time of accident',
      'Driving under influence of alcohol, narcotics, or intoxicating substances',
      'Mechanical breakdown or electrical failure not caused by an external accident',
      'Consequential damage (e.g. driving car with engine oil sump fractured)'
    ],
    mandatoryClaimDocuments: [
      { name: 'Duly Signed Motor Claim Form', code: 'DOC-MTR-01', description: 'Formal intimation describing accident location, speed, and cause.', isMandatory: true },
      { name: 'Vehicle Registration Certificate (RC Book / Smart Card)', code: 'DOC-MTR-02', description: 'Original or DigiLocker verified Registration Certificate.', isMandatory: true },
      { name: 'Driver Driving Licence (DL)', code: 'DOC-MTR-03', description: 'Valid Driving Licence of the person operating vehicle at the time of accident.', isMandatory: true },
      { name: 'Photographs of Damaged Vehicle & Chassis Number Plate', code: 'DOC-MTR-04', description: 'Geo-tagged photos of damage spots and VIN stamped plate.', isMandatory: true },
      { name: 'Police FIR (in case of Third-Party Injury / Theft)', code: 'DOC-MTR-05', description: 'Mandatory police report when third party person or property is injured.', isMandatory: false },
      { name: 'Cashless Garage Repair Estimate & Job Card', code: 'DOC-MTR-06', description: 'Authorized workshop itemized labor and parts estimate.', isMandatory: true }
    ],
    proceduralSteps: [
      { step: 1, title: 'Interactive 3D Damage Tagging', description: 'Pin damaged car components on the interactive diagram with photos.', estimatedTime: '3 minutes' },
      { step: 2, title: 'Automated Policy Coverage & Zero-Dep Audit', description: 'Real-time rule engine matches damaged parts with policy deductible and depreciation.', estimatedTime: 'Instant' },
      { step: 3, title: 'Cashless Network Workshop Deputation', description: 'Car towed or driven to authorized network garage with surveyor appointment.', estimatedTime: 'Within 2 hours' },
      { step: 4, title: 'Digital Surveyor Approval & Cashless Delivery', description: 'Final bill settled directly by insurer with workshop.', estimatedTime: '2 to 4 days' }
    ],
    claimQuestions: [
      {
        id: 'motor_third_party',
        questionEn: 'Was any third party person, external vehicle, or public property injured in this collision?',
        questionHi: 'क्या इस टक्कर में कोई तीसरा व्यक्ति, बाहरी वाहन या सार्वजनिक संपत्ति क्षतिग्रस्त हुई?',
        options: ['No, isolated self-accident / property boundary touch', 'Yes, third party vehicle involved (Police intimation logged)', 'Yes, public railing / barrier damaged']
      }
    ],
    incidentOptions: [
      'Frontal Collision with Vehicle at Signal / Traffic',
      'Rear End Impact from Following Vehicle',
      'Side Impact / Scratching while Overtaking',
      'Waterlogging / Monsoon Engine Submersion',
      'Pothole / Undercarriage Stone Road Hit'
    ],
    componentOptions: [
      'Front Bumper Assembly',
      'Left & Right Headlamp Clusters',
      'Front Windshield Glass with Rain Sensor',
      'Bonnet Hood Metallic Sheet Panel',
      'Radiator & Cooling Condenser Grill',
      'Alloy Wheels & Diamond Cut Rim'
    ]
  },

  bike: {
    type: 'bike',
    titleEn: 'Two-Wheeler & Bike Protection',
    titleHi: 'बाइक व टू-व्हीलर बीमा (Zero-Dep Bike Shield)',
    tagline: 'Zero Depreciation on Metal, Fiber & Rubber with Helmet Safety Compliance',
    leadingInsurers: ['HDFC ERGO', 'ICICI Lombard', 'Bajaj Allianz', 'Tata AIG', 'Digit Insurance'],
    standardPolicyName: 'Omnisure Two-Wheeler Zero-Dep Shield',
    regulatoryFramework: 'IRDAI Two-Wheeler Tariff & Motor Vehicles Act (Section 129 Helmet Compliance)',
    coveredPerils: [
      { name: 'Accidental Crash & Skid Damage', description: 'Covers front fork, handlebars, silencer, fuel tank, and frame.', isStandard: true },
      { name: 'Zero Depreciation Add-on', description: 'Zero deduction on expensive fiber fairings, exhaust silencer, and rubber grips.', isStandard: true },
      { name: 'Pillion Rider Personal Accident Cover', description: 'Accidental death and permanent disability cover up to ₹5 Lakh for co-passenger.', isStandard: true },
      { name: 'Roadside Assistance & Flat Tyre Support', description: 'Towing to nearest service station, fuel delivery, and emergency mechanical support.', isStandard: true }
    ],
    standardExclusions: [
      'Riding two-wheeler without wearing an ISI certified safety helmet (MV Act Section 129 breach)',
      'Triple riding or carrying unauthorized commercial cargo',
      'Riding without a valid two-wheeler Driving Licence',
      'Punctures or gradual tyre tread wear without accidental damage'
    ],
    mandatoryClaimDocuments: [
      { name: 'Two-Wheeler Claim Intimation Form', code: 'DOC-BIK-01', description: 'Intimation of accident location, date, and description.', isMandatory: true },
      { name: 'Bike Registration Certificate (RC)', code: 'DOC-BIK-02', description: 'Copy of valid bike registration certificate.', isMandatory: true },
      { name: 'Two-Wheeler Driving Licence (DL)', code: 'DOC-BIK-03', description: 'Rider valid driving licence with MCWG (Motorcycle with Gear) endorsement.', isMandatory: true },
      { name: 'Photographs of Damaged Motorcycle Parts', code: 'DOC-BIK-04', description: 'Photos showing damaged handlebar, fuel tank, silencer, or crash guards.', isMandatory: true },
      { name: 'Authorized Service Center Estimate', code: 'DOC-BIK-05', description: 'Repair estimate from authorized two-wheeler dealership.', isMandatory: true }
    ],
    proceduralSteps: [
      { step: 1, title: 'Instant Mobile Video / Photo Intimation', description: 'Capture damaged bike components and enter odometer reading on OMNISURE.', estimatedTime: '5 minutes' },
      { step: 2, title: 'Automated Zero-Dep Policy Audit', description: 'Coverage calculation for fiber fairing, engine guards, and silencer.', estimatedTime: 'Instant' },
      { step: 3, title: 'Cashless Dealership Repair Deputation', description: 'Bike inspected at authorized workshop by surveyor.', estimatedTime: '24 hours' },
      { step: 4, title: 'Direct Cashless Payout to Dealership', description: 'Full settlement disbursed with ₹500 standard excess.', estimatedTime: '2 to 3 days' }
    ],
    claimQuestions: [
      {
        id: 'bike_helmet_compliance',
        questionEn: 'Was the rider wearing an ISI/BIS certified safety helmet at the time of the incident?',
        questionHi: 'क्या दुर्घटना के समय राइडर ने आईएसआई प्रमाणित सुरक्षा हेलमेट पहना हुआ था?',
        options: ['Yes, ISI certified full-face helmet worn (Compliant)', 'Yes, open-face ISI helmet worn', 'No helmet worn']
      },
      {
        id: 'bike_pillion_involved',
        questionEn: 'Was a pillion passenger present on the motorcycle during the collision?',
        questionHi: 'क्या टक्कर के समय बाइक पर कोई सह-यात्री (पिलियन) मौजूद था?',
        options: ['No, solo rider only', 'Yes, pillion passenger was present and unhurt', 'Yes, pillion passenger sustained injury (Covered under Add-on)']
      }
    ],
    incidentOptions: [
      'Two-Wheeler Skid on Wet / Gravel Road Surface',
      'Side Collision with Stationary Object / Median',
      'Rear Impact by Another Commuter at Intersection',
      'Pothole Impact Resulting in Front Fork Bend',
      'Hit and Run by Unknown Vehicle while Parked'
    ],
    componentOptions: [
      'Chrome Exhaust Silencer & Heat Shield',
      'Engine Crash Guard & Leg Protector',
      'Fuel Tank Metallic Shell & Emblems',
      'Front Telescopic Fork Assembly',
      'Handlebar & Front Brake / Clutch Levers',
      'Round Headlamp & Indicator Stems'
    ]
  },

  other: {
    type: 'other',
    titleEn: 'General & Specialty Insurance Cover',
    titleHi: 'अन्य विशिष्ट बीमा कवर',
    tagline: 'Standard Claims Intimation for Commercial, Marine & Specialty Risks',
    leadingInsurers: ['New India Assurance', 'United India Insurance', 'National Insurance', 'Oriental Insurance'],
    standardPolicyName: 'Standard Miscellaneous Insurance Policy',
    regulatoryFramework: 'IRDAI General Insurance Guidelines',
    coveredPerils: [
      { name: 'Accidental Loss & Indemnity', description: 'Covered according to schedule endorsements.', isStandard: true }
    ],
    standardExclusions: ['Intentional damage', 'War & nuclear risks'],
    mandatoryClaimDocuments: [
      { name: 'Standard Claim Form', code: 'DOC-OTH-01', description: 'Formal intimation of incident.', isMandatory: true },
      { name: 'Policy Certificate', code: 'DOC-OTH-02', description: 'Copy of policy schedule.', isMandatory: true },
      { name: 'Loss Assessment Bill', code: 'DOC-OTH-03', description: 'Itemized repair quotation.', isMandatory: true }
    ],
    proceduralSteps: [
      { step: 1, title: 'Incident Registration', description: 'Log claim with incident date and description.', estimatedTime: 'Immediate' },
      { step: 2, title: 'Surveyor Review', description: 'Loss assessor audits claim.', estimatedTime: '2 to 3 days' }
    ],
    claimQuestions: [],
    incidentOptions: ['Accidental Damage', 'Theft / Missing Asset', 'Breakdown'],
    componentOptions: ['Insured Asset Replacement', 'Repair Service Labor']
  }
};

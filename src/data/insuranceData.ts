import {
  VehiclePartDefinition,
  InsurancePolicy,
  InsuranceClaim,
  DynamicClaimQuestion
} from '../types';

export const VEHICLE_PARTS: VehiclePartDefinition[] = [
  // Front Section
  { id: 'front_bumper', name: 'Front Bumper', nameHi: 'फ्रंट बम्पर', category: 'exterior_front', defaultCovered: true, viewSection: 'front' },
  { id: 'front_grille', name: 'Front Grille', nameHi: 'फ्रंट ग्रिल', category: 'exterior_front', defaultCovered: true, viewSection: 'front' },
  { id: 'bonnet_hood', name: 'Bonnet / Hood', nameHi: 'बोनेट / हुड', category: 'exterior_front', defaultCovered: true, viewSection: 'front' },
  { id: 'headlight_left', name: 'Headlight — Left', nameHi: 'हेडलाइट — बायाँ', category: 'lighting', defaultCovered: true, viewSection: 'front' },
  { id: 'headlight_right', name: 'Headlight — Right', nameHi: 'हेडलाइट — दायाँ', category: 'lighting', defaultCovered: true, viewSection: 'front' },
  { id: 'fog_lamp', name: 'Fog Lamp (Pair)', nameHi: 'फॉग लैंप', category: 'lighting', defaultCovered: true, viewSection: 'front' },
  { id: 'number_plate_front', name: 'Number Plate — Front', nameHi: 'नंबर प्लेट — आगे', category: 'exterior_front', defaultCovered: true, viewSection: 'front' },

  // Side Left
  { id: 'front_left_fender', name: 'Front Left Fender', nameHi: 'फ्रंट लेफ्ट फेंडर', category: 'exterior_sides', defaultCovered: true, viewSection: 'left' },
  { id: 'side_mirror_left', name: 'Side Mirror — Left', nameHi: 'साइड मिरर — बायाँ', category: 'exterior_sides', defaultCovered: true, viewSection: 'left' },
  { id: 'front_left_door', name: 'Front Left Door', nameHi: 'आगे का बायाँ दरवाजा', category: 'exterior_sides', defaultCovered: true, viewSection: 'left' },
  { id: 'rear_left_door', name: 'Rear Left Door', nameHi: 'पीछे का बायाँ दरवाजा', category: 'exterior_sides', defaultCovered: true, viewSection: 'left' },
  { id: 'rear_left_quarter_panel', name: 'Rear Left Quarter Panel', nameHi: 'रियर लेफ्ट क्वार्टर पैनल', category: 'exterior_sides', defaultCovered: true, viewSection: 'left' },
  { id: 'front_left_window', name: 'Front Left Window Glass', nameHi: 'फ्रंट लेफ्ट विंडो ग्लास', category: 'glass_roof', defaultCovered: true, viewSection: 'left' },
  { id: 'rear_left_window', name: 'Rear Left Window Glass', nameHi: 'रियर लेफ्ट विंडो ग्लास', category: 'glass_roof', defaultCovered: true, viewSection: 'left' },

  // Side Right
  { id: 'front_right_fender', name: 'Front Right Fender', nameHi: 'फ्रंट राइट फेंडर', category: 'exterior_sides', defaultCovered: true, viewSection: 'right' },
  { id: 'side_mirror_right', name: 'Side Mirror — Right', nameHi: 'साइड मिरर — दायाँ', category: 'exterior_sides', defaultCovered: true, viewSection: 'right' },
  { id: 'front_right_door', name: 'Front Right Door', nameHi: 'आगे का दायाँ दरवाजा', category: 'exterior_sides', defaultCovered: true, viewSection: 'right' },
  { id: 'rear_right_door', name: 'Rear Right Door', nameHi: 'पीछे का दायाँ दरवाजा', category: 'exterior_sides', defaultCovered: true, viewSection: 'right' },
  { id: 'rear_right_quarter_panel', name: 'Rear Right Quarter Panel', nameHi: 'रियर राइट क्वार्टर पैनल', category: 'exterior_sides', defaultCovered: true, viewSection: 'right' },
  { id: 'front_right_window', name: 'Front Right Window Glass', nameHi: 'फ्रंट राइट विंडो ग्लास', category: 'glass_roof', defaultCovered: true, viewSection: 'right' },
  { id: 'rear_right_window', name: 'Rear Right Window Glass', nameHi: 'रियर राइट विंडो ग्लास', category: 'glass_roof', defaultCovered: true, viewSection: 'right' },

  // Glass & Roof
  { id: 'windshield', name: 'Front Windshield Glass', nameHi: 'विंडशील्ड ग्लास (आगे)', category: 'glass_roof', defaultCovered: true, viewSection: 'cabin' },
  { id: 'roof', name: 'Roof Panel / Sunroof', nameHi: 'रूफ / सनरूफ', category: 'glass_roof', defaultCovered: true, viewSection: 'cabin' },
  { id: 'rear_windshield', name: 'Rear Windshield Glass', nameHi: 'रियर विंडशील्ड ग्लास', category: 'glass_roof', defaultCovered: true, viewSection: 'rear' },

  // Rear Section
  { id: 'boot_trunk', name: 'Boot / Trunk Lid', nameHi: 'बूट / डिग्गी', category: 'exterior_rear', defaultCovered: true, viewSection: 'rear' },
  { id: 'rear_bumper', name: 'Rear Bumper', nameHi: 'रियर बम्पर', category: 'exterior_rear', defaultCovered: true, viewSection: 'rear' },
  { id: 'tail_light_left', name: 'Tail Light — Left', nameHi: 'टेल लाइट — बायाँ', category: 'lighting', defaultCovered: true, viewSection: 'rear' },
  { id: 'tail_light_right', name: 'Tail Light — Right', nameHi: 'टेल लाइट — दायाँ', category: 'lighting', defaultCovered: true, viewSection: 'rear' },
  { id: 'number_plate_rear', name: 'Number Plate — Rear', nameHi: 'नंबर प्लेट — पीछे', category: 'exterior_rear', defaultCovered: true, viewSection: 'rear' },

  // Wheels & Alloys
  { id: 'wheels', name: 'Wheels & Rims (Steel)', nameHi: 'व्हील और रिम', category: 'wheels_chassis', defaultCovered: true, viewSection: 'wheels' },
  { id: 'tyres', name: 'Tyres (Treads & Sidewalls)', nameHi: 'टायर', category: 'wheels_chassis', defaultCovered: false, viewSection: 'wheels' },
  { id: 'alloy_wheels', name: 'Alloy Wheels (Diamond Cut)', nameHi: 'अलॉय व्हील', category: 'wheels_chassis', defaultCovered: true, viewSection: 'wheels' },

  // Policy Add-on parts
  { id: 'engine_protector', name: 'Engine & Sump Guard (Add-on)', nameHi: 'इंजन व संप प्रोटेक्टर', category: 'addons', defaultCovered: false, viewSection: 'front' },
  { id: 'consumables_kit', name: 'Consumables & Nuts/Bolts (Add-on)', nameHi: 'कन्ज्यूमेबल्स किट', category: 'addons', defaultCovered: false, viewSection: 'cabin' }
];

export const POLICIES_DATABASE: InsurancePolicy[] = [
  {
    id: 'POL-MTR-001',
    policyNumber: 'OMNI-MTR-2024-8849',
    title: 'Omnisure Zero-Depreciation Titanium Motor Cover',
    titleHi: 'ओम्निश्योर जीरो-डेप्रिसिएशन टाइटेनियम मोटर कवर',
    type: 'motor',
    subType: 'zero_dep',
    holderName: 'Sahas Sindhi',
    vehicleDetails: {
      make: 'Honda',
      model: 'City ZX i-VTEC',
      variant: 'Top End Automatic',
      year: 2024,
      regNumber: 'DL-01-AX-9921',
      vin: 'MAKGM6699N0184712',
      engineNumber: 'L15Z1-8849201',
      fuelType: 'Petrol'
    },
    insuredDeclaredValue: 1450000,
    sumInsured: 1450000,
    premiumAmount: 28450,
    deductible: 1000,
    startDate: '2025-10-15',
    expiryDate: '2026-10-14',
    status: 'active',
    addons: [
      'Zero Depreciation (100% Fiber/Plastic/Glass)',
      'Engine & Gearbox Hydrostatic Shield',
      'Consumables & Fasteners Cover',
      'Return to Invoice (100% On-road value)',
      '24x7 Roadside Assistance & Towing (PAN India)',
      'Key & Lock Replacement Cover'
    ],
    documents: [
      { name: 'Policy_Certificate_OMNI-MTR-2024-8849.pdf', size: '2.4 MB', date: '15 Oct 2025' },
      { name: 'Endorsement_Schedule_ZeroDep.pdf', size: '1.1 MB', date: '15 Oct 2025' },
      { name: 'Cashless_Garage_Network_DelhiNCR.pdf', size: '4.8 MB', date: '15 Oct 2025' }
    ],
    coveredPartIds: VEHICLE_PARTS.map(p => p.id), // Titanium covers all
    partCoverageRules: {
      front_bumper: { covered: true, status: 'covered', reason: 'Zero-Depreciation rider covers 100% plastic/fiber bumper replacement with no depreciation deduction.', deductible: 1000 },
      rear_bumper: { covered: true, status: 'covered', reason: 'Covered 100% under Titanium Zero-Depreciation schedule.', deductible: 1000 },
      bonnet_hood: { covered: true, status: 'covered', reason: 'Full metallic panel cover with 0% paint depreciation deduction.', deductible: 1000 },
      front_grille: { covered: true, status: 'covered', reason: 'Fully covered under bumper & front fascia schedule.', deductible: 1000 },
      headlight_left: { covered: true, status: 'covered', reason: 'LED matrix headlight fully covered with 0% depreciation on glass & acrylic housing.', deductible: 1000 },
      headlight_right: { covered: true, status: 'covered', reason: 'LED matrix headlight fully covered with 0% depreciation.', deductible: 1000 },
      fog_lamp: { covered: true, status: 'covered', reason: 'Covered under accessory & lighting schedule.', deductible: 1000 },
      windshield: { covered: true, status: 'covered', reason: '100% glass cover. Claim does not impact next year No-Claim-Bonus (NCB) under Zero-Dep shield.', deductible: 1000 },
      rear_windshield: { covered: true, status: 'covered', reason: 'Includes rear defogger and wiper assembly restoration.', deductible: 1000 },
      front_left_window: { covered: true, status: 'covered', reason: 'Toughened glass covered without excess surcharge.', deductible: 1000 },
      front_right_window: { covered: true, status: 'covered', reason: 'Toughened glass covered.', deductible: 1000 },
      rear_left_window: { covered: true, status: 'covered', reason: 'Toughened glass covered.', deductible: 1000 },
      rear_right_window: { covered: true, status: 'covered', reason: 'Toughened glass covered.', deductible: 1000 },
      roof: { covered: true, status: 'covered', reason: 'Roof metal and sunroof glass mechanism covered.', deductible: 1000 },
      side_mirror_left: { covered: true, status: 'covered', reason: 'Includes electronic folding motor, heating element, and mirror housing.', deductible: 1000 },
      side_mirror_right: { covered: true, status: 'covered', reason: 'Includes electronic folding motor and housing.', deductible: 1000 },
      front_left_door: { covered: true, status: 'covered', reason: 'Metallic body panel covered with factory paint matching.', deductible: 1000 },
      front_right_door: { covered: true, status: 'covered', reason: 'Metallic body panel covered.', deductible: 1000 },
      rear_left_door: { covered: true, status: 'covered', reason: 'Metallic body panel covered.', deductible: 1000 },
      rear_right_door: { covered: true, status: 'covered', reason: 'Metallic body panel covered.', deductible: 1000 },
      front_left_fender: { covered: true, status: 'covered', reason: 'Fender alignment and sheet metal covered.', deductible: 1000 },
      front_right_fender: { covered: true, status: 'covered', reason: 'Fender alignment and sheet metal covered.', deductible: 1000 },
      rear_left_quarter_panel: { covered: true, status: 'covered', reason: 'Body quarter panel covered.', deductible: 1000 },
      rear_right_quarter_panel: { covered: true, status: 'covered', reason: 'Body quarter panel covered.', deductible: 1000 },
      boot_trunk: { covered: true, status: 'covered', reason: 'Trunk lid and electronic latch covered.', deductible: 1000 },
      tail_light_left: { covered: true, status: 'covered', reason: 'Tail lamp assembly covered.', deductible: 1000 },
      tail_light_right: { covered: true, status: 'covered', reason: 'Tail lamp assembly covered.', deductible: 1000 },
      number_plate_front: { covered: true, status: 'covered', reason: 'HSRP replacement covered.', deductible: 0 },
      number_plate_rear: { covered: true, status: 'covered', reason: 'HSRP replacement covered.', deductible: 0 },
      alloy_wheels: { covered: true, status: 'covered', reason: 'Diamond-cut alloy rim crack or breakage in road impact covered.', deductible: 1000 },
      wheels: { covered: true, status: 'covered', reason: 'Wheel rim alignment and rim covered.', deductible: 1000 },
      tyres: { covered: true, status: 'requires_verification', reason: 'Accidental tyre damage covered at 80% pro-rata tread depth; puncture/wear-and-tear excluded.', deductible: 1000 },
      engine_protector: { covered: true, status: 'covered', reason: 'Covered under Engine & Sump Protection Add-on.', deductible: 1000 },
      consumables_kit: { covered: true, status: 'covered', reason: 'Covered under Consumables Add-on.', deductible: 0 }
    }
  },
  {
    id: 'POL-MTR-002',
    policyNumber: 'OMNI-MTR-2023-4102',
    title: 'Omnisure Comprehensive Motor Shield (Standard)',
    titleHi: 'ओम्निश्योर कॉम्प्रिहेंसिव मोटर शील्ड (स्टैंडर्ड)',
    type: 'motor',
    subType: 'comprehensive',
    holderName: 'Sahas Sindhi',
    vehicleDetails: {
      make: 'Hyundai',
      model: 'Creta SX (O)',
      variant: '1.5 Turbo DCT',
      year: 2023,
      regNumber: 'MH-02-EE-4502',
      vin: 'MALC381CLNM091244',
      engineNumber: 'G4LD-6601449',
      fuelType: 'Petrol'
    },
    insuredDeclaredValue: 1280000,
    sumInsured: 1280000,
    premiumAmount: 18920,
    deductible: 2000,
    startDate: '2025-06-10',
    expiryDate: '2026-06-09',
    status: 'active',
    addons: [
      'Cashless Roadside Assistance',
      'Personal Accident Cover (₹15 Lakh)'
    ],
    documents: [
      { name: 'Policy_Certificate_Creta_MH02EE4502.pdf', size: '1.9 MB', date: '10 Jun 2025' }
    ],
    coveredPartIds: [
      'front_bumper', 'rear_bumper', 'bonnet_hood', 'front_grille', 'headlight_left', 'headlight_right',
      'windshield', 'rear_windshield', 'front_left_door', 'front_right_door', 'rear_left_door', 'rear_right_door',
      'front_left_fender', 'front_right_fender', 'rear_left_quarter_panel', 'rear_right_quarter_panel',
      'boot_trunk', 'tail_light_left', 'tail_light_right', 'side_mirror_left', 'side_mirror_right',
      'roof', 'front_left_window', 'front_right_window', 'rear_left_window', 'rear_right_window'
    ],
    partCoverageRules: {
      front_bumper: { covered: true, status: 'requires_verification', reason: 'Standard policy applies 50% depreciation on fiber/plastic parts and ₹2,000 compulsory excess.', deductible: 2000, depreciationRate: 50 },
      rear_bumper: { covered: true, status: 'requires_verification', reason: 'Standard 50% depreciation deduction on plastic bumpers.', deductible: 2000, depreciationRate: 50 },
      side_mirror_left: { covered: true, status: 'requires_verification', reason: 'Glass mirror covered at 100%, plastic housing subject to 50% depreciation.', deductible: 2000, depreciationRate: 50 },
      side_mirror_right: { covered: true, status: 'requires_verification', reason: 'Plastic mirror shell subject to 50% depreciation.', deductible: 2000, depreciationRate: 50 },
      windshield: { covered: true, status: 'covered', reason: 'Glass parts covered at 100% subject to policy excess of ₹2,000.', deductible: 2000, depreciationRate: 0 },
      rear_windshield: { covered: true, status: 'covered', reason: 'Glass covered at 100% subject to deductible.', deductible: 2000, depreciationRate: 0 },
      bonnet_hood: { covered: true, status: 'covered', reason: 'Metallic body panel covered; 20% depreciation on paint materials.', deductible: 2000, depreciationRate: 20 },
      front_left_door: { covered: true, status: 'covered', reason: 'Metal panel covered with standard sheet-metal depreciation (10%).', deductible: 2000, depreciationRate: 10 },
      front_right_door: { covered: true, status: 'covered', reason: 'Metal panel covered (10% depreciation).', deductible: 2000, depreciationRate: 10 },
      tyres: { covered: false, status: 'not_covered', reason: 'Tyres and tubes are excluded under standard policy unless vehicle is damaged in the same accident.', deductible: 2000 },
      alloy_wheels: { covered: true, status: 'requires_verification', reason: 'Covered up to manufacturer standard specs. Custom accessories need separate endorsement.', deductible: 2000 },
      engine_protector: { covered: false, status: 'not_covered', reason: 'Engine Hydrostatic Lock add-on is NOT opted on this policy.', deductible: 2000 },
      consumables_kit: { covered: false, status: 'not_covered', reason: 'Consumables cover (oil, nuts, coolant) NOT opted.', deductible: 2000 }
    }
  },
  {
    id: 'POL-HLT-003',
    policyNumber: 'OMNI-HLT-2025-1092',
    title: 'Omnisure Health Shield Platinum Family Floater',
    titleHi: 'ओम्निश्योर हेल्थ शील्ड प्लेटिनम फैमिली फ्लोटर',
    type: 'health',
    subType: 'floater',
    holderName: 'Sahas Sindhi',
    insuredDeclaredValue: 2000000,
    sumInsured: 2000000,
    premiumAmount: 32500,
    deductible: 0,
    startDate: '2025-01-01',
    expiryDate: '2026-01-01',
    status: 'active',
    addons: [
      'Cashless at 14,000+ Network Hospitals',
      'Zero Room Rent Capping',
      'AYUSH Treatment Cover',
      'Maternity & Newborn Booster',
      'Annual Comprehensive Health Checkup'
    ],
    documents: [
      { name: 'Health_Card_Family_Floater.pdf', size: '1.2 MB', date: '01 Jan 2025' },
      { name: 'Network_Hospital_Directory.pdf', size: '6.4 MB', date: '01 Jan 2025' }
    ],
    coveredPartIds: [],
    partCoverageRules: {}
  },
  {
    id: 'POL-BIK-004',
    policyNumber: 'OMNI-BIK-2025-3921',
    title: 'Omnisure Two-Wheeler Zero-Dep Shield',
    titleHi: 'ओम्निश्योर टू-व्हीलर जीरो-डेप शील्ड',
    type: 'bike',
    subType: 'zero_dep',
    holderName: 'Sahas Sindhi',
    bikeDetails: {
      make: 'Royal Enfield',
      model: 'Classic 350 Reborn',
      year: 2024,
      regNumber: 'DL-03-CB-1904',
      engineCC: 349
    },
    insuredDeclaredValue: 215000,
    sumInsured: 215000,
    premiumAmount: 4850,
    deductible: 500,
    startDate: '2025-08-10',
    expiryDate: '2026-08-09',
    status: 'active',
    addons: [
      'Zero Depreciation on Fiber, Rubber & Metal parts',
      'Engine & Gearbox Protector',
      'Roadside Assistance with Flat Tyre & Fuel Delivery',
      'Pillion Rider Accident Cover (₹5 Lakh)'
    ],
    documents: [
      { name: 'Policy_Certificate_RE350_DL03CB1904.pdf', size: '1.4 MB', date: '10 Aug 2025' }
    ],
    coveredPartIds: ['front_fork', 'handlebar', 'fuel_tank', 'exhaust_silencer', 'front_headlight', 'alloy_wheels', 'engine_crash_guard'],
    partCoverageRules: {}
  },
  {
    id: 'POL-HOM-005',
    policyNumber: 'OMNI-HOM-2024-5102',
    title: 'Omnisure Comprehensive Home & Contents All-Risk',
    titleHi: 'ओम्निश्योर होम व घरेलू सामग्री ऑल-रिस्क कवर',
    type: 'home',
    subType: 'comprehensive',
    holderName: 'Sahas Sindhi',
    propertyDetails: {
      address: 'B-42, Gulmohar Park, South Extension, New Delhi - 110049',
      propertyType: 'Independent Residential Floor',
      carpetAreaSqFt: 2100
    },
    insuredDeclaredValue: 15000000, // ₹1.5 Cr
    sumInsured: 15000000,
    premiumAmount: 14200,
    deductible: 2500,
    startDate: '2025-04-01',
    expiryDate: '2026-03-31',
    status: 'active',
    addons: [
      'Structure Rebuilding Cost at Actuals',
      'Electronic Appliances Breakdown (Smart TV, Fridge, HVAC)',
      'Burglary, Theft & Break-in Protection',
      'Alternative Accommodation Allowance up to 6 months',
      'Public Liability to Neighbours/Third Parties'
    ],
    documents: [
      { name: 'Home_Insurance_Policy_Schedule.pdf', size: '2.1 MB', date: '01 Apr 2025' }
    ],
    coveredPartIds: [],
    partCoverageRules: {}
  },
  {
    id: 'POL-TRV-006',
    policyNumber: 'OMNI-TRV-2026-0922',
    title: 'Omnisure Global Multi-Trip Travel Guard (Worldwide)',
    titleHi: 'ओम्निश्योर ग्लोबल मल्टी-ट्रिप ट्रैवल गार्ड',
    type: 'travel',
    subType: 'comprehensive',
    holderName: 'Sahas Sindhi',
    insuredDeclaredValue: 4200000, // $50,000 USD approx
    sumInsured: 4200000,
    premiumAmount: 8900,
    deductible: 0,
    startDate: '2026-01-01',
    expiryDate: '2026-12-31',
    status: 'active',
    addons: [
      'Cashless Medical Emergency & Hospitalization ($100,000)',
      'Checked-in Baggage Loss / Delay ($1,500)',
      'Trip Cancellation & Curtailment Reimbursement',
      'Emergency Passport Reconstruction Assistance',
      'Flight Delay & Missed Connection Surcharge'
    ],
    documents: [
      { name: 'Travel_Insurance_Card_Global.pdf', size: '1.6 MB', date: '01 Jan 2026' }
    ],
    coveredPartIds: [],
    partCoverageRules: {}
  },
  {
    id: 'POL-DEV-007',
    policyNumber: 'OMNI-DEV-2025-7811',
    title: 'Omnisure Apple Care+ & Gadget Shield (iPhone 16 Pro Max)',
    titleHi: 'ओम्निश्योर गैजेट शील्ड (आईफोन 16 प्रो मैक्स)',
    type: 'gadget',
    subType: 'zero_dep',
    holderName: 'Sahas Sindhi',
    insuredDeclaredValue: 154000,
    sumInsured: 154000,
    premiumAmount: 7499,
    deductible: 1500,
    startDate: '2025-09-25',
    expiryDate: '2026-09-24',
    status: 'active',
    addons: [
      'Screen Fracture & OLED Glass Replacement (Unlimited)',
      'Liquid Damage & Submersion Ingress Cover',
      'Motherboard Surge & Chipset Breakdown',
      'Free Doorstep Pickup & Certified Apple Repair'
    ],
    documents: [
      { name: 'Gadget_Shield_Certificate_iPhone16ProMax.pdf', size: '980 KB', date: '25 Sep 2025' }
    ],
    coveredPartIds: [],
    partCoverageRules: {}
  },
  {
    id: 'POL-ACC-008',
    policyNumber: 'OMNI-ACC-2024-1189',
    title: 'Omnisure Elite 24x7 Worldwide Personal Accident Shield',
    titleHi: 'ओम्निश्योर एलीट 24x7 पर्सनल एक्सीडेंट शील्ड',
    type: 'accident',
    subType: 'comprehensive',
    holderName: 'Sahas Sindhi',
    insuredDeclaredValue: 5000000, // ₹50 Lakh
    sumInsured: 5000000,
    premiumAmount: 4200,
    deductible: 0,
    startDate: '2025-05-15',
    expiryDate: '2026-05-14',
    status: 'active',
    addons: [
      '100% Payout for Accidental Death & Permanent Total Disablement',
      'Permanent Partial Disablement Scale Benefits',
      'Temporary Total Disablement (₹25,000 Weekly Benefit up to 104 weeks)',
      'Accidental Hospitalization Confinement Allowance',
      'Children Education Security Grant (₹5 Lakh)'
    ],
    documents: [
      { name: 'Personal_Accident_Schedule.pdf', size: '1.3 MB', date: '15 May 2025' }
    ],
    coveredPartIds: [],
    partCoverageRules: {}
  },
  {
    id: 'POL-LIF-009',
    policyNumber: 'OMNI-LIF-2023-9014',
    title: 'Omnisure Pure Term Life Protector (₹1 Crore Sum Assured)',
    titleHi: 'ओम्निश्योर प्योर टर्म लाइफ प्रोटेक्टर (₹1 करोड़)',
    type: 'life',
    subType: 'comprehensive',
    holderName: 'Sahas Sindhi',
    insuredDeclaredValue: 10000000, // ₹1 Crore
    sumInsured: 10000000,
    premiumAmount: 18600,
    deductible: 0,
    startDate: '2023-11-20',
    expiryDate: '2058-11-19', // 35-year term
    status: 'active',
    addons: [
      'Critical Illness Accelerated Rider (36 Illnesses)',
      'Accidental Death Benefit Booster (₹50 Lakh extra)',
      'Waiver of Premium on Total Disablement',
      'Direct Bank NEFT Fast-Track Settlement Guarantee'
    ],
    documents: [
      { name: 'Term_Life_Policy_Document_1Cr.pdf', size: '3.2 MB', date: '20 Nov 2023' }
    ],
    coveredPartIds: [],
    partCoverageRules: {}
  }
];

export const CLAIMS_DATABASE: InsuranceClaim[] = [
  {
    id: 'CLM-2026-8894',
    claimNumber: 'OMNI-CLM-2026-8894',
    insuranceType: 'motor',
    policyId: 'POL-MTR-001',
    policyNumber: 'OMNI-MTR-2024-8849',
    policyTitle: 'Omnisure Zero-Depreciation Titanium Motor Cover',
    assetName: 'Honda City ZX (DL-01-AX-9921)',
    vehicleName: 'Honda City ZX (DL-01-AX-9921)',
    regNumber: 'DL-01-AX-9921',
    incidentDate: '2026-08-22',
    incidentLocation: 'Barakhamba Road, Connaught Place, New Delhi',
    incidentDescription: 'Front collision when another commercial vehicle made an abrupt lane shift at signal. Front bumper dented, left headlight fractured, and windshield has impact crack.',
    claimStatus: 'Damage Assessment',
    estimatedAmount: 34500,
    approvedAmount: 32500,
    deductibleApplied: 1000,
    netPayoutEstimate: 31500,
    nextStep: 'Digital Surveyor report under automated cross-verification with Honda Cashless Workshop.',
    createdAt: '2026-08-22 14:35',
    damagedParts: [
      {
        partId: 'front_bumper',
        partName: 'Front Bumper',
        damageType: 'Dented',
        severity: 'Moderate',
        coverageStatus: 'covered',
        coverageReason: '100% Zero-Depreciation cover on front bumper replacement.',
        photos: ['https://images.unsplash.com/photo-1590362891988-3720743b1940?w=600&auto=format&fit=crop&q=80'],
        aiAnalysis: {
          detectedDamageType: 'Impact Deformation & Structural Crease',
          estimatedSeverity: 'Moderate',
          relevanceScore: 96,
          additionalPhotosRecommended: false,
          confidence: 0.94,
          observations: 'Deep deformation along the lower lip of the front bumper. Radiator intake grill clips displaced.'
        }
      },
      {
        partId: 'headlight_left',
        partName: 'Headlight — Left',
        damageType: 'Broken',
        severity: 'Severe',
        coverageStatus: 'covered',
        coverageReason: 'Full LED matrix assembly covered with 0% glass/plastic deduction.',
        photos: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80'],
        aiAnalysis: {
          detectedDamageType: 'Lens Fracture & Reflector Housing Damage',
          estimatedSeverity: 'Severe',
          relevanceScore: 92,
          additionalPhotosRecommended: true,
          confidence: 0.91,
          observations: 'Polycarbonate outer shell shattered; internal projector unit exposed to environmental moisture.'
        }
      },
      {
        partId: 'windshield',
        partName: 'Front Windshield Glass',
        damageType: 'Cracked',
        severity: 'Moderate',
        coverageStatus: 'covered',
        coverageReason: '100% glass cover under policy. Nil depreciation.',
        photos: ['https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&auto=format&fit=crop&q=80'],
        aiAnalysis: {
          detectedDamageType: 'Radial Crack Spreading from Impact Point',
          estimatedSeverity: 'Moderate',
          relevanceScore: 98,
          additionalPhotosRecommended: false,
          confidence: 0.96,
          observations: 'Star-shaped impact fracture near bottom left corner spreading 12 inches upwards.'
        }
      }
    ],
    photos: [
      'https://images.unsplash.com/photo-1590362891988-3720743b1940?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80'
    ],
    timeline: [
      { stage: 'Claim Submitted (FNOL)', stageKey: 'submitted', timestamp: '2026-08-22 14:35', status: 'completed', description: 'Customer initiated claim with interactive damage mapping and photo evidence.' },
      { stage: 'Documents & Policy Verification', stageKey: 'verified', timestamp: '2026-08-22 14:48', status: 'completed', description: 'Policy validated. Active Zero-Depreciation endorsement confirmed.' },
      { stage: 'AI Damage Assessment & Tele-Inspection', stageKey: 'assessment', timestamp: '2026-08-22 15:10', status: 'current', description: 'Automated AI vision damage scan evaluated repair estimate of ₹34,500.' },
      { stage: 'Claim Review & Workshop Assignment', stageKey: 'review', timestamp: 'Estimated Today', status: 'pending', description: 'Authorized cashless garage assignment (Sterling Honda, Okhla Phase 1).' },
      { stage: 'Approved / Final Authorization', stageKey: 'approval', timestamp: 'Pending Review', status: 'pending', description: 'Surveyor digital sign-off and repair work-order approval.' },
      { stage: 'Direct Cashless Settlement', stageKey: 'settlement', timestamp: 'Pending Repair', status: 'pending', description: 'Direct insurance payout to network garage upon vehicle delivery.' }
    ],
    questionsAnswered: [
      { question: 'Was the vehicle roadworthy to drive to the nearest cashless center?', answer: 'Yes, vehicle drove 2km with hazard lights on.' },
      { question: 'Did the collision involve any third-party property damage or bodily injury?', answer: 'No bodily injuries reported.' },
      { question: 'Are any crack lines on the windshield spreading towards driver eye-level?', answer: 'Yes, radial cracks extend about 12 inches towards steering line.' }
    ]
  },
  {
    id: 'CLM-2025-3211',
    claimNumber: 'OMNI-CLM-2025-3211',
    insuranceType: 'motor',
    policyId: 'POL-MTR-002',
    policyNumber: 'OMNI-MTR-2023-4102',
    policyTitle: 'Omnisure Comprehensive Motor Shield',
    assetName: 'Hyundai Creta SX (MH-02-EE-4502)',
    vehicleName: 'Hyundai Creta SX (MH-02-EE-4502)',
    regNumber: 'MH-02-EE-4502',
    incidentDate: '2025-11-04',
    incidentLocation: 'Western Express Highway, Bandra, Mumbai',
    incidentDescription: 'Rear end bump in stop-and-go traffic.',
    claimStatus: 'Settlement',
    estimatedAmount: 14200,
    approvedAmount: 11400,
    deductibleApplied: 2000,
    netPayoutEstimate: 9400,
    nextStep: 'Claim settled and closed. Payment disbursed directly to Modi Hyundai Workshop.',
    createdAt: '2025-11-04 18:20',
    damagedParts: [
      {
        partId: 'rear_bumper',
        partName: 'Rear Bumper',
        damageType: 'Scratched',
        severity: 'Moderate',
        coverageStatus: 'covered',
        coverageReason: 'Covered with 50% depreciation on fiber bumper as per policy schedule.',
        photos: []
      }
    ],
    photos: [],
    timeline: [
      { stage: 'Claim Submitted (FNOL)', stageKey: 'submitted', timestamp: '2025-11-04 18:20', status: 'completed', description: 'Claim lodged via customer portal.' },
      { stage: 'Documents Verified', stageKey: 'verified', timestamp: '2025-11-04 18:50', status: 'completed', description: 'DL and RC validated.' },
      { stage: 'Damage Assessment', stageKey: 'assessment', timestamp: '2025-11-05 10:15', status: 'completed', description: 'Surveyor inspected bumper dent & paint.' },
      { stage: 'Claim Review', stageKey: 'review', timestamp: '2025-11-05 14:00', status: 'completed', description: 'Deductions calculated (50% fiber depreciation + excess).' },
      { stage: 'Approved', stageKey: 'approval', timestamp: '2025-11-05 16:30', status: 'completed', description: 'Approved for ₹11,400.' },
      { stage: 'Settlement Disbursed', stageKey: 'settlement', timestamp: '2025-11-08 11:20', status: 'completed', description: 'Direct NEFT settlement issued.' }
    ],
    questionsAnswered: []
  },
  {
    id: 'CLM-HLT-2026-1049',
    claimNumber: 'OMNI-CLM-2026-1049',
    insuranceType: 'health',
    policyId: 'POL-HLT-003',
    policyNumber: 'OMNI-HLT-2025-9012',
    policyTitle: 'Omnisure Family Health Shield (₹20 Lakh Floater)',
    assetName: 'Patient: Ananya Sindhi (Spouse) - Max Super Speciality Saket',
    incidentDate: '2026-07-14',
    incidentLocation: 'Max Super Speciality Hospital, Saket, New Delhi',
    incidentDescription: 'Hospitalization for acute Dengue fever with severe thrombocytopenia (platelet count dropped to 22,000). Pre-authorized cashless admission for 4 days.',
    claimStatus: 'Approved',
    estimatedAmount: 86400,
    approvedAmount: 84200,
    deductibleApplied: 0,
    netPayoutEstimate: 84200,
    nextStep: 'Final hospital bill cashless clearance authorization sent to Max Hospital TPA desk.',
    createdAt: '2026-07-14 11:15',
    damagedParts: [],
    photos: [],
    specializedDetails: {
      hospitalName: 'Max Super Speciality Hospital, Saket',
      patientName: 'Ananya Sindhi',
      ailment: 'Acute Dengue Hemorrhagic Fever with Thrombocytopenia',
      isCashless: true,
      roomCategory: 'Single Private Room',
      admissionDate: '2026-07-14',
      dischargeDate: '2026-07-18'
    },
    timeline: [
      { stage: 'Initial Pre-Auth Request', stageKey: 'submitted', timestamp: '2026-07-14 11:15', status: 'completed', description: 'Cashless pre-auth form submitted by hospital TPA desk.' },
      { stage: 'Medical Review & Approval', stageKey: 'verified', timestamp: '2026-07-14 12:45', status: 'completed', description: 'AI policy rules verified active zero room rent capping. ₹50,000 interim pre-authorization granted.' },
      { stage: 'Hospitalization Monitoring', stageKey: 'assessment', timestamp: '2026-07-16 16:00', status: 'completed', description: 'Platelet counts and daily indoor case sheets monitored digitally.' },
      { stage: 'Discharge Summary & Audit', stageKey: 'review', timestamp: '2026-07-18 10:30', status: 'completed', description: 'Itemized hospital pharmacy, doctor visits, and lab tests audited.' },
      { stage: 'Final Cashless Approval', stageKey: 'approval', timestamp: '2026-07-18 12:15', status: 'completed', description: 'Final claim approved for ₹84,200 without co-pay.' },
      { stage: 'Direct Settlement to Hospital', stageKey: 'settlement', timestamp: '2026-07-18 13:00', status: 'completed', description: 'Electronic payment voucher dispatched to hospital accounts.' }
    ],
    questionsAnswered: [
      { question: 'Was the admission planned or an emergency hospitalisation?', answer: 'Emergency admission due to sudden fever spike and petechial rashes.' },
      { question: 'Did the insured have any prior history of dengue in the last 24 months?', answer: 'No previous history.' }
    ]
  },
  {
    id: 'CLM-BIK-2026-0812',
    claimNumber: 'OMNI-CLM-2026-0812',
    insuranceType: 'bike',
    policyId: 'POL-BIK-004',
    policyNumber: 'OMNI-BIK-2025-3921',
    policyTitle: 'Omnisure Two-Wheeler Zero-Dep Shield',
    assetName: 'Royal Enfield Classic 350 (DL-03-CB-1904)',
    regNumber: 'DL-03-CB-1904',
    incidentDate: '2026-06-19',
    incidentLocation: 'Ring Road, Near Moolchand Underpass, New Delhi',
    incidentDescription: 'Skid on wet road surface avoiding stray animal. Bike fell on right side damaging handlebar, brake lever, exhaust silencer and engine crash guard.',
    claimStatus: 'Settlement',
    estimatedAmount: 16800,
    approvedAmount: 15900,
    deductibleApplied: 500,
    netPayoutEstimate: 15400,
    nextStep: 'Claim settled. New OEM silencer and crash guard fitted at Royal Enfield authorized service center.',
    createdAt: '2026-06-19 09:40',
    damagedParts: [
      {
        partId: 'exhaust_silencer',
        partName: 'Exhaust Silencer',
        damageType: 'Dented',
        severity: 'Moderate',
        coverageStatus: 'covered',
        coverageReason: 'Zero-Depreciation rider covers 100% replacement cost of chrome exhaust.',
        photos: []
      },
      {
        partId: 'engine_crash_guard',
        partName: 'Engine Crash Guard',
        damageType: 'Broken',
        severity: 'Severe',
        coverageStatus: 'covered',
        coverageReason: 'Covered under accessory endorsement.',
        photos: []
      }
    ],
    photos: [],
    specializedDetails: {
      bikeModel: 'Royal Enfield Classic 350 Reborn',
      helmetWorn: true,
      odometerKm: 4280
    },
    timeline: [
      { stage: 'FNOL Lodged', stageKey: 'submitted', timestamp: '2026-06-19 09:40', status: 'completed', description: 'Claim reported with photos of damaged crash guard and exhaust.' },
      { stage: 'Zero-Dep Cover Verified', stageKey: 'verified', timestamp: '2026-06-19 10:15', status: 'completed', description: 'Zero depreciation endorsement confirmed.' },
      { stage: 'Physical Surveyor Inspection', stageKey: 'assessment', timestamp: '2026-06-19 14:00', status: 'completed', description: 'Surveyor inspected alignment and approved parts replacement.' },
      { stage: 'Approval Granted', stageKey: 'approval', timestamp: '2026-06-20 11:30', status: 'completed', description: 'Approved for ₹15,900 less ₹500 compulsory deductible.' },
      { stage: 'Settlement Paid', stageKey: 'settlement', timestamp: '2026-06-22 17:00', status: 'completed', description: 'Settled directly to Royal Enfield South Delhi workshop.' }
    ],
    questionsAnswered: [
      { question: 'Was a helmet worn at the time of the incident?', answer: 'Yes, full-face ISI certified helmet worn.' },
      { question: 'Was any other vehicle or pedestrian involved?', answer: 'No, self-skid due to sudden braking.' }
    ]
  },
  {
    id: 'CLM-HOM-2026-4412',
    claimNumber: 'OMNI-HOM-2026-4412',
    insuranceType: 'home',
    policyId: 'POL-HOM-005',
    policyNumber: 'OMNI-HOM-2024-5102',
    policyTitle: 'Omnisure Comprehensive Home & Contents All-Risk',
    assetName: 'Residential Flat: B-42, Gulmohar Park, South Extension, New Delhi',
    incidentDate: '2026-08-11',
    incidentLocation: 'B-42, Gulmohar Park, New Delhi',
    incidentDescription: 'High pressure municipal water pipe burst in master bathroom during night hours causing ceiling plaster damage and Italian marble wooden flooring seepage in master bedroom and hallway.',
    claimStatus: 'Approved',
    estimatedAmount: 185000,
    approvedAmount: 182500,
    deductibleApplied: 2500,
    netPayoutEstimate: 182500,
    nextStep: 'Surveyor final inspection completed; direct NEFT payout authorization issued to HDFC home bank account.',
    createdAt: '2026-08-11 10:20',
    damagedParts: [],
    photos: [],
    specializedDetails: {
      propertyAddress: 'B-42, Gulmohar Park, South Extension, New Delhi - 110049',
      propertyType: 'Independent Residential Floor',
      damageCause: 'Internal Pipe Burst & Water Ingress',
      incidentType: 'Bursting / Overflowing of Water Apparatus',
      affectedRooms: ['Master Bedroom', 'Master Bathroom', 'Connecting Corridor'],
      damagedItems: ['Gypsum False Ceiling', 'Engineered Oak Wood Flooring', 'Electrical Wiring Conduits'],
      surveyorName: 'Er. R. K. Malhotra (IRDAI Surveyor SLA-18921)'
    },
    timeline: [
      { stage: 'FNOL Lodged', stageKey: 'submitted', timestamp: '2026-08-11 10:20', status: 'completed', description: 'Home claim recorded with photos of ceiling dampness and broken pipeline.' },
      { stage: 'Coverage Scrutiny', stageKey: 'verified', timestamp: '2026-08-11 11:15', status: 'completed', description: 'Bharat Griha Raksha terms verified. Burst pipe peril admitted.' },
      { stage: 'IRDAI Surveyor Physical Inspection', stageKey: 'assessment', timestamp: '2026-08-12 15:30', status: 'completed', description: 'Licensed surveyor assessed flooring moisture content and replacement cost.' },
      { stage: 'Surveyor Final Report & Review', stageKey: 'review', timestamp: '2026-08-13 14:00', status: 'completed', description: 'Surveyor submitted final assessment report recommending ₹1,85,000 less ₹2,500 excess.' },
      { stage: 'Claim Approval', stageKey: 'approval', timestamp: '2026-08-14 11:00', status: 'completed', description: 'Claim sanction letter dispatched to policyholder.' },
      { stage: 'NEFT Payout Settlement', stageKey: 'settlement', timestamp: '2026-08-15 16:30', status: 'completed', description: 'Settlement disbursed directly to policyholder bank account.' }
    ],
    questionsAnswered: [
      { question: 'Was water mains shut off immediately?', answer: 'Yes, shutoff valve isolated within 45 minutes.' },
      { question: 'Are structural load-bearing columns affected?', answer: 'No, only superficial masonry plaster and wooden paneling damaged.' }
    ]
  },
  {
    id: 'CLM-TRV-2026-9021',
    claimNumber: 'OMNI-TRV-2026-9021',
    insuranceType: 'travel',
    policyId: 'POL-TRV-006',
    policyNumber: 'OMNI-TRV-2026-0922',
    policyTitle: 'Omnisure Global Multi-Trip Travel Guard (Worldwide)',
    assetName: 'Trip to France: Paris Charles de Gaulle (AF-CDG-882190)',
    incidentDate: '2026-07-28',
    incidentLocation: 'Paris Charles de Gaulle International Airport (CDG), France',
    incidentDescription: 'Checked-in baggage delayed beyond 26 hours on Air France flight AF-225 from Delhi to Paris. Emergency essential toiletries, clothing, and warm wear purchased in Paris.',
    claimStatus: 'Approved',
    estimatedAmount: 48000,
    approvedAmount: 48000,
    deductibleApplied: 0,
    netPayoutEstimate: 48000,
    nextStep: 'Carrier PIR confirmation verified with Air France baggage central tracer; reimbursement approved.',
    createdAt: '2026-07-29 14:00',
    damagedParts: [],
    photos: [],
    specializedDetails: {
      travelLossType: 'Checked Baggage Delay (>12 Hours)',
      destinationCountry: 'France (Paris CDG)',
      carrierPIRNumber: 'AF-CDG-882190',
      airlineCarrier: 'Air France (Flight AF-225)',
      pnrNumber: 'AF782910',
      delayDurationHours: 26,
      passportNumber: 'Z8920194'
    },
    timeline: [
      { stage: 'FNOL Intimated Abroad', stageKey: 'submitted', timestamp: '2026-07-29 14:00', status: 'completed', description: 'Claim intimation logged with Air France Property Irregularity Report.' },
      { stage: 'Policy & Boarding Pass Audit', stageKey: 'verified', timestamp: '2026-07-29 15:45', status: 'completed', description: 'E-ticket, boarding pass, and baggage claim tags cross-verified.' },
      { stage: 'Foreign Invoice Currency Conversion', stageKey: 'assessment', timestamp: '2026-07-30 11:30', status: 'completed', description: 'Emergency clothing and toiletry receipts converted at RBI daily benchmark forex rate.' },
      { stage: 'Overseas Assistance Approval', stageKey: 'approval', timestamp: '2026-07-30 17:00', status: 'completed', description: 'Approved for full policy sub-limit of $500 (₹48,000).' },
      { stage: 'Direct NEFT Settlement', stageKey: 'settlement', timestamp: '2026-07-31 12:00', status: 'completed', description: 'Direct credit processed to Indian rupee salary account.' }
    ],
    questionsAnswered: [
      { question: 'Did the airline deliver luggage subsequently?', answer: 'Yes, delivered to hotel lobby after 26.5 hours.' },
      { question: 'Did you retain all store receipt invoices?', answer: 'Yes, original French tax invoice receipts attached.' }
    ]
  },
  {
    id: 'CLM-DEV-2026-3190',
    claimNumber: 'OMNI-DEV-2026-3190',
    insuranceType: 'gadget',
    policyId: 'POL-DEV-007',
    policyNumber: 'OMNI-DEV-2025-7811',
    policyTitle: 'Omnisure Apple Care+ & Gadget Shield (iPhone 16 Pro Max)',
    assetName: 'Apple iPhone 16 Pro Max 256GB Natural Titanium (IMEI: 358921094892104)',
    incidentDate: '2026-08-04',
    incidentLocation: 'DLF CyberHub, Gurugram',
    incidentDescription: 'Phone accidentally slipped from hand onto concrete pavement while stepping out of car. Front Ceramic Shield display cracked with localized OLED bleeding on top right edge.',
    claimStatus: 'Approved',
    estimatedAmount: 38900,
    approvedAmount: 37400,
    deductibleApplied: 1500,
    netPayoutEstimate: 37400,
    nextStep: 'Doorstep pickup completed. Original OEM Apple display module replacement authorized at Apple Saket service hub.',
    createdAt: '2026-08-04 18:30',
    damagedParts: [],
    photos: [],
    specializedDetails: {
      deviceModel: 'Apple iPhone 16 Pro Max 256GB',
      imeiNumber: '358921094892104',
      damagedComponent: 'Front Ceramic Shield Glass & Super Retina XDR OLED',
      authorizedServiceCenter: 'Apple Saket Store OEM Authorized Service Center',
      incidentDescription: 'Impact fracture on concrete flooring with OLED touch failure'
    },
    timeline: [
      { stage: 'Device FNOL Lodged', stageKey: 'submitted', timestamp: '2026-08-04 18:30', status: 'completed', description: 'IMEI matched against original Apple tax invoice.' },
      { stage: 'Zero-Dep Glass Cover Checked', stageKey: 'verified', timestamp: '2026-08-04 19:15', status: 'completed', description: 'AppleCare+ unlimited screen protection active.' },
      { stage: 'OEM Diagnostics & Bench Check', stageKey: 'assessment', timestamp: '2026-08-05 14:00', status: 'completed', description: 'Apple diagnostic scan verified logic board intact; display replacement needed.' },
      { stage: 'Cashless Job-Sheet Approved', stageKey: 'approval', timestamp: '2026-08-05 16:30', status: 'completed', description: 'Authorised ₹38,900 repair estimate less ₹1,500 fixed copay.' },
      { stage: 'Device Repaired & Returned', stageKey: 'settlement', timestamp: '2026-08-06 17:00', status: 'completed', description: 'Delivered back via insured courier with Apple 90-day warranty.' }
    ],
    questionsAnswered: [
      { question: 'Was Find My iPhone turned off prior to service?', answer: 'Yes, iCloud device pairing temporarily removed for service.' }
    ]
  },
  {
    id: 'CLM-ACC-2026-5501',
    claimNumber: 'OMNI-ACC-2026-5501',
    insuranceType: 'accident',
    policyId: 'POL-ACC-008',
    policyNumber: 'OMNI-ACC-2024-1189',
    policyTitle: 'Omnisure Elite 24x7 Worldwide Personal Accident Shield',
    assetName: 'Personal Accident Cover: Sahas Sindhi (Right Tibia Fracture)',
    incidentDate: '2026-05-18',
    incidentLocation: 'Ring Road near Moolchand Flyover, New Delhi',
    incidentDescription: 'Motorcycle skidded on rain slick. Admitted to trauma care with compound fracture of right tibia. Attending orthopedic surgeon advised 6 weeks complete immobilization.',
    claimStatus: 'Approved',
    estimatedAmount: 120000,
    approvedAmount: 120000,
    deductibleApplied: 0,
    netPayoutEstimate: 120000,
    nextStep: 'Medical committee approved Temporary Total Disablement weekly cash allowance benefit for 6 weeks.',
    createdAt: '2026-05-18 16:45',
    damagedParts: [],
    photos: [],
    specializedDetails: {
      accidentDetails: 'Two-wheeler slip on wet road causing right leg tibia fracture',
      injuryCategory: 'Temporary Total Disablement (TTD - Weekly Allowance)',
      injuryNature: 'Right Tibia & Fibula Closed Compound Fracture',
      doctorName: 'Dr. Rajeshwar Sharma, MS (Ortho)',
      doctorRegNo: 'DMC-38910',
      hospitalClinic: 'AIIMS Trauma Centre / Max Healthcare',
      daysBedRest: 42,
      disabilityPercentage: 0,
      mlcFirNumber: 'MLC-DEL-2026/89102'
    },
    timeline: [
      { stage: 'Accident Intimation Lodged', stageKey: 'submitted', timestamp: '2026-05-18 16:45', status: 'completed', description: 'Emergency intimation logged with hospital casualty MLC slip.' },
      { stage: 'Saral Suraksha Policy Audit', stageKey: 'verified', timestamp: '2026-05-19 11:00', status: 'completed', description: 'Active ₹50 Lakh Capital Sum Insured verified.' },
      { stage: 'Medical Scrutiny & X-Ray Audit', stageKey: 'assessment', timestamp: '2026-05-20 14:30', status: 'completed', description: 'Medical officer confirmed orthopedic fracture reports and 6-week immobilization.' },
      { stage: 'TTD Benefit Approval', stageKey: 'approval', timestamp: '2026-05-21 16:00', status: 'completed', description: 'Approved for ₹1,20,000 statutory weekly indemnity.' },
      { stage: 'Direct NEFT Settlement', stageKey: 'settlement', timestamp: '2026-05-22 15:00', status: 'completed', description: 'Direct payment credited to claimant bank account.' }
    ],
    questionsAnswered: [
      { question: 'Was any intoxication or illegal racing involved?', answer: 'Negative. Normal city commuting in full compliance with traffic rules.' }
    ]
  },
  {
    id: 'CLM-LIF-2026-7788',
    claimNumber: 'OMNI-LIF-2026-7788',
    insuranceType: 'life',
    policyId: 'POL-LIF-009',
    policyNumber: 'OMNI-LIF-2024-8192',
    policyTitle: 'Omnisure Pure Term Life Shield (₹1 Crore Nominee Protection)',
    assetName: 'Life Cover: Late Shri Vikram Sindhi (Nominee: Smt. Ananya Sindhi)',
    incidentDate: '2026-07-14',
    incidentLocation: 'Max Super Speciality Hospital, Saket, New Delhi',
    incidentDescription: 'Death claim intimation following acute myocardial infarction of Life Assured Shri Vikram Sindhi. Intimated by registered nominee Smt. Ananya Sindhi (Spouse).',
    claimStatus: 'Approved',
    estimatedAmount: 10000000,
    approvedAmount: 10000000,
    deductibleApplied: 0,
    netPayoutEstimate: 10000000,
    nextStep: 'Section 45 statutory 3-year incontestability passed; National Claims Board approved direct NEFT payout of ₹1,00,00,000.',
    createdAt: '2026-07-15 10:30',
    damagedParts: [],
    photos: [],
    specializedDetails: {
      demiseDate: '2026-07-14',
      causeOfDeath: 'Acute Myocardial Infarction / Cardiopulmonary Arrest',
      placeOfDeath: 'Max Super Speciality Hospital, Saket, New Delhi',
      deathCertificateNo: 'NDMC-D-2026-09281',
      nomineeName: 'Smt. Ananya Sindhi',
      nomineeRelation: 'Spouse / Primary Registered Nominee',
      nomineeContact: '+91 98101 23456',
      nomineePan: 'ABCPS8912E',
      nomineeBankAccount: '50100492810921',
      bankIfscCode: 'HDFC0000043',
      claimantStatementSigned: true
    },
    timeline: [
      { stage: 'Death Claim Registered', stageKey: 'submitted', timestamp: '2026-07-15 10:30', status: 'completed', description: 'Nominee submitted death claim intimation with municipal death certificate.' },
      { stage: 'Section 45 & KYC Verification', stageKey: 'verified', timestamp: '2026-07-16 12:00', status: 'completed', description: 'Policy in force for over 3 years. Section 45 statutory protection confirmed.' },
      { stage: 'Medical Records & Attending Physician Audit', stageKey: 'assessment', timestamp: '2026-07-17 15:30', status: 'completed', description: 'Hospital case records and attending cardiologist certification reviewed.' },
      { stage: 'National Claims Committee Approval', stageKey: 'approval', timestamp: '2026-07-18 11:30', status: 'completed', description: 'Board sanctioned full ₹1,00,00,000 death benefit payment.' },
      { stage: 'Direct NEFT Payout to Nominee', stageKey: 'settlement', timestamp: '2026-07-19 14:00', status: 'completed', description: 'Electronic fund transfer executed directly to nominee HDFC Bank account.' }
    ],
    questionsAnswered: [
      { question: 'Is the nominee bank mandate verified via Penny-Drop test?', answer: 'Yes, Penny-drop NEFT test successfully matched nominee name with NPCI records.' }
    ]
  }
];

export const DYNAMIC_QUESTIONS_DICTIONARY: Record<string, DynamicClaimQuestion[]> = {
  windshield: [
    {
      id: 'q_ws_1',
      partId: 'windshield',
      partName: 'Front Windshield',
      questionEn: 'Was the windshield completely shattered or is it a localized crack spreading from an impact point?',
      questionHi: 'क्या विंडशील्ड पूरी तरह टूट गया है या किसी बिंदु से दरार फैल रही है?',
      optionsEn: ['Spiderweb crack spreading from stone/debris impact', 'Completely shattered / fractured', 'Small bullseye chip under 1 inch', 'Surface scratch only'],
      optionsHi: ['पत्थर लगने से मकड़ी के जाले जैसी दरार', 'पूरी तरह बिखर गया', '1 इंच से कम का छोटा चिप', 'सिर्फ सतह पर खरोंच']
    },
    {
      id: 'q_ws_2',
      partId: 'windshield',
      partName: 'Front Windshield',
      questionEn: 'Are there any sensors, rain detection units, or ADAS cameras mounted on the damaged glass section?',
      questionHi: 'क्या क्षतिग्रस्त हिस्से पर रेन-सेंसर या ADAS कैमरा लगा हुआ है?',
      optionsEn: ['Yes, ADAS camera & rain sensor located in impact area', 'Rain sensor only', 'Standard glass without mounted electronics', 'Not sure / Requires garage inspection'],
      optionsHi: ['हाँ, ADAS कैमरा और सेंसर प्रभावित क्षेत्र में हैं', 'केवल रेन सेंसर लगा है', 'सामान्य ग्लास, कोई इलेक्ट्रॉनिक सेंसर नहीं', 'निश्चित नहीं / गैराज जांच आवश्यक']
    }
  ],
  front_bumper: [
    {
      id: 'q_fb_1',
      partId: 'front_bumper',
      partName: 'Front Bumper',
      questionEn: 'Is the front bumper cracked, dented, detached from side brackets, or scratched?',
      questionHi: 'क्या फ्रंट बम्पर टूटा है, दबा हुआ है, ब्रैकेट से अलग हो गया है, या खरोंच लगी है?',
      optionsEn: ['Dented with detached side mounting clips', 'Deep crack/torn plastic requiring replacement', 'Scratched paint with minor dent', 'Completely dislodged from chassis'],
      optionsHi: ['दबा हुआ और साइड ब्रैकेट से अलग', 'गहरी दरार/फटा हुआ जिसे बदलना पड़ेगा', 'पेंट पर खरोंच और हल्का डेंट', 'गाड़ी से पूरी तरह अलग']
    },
    {
      id: 'q_fb_2',
      partId: 'front_bumper',
      partName: 'Front Bumper',
      questionEn: 'Is the vehicle currently roadworthy and safe to drive to the nearest cashless network workshop?',
      questionHi: 'क्या वाहन निकटतम कैशलेस वर्कशॉप तक सुरक्षित चलाने योग्य है?',
      optionsEn: ['Yes, fully drivable with clear wheel clearance', 'Drivable but bumper is rubbing tyre slightly', 'Not drivable / Free towing truck needed'],
      optionsHi: ['हाँ, पूरी तरह चलाने योग्य', 'चल सकती है लेकिन बम्पर टायर को छू रहा है', 'चलाने योग्य नहीं / टोइंग क्रेन की आवश्यकता']
    }
  ],
  side_mirror_left: [
    {
      id: 'q_sml_1',
      partId: 'side_mirror_left',
      partName: 'Left Side Mirror',
      questionEn: 'Is the mirror glass broken, or has the entire motorized folding assembly broken off the door mount?',
      questionHi: 'क्या केवल शीशा टूटा है, या पूरा इलेक्ट्रॉनिक फोल्डिंग मिरर दरवाजे से उखड़ गया है?',
      optionsEn: ['Only reflective mirror glass is cracked/fallen out', 'Entire electronic mirror assembly snapped off', 'Outer plastic cover shell scratched/missing', 'Indicator light on mirror broken'],
      optionsHi: ['केवल शीशा टूटा या गिरा है', 'पूरा इलेक्ट्रॉनिक असेंबली उखड़ गया', 'बाहरी प्लास्टिक कवर गायब या खरोंचा हुआ', 'मिरर पर लगा इंडिकेटर टूटा है']
    },
    {
      id: 'q_sml_2',
      partId: 'side_mirror_left',
      partName: 'Left Side Mirror',
      questionEn: 'Is the motorized electric adjustment and power-folding mechanism still functional?',
      questionHi: 'क्या इलेक्ट्रॉनिक एडजस्टमेंट और पावर-फोल्डिंग अभी काम कर रहा है?',
      optionsEn: ['Motor responds but mirror cannot adjust', 'Electrical motor completely dead/wires severed', 'Motor working fine, only glass cracked'],
      optionsHi: ['मोटर आवाज कर रही है पर घूम नहीं रहा', 'वायर कट गई है, मोटर बंद है', 'मोटर ठीक चल रही है, केवल शीशा टूटा']
    }
  ],
  side_mirror_right: [
    {
      id: 'q_smr_1',
      partId: 'side_mirror_right',
      partName: 'Right Side Mirror',
      questionEn: 'What is the condition of the right side mirror assembly?',
      questionHi: 'दाएँ साइड मिरर की क्या स्थिति है?',
      optionsEn: ['Mirror glass broken only', 'Complete assembly detached', 'Housing scratched', 'Turn indicator LED damaged'],
      optionsHi: ['केवल शीशा टूटा है', 'पूरी असेंबली अलग हो गई', 'हाउसिंग पर खरोंच', 'इंडिकेटर एलईडी टूटा']
    }
  ],
  bonnet_hood: [
    {
      id: 'q_bn_1',
      partId: 'bonnet_hood',
      partName: 'Bonnet / Hood',
      questionEn: 'Does the bonnet latch close and lock securely, or is it bent and popping open?',
      questionHi: 'क्या बोनेट का लॉक सही तरीके से बंद हो रहा है, या मुड़ जाने से खुला रह रहा है?',
      optionsEn: ['Latch closes securely, surface dented only', 'Bonnet is crumpled and will not lock safely', 'Minor surface scratches without deformation'],
      optionsHi: ['लॉक सही बंद होता है, केवल डेंट है', 'बोनेट मुड़ गया है और लॉक नहीं हो रहा', 'बिना डेंट के केवल खरोंच']
    },
    {
      id: 'q_bn_2',
      partId: 'bonnet_hood',
      partName: 'Bonnet / Hood',
      questionEn: 'Is there any visible coolant, battery acid, or engine oil leakage underneath the vehicle after impact?',
      questionHi: 'क्या टक्कर के बाद गाड़ी के नीचे कूलेंट, एसिड या इंजन ऑयल का रिसाव हो रहा है?',
      optionsEn: ['No leaks observed beneath car', 'Yes, green/pink coolant leaking from front radiator', 'Yes, dark engine oil puddle forming', 'Unsure / Need surveyor examination'],
      optionsHi: ['कोई रिसाव नहीं दिखा', 'हाँ, रेडिएटर से कूलेंट बह रहा है', 'हाँ, इंजन ऑयल का रिसाव हो रहा है', 'निश्चित नहीं / सर्वेक्षक जांच चाहिए']
    }
  ],
  headlight_left: [
    {
      id: 'q_hl_1',
      partId: 'headlight_left',
      partName: 'Left Headlight',
      questionEn: 'Is the internal LED/bulb functional, or is moisture/rain entering through a cracked lens?',
      questionHi: 'क्या अंदर का बल्ब/एलईडी काम कर रहा है, या टूटे लेंस से पानी अंदर जा रहा है?',
      optionsEn: ['Lens cracked, light still turns on', 'Assembly broken and light not functioning', 'Mounting clips broken, unit loose'],
      optionsHi: ['लेंस टूटा है, लाइट जल रही है', 'पूरी यूनिट टूट गई और लाइट बंद है', 'ब्रैकेट टूट गया, लाइट हिल रही है']
    }
  ],
  headlight_right: [
    {
      id: 'q_hr_1',
      partId: 'headlight_right',
      partName: 'Right Headlight',
      questionEn: 'Is the right headlight illumination working safely?',
      questionHi: 'क्या दायाँ हेडलाइट सुरक्षित रूप से जल रहा है?',
      optionsEn: ['Working normally despite cracked casing', 'Bulb blown/LED module damaged', 'Internal projector misaligned'],
      optionsHi: ['लेंस में दरार के बावजूद जल रहा है', 'बल्ब फ्यूज / मॉड्यूल खराब', 'प्रोजेक्टर हिल गया है']
    }
  ],
  rear_bumper: [
    {
      id: 'q_rb_1',
      partId: 'rear_bumper',
      partName: 'Rear Bumper',
      questionEn: 'Are the rear ultrasonic parking sensors or reverse camera damaged by the rear impact?',
      questionHi: 'क्या पीछे के पार्किंग सेंसर या बैक कैमरा टक्कर से खराब हुए हैं?',
      optionsEn: ['Sensors working normally', 'One or more sensors pushed in / damaged', 'Reverse camera glass cracked', 'No electronics fitted in rear bumper'],
      optionsHi: ['सेंसर सामान्य काम कर रहे हैं', 'सेंसर अंदर धंस गए या टूट गए', 'रिवर्स कैमरे का शीशा टूटा', 'बम्पर में कोई इलेक्ट्रॉनिक सेंसर नहीं है']
    }
  ],
  front_left_door: [
    {
      id: 'q_fld_1',
      partId: 'front_left_door',
      partName: 'Front Left Door',
      questionEn: 'Does the door open and shut flush with the vehicle pillars without jamming?',
      questionHi: 'क्या दरवाजा बिना अटके आसानी से खुल और बंद हो रहा है?',
      optionsEn: ['Opens and closes normally', 'Door is jammed and requires force', 'Hinges deformed, door sagging'],
      optionsHi: ['सामान्य रूप से खुलता और बंद होता है', 'दरवाजा अटक गया है, जोर लगाना पड़ता है', 'कब्जे मुड़ गए हैं']
    }
  ],
  front_right_door: [
    {
      id: 'q_frd_1',
      partId: 'front_right_door',
      partName: 'Front Right Door',
      questionEn: 'Is the driver side door latch and central locking functioning?',
      questionHi: 'क्या ड्राइवर साइड का दरवाजा और सेंट्रल लॉकिंग काम कर रहा है?',
      optionsEn: ['Fully functional, cosmetic dent only', 'Central lock mechanism jammed', 'Door skin crumpled into side impact beam'],
      optionsHi: ['पूरी तरह ठीक, केवल डेंट है', 'सेंट्रल लॉक अटक गया', 'दरवाजे की शीट ज्यादा दब गई है']
    }
  ],
  alloy_wheels: [
    {
      id: 'q_aw_1',
      partId: 'alloy_wheels',
      partName: 'Alloy Wheels',
      questionEn: 'Has the alloy rim suffered structural cracks, lip bending, or superficial gutter scuffing?',
      questionHi: 'क्या अलॉय व्हील में दरार आई है, किनारा मुड़ा है या केवल खरोंच है?',
      optionsEn: ['Rim is cracked / leaking air pressure', 'Lip is bent from pothole/impact', 'Superficial curb rash / paint scratch only'],
      optionsHi: ['रिम में दरार है / हवा निकल रही है', 'टक्कर से किनारा मुड़ गया है', 'केवल खरोंच लगी है']
    }
  ],
  tyres: [
    {
      id: 'q_ty_1',
      partId: 'tyres',
      partName: 'Tyre',
      questionEn: 'Was the tyre damaged directly as a result of the accidental collision (e.g. sidewall blowout or cut)?',
      questionHi: 'क्या टायर सीधे दुर्घटना के कारण फटा या कटा है?',
      optionsEn: ['Yes, severe sidewall cut from impact with road divider/kerb', 'Tyre burst during collision', 'Normal puncture / gradual air leak'],
      optionsHi: ['हाँ, डिवाइडर से टकराने से साइडवॉल कटा', 'दुर्घटना में टायर फट गया', 'सामान्य पंचर / पुरानी घिसावट']
    }
  ]
};

// Preset demo damaged vehicle photos to allow one-click testing
export const SAMPLE_DAMAGE_PHOTOS = [
  {
    name: 'Front Bumper & Headlight Impact (Demo)',
    url: 'https://images.unsplash.com/photo-1590362891988-3720743b1940?w=800&auto=format&fit=crop&q=80',
    partHint: 'front_bumper',
    description: 'Honda City front quarter collision with bumper crease and headlight displacement.'
  },
  {
    name: 'Windshield Stone Impact Crack (Demo)',
    url: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&auto=format&fit=crop&q=80',
    partHint: 'windshield',
    description: 'Radial starburst fracture on laminated glass with spreading spiderweb fissures.'
  },
  {
    name: 'Side Door Dent & Scratch (Demo)',
    url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
    partHint: 'front_left_door',
    description: 'Lateral scrape along the door sheet metal with primer exposure.'
  },
  {
    name: 'Side Mirror Broken Housing (Demo)',
    url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&auto=format&fit=crop&q=80',
    partHint: 'side_mirror_left',
    description: 'Left mirror housing snapped at pivot bracket with severed wiring harness.'
  }
];

// Seed Underwriting sample profiles
export const SAMPLE_UNDERWRITING_PROFILES = [
  {
    id: 'UW-01',
    customerName: 'Sahas Sindhi',
    customerAge: 32,
    city: 'New Delhi (NCR)',
    vehicleMakeModel: 'Honda City ZX 2024',
    vehicleInvoicePrice: 1680000,
    drivingExperienceYears: 8,
    priorClaimsIn3Years: 0,
    ncbPercentage: 35,
    hasKycUploaded: true,
    suggestedAddons: ['Zero Depreciation', 'Engine Protect', 'Roadside Assistance']
  },
  {
    id: 'UW-02',
    customerName: 'Sunita Mehra',
    customerAge: 51,
    city: 'Jaipur (Tier 2)',
    vehicleMakeModel: 'Tata Nexon EV 2023',
    vehicleInvoicePrice: 1540000,
    drivingExperienceYears: 22,
    priorClaimsIn3Years: 1,
    ncbPercentage: 20,
    hasKycUploaded: true,
    suggestedAddons: ['Battery Shield', 'Zero Dep', 'Tyre & Rim Cover']
  },
  {
    id: 'UW-03',
    customerName: 'Rohit Deshmukh',
    customerAge: 23,
    city: 'Pune (Tier 1)',
    vehicleMakeModel: 'BMW 330i Sport 2020 (Used)',
    vehicleInvoicePrice: 3200000,
    drivingExperienceYears: 2,
    priorClaimsIn3Years: 2,
    ncbPercentage: 0,
    hasKycUploaded: false,
    suggestedAddons: ['Strict Inspection Required', 'Engine Guard', 'Return to Invoice']
  }
];

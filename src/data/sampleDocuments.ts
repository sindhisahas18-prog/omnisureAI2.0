import { DocumentScanResult } from '../types';

export interface SampleDocumentPreset {
  id: string;
  nameEn: string;
  nameHi: string;
  category: 'vehicle' | 'medical' | 'repair' | 'fraud_showcase' | 'incomplete_showcase';
  badgeEn: string;
  badgeHi: string;
  badgeColor: string;
  descriptionEn: string;
  descriptionHi: string;
  previewImage: string;
  simulatedResult: DocumentScanResult;
}

export const SAMPLE_DOCUMENTS: SampleDocumentPreset[] = [
  {
    id: 'sample-rc',
    nameEn: 'Vehicle Registration Certificate (RC)',
    nameHi: 'वाहन पंजीयन प्रमाण पत्र (RC)',
    category: 'vehicle',
    badgeEn: '100% Authentic',
    badgeHi: 'पूर्णतः प्रामाणिक',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    descriptionEn: 'Official Transport Dept Smart Card RC with QR code, hologram & chassis checksum',
    descriptionHi: 'परिवहन विभाग का आधिकारिक स्मार्ट कार्ड आरसी (QR कोड और चेसिस संख्या सहित)',
    previewImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    simulatedResult: {
      id: 'SCAN-RC-9921',
      documentType: 'Vehicle Registration Certificate (Form 23A)',
      documentTypeHi: 'वाहन पंजीयन प्रमाण पत्र (फॉर्म 23A)',
      documentCategory: 'vehicle_rc',
      fileName: 'Honda_City_RC_DL01AX9921.jpg',
      fileSize: '1.8 MB',
      thumbnailUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
      scannedAt: 'Just now',
      authenticityScore: 98,
      authenticityStatus: 'verified',
      fraudRiskLevel: 'low',
      fraudRiskScore: 3,
      summaryEn: 'Valid Ministry of Road Transport & Highways (MoRTH) digital RC. Chassis and engine numbers match National Vahan portal credentials. No digital alterations detected.',
      summaryHi: 'सड़क परिवहन एवं राजमार्ग मंत्रालय का वैध डिजिटल आरसी। चेसिस व इंजन नंबर राष्ट्रीय वाहन पोर्टल से मेल खाते हैं। कोई डिजिटल छेड़छाड़ नहीं पाई गई।',
      extractedFields: [
        { label: 'Registration Number', labelHi: 'पंजीयन संख्या', value: 'DL-01-AX-9921', confidence: 99, category: 'identity', status: 'valid' },
        { label: 'Registered Owner', labelHi: 'पंजीकृत स्वामी', value: 'Sahas Sindhi', confidence: 98, category: 'identity', status: 'valid' },
        { label: 'Vehicle Maker / Model', labelHi: 'वाहन निर्माता व मॉडल', value: 'Honda City ZX i-VTEC', confidence: 97, category: 'asset', status: 'valid' },
        { label: 'Vehicle Class', labelHi: 'वाहन श्रेणी', value: 'Motor Car (LMV - Private)', confidence: 99, category: 'asset', status: 'valid' },
        { label: 'Chassis Number (VIN)', labelHi: 'चेसिस नंबर (VIN)', value: 'MAKGM6699N0184712', confidence: 98, category: 'asset', status: 'valid' },
        { label: 'Engine Number', labelHi: 'इंजन नंबर', value: 'L15Z1-8849201', confidence: 96, category: 'asset', status: 'valid' },
        { label: 'Fuel Type', labelHi: 'ईंधन प्रकार', value: 'Petrol / BS-VI Phase 2', confidence: 99, category: 'asset', status: 'valid' },
        { label: 'Registration Date', labelHi: 'पंजीयन तिथि', value: '14-Oct-2024', confidence: 98, category: 'dates', status: 'valid' },
        { label: 'Fitness Valid Upto', labelHi: 'फिटनेस वैधता', value: '13-Oct-2039', confidence: 97, category: 'dates', status: 'valid' },
        { label: 'Issuing RTO', labelHi: 'जारीकर्ता आरटीओ', value: 'RTO Mall Road, North Delhi (DL-01)', confidence: 96, category: 'authorization', status: 'valid' }
      ],
      verificationChecks: [
        { id: 'v1', title: 'MoRTH Vahan Database Match', titleHi: 'वाहन डेटाबेस सत्यापन', status: 'passed', score: 100, details: 'Active registration record verified with Central Transport Registry.', detailsHi: 'केंद्रीय परिवहन रजिस्ट्री के साथ सक्रिय पंजीकरण रिकॉर्ड सत्यापित।' },
        { id: 'v2', title: 'Holographic & Microprint Seal', titleHi: 'होलोग्राम व सुरक्षा मुहर', status: 'passed', score: 96, details: 'State emblem and Ashok Stambh watermark patterns verified.', detailsHi: 'राज्य प्रतीक और अशोक स्तंभ वॉटरमार्क पैटर्न सत्यापित।' },
        { id: 'v3', title: 'Digital QR Code Integrity', titleHi: 'डिजिटल क्यूआर कोड अखंडता', status: 'passed', score: 99, details: 'Cryptographic signature embedded in QR matches printed plaintext.', detailsHi: 'क्यूआर में एम्बेडेड हस्ताक्षर प्रिंटेड टेक्स्ट से पूर्णतः मेल खाता है।' },
        { id: 'v4', title: 'Chassis Checksum Validation', titleHi: 'चेसिस चेकसम सत्यापन', status: 'passed', score: 100, details: 'ISO 3779 VIN mathematical checksum strictly passes.', detailsHi: 'ISO 3779 वीआईएन गणितीय चेकसम पूर्णतः मान्य है।' }
      ],
      missingInformation: [],
      fraudSignals: [
        { id: 'f1', severity: 'low', signalName: 'Digital Font Regularity', signalNameHi: 'डिजिटल फॉन्ट एकरूपता', description: 'Consistent optical font kerning and density across all fields.', descriptionHi: 'सभी फील्ड्स में फॉन्ट कर्लिंग व डेंसिटी एकसमान है।', passed: true, confidence: 98 },
        { id: 'f2', severity: 'low', signalName: 'Pixel Grid Manipulation Check', signalNameHi: 'पिक्सेल ग्रिड संपादन जांच', description: 'No ELA (Error Level Analysis) compression anomalies detected around owner name or dates.', descriptionHi: 'नाम या तिथियों के पास कोई फोटोशॉप/इमेज संपादन असंगति नहीं मिली।', passed: true, confidence: 97 },
        { id: 'f3', severity: 'low', signalName: 'Hypothecation Discrepancy', signalNameHi: 'ऋण/हाइपोथिकेशन विसंगति', description: 'HPA to HDFC Bank Ltd verified with clean lien status.', descriptionHi: 'एचडीएफसी बैंक हाइपोथिकेशन रिकॉर्ड सत्यापित।', passed: true, confidence: 95 }
      ],
      rawOcrSnippet: 'GOVERNMENT OF NCT OF DELHI / TRANSPORT DEPARTMENT / CERTIFICATE OF REGISTRATION / REGN NO: DL-01-AX-9921 / NAME: SAHAS SINDHI / MAKER: HONDA CARS INDIA / CHASSIS: MAKGM6699N0184712 / ENG NO: L15Z1-8849201'
    }
  },
  {
    id: 'sample-medical',
    nameEn: 'Apollo Hospital Discharge Summary & Bill',
    nameHi: 'अपोलो हॉस्पिटल डिस्चार्ज सारांश व बिल',
    category: 'medical',
    badgeEn: 'Cashless Verified',
    badgeHi: 'कैशलेस सत्यापित',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    descriptionEn: 'Itemized inpatient healthcare bill, ICD-10 diagnostic coding & medical superintendent sign',
    descriptionHi: 'मरीज का बिल, ICD-10 रोग निदान कोड और अधिकृत डॉक्टर के हस्ताक्षर सहित',
    previewImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
    simulatedResult: {
      id: 'SCAN-MED-8402',
      documentType: 'Inpatient Hospital Discharge Summary & Final Bill',
      documentTypeHi: 'इनपेशेंट हॉस्पिटल डिस्चार्ज समरी व अंतिम बिल',
      documentCategory: 'hospital_discharge',
      fileName: 'Apollo_Indraprastha_Discharge_Bill_8402.pdf',
      fileSize: '3.2 MB',
      thumbnailUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
      scannedAt: 'Just now',
      authenticityScore: 95,
      authenticityStatus: 'verified',
      fraudRiskLevel: 'low',
      fraudRiskScore: 6,
      summaryEn: 'Genuine NABH-accredited hospital billing statement. Verified doctor registration, matching admission-discharge timeline, and zero room-rent sub-limit breach.',
      summaryHi: 'एनएबीएच मान्यता प्राप्त अस्पताल का वैध बिलिंग स्टेटमेंट। डॉक्टर का मेडिकल काउंसिल नंबर सत्यापित, कमरे के किराए की कोई उप-सीमा उल्लंघन नहीं।',
      extractedFields: [
        { label: 'Hospital Name', labelHi: 'अस्पताल का नाम', value: 'Indraprastha Apollo Hospitals, New Delhi', confidence: 99, category: 'authorization', status: 'valid' },
        { label: 'Patient / Member Name', labelHi: 'रोगी का नाम', value: 'Sahas Sindhi', confidence: 98, category: 'identity', status: 'valid' },
        { label: 'UHID / IPD No.', labelHi: 'रोगी आईडी (UHID)', value: 'UHID-AP-2025-901824', confidence: 97, category: 'identity', status: 'valid' },
        { label: 'Admission Date', labelHi: 'भर्ती तिथि', value: '18-Jan-2026, 09:30 AM', confidence: 98, category: 'dates', status: 'valid' },
        { label: 'Discharge Date', labelHi: 'डिस्चार्ज तिथि', value: '21-Jan-2026, 02:15 PM', confidence: 98, category: 'dates', status: 'valid' },
        { label: 'Primary Diagnosis (ICD-10)', labelHi: 'प्राथमिक निदान कोड', value: 'K35.80 (Acute Appendicitis w/ Laparoscopic Procedure)', confidence: 96, category: 'medical', status: 'valid' },
        { label: 'Treating Consultant', labelHi: 'उपचारक चिकित्सक', value: 'Dr. Vivek Mehra, MS, FRCS (MCI-48291)', confidence: 97, category: 'authorization', status: 'valid' },
        { label: 'Total Billed Amount', labelHi: 'कुल बिल राशि', value: '₹1,84,500', confidence: 99, category: 'financial', status: 'valid' },
        { label: 'Cashless Pre-Auth Amount', labelHi: 'कैशलेस पूर्व-स्वीकृति', value: '₹1,75,000', confidence: 96, category: 'financial', status: 'valid' },
        { label: 'Non-Payable / Deductibles', labelHi: 'गैर-देय कटौती', value: '₹9,500 (Sanitization & PPE consumables)', confidence: 95, category: 'financial', status: 'valid' }
      ],
      verificationChecks: [
        { id: 'v1', title: 'NABH Hospital Network Registry', titleHi: 'अस्पताल नेटवर्क सत्यापन', status: 'passed', score: 100, details: 'Indraprastha Apollo verified as Tier-1 Cashless Network Hospital.', detailsHi: 'अपोलो हॉस्पिटल टियर-1 कैशलेस नेटवर्क पार्टनर के रूप में सत्यापित।' },
        { id: 'v2', title: 'Doctor Medical Council Reg (NMC)', titleHi: 'डॉक्टर मेडिकल काउंसिल पंजीकरण', status: 'passed', score: 98, details: 'MCI/NMC registration #48291 is currently active in good standing.', detailsHi: 'एनएमसी पंजीकरण सक्रिय और वैध पाया गया।' },
        { id: 'v3', title: 'ICD-10 Clinical Treatment Correlation', titleHi: 'रोग व उपचार प्रक्रिया मिलान', status: 'passed', score: 96, details: 'Laparoscopic procedure matches standard clinical protocol for acute appendicitis.', detailsHi: 'सर्जिकल प्रक्रिया व दवाएं मानक मेडिकल प्रोटोकॉल के अनुरूप हैं।' }
      ],
      missingInformation: [
        {
          id: 'm1',
          field: 'Original Pharmacy Tax Invoices',
          fieldHi: 'मूल फार्मेसी टैक्स रसीदें',
          importance: 'recommended',
          reason: 'Consolidated summary present, but itemized medicine batch numbers will accelerate final audit.',
          reasonHi: 'दवाओं के बैच नंबर वाली रसीद संलग्न करने पर रीइंबर्समेंट और तेज होगा।',
          recommendation: 'Upload individual chemist billing receipts if claiming additional post-hospitalization medicines.',
          recommendationHi: 'डिस्चार्ज के बाद की दवाओं के लिए संबंधित बिल अपलोड करें।'
        }
      ],
      fraudSignals: [
        { id: 'f1', severity: 'low', signalName: 'Tariff Price Inflation Check', signalNameHi: 'अस्पताल दर वृद्धि जांच', description: 'Line-item surgeon fees and OT charges conform strictly to agreed GIPSA / PPN scheduled tariffs.', descriptionHi: 'डॉक्टर और ऑपरेशन थियेटर शुल्क बीमा कंपनी की मानक दरों के अनुकूल हैं।', passed: true, confidence: 98 },
        { id: 'f2', severity: 'low', signalName: 'Length of Stay (LOS) Audit', signalNameHi: 'अस्पताल में रहने की अवधि जांच', description: '3-day inpatient stay matches standard clinical recovery for laparoscopic appendectomy.', descriptionHi: '3 दिन का ठहराव लैप्रोस्कोपिक प्रक्रिया के लिए पूरी तरह तार्किक है।', passed: true, confidence: 96 }
      ]
    }
  },
  {
    id: 'sample-repair',
    nameEn: 'Apex Garage Motor Repair Estimate',
    nameHi: 'एपेक्स ऑटो गैराज रिपेयर अनुमान',
    category: 'repair',
    badgeEn: 'Cashless Network',
    badgeHi: 'कैशलेस नेटवर्क',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    descriptionEn: 'Itemized body shop estimation with labor hours, paint materials & parts replacement breakdown',
    descriptionHi: 'पार्ट्स रिप्लेसमेंट, पेंटिंग और लेबर घंटों का विस्तृत वर्कशॉप एस्टीमेट',
    previewImage: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
    simulatedResult: {
      id: 'SCAN-REP-3150',
      documentType: 'Cashless Bodyshop Repair Estimate & Tax Invoice',
      documentTypeHi: 'कैशलेस बॉडीशॉप रिपेयर एस्टीमेट व टैक्स इनवॉइस',
      documentCategory: 'repair_estimate',
      fileName: 'Apex_AutoWorks_Estimate_EST8894.pdf',
      fileSize: '1.5 MB',
      thumbnailUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
      scannedAt: 'Just now',
      authenticityScore: 96,
      authenticityStatus: 'verified',
      fraudRiskLevel: 'low',
      fraudRiskScore: 4,
      summaryEn: 'Authorized network workshop estimate for Honda City front bumper and windshield replacement. Depreciation correctly suppressed under Zero-Dep policy.',
      summaryHi: 'होंडा सिटी के फ्रंट बंपर व विंडशील्ड रिप्लेसमेंट हेतु अधिकृत नेटवर्क एस्टीमेट। जीरो-डेप के तहत मूल्यह्रास शून्य दर्ज।',
      extractedFields: [
        { label: 'Workshop Name', labelHi: 'वर्कशॉप का नाम', value: 'Apex Auto Works (Authorized Honda Partner)', confidence: 99, category: 'authorization', status: 'valid' },
        { label: 'GSTIN', labelHi: 'जीएसटी संख्या', value: '07AAAAA0000A1Z5', confidence: 98, category: 'authorization', status: 'valid' },
        { label: 'Vehicle Model & Reg', labelHi: 'वाहन मॉडल व नंबर', value: 'Honda City ZX (DL-01-AX-9921)', confidence: 99, category: 'asset', status: 'valid' },
        { label: 'Estimate Number', labelHi: 'एस्टीमेट संख्या', value: 'EST-2026-8894', confidence: 98, category: 'identity', status: 'valid' },
        { label: 'Accident Intimation Date', labelHi: 'दुर्घटना सूचना तिथि', value: '18-Feb-2026', confidence: 97, category: 'dates', status: 'valid' },
        { label: 'New Parts Cost', labelHi: 'नए पार्ट्स की लागत', value: '₹22,400 (Front Bumper + Windshield Glass)', confidence: 97, category: 'financial', status: 'valid' },
        { label: 'Painting & Consumables', labelHi: 'पेंटिंग व कंज्यूमेबल्स', value: '₹5,800', confidence: 96, category: 'financial', status: 'valid' },
        { label: 'Labor & Fitment Charges', labelHi: 'लेबर व फिटिंग चार्ज', value: '₹3,300', confidence: 96, category: 'financial', status: 'valid' },
        { label: 'Total Estimated Cost', labelHi: 'कुल अनुमानित लागत', value: '₹31,500', confidence: 99, category: 'financial', status: 'valid' },
        { label: 'Customer Compulsory Excess', labelHi: 'ग्राहक अनिवार्य कटौती', value: '₹1,000 (Titanium Zero-Dep Shield)', confidence: 98, category: 'financial', status: 'valid' }
      ],
      verificationChecks: [
        { id: 'v1', title: 'Network Garage Authorization Status', titleHi: 'अधिकृत नेटवर्क गैराज स्थिति', status: 'passed', score: 100, details: 'Active cashless facility agreement verified.', detailsHi: 'कैशलेस सुविधा अनुबंध सक्रिय पाया गया।' },
        { id: 'v2', title: 'OEM Parts Pricing Benchmark', titleHi: 'ओईएम पार्ट्स मूल्य बेंचमार्क', status: 'passed', score: 95, details: 'Honda official parts catalog pricing strictly matches line items.', detailsHi: 'होंडा आधिकारिक कैटलॉग से पुर्जों की कीमतें मेल खाती हैं।' }
      ],
      missingInformation: [],
      fraudSignals: [
        { id: 'f1', severity: 'low', signalName: 'Over-Repair / Phantom Damage Check', signalNameHi: 'अनावश्यक रिपेयर जांच', description: 'Estimated parts correspond 1:1 with digital 3D damage inspection photos.', descriptionHi: 'एस्टीमेट के पार्ट्स डिजिटल फोटो सर्वे से पूरी तरह मेल खाते हैं।', passed: true, confidence: 99 }
      ]
    }
  },
  {
    id: 'sample-fraud',
    nameEn: 'TAMPERED Garage Invoice (Fraud Showcase)',
    nameHi: 'संदिग्ध/छेड़छाड़ किया गया बिल (धोखाधड़ी का नमूना)',
    category: 'fraud_showcase',
    badgeEn: 'CRITICAL FRAUD DETECTED',
    badgeHi: 'गंभीर धोखाधड़ी का संकेत',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse',
    descriptionEn: 'Simulates digitally altered amounts, date paradoxes & forged letterheads caught by AI forensics',
    descriptionHi: 'कंप्यूटर से बदले गए बिल, गलत तारीखें और जाली लेटरहेड जिसे AI तुरंत पकड़ लेता है',
    previewImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    simulatedResult: {
      id: 'SCAN-FRD-9901',
      documentType: 'Motor Body Repair Bill (High Risk Alert)',
      documentTypeHi: 'मोटर बॉडी रिपेयर बिल (उच्च जोखिम चेतावनी)',
      documentCategory: 'repair_estimate',
      fileName: 'Suspect_Bodyshop_Invoice_Manipulated.pdf',
      fileSize: '940 KB',
      thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      scannedAt: 'Just now',
      authenticityScore: 24,
      authenticityStatus: 'suspicious',
      fraudRiskLevel: 'critical',
      fraudRiskScore: 92,
      summaryEn: 'CRITICAL ANOMALIES DETECTED: Font compression mismatch on total amount (₹1,31,500 has altered leading digit "1"). Invoice issue date precedes accident date by 14 days. GSTIN is invalid/blacklisted.',
      summaryHi: 'गंभीर असंगति का पता चला: कुल राशि में फॉन्ट डिजिटल रूप से बदला गया है (₹31,500 के आगे "1" जोड़ा गया है)। बिल की तारीख दुर्घटना की तारीख से 14 दिन पहले की है। जीएसटी नंबर अमान्य है।',
      extractedFields: [
        { label: 'Claimed Workshop Name', labelHi: 'दुकान का नाम', value: 'Metro Quick Repair Motors', confidence: 60, category: 'authorization', status: 'warning' },
        { label: 'GSTIN', labelHi: 'जीएसटी नंबर', value: '07XXXXX9999X9Z9 (CHECKSUM FAILED)', confidence: 40, category: 'authorization', status: 'warning' },
        { label: 'Invoice Date', labelHi: 'बिल की तारीख', value: '04-Feb-2026 (14 Days Prior to Accident)', confidence: 92, category: 'dates', status: 'warning' },
        { label: 'Claimed Total Amount', labelHi: 'दावा की गई कुल राशि', value: '₹1,31,500 (Digitally Altered)', confidence: 35, category: 'financial', status: 'warning' },
        { label: 'Calculated Sum of Line Items', labelHi: 'पार्ट्स का वास्तविक जोड़', value: '₹31,500 (Discrepancy: ₹1,00,000)', confidence: 99, category: 'financial', status: 'warning' }
      ],
      verificationChecks: [
        { id: 'v1', title: 'Official GSTIN Portal Verification', titleHi: 'जीएसटी पोर्टल सत्यापन', status: 'failed', score: 10, details: 'GSTIN does not exist in Central Board of Indirect Taxes database.', detailsHi: 'जीएसटी नंबर सरकारी डेटाबेस में मौजूद नहीं है।' },
        { id: 'v2', title: 'Digital Signature & Stamp Forensics', titleHi: 'डिजिटल हस्ताक्षर व मुहर फोरेंसिक', status: 'failed', score: 15, details: 'Rubber stamp graphic is an overlapping PNG asset copied from public web search.', detailsHi: 'मुहर का निशान इंटरनेट से डाउनलोड किया गया पीएनजी ग्राफिक है।' }
      ],
      missingInformation: [
        {
          id: 'm1',
          field: 'Original Cashier / Manager Signature',
          fieldHi: 'मूल कैशियर/मैनेजर हस्ताक्षर',
          importance: 'critical',
          reason: 'No physical ink signature detected on invoice document.',
          reasonHi: 'दस्तावेज़ पर कोई मूल स्याही का हस्ताक्षर नहीं पाया गया।',
          recommendation: 'Physical inspection and re-submission of original counterfoil required.',
          recommendationHi: 'मूल प्रति के साथ भौतिक सत्यापन आवश्यक है।'
        }
      ],
      fraudSignals: [
        { id: 'f1', severity: 'critical', signalName: 'Font & Error Level Analysis (ELA) Alteration', signalNameHi: 'फॉन्ट व पिक्सेल हेरफेर (ELA)', description: 'Extreme noise variance detected on amount ₹1,31,500. Leading digit "1" pasted in Arial while document body is Times Roman.', descriptionHi: 'राशि के पहले अंक "1" को बाद में जोड़ा गया है (अलग फॉन्ट और पिक्सेल आर्टिफैक्ट)।', passed: false, confidence: 99 },
        { id: 'f2', severity: 'critical', signalName: 'Chronological Date Paradox', signalNameHi: 'तारीखों की विरोधाभासी असंगति', description: 'Repair invoice dated 04-Feb-2026, whereas First Notice of Loss (FNOL) was recorded on 18-Feb-2026.', descriptionHi: 'बिल की तारीख 04 फरवरी है, जबकि दुर्घटना की रिपोर्ट 18 फरवरी को दर्ज की गई थी।', passed: false, confidence: 98 },
        { id: 'f3', severity: 'high', signalName: 'Arithmetic Subtotal Mismatch', signalNameHi: 'गणितीय जोड़ में भारी अंतर', description: 'Itemized lines sum to ₹31,500 but invoice total asserts ₹1,31,500 (+₹1,00,000 phantom charge).', descriptionHi: 'सभी पुर्जों का वास्तविक जोड़ ₹31,500 बनता है, जबकि कुल ₹1,31,500 दिखाया गया है।', passed: false, confidence: 100 },
        { id: 'f4', severity: 'high', signalName: 'Unregistered Vendor Entity', signalNameHi: 'अमान्य वर्कशॉप संस्था', description: 'Vendor address does not correspond to physical commercial workshop coordinates.', descriptionHi: 'वर्कशॉप का पता किसी अधिकृत कमर्शियल ऑटो गैराज से मेल नहीं खाता।', passed: false, confidence: 94 }
      ]
    }
  },
  {
    id: 'sample-incomplete',
    nameEn: 'Incomplete Hospital Bill (Missing Data Showcase)',
    nameHi: 'अपूर्ण मेडिकल बिल (छूटी हुई जानकारी का नमूना)',
    category: 'incomplete_showcase',
    badgeEn: 'Missing Mandatory Fields',
    badgeHi: 'अनिवार्य जानकारी गायब',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    descriptionEn: 'Shows automated detection of missing doctor registration, unitemized pharmacy & absent stamp',
    descriptionHi: 'डॉक्टर का रजिस्ट्रेशन नंबर, दवाओं की सूची और अस्पताल की मुहर न होने पर तत्काल सूचना',
    previewImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
    simulatedResult: {
      id: 'SCAN-INC-4109',
      documentType: 'Preliminary Inpatient Bill Draft (Incomplete)',
      documentTypeHi: 'अस्पताल इनपेशेंट बिल ड्राफ्ट (अपूर्ण)',
      documentCategory: 'medical_bill',
      fileName: 'Draft_Hospital_Bill_Unsigned.pdf',
      fileSize: '1.1 MB',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80',
      scannedAt: 'Just now',
      authenticityScore: 68,
      authenticityStatus: 'review_required',
      fraudRiskLevel: 'medium',
      fraudRiskScore: 38,
      summaryEn: 'Document appears to be a preliminary draft rather than final signed discharge certificate. Missing treating physician registration number and itemized medicine bills.',
      summaryHi: 'दस्तावेज़ अंतिम बिल के बजाय कच्चा ड्राफ्ट प्रतीत होता है। डॉक्टर का रजिस्ट्रेशन नंबर और दवाओं का अलग विवरण गायब है।',
      extractedFields: [
        { label: 'Patient Name', labelHi: 'मरीज का नाम', value: 'Sahas Sindhi', confidence: 95, category: 'identity', status: 'valid' },
        { label: 'Hospital Clinic Name', labelHi: 'अस्पताल/क्लिनिक', value: 'City Care Nursing Home', confidence: 85, category: 'authorization', status: 'valid' },
        { label: 'Billed Amount', labelHi: 'बिल राशि', value: '₹42,000 (Lump Sum)', confidence: 90, category: 'financial', status: 'warning' },
        { label: 'Treating Physician', labelHi: 'डॉक्टर का नाम', value: 'Dr. S. K. Sharma (Registration # MISSING)', confidence: 70, category: 'authorization', status: 'missing' },
        { label: 'Pharmacy Breakdown', labelHi: 'दवाओं का विवरण', value: 'NOT ITEMISED (Single line item ₹18,000)', confidence: 60, category: 'financial', status: 'missing' }
      ],
      verificationChecks: [
        { id: 'v1', title: 'Hospital License Check', titleHi: 'अस्पताल लाइसेंस जांच', status: 'warning', score: 65, details: 'Local nursing home license number not printed in header.', detailsHi: 'हेडर में नर्सिंग होम का लाइसेंस नंबर मुद्रित नहीं है।' },
        { id: 'v2', title: 'Authorized Stamp & Signature', titleHi: 'अधिकृत मुहर व हस्ताक्षर', status: 'failed', score: 20, details: 'No hospital seal or superintendent signature detected.', detailsHi: 'दस्तावेज़ पर अस्पताल की मुहर या हस्ताक्षर नहीं मिले।' }
      ],
      missingInformation: [
        {
          id: 'm1',
          field: 'Treating Doctor NMC / State Council Reg No.',
          fieldHi: 'डॉक्टर का मेडिकल काउंसिल रजिस्ट्रेशन नंबर',
          importance: 'critical',
          reason: 'IRDAI regulations require practicing medical council registration for inpatient reimbursement.',
          reasonHi: 'आईआरडीएआई नियमों के अनुसार क्लेम हेतु डॉक्टर का काउंसिल नंबर अनिवार्य है।',
          recommendation: 'Request the hospital to re-issue the discharge bill bearing the doctor\'s registration seal.',
          recommendationHi: 'अस्पताल से डॉक्टर की मुहर व रजिस्ट्रेशन नंबर युक्त बिल जारी करने का अनुरोध करें।'
        },
        {
          id: 'm2',
          field: 'Itemized Pharmacy / Consumables Invoice',
          fieldHi: 'दवाओं व सर्जिकल सामान की मदवार रसीद',
          importance: 'critical',
          reason: 'Lump-sum pharmacy charge cannot be audited for non-payable exclusions.',
          reasonHi: 'दवाओं के कुल योग से यह तय नहीं हो पाता कि कौन सा सामान पॉलिसी में कवर्ड है।',
          recommendation: 'Attach pharmacy bill with batch numbers and individual tax invoices.',
          recommendationHi: 'बैच नंबर वाली रसीदें अलग से संलग्न करें।'
        },
        {
          id: 'm3',
          field: 'Hospital Admission & Discharge Time Stamp',
          fieldHi: 'भर्ती व डिस्चार्ज का सटीक समय',
          importance: 'recommended',
          reason: 'Required to compute exact 24-hour hospitalization criteria.',
          reasonHi: '24 घंटे के इनपेशेंट मानदंड को प्रमाणित करने के लिए समय आवश्यक है।',
          recommendation: 'Ensure admission hour and discharge hour are clearly printed on discharge summary.',
          recommendationHi: 'डिस्चार्ज समरी पर भर्ती व छुट्टी का समय अंकित कराएं।'
        }
      ],
      fraudSignals: [
        { id: 'f1', severity: 'medium', signalName: 'Unitemized Lump-Sum Rounding', signalNameHi: 'सपाट गोल राशि (Lump-Sum)', description: 'Round figures (₹42,000, ₹18,000) typically indicate an un-audited manual estimate rather than hospital ERP billing.', descriptionHi: 'सपाट गोल आंकड़े (₹42,000) अक्सर ईआरपी बिलिंग के बजाय अनौपचारिक बिल का संकेत देते हैं।', passed: false, confidence: 80 }
      ]
    }
  }
];

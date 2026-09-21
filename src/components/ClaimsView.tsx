import React, { useState } from 'react';
import { 
  Clock, 
  Car, 
  Bike,
  HeartPulse,
  Home,
  Plane,
  Smartphone,
  Shield,
  Activity,
  Briefcase,
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  FileCheck, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Camera, 
  ArrowRight,
  ShieldAlert,
  Download,
  Building,
  User,
  Check
} from 'lucide-react';
import { InsuranceClaim, InsuranceType, Language } from '../types';
import { downloadClaimPDF } from '../utils/pdfGenerator';

interface ClaimsViewProps {
  claims: InsuranceClaim[];
  language: Language;
  onOpenDamageClaim: () => void;
}

export const ClaimsView: React.FC<ClaimsViewProps> = ({
  claims,
  language,
  onOpenDamageClaim
}) => {
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedClaimId, setSelectedClaimId] = useState<string>(claims[0]?.id || '');

  // Filter claims
  const filteredClaims = claims.filter(c => {
    if (selectedTypeFilter === 'all') return true;
    return c.insuranceType === selectedTypeFilter;
  });

  const activeClaim = filteredClaims.find(c => c.id === selectedClaimId) || filteredClaims[0] || claims[0];

  const getTypeIcon = (type?: InsuranceType) => {
    switch (type) {
      case 'bike': return <Bike className="w-4 h-4 text-emerald-600" />;
      case 'health': return <HeartPulse className="w-4 h-4 text-rose-600" />;
      case 'home': return <Home className="w-4 h-4 text-amber-600" />;
      case 'travel': return <Plane className="w-4 h-4 text-sky-600" />;
      case 'gadget': return <Smartphone className="w-4 h-4 text-indigo-600" />;
      case 'accident': return <Activity className="w-4 h-4 text-teal-600" />;
      case 'life': return <Shield className="w-4 h-4 text-red-600" />;
      case 'other': return <Briefcase className="w-4 h-4 text-slate-600" />;
      default: return <Car className="w-4 h-4 text-sky-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-[#172033] font-['Outfit']">
              {language === 'hi' ? 'क्लेम ट्रैकिंग व प्रबंधन (Claims Center)' : 'Claims Management & Live Tracking'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-xs font-bold">
              {claims.length} Recorded
            </span>
          </div>
          <p className="text-xs text-[#667085] mt-1">
            Track end-to-end First Notice of Loss (FNOL), tele-inspection reports, surveyor audits, and settlement timelines across all insurance lines.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenDamageClaim}
          className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer active:scale-98 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>{language === 'hi' ? 'नया क्लेम दर्ज करें' : 'Lodge Insurance Claim'}</span>
        </button>
      </div>

      {/* Insurance Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'All Claims', count: claims.length },
          { id: 'motor', label: 'Car / Motor', icon: <Car className="w-3.5 h-3.5" /> },
          { id: 'bike', label: 'Bike', icon: <Bike className="w-3.5 h-3.5" /> },
          { id: 'health', label: 'Health', icon: <HeartPulse className="w-3.5 h-3.5" /> },
          { id: 'home', label: 'Home', icon: <Home className="w-3.5 h-3.5" /> },
          { id: 'travel', label: 'Travel', icon: <Plane className="w-3.5 h-3.5" /> },
          { id: 'gadget', label: 'Gadget', icon: <Smartphone className="w-3.5 h-3.5" /> },
          { id: 'accident', label: 'Accident', icon: <Activity className="w-3.5 h-3.5" /> },
          { id: 'life', label: 'Life', icon: <Shield className="w-3.5 h-3.5" /> },
          { id: 'other', label: 'Other', icon: <Briefcase className="w-3.5 h-3.5" /> },
        ].map(tab => {
          const isActive = selectedTypeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setSelectedTypeFilter(tab.id);
                const firstMatching = claims.find(c => tab.id === 'all' || c.insuranceType === tab.id);
                if (firstMatching) setSelectedClaimId(firstMatching.id);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-sky-600 text-white font-bold shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-[#667085] border border-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#667085]'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Claims List and Selected Claim Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Claims Sidebar / List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold text-[#667085] uppercase tracking-wider block">
            Recorded Claims ({filteredClaims.length}):
          </span>

          {filteredClaims.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white border border-slate-200 text-[#667085] text-xs space-y-2 shadow-xs">
              <p>No claims found for this category.</p>
              <button
                type="button"
                onClick={onOpenDamageClaim}
                className="text-sky-600 hover:underline font-bold"
              >
                + File a new {selectedTypeFilter} claim
              </button>
            </div>
          ) : (
            filteredClaims.map(claim => {
              const isSelected = claim.id === activeClaim?.id;
              return (
                <div
                  key={claim.id}
                  onClick={() => setSelectedClaimId(claim.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-sky-500 shadow-sm ring-2 ring-sky-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs text-[#172033]'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-[#F8FAFC] border border-slate-200">
                        {getTypeIcon(claim.insuranceType)}
                      </div>
                      <span className="text-xs font-mono font-bold text-sky-700">{claim.claimNumber}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      claim.claimStatus === 'Approved' || claim.claimStatus === 'Settlement'
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                        : 'bg-sky-50 border border-sky-200 text-sky-700'
                    }`}>
                      {claim.claimStatus}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#172033] mb-1 line-clamp-1">
                    {claim.assetName || claim.vehicleName || 'Insured Asset'}
                  </h4>
                  
                  <div className="text-xs text-[#667085] flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{claim.incidentDate}</span>
                    <span>•</span>
                    <span className="capitalize text-[#172033] font-medium">{claim.insuranceType || 'General'}</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs pt-2.5 border-t border-slate-100">
                    <span className="text-[#667085]">
                      {claim.insuranceType === 'health' 
                        ? (claim.specializedDetails?.isCashless ? 'Cashless Pre-Auth' : 'Reimbursement')
                        : claim.damagedParts && claim.damagedParts.length > 0 
                        ? `${claim.damagedParts.length} parts evaluated`
                        : 'Surveyor Audited'}
                    </span>
                    <span className="font-bold text-emerald-700">
                      ₹{(claim.approvedAmount ?? claim.netPayoutEstimate ?? claim.estimatedAmount ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Claim Deep Dive (8 cols) */}
        {activeClaim ? (
          <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider bg-sky-50 border border-sky-100 px-2 py-0.5 rounded-full">
                    FNOL RECORD #{activeClaim.claimNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[#667085] text-[10px] font-bold uppercase">
                    {activeClaim.insuranceType}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold text-[#172033] font-['Outfit'] mt-1.5">
                  {activeClaim.assetName || activeClaim.vehicleName}
                </h2>
                
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#667085] mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-sky-600" /> {activeClaim.incidentDate}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-600" /> {activeClaim.incidentLocation}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                <button
                  type="button"
                  onClick={() => downloadClaimPDF(activeClaim)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-[#172033] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#667085]" />
                  <span>Download Dossier (PDF)</span>
                </button>
                <div className="text-right">
                  <span className="text-[10px] text-[#667085] uppercase tracking-wider block">Net Approved Payout</span>
                  <span className="text-xl font-extrabold text-emerald-700 font-mono">
                    ₹{(activeClaim.approvedAmount ?? activeClaim.netPayoutEstimate ?? activeClaim.estimatedAmount ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* SPECIALIZED DETAILS CARD BASED ON INSURANCE TYPE */}
            {activeClaim.insuranceType === 'health' && activeClaim.specializedDetails && (
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-rose-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4 text-rose-600" />
                    Hospitalization & Cashless TPA Authorization:
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold">
                    {activeClaim.specializedDetails.isCashless ? 'Direct Cashless Settlement' : 'Reimbursement'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[#667085] block">Hospital Name:</span>
                    <strong className="text-[#172033]">{activeClaim.specializedDetails.hospitalName}</strong>
                  </div>
                  <div>
                    <span className="text-[#667085] block">Patient Name:</span>
                    <strong className="text-[#172033]">{activeClaim.specializedDetails.patientName}</strong>
                  </div>
                  <div>
                    <span className="text-[#667085] block">Primary Diagnosis:</span>
                    <strong className="text-rose-700">{activeClaim.specializedDetails.ailment}</strong>
                  </div>
                  <div>
                    <span className="text-[#667085] block">Room Category:</span>
                    <strong className="text-[#172033]">{activeClaim.specializedDetails.roomCategory || 'Single Private'}</strong>
                  </div>
                  <div>
                    <span className="text-[#667085] block">Admission Period:</span>
                    <strong className="text-[#172033]">{activeClaim.specializedDetails.admissionDate} to {activeClaim.specializedDetails.dischargeDate || 'Ongoing'}</strong>
                  </div>
                  <div>
                    <span className="text-[#667085] block">Room Rent Capping:</span>
                    <strong className="text-emerald-700">Zero Capping (100% Covered)</strong>
                  </div>
                </div>
              </div>
            )}

            {activeClaim.insuranceType === 'bike' && activeClaim.specializedDetails && (
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-emerald-200 space-y-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Bike className="w-4 h-4 text-emerald-600" />
                  Two-Wheeler Accident Assessment:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[#667085] block">Bike Model:</span>
                    <strong className="text-[#172033]">{activeClaim.specializedDetails.bikeModel}</strong>
                  </div>
                  <div>
                    <span className="text-[#667085] block">Helmet Declaration:</span>
                    <strong className="text-emerald-700">✓ ISI Certified Helmet Worn</strong>
                  </div>
                  <div>
                    <span className="text-[#667085] block">Odometer:</span>
                    <strong className="text-[#172033]">{activeClaim.specializedDetails.odometerKm} KM</strong>
                  </div>
                </div>
              </div>
            )}

            {activeClaim.insuranceType === 'home' && activeClaim.specializedDetails && (
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-amber-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Home className="w-4 h-4 text-amber-600" />
                    Property & Structure Loss Dossier:
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                    Surveyor Assigned
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[#667085] block">Property Location:</span>
                    <strong className="text-[#172033]">{activeClaim.specializedDetails.propertyAddress || activeClaim.incidentLocation}</strong>
                  </div>
                  <div>
                    <span className="text-[#667085] block">Incident Peril:</span>
                    <strong className="text-amber-800">{activeClaim.specializedDetails.incidentType || activeClaim.specializedDetails.damageCause}</strong>
                  </div>
                  <div>
                    <span className="text-[#667085] block">Affected Rooms:</span>
                    <strong className="text-[#172033]">{activeClaim.specializedDetails.affectedRooms?.join(', ') || 'Interior Living Area'}</strong>
                  </div>
                </div>
              </div>
            )}

            {activeClaim.insuranceType === 'travel' && activeClaim.specializedDetails && (
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-sky-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-sky-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Plane className="w-4 h-4 text-sky-600" />
                    Overseas Travel Disruption Dossier:
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-[10px] font-bold">
                    PIR Verified
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[#667085] block">Flight / Airline:</span>
                    <strong className="text-[#172033]">{activeClaim.specializedDetails.airlineCarrier || 'International Carrier'} (PNR: {activeClaim.specializedDetails.pnrNumber || 'N/A'})</strong>
                  </div>
                  <div>
                    <span className="text-[#667085] block">Loss Event:</span>
                    <strong className="text-sky-700">{activeClaim.specializedDetails.travelLossType}</strong>
                  </div>
                  <div>
                    <span className="text-[#667085] block">Carrier PIR Ref:</span>
                    <strong className="text-[#172033] font-mono">{activeClaim.specializedDetails.carrierPIRNumber || 'Verified'}</strong>
                  </div>
                </div>
              </div>
            )}

            {activeClaim.insuranceType === 'gadget' && activeClaim.specializedDetails && (
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-indigo-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-indigo-600" />
                    Device Hardware & Service Hub Dossier:
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold">
                    OEM Authorised
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[#667085] block">Device Model:</span>
                    <strong className="text-[#172033]">{activeClaim.specializedDetails.deviceModel}</strong>
                  </div>
                  <div>
                    <span className="text-[#667085] block">Hardware Damage:</span>
                    <strong className="text-indigo-700">{activeClaim.specializedDetails.damagedComponent}</strong>
                  </div>
                  <div>
                    <span className="text-[#667085] block">Service Hub:</span>
                    <strong className="text-[#172033]">{activeClaim.specializedDetails.authorizedServiceCenter}</strong>
                  </div>
                </div>
              </div>
            )}

            {activeClaim.insuranceType === 'accident' && activeClaim.specializedDetails && (
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-teal-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-teal-600" />
                    Saral Suraksha Disablement Assessment:
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-[10px] font-bold">
                    Medical Board Audit
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[#667085] block">Benefit Category:</span>
                    <strong className="text-teal-700">{activeClaim.specializedDetails.injuryCategory}</strong>
                  </div>
                  <div>
                    <span className="text-[#667085] block">Attending Doctor:</span>
                    <strong className="text-[#172033]">{activeClaim.specializedDetails.doctorName} ({activeClaim.specializedDetails.doctorRegNo})</strong>
                  </div>
                  <div>
                    <span className="text-[#667085] block">Advised Bed Rest:</span>
                    <strong className="text-[#172033]">{activeClaim.specializedDetails.daysBedRest} Days (MLC: {activeClaim.specializedDetails.mlcFirNumber})</strong>
                  </div>
                </div>
              </div>
            )}

            {activeClaim.insuranceType === 'life' && activeClaim.specializedDetails && (
              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-red-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-red-600" />
                    Life Insurance Statutory Claim Dossier:
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-[10px] font-bold">
                    Section 45 Protected
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[#667085] block">Registered Nominee:</span>
                    <strong className="text-[#172033]">{activeClaim.specializedDetails.nomineeName} ({activeClaim.specializedDetails.nomineeRelation})</strong>
                  </div>
                  <div>
                    <span className="text-[#667085] block">Cause of Demise:</span>
                    <strong className="text-red-700">{activeClaim.specializedDetails.causeOfDeath}</strong>
                  </div>
                  <div>
                    <span className="text-[#667085] block">Settlement NEFT Mandate:</span>
                    <strong className="text-[#172033] font-mono">A/C: {activeClaim.specializedDetails.nomineeBankAccount} ({activeClaim.specializedDetails.bankIfscCode})</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Visual Multi-Stage Timeline Stepper */}
            <div>
              <h3 className="text-xs font-bold text-[#667085] uppercase tracking-wider mb-4">
                Live Claim Resolution Progress
              </h3>

              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {activeClaim.timeline.map((step, idx) => {
                  const isDone = step.status === 'completed';
                  const isCurrent = step.status === 'current';
                  return (
                    <div key={idx} className="relative group">
                      <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isDone
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isCurrent
                          ? 'bg-sky-600 text-white ring-4 ring-sky-100'
                          : 'bg-slate-200 text-[#667085]'
                      }`}>
                        {isDone ? '✓' : idx + 1}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className={`text-sm font-bold ${isCurrent ? 'text-sky-700' : isDone ? 'text-[#172033]' : 'text-[#667085]'}`}>
                          {step.stage}
                        </h4>
                        <span className="text-[11px] font-mono text-[#667085]">{step.timestamp}</span>
                      </div>
                      <p className="text-xs text-[#667085] mt-0.5">{step.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Damaged Parts (For Motor / Bike) */}
            {activeClaim.damagedParts && activeClaim.damagedParts.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-[#667085] uppercase tracking-wider">
                  Evaluated Components & Policy Coverage Status:
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeClaim.damagedParts.map(part => (
                    <div key={part.partId} className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-[#172033]">{part.partName}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          part.coverageStatus === 'covered' 
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' 
                            : 'bg-amber-50 border border-amber-200 text-amber-800'
                        }`}>
                          {part.coverageStatus === 'covered' ? 'Covered' : 'Requires Verification'}
                        </span>
                      </div>
                      <div className="text-xs text-[#667085] flex items-center gap-2">
                        <span>Type: <strong className="text-[#172033]">{part.damageType}</strong></span>
                        <span>•</span>
                        <span>Severity: <strong className="text-[#172033]">{part.severity}</strong></span>
                      </div>
                      <p className="text-[11px] text-[#667085] leading-snug pt-1">
                        {part.coverageReason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Financial Settlement Breakdown */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[#667085] block">Claimed / Gross Valuation:</span>
                <span className="font-bold text-[#172033] text-sm">₹{(activeClaim.estimatedAmount || 0).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[#667085] block">Compulsory Excess / Deductible:</span>
                <span className="font-bold text-rose-600 text-sm">-₹{activeClaim.deductibleApplied || 0}</span>
              </div>
              <div>
                <span className="text-[#667085] block">Net Approved Settlement:</span>
                <span className="font-bold text-emerald-700 text-sm">
                  ₹{(activeClaim.approvedAmount ?? activeClaim.netPayoutEstimate ?? activeClaim.estimatedAmount ?? 0).toLocaleString()}
                </span>
              </div>
            </div>

          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center text-[#667085] bg-white border border-slate-200 rounded-2xl">
            No claim selected.
          </div>
        )}

      </div>

    </div>
  );
};

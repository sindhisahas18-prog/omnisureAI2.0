import React, { useState, useEffect } from 'react';
import { 
  User, 
  ShieldCheck, 
  Car, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  CheckCircle2, 
  Lock, 
  Unlock,
  Bell, 
  FileCheck,
  AlertCircle,
  LogOut,
  HelpCircle,
  Sparkles,
  LogIn,
  Fingerprint,
  Eye,
  EyeOff,
  RotateCw
} from 'lucide-react';
import { Language, AuthUser } from '../types';
import { BiometricScanModal } from './BiometricScanModal';

interface ProfileViewProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenDamageClaim: () => void;
  currentUser?: AuthUser | null;
  onLogout: () => void;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onOpenTutorial: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  language,
  onLanguageChange,
  onOpenDamageClaim,
  currentUser,
  onLogout,
  onOpenAuth,
  onOpenTutorial
}) => {
  const isHindi = language === 'hi';

  const user = currentUser || {
    id: 'usr_default',
    name: 'Sahas Sindhi',
    email: 'sahas.sindhi@omnisure-preview.in',
    mobile: '+91 98110 44829',
    city: 'New Delhi',
    avatar: 'SS',
    customerId: 'OMNI-USR-99210',
    kycVerified: true,
    isLoggedIn: true
  };

  // Biometric Login State backed by local storage
  const [biometricEnabled, setBiometricEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('omnisure_biometric_login_enabled') === 'true';
    } catch {
      return false;
    }
  });

  // State for unlocked sensitive insurance details
  const [isSensitiveUnlocked, setIsSensitiveUnlocked] = useState<boolean>(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<'toggle_on' | 'unlock_vault' | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Check and sync local storage status on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('omnisure_biometric_login_enabled');
      if (stored === 'true') {
        setBiometricEnabled(true);
      }
    } catch {}
  }, []);

  const handleToggleBiometric = () => {
    if (!biometricEnabled) {
      // Simulate biometric sensor credential registration
      setPendingAction('toggle_on');
      setIsScanModalOpen(true);
    } else {
      // Turn off biometric login
      try {
        localStorage.setItem('omnisure_biometric_login_enabled', 'false');
      } catch {}
      setBiometricEnabled(false);
      setIsSensitiveUnlocked(false);
      setStatusMessage(
        isHindi 
          ? 'बायोमेट्रिक लॉगिन अक्षम किया गया। संवेदनशील विवरण सुरक्षित रूप से लॉक किए गए।' 
          : 'Biometric Login disabled. Sensitive insurance records locked.'
      );
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleTriggerUnlockVault = () => {
    setPendingAction('unlock_vault');
    setIsScanModalOpen(true);
  };

  const handleScanSuccess = () => {
    setIsScanModalOpen(false);

    if (pendingAction === 'toggle_on') {
      try {
        localStorage.setItem('omnisure_biometric_login_enabled', 'true');
        localStorage.setItem('omnisure_biometric_enrolled_at', new Date().toISOString());
      } catch {}
      setBiometricEnabled(true);
      setIsSensitiveUnlocked(true);
      setStatusMessage(
        isHindi 
          ? 'सफलता: बायोमेट्रिक सुरक्षा सक्रिय हुई! त्वरित पहुंच अनलॉक हो गई।' 
          : 'Success: Biometric credentials verified and stored locally. Fast access unlocked!'
      );
    } else if (pendingAction === 'unlock_vault') {
      setIsSensitiveUnlocked(true);
      setStatusMessage(
        isHindi 
          ? 'बायोमेट्रिक सत्यापन सफल: संवेदनशील बीमा विवरण अनलॉक किए गए।' 
          : 'Biometric check passed: Sensitive insurance & KYC details unmasked.'
      );
    }

    setPendingAction(null);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleScanCancel = () => {
    setIsScanModalOpen(false);
    setPendingAction(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-['Plus_Jakarta_Sans']">
      
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700 font-bold text-2xl shadow-xs">
            {user.avatar || user.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#172033] font-['Outfit']">
                {user.name}
              </h1>
              {user.kycVerified && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  KYC Verified
                </span>
              )}
            </div>
            <p className="text-xs text-[#667085]">
              Customer ID: <span className="font-mono text-sky-700 font-semibold">{user.customerId || 'OMNI-USR-99210'}</span> • Verified InsurTech Member
            </p>
          </div>
        </div>

        {/* Action Controls: App Tour, Language, Sign Out */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            id="profile-view-tutorial-btn"
            onClick={onOpenTutorial}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-[#172033] transition-all cursor-pointer shadow-xs"
          >
            <HelpCircle className="w-4 h-4 text-sky-600" />
            <span>{isHindi ? 'ट्यूटोरियल देखें' : 'View Tutorial'}</span>
          </button>

          {/* Language switch */}
          <div className="flex items-center gap-1 bg-[#F8FAFC] p-1 rounded-xl border border-slate-200">
            <Globe className="w-3.5 h-3.5 text-sky-600 ml-1.5" />
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                language === 'en' ? 'bg-white text-sky-700 font-bold shadow-xs border border-slate-200' : 'text-[#667085]'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                language === 'hi' ? 'bg-white text-sky-700 font-bold shadow-xs border border-slate-200' : 'text-[#667085]'
              }`}
            >
              हिंदी
            </button>
          </div>

          {user.isLoggedIn ? (
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold transition-all cursor-pointer shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isHindi ? 'लॉग आउट' : 'Sign Out'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Notification Status Alert */}
      {statusMessage && (
        <div 
          id="biometric-status-alert"
          className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Grid: Personal Info, Linked Vehicles, Security */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sensitive Customer & KYC Information Vault */}
        <div 
          id="sensitive-insurance-vault-card"
          className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#667085] uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-sky-600" />
              {isHindi ? 'सत्यापित बीमा व केवाईसी विवरण' : 'Sensitive KYC & Insurance Data'}
            </h3>

            {isSensitiveUnlocked ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                <Fingerprint className="w-3 h-3 text-emerald-600" />
                {isHindi ? 'अनलॉक' : 'Unlocked'}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold flex items-center gap-1">
                <Lock className="w-3 h-3 text-amber-600" />
                {isHindi ? 'सुरक्षित रूप से लॉक' : 'Locked'}
              </span>
            )}
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Driving License */}
            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200">
              <span className="text-[#667085] block mb-0.5">
                {isHindi ? 'ड्राइविंग लाइसेंस (DL Number):' : 'Driving License (DL):'}
              </span>
              <span className="font-mono font-bold text-[#172033]">
                {isSensitiveUnlocked ? 'DL-0420160088921 (Valid till 2038)' : 'DL-0420•••••••• (Protected)'}
              </span>
            </div>

            {/* Permanent Account Number (PAN) */}
            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200">
              <span className="text-[#667085] block mb-0.5">
                {isHindi ? 'पैन कार्ड (Income Tax / NSDL):' : 'PAN Card (NSDL Verified):'}
              </span>
              <span className="font-mono font-bold text-[#172033]">
                {isSensitiveUnlocked ? 'ABCDE1234F (Verified)' : 'ABCDE••••F (Masked)'}
              </span>
            </div>

            {/* Central KYC / Aadhaar Identifier */}
            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200">
              <span className="text-[#667085] block mb-0.5">
                {isHindi ? 'सेंट्रल केवाईसी (CKYC Registry ID):' : 'Central KYC ID (CKYC):'}
              </span>
              <span className="font-mono font-bold text-[#172033]">
                {isSensitiveUnlocked ? '8892-4102-9921' : '••••-••••-9921'}
              </span>
            </div>

            {/* Settlement Bank Account */}
            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200">
              <span className="text-[#667085] block mb-0.5">
                {isHindi ? 'दावा निपटान बैंक खाता (Direct NEFT):' : 'Claim Settlement Bank Account:'}
              </span>
              <span className="font-mono font-bold text-[#172033]">
                {isSensitiveUnlocked ? 'HDFC Bank • A/C: 50100492819022 (IFSC: HDFC0000182)' : 'HDFC Bank • A/C: ••••••••9022'}
              </span>
            </div>

            {/* Primary Policy Nominee */}
            <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200">
              <span className="text-[#667085] block mb-0.5">
                {isHindi ? 'नामित व्यक्ति (Primary Nominee):' : 'Primary Nominee Beneficiary:'}
              </span>
              <span className="font-bold text-[#172033]">
                {isSensitiveUnlocked ? 'Riya Sindhi (Spouse) • 100% Entitlement' : 'Riya •••• (Spouse)'}
              </span>
            </div>
          </div>

          {/* Biometric Unlock Trigger Action */}
          <div className="pt-2">
            {!isSensitiveUnlocked ? (
              <button
                type="button"
                id="unlock-sensitive-details-btn"
                onClick={handleTriggerUnlockVault}
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
              >
                <Fingerprint className="w-4 h-4" />
                <span>{isHindi ? 'बायोमेट्रिक से विवरण अनलॉक करें' : 'Unlock with Biometrics'}</span>
              </button>
            ) : (
              <button
                type="button"
                id="lock-sensitive-details-btn"
                onClick={() => setIsSensitiveUnlocked(false)}
                className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#667085] text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isHindi ? 'विवरण पुनः लॉक करें' : 'Lock Sensitive Details'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Linked Vehicles */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-[#667085] uppercase tracking-wider flex items-center gap-2">
            <Car className="w-4 h-4 text-sky-600" />
            {isHindi ? 'पंजीकृत वाहन (InsurTech Telematics)' : 'Registered Vehicles (InsurTech Telematics)'}
          </h3>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-sky-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#172033]">Honda City ZX 1.5 i-VTEC</span>
              <span className="px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                Covered
              </span>
            </div>
            <div className="text-xs font-mono text-sky-700 font-semibold">DL-01-AX-9921</div>
            <div className="text-[11px] text-[#667085]">
              Policy: OMNI-MTR-2024-8849 (Titanium Zero-Depreciation)
            </div>
            <button
              type="button"
              onClick={onOpenDamageClaim}
              className="w-full mt-2 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
            >
              {isHindi ? 'इस कार के लिए क्लेम दर्ज करें' : 'Report Damage for this Car'}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#172033]">Hyundai Creta SX(O)</span>
              <span className="text-[10px] text-[#667085]">Family Car</span>
            </div>
            <div className="text-xs font-mono text-[#667085]">MH-02-EE-4502</div>
          </div>
        </div>

        {/* Security, Biometric Login & Preferences */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-[#667085] uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-sky-600" />
            {isHindi ? 'सुरक्षा व प्राथमिकताएँ' : 'Security & Fast Access Settings'}
          </h3>

          <div className="space-y-2.5 text-xs">
            
            {/* Biometric Login Toggle with Simulated Secure Enclave Check */}
            <div 
              id="biometric-login-setting-card"
              className={`p-3.5 rounded-xl border transition-all ${
                biometricEnabled 
                  ? 'bg-sky-50/50 border-sky-200' 
                  : 'bg-[#F8FAFC] border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    biometricEnabled ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    <Fingerprint className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#172033] block">
                      {isHindi ? 'बायोमेट्रिक लॉगिन (Face ID / Touch ID)' : 'Biometric Login (Face ID / Touch ID)'}
                    </span>
                    <span className="text-[#667085] text-[11px] block mt-0.5">
                      {isHindi 
                        ? 'स्थानीय सुरक्षित स्टोरेज चेक के साथ तुरंत प्रमाणीकरण' 
                        : 'Secure local storage check for fast access & sensitive KYC unlock'}
                    </span>
                  </div>
                </div>

                {/* Interactive Switch Toggle */}
                <button
                  type="button"
                  id="biometric-login-toggle"
                  role="switch"
                  aria-checked={biometricEnabled}
                  onClick={handleToggleBiometric}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out shrink-0 ${
                    biometricEnabled ? 'bg-sky-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      biometricEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Hardware & Enclave status indicator */}
              <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px]">
                <span className="text-[#667085] font-mono">
                  {biometricEnabled ? 'localStorage: enrolled (Active)' : 'localStorage: unconfigured'}
                </span>
                <span className={`font-semibold flex items-center gap-1 ${
                  biometricEnabled ? 'text-emerald-600' : 'text-slate-400'
                }`}>
                  <ShieldCheck className="w-3 h-3" />
                  {biometricEnabled ? (isHindi ? 'हार्डवेयर सुरक्षित' : 'Enclave Bound') : (isHindi ? 'अक्षम' : 'Disabled')}
                </span>
              </div>
            </div>

            {/* Other System Preferences */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-slate-200">
              <div>
                <span className="font-bold text-[#172033] block">AI Instant Survey</span>
                <span className="text-[#667085] text-[11px]">Allow computer vision damage scan</span>
              </div>
              <span className="text-emerald-700 font-bold">Enabled</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-slate-200">
              <div>
                <span className="font-bold text-[#172033] block">WhatsApp Claim Alerts</span>
                <span className="text-[#667085] text-[11px]">Real-time surveyor and workshop updates</span>
              </div>
              <span className="text-emerald-700 font-bold">Active</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-slate-200">
              <div>
                <span className="font-bold text-[#172033] block">Voice Copilot Language</span>
                <span className="text-[#667085] text-[11px]">Automatic speech recognition locale</span>
              </div>
              <span className="text-sky-700 font-bold">{language === 'en' ? 'en-IN' : 'hi-IN'}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Simulated Biometric Verification Modal */}
      <BiometricScanModal
        isOpen={isScanModalOpen}
        language={language}
        onSuccess={handleScanSuccess}
        onCancel={handleScanCancel}
        title={
          pendingAction === 'toggle_on'
            ? (isHindi ? 'बायोमेट्रिक क्रेडेंशियल नामांकन' : 'Enroll Biometric Credential')
            : (isHindi ? 'संवेदनशील विवरण अनलॉक करें' : 'Unlock Sensitive Records')
        }
        subTitle={
          pendingAction === 'toggle_on'
            ? (isHindi 
                ? 'सुरक्षित स्थानीय स्टोरेज में बायोमेट्रिक कुंजी संग्रहीत करने के लिए टच आईडी या फेस आईडी स्कैन करें।' 
                : 'Touch sensor or use Face ID to store encrypted local biometric credential for fast access.')
            : (isHindi 
                ? 'अपने ड्राइविंग लाइसेंस, पैन कार्ड व बैंक विवरण को अनलॉक करने के लिए बायोमेट्रिक सेंसर स्पर्श करें।' 
                : 'Touch biometric sensor to unlock protected driving license, PAN and bank account details.')
        }
      />

    </div>
  );
};

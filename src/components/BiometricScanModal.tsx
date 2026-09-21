import React, { useState, useEffect } from 'react';
import { Fingerprint, CheckCircle2, AlertCircle, X, ShieldCheck, Sparkles, Lock } from 'lucide-react';
import { Language } from '../types';

interface BiometricScanModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  title?: string;
  subTitle?: string;
  language: Language;
}

export const BiometricScanModal: React.FC<BiometricScanModalProps> = ({
  isOpen,
  onSuccess,
  onCancel,
  title,
  subTitle,
  language
}) => {
  const isHindi = language === 'hi';
  const [scanState, setScanState] = useState<'scanning' | 'success' | 'failed'>('scanning');

  useEffect(() => {
    if (!isOpen) {
      setScanState('scanning');
      return;
    }

    setScanState('scanning');
    // Simulate hardware sensor scan and local storage enclave check
    const timer = setTimeout(() => {
      setScanState('success');
      const completeTimer = setTimeout(() => {
        onSuccess();
      }, 700);
      return () => clearTimeout(completeTimer);
    }, 1100);

    return () => clearTimeout(timer);
  }, [isOpen, onSuccess]);

  if (!isOpen) return null;

  return (
    <div 
      id="biometric-scan-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div 
        id="biometric-scan-modal"
        className="bg-white rounded-3xl max-w-sm w-full border border-slate-200 shadow-2xl p-7 text-center space-y-6 animate-in zoom-in-95 duration-200"
      >
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Biometric Sensor Graphic */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          {scanState === 'scanning' && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-sky-400/40 animate-ping opacity-50" />
              <div className="absolute inset-[-4px] rounded-full border border-sky-500/30 animate-pulse" />
            </>
          )}

          <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
            scanState === 'success' 
              ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-300'
              : 'bg-sky-50 text-sky-600 border-2 border-sky-300'
          }`}>
            {scanState === 'success' ? (
              <CheckCircle2 className="w-10 h-10 animate-in zoom-in-75 duration-300" />
            ) : (
              <Fingerprint className="w-10 h-10 animate-pulse" />
            )}
          </div>
        </div>

        {/* Status Text */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-[#172033] font-['Outfit']">
            {scanState === 'success' ? (
              isHindi ? 'बायोमेट्रिक प्रमाणीकरण सफल!' : 'Biometric Verified!'
            ) : (
              title || (isHindi ? 'बायोमेट्रिक सेंसर सत्यापन' : 'Biometric Sensor Check')
            )}
          </h3>
          <p className="text-xs text-[#667085] leading-relaxed">
            {scanState === 'success' ? (
              isHindi 
                ? 'सुरक्षित स्थानीय कुंजी सत्यापित। बीमा विवरण अनलॉक किए जा रहे हैं...' 
                : 'Secure enclave verified. Unlocking sensitive insurance records...'
            ) : (
              subTitle || (isHindi 
                ? 'फिंगरप्रिंट सेंसर को स्पर्श करें अथवा फेस आईडी से सत्यापित करें' 
                : 'Touch the device sensor or authenticate via Face ID to unlock fast access')
            )}
          </p>
        </div>

        {/* Hardware & Enclave Security Badge */}
        <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-[11px] text-[#667085] flex items-center justify-center gap-1.5 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>AES-256 Client-Side Enclave • Verified</span>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#667085] text-xs font-semibold cursor-pointer transition-colors"
        >
          {isHindi ? 'रद्द करें' : 'Cancel'}
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  MapPin, 
  Car, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Shield, 
  Zap,
  X,
  Fingerprint
} from 'lucide-react';
import { AuthUser, Language } from '../types';
import { BiometricScanModal } from './BiometricScanModal';

interface AuthViewProps {
  language: Language;
  onLoginSuccess: (user: AuthUser, isNewSignup?: boolean) => void;
  onCancel?: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthView: React.FC<AuthViewProps> = ({
  language,
  onLoginSuccess,
  onCancel,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  // Login Form State — Default demo user: SAHAS SINDHI
  const [loginIdentifier, setLoginIdentifier] = useState('sahas.sindhi@omnisure.in');
  const [loginPassword, setLoginPassword] = useState('OmniSure#2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Signup Form State
  const [signupName, setSignupName] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupCity, setSignupCity] = useState('');
  const [signupPolicyInterest, setSignupPolicyInterest] = useState('motor');
  const [signupVehicleReg, setSignupVehicleReg] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Status & Validation states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [showBiometricModal, setShowBiometricModal] = useState(false);

  // Check if biometric login was previously enabled on this device
  const isBiometricEnabled = (() => {
    try {
      return localStorage.getItem('omnisure_biometric_login_enabled') === 'true';
    } catch {
      return false;
    }
  })();

  // Instant 1-Click Demo Login as Sahas Sindhi
  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsLoading(false);
      const demoUser: AuthUser = {
        id: 'usr_sahas_demo',
        name: 'Sahas Sindhi',
        email: 'sahas.sindhi@omnisure.in',
        mobile: '+91 98110 44829',
        city: 'New Delhi',
        state: 'Delhi NCR',
        vehicleRegNo: 'DL-01-AX-9921',
        preferredPolicyType: 'motor',
        avatar: 'SS',
        customerId: 'OMNI-USR-99210',
        kycVerified: true,
        isLoggedIn: true,
        memberSince: '2023'
      };
      onLoginSuccess(demoUser, false);
    }, 400);
  };

  // Validate & Execute Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const idTrimmed = loginIdentifier.trim();
    if (!idTrimmed) {
      setErrorMessage(
        language === 'hi' 
          ? 'कृपया अपना ईमेल पता या मोबाइल नंबर दर्ज करें।' 
          : 'Please enter your email or mobile number.'
      );
      return;
    }

    if (!loginPassword) {
      setErrorMessage(
        language === 'hi' 
          ? 'कृपया अपना पासवर्ड दर्ज करें।' 
          : 'Please enter your password.'
      );
      return;
    }

    if (loginPassword.length < 6) {
      setErrorMessage(
        language === 'hi'
          ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।'
          : 'Password must be at least 6 characters long.'
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      const user: AuthUser = {
        id: 'usr_' + Math.floor(10000 + Math.random() * 90000),
        name: 'Sahas Sindhi',
        email: idTrimmed.includes('@') ? idTrimmed : 'sahas.sindhi@omnisure.in',
        mobile: idTrimmed.match(/^\+?\d{10,12}$/) ? idTrimmed : '+91 98110 44829',
        city: 'New Delhi',
        state: 'Delhi NCR',
        vehicleRegNo: 'DL-01-AX-9921',
        preferredPolicyType: 'motor',
        avatar: 'SS',
        customerId: 'OMNI-USR-99210',
        kycVerified: true,
        isLoggedIn: true,
        memberSince: '2023'
      };

      // Custom name if user typed something custom
      if (!idTrimmed.toLowerCase().includes('sahas') && idTrimmed.includes('@')) {
        const customPrefix = idTrimmed.split('@')[0].replace('.', ' ');
        user.name = customPrefix.charAt(0).toUpperCase() + customPrefix.slice(1);
        user.avatar = user.name.slice(0, 2).toUpperCase();
      }

      onLoginSuccess(user, false);
    }, 500);
  };

  // Validate & Execute Signup
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!signupName.trim()) {
      setErrorMessage(language === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setErrorMessage(language === 'hi' ? 'कृपया मान्य ईमेल पता दर्ज करें।' : 'Please enter a valid email address.');
      return;
    }
    if (!signupMobile.trim() || signupMobile.length < 10) {
      setErrorMessage(language === 'hi' ? 'कृपया मान्य 10-अंकीय मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!signupPassword || signupPassword.length < 6) {
      setErrorMessage(language === 'hi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage(language === 'hi' ? 'पासवर्ड और कन्फर्म पासवर्ड मेल नहीं खाते।' : 'Passwords do not match.');
      return;
    }
    if (!acceptTerms) {
      setErrorMessage(language === 'hi' ? 'कृपया नियम व गोपनीयता शर्तों को स्वीकार करें।' : 'Please accept the Terms of Service & Privacy Policy.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const newUser: AuthUser = {
        id: 'usr_' + Math.floor(10000 + Math.random() * 90000),
        name: signupName.trim(),
        email: signupEmail.trim(),
        mobile: signupMobile.trim(),
        city: signupCity.trim() || 'New Delhi',
        state: 'Delhi NCR',
        vehicleRegNo: signupVehicleReg.trim().toUpperCase() || 'DL-01-AX-9921',
        preferredPolicyType: (signupPolicyInterest as any) || 'motor',
        avatar: signupName.trim().slice(0, 2).toUpperCase(),
        customerId: `OMNI-USR-${Math.floor(10000 + Math.random() * 90000)}`,
        kycVerified: true,
        isLoggedIn: true,
        memberSince: new Date().getFullYear().toString()
      };

      onLoginSuccess(newUser, true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#F6F8FC] flex items-center justify-center p-4 sm:p-6 font-['Plus_Jakarta_Sans']">
      
      {/* Subtle Ambient Soft Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-sky-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl" />
      </div>

      {/* Main Glass/Card Container */}
      <div className="relative z-10 w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-lg animate-in fade-in zoom-in-95 duration-300 space-y-6">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-6 h-6 text-sky-600" />
          </div>
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight font-['Outfit']">
              OMNISURE
            </h1>
            <span className="text-[11px] font-bold text-sky-600 tracking-widest uppercase block">
              INSURTECH PLATFORM
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#667085] max-w-xs pt-1">
            {mode === 'login'
              ? (language === 'hi' ? 'अपनी पॉलिसियों और दावों का प्रबंधन करने के लिए लॉगिन करें।' : 'Sign in to manage policies, track smart claims, and consult your AI Advisor.')
              : (language === 'hi' ? 'नया ओम्निश्योर खाता बनाएं और शून्य-मूल्यह्रास कवर प्राप्त करें।' : 'Create your OMNISURE account for automated onboarding and policy management.')
            }
          </p>
        </div>

        {/* Demo Fast Login Ribbon (Convenience & Reviewer friendly) */}
        {mode === 'login' && (
          <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
              <div>
                <span className="text-[#172033] font-semibold block">Demo User: <strong className="text-sky-700">Sahas Sindhi</strong></span>
                <span className="text-[10px] text-[#667085]">Pre-configured with motor, health & life policies</span>
              </div>
            </div>
            <button
              type="button"
              id="quick-demo-login-btn"
              onClick={handleQuickDemoLogin}
              disabled={isLoading}
              className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs cursor-pointer transition-all active:scale-95 shrink-0"
            >
              1-Click Sign In
            </button>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#F1F5F9] border border-slate-200 text-xs font-semibold">
          <button
            type="button"
            id="tab-login-btn"
            onClick={() => { setMode('login'); setErrorMessage(null); }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'login' 
                ? 'bg-white text-[#172033] font-bold shadow-xs border border-slate-200/60' 
                : 'text-[#667085] hover:text-[#172033]'
            }`}
          >
            {language === 'hi' ? 'साइन इन (Sign In)' : 'Sign In'}
          </button>
          <button
            type="button"
            id="tab-signup-btn"
            onClick={() => { setMode('signup'); setErrorMessage(null); }}
            className={`py-2 rounded-xl transition-all cursor-pointer ${
              mode === 'signup' 
                ? 'bg-white text-[#172033] font-bold shadow-xs border border-slate-200/60' 
                : 'text-[#667085] hover:text-[#172033]'
            }`}
          >
            {language === 'hi' ? 'नया खाता बनाएं (Sign Up)' : 'Create Account'}
          </button>
        </div>

        {/* ----------------------------------------------------
            LOGIN FORM
           ---------------------------------------------------- */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Email or Mobile */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#172033] block">
                {language === 'hi' ? 'ईमेल या 10-अंकीय मोबाइल नंबर' : 'Email Address or Mobile Number'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  id="login-identifier-input"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="sahas.sindhi@omnisure.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 focus:border-sky-500 focus:bg-white focus:outline-none text-[#172033] placeholder:text-slate-400 text-xs sm:text-sm transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#172033] block">
                  {language === 'hi' ? 'पासवर्ड' : 'Password'}
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-sky-600 hover:text-sky-700 font-medium hover:underline cursor-pointer"
                >
                  {language === 'hi' ? 'पासवर्ड भूल गए?' : 'Forgot Password?'}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  id="login-password-input"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 focus:border-sky-500 focus:bg-white focus:outline-none text-[#172033] placeholder:text-slate-400 text-xs sm:text-sm transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#667085]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span>{language === 'hi' ? 'मुझे याद रखें' : 'Remember me on this device'}</span>
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm tracking-wide shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>{language === 'hi' ? 'सत्यापित हो रहा है...' : 'Authenticating Secure Session...'}</span>
              ) : (
                <>
                  <span>{language === 'hi' ? 'साइन इन करें' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Fast Biometric Login (when enabled in localStorage) */}
            {isBiometricEnabled && (
              <button
                type="button"
                id="auth-biometric-login-btn"
                onClick={() => setShowBiometricModal(true)}
                className="w-full py-2.5 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shadow-xs"
              >
                <Fingerprint className="w-4 h-4 text-sky-600" />
                <span>
                  {language === 'hi' 
                    ? 'बायोमेट्रिक से तुरंत लॉगिन करें (Face ID / Touch ID)' 
                    : 'Fast Biometric Sign In (Face ID / Touch ID)'}
                </span>
              </button>
            )}
          </form>
        ) : (
          /* ----------------------------------------------------
              SIGN UP FORM
             ---------------------------------------------------- */
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#172033] block">
                {language === 'hi' ? 'पूरा नाम' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  id="signup-name-input"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="e.g. Sahas Sindhi"
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 focus:border-sky-500 focus:bg-white focus:outline-none text-[#172033] placeholder:text-slate-400 text-xs transition-colors"
                />
              </div>
            </div>

            {/* Mobile & Email Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#172033] block">
                  {language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    id="signup-mobile-input"
                    value={signupMobile}
                    onChange={(e) => setSignupMobile(e.target.value)}
                    placeholder="+91 98110 44829"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 focus:border-sky-500 focus:bg-white focus:outline-none text-[#172033] placeholder:text-slate-400 text-xs transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#172033] block">
                  {language === 'hi' ? 'ईमेल पता' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    id="signup-email-input"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 focus:border-sky-500 focus:bg-white focus:outline-none text-[#172033] placeholder:text-slate-400 text-xs transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#172033] block">
                  {language === 'hi' ? 'पासवर्ड' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    id="signup-password-input"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full pl-10 pr-8 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 focus:border-sky-500 focus:bg-white focus:outline-none text-[#172033] placeholder:text-slate-400 text-xs transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#172033] block">
                  {language === 'hi' ? 'कन्फर्म पासवर्ड' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    id="signup-confirm-password-input"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 focus:border-sky-500 focus:bg-white focus:outline-none text-[#172033] placeholder:text-slate-400 text-xs transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Basic Info: City & Vehicle Reg */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#172033] block">
                  {language === 'hi' ? 'शहर / राज्य' : 'City / Location'}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    id="signup-city-input"
                    value={signupCity}
                    onChange={(e) => setSignupCity(e.target.value)}
                    placeholder="e.g. New Delhi"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 focus:border-sky-500 focus:bg-white focus:outline-none text-[#172033] placeholder:text-slate-400 text-xs transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#172033] block">
                  {language === 'hi' ? 'वाहन नंबर (यदि लागू हो)' : 'Vehicle Reg. (Optional)'}
                </label>
                <div className="relative">
                  <Car className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    id="signup-vehicle-input"
                    value={signupVehicleReg}
                    onChange={(e) => setSignupVehicleReg(e.target.value)}
                    placeholder="e.g. DL-01-AX-9921"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 focus:border-sky-500 focus:bg-white focus:outline-none text-[#172033] placeholder:text-slate-400 text-xs transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#667085] leading-relaxed">
                <input
                  type="checkbox"
                  id="signup-terms-checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 mt-0.5"
                />
                <span>
                  {language === 'hi'
                    ? 'मैं OMNISURE सेवा की शर्तों और IRDAI डेटा सुरक्षा नीतियों से सहमत हूँ।'
                    : 'I agree to the OMNISURE Terms of Service, Privacy Policy and IRDAI data compliance.'}
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="signup-submit-btn"
              disabled={isLoading}
              className="w-full py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm tracking-wide shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span>{language === 'hi' ? 'खाता तैयार हो रहा है...' : 'Creating Verified Account...'}</span>
              ) : (
                <>
                  <span>{language === 'hi' ? 'खाता बनाएं' : 'Create My Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-60 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => { setShowForgotModal(false); setForgotSent(false); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
              <Lock className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#172033] font-['Outfit']">
                {language === 'hi' ? 'पासवर्ड रीसेट करें' : 'Reset Password'}
              </h3>
              <p className="text-xs text-[#667085]">
                {language === 'hi' 
                  ? 'अपना पंजीकृत ईमेल दर्ज करें, हम एक सुरक्षित लॉगिन लिंक भेजेंगे।' 
                  : 'Enter your registered email to receive a secure recovery code.'}
              </p>
            </div>

            {forgotSent ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Reset instructions sent to your email!</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (forgotEmail) setForgotSent(true);
                }}
                className="space-y-3"
              >
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="sahas.sindhi@omnisure.in"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs text-[#172033] placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  Send Reset Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Biometric Scan Modal for Fast Sign In */}
      <BiometricScanModal
        isOpen={showBiometricModal}
        language={language}
        onSuccess={() => {
          setShowBiometricModal(false);
          handleQuickDemoLogin();
        }}
        onCancel={() => setShowBiometricModal(false)}
        title={language === 'hi' ? 'बायोमेट्रिक से लॉगिन करें' : 'Fast Biometric Sign In'}
        subTitle={language === 'hi' ? 'सुरक्षित स्थानीय क्रेडेंशियल से सत्यापन हो रहा है...' : 'Verifying local device enclave to sign in as Sahas Sindhi...'}
      />

    </div>
  );
};

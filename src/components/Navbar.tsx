import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Car, 
  FileText, 
  Bot, 
  User, 
  Globe, 
  PhoneCall, 
  Sparkles, 
  Menu, 
  X,
  AlertTriangle,
  Clock,
  Layers,
  HelpCircle,
  LogIn,
  LogOut,
  UserPlus,
  FileSearch
} from 'lucide-react';
import { NavigationTab, Language, AuthUser } from '../types';

interface NavbarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  language: Language;
  onToggleLanguage: () => void;
  onOpenDamageClaim: () => void;
  activeClaimsCount: number;
  currentUser?: AuthUser | null;
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  onLogout: () => void;
  onOpenTutorial: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  language,
  onToggleLanguage,
  onOpenDamageClaim,
  activeClaimsCount,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenTutorial
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);

  const navItems: { id: NavigationTab; labelEn: string; labelHi: string; icon: any; badge?: number }[] = [
    { id: 'home', labelEn: 'Home', labelHi: 'होम', icon: ShieldCheck },
    { id: 'policies', labelEn: 'My Policies', labelHi: 'मेरी पॉलिसियाँ', icon: FileText },
    { id: 'claims', labelEn: 'Claims', labelHi: 'क्लेम्स', icon: Clock, badge: activeClaimsCount },
    { id: 'docscan', labelEn: 'AI Doc Scan', labelHi: 'AI डॉक स्कैन', icon: FileSearch },
    { id: 'ai', labelEn: 'Omnisure AI', labelHi: 'ओम्निश्योर AI', icon: Bot },
    { id: 'tutorial', labelEn: 'How It Works', labelHi: 'ट्यूटोरियल', icon: Layers },
    { id: 'profile', labelEn: 'Profile', labelHi: 'प्रोफ़ाइल', icon: User }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo */}
            <div 
              id="brand-logo-btn"
              onClick={() => onTabChange('home')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-600 p-0.5 shadow-sm group-hover:shadow-md transition-all">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-sky-600 group-hover:scale-105 transition-transform" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold tracking-tight text-xl text-[#172033] font-['Outfit']">
                  OMNISURE
                </span>
                <span className="text-[10px] font-bold text-sky-600 tracking-wider uppercase -mt-1">
                  INSURTECH
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-2xl border border-slate-200/80">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-tab-${item.id}`}
                    onClick={() => onTabChange(item.id)}
                    className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-white text-sky-700 shadow-xs border border-slate-200/80'
                        : 'text-[#667085] hover:text-[#172033] hover:bg-white/60 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                    <span>{language === 'hi' ? item.labelHi : item.labelEn}</span>

                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span className="w-4 h-4 flex items-center justify-center bg-sky-600 text-white text-[10px] font-bold rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Quick Action Toolbar */}
            <div className="hidden lg:flex items-center gap-2.5">
              {/* Interactive App Tour / Tutorial Quick Button */}
              <button
                type="button"
                id="header-app-tour-btn"
                onClick={onOpenTutorial}
                title="Guided App Tour / गाइडेड टूर"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-sky-300 text-xs font-semibold text-slate-700 hover:text-sky-700 transition-all cursor-pointer shadow-xs"
              >
                <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                <span>{language === 'hi' ? 'ऐप टूर' : 'App Tour'}</span>
              </button>

              {/* Language Switcher */}
              <button
                type="button"
                id="language-toggle-btn"
                onClick={onToggleLanguage}
                title="Switch Language / भाषा बदलें"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-sky-300 text-xs font-semibold text-slate-700 hover:text-sky-700 transition-all cursor-pointer shadow-xs"
              >
                <Globe className="w-3.5 h-3.5 text-sky-600" />
                <span>{language === 'en' ? 'EN' : 'HI'}</span>
              </button>

              {/* Emergency Roadside SOS */}
              <button
                type="button"
                id="emergency-sos-btn"
                onClick={() => setShowSosModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-semibold text-rose-700 transition-all cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                <span>{language === 'hi' ? '24x7 SOS' : '24x7 SOS'}</span>
              </button>

              {/* Primary Signature CTA: Lodge Insurance Claim */}
              <button
                type="button"
                id="header-start-claim-btn"
                onClick={onOpenDamageClaim}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs tracking-wide shadow-sm hover:shadow transition-all cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>{language === 'hi' ? 'नया क्लेम' : 'Lodge Claim'}</span>
              </button>

              {/* User Authentication Status or Sign In Button */}
              {currentUser && currentUser.isLoggedIn ? (
                <div className="flex items-center gap-1.5 pl-1 border-l border-slate-200">
                  <button
                    type="button"
                    onClick={() => onTabChange('profile')}
                    title={`${currentUser.name} (${currentUser.email})`}
                    className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-sky-300 transition-all cursor-pointer group"
                  >
                    <div className="w-6 h-6 rounded-lg bg-sky-600 flex items-center justify-center text-white text-[10px] font-black">
                      {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-[#172033] group-hover:text-sky-700 max-w-[90px] truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={onLogout}
                    title="Sign Out / लॉग आउट"
                    className="p-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
                  <button
                    type="button"
                    onClick={() => onOpenAuth('login')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-[#172033] cursor-pointer shadow-xs"
                  >
                    <LogIn className="w-3.5 h-3.5 text-sky-600" />
                    <span>Sign In</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenAuth('signup')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-xs font-bold text-sky-700 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Sign Up</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={onToggleLanguage}
                className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-bold"
              >
                {language === 'en' ? 'EN' : 'HI'}
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#172033]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-2 shadow-lg">
            <div className="grid grid-cols-2 gap-2 pb-2">
              <button
                onClick={() => {
                  onOpenDamageClaim();
                  setMobileMenuOpen(false);
                }}
                className="col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-sm shadow-xs"
              >
                <Car className="w-4 h-4" />
                {language === 'hi' ? 'स्मार्ट कार डैमेज क्लेम' : 'Smart Car Damage Claim'}
              </button>
              <button
                onClick={() => {
                  setShowSosModal(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                {language === 'hi' ? '24x7 आपातकालीन' : '24x7 SOS Help'}
              </button>
              <button
                onClick={() => {
                  onToggleLanguage();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold"
              >
                <Globe className="w-3.5 h-3.5 text-sky-600" />
                {language === 'en' ? 'Switch to हिंदी' : 'Switch to English'}
              </button>
            </div>

            <div className="border-t border-slate-100 pt-2 space-y-1">
              {/* App Tour mobile button */}
              <button
                type="button"
                onClick={() => {
                  onOpenTutorial();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium text-sky-700 bg-sky-50 border border-sky-200"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-sky-600" />
                  <span>{language === 'hi' ? 'गाइडेड ऐप टूर' : 'Guided App Tour'}</span>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              </button>

              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium ${
                      isActive
                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                        : 'text-slate-600 hover:text-[#172033] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-sky-600" />
                      <span>{language === 'hi' ? item.labelHi : item.labelEn}</span>
                    </div>
                    {item.badge ? (
                      <span className="px-2 py-0.5 bg-sky-600 text-white text-xs font-bold rounded-full">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}

              {/* Mobile Auth actions */}
              <div className="pt-2 border-t border-slate-100">
                {currentUser && currentUser.isLoggedIn ? (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-sky-600 flex items-center justify-center text-white font-black text-xs">
                        {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#172033]">{currentUser.name}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[150px]">{currentUser.email}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onOpenAuth('login');
                        setMobileMenuOpen(false);
                      }}
                      className="py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 text-center shadow-xs"
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onOpenAuth('signup');
                        setMobileMenuOpen(false);
                      }}
                      className="py-2 rounded-xl bg-sky-600 text-white text-xs font-bold text-center shadow-xs"
                    >
                      Create Account
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 24x7 Emergency Roadside Assistance SOS Modal */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowSosModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#172033] font-['Outfit']">
                  {language === 'hi' ? '24x7 आपातकालीन रोडसाइड सहायता' : '24x7 Roadside Emergency SOS'}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'hi' ? 'PAN इंडिया टोइंग व सहायता नेटवर्क' : 'PAN-India Towing, Flat Tyre, Jumpstart'}
                </p>
              </div>
            </div>

            <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-4 mb-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#667085]">Toll-Free SOS Helpline:</span>
                <span className="font-mono text-sky-700 font-bold text-sm">1800-209-8894</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#667085]">Registered Vehicle:</span>
                <span className="text-[#172033] font-semibold">Honda City ZX (DL-01-AX-9921)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#667085]">Towing Entitlement:</span>
                <span className="text-emerald-700 font-semibold">100% Free up to 100km</span>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href="tel:18002098894"
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center justify-center gap-2 text-sm shadow-sm transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                {language === 'hi' ? 'कॉल करें: 1800-209-8894' : 'Call Emergency SOS (1800-209-8894)'}
              </a>
              <button
                type="button"
                onClick={() => {
                  setShowSosModal(false);
                  onOpenDamageClaim();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
              >
                {language === 'hi' ? 'या दुर्घटना डैमेज क्लेम दर्ज करें' : 'Or Report Vehicle Damage First'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

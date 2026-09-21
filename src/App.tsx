import React, { useState, useEffect } from 'react';
import { NavigationTab, Language, InsurancePolicy, InsuranceClaim, AuthUser } from './types';
import { POLICIES_DATABASE, CLAIMS_DATABASE } from './data/insuranceData';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { PoliciesView } from './components/PoliciesView';
import { ClaimsView } from './components/ClaimsView';
import { OmnisureAIView } from './components/OmnisureAIView';
import { ProfileView } from './components/ProfileView';
import { MultiInsuranceClaimModal } from './components/MultiInsuranceClaimModal';
import { HowItWorksView } from './components/HowItWorksView';
import { AuthView } from './components/AuthView';
import { OnboardingTutorialModal } from './components/OnboardingTutorialModal';
import { CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [language, setLanguage] = useState<Language>('en');
  
  // Requirement 1: Login page MUST be the first screen when app opens
  // Check if an active session was already authenticated in current session
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const sessionActive = sessionStorage.getItem('omnisure_session_active');
      if (sessionActive === 'true') {
        const saved = localStorage.getItem('omnisure_auth_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.isLoggedIn) {
            return parsed;
          }
        }
      }
    } catch (e) {}
    // Defaults to null on fresh load so user lands on Login first
    return null;
  });

  // Dedicated modal state for switching auth if requested inside profile
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | null>(null);

  // Onboarding Guided App Tour State
  const [showOnboardingTutorial, setShowOnboardingTutorial] = useState<boolean>(false);

  // Data state
  const [policies, setPolicies] = useState<InsurancePolicy[]>(POLICIES_DATABASE);
  const [claims, setClaims] = useState<InsuranceClaim[]>(CLAIMS_DATABASE);

  // Claim Modal state
  const [isDamageClaimOpen, setIsDamageClaimOpen] = useState<boolean>(false);
  const [initialClaimPolicyId, setInitialClaimPolicyId] = useState<string | undefined>();

  // Toast Notification state
  const [notification, setNotification] = useState<{ message: string; sub?: string } | null>(null);

  // Fetch live state from backend API if available
  useEffect(() => {
    fetch('/api/policies')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.policies) {
          setPolicies(data.policies);
        }
      })
      .catch(() => {});

    fetch('/api/claims')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.claims) {
          setClaims(data.claims);
        }
      })
      .catch(() => {});
  }, []);

  const handleOpenDamageClaim = (policyId?: string) => {
    setInitialClaimPolicyId(policyId);
    setIsDamageClaimOpen(true);
  };

  const handleClaimSubmitted = (newClaim: InsuranceClaim) => {
    setClaims(prev => [newClaim, ...prev]);
    setNotification({
      message: language === 'hi' ? 'क्लेम सफलतापूर्वक दर्ज हुआ!' : 'Insurance Claim Successfully Submitted!',
      sub: `${newClaim.claimNumber} • ${newClaim.assetName || newClaim.policyTitle || 'Policy Incident'}`
    });

    // Auto navigate to Claims tab to see the live timeline
    setActiveTab('claims');

    // Auto-dismiss toast
    setTimeout(() => {
      setNotification(null);
    }, 6000);
  };

  const handleRenewPolicy = (policyId: string, updatedPolicy: Partial<InsurancePolicy>) => {
    setPolicies(prev => prev.map(p => {
      if (p.id === policyId) {
        return {
          ...p,
          ...updatedPolicy
        };
      }
      return p;
    }));

    // Post to server API if available
    fetch(`/api/policies/${policyId}/renew`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPolicy)
    }).catch(() => {});

    const targetPolicy = policies.find(p => p.id === policyId);
    const policyTitle = targetPolicy ? (language === 'hi' ? targetPolicy.titleHi : targetPolicy.title) : 'Policy';

    setNotification({
      message: language === 'hi' ? 'पॉलिसी सफलतापूर्वक नवीनीकृत की गई!' : 'Policy Renewed Successfully!',
      sub: `${policyTitle} • ${language === 'hi' ? '365 दिन अतिरिक्त सुरक्षा कवच' : '365 days continuous protection active'}`
    });

    setTimeout(() => {
      setNotification(null);
    }, 6000);
  };

  const handleLoginSuccess = (user: AuthUser, isNewSignup: boolean = false) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('omnisure_auth_user', JSON.stringify(user));
      sessionStorage.setItem('omnisure_session_active', 'true');
    } catch (e) {}

    setAuthModalMode(null);
    setActiveTab('home');

    setNotification({
      message: language === 'hi' ? `स्वागत है, ${user.name}!` : `Welcome, ${user.name}!`,
      sub: language === 'hi' ? 'आपकी सभी पॉलिसियाँ सुरक्षित हैं' : 'All active policies and services are ready'
    });

    // Requirement 8: Show tutorial automatically ONLY after first successful login
    try {
      const hasDoneTutorial = localStorage.getItem('omnisure_tutorial_completed');
      if (!hasDoneTutorial) {
        setTimeout(() => {
          setShowOnboardingTutorial(true);
        }, 600);
      }
    } catch (e) {}

    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('omnisure_auth_user');
      sessionStorage.removeItem('omnisure_session_active');
    } catch (e) {}

    setNotification({
      message: language === 'hi' ? 'सफलतापूर्वक लॉग आउट किया गया' : 'Logged out successfully',
      sub: language === 'hi' ? 'सुरक्षित सत्र समाप्त' : 'Session ended safely'
    });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // ----------------------------------------------------
  // FIRST SCREEN RULE: If not logged in, render Premium Animated Login
  // ----------------------------------------------------
  if (!currentUser || !currentUser.isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F6F8FC] text-[#172033] font-['Plus_Jakarta_Sans'] selection:bg-sky-500 selection:text-white">
        <AuthView
          language={language}
          onLoginSuccess={handleLoginSuccess}
          initialMode="login"
        />

        {/* Toast Notification Alert */}
        {notification && (
          <div className="fixed bottom-6 right-6 z-50 max-w-md bg-white border border-emerald-200 p-4 rounded-2xl shadow-xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-xs font-bold text-[#172033]">{notification.message}</h4>
              {notification.sub && <p className="text-[11px] text-[#667085] mt-0.5">{notification.sub}</p>}
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F8FC] text-[#172033] flex flex-col font-['Plus_Jakarta_Sans'] selection:bg-sky-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'tutorial') {
            setShowOnboardingTutorial(true);
          } else {
            setActiveTab(tab);
          }
        }}
        language={language}
        onToggleLanguage={() => setLanguage(l => (l === 'en' ? 'hi' : 'en'))}
        onOpenDamageClaim={() => handleOpenDamageClaim()}
        activeClaimsCount={claims.length}
        currentUser={currentUser}
        onOpenAuth={(mode) => setAuthModalMode(mode || 'login')}
        onLogout={handleLogout}
        onOpenTutorial={() => setShowOnboardingTutorial(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {activeTab === 'home' && (
          <HomeView
            policies={policies}
            claims={claims}
            language={language}
            onNavigate={setActiveTab}
            onOpenDamageClaim={() => handleOpenDamageClaim()}
            onRenewPolicy={handleRenewPolicy}
          />
        )}

        {activeTab === 'policies' && (
          <PoliciesView
            policies={policies}
            language={language}
            onOpenDamageClaim={handleOpenDamageClaim}
          />
        )}

        {activeTab === 'claims' && (
          <ClaimsView
            claims={claims}
            language={language}
            onOpenDamageClaim={() => handleOpenDamageClaim()}
          />
        )}

        {activeTab === 'ai' && (
          <OmnisureAIView
            policies={policies}
            claims={claims}
            language={language}
            onLanguageChange={setLanguage}
            onOpenDamageClaim={() => handleOpenDamageClaim()}
          />
        )}

        {activeTab === 'tutorial' && (
          <HowItWorksView
            language={language}
            onNavigate={setActiveTab}
            onOpenDamageClaim={() => handleOpenDamageClaim()}
            onOpenTutorial={() => setShowOnboardingTutorial(true)}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            language={language}
            onLanguageChange={setLanguage}
            onOpenDamageClaim={() => handleOpenDamageClaim()}
            currentUser={currentUser}
            onLogout={handleLogout}
            onOpenAuth={(mode) => setAuthModalMode(mode || 'login')}
            onOpenTutorial={() => setShowOnboardingTutorial(true)}
          />
        )}
      </main>

      {/* Dedicated Authentication Modal (if triggered via Profile) */}
      {authModalMode && (
        <AuthView
          language={language}
          onLoginSuccess={handleLoginSuccess}
          onCancel={() => setAuthModalMode(null)}
          initialMode={authModalMode}
        />
      )}

      {/* 7-Step Onboarding Tutorial Modal Popup */}
      <OnboardingTutorialModal
        isOpen={showOnboardingTutorial}
        onClose={() => setShowOnboardingTutorial(false)}
        language={language}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setShowOnboardingTutorial(false);
        }}
      />

      {/* Multi-Insurance Claim Workflow Modal */}
      <MultiInsuranceClaimModal
        isOpen={isDamageClaimOpen}
        onClose={() => setIsDamageClaimOpen(false)}
        policies={policies}
        initialPolicyId={initialClaimPolicyId}
        language={language}
        onClaimSubmitted={handleClaimSubmitted}
      />

      {/* Toast Notification Alert */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-white border border-emerald-200 p-4 rounded-2xl shadow-xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-[#172033]">{notification.message}</h4>
            {notification.sub && <p className="text-[11px] text-[#667085] mt-0.5">{notification.sub}</p>}
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Global Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-[#667085] space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-4 text-[#667085]">
          <span className="cursor-pointer hover:text-[#172033] transition-colors" onClick={() => setActiveTab('home')}>Home</span>
          <span>•</span>
          <span className="cursor-pointer hover:text-[#172033] transition-colors" onClick={() => setActiveTab('policies')}>My Policies</span>
          <span>•</span>
          <span className="cursor-pointer hover:text-[#172033] transition-colors" onClick={() => setActiveTab('claims')}>Claims</span>
          <span>•</span>
          <span className="cursor-pointer hover:text-[#172033] transition-colors" onClick={() => setActiveTab('ai')}>Omnisure AI</span>
          <span>•</span>
          <span className="cursor-pointer hover:text-[#172033] transition-colors" onClick={() => setShowOnboardingTutorial(true)}>How It Works</span>
          <span>•</span>
          <span className="cursor-pointer hover:text-[#172033] transition-colors" onClick={() => setActiveTab('profile')}>Profile</span>
        </div>
        <p className="text-slate-400">
          © {new Date().getFullYear()} OMNISURE InsurTech Technologies. IRDAI Reg. Licensed Digital Insurance Intermediary.
        </p>
      </footer>

    </div>
  );
}

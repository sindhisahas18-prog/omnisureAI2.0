import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import {
  Car,
  HeartPulse,
  Home,
  Smartphone,
  Plane,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Layers,
  PieChart as PieChartIcon,
  CheckCircle2
} from 'lucide-react';
import { InsurancePolicy, Language, NavigationTab } from '../types';

interface PolicyCoverageOverviewProps {
  policies: InsurancePolicy[];
  language: Language;
  onNavigate?: (tab: NavigationTab) => void;
}

export type CoverageCategoryKey = 'vehicle' | 'health' | 'property' | 'gadget' | 'travel_accident' | 'other';

interface CategoryConfig {
  key: CoverageCategoryKey;
  labelEn: string;
  labelHi: string;
  color: string;
  bgLight: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
  descriptionEn: string;
  descriptionHi: string;
}

const CATEGORY_CONFIGS: Record<CoverageCategoryKey, CategoryConfig> = {
  vehicle: {
    key: 'vehicle',
    labelEn: 'Vehicle & Mobility',
    labelHi: 'वाहन व मोबिलिटी',
    color: '#0284C7', // sky-600
    bgLight: 'bg-sky-50',
    borderColor: 'border-sky-200',
    icon: Car,
    descriptionEn: 'Cars, two-wheelers & zero-depreciation protection',
    descriptionHi: 'कार, दोपहिया वाहन व जीरो-डेप्रिसिएशन कवर'
  },
  health: {
    key: 'health',
    labelEn: 'Health & Medical',
    labelHi: 'स्वास्थ्य व चिकित्सा',
    color: '#10B981', // emerald-500
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    icon: HeartPulse,
    descriptionEn: 'Family floaters, cashless hospital network & checkups',
    descriptionHi: 'फैमिली फ्लोटर, कैशलेस हॉस्पिटल नेटवर्क व जांच'
  },
  property: {
    key: 'property',
    labelEn: 'Property & Home',
    labelHi: 'संपत्ति व गृह सुरक्षा',
    color: '#F59E0B', // amber-500
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: Home,
    descriptionEn: 'Home structure, valuable contents & appliance shield',
    descriptionHi: 'घर की संरचना, घरेलू सामग्री व उपकरण सुरक्षा'
  },
  gadget: {
    key: 'gadget',
    labelEn: 'Gadgets & Tech',
    labelHi: 'गैजेट्स व इलेक्ट्रॉनिक्स',
    color: '#8B5CF6', // violet-500
    bgLight: 'bg-violet-50',
    borderColor: 'border-violet-200',
    icon: Smartphone,
    descriptionEn: 'Smartphones, OLED displays & liquid ingress protection',
    descriptionHi: 'स्मार्टफोन, स्क्रीन रिप्लेसमेंट व लिक्विड डैमेज'
  },
  travel_accident: {
    key: 'travel_accident',
    labelEn: 'Travel & Personal Accident',
    labelHi: 'यात्रा व व्यक्तिगत दुर्घटना',
    color: '#EC4899', // pink-500
    bgLight: 'bg-pink-50',
    borderColor: 'border-pink-200',
    icon: Plane,
    descriptionEn: 'Worldwide emergency medical & 24x7 accident shield',
    descriptionHi: 'अंतर्राष्ट्रीय यात्रा सुरक्षा व 24x7 दुर्घटना शील्ड'
  },
  other: {
    key: 'other',
    labelEn: 'Life & Special Risks',
    labelHi: 'जीवन व अन्य जोखिम',
    color: '#6366F1', // indigo-500
    bgLight: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    icon: ShieldCheck,
    descriptionEn: 'Term life, critical liabilities & specialized covers',
    descriptionHi: 'टर्म लाइफ, व्यक्तिगत दायित्व व विशेष बीमा'
  }
};

const mapPolicyToCategory = (policy: InsurancePolicy): CoverageCategoryKey => {
  switch (policy.type) {
    case 'motor':
    case 'bike':
      return 'vehicle';
    case 'health':
      return 'health';
    case 'home':
      return 'property';
    case 'gadget':
      return 'gadget';
    case 'travel':
    case 'accident':
      return 'travel_accident';
    default:
      return 'other';
  }
};

const formatINR = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} Lakh`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const PolicyCoverageOverview: React.FC<PolicyCoverageOverviewProps> = ({
  policies,
  language,
  onNavigate
}) => {
  const [metricMode, setMetricMode] = useState<'sumInsured' | 'policyCount'>('sumInsured');
  const [hoveredCategoryKey, setHoveredCategoryKey] = useState<CoverageCategoryKey | null>(null);

  // Filter only active or valid policies
  const activePolicies = useMemo(() => {
    return policies.filter(p => p.status === 'active' || !p.status);
  }, [policies]);

  // Aggregate policies by category
  const categoryStats = useMemo(() => {
    const stats: Record<CoverageCategoryKey, {
      config: CategoryConfig;
      policies: InsurancePolicy[];
      totalSumInsured: number;
      policyCount: number;
    }> = {
      vehicle: { config: CATEGORY_CONFIGS.vehicle, policies: [], totalSumInsured: 0, policyCount: 0 },
      health: { config: CATEGORY_CONFIGS.health, policies: [], totalSumInsured: 0, policyCount: 0 },
      property: { config: CATEGORY_CONFIGS.property, policies: [], totalSumInsured: 0, policyCount: 0 },
      gadget: { config: CATEGORY_CONFIGS.gadget, policies: [], totalSumInsured: 0, policyCount: 0 },
      travel_accident: { config: CATEGORY_CONFIGS.travel_accident, policies: [], totalSumInsured: 0, policyCount: 0 },
      other: { config: CATEGORY_CONFIGS.other, policies: [], totalSumInsured: 0, policyCount: 0 }
    };

    activePolicies.forEach(policy => {
      const cat = mapPolicyToCategory(policy);
      const sum = policy.sumInsured ?? policy.insuredDeclaredValue ?? 0;
      stats[cat].policies.push(policy);
      stats[cat].totalSumInsured += sum;
      stats[cat].policyCount += 1;
    });

    return stats;
  }, [activePolicies]);

  // Total sum insured across all active policies
  const grandTotalSumInsured = useMemo(() => {
    return Object.values(categoryStats).reduce((acc, curr) => acc + curr.totalSumInsured, 0);
  }, [categoryStats]);

  const grandTotalPolicies = activePolicies.length;

  // Generate chart data array for non-empty categories
  const chartData = useMemo(() => {
    const items = Object.values(categoryStats)
      .filter(item => item.policyCount > 0)
      .map(item => {
        const value = metricMode === 'sumInsured' ? item.totalSumInsured : item.policyCount;
        const total = metricMode === 'sumInsured' ? grandTotalSumInsured : grandTotalPolicies;
        const percentage = total > 0 ? (value / total) * 100 : 0;

        return {
          key: item.config.key,
          name: language === 'hi' ? item.config.labelHi : item.config.labelEn,
          value,
          totalSumInsured: item.totalSumInsured,
          policyCount: item.policyCount,
          percentage,
          color: item.config.color,
          config: item.config,
          policies: item.policies
        };
      });

    // Sort descending by value
    return items.sort((a, b) => b.value - a.value);
  }, [categoryStats, metricMode, grandTotalSumInsured, grandTotalPolicies, language]);

  // Active highlighted category data
  const highlightedData = useMemo(() => {
    if (!hoveredCategoryKey) return null;
    return chartData.find(item => item.key === hoveredCategoryKey) || null;
  }, [hoveredCategoryKey, chartData]);

  // Risk diversification analysis
  const riskAnalysis = useMemo(() => {
    const activeCategoryCount = chartData.length;
    const topCategory = chartData[0];

    let diversityStatusEn = 'Optimal Diversification';
    let diversityStatusHi = 'संतुलित विविधता (उत्कृष्ट सुरक्षा)';
    let scoreColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';

    if (activeCategoryCount <= 1) {
      diversityStatusEn = 'High Concentration Risk';
      diversityStatusHi = 'उच्च एकाग्रता जोखिम (केवल 1 श्रेणी)';
      scoreColor = 'text-rose-700 bg-rose-50 border-rose-200';
    } else if (activeCategoryCount <= 3) {
      diversityStatusEn = 'Moderate Spread';
      diversityStatusHi = 'मध्यम जोखिम फैलाव';
      scoreColor = 'text-amber-700 bg-amber-50 border-amber-200';
    }

    return {
      activeCategoryCount,
      topCategory,
      diversityStatusEn,
      diversityStatusHi,
      scoreColor
    };
  }, [chartData]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      
      {/* ----------------------------------------------------
          1. HEADER & METRIC TOGGLE
         ---------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
            <PieChartIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-sky-600 tracking-wider">
                {language === 'hi' ? 'जोखिम विश्लेषण' : 'RISK & EXPOSURE DISTRIBUTION'}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${riskAnalysis.scoreColor}`}>
                {language === 'hi' ? riskAnalysis.diversityStatusHi : riskAnalysis.diversityStatusEn}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-[#172033] font-['Outfit']">
              {language === 'hi' ? 'पॉलिसी कवरेज अवलोकन' : 'Policy Coverage Overview'}
            </h2>
          </div>
        </div>

        {/* Value vs Count Mode Switcher */}
        <div className="flex items-center gap-2 bg-[#F8FAFC] border border-slate-200 p-1 rounded-2xl self-start sm:self-auto">
          <button
            type="button"
            id="overview-mode-sum-btn"
            onClick={() => setMetricMode('sumInsured')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              metricMode === 'sumInsured'
                ? 'bg-white text-sky-700 shadow-xs border border-slate-200 font-bold'
                : 'text-[#667085] hover:text-[#172033]'
            }`}
          >
            {language === 'hi' ? 'बीमित राशि (₹ IDV)' : 'Sum Insured (₹)'}
          </button>
          <button
            type="button"
            id="overview-mode-count-btn"
            onClick={() => setMetricMode('policyCount')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              metricMode === 'policyCount'
                ? 'bg-white text-sky-700 shadow-xs border border-slate-200 font-bold'
                : 'text-[#667085] hover:text-[#172033]'
            }`}
          >
            {language === 'hi' ? 'पॉलिसी संख्या' : 'Policy Count'}
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------
          2. CORE CONTENT: DONUT CHART + METRICS & INSIGHTS
         ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left / Donut Chart Column */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200">
          <div className="w-full h-[260px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#172033] text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
                          <span>{data.name}</span>
                        </div>
                        <div className="text-slate-300">
                          {language === 'hi' ? 'सुरक्षित मूल्य:' : 'Covered Value:'}{' '}
                          <span className="font-bold text-white">{formatINR(data.totalSumInsured)}</span>
                        </div>
                        <div className="text-slate-300">
                          {language === 'hi' ? 'सक्रिय पॉलिसियाँ:' : 'Active Policies:'}{' '}
                          <span className="font-bold text-white">{data.policyCount}</span>
                        </div>
                        <div className="text-sky-400 font-mono font-semibold pt-1 border-t border-slate-700">
                          {data.percentage.toFixed(1)}% {language === 'hi' ? 'पोर्टफोलियो हिस्सा' : 'of portfolio'}
                        </div>
                      </div>
                    );
                  }}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={105}
                  paddingAngle={4}
                  onMouseEnter={(_, index) => {
                    const item = chartData[index];
                    if (item) setHoveredCategoryKey(item.key);
                  }}
                  onMouseLeave={() => setHoveredCategoryKey(null)}
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={`cell-${entry.key}`}
                      fill={entry.color}
                      opacity={hoveredCategoryKey && hoveredCategoryKey !== entry.key ? 0.45 : 1}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                      className="cursor-pointer transition-opacity duration-200"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
              {highlightedData ? (
                <>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085]">
                    {highlightedData.name}
                  </span>
                  <span className="text-base sm:text-lg font-extrabold text-[#172033] font-['Outfit'] mt-0.5">
                    {metricMode === 'sumInsured'
                      ? formatINR(highlightedData.totalSumInsured)
                      : `${highlightedData.policyCount} ${language === 'hi' ? 'पॉलिसी' : 'Policies'}`}
                  </span>
                  <span className="text-[11px] font-bold text-sky-600 font-mono mt-0.5">
                    {highlightedData.percentage.toFixed(1)}%
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#667085]">
                    {language === 'hi' ? 'कुल सुरक्षा कवच' : 'TOTAL PROTECTED'}
                  </span>
                  <span className="text-base sm:text-lg font-extrabold text-[#172033] font-['Outfit'] mt-0.5">
                    {formatINR(grandTotalSumInsured)}
                  </span>
                  <span className="text-[11px] font-semibold text-[#667085] mt-0.5">
                    {grandTotalPolicies} {language === 'hi' ? 'सक्रिय पॉलिसियाँ' : 'Active Policies'}
                  </span>
                </>
              )}
            </div>
          </div>

          <p className="text-[11px] text-[#667085] text-center mt-1">
            {language === 'hi'
              ? 'विस्तार देखने के लिए किसी भी सेगमेंट पर होवर करें'
              : 'Hover over or tap any segment to view category exposure'}
          </p>
        </div>

        {/* Right / Breakdown Categories Grid */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#667085] font-semibold px-1">
            <span>{language === 'hi' ? 'बीमा श्रेणियाँ' : 'Insurance Categories'}</span>
            <span>{metricMode === 'sumInsured' ? (language === 'hi' ? 'बीमित मूल्य व हिस्सा' : 'Covered Value & Share') : (language === 'hi' ? 'पॉलिसी संख्या' : 'Policy Count')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {chartData.map((item) => {
              const Icon = item.config.icon;
              const isHovered = hoveredCategoryKey === item.key;

              return (
                <div
                  key={item.key}
                  onMouseEnter={() => setHoveredCategoryKey(item.key)}
                  onMouseLeave={() => setHoveredCategoryKey(null)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isHovered
                      ? 'bg-sky-50/70 border-sky-300 shadow-xs scale-[1.01]'
                      : 'bg-[#F8FAFC] border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${item.color}18`, color: item.color }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#172033]">{item.name}</h4>
                        <span className="text-[10px] text-[#667085] block">
                          {item.policyCount} {language === 'hi' ? 'पॉलिसी' : item.policyCount === 1 ? 'Policy' : 'Policies'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-extrabold text-[#172033] block font-['Outfit']">
                        {formatINR(item.totalSumInsured)}
                      </span>
                      <span className="text-[10px] font-bold font-mono" style={{ color: item.color }}>
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Progress bar visual for ratio */}
                  <div className="w-full bg-slate-200/80 rounded-full h-1.5 mt-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Risk Takeaway Footer */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-sky-50/50 border border-sky-100 p-3 rounded-2xl">
            <div className="flex items-center gap-2 text-sky-800">
              <TrendingUp className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                {language === 'hi'
                  ? `शीर्ष जोखिम आवंटन: ${chartData[0]?.name || 'संपत्ति'} (${chartData[0]?.percentage.toFixed(0)}%) • कोई महत्वपूर्ण कवरेज अंतराल नहीं है।`
                  : `Primary Risk Allocation: ${chartData[0]?.name || 'Property'} (${chartData[0]?.percentage.toFixed(0)}%) • Comprehensive multi-asset protection.`}
              </span>
            </div>

            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('policies')}
                className="inline-flex items-center gap-1 font-bold text-sky-700 hover:text-sky-800 shrink-0 cursor-pointer"
              >
                <span>{language === 'hi' ? 'सभी पॉलिसियाँ' : 'Explore All'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

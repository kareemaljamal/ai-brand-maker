export type BusinessModel = 'physical' | 'online' | 'hybrid';
export type PersonalityType = 'عصري' | 'بسيط' | 'فاخر' | 'مرح' | 'تراثي' | 'شبابي' | 'عائلي';
export type PricingPosition = 'budget' | 'mid' | 'premium' | 'luxury';

export interface BrandBrief {
  id: string;
  idea: string;
  category: string;
  businessModel: BusinessModel;
  city: string;
  district?: string;
  targetAudience: string;
  pricingPosition: PricingPosition;
  personality: PersonalityType | string;
  budgetEgp?: number;
  budget?: number;
  knownVariableCostsEgp?: number;
  knownMonthlyFixedCostsEgp?: number;
  assumptions: string[];
  provenance: Record<string, 'user' | 'proposal'>;
  briefRevision: number;
}

export interface BrandNameCandidate {
  id: string;
  nameAr: string;
  nameEn: string;
  pronunciation?: string;
  meaning: string;
  rationale: string;
  emotionalAssociations: string[];
  style: string;
  tradeoff: string;
  recommended?: boolean;
  favorite?: boolean;
  locked?: boolean;
  story?: string;
  positioning?: string;
  valueProposition?: string;
  toneTraits?: string[];
  greetingExample?: string;
  promoExample?: string;
  matchingSlogan?: string;
}

export interface BrandSloganCandidate {
  id: string;
  text: string;
  meaning: string;
  rationale: string;
  useCase: string;
  tone?: string;
  favorite?: boolean;
  locked?: boolean;
}

export interface BrandStrategy {
  story: string;
  purpose: string;
  mission: string;
  vision: string;
  values: string[];
  positioning: string;
  valueProposition: string;
  differentiators: string[];
  audienceNeeds: string[];
  coreMessages: string[];
}

export interface BrandVoice {
  traits: string[];
  doSay: string[];
  doNotSay: string[];
  greetingExample: string;
  promoExample: string;
  replyExample: string;
}

export type ColorRole = 'primary' | 'secondary' | 'accent' | 'background' | 'text';

export interface BrandColor {
  role: ColorRole;
  nameAr: string;
  hex: string;
  usageNote: string;
  locked?: boolean;
}

export interface BrandIdentity {
  names: BrandNameCandidate[];
  selectedNameId: string;
  slogans: BrandSloganCandidate[];
  selectedSloganId: string;
  strategy: BrandStrategy;
  voice: BrandVoice;
  palette: BrandColor[];
  isLocked?: boolean;
}

export type PricingFormat = 'services' | 'menu' | 'products' | 'packages';

export interface PricingItem {
  id: string;
  name: string;
  category: string;
  priceEgp: number;
  costEgp?: number;
  unit: string;
  description?: string;
  inclusions?: string[];
  popular?: boolean;
}

export interface PricingTier {
  id: string;
  title: string;
  targetAudience: string;
  inclusions: string[];
  priceEgp: number;
  billingUnit: string;
  rationale: string;
  variableCostEgp?: number;
}

export interface StartupEquipmentItem {
  id: string;
  name: string;
  category: 'معدات وآلات' | 'تجهيزات وتشطيب' | 'تراخيص وتأسيس' | 'سيولة تشغيل ومخزون' | string;
  estimatedCostEgp: number;
  priority: 'ضروري للبدء' | 'مرحلة ثانية' | 'اختياري للتوسع';
  notes?: string;
}

export interface CapitalFeasibility {
  userBudgetEgp: number;
  minEstimatedBudgetEgp: number;
  recommendedBudgetEgp: number;
  status: 'sufficient' | 'lean_viable' | 'insufficient';
  verdictTitle: string;
  verdictDescription: string;
  recommendedModel: string;
  startupBreakdown: StartupEquipmentItem[];
  capexTotalEgp: number;
  gapOrSurplusEgp: number;
  advice: string[];
  alternativeBreakdown?: StartupEquipmentItem[];
  alternativeCapexTotalEgp?: number;
  alternativeModelTitle?: string;
  projections?: FinancialProjections;
  unitEconomics?: UnitEconomicsBenchmark;
}

export interface FinancialProjections {
  initialPhaseMonths: string;
  initialMonthlyRevenueEgp: number;
  initialMonthlyCostsEgp: number;
  initialMonthlyProfitEgp: number;
  breakEvenMonth: number;
  yearOneRevenueEgp: number;
  yearOneNetProfitEgp: number;
  yearOneMarginPct: number;
  yearOneRecoveryPct: number;
  fiveYearCumulativeProfitEgp: number;
  paybackPeriodMonths: number;
  estimatedRoiPct: number;
  fiveYearAnnualizedReturn: string;
}

export interface UnitEconomicsBenchmark {
  pricingNature: 'complex_services' | 'standard_products';
  noticeTitle: string;
  noticeDescription: string;
  averageTicketEgp?: number;
  averageItemPriceEgp?: number;
  targetDailyOrders?: number;
  grossMarginPct?: number;
  keyDrivers: string[];
}

export interface BrandPricing {
  tiers: PricingTier[];
  items?: PricingItem[];
  format?: PricingFormat;
  assumptions: string[];
  statusNote: string;
  fixedCostsEgp?: number;
  capitalFeasibility?: CapitalFeasibility;
}

export interface MarketingDay {
  dayNumber: number;
  period: string; // e.g. "الأسبوع الأول: إطلاق وتوعية"
  objective: string;
  action: string;
  channel: string;
  deliverable: string;
  metric: string;
  explanation?: string;
  videoScript?: string;
  postCopy?: string;
  visualConcept?: string;
  cta?: string;
  hashtags?: string[];
}

export interface MarketingPost {
  id: string;
  platform: string; // "انستجرام" | "تيك توك" | "فيسبوك" | "لينكد إن"
  format: string; // "ريلز" | "كاروسيل" | "بوست تفاعلي" | "ستوري"
  hook: string;
  caption: string;
  visualDirection: string;
  videoScript?: string;
  cta: string;
  hashtags: string[];
  locked?: boolean;
}

export interface BrandMarketing {
  audienceOverview: string;
  acquisitionChannels: { channel: string; rationale: string }[];
  coreLaunchMessage: string;
  days: MarketingDay[];
  posts: MarketingPost[];
}

export interface GeneratedImageRecord {
  url: string;
  generatedAt: string;
  promptUsed: string;
}

export interface BrandVisuals {
  visualDirection: string;
  logoPrompt: string;
  avatarPrompt: string;
  logoImage?: GeneratedImageRecord;
  avatarImage?: GeneratedImageRecord;
  logoGallery: GeneratedImageRecord[];
  avatarGallery: GeneratedImageRecord[];
  chatGptPrompt?: string;
  engineUsed?: 'nano-banana' | 'vector-svg-master' | 'imported';
  selectedStyle?: string;
  isStale?: boolean;
  imageError?: string;
}

export interface SectionRevision<T> {
  id: string;
  timestamp: string;
  title: string;
  data: T;
}

export interface BrandProject {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  brief: BrandBrief;
  identity: BrandIdentity;
  pricing: BrandPricing;
  marketing: BrandMarketing;
  visuals: BrandVisuals;
  suggestions: {
    identity: string[];
    pricing: string[];
    marketing: string[];
  };
  staleSections: {
    identity?: boolean;
    pricing?: boolean;
    marketing?: boolean;
    visuals?: boolean;
  };
  revisions: {
    identity: SectionRevision<BrandIdentity>[];
    pricing: SectionRevision<BrandPricing>[];
    marketing: SectionRevision<BrandMarketing>[];
    visuals: SectionRevision<BrandVisuals>[];
  };
}

export type ScopedOperationType =
  | 'appendNames'
  | 'appendSlogans'
  | 'refineIdentityPart'
  | 'proposePalette'
  | 'refinePricing'
  | 'addPricingTier'
  | 'regenerateMarketing'
  | 'refineMarketingWeek'
  | 'appendPosts'
  | 'rewritePost'
  | 'refineVisualPrompt'
  | 'updateDependencies';

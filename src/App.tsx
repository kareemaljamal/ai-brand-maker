import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { HomeHero, BrandInputData } from './components/HomeHero';
import { InteractiveLoading } from './components/InteractiveLoading';
import { BusinessBriefCard } from './components/BusinessBriefCard';
import { ResultsHeader } from './components/ResultsHeader';
import { TabNav, TabKey } from './components/TabNav';
import { ControlStrip, QuickActionOption } from './components/ControlStrip';
import { NamesTab } from './components/NamesTab';
import { IdentityTab } from './components/IdentityTab';
import { PricingTab } from './components/PricingTab';
import { MarketingTab } from './components/MarketingTab';
import { VisualsTab } from './components/VisualsTab';
import { BrandPresentationView } from './components/BrandPresentationView';
import { HowItWorksModal } from './components/HowItWorksModal';
import { SavedBrandsModal } from './components/SavedBrandsModal';
import { RevisionDrawer } from './components/RevisionDrawer';
import { Toast, ToastMessage } from './components/Toast';
import {
  BrandProject,
  BrandBrief,
  BrandIdentity,
  BrandNameCandidate,
  BrandPricing,
  BrandMarketing,
  BrandVisuals,
  SectionRevision,
  MarketingPost,
} from './types/brand';
import {
  getSavedProjects,
  saveProjectToStorage,
  deleteProjectFromStorage,
  saveDraft,
  loadDraft,
  clearDraft,
  storeImageInDB,
} from './utils/storage';
import { SectionLoadingView } from './components/SectionLoadingView';
import { copyToClipboard, generateBrandFullText } from './utils/export';
import { createPendingProject } from './utils/pendingProject';
import { validateNames } from './utils/liveAi';

// Bulletproof client-side fetch helper with strict timeout to prevent infinite UI loading
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 20000,
  outerSignal?: AbortSignal
): Promise<Response> {
  const controller = new AbortController();
  let isTimedOut = false;
  const timer = setTimeout(() => {
    isTimedOut = true;
    controller.abort();
  }, timeoutMs);

  if (outerSignal) {
    if (outerSignal.aborted) {
      clearTimeout(timer);
      controller.abort();
    } else {
      outerSignal.addEventListener('abort', () => {
        clearTimeout(timer);
        controller.abort();
      });
    }
  }

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (err: any) {
    if (isTimedOut) {
      throw new Error('استغرق Gemini وقتاً أطول من المتوقع. حاول مرة أخرى.');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export default function App() {
  // Theme state: Default to dark theme everywhere unless explicitly set to light
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('bm_theme');
    if (saved === 'light') return 'light';
    return 'dark';
  });

  // Navigation state
  const [view, setView] = useState<'home' | 'results' | 'presentation'>('home');
  const [activeTab, setActiveTab] = useState<TabKey>('names');

  // Modals & Drawers
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isSavedBrandsOpen, setIsSavedBrandsOpen] = useState(false);
  const [revisionDrawer, setRevisionDrawer] = useState<{
    isOpen: boolean;
    title: string;
    beforeSummary: string;
    afterSummary: string;
    onAccept: () => void;
  } | null>(null);

  // Status & Connectivity
  const [apiConnected, setApiConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiEnhancing, setIsAiEnhancing] = useState(false);
  const [progressivePhase, setProgressivePhase] = useState<string>('');
  const [loadingIdea, setLoadingIdea] = useState('مطعم بيتزا إيطالي صحي');
  const [isScopedLoading, setIsScopedLoading] = useState(false);
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [copiedAllPlan, setCopiedAllPlan] = useState(false);
  const [sectionStatuses, setSectionStatuses] = useState<Record<TabKey, 'loading' | 'ready' | 'error'>>({
    names: 'ready',
    identity: 'ready',
    pricing: 'ready',
    marketing: 'ready',
    visuals: 'ready',
  });

  // Projects & Data
  const [currentProject, setCurrentProject] = useState<BrandProject | null>(null);
  const [savedBrands, setSavedBrands] = useState<BrandProject[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [copiedSection, setCopiedSection] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const userCancelledRef = useRef<boolean>(false);
  const lastInputDataRef = useRef<BrandInputData | null>(null);
  const [isAiRestarting, setIsAiRestarting] = useState(false);
  const visualsGeneratedOnce = useRef<Record<string, boolean>>({});
  const featuresRef = useRef<HTMLDivElement | null>(null);
  const inputCardRef = useRef<HTMLDivElement | null>(null);

  // Sync theme to HTML root element
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('bm_theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('bm_theme', 'dark');
    }
  }, [theme]);

  // Initial load - clean state with no cached projects on reload as requested by user
  useEffect(() => {
    try {
      clearDraft();
      localStorage.removeItem('bm_draft_project_v1');
      localStorage.removeItem('bm_saved_projects_v1');
    } catch {
      // ignore
    }
    setSavedBrands([]);
    setCurrentProject(null);
    setView('home');

    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        if (!data.hasGeminiKey) setApiConnected(false);
      })
      .catch((err) => console.warn('API status error:', err));
  }, []);

  // Save active project in memory / session during active workflow
  useEffect(() => {
    if (currentProject) {
      saveDraft(currentProject);
    }
  }, [currentProject]);

  // Toast Notification Helper
  const notify = (
    text: string,
    type: 'success' | 'error' | 'info' = 'info',
    actionLabel?: string,
    onAction?: () => void
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, text, type, actionLabel, onAction }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const pushRevision = <T,>(
    revisions: SectionRevision<T>[],
    title: string,
    data: T
  ): SectionRevision<T>[] => {
    const newRev: SectionRevision<T> = {
      id: `rev-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title,
      data: JSON.parse(JSON.stringify(data)),
    };
    const updated = [newRev, ...revisions];
    return updated.slice(0, 10);
  };

  // 1. Initial Generation Flow (Real AI Generation + Live Interactive Loading + Self-Healing Auto-Restart)
  const handleGenerate = async (inputData: BrandInputData) => {
    if (isLoading) return;
    userCancelledRef.current = false;
    lastInputDataRef.current = inputData;
    setLoadingIdea(inputData.idea);
    setIsLoading(true);
    setIsAiEnhancing(true);

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const fetchWithAutoRestart = async (url: string, body: any, _stepTitle: string, _retries = 0): Promise<any> => {
      const res = await fetchWithTimeout(url, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body), cache: 'no-store',
      }, 190000, signal);
      const data = await res.json().catch(() => { throw new Error('تعذر الوصول إلى خدمة التوليد. تحقق من تشغيل سيرفر التطبيق.'); });
      if (!res.ok) throw new Error(data.error || 'تعذر الاتصال بالذكاء الاصطناعي.');
      if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
      return data;
    };

    try {
      setProgressivePhase('جاري الاتصال بمحرك الذكاء الاصطناعي وابتكار 6 أسماء مخصصة لمشروعك... ⚡');

      const namesData = await fetchWithAutoRestart('/api/brand/generate-names', inputData, 'ابتكار الأسماء');
      validateNames(namesData);
      const initialProject = createPendingProject(inputData, namesData);
      const chosenBrandName = initialProject.title;
      setApiConnected(true);

      // INSTANT REVEAL: Dismiss full-screen loader immediately and take user to results view!
      setCurrentProject(initialProject);
      saveDraft(initialProject);
      saveProjectToStorage(initialProject);
      setIsLoading(false);
      setView('results');
      setActiveTab('names');
      setSectionStatuses({
        names: 'ready',
        identity: 'loading',
        pricing: 'loading',
        marketing: 'loading',
        visuals: 'loading',
      });
      setProgressivePhase('⚡ جاري استكمال خطة التسعير والتسويق بالذكاء الاصطناعي في الخلفية...');
      notify('✨ تم ابتكار الأسماء فوراً! يمكنك استعراضها الآن.', 'success');

      // Concurrently enrich remaining tabs in background
      Promise.allSettled([
        // Step 2: AI Identity Details
        fetchWithAutoRestart(
          '/api/brand/generate-identity-details',
          {
            idea: inputData.idea,
            brandName: chosenBrandName,
            category: inputData.category,
            personality: inputData.personality,
            city: inputData.city,
            district: inputData.district,
            targetAudience: inputData.targetAudience,
          },
          'صياغة الهوية',
          1
        ).then((idDetails) => {
          if (idDetails) {
            setCurrentProject((prev) => {
              if (!prev || signal.aborted || prev.id !== initialProject.id) return prev;
              const updated = {
                ...prev,
                identity: {
                  ...prev.identity,
                  strategy: idDetails.strategy || prev.identity.strategy,
                  voice: idDetails.voice || prev.identity.voice,
                  palette: idDetails.palette || prev.identity.palette,
                  slogans: idDetails.slogans,
                  selectedSloganId: idDetails.slogans[0]?.id || '',
                },
                suggestions: { ...prev.suggestions, ...idDetails.suggestions },
              };
              saveDraft(updated);
              return updated;
            });
          }
          if (!signal.aborted) setSectionStatuses((prev) => ({ ...prev, identity: 'ready' }));
        }).catch((error) => {
          if (!signal.aborted) {
            setSectionStatuses((prev) => ({ ...prev, identity: 'error' }));
            notify(error.message, 'error');
          }
          throw error;
        }),

        // Step 3: AI Pricing Structure
        fetchWithAutoRestart(
          '/api/brand/generate-pricing',
          {
            idea: inputData.idea,
            category: inputData.category,
            city: inputData.city,
            district: inputData.district,
            budget: inputData.budget,
            knownVariableCosts: inputData.knownVariableCosts,
            knownMonthlyFixedCosts: inputData.knownMonthlyFixedCosts,
            brandName: chosenBrandName,
          },
          'هندسة التسعير',
          1
        ).then((pricingData) => {
          if (pricingData?.pricing) {
            setCurrentProject((prev) => {
              if (!prev || signal.aborted || prev.id !== initialProject.id) return prev;
              const updated = {
                ...prev,
                pricing: pricingData.pricing,
              };
              saveDraft(updated);
              return updated;
            });
          }
          if (!signal.aborted) setSectionStatuses((prev) => ({ ...prev, pricing: 'ready' }));
        }).catch((error) => {
          if (!signal.aborted) {
            setSectionStatuses((prev) => ({ ...prev, pricing: 'error' }));
            notify(error.message, 'error');
          }
          throw error;
        }),

        // Step 4: AI Marketing 30 Days Plan
        fetchWithAutoRestart(
          '/api/brand/generate-marketing',
          {
            idea: inputData.idea,
            brandName: chosenBrandName,
            city: inputData.city,
            district: inputData.district,
            targetAudience: inputData.targetAudience,
          },
          'خطة التسويق',
          1
        ).then((marketingData) => {
          if (marketingData?.marketing) {
            setCurrentProject((prev) => {
              if (!prev || signal.aborted || prev.id !== initialProject.id) return prev;
              const updated = {
                ...prev,
                marketing: marketingData.marketing,
              };
              saveDraft(updated);
              return updated;
            });
          }
          if (!signal.aborted) setSectionStatuses((prev) => ({ ...prev, marketing: 'ready' }));
        }).catch((error) => {
          if (!signal.aborted) {
            setSectionStatuses((prev) => ({ ...prev, marketing: 'error' }));
            notify(error.message, 'error');
          }
          throw error;
        }),

        // Step 5: Visuals Directives
        fetchWithAutoRestart(
          '/api/brand/generate-visuals',
          {
            idea: inputData.idea,
            brandName: chosenBrandName,
            district: inputData.district,
          },
          'الأصول البصرية',
          1
        ).then((visualsData) => {
          if (visualsData?.visuals) {
            setCurrentProject((prev) => {
              if (!prev || signal.aborted || prev.id !== initialProject.id) return prev;
              const updated = {
                ...prev,
                visuals: {
                  ...prev.visuals,
                  ...visualsData.visuals,
                },
              };
              saveDraft(updated);
              return updated;
            });
          }
          if (!signal.aborted) setSectionStatuses((prev) => ({ ...prev, visuals: 'ready' }));
        }).catch((error) => {
          if (!signal.aborted) {
            setSectionStatuses((prev) => ({ ...prev, visuals: 'error' }));
            notify(error.message, 'error');
          }
          throw error;
        }),
      ]).then((results) => {
        if (signal.aborted) return;
        setIsAiEnhancing(false);
        setProgressivePhase(results.every(result => result.status === 'fulfilled')
          ? 'اكتملت تفاصيل البراند من الذكاء الاصطناعي'
          : 'بعض الأقسام لم تكتمل. يمكنك إعادة المحاولة.');
      });
    } catch (err: any) {
      if (userCancelledRef.current) {
        notify('تم إلغاء عملية التوليد بناء على طلبك.', 'info');
      } else {
        console.error('[AI Resilient Flow]', err);
        setApiConnected(false);
        notify(err.message || 'تعذر توليد الأسماء من الذكاء الاصطناعي. حاول مرة أخرى.', 'error');
      }
      setIsLoading(false);
      setIsAiEnhancing(false);
    }
  };

  // Helper for selecting a brand name across Names Tab and Identity Tab
  const handleSelectName = (id: string) => {
    if (!currentProject) return;
    const chosenName = currentProject.identity.names.find((n) => n.id === id);
    if (!chosenName) return;

    const updatedStory =
      chosenName.story ||
      `بدأت قصة "${chosenName.nameAr}" من رغبة حقيقية في تقديم نموذج فريد يجمع بين النقاء والجودة الفائقة والقيمة الاستثنائية لعملائنا في السوق المصري بروح مبتكرة تلهم الجميع.`;

    const updatedPositioning =
      chosenName.positioning || currentProject.identity.strategy.positioning;
    const updatedValueProp =
      chosenName.valueProposition || currentProject.identity.strategy.valueProposition;
    const updatedTraits =
      chosenName.toneTraits && chosenName.toneTraits.length > 0
        ? chosenName.toneTraits
        : currentProject.identity.voice.traits;

    const updatedGreeting =
      chosenName.greetingExample ||
      `أهلاً بك في ${chosenName.nameAr}! يسعدنا تواصلك ونتشرف دائماً بتقديم أرقى تجربة تليق بذوقك.`;

    const updatedPromo =
      chosenName.promoExample || currentProject.identity.voice.promoExample;

    let matchingSloganId = currentProject.identity.selectedSloganId;
    if (chosenName.matchingSlogan) {
      const foundSlog = currentProject.identity.slogans.find(
        (s) => s.text.trim() === chosenName.matchingSlogan?.trim()
      );
      if (foundSlog) {
        matchingSloganId = foundSlog.id;
      }
    }

    const updated: BrandProject = {
      ...currentProject,
      title: chosenName.nameAr,
      identity: {
        ...currentProject.identity,
        selectedNameId: id,
        selectedSloganId: matchingSloganId,
        strategy: {
          ...currentProject.identity.strategy,
          story: updatedStory,
          positioning: updatedPositioning,
          valueProposition: updatedValueProp,
        },
        voice: {
          ...currentProject.identity.voice,
          traits: updatedTraits,
          greetingExample: updatedGreeting,
          promoExample: updatedPromo,
        },
      },
      updatedAt: new Date().toISOString(),
    };

    setCurrentProject(updated);
    saveProjectToStorage(updated);
    notify(
      `تم اعتماد "${chosenName.nameAr}" وتحديث هوية البراند ونبرة الصوت تلقائياً!`,
      'success'
    );
  };

  const handleSelectSlogan = (id: string) => {
    if (!currentProject) return;
    const updated: BrandProject = {
      ...currentProject,
      identity: { ...currentProject.identity, selectedSloganId: id },
      updatedAt: new Date().toISOString(),
    };
    setCurrentProject(updated);
    saveProjectToStorage(updated);
    notify('تم اعتماد الشعار اللفظي المختار.', 'success');
  };

  const handleRegenerateNames = async () => {
    if (!currentProject || isAiEnhancing) return;
    const project = currentProject;
    setIsAiEnhancing(true);
    try {
      const res = await fetchWithTimeout('/api/brand/generate-names', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store',
        body: JSON.stringify({ ...project.brief, budget: project.brief.budgetEgp,
          avoidNames: project.identity.names.map(name => name.nameAr) }),
      }, 190000);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'تعذر توليد أسماء جديدة.');
      validateNames(data, project.identity.names.map(name => name.nameAr));
      setCurrentProject(prev => {
        if (!prev || prev.id !== project.id) return prev;
        const updated = { ...prev, title: data.names[0].nameAr, updatedAt: new Date().toISOString(),
          identity: { ...prev.identity, names: data.names, slogans: data.slogans,
            selectedNameId: data.names[0].id, selectedSloganId: data.slogans[0].id } };
        saveProjectToStorage(updated);
        return updated;
      });
      notify('تم توليد 6 أسماء جديدة من Gemini.', 'success');
    } catch (error: any) {
      notify(error.message || 'تعذر توليد أسماء جديدة. الأسماء السابقة ما زالت محفوظة.', 'error');
    } finally {
      setIsAiEnhancing(false);
    }
  };

  // Instant Restart of AI Engine (Clears circuit breakers, reconnects, and generates fresh options)
  const handleRestartAi = async () => {
    try {
      setIsAiRestarting(true);
      setIsAiEnhancing(true);
      notify('جاري إعادة تشغيل محرك الذكاء الاصطناعي وتصفير مؤقتات الاستجابة... ⚡', 'info');
      await fetch('/api/brand/restart-ai', { method: 'POST' }).catch(() => {});
      if (isLoading && lastInputDataRef.current) {
        await handleGenerate(lastInputDataRef.current);
      } else if (currentProject) {
        await handleRegenerateNames();
      }
    } catch (e: any) {
      notify('تمت إعادة تهيئة محرك الذكاء الاصطناعي.', 'info');
    } finally {
      setIsAiRestarting(false);
      setIsAiEnhancing(false);
    }
  };



  // 2. Scoped Operations Dispatcher
  const executeScopedOp = async (
    operation: string,
    payload: any,
    instruction: string,
    successMsg: string
  ) => {
    if (!currentProject) return null;
    setIsScopedLoading(true);

    try {
      const response = await fetch('/api/brand/scoped-op', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation,
          brandBrief: currentProject.brief,
          currentData: payload,
          instruction,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'فشل التعديل المطلوب.');
      }

      const resData = await response.json();
      return resData.result;
    } catch (err: any) {
      console.error(`Scoped op ${operation} error:`, err);
      notify(err.message || 'تعذر إتمام التعديل المطلوب.', 'error');
      return null;
    } finally {
      setIsScopedLoading(false);
    }
  };

  // Additive: Add 5 names
  const handleAppendNames = async (customInstruction?: string) => {
    if (!currentProject) return;
    const existing = currentProject.identity.names.map((n) => n.nameAr);
    const result = await executeScopedOp(
      'appendNames',
      { existingNames: existing },
      customInstruction || 'اقترح أسماء مميزة وجذابة لمشروعنا',
      'تمت إضافة 5 أسماء جديدة'
    );

    if (result && Array.isArray(result.names) && result.names.length > 0) {
      const prevNames = [...currentProject.identity.names];
      const freshNames = result.names.filter(
        (newN: any) => !prevNames.some((p) => p.nameAr.trim() === newN.nameAr.trim())
      );

      const updatedNames = [...prevNames, ...freshNames];
      const updatedIdentity = {
        ...currentProject.identity,
        names: updatedNames,
      };

      setCurrentProject({
        ...currentProject,
        identity: updatedIdentity,
        revisions: {
          ...currentProject.revisions,
          identity: pushRevision(
            currentProject.revisions.identity,
            'إضافة 5 أسماء إضافية',
            currentProject.identity
          ),
        },
      });

      notify(`تمت إضافة ${freshNames.length} أسماء جديدة بنجاح!`, 'success');
    }
  };

  // Additive: Add 4 slogans
  const handleAppendSlogans = async (customInstruction?: string) => {
    if (!currentProject) return;
    const existing = currentProject.identity.slogans.map((s) => s.text);
    const result = await executeScopedOp(
      'appendSlogans',
      { existingSlogans: existing },
      customInstruction || 'شعارات رنانة وجذابة',
      'تمت إضافة 4 شعارات جديدة'
    );

    if (result && Array.isArray(result.slogans) && result.slogans.length > 0) {
      const prevSlogans = [...currentProject.identity.slogans];
      const updatedSlogans = [...prevSlogans, ...result.slogans];

      setCurrentProject({
        ...currentProject,
        identity: { ...currentProject.identity, slogans: updatedSlogans },
        revisions: {
          ...currentProject.revisions,
          identity: pushRevision(
            currentProject.revisions.identity,
            'إضافة 4 شعارات إضافية',
            currentProject.identity
          ),
        },
      });

      notify('تمت إضافة 4 شعارات جديدة بنجاح!', 'success');
    }
  };

  // Additive: Add 3 posts
  const handleAppendPosts = async (customInstruction?: string) => {
    if (!currentProject) return;
    const result = await executeScopedOp(
      'appendPosts',
      {},
      customInstruction || 'أفكار منشورات تفاعلية وريلز جديدة',
      'تمت إضافة 3 منشورات'
    );

    if (result && Array.isArray(result.posts) && result.posts.length > 0) {
      const prevPosts = [...currentProject.marketing.posts];
      const updatedPosts = [...prevPosts, ...result.posts];

      setCurrentProject({
        ...currentProject,
        marketing: { ...currentProject.marketing, posts: updatedPosts },
        revisions: {
          ...currentProject.revisions,
          marketing: pushRevision(
            currentProject.revisions.marketing,
            'إضافة 3 منشورات جديدة',
            currentProject.marketing
          ),
        },
      });

      notify('تمت إضافة 3 منشورات جديدة بنجاح!', 'success');
    }
  };

  // 3. Real Google Gemini Image Generation with multi-tier engine & style options
  const handleGenerateImage = async (
    type: 'logo' | 'avatar',
    prompt: string,
    style: string = '3d-luxury'
  ) => {
    if (!currentProject) return;
    if (type === 'logo') setIsGeneratingLogo(true);
    else setIsGeneratingAvatar(true);

    try {
      const refBase64 =
        type === 'avatar' && currentProject.visuals.logoImage?.url
          ? currentProject.visuals.logoImage.url
          : undefined;

      const selectedNameObj = currentProject.identity.names.find(
        (n) => n.id === currentProject.identity.selectedNameId
      );
      const brandName = selectedNameObj?.nameAr || currentProject.title;
      const primaryCol = currentProject.identity.palette.find((c) => c.role === 'primary')?.hex;
      const secondaryCol = currentProject.identity.palette.find((c) => c.role === 'secondary')?.hex;

      const res = await fetch('/api/brand/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          prompt,
          referenceImageBase64: refBase64,
          brandName,
          primaryColor: primaryCol,
          secondaryColor: secondaryCol,
          style,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'تعذر توليد الصورة.');
      }

      // Success! Store image
      const imgRecord = {
        url: data.imageUrl,
        generatedAt: data.generatedAt || new Date().toISOString(),
        promptUsed: prompt,
      };
      await storeImageInDB(`${currentProject.id}-${type}-${Date.now()}`, data.imageUrl);

      // Update project visuals & gallery
      setCurrentProject((curr) => {
        if (!curr) return null;
        const galleryKey = type === 'logo' ? 'logoGallery' : 'avatarGallery';
        const imgKey = type === 'logo' ? 'logoImage' : 'avatarImage';

        const updatedGallery = [imgRecord, ...(curr.visuals[galleryKey] || [])].slice(0, 8);

        return {
          ...curr,
          visuals: {
            ...curr.visuals,
            [imgKey]: imgRecord,
            [galleryKey]: updatedGallery,
            chatGptPrompt: data.chatGptPrompt || curr.visuals.chatGptPrompt,
            engineUsed: data.engineUsed || 'vector-svg-master',
            selectedStyle: style,
            imageError: undefined,
            isStale: false,
          },
        };
      });

      const engineName =
        data.engineUsed === 'nano-banana'
          ? 'محرك Nano Banana فائق الدقة'
          : 'استوديو الفيكتور الهندسي عالي الدقة';

      notify(
        `تم توليد ${type === 'logo' ? 'الشعار' : 'صورة البروفايل'} بنجاح بواسطة ${engineName}!`,
        'success'
      );
    } catch (err: any) {
      console.error('Image generation error:', err);
      notify('حدث خطأ أثناء طلب توليد الصورة.', 'error');
    } finally {
      if (type === 'logo') setIsGeneratingLogo(false);
      else setIsGeneratingAvatar(false);
    }
  };

  // Switch tabs cleanly without waiting or auto-generating images
  const handleSelectTab = (tab: TabKey) => {
    setActiveTab(tab);
  };

  // Copy entire plan
  const handleCopyAllPlan = async () => {
    if (!currentProject) return;
    const text = generateBrandFullText(currentProject);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedAllPlan(true);
      notify('تم النسخ بنجاح', 'success');
      setTimeout(() => setCopiedAllPlan(false), 2500);
    }
  };

  // New Project
  const handleNewProject = () => {
    abortControllerRef.current?.abort();
    setIsAiEnhancing(false);
    clearDraft();
    setCurrentProject(null);
    setView('home');
    notify('جاهز لبناء فكرة مشروع جديدة!', 'info');
  };

  // Clear all saved brands
  const handleClearAllSavedBrands = () => {
    localStorage.removeItem('bm_saved_projects_v1');
    setSavedBrands([]);
    notify('تم مسح جميع المشاريع السابقة.', 'info');
  };

  const selectedBrandName =
    currentProject?.identity.names.find((n) => n.id === currentProject.identity.selectedNameId)?.nameAr ||
    currentProject?.identity.names[0]?.nameAr ||
    'براندك';

  const selectedSloganText =
    currentProject?.identity.slogans.find((s) => s.id === currentProject.identity.selectedSloganId)?.text ||
    currentProject?.identity.slogans[0]?.text ||
    '';

  const primaryHex =
    currentProject?.identity.palette.find((c) => c.role === 'primary')?.hex || '#7C3AED';

  return (
    <div
      data-theme={theme}
      className={`min-h-screen ${
        theme === 'dark' ? 'dark bg-[#0B0F19] text-slate-100' : 'bg-[#F8F7FC] text-[#172033]'
      } antialiased flex flex-col`}
    >
      {/* Persistent App Header matching Page 1 & 2 */}
      <Header
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenSavedBrands={() => setIsSavedBrandsOpen(true)}
        onStartNow={() => {
          setView('home');
          inputCardRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
        onScrollToFeatures={() => {
          setView('home');
          featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
        }}
        savedBrandsCount={savedBrands.length}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* INTERACTIVE LOADING POPUP OVERLAY */}
        {isLoading && (
          <InteractiveLoading
            idea={loadingIdea}
            statusMessage={progressivePhase}
            isRestarting={isAiRestarting}
            onRestartAi={handleRestartAi}
            onCancel={() => {
              userCancelledRef.current = true;
              abortControllerRef.current?.abort();
              setIsLoading(false);
              setIsAiEnhancing(false);
              notify('تم إلغاء التوليد والعودة للرئيسية.', 'info');
            }}
          />
        )}

        {view === 'home' ? (
          <HomeHero
            onGenerate={handleGenerate}
            isLoading={isLoading}
            savedBrands={savedBrands}
            onSelectSavedBrand={(brand) => {
              setCurrentProject(brand);
              setView('results');
              notify(`تم فتح مشروع "${brand.title}" بنجاح.`, 'success');
            }}
            onClearAllSavedBrands={handleClearAllSavedBrands}
            featuresRef={featuresRef}
            inputCardRef={inputCardRef}
          />
        ) : view === 'results' && currentProject ? (
          <div className="space-y-6 animate-in fade-in max-w-full overflow-x-clip">
            {/* Top Bar with Project Name & Auto-save pill (Matching Page 4 & 5) */}
            <ResultsHeader
              brand={currentProject}
              onNewProject={handleNewProject}
              onOpenPresentation={() => setView('presentation')}
              onNotify={notify}
              onRestartAi={handleRestartAi}
              isRestarting={isAiRestarting}
            />

            {/* Background AI Progressive Loading Banner */}
            {progressivePhase && (
              <div className="flex items-center justify-between p-3.5 px-4 rounded-2xl bg-purple-50/90 dark:bg-indigo-950/40 border border-purple-200 dark:border-indigo-800/70 text-xs text-purple-900 dark:text-purple-200 shadow-sm animate-in fade-in" dir="rtl">
                <div className="flex items-center gap-2.5">
                  {isAiEnhancing ? (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#7C3AED]"></span>
                    </span>
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                  )}
                  <span className="font-bold">{progressivePhase}</span>
                  {isAiEnhancing && (
                    <span className="hidden sm:inline text-purple-700/80 dark:text-purple-300/80">
                      يمكنك الآن اختيار اسم البراند، استعراض الشعار، وتعديل المنيو بحرية تامة دون أي انتظار!
                    </span>
                  )}
                </div>
                <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold shrink-0 ${
                  isAiEnhancing ? 'bg-purple-200/80 dark:bg-indigo-900/80 text-[#5B21B6] dark:text-indigo-200' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                }`}>
                  {isAiEnhancing ? 'تحديث حي ⚡' : 'مكتمل ✓'}
                </span>
              </div>
            )}

            {/* Exactly 4 Primary Tabs + "نسخ الكل" (with live section readiness indicators) */}
            <TabNav
              activeTab={activeTab}
              onSelectTab={handleSelectTab}
              onCopyAll={handleCopyAllPlan}
              isCopiedAll={copiedAllPlan}
              sectionStatuses={sectionStatuses}
            />

            {/* If the active tab (other than names) is still generating, render interactive SectionLoadingView */}
            {activeTab !== 'names' && sectionStatuses[activeTab] === 'error' ? (
              <div role="alert" className="p-8 text-center space-y-4">
                <p>تعذر تحميل هذا القسم من الذكاء الاصطناعي. لم يتم استخدام بيانات جاهزة.</p>
                <button className="rounded-xl px-6 py-3 bg-violet-600 text-white" onClick={() => lastInputDataRef.current && handleGenerate(lastInputDataRef.current)}>إعادة توليد المشروع</button>
              </div>
            ) : activeTab !== 'names' && sectionStatuses[activeTab] === 'loading' ? (
              <SectionLoadingView
                sectionKey={activeTab}
                idea={currentProject.brief?.idea || loadingIdea}
                readySections={
                  (['names', 'identity', 'pricing', 'marketing', 'visuals'] as TabKey[]).filter(
                    (k) => sectionStatuses[k] === 'ready'
                  )
                }
                onNavigateToSection={(k) => handleSelectTab(k)}
              />
            ) : (
              <>
                {/* TAB 1: PROPOSED NAMES (الأسماء المقترحة) */}
                {activeTab === 'names' && (
                  <NamesTab
                    identity={currentProject.identity}
                    brief={currentProject.brief}
                    onSelectName={handleSelectName}
                    onSelectSlogan={handleSelectSlogan}
                    onUpdateIdentity={(newIdentity) =>
                      setCurrentProject({
                        ...currentProject,
                        identity: newIdentity,
                      })
                    }
                    onNotify={notify}
                    onNavigateToIdentity={() => handleSelectTab('identity')}
                    onRegenerateNames={handleRegenerateNames}
                    onRestartAi={handleRestartAi}
                    isScopedLoading={isAiEnhancing}
                    isReady={sectionStatuses.names === 'ready'}
                  />
                )}

                {/* TAB 2: BRAND IDENTITY & VOICE (هوية البراند والنبرة) */}
                {activeTab === 'identity' && (
                  sectionStatuses.identity === 'loading' ? (
                    <SectionLoadingView
                      sectionKey="identity"
                      idea={currentProject.brief?.idea || currentProject.title}
                      readySections={Object.entries(sectionStatuses)
                        .filter(([_, status]) => status === 'ready')
                        .map(([key]) => key as any)}
                      onNavigateToSection={handleSelectTab}
                    />
                  ) : (
                    <IdentityTab
                      identity={currentProject.identity}
                      brief={currentProject.brief}
                      pricing={currentProject.pricing}
                      onUpdateIdentity={(newIdentity) =>
                        setCurrentProject({
                          ...currentProject,
                          identity: newIdentity,
                        })
                      }
                      onSelectName={handleSelectName}
                      onSelectSlogan={handleSelectSlogan}
                      onNotify={notify}
                      onNavigateToVisuals={() => handleSelectTab('visuals')}
                      onNavigateToNames={() => handleSelectTab('names')}
                    />
                  )
                )}

            {/* TAB 2: PRICING */}
            {activeTab === 'pricing' && (
              sectionStatuses.pricing === 'loading' ? (
                <SectionLoadingView
                  sectionKey="pricing"
                  idea={currentProject.brief?.idea || currentProject.title}
                  readySections={Object.entries(sectionStatuses)
                    .filter(([_, status]) => status === 'ready')
                    .map(([key]) => key as any)}
                  onNavigateToSection={handleSelectTab}
                />
              ) : (
                <PricingTab
                  pricing={currentProject.pricing}
                  brief={currentProject.brief}
                  onUpdatePricing={(newPricing, desc) => {
                    const updated = {
                      ...currentProject,
                      pricing: newPricing,
                    };
                    setCurrentProject(updated);
                    saveDraft(updated);
                    saveProjectToStorage(updated);
                  }}
                  onUpdateBrief={(newBrief) => {
                    const updated = {
                      ...currentProject,
                      brief: newBrief,
                    };
                    setCurrentProject(updated);
                    saveDraft(updated);
                    saveProjectToStorage(updated);
                  }}
                  onNotify={notify}
                  onOpenArithmeticPreview={(preview) => {
                    setRevisionDrawer({
                      isOpen: true,
                      title: preview.title,
                      beforeSummary: preview.beforeSummary,
                      afterSummary: preview.afterSummary,
                      onAccept: preview.onApply,
                    });
                  }}
                />
              )
            )}

            {/* TAB 3: MARKETING */}
            {activeTab === 'marketing' && (
              sectionStatuses.marketing === 'loading' ? (
                <SectionLoadingView
                  sectionKey="marketing"
                  idea={currentProject.brief?.idea || currentProject.title}
                  readySections={Object.entries(sectionStatuses)
                    .filter(([_, status]) => status === 'ready')
                    .map(([key]) => key as any)}
                  onNavigateToSection={handleSelectTab}
                />
              ) : (
                <MarketingTab
                  marketing={currentProject.marketing}
                  onUpdateMarketing={(newMarketing, desc) => {
                    setCurrentProject({
                      ...currentProject,
                      marketing: newMarketing,
                    });
                  }}
                  onRewritePost={() => {}}
                  onRefineWeek={() => {}}
                  onNotify={notify}
                />
              )
            )}

            {/* TAB 4: VISUALS (Matching Page 5) */}
            {activeTab === 'visuals' && (
              sectionStatuses.visuals === 'loading' ? (
                <SectionLoadingView
                  sectionKey="visuals"
                  idea={currentProject.brief?.idea || currentProject.title}
                  readySections={Object.entries(sectionStatuses)
                    .filter(([_, status]) => status === 'ready')
                    .map(([key]) => key as any)}
                  onNavigateToSection={handleSelectTab}
                />
              ) : (
                <VisualsTab
                  visuals={currentProject.visuals}
                  brief={currentProject.brief}
                  selectedBrandName={selectedBrandName}
                  selectedSlogan={selectedSloganText}
                  primaryColor={primaryHex}
                  onGenerateImage={handleGenerateImage}
                  onUpdateVisuals={(newVisuals, desc) => {
                    setCurrentProject({
                      ...currentProject,
                      visuals: newVisuals,
                    });
                  }}
                  isGeneratingLogo={isGeneratingLogo}
                  isGeneratingAvatar={isGeneratingAvatar}
                  onNotify={notify}
                />
              )
            )}
              </>
            )}
          </div>
        ) : null}

        {/* Read-Only Presentation Mode */}
        {view === 'presentation' && currentProject && (
          <BrandPresentationView
            brand={currentProject}
            onBackToEdit={() => setView('results')}
            onNotify={notify}
          />
        )}
      </main>

      {/* Modals & Dialogs */}
      <HowItWorksModal isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} />

      <SavedBrandsModal
        isOpen={isSavedBrandsOpen}
        onClose={() => setIsSavedBrandsOpen(false)}
        savedBrands={savedBrands}
        onSelectBrand={(brand) => {
          setCurrentProject(brand);
          setView('results');
          notify(`تم فتح مشروع "${brand.title}" بنجاح.`, 'success');
        }}
        onDeleteBrand={(id) => {
          deleteProjectFromStorage(id);
          setSavedBrands(getSavedProjects());
          notify('تم حذف المشروع.', 'info');
        }}
      />

      {revisionDrawer && (
        <RevisionDrawer
          isOpen={revisionDrawer.isOpen}
          onClose={() => setRevisionDrawer(null)}
          title={revisionDrawer.title}
          beforeSummary={revisionDrawer.beforeSummary}
          afterSummary={revisionDrawer.afterSummary}
          onAccept={revisionDrawer.onAccept}
        />
      )}

      {/* Accessible Toast Notifications Live Region */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

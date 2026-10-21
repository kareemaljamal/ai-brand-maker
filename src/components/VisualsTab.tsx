import React, { useState, useRef } from 'react';
import {
  Copy,
  Download,
  RefreshCw,
  Loader2,
  Sparkles,
  Check,
  FileCode,
  Image as ImageIcon,
  Palette,
  Wand2,
  Upload,
  Crown,
  Camera,
  Layers,
  Shapes,
  Info,
  ExternalLink,
} from 'lucide-react';
import { BrandVisuals, BrandBrief } from '../types/brand';
import { copyToClipboard } from '../utils/export';

interface VisualsTabProps {
  visuals: BrandVisuals;
  brief: BrandBrief;
  selectedBrandName: string;
  selectedSlogan: string;
  primaryColor: string;
  onGenerateImage: (type: 'logo' | 'avatar', prompt: string, style?: string) => Promise<void>;
  onUpdateVisuals: (newVisuals: BrandVisuals, desc: string) => void;
  isGeneratingLogo: boolean;
  isGeneratingAvatar: boolean;
  onNotify: (text: string, type?: 'success' | 'error' | 'info') => void;
}

export type VisualStyle = '3d-luxury' | 'gold-embossed' | 'photorealistic' | 'minimalist' | 'geometric-vector';

export const VisualsTab: React.FC<VisualsTabProps> = ({
  visuals,
  brief,
  selectedBrandName,
  selectedSlogan,
  primaryColor,
  onGenerateImage,
  onUpdateVisuals,
  isGeneratingLogo,
  isGeneratingAvatar,
  onNotify,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<VisualStyle>(
    (visuals.selectedStyle as VisualStyle) || '3d-luxury'
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const styleOptions: {
    id: VisualStyle;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    badge: string;
  }[] = [
    {
      id: '3d-luxury',
      label: '3D فاخر واستوديو',
      sublabel: 'إضاءة سينمائية وعمق ثلاثي الأبعاد',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      badge: 'نمط نانو بنانا وOctane',
    },
    {
      id: 'gold-embossed',
      label: 'مذهب ومحفور ملكي',
      sublabel: 'تطريز ذهبي بارز على خامات فخمة',
      icon: <Crown className="w-4 h-4 text-yellow-600" />,
      badge: 'Gold Foil Luxury',
    },
    {
      id: 'photorealistic',
      label: 'فوتورياليستك واقعي',
      sublabel: 'موك آب حقيقي كأنه لافتة أو منتج',
      icon: <Camera className="w-4 h-4 text-cyan-500" />,
      badge: 'Real Commercial',
    },
    {
      id: 'minimalist',
      label: 'مينيمال عصري',
      sublabel: 'مونوغرام نقي يعتمد المساحات السلبية',
      icon: <Layers className="w-4 h-4 text-indigo-500" />,
      badge: 'Swiss Minimal',
    },
    {
      id: 'geometric-vector',
      label: 'فيكتور هندسي نقي',
      sublabel: 'نسب ذهبية وخطوط دقيقة قابلة للطباعة',
      icon: <Shapes className="w-4 h-4 text-emerald-500" />,
      badge: 'Vector Master',
    },
  ];

  const handleCopyPrompt = async (prompt: string, key: string, label: string = 'البرومبت') => {
    await copyToClipboard(prompt);
    setCopiedKey(key);
    onNotify(`تم نسخ ${label} بنجاح`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadSvg = (imageUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = filename.endsWith('.svg') ? filename : `${filename}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onNotify('تم تنزيل ملف SVG بنجاح', 'success');
  };

  const handleDownloadPng = (imageUrl: string, filename: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, 1024, 1024);
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = filename.endsWith('.png') ? filename : `${filename}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      onNotify('تم تنزيل صورة PNG فائقة الدقة بنجاح', 'success');
    };
    img.src = imageUrl;
  };

  // Handle uploading or importing image from ChatGPT / local files
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      onNotify('يرجى اختيار ملف صورة صالح (PNG, JPG, WebP, SVG).', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return;

      const newRecord = {
        url: dataUrl,
        generatedAt: new Date().toISOString(),
        promptUsed: 'مستورد يدوياً من شات جي بي تي / ملف محلي',
      };

      const updated = {
        ...visuals,
        logoImage: newRecord,
        logoGallery: [newRecord, ...(visuals.logoGallery || [])].slice(0, 8),
        engineUsed: 'imported' as const,
      };

      onUpdateVisuals(updated, 'استيراد صورة الشعار من شات جي بي تي');
      onNotify('تم اعتماد وتحديث صورة الشعار بنجاح في جميع تصاميم المشروع!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const hasGeneratedLogo = !!visuals.logoImage?.url;
  const hasGeneratedAvatar = !!visuals.avatarImage?.url;

  const logoDisplayUrl = visuals.logoImage?.url || '';
  const avatarDisplayUrl = visuals.avatarImage?.url || '';

  // Tailored ChatGPT Prompt for this brand & selected style
  const activeChatGptPrompt =
    visuals.chatGptPrompt ||
    `Create a master-grade luxury brand logo for "${selectedBrandName}". Style: Ultra-luxurious 3D embossed metallic monogram emblem, Cinema4D, Octane Render 8K. Visual Direction: ${visuals.logoPrompt}. Primary Color: ${primaryColor} on deep carbon matte background (#0B0F19). Perfectly centered geometric emblem, golden ratio balance, luxury typography rendering "${selectedBrandName}". 8K resolution, photorealistic, clean isolated backdrop.`;

  return (
    <div className="space-y-8 text-slate-900 dark:text-slate-100" dir="rtl">
      {/* ================= TOP HERO BANNER: NANO BANANA & CHATGPT QUALITY ================= */}
      <div className="p-6 rounded-3xl bg-gradient-to-l from-indigo-900/90 via-indigo-950 to-slate-900 border border-indigo-500/30 text-white shadow-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-amber-400 p-0.5 shadow-lg shadow-indigo-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  استوديو الهوية البصرية فائق القوة (Nano Banana & ChatGPT Engine)
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono font-bold border border-amber-400/40">
                  Ultra Quality
                </span>
              </div>
              <p className="text-xs text-indigo-200/90 max-w-2xl leading-relaxed">
                توليد متطور متعدد المسارات: دمج نماذج نانو بنانا، استوديو الفيكتور الهندسي فائق الدقة، وبرومبتات مخصصة فورية لـ ChatGPT (DALL-E 3) وميدجورني.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md text-emerald-300 font-bold flex items-center gap-1.5 border border-white/10">
              <Check className="w-3.5 h-3.5" />
              <span>جاهز للاستخدام الفوري والطباعة</span>
            </span>
          </div>
        </div>

        {/* ================= STYLE SELECTION TOOLBAR ================= */}
        <div className="pt-3 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-200">
            <span>اختر نمط الإخراج البصري المطلوب لتطبيقه على الشعار والبرومبت:</span>
            <span className="text-[11px] text-amber-300 font-mono">5 أنماط احترافية</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {styleOptions.map((st) => {
              const isSelected = selectedStyle === st.id;
              return (
                <button
                  key={st.id}
                  onClick={() => {
                    setSelectedStyle(st.id);
                    onNotify(`تم تفعيل نمط: "${st.label}"`, 'info');
                  }}
                  className={`p-3 rounded-2xl text-right transition-all border flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? 'bg-white/20 border-amber-400/80 shadow-lg shadow-amber-500/10 ring-2 ring-amber-400/30'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="p-1 rounded-lg bg-black/30">{st.icon}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-amber-300">
                      {st.badge}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-white">{st.label}</span>
                    <span className="text-[10px] text-indigo-200/80 block line-clamp-1">
                      {st.sublabel}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= MAIN 2-CARD GRID: LOGO & AVATAR ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ================= CARD 1: الشعار الرسمي (Logo) ================= */}
        <div className="bg-white dark:bg-[#131B2E] rounded-3xl border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#7C3AED] dark:text-indigo-400" />
                <h3 className="text-xl font-bold text-[#172033] dark:text-white">
                  الشعار الرسمي (Logo)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EDE9FE] dark:bg-indigo-950/60 text-[#5B21B6] dark:text-indigo-300 border border-[#DDD6FE] dark:border-indigo-800/60">
                  الاسم المعتمد: {selectedBrandName}
                </span>
                {visuals.engineUsed && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    {visuals.engineUsed === 'nano-banana'
                      ? 'Nano Banana 2.1'
                      : visuals.engineUsed === 'imported'
                      ? 'مستورد من ChatGPT'
                      : 'فيكتور استوديو نقي'}
                  </span>
                )}
              </div>
            </div>

            {/* Logo Preview Box (Supports Drag & Drop) */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files?.[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              className={`w-full aspect-square max-h-84 rounded-2xl bg-slate-950 border-2 transition-all flex items-center justify-center p-6 relative overflow-hidden group shadow-inner ${
                isDragOver
                  ? 'border-[#7C3AED] bg-indigo-950/30'
                  : 'border-[#E2E8F0] dark:border-slate-800'
              }`}
            >
              {isGeneratingLogo ? (
                <div className="flex flex-col items-center gap-3 text-center p-6">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 text-[#7C3AED] animate-spin" />
                    <Sparkles className="w-5 h-5 text-amber-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-white block">
                      جارٍ توليد الشعار بنمط "{styleOptions.find((s) => s.id === selectedStyle)?.label}"...
                    </span>
                    <p className="text-xs text-indigo-300/80">
                      محرك الذكاء الاصطناعي يرسم الأشكال الهندسية المتوازنة باسم "{selectedBrandName}"
                    </p>
                  </div>
                </div>
              ) : hasGeneratedLogo ? (
                <img
                  src={logoDisplayUrl}
                  alt={`شعار ${selectedBrandName}`}
                  className="w-full h-full object-contain max-h-76 drop-shadow-2xl transition-transform group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-center p-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#EDE9FE]/20 text-purple-300 flex items-center justify-center border border-purple-500/20 shadow-sm">
                    <Wand2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-base font-bold text-white block">
                      جاهز لتوليد شعار احترافي لمشروع "{selectedBrandName}"
                    </span>
                    <p className="text-xs text-slate-400 max-w-xs">
                      اضغط على زر التوليد بالأسفل، أو اسحب أي صورة قمت بتوليدها من ChatGPT وأفلتها هنا مباشرة!
                    </p>
                  </div>
                </div>
              )}

              {/* Drag overlay indicator */}
              {isDragOver && (
                <div className="absolute inset-0 bg-purple-600/80 backdrop-blur-sm flex flex-col items-center justify-center text-white font-bold text-sm gap-2 animate-in fade-in">
                  <Upload className="w-8 h-8 animate-bounce" />
                  <span>أفلت الصورة هنا لاعتمادها فوراً كشعار للبراند</span>
                </div>
              )}
            </div>

            {/* Quick Action: Upload / Import from ChatGPT & Local File */}
            <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#7C3AED] dark:text-indigo-400" />
                <span className="font-bold text-[#172033] dark:text-slate-300">
                  هل ولّدت صورة في ChatGPT أو نانو بنانا وتريد استخدامها؟
                </span>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0"
              >
                <span>رفع / استيراد الصورة</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {!hasGeneratedLogo ? (
              <button
                onClick={() =>
                  onGenerateImage('logo', visuals.logoPrompt, selectedStyle)
                }
                disabled={isGeneratingLogo}
                className="w-full py-4 px-4 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-bold text-sm sm:text-base shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2"
              >
                {isGeneratingLogo ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5 text-amber-300" />
                )}
                <span>ولّد الشعار الآن بنمط {styleOptions.find((s) => s.id === selectedStyle)?.label}</span>
              </button>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() =>
                      onGenerateImage('logo', visuals.logoPrompt, selectedStyle)
                    }
                    disabled={isGeneratingLogo}
                    className="py-3 px-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/25 transition-all flex items-center justify-center gap-1.5"
                  >
                    {isGeneratingLogo ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    <span>إعادة التوليد بالنمط المختار</span>
                  </button>

                  <button
                    onClick={() => handleCopyPrompt(activeChatGptPrompt, 'logo-chatgpt', 'برومبت ChatGPT')}
                    className="py-3 px-3 rounded-xl bg-white hover:bg-slate-50 dark:hover:bg-slate-700 border border-[#CBD5E1] dark:bg-slate-800 dark:border-slate-700 text-[#172033] dark:text-slate-200 dark:hover:text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {copiedKey === 'logo-chatgpt' ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-[#7C3AED]" />
                    )}
                    <span>نسخ برومبت ChatGPT</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleDownloadPng(logoDisplayUrl, `${selectedBrandName}-logo.png`)}
                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 dark:hover:bg-slate-700 border border-[#CBD5E1] dark:bg-slate-800/80 dark:border-slate-700 text-[#172033] dark:text-slate-300 dark:hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <ImageIcon className="w-4 h-4 text-emerald-500" />
                    <span>تحميل كـ PNG (1024px)</span>
                  </button>

                  {logoDisplayUrl.includes('image/svg+xml') ? (
                    <button
                      onClick={() => handleDownloadSvg(logoDisplayUrl, `${selectedBrandName}-logo.svg`)}
                      className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 dark:hover:bg-slate-700 border border-[#CBD5E1] dark:bg-slate-800/80 dark:border-slate-700 text-[#172033] dark:text-slate-300 dark:hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <FileCode className="w-4 h-4 text-[#7C3AED]" />
                      <span>تحميل كـ SVG فيكتور</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const a = document.createElement('a');
                        a.href = logoDisplayUrl;
                        a.download = `${selectedBrandName}-logo.png`;
                        a.click();
                      }}
                      className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 dark:hover:bg-slate-700 border border-[#CBD5E1] dark:bg-slate-800/80 dark:border-slate-700 text-[#172033] dark:text-slate-300 dark:hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-4 h-4 text-[#7C3AED]" />
                      <span>حفظ الملف الأصلي</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ================= CARD 2: صورة البروفايل (Avatar) ================= */}
        <div className="bg-white dark:bg-[#131B2E] rounded-3xl border border-[#E2E8F0] dark:border-slate-800 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#7C3AED] dark:text-indigo-400" />
                <h3 className="text-xl font-bold text-[#172033] dark:text-white">
                  صورة البروفايل (Social Avatar)
                </h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[#526077] dark:text-slate-400">
                أيقونة السوشيال ميديا
              </span>
            </div>

            {/* Avatar Preview Box */}
            <div className="w-full aspect-square max-h-84 rounded-2xl bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 flex items-center justify-center p-6 relative overflow-hidden group shadow-inner">
              {isGeneratingAvatar ? (
                <div className="flex flex-col items-center gap-3 text-center">
                  <Loader2 className="w-10 h-10 text-[#7C3AED] animate-spin" />
                  <span className="text-xs font-bold text-white">
                    جارٍ رسم وتجهيز الأيقونة الدائرية للحسابات...
                  </span>
                  <span className="text-[11px] text-slate-400">استغراق ثوانٍ معدودة فقط</span>
                </div>
              ) : hasGeneratedAvatar ? (
                <div className="w-60 h-60 rounded-full overflow-hidden flex items-center justify-center shadow-2xl border-4 border-white/20 bg-slate-900/60 p-2">
                  <img
                    src={avatarDisplayUrl}
                    alt="Brand Avatar"
                    className="w-full h-full object-contain rounded-full transition-transform group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-[#EDE9FE]/20 text-purple-300 flex items-center justify-center border border-purple-500/20">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-base font-bold text-white block">
                      لم يتم توليد صورة البروفايل بعد
                    </span>
                    <p className="text-xs text-slate-400 max-w-xs">
                      أيقونة دائرية متناسقة مع ألوان براندك لحسابات إنستجرام وتيك توك وفيسبوك.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Avatar Prompt Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-[#E2E8F0] dark:border-slate-800 space-y-1.5 text-right">
              <div className="flex items-center justify-between text-xs font-bold text-[#172033] dark:text-slate-300">
                <span>توجيه الأفاتار البصري</span>
                <span className="text-[10px] text-[#7C3AED] dark:text-indigo-400 font-mono">Avatar Prompt</span>
              </div>
              <p className="text-xs text-[#526077] dark:text-slate-400 leading-relaxed font-mono line-clamp-2" dir="ltr">
                {visuals.avatarPrompt}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {!hasGeneratedAvatar ? (
              <button
                onClick={() => onGenerateImage('avatar', visuals.avatarPrompt, selectedStyle)}
                disabled={isGeneratingAvatar}
                className="w-full py-4 px-4 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white font-bold text-sm sm:text-base shadow-lg shadow-purple-600/25 transition-all flex items-center justify-center gap-2"
              >
                {isGeneratingAvatar ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                <span>ولّد صورة البروفايل الآن</span>
              </button>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => onGenerateImage('avatar', visuals.avatarPrompt, selectedStyle)}
                    disabled={isGeneratingAvatar}
                    className="py-3 px-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/25 transition-all flex items-center justify-center gap-1.5"
                  >
                    {isGeneratingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    <span>إعادة التوليد</span>
                  </button>

                  <button
                    onClick={() => handleCopyPrompt(visuals.avatarPrompt, 'avatar-prompt', 'برومبت الأفاتار')}
                    className="py-3 px-3 rounded-xl bg-white hover:bg-slate-50 dark:hover:bg-slate-700 border border-[#CBD5E1] dark:bg-slate-800 dark:border-slate-700 text-[#172033] dark:text-slate-200 dark:hover:text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {copiedKey === 'avatar-prompt' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-[#7C3AED]" />}
                    <span>نسخ البرومبت</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleDownloadPng(avatarDisplayUrl, `${selectedBrandName}-avatar.png`)}
                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 dark:hover:bg-slate-700 border border-[#CBD5E1] dark:bg-slate-800/80 dark:border-slate-700 text-[#172033] dark:text-slate-300 dark:hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <ImageIcon className="w-4 h-4 text-emerald-500" />
                    <span>تحميل كـ PNG</span>
                  </button>

                  <button
                    onClick={() => handleDownloadSvg(avatarDisplayUrl, `${selectedBrandName}-avatar.svg`)}
                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 dark:hover:bg-slate-700 border border-[#CBD5E1] dark:bg-slate-800/80 dark:border-slate-700 text-[#172033] dark:text-slate-300 dark:hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <FileCode className="w-4 h-4 text-[#7C3AED]" />
                    <span>تحميل كـ SVG</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ================= SECTION 3: CHATGPT & MIDJOURNEY MASTER PROMPT BOX ================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span>برومبت نانو بنانا & ChatGPT (DALL-E 3) وميدجورني الاحترافي</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 font-mono">
                  Engineered Prompt
                </span>
              </h4>
              <p className="text-xs text-slate-400">
                مصاغ هندسياً بأعلى معايير الإضاءة السينمائية والخامات (8K Octane Render) ليعطيك كواليتي خارقة عند لصقه في ChatGPT Plus أو Midjourney.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleCopyPrompt(activeChatGptPrompt, 'master-chatgpt', 'برومبت ChatGPT الاحترافي')}
            className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2"
          >
            {copiedKey === 'master-chatgpt' ? (
              <Check className="w-4 h-4 text-slate-950" />
            ) : (
              <Copy className="w-4 h-4 text-slate-950" />
            )}
            <span>نسخ البرومبت الاحترافي بالكامل</span>
          </button>
        </div>

        {/* Prompt Content */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 leading-relaxed max-h-40 overflow-y-auto select-all" dir="ltr">
          {activeChatGptPrompt}
        </div>

        {/* Steps for User */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
            <span className="font-bold text-emerald-400 block">1. انسخ البرومبت أعلاه</span>
            <p className="text-slate-400 text-[11px]">يحتوي على اسم براندك، أكواد ألوانك، ونمط الإضاءة والخامات المختارة بدقة.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
            <span className="font-bold text-indigo-400 block">2. الصقه في ChatGPT أو Midjourney</span>
            <p className="text-slate-400 text-[11px]">سيقوم DALL-E 3 بتوليد الشعار بأعلى دقة ممكنة وكأنه مصمم باستوديو عالمي.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
            <span className="font-bold text-amber-400 block">3. ارفع الصورة الناتجة هنا</span>
            <p className="text-slate-400 text-[11px]">اسحب الصورة وأفلتها في المربع أعلاه لتظهر فوراً على جميع الكروت واللافتات!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

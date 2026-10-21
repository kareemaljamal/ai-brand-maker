import { BrandProject } from '../types/brand';
import { generateIntelligentFallbackBrand, generateDynamicBrandSvg } from './domainBrandGenerator';

let cachedDefaultProjects: BrandProject[] | null = null;

export function getDefaultProjects(): BrandProject[] {
  if (cachedDefaultProjects) {
    return cachedDefaultProjects;
  }

  // 1. Pizza Restaurant Default Project (Requested by user)
  const pizzaBrand = generateIntelligentFallbackBrand({
    idea: 'مطعم بيتزا نابوليتانية بالفرن الحطب ومأكولات إيطالية طازجة في المعادي',
    city: 'القاهرة (المعادي)',
    targetAudience: 'عشاق البيتزا الإيطالية الأصيلة والعائلات والشباب في المعادي وجنوب القاهرة',
    personality: 'عصري فاخر',
    category: 'مطاعم وأغذية',
    budget: 120000,
    knownVariableCosts: 48,
    knownMonthlyFixedCosts: 38000,
  });

  const pizzaLogoSvg = generateDynamicBrandSvg(
    'logo',
    pizzaBrand.identity.names[0]?.nameAr || 'بيتزانو فورنو',
    '#EF4444',
    '#F59E0B'
  );
  const pizzaAvatarSvg = generateDynamicBrandSvg(
    'avatar',
    pizzaBrand.identity.names[0]?.nameAr || 'بيتزانو فورنو',
    '#EF4444',
    '#F59E0B'
  );

  const pizzaProject: BrandProject = {
    ...pizzaBrand,
    id: 'default-project-pizza-napoli',
    title: 'فورنو نابولي (بيتزا حطب إيطالية)',
    identity: {
      ...pizzaBrand.identity,
      selectedNameId: 'name-forno-napoli',
      names: [
        {
          id: 'name-forno-napoli',
          nameAr: 'فورنو نابولي',
          nameEn: 'Forno Napoli',
          pronunciation: 'فورنو نابولي',
          meaning: 'مشتق من الكلمة الإيطالية للفرن الحجري العتيق صانع أشهى صواني البيتزا.',
          rationale: 'اسم راقٍ يربط بين عراقة نابولي والفرن الحجري المشتعل بالحطب في المعادي.',
          emotionalAssociations: ['أفران حطب', 'صلصة طماطم سان مارزانو', 'جبنة موزاريلا حقيقية'],
          style: 'إيطالي كلاسيكي راقٍ',
          tradeoff: 'يركز بالكامل على البيتزا النابوليتانية وأفران الحطب.',
          recommended: true,
          favorite: true,
          locked: false,
          story: 'في فورنو نابولي، الحطب ونار الفرن 450 درجة مئوية هما سر الحكاية.. بيتزا نابوليتانية أصيلة تخبز في 90 ثانية بأيدي شيف إيطالي محترف.',
          positioning: 'بيتزا الحطب النابوليتانية الأكثر أصالة وجودة في القاهرة.',
          toneTraits: ['شغوفة', 'أصيلة', 'دافئة', 'مرحبة'],
          greetingExample: 'Benvenuto في فورنو نابولي! بيتزتك السخنة بتستوي في الفرن الحطب دلوقتي.',
          promoExample: 'اطلب أي 2 بيتزا لارج من الفرن الحطب واحصل على تيراميسو إيطالي أصيل مجاناً!',
          matchingSlogan: 'من قلب الفرن الحطب لسفرتك',
        },
        ...pizzaBrand.identity.names.filter((n) => n.nameAr !== 'بيتزانو إيطاليانو'),
      ].slice(0, 6),
    },
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
    visuals: {
      ...pizzaBrand.visuals,
      selectedStyle: '3d-luxury',
      logoImage: {
        url: `data:image/svg+xml;utf8,${encodeURIComponent(pizzaLogoSvg)}`,
        promptUsed: pizzaBrand.visuals.logoPrompt,
        generatedAt: '2026-03-01T10:00:00.000Z',
      },
      avatarImage: {
        url: `data:image/svg+xml;utf8,${encodeURIComponent(pizzaAvatarSvg)}`,
        promptUsed: pizzaBrand.visuals.avatarPrompt,
        generatedAt: '2026-03-01T10:00:00.000Z',
      },
    },
  };

  // 2. Specialty Dental Clinic Project
  const dentalBrand = generateIntelligentFallbackBrand({
    idea: 'مركز تخصصي متكامل لطب وتجميل وزراعة الأسنان في الشيخ زايد',
    city: 'الجيزة (الشيخ زايد)',
    targetAudience: 'العائلات والأفراد الباحثون عن علاج وتجميل أسنان متقدم بأحدث التقنيات الرقمية',
    personality: 'فاخر',
    category: 'رعاية صحية وطبية',
    budget: 250000,
    knownVariableCosts: 180,
    knownMonthlyFixedCosts: 65000,
  });

  const dentalLogoSvg = generateDynamicBrandSvg(
    'logo',
    dentalBrand.identity.names[0]?.nameAr || 'سمايل آرت',
    '#0EA5E9',
    '#6366F1'
  );
  const dentalAvatarSvg = generateDynamicBrandSvg(
    'avatar',
    dentalBrand.identity.names[0]?.nameAr || 'سمايل آرت',
    '#0EA5E9',
    '#6366F1'
  );

  const dentalProject: BrandProject = {
    ...dentalBrand,
    id: 'default-project-dental-clinic',
    title: dentalBrand.identity.names[0]?.nameAr || 'دينتا كير التخصصية',
    createdAt: '2026-02-15T12:00:00.000Z',
    updatedAt: '2026-02-15T12:00:00.000Z',
    visuals: {
      ...dentalBrand.visuals,
      selectedStyle: 'minimal-flat',
      logoImage: {
        url: `data:image/svg+xml;utf8,${encodeURIComponent(dentalLogoSvg)}`,
        promptUsed: dentalBrand.visuals.logoPrompt,
        generatedAt: '2026-02-15T12:00:00.000Z',
      },
      avatarImage: {
        url: `data:image/svg+xml;utf8,${encodeURIComponent(dentalAvatarSvg)}`,
        promptUsed: dentalBrand.visuals.avatarPrompt,
        generatedAt: '2026-02-15T12:00:00.000Z',
      },
    },
  };

  // 3. Specialty Coffee & Workspace Project
  const coffeeBrand = generateIntelligentFallbackBrand({
    idea: 'مقهى ومحمصة قهوة مختصة مع مساحة عمل هادئة لرواد الأعمال في القاهرة الجديدة',
    city: 'القاهرة الجديدة (التجمع الخامس)',
    targetAudience: 'رواد الأعمال، المبرمجون، عشاق القهوة الفاخرة، والطلاب الباحثون عن بيئة إنتاجية هادئة',
    personality: 'عصري',
    category: 'مقاهي وكافيهات',
    budget: 150000,
    knownVariableCosts: 26,
    knownMonthlyFixedCosts: 42000,
  });

  const coffeeLogoSvg = generateDynamicBrandSvg(
    'logo',
    coffeeBrand.identity.names[0]?.nameAr || 'سحاب كافيه',
    '#D97706',
    '#84CC16'
  );
  const coffeeAvatarSvg = generateDynamicBrandSvg(
    'avatar',
    coffeeBrand.identity.names[0]?.nameAr || 'سحاب كافيه',
    '#D97706',
    '#84CC16'
  );

  const coffeeProject: BrandProject = {
    ...coffeeBrand,
    id: 'default-project-specialty-coffee',
    title: coffeeBrand.identity.names[0]?.nameAr || 'سحاب كافيه ومحمصة',
    createdAt: '2026-01-20T09:00:00.000Z',
    updatedAt: '2026-01-20T09:00:00.000Z',
    visuals: {
      ...coffeeBrand.visuals,
      selectedStyle: '3d-luxury',
      logoImage: {
        url: `data:image/svg+xml;utf8,${encodeURIComponent(coffeeLogoSvg)}`,
        promptUsed: coffeeBrand.visuals.logoPrompt,
        generatedAt: '2026-01-20T09:00:00.000Z',
      },
      avatarImage: {
        url: `data:image/svg+xml;utf8,${encodeURIComponent(coffeeAvatarSvg)}`,
        promptUsed: coffeeBrand.visuals.avatarPrompt,
        generatedAt: '2026-01-20T09:00:00.000Z',
      },
    },
  };

  cachedDefaultProjects = [pizzaProject, dentalProject, coffeeProject];
  return cachedDefaultProjects;
}

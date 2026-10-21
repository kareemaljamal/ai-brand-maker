import type { BrandProject } from '../types/brand';
import type { BrandInputData } from '../components/HomeHero';

// Empty sections remain behind loading/error views until Gemini returns their content.
export function createPendingProject(input: BrandInputData, result: any): BrandProject {
  const id = `brand-${crypto.randomUUID()}`;
  return {
    id, title: result.names[0].nameAr,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    brief: {
      id, idea: input.idea, category: input.category || '', businessModel: 'physical',
      city: input.city || 'القاهرة', district: input.district, targetAudience: input.targetAudience || '',
      pricingPosition: 'mid', personality: input.personality || 'عصري',
      budgetEgp: input.budget ? Number(input.budget) : undefined,
      knownVariableCostsEgp: input.knownVariableCosts ? Number(input.knownVariableCosts) : undefined,
      knownMonthlyFixedCostsEgp: input.knownMonthlyFixedCosts ? Number(input.knownMonthlyFixedCosts) : undefined,
      assumptions: [], provenance: { idea: 'user' }, briefRevision: 1,
    },
    identity: {
      names: result.names, selectedNameId: result.names[0].id,
      slogans: result.slogans || [], selectedSloganId: result.slogans?.[0]?.id || '',
      strategy: { story: '', purpose: '', mission: '', vision: '', values: [], positioning: '', valueProposition: '', differentiators: [], audienceNeeds: [], coreMessages: [] },
      voice: { traits: [], doSay: [], doNotSay: [], greetingExample: '', promoExample: '', replyExample: '' },
      palette: [],
    },
    pricing: { tiers: [], items: [], assumptions: [], statusNote: '' },
    marketing: { audienceOverview: '', acquisitionChannels: [], coreLaunchMessage: '', days: [], posts: [] },
    visuals: { visualDirection: '', logoPrompt: '', avatarPrompt: '', logoGallery: [], avatarGallery: [] },
    suggestions: { identity: [], pricing: [], marketing: [] }, staleSections: {},
    revisions: { identity: [], pricing: [], marketing: [], visuals: [] },
  };
}

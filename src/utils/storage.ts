import { BrandProject } from '../types/brand';
import { getDefaultProjects } from './defaultProjects';

const SAVED_PROJECTS_KEY = 'bm_saved_projects_v1';
const DRAFT_PROJECT_KEY = 'bm_draft_project_v1';

// Local Storage for Text & Metadata with Preloaded Original Projects
export function getSavedProjects(): BrandProject[] {
  try {
    const raw = localStorage.getItem(SAVED_PROJECTS_KEY);
    if (!raw) {
      return [];
    }
    const saved = JSON.parse(raw);
    if (!Array.isArray(saved)) {
      return [];
    }
    return saved;
  } catch (e) {
    console.error('Failed to load saved projects:', e);
    return [];
  }
}

export function saveProjectToStorage(project: BrandProject): void {
  try {
    const projects = getSavedProjects();
    const existingIndex = projects.findIndex((p) => p.id === project.id);
    const updated = {
      ...project,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      projects[existingIndex] = updated;
    } else {
      projects.unshift(updated);
    }

    localStorage.setItem(SAVED_PROJECTS_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save project:', e);
  }
}

export function deleteProjectFromStorage(id: string): void {
  try {
    const projects = getSavedProjects().filter((p) => p.id !== id);
    localStorage.setItem(SAVED_PROJECTS_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to delete project:', e);
  }
}

export function saveDraft(project: BrandProject): void {
  try {
    localStorage.setItem(DRAFT_PROJECT_KEY, JSON.stringify(project));
  } catch (e) {
    console.warn('Failed to save draft to localStorage:', e);
  }
}

export function loadDraft(): BrandProject | null {
  try {
    const raw = localStorage.getItem(DRAFT_PROJECT_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load draft:', e);
    return null;
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_PROJECT_KEY);
  } catch (e) {
    console.error('Failed to clear draft:', e);
  }
}

// IndexedDB for Bounded Image Assets Storage
const DB_NAME = 'bm_assets_db';
const DB_VERSION = 1;
const STORE_NAME = 'images';

function openImagesDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported'));
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function storeImageInDB(id: string, base64Url: string): Promise<void> {
  try {
    const db = await openImagesDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ id, data: base64Url, savedAt: Date.now() });
    await new Promise((res, rej) => {
      tx.oncomplete = res;
      tx.onerror = rej;
    });
  } catch (e) {
    console.warn('IndexedDB write warning:', e);
  }
}

export async function getImageFromDB(id: string): Promise<string | null> {
  try {
    const db = await openImagesDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(id);
    return new Promise((resolve) => {
      req.onsuccess = () => resolve(req.result?.data || null);
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}

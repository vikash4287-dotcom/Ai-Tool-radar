/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AITool, Category, Collection } from '../types';
import { CATEGORIES as SEED_CATEGORIES, COLLECTIONS as SEED_COLLECTIONS, generateSeedTools } from '../data/seedData';
import { db, auth } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  where,
  getDoc,
  writeBatch
} from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

const TOOLS_KEY = 'ai_tools_radar_items';
const COLLECTIONS_KEY = 'ai_tools_radar_collections';
const CATEGORIES_KEY = 'ai_tools_radar_categories';

const inMemoryCache: Record<string, string> = {};

export const safeLocalStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      // Storage blocked or unavailable
    }
    return inMemoryCache[key] || null;
  },
  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch (e) {
      // Storage blocked or unavailable
    }
    inMemoryCache[key] = value;
  },
  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch (e) {
      // Storage blocked or unavailable
    }
    delete inMemoryCache[key];
  },
  clear(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
        return;
      }
    } catch (e) {
      // Storage blocked or unavailable
    }
    for (const key in inMemoryCache) {
      delete inMemoryCache[key];
    }
  }
};

// 1. Error Handling Enum and function mapping according to system skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// 2. Seeding utility when admin logs in and Firestore is empty
async function seedBackupLocalToFirestore() {
  if (!auth.currentUser) return;
  // Bootstrapped Admin Verification
  if (auth.currentUser.email !== 'vikash4287@gmail.com') return;

  try {
    const toolsSnap = await getDocs(collection(db, 'tools'));
    if (!toolsSnap.empty) return; // DB is already initialized

    console.log('Admin verified! Initializing empty Firestore with directory master classes...');

    // Seed Categories
    for (const cat of SEED_CATEGORIES) {
      await setDoc(doc(db, 'categories', cat.id), cat);
    }

    // Seed Collections
    for (const col of SEED_COLLECTIONS) {
      await setDoc(doc(db, 'collections', col.id), col);
    }

    // Seed Tools (Batch them to obey maximum limit constraints of 500 actions)
    const seedTools = generateSeedTools();
    const batch = writeBatch(db);
    for (const tool of seedTools) {
      batch.set(doc(db, 'tools', tool.slug), tool);
    }
    await batch.commit();
    console.log('Firestore fully populated of 100 AI Tools, categories and folders.');
  } catch (error) {
    console.warn('Seeding skipped or unauthorized. (Expected if not bootstrapped admin)', error);
  }
}

// Subscribe to Auth State Changes to detect admin login and trigger database seed
if (typeof window !== 'undefined') {
  auth.onAuthStateChanged((user) => {
    if (user) {
      seedBackupLocalToFirestore();
    }
  });
}

// 3. Initialize localStorage with static files fallback so UI is immediately hydrated
function initializeDatabase() {
  if (typeof window !== 'undefined') {
    if (!safeLocalStorage.getItem(TOOLS_KEY)) {
      const initialTools = generateSeedTools();
      safeLocalStorage.setItem(TOOLS_KEY, JSON.stringify(initialTools));
    }
    if (!safeLocalStorage.getItem(COLLECTIONS_KEY)) {
      safeLocalStorage.setItem(COLLECTIONS_KEY, JSON.stringify(SEED_COLLECTIONS));
    }
    if (!safeLocalStorage.getItem(CATEGORIES_KEY)) {
      safeLocalStorage.setItem(CATEGORIES_KEY, JSON.stringify(SEED_CATEGORIES));
    }
  }
}

initializeDatabase();

// 4. Setup Live Firestore watches and sync with localStorage offline cache
if (typeof window !== 'undefined') {
  // Synchronize Tools
  onSnapshot(collection(db, 'tools'), (snap) => {
    if (!snap.empty) {
      const liveTools: AITool[] = [];
      snap.forEach(doc => {
        liveTools.push(doc.data() as AITool);
      });
      safeLocalStorage.setItem(TOOLS_KEY, JSON.stringify(liveTools));
      window.dispatchEvent(new CustomEvent('db-updated'));
    }
  }, (err) => {
    console.warn('Tools real-time watcher inactive or needing initialization.', err);
  });

  // Synchronize Categories
  onSnapshot(collection(db, 'categories'), (snap) => {
    if (!snap.empty) {
      const liveCats: Category[] = [];
      snap.forEach(doc => {
        liveCats.push(doc.data() as Category);
      });
      safeLocalStorage.setItem(CATEGORIES_KEY, JSON.stringify(liveCats));
      window.dispatchEvent(new CustomEvent('db-updated'));
    }
  }, (err) => {
    console.warn('Categories watcher inactive.', err);
  });

  // Synchronize Collections
  onSnapshot(collection(db, 'collections'), (snap) => {
    if (!snap.empty) {
      const liveCols: Collection[] = [];
      snap.forEach(doc => {
        liveCols.push(doc.data() as Collection);
      });
      safeLocalStorage.setItem(COLLECTIONS_KEY, JSON.stringify(liveCols));
      window.dispatchEvent(new CustomEvent('db-updated'));
    }
  }, (err) => {
    console.warn('Collections watcher inactive.', err);
  });
}

export const dbService = {
  // GET tools
  getTools(): AITool[] {
    initializeDatabase();
    if (typeof window === 'undefined') return [];
    try {
      const data = safeLocalStorage.getItem(TOOLS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to parse tools', e);
      return [];
    }
  },

  // Save tools list
  saveTools(tools: AITool[]): void {
    if (typeof window === 'undefined') return;
    safeLocalStorage.setItem(TOOLS_KEY, JSON.stringify(tools));
  },

  // GET single tool by slug
  getToolBySlug(slug: string): AITool | undefined {
    const tools = this.getTools();
    return tools.find(t => t.slug === slug);
  },

  // ADD tool
  async addTool(tool: Omit<AITool, 'id' | 'createdAt' | 'views' | 'trendingScore'>): Promise<AITool> {
    const tools = this.getTools();
    const newTool: AITool = {
      ...tool,
      id: `tool-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      views: 0,
      trendingScore: 50,
      createdAt: new Date().toISOString()
    };
    
    // Save to local cache first
    tools.unshift(newTool);
    this.saveTools(tools);
    window.dispatchEvent(new CustomEvent('db-updated'));

    // Upload to Firestore
    try {
      await setDoc(doc(db, 'tools', newTool.slug), newTool);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `tools/${newTool.slug}`);
    }

    return newTool;
  },

  // UPDATE tool
  async updateTool(slug: string, updated: Partial<AITool>): Promise<AITool | undefined> {
    const tools = this.getTools();
    const index = tools.findIndex(t => t.slug === slug);
    if (index === -1) return undefined;
    
    // Maintain Slug integrity or compute slug of changing name
    let nextSlug = tools[index].slug;
    if (updated.name && updated.name !== tools[index].name) {
      nextSlug = updated.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    const nextTool: AITool = {
      ...tools[index],
      ...updated,
      slug: nextSlug
    };
    
    // Sync local state first
    tools[index] = nextTool;
    this.saveTools(tools);
    window.dispatchEvent(new CustomEvent('db-updated'));

    // Write change to Firestore database doc
    try {
      if (slug !== nextSlug) {
        await deleteDoc(doc(db, 'tools', slug));
        await setDoc(doc(db, 'tools', nextSlug), nextTool);
      } else {
        await setDoc(doc(db, 'tools', slug), nextTool);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tools/${slug}`);
    }

    return nextTool;
  },

  // DELETE tool
  async deleteTool(slug: string): Promise<boolean> {
    const tools = this.getTools();
    const nextTools = tools.filter(t => t.slug !== slug);
    if (nextTools.length === tools.length) return false;
    
    // Update local list first
    this.saveTools(nextTools);
    window.dispatchEvent(new CustomEvent('db-updated'));

    // Submit Firestore deletion command
    try {
      await deleteDoc(doc(db, 'tools', slug));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `tools/${slug}`);
    }

    return true;
  },

  // Increment tool view count
  async incrementViews(slug: string): Promise<void> {
    const tools = this.getTools();
    const index = tools.findIndex(t => t.slug === slug);
    if (index !== -1) {
      const nextViews = tools[index].views + 1;
      const nextScore = Math.floor(nextViews * 0.15 + 50);

      // Local optimistic increment
      tools[index].views = nextViews;
      tools[index].trendingScore = nextScore;
      this.saveTools(tools);
      window.dispatchEvent(new CustomEvent('db-updated'));

      // Fire and forget to Cloud Firestore. 
      // Safe to ignore permissions if unauthenticated browser sessions.
      try {
        await updateDoc(doc(db, 'tools', slug), {
          views: nextViews,
          trendingScore: nextScore
        });
      } catch (error) {
        console.warn('Silent fallback for increment view block write:', error);
      }
    }
  },

  // Bulk CSV Import
  async bulkImportCSV(csvContent: string): Promise<{ successCount: number; errors: string[] }> {
    const lines = csvContent.split('\n');
    if (lines.length < 2) {
      return { successCount: 0, errors: ['CSV empty or lacking header row.'] };
    }

    const header = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const tools = this.getTools();
    let successCount = 0;
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values: string[] = [];
      let currentVal = '';
      let inQuotes = false;
      for (let charIdx = 0; charIdx < line.length; charIdx++) {
        const char = line[charIdx];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentVal.trim());
          currentVal = '';
        } else {
          currentVal += char;
        }
      }
      values.push(currentVal.trim());

      if (values.length < 5) {
        errors.push(`Row ${i + 1}: Insufficient columns.`);
        continue;
      }

      const name = values[header.indexOf('name')] || values[0];
      if (!name) {
        errors.push(`Row ${i + 1}: Name is empty.`);
        continue;
      }

      const rawCategory = values[header.indexOf('category')] || values[1];
      const category = (rawCategory || 'writing').toLowerCase();
      const pricing = (values[header.indexOf('pricing')] || values[2] || 'Freemium') as 'Free' | 'Freemium' | 'Paid';
      const website = values[header.indexOf('website')] || values[3] || 'https://google.com';
      const description = values[header.indexOf('description')] || values[4] || 'Empowering AI workflows.';
      const bestFor = values[header.indexOf('bestFor')] || values[5] || 'AI enthusiasts and workers.';
      const rawFeatures = values[header.indexOf('features')] || values[6] || '';
      const features = rawFeatures ? rawFeatures.split('|').map(f => f.trim()) : ['Free Trial'];

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Check for duplicates
      if (tools.some(t => t.slug === slug)) {
        errors.push(`Row ${i + 1}: Name "${name}" conflicts with existing tool. Skipped.`);
        continue;
      }

      const newTool: AITool = {
        id: `tool-csv-${Date.now()}-${i}`,
        name,
        slug,
        description,
        category,
        pricing: ['Free', 'Freemium', 'Paid'].includes(pricing) ? pricing : 'Freemium',
        website,
        logo: 'bg-emerald-500',
        features,
        pros: ['Imported automatically from bulk list', 'Fast processing support'],
        cons: ['Requires verification of detailed specifications'],
        tags: [category, 'imported'],
        alternatives: [],
        views: Math.floor(Math.random() * 50) + 1,
        trendingScore: Math.floor(Math.random() * 20) + 50,
        featured: false,
        createdAt: new Date().toISOString(),
        bestFor,
        freePlan: pricing !== 'Paid'
      };

      tools.push(newTool);
      successCount++;

      // Upload single item synchronously matching admin operations
      try {
        await setDoc(doc(db, 'tools', newTool.slug), newTool);
      } catch (err) {
        console.error(`Admin CSV Upload failed for slug ${newTool.slug}:`, err);
      }
    }

    if (successCount > 0) {
      this.saveTools(tools);
      window.dispatchEvent(new CustomEvent('db-updated'));
    }

    return { successCount, errors };
  },

  // Export current tools to CSV string
  exportToCSV(): string {
    const tools = this.getTools();
    const headers = ['name', 'category', 'pricing', 'website', 'description', 'bestFor', 'features'];
    const csvRows = [headers.join(',')];

    for (const tool of tools) {
      const values = [
        `"${tool.name.replace(/"/g, '""')}"`,
        `"${tool.category}"`,
        `"${tool.pricing}"`,
        `"${tool.website}"`,
        `"${tool.description.replace(/"/g, '""')}"`,
        `"${tool.bestFor.replace(/"/g, '""')}"`,
        `"${tool.features.join('|')}"`
      ];
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  },

  // Categories
  getCategories(): Category[] {
    initializeDatabase();
    if (typeof window === 'undefined') return [];
    try {
      const data = safeLocalStorage.getItem(CATEGORIES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  // Add category
  async addCategory(category: Category): Promise<void> {
    const list = this.getCategories();
    list.push(category);
    safeLocalStorage.setItem(CATEGORIES_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('db-updated'));

    try {
      await setDoc(doc(db, 'categories', category.id), category);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `categories/${category.id}`);
    }
  },

  // Collections
  getCollections(): Collection[] {
    initializeDatabase();
    if (typeof window === 'undefined') return [];
    try {
      const data = safeLocalStorage.getItem(COLLECTIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  getCollectionBySlug(slug: string): Collection | undefined {
    const list = this.getCollections();
    return list.find(c => c.slug === slug);
  },

  // Add collection
  async addCollection(collection: Collection): Promise<void> {
    const list = this.getCollections();
    list.push(collection);
    safeLocalStorage.setItem(COLLECTIONS_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('db-updated'));

    try {
      await setDoc(doc(db, 'collections', collection.id), collection);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `collections/${collection.id}`);
    }
  },

  // --- Auth & Bookmark Methods ---
  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      return await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Google Auth Failed:', error);
      throw error;
    }
  },

  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Fetch bookmarks
  async getBookmarks(userId: string): Promise<string[]> {
    try {
      const q = query(collection(db, 'bookmarks'), where('userId', '==', userId));
      const snap = await getDocs(q);
      const bookmarks: string[] = [];
      snap.forEach(doc => {
        const data = doc.data();
        if (data.toolSlug) {
          bookmarks.push(data.toolSlug);
        }
      });
      return bookmarks;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'bookmarks');
      return [];
    }
  },

  // Toggle tool bookmark state
  async toggleBookmark(userId: string, toolSlug: string): Promise<boolean> {
    const bookmarkId = `${userId}_${toolSlug}`;
    const docRef = doc(db, 'bookmarks', bookmarkId);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await deleteDoc(docRef);
        return false; // Removed bookmark
      } else {
        await setDoc(docRef, {
          userId,
          toolSlug,
          createdAt: new Date().toISOString()
        });
        return true; // Added bookmark
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `bookmarks/${bookmarkId}`);
      throw error;
    }
  }
};

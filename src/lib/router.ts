/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, createContext, useContext } from 'react';

export type PageType = 'home' | 'search' | 'tool' | 'compare' | 'collections' | 'trending' | 'admin';

export interface RouteState {
  page: PageType;
  params: {
    slug?: string;
    category?: string;
    comparison?: string;
    collectionSlug?: string;
    query?: string;
  };
}

interface RouterContextType {
  route: RouteState;
  navigate: (page: PageType, params?: RouteState['params']) => void;
}

export const RouterContext = createContext<RouterContextType | null>(null);

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}

// Parses hash strings like #/tool/chatgpt or #/compare/chatgpt-vs-claude
export function parseHash(hash: string): RouteState {
  const cleanHash = hash.replace(/^#\//, '');
  
  if (!cleanHash || cleanHash === '') {
    return { page: 'home', params: {} };
  }

  const parts = cleanHash.split('/');
  const routeName = parts[0];

  if (routeName === 'search') {
    const searchParams = new URLSearchParams(parts[1] || '');
    return {
      page: 'search',
      params: { query: searchParams.get('q') || '' }
    };
  }

  if (routeName === 'tool' && parts[1]) {
    return { page: 'tool', params: { slug: parts[1] } };
  }

  if (routeName === 'compare') {
    return { page: 'compare', params: { comparison: parts[1] || '' } };
  }

  if (routeName === 'category' && parts[1]) {
    return { page: 'search', params: { category: parts[1] } };
  }

  if (routeName === 'collections') {
    if (parts[1]) {
      return { page: 'collections', params: { collectionSlug: parts[1] } };
    }
    return { page: 'collections', params: {} };
  }

  if (routeName === 'trending') {
    return { page: 'trending', params: {} };
  }

  if (routeName === 'admin') {
    return { page: 'admin', params: {} };
  }

  return { page: 'home', params: {} };
}

// Format state back to hash string
export function formatHash(page: PageType, params?: RouteState['params']): string {
  if (page === 'home') return '#/';
  if (page === 'search') {
    if (params?.category) return `#/category/${params.category}`;
    if (params?.query) return `#/search?q=${encodeURIComponent(params.query)}`;
    return '#/search';
  }
  if (page === 'tool' && params?.slug) {
    return `#/tool/${params.slug}`;
  }
  if (page === 'compare') {
    return params?.comparison ? `#/compare/${params.comparison}` : '#/compare';
  }
  if (page === 'collections') {
    return params?.collectionSlug ? `#/collections/${params.collectionSlug}` : '#/collections';
  }
  if (page === 'trending') return '#/trending';
  if (page === 'admin') return '#/admin';

  return '#/';
}

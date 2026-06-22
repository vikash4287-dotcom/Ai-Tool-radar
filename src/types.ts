/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AITool {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  pricing: 'Free' | 'Freemium' | 'Paid';
  website: string;
  logo: string; // Tailwind gradient background name or image URL
  features: string[]; // e.g. ["API Available", "Mobile App", "Free Trial"]
  pros: string[];
  cons: string[];
  tags: string[];
  alternatives: string[]; // Slugs of alternative tools
  views: number;
  trendingScore: number;
  featured: boolean;
  createdAt: string;
  bestFor: string;
  strengths?: string;
  weaknesses?: string;
  freePlan?: boolean;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  bestFor: string;
  introduction: string;
  pros: string[];
  cons: string[];
  recommendedToolSlug: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

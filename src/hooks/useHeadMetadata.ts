/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { RouteState } from '../lib/router';
import { dbService } from '../lib/db';

export function useHeadMetadata(route: RouteState) {

  useEffect(() => {
    let title = 'AI Tools Radar | Discover the Best AI Tools & Alternatives';
    let description = 'Discover the right AI tool in seconds. Browse 100+ vetted AI tools, interactive categories, compare alternatives side-by-side, and save favorites to your Radar.';
    let imageUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80'; // Sleek dark technology gradient background
    let url = window.location.href;

    switch (route.page) {
      case 'home':
        title = 'AI Tools Radar | Discover the Best AI Tools & Alternatives';
        description = 'Discover the right AI tool in seconds. Browse 100+ vetted AI tools, interactive categories, compare alternatives side-by-side, and save favorites to your Radar.';
        break;

      case 'search': {
        const queryParam = route.params.query;
        const categoryParam = route.params.category;

        if (categoryParam) {
          const categorizedName = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
          const categoryObj = dbService.getCategories().find(c => c.id === categoryParam);
          const categoryName = categoryObj ? categoryObj.name : `${categorizedName} & Productivity`;
          
          title = `Best AI ${categoryName} Tools in 2026 | AI Tools Radar`;
          description = `Discover top-rated AI tools for ${categoryName}. Compare pricing (Free, Freemium, Paid), pros & cons, features, and find alternatives instantly.`;
        } else if (queryParam) {
          const cleanQuery = decodeURIComponent(queryParam);
          title = `Search Results for "${cleanQuery}" | AI Tools Radar`;
          description = `Explore vetted AI tools matching "${cleanQuery}" on AI Tools Radar. Compare features, pricing, and pros/cons.`;
        } else {
          title = 'Search & Browse AI Tools Directory | AI Tools Radar';
          description = 'Search the full database of verified AI tools. Filter by pricing range or function category to choose the perfect utility.';
        }
        break;
      }

      case 'tool': {
        const slug = route.params.slug;
        if (slug) {
          const tool = dbService.getToolBySlug(slug);
          if (tool) {
            title = `${tool.name} Pricing, Features, Pros/Cons & Alternatives | AI Tools Radar`;
            description = `${tool.description} Learn about its key features, strengths, weaknesses, pricing tier (${tool.pricing}), and top alternatives. Best for: ${tool.bestFor}.`;
            // Dynamic theme/logo placeholder representation as visual helper if applicable
            if (tool.logo && !tool.logo.startsWith('bg-')) {
              imageUrl = tool.logo;
            }
          } else {
            title = 'AI Tool Directory Specifications | AI Tools Radar';
            description = 'Explore specifications, key pricing parameters, pros & cons or competitive alternatives of modern AI applications.';
          }
        }
        break;
      }

      case 'compare': {
        const comparison = route.params.comparison || '';
        const parts = comparison.split('-vs-');
        const slugA = parts[0];
        const slugB = parts[1];

        if (slugA && slugB) {
          const toolA = dbService.getToolBySlug(slugA);
          const toolB = dbService.getToolBySlug(slugB);

          if (toolA && toolB) {
            title = `${toolA.name} vs ${toolB.name} Side-by-Side Comparison | AI Tools Radar`;
            description = `Deep-dive face-off comparison between ${toolA.name} and ${toolB.name}. Analyze pros & cons, feature sets, pricing matrices, strengths, and weaknesses to decide.`;
          } else {
            title = 'AI Tools Comparison Engine | AI Tools Radar';
            description = 'Directly compare top artificial intelligence models and applications side-by-side to make data-driven software acquisitions.';
          }
        } else if (slugA) {
          const toolA = dbService.getToolBySlug(slugA);
          if (toolA) {
            title = `Compare ${toolA.name} Side-by-Side with Alternative Tools | AI Tools Radar`;
            description = `Find alternative products mirroring ${toolA.name}. Compare pros/cons, user experiences, pricing structures side-by-side.`;
          } else {
            title = 'Software Comparison Matrix | AI Tools Radar';
            description = 'Analyze and pair alternatives along features, costs, free-trial rules, and overall productivity efficiencies.';
          }
        } else {
          title = 'AI Tools Comparison Engine - Side-by-Side | AI Tools Radar';
          description = 'Select multiple software items from our curated indexing database to compare key specifications side-by-side helper.';
        }
        break;
      }

      case 'collections': {
        const collectionSlug = route.params.collectionSlug;
        if (collectionSlug) {
          const col = dbService.getCollectionBySlug(collectionSlug);
          if (col) {
            title = `${col.name} AI Workflow & Best Tools Guide | AI Tools Radar`;
            description = `${col.introduction} Curated expert toolbox stack optimized for: ${col.bestFor}. Read essential insights, benefits, and drawbacks.`;
          } else {
            title = 'Curated AI Software Master Packs | AI Tools Radar';
            description = 'Detailed workflow guidelines and hand-chosen product rosters tailored around precise occupations or processes.';
          }
        } else {
          title = 'Vetted AI Tool Stacks & Expert Playbooks | AI Tools Radar';
          description = 'Browse complete hand-picked portfolios of synergized tools to accelerate development, design, editing, and academic work.';
        }
        break;
      }

      case 'trending':
        title = 'Trending & Viral AI Applications - Weekly Radar | AI Tools Radar';
        description = 'Discover what is buzzing in tech. Live tracker highlighting high-performing tools based on views, click counts, and saved bookmarks.';
        break;

      case 'admin':
        title = 'Applet Registry Administration | AI Tools Radar';
        description = 'Authenticated directory panel to publish, delete, test or edit catalog directories of vetted AI platforms.';
        break;

      default:
        break;
    }

    // Apply document global properties and Open Graph / Twitter tags
    document.title = title;

    // Helper to safely set metadata in head
    const updateMeta = (nameAttr: 'name' | 'property', attrValue: string, content: string) => {
      let el = document.querySelector(`meta[${nameAttr}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(nameAttr, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Standard Search Invariants and Descriptions
    updateMeta('name', 'description', description);
    updateMeta('name', 'robots', 'index, follow');

    // Open Graph Tags
    updateMeta('property', 'og:title', title);
    updateMeta('property', 'og:description', description);
    updateMeta('property', 'og:image', imageUrl);
    updateMeta('property', 'og:url', url);
    updateMeta('property', 'og:type', 'website');
    updateMeta('property', 'og:site_name', 'AI Tools Radar');

    // Twitter Card Tags
    updateMeta('name', 'twitter:card', 'summary_large_image');
    updateMeta('name', 'twitter:title', title);
    updateMeta('name', 'twitter:description', description);
    updateMeta('name', 'twitter:image', imageUrl);

  }, [route]);
}

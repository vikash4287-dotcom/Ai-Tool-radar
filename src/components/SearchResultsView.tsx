/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from '../lib/router';
import { dbService } from '../lib/db';
import { AITool } from '../types';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  Filter, 
  ArrowUpDown, 
  SlidersHorizontal, 
  ExternalLink, 
  Plus, 
  Search, 
  Sparkles, 
  Info,
  Check,
  ChevronRight,
  TrendingUp,
  Award,
  PenTool,
  Code,
  Palette,
  Video,
  Megaphone,
  Zap,
  GraduationCap,
  MessageSquare,
  Bookmark
} from 'lucide-react';

// Helper for category-specific tag display names
const getCategoryDisplayName = (id: string, name: string) => {
  if (id === 'design') return 'Image Gen & Design';
  if (id === 'coding') return 'Coding & Dev';
  if (id === 'writing') return 'Writing & Copy';
  return name;
};

// Helper for rendering category icons
const renderCategoryIcon = (iconName: string, className: string = "h-4 w-4") => {
  switch (iconName) {
    case 'PenTool': return <PenTool className={className} />;
    case 'Code': return <Code className={className} />;
    case 'Palette': return <Palette className={className} />;
    case 'Video': return <Video className={className} />;
    case 'Megaphone': return <Megaphone className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'Search': return <Search className={className} />;
    case 'GraduationCap': return <GraduationCap className={className} />;
    case 'TrendingUp': return <TrendingUp className={className} />;
    case 'MessageSquare': return <MessageSquare className={className} />;
    default: return <Sparkles className={className} />;
  }
};

export default function SearchResultsView() {
  const { route, navigate } = useRouter();
  const tools = useMemo(() => dbService.getTools(), []);
  const categories = useMemo(() => dbService.getCategories(), []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: tools.length };
    tools.forEach(tool => {
      const cat = tool.category.toLowerCase();
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [tools]);

  // UI States
  const [searchQuery, setSearchQuery] = useState(route.params.query || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(route.params.category || 'all');
  const [selectedPricing, setSelectedPricing] = useState<string[]>([
    ...(route.params.query?.toLowerCase().includes('free') ? ['Free', 'Freemium'] : [])
  ]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('trending'); // trending, popular, newest, alphabetic
  const [minViews, setMinViews] = useState<number>(0);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<string[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (usr) => {
      setCurrentUser(usr);
      if (usr) {
        try {
          const list = await dbService.getBookmarks(usr.uid);
          setBookmarkedSlugs(list);
        } catch (e) {
          console.warn('Could not sync user bookmarks lists:', e);
        }
      } else {
        setBookmarkedSlugs([]);
      }
    });
    return () => unsub();
  }, []);

  const handleToggleCardBookmark = async (e: React.MouseEvent, slug: string) => {
    e.stopPropagation(); // Avoid card click navigation
    if (!currentUser) {
      if (confirm('Create a free account or Sign In with Google to save AI tools to your collection.')) {
        try {
          const res = await dbService.loginWithGoogle();
          if (res.user) {
            const added = await dbService.toggleBookmark(res.user.uid, slug);
            setBookmarkedSlugs(prev => added ? [...prev, slug] : prev.filter(s => s !== slug));
          }
        } catch (err: any) {
          alert(`Login failed: ${err.message || err}`);
        }
      }
      return;
    }
    try {
      const added = await dbService.toggleBookmark(currentUser.uid, slug);
      setBookmarkedSlugs(prev => added ? [...prev, slug] : prev.filter(s => s !== slug));
    } catch (err) {
      alert('Action could not complete. Check your network.');
    }
  };

  // Update component query if URL changes
  useEffect(() => {
    if (route.params.query !== undefined) {
      setSearchQuery(route.params.query);
    } else {
      setSearchQuery('');
    }
    if (route.params.category !== undefined) {
      setSelectedCategory(route.params.category);
    } else {
      setSelectedCategory('all');
    }
  }, [route.params.query, route.params.category]);

  const togglePricing = (price: string) => {
    setSelectedPricing(prev => 
      prev.includes(price) ? prev.filter(p => p !== price) : [...prev, price]
    );
  };

  const toggleFeature = (feat: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feat) ? prev.filter(f => f !== feat) : [...prev, feat]
    );
  };

  // Intelligent Filter Match Engine
  const parsedSearch = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return { query: '', intentNote: '', categoryOverride: null, pricingOverride: null };

    let intentNote = '';
    let categoryOverride: string | null = null;
    let pricingOverride: string[] | null = null;

    // Explicit suggestions / Problem checks
    if (q.includes('instagram reels') || q.includes('instagram reel') || q.includes('reels') || q.includes('reel') || q.includes('instagram')) {
      intentNote = 'Matched Action: Creating viral Instagram Reels & short-form video. Focus: Video category.';
      categoryOverride = 'video';
    } else if (q.includes('student') || q.includes('students') || q.includes('homework') || q.includes('academic') || q.includes('education') || q.includes('academia')) {
      intentNote = 'Tailored for Students: Showing tutoring, specialized subjects, study companions, and academic citation assistants.';
      categoryOverride = 'education';
    } else if (q.includes('image generator') || q.includes('photo generator') || q.includes('generate image') || q.includes('make image')) {
      intentNote = 'Matched Problem: Visual graphic composition & AI image generation. Focus: Design category.';
      categoryOverride = 'design';
      if (q.includes('free')) {
        pricingOverride = ['Free', 'Freemium'];
      }
    } else if (q.includes('free') || q.includes('zero cost') || q.includes('unpaid')) {
      // Intent check: Free tools
      intentNote = 'Filtering by Free & Freemium pricing models. ';
      pricingOverride = ['Free', 'Freemium'];
    }

    // Intent check: ChatGPT Alternatives
    if (!categoryOverride && (q.includes('chatgpt alternative') || q.includes('chatgpt alt') || q.includes('claude alternative'))) {
      intentNote = 'Showing writing assistants and LLM conversational alternatives. ';
      categoryOverride = 'writing';
    }

    // Intent check: coding assistants
    if (!categoryOverride && (q.includes('coding assistant') || q.includes('code tool') || q.includes('write code'))) {
      intentNote = 'Showing specialized AI compilers & code editors. ';
      categoryOverride = 'coding';
    }

    // Problem-based searches
    if (!categoryOverride) {
      if (q.includes('create logo') || q.includes('logo') || q.includes('make banner') || q.includes('graphics')) {
        intentNote = 'Matched Problem: Graphic and logo generation. Focus: Design category.';
        categoryOverride = 'design';
      } else if (q.includes('write blog') || q.includes('blog editor') || q.includes('essay assistant') || q.includes('write article')) {
        intentNote = 'Matched Problem: Content writing and editing. Focus: Writing category.';
        categoryOverride = 'writing';
      } else if (q.includes('make ppt') || q.includes('presentation') || q.includes('slides creator') || q.includes('pitch deck')) {
        intentNote = 'Matched Problem: Crafting decks and agendas. Focus: Productivity category.';
        categoryOverride = 'productivity';
      } else if (q.includes('create video') || q.includes('video editor') || q.includes('make animation') || q.includes('avatar generator')) {
        intentNote = 'Matched Problem: Creating and scaling video assets. Focus: Video category.';
        categoryOverride = 'video';
      }
    }

    // Profession-based searches
    if (!categoryOverride) {
      if (q.includes('marketer') || q.includes('marketing specialist') || q.includes('social media manager')) {
        intentNote = 'Tailored for Marketers: Showing SEO, copywriting, and growth campaign managers.';
        categoryOverride = 'marketing';
      } else if (q.includes('recruiter') || q.includes('hiring manager') || q.includes('hr lead')) {
        intentNote = 'Tailored for HR / Recruiters: Showing lead enrichment and sequencing platforms.';
        categoryOverride = 'sales';
      } else if (q.includes('designer') || q.includes('illustrator') || q.includes('ui builder')) {
        intentNote = 'Tailored for Designers: Showing vector styling and graphic composition products.';
        categoryOverride = 'design';
      } else if (q.includes('founder') || q.includes('startup lead') || q.includes('indie developer')) {
        intentNote = 'Tailored for Founders: Showing pitch decks, automations, and quick MVPs.';
        categoryOverride = 'productivity';
      }
    }

    return {
      query: q,
      intentNote,
      categoryOverride,
      pricingOverride
    };
  }, [searchQuery]);

  // Apply filtering logic
  const filteredTools = useMemo(() => {
    let result = [...tools];

    // 1. Text Search query (filtering on name, description, category, and tags)
    const baseQuery = parsedSearch.query
      .replace(/(create instagram reels|instagram reels|instagram reel|instagram|reels|reel|short video)/g, '')
      .replace(/(ai for students|students|student|education|academic)/g, '')
      .replace(/(free tools|chatgpt alternative|coding assistant|create logo|write blog|make ppt|create video|marketer|recruiter|designer|founder)/g, '')
      .replace(/\b(ai|for|to|best|the|is|a)\b/g, '')
      .trim();

    if (baseQuery) {
      // First try exact substring match
      const exactFiltered = result.filter(tool => {
        const nameMatch = tool.name?.toLowerCase().includes(baseQuery) ?? false;
        const descMatch = tool.description?.toLowerCase().includes(baseQuery) ?? false;
        const tagMatch = tool.tags?.some(t => t.toLowerCase().includes(baseQuery)) ?? false;
        const catMatch = tool.category?.toLowerCase().includes(baseQuery) ?? false;
        const bestMatch = tool.bestFor?.toLowerCase().includes(baseQuery) ?? false;
        
        return nameMatch || descMatch || tagMatch || catMatch || bestMatch;
      });

      if (exactFiltered.length > 0) {
        result = exactFiltered;
      } else {
        // Fallback to token keyword matching
        const tokens = baseQuery.split(/\s+/).filter(tok => tok.length > 2 && !['and', 'for', 'the', 'with', 'tools', 'tool', 'free'].includes(tok));
        if (tokens.length > 0) {
          result = result.filter(tool => {
            return tokens.some(tok => {
              const nameMatch = tool.name?.toLowerCase().includes(tok) ?? false;
              const descMatch = tool.description?.toLowerCase().includes(tok) ?? false;
              const tagMatch = tool.tags?.some(t => t.toLowerCase().includes(tok)) ?? false;
              const catMatch = tool.category?.toLowerCase().includes(tok) ?? false;
              const bestMatch = tool.bestFor?.toLowerCase().includes(tok) ?? false;
              
              return nameMatch || descMatch || tagMatch || catMatch || bestMatch;
            });
          });
        }
      }
    }

    // 2. Category Filter (respect URL state or smart override)
    const activeCategory = parsedSearch.categoryOverride || selectedCategory;
    if (activeCategory && activeCategory !== 'all') {
      result = result.filter(tool => tool.category.toLowerCase() === activeCategory.toLowerCase());
    }

    // 3. Pricing Filter (respect URL state/intent or sidebar)
    const activePricing = parsedSearch.pricingOverride || selectedPricing;
    if (activePricing.length > 0) {
      result = result.filter(tool => activePricing.includes(tool.pricing));
    }

    // 4. Features Filter
    if (selectedFeatures.length > 0) {
      result = result.filter(tool => 
        selectedFeatures.every(f => tool.features.includes(f))
      );
    }

    // 5. Popularity Views Filter
    if (minViews > 0) {
      result = result.filter(tool => (tool.views || 0) >= minViews);
    }

    // 6. Sorting
    if (sortBy === 'trending') {
      result.sort((a, b) => b.trendingScore - a.trendingScore);
    } else if (sortBy === 'popular') {
      result.sort((a, b) => b.views - a.views);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'alphabetic') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [tools, parsedSearch, selectedCategory, selectedPricing, selectedFeatures, sortBy, minViews]);

  const handleSearchFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('search', { query: searchQuery.trim() });
  };

  const handleCompareClick = (toolSlug: string) => {
    // If we want to compare, navigate to compare page preloaded with this slug
    navigate('compare', { comparison: `${toolSlug}-vs-` });
  };

  return (
    <div className="py-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Explore Tools</span>
            <span className="text-xs bg-indigo-50 text-indigo-600 font-semibold py-1 px-2.5 rounded-full border border-indigo-100">
              {filteredTools.length} Mapped
            </span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">Refine and filter our catalog in real-time. Speed up your search loop.</p>
        </div>

        {/* Live Top Search Input */}
        <form onSubmit={handleSearchFormSubmit} className="relative w-full max-w-sm flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search matching tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-800 pl-10 pr-4 py-2.5 rounded-xl focus:border-indigo-500 focus:outline-none placeholder:text-slate-400 text-sm shadow-xs"
            />
            <button
              type="submit"
              className="absolute left-3.5 top-3.5 text-slate-400 hover:text-indigo-650 transition-colors flex items-center justify-center"
              title="Submit search"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md active:scale-95 shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Intelligent AI Engine Response Note banner */}
      {parsedSearch.intentNote && (
        <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start space-x-3 text-slate-700 text-xs animate-fade-in">
          <Sparkles className="h-4.5 w-4.5 text-indigo-550 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-indigo-900">Smart Radar:</span> {parsedSearch.intentNote}
            {parsedSearch.categoryOverride && (
              <span className="text-indigo-400 font-medium ml-1">
                Category focus set to <span className="uppercase font-mono">{parsedSearch.categoryOverride}</span>.
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          
          <div className="p-5 bg-white border border-slate-100 rounded-3xl space-y-6 shadow-sm">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-bold text-slate-850 text-sm flex items-center space-x-2">
                <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
                <span>Refine Search</span>
              </span>
              {(selectedCategory !== 'all' || selectedPricing.length > 0 || selectedFeatures.length > 0 || minViews > 0) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedPricing([]);
                    setSelectedFeatures([]);
                    setMinViews(0);
                    setSearchQuery('');
                  }}
                  className="text-[10px] text-rose-500 hover:text-rose-650 font-bold transition-all cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Category selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Categories
                </label>
                {parsedSearch.categoryOverride && (
                  <span className="text-[9px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-full border border-indigo-100 flex items-center gap-0.5">
                    <Sparkles className="h-2.5 w-2.5 animate-pulse" /> Focus Linked
                  </span>
                )}
              </div>
              
              <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  disabled={!!parsedSearch.categoryOverride}
                  className={`w-full flex items-center justify-between text-xs py-2 px-3 rounded-xl text-left transition-all border cursor-pointer ${
                    (parsedSearch.categoryOverride || selectedCategory) === 'all'
                      ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-150 text-slate-700 border-slate-100 hover:border-slate-200'
                  } disabled:opacity-50`}
                >
                  <span className="flex items-center space-x-2">
                    <Filter className="h-3.5 w-3.5 shrink-0" />
                    <span>All Sectors</span>
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    (parsedSearch.categoryOverride || selectedCategory) === 'all'
                      ? 'bg-indigo-750 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {categoryCounts.all || 0}
                  </span>
                </button>

                {categories.map(cat => {
                  const isActive = (parsedSearch.categoryOverride || selectedCategory) === cat.id;
                  const count = categoryCounts[cat.id.toLowerCase()] || 0;
                  const displayName = getCategoryDisplayName(cat.id, cat.name);
                  
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      disabled={!!parsedSearch.categoryOverride}
                      className={`w-full flex items-center justify-between text-xs py-2 px-3 rounded-xl text-left transition-all border cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white border-indigo-600 font-extrabold shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-150 text-slate-700 border-slate-100 hover:border-slate-200'
                      } disabled:opacity-50`}
                    >
                      <span className="flex items-center space-x-2 truncate">
                        {renderCategoryIcon(cat.icon, `h-3.5 w-3.5 shrink-0 ${isActive ? 'text-white' : 'text-indigo-500'}`)}
                        <span className="truncate">{displayName}</span>
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        isActive
                          ? 'bg-indigo-700 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pricing checkboxes */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Pricing Model
              </label>
              <div className="space-y-2.5 text-xs">
                {[
                  { value: 'Free', label: 'Free Only', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' },
                  { value: 'Freemium', label: 'Freemium / Hybrid', color: 'bg-sky-50 text-sky-700 hover:bg-sky-100' },
                  { value: 'Paid', label: 'Paid / Pro Plans', color: 'bg-rose-50 text-rose-700 hover:bg-rose-100' }
                ].map(price => {
                  const isChecked = selectedPricing.includes(price.value);
                  return (
                    <label 
                      key={price.value} 
                      className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                        isChecked 
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-medium' 
                          : 'bg-slate-55 hover:bg-slate-100 border-transparent text-slate-600'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePricing(price.value)}
                          className="rounded bg-slate-55 border-slate-200 text-indigo-600 focus:ring-0 cursor-pointer"
                        />
                        <span>{price.value}</span>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${price.color}`}>
                        {price.value === 'Free' ? 'Free' : price.value === 'Freemium' ? 'Try' : 'Buy'}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Popularity Range / Filters */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Popularity Level
                </label>
                <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                  {minViews === 0 ? 'Any Viewcount' : `${minViews.toLocaleString()}+ views`}
                </span>
              </div>

              {/* Slider for precision tuning */}
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="8000"
                  step="250"
                  value={minViews}
                  onChange={(e) => setMinViews(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                
                <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                  <span>0 (All)</span>
                  <span>4k views</span>
                  <span>8k views+</span>
                </div>

                {/* Micro-Buttons for quick Popularity Tiers */}
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {[
                    { value: 0, label: 'Any Traffic' },
                    { value: 1500, label: 'Emerging (1.5k+)' },
                    { value: 3500, label: 'Established (3.5k+)' },
                    { value: 6000, label: 'High Demand (6k+)' }
                  ].map(preset => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setMinViews(preset.value)}
                      className={`text-[10px] py-1 px-1.5 rounded-lg border font-medium text-center transition-all cursor-pointer ${
                        minViews === preset.value
                          ? 'bg-indigo-50 font-bold border-indigo-200 text-indigo-700'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature lists checkboxes */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block">
                Features Spec
              </label>
              <div className="space-y-2 text-xs">
                {['API Available', 'Mobile App', 'Browser Extension', 'Open Source', 'Free Trial'].map(feat => (
                  <label key={feat} className="flex items-center space-x-2.5 text-slate-600 cursor-pointer hover:text-indigo-600 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(feat)}
                      onChange={() => toggleFeature(feat)}
                      className="rounded bg-slate-50 border-slate-200 text-indigo-600 focus:ring-0 cursor-pointer"
                    />
                    <span>{feat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sorting helper inside Sidebar */}
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Sort Sequence
              </label>
              <div className="space-y-1.5">
                {[
                  { value: 'trending', label: 'Trending Score' },
                  { value: 'popular', label: 'Total Views' },
                  { value: 'newest', label: 'Recently Shipped' },
                  { value: 'alphabetic', label: 'Name (A-Z)' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className={`flex items-center justify-between w-full text-xs py-1.5 px-2.5 rounded-lg text-left transition-all cursor-pointer ${
                      sortBy === opt.value
                        ? 'bg-indigo-50 text-indigo-600 border border-indigo-100 font-semibold'
                        : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-55'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {sortBy === opt.value && <ChevronRight className="h-3.5 w-3.5 text-indigo-550" />}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Quick Advert/Promo block */}
          <div className="p-5 bg-white border border-slate-100 rounded-3xl flex flex-col items-center text-center shadow-sm">
            <Award className="h-6 w-6 text-indigo-600 mb-2" />
            <h5 className="text-slate-800 font-extrabold text-xs">Radar Sponsored Spot</h5>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              Accelerate your SaaS traffic with premium placement. Click the settings icon to claim admin control.
            </p>
          </div>

        </aside>

        {/* Results Stream */}
        <main className="flex-1 space-y-6">
          
          <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-150">
            <span>Showing {filteredTools.length} matching AI products</span>
            <span>Sorted by {sortBy}</span>
          </div>

          {filteredTools.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-slate-100 shadow-sm">
              <Filter className="h-10 w-10 text-slate-300 mx-auto mb-4" />
              <h3 className="font-bold text-slate-800 text-base">No tools match your active state</h3>
              <p className="text-slate-500 text-xs mt-2 max-w-sm mx-auto">
                Try typing a broader question (like "make a ppt"), clearing active sidebar options, or browsing different tags.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  className="group bg-white hover:shadow-xl hover:shadow-indigo-500/10 border border-slate-150 hover:border-indigo-200 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.015] active:scale-[0.985] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm relative overflow-hidden"
                >
                  {/* Floating Bookmark Button */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleCardBookmark(e, tool.slug)}
                    className="absolute top-4 right-4 p-2 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-100 transition-all z-10 bg-slate-50 border border-slate-200"
                    title={bookmarkedSlugs.includes(tool.slug) ? "Remove Bookmark" : "Save / Bookmark tool"}
                  >
                    <Bookmark className={`h-4 w-4 ${bookmarkedSlugs.includes(tool.slug) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                  </button>

                  {/* Tool Metadata */}
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`h-14 w-14 shrink-0 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-md ${tool.logo}`}>
                      {tool.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center flex-wrap gap-2">
                        <h3 className="text-lg font-bold text-slate-800 hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('tool', { slug: tool.slug })}>
                          {tool.name}
                        </h3>
                        <span className="text-[10px] font-mono font-medium text-slate-400 uppercase bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                          {tool.category}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          tool.pricing === 'Free'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : tool.pricing === 'Freemium'
                              ? 'bg-sky-50 text-sky-600 border border-sky-100'
                              : 'bg-rose-50 text-rose-600 border border-rose-100'
                        }`}>
                          {tool.pricing}
                        </span>
                      </div>

                      <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                        {tool.description}
                      </p>

                      <div className="flex items-center flex-wrap gap-1.5 mt-3">
                        {tool.tags.slice(0, 4).map(tag => (
                          <span
                            key={tag}
                            onClick={() => setSearchQuery(tag)}
                            className="text-[10px] bg-slate-50 text-slate-500 py-1 px-2.5 rounded-full hover:text-indigo-650 hover:bg-indigo-50 transition-colors cursor-pointer border border-slate-150"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Block */}
                  <div className="w-full md:w-auto flex md:flex-col sm:flex-row gap-2 shrink-0">
                    <button
                      onClick={() => navigate('tool', { slug: tool.slug })}
                      className="flex-1 md:flex-initial bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold border border-slate-150 text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center space-x-1"
                    >
                      <span>Explore details</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleCompareClick(tool.slug)}
                      className="flex-1 md:flex-initial bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md shadow-indigo-100 hover:scale-[1.01] flex items-center justify-center space-x-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Compare side-by-side</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </main>
      </div>

    </div>
  );
}

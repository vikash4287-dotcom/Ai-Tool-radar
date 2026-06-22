/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from '../lib/router';
import { dbService } from '../lib/db';
import { AITool, Category, Collection } from '../types';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  Search, 
  TrendingUp, 
  Sparkles, 
  FolderHeart, 
  ArrowRight,
  GraduationCap,
  Megaphone,
  Palette,
  Video,
  Code,
  Zap,
  BookOpen,
  MousePointerClick,
  TrendingUp as TrendingIcon,
  Crown,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SUGGESTIONS = [
  'Create Instagram Reels',
  'AI for Students',
  'ChatGPT Alternatives',
  'AI for Marketing',
  'Best AI Coding Tools',
  'Free AI Image Generator'
];

export default function HomeView() {
  const { navigate } = useRouter();
  const [searchVal, setSearchVal] = useState('');
  const [suggestionIdx, setSuggestionIdx] = useState(0);

   const tools = dbService.getTools();
  const categories = dbService.getCategories();
  const collections = dbService.getCollections();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<string[]>([]);

  // Listen to Auth & Bookmarked tools list sync
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
    e.stopPropagation(); // Avoid triggering full-card click navigation
    if (!currentUser) {
      if (confirm('Create a free account or Sign In with Google to bookmark AI tools.')) {
        try {
          const res = await dbService.loginWithGoogle();
          if (res.user) {
            const added = await dbService.toggleBookmark(res.user.uid, slug);
            setBookmarkedSlugs(prev => added ? [...prev, slug] : prev.filter(s => s !== slug));
          }
        } catch (err: any) {
          alert(`Authentication failed: ${err.message || err}`);
        }
      }
      return;
    }

    try {
      const added = await dbService.toggleBookmark(currentUser.uid, slug);
      setBookmarkedSlugs(prev => added ? [...prev, slug] : prev.filter(s => s !== slug));
    } catch (err) {
      console.error("Error toggling home card bookmark:", err);
    }
  };

  // Dynamic validation filter to hide suggest query strings if they return 0 matching listings
  const activeSuggestions = useMemo(() => {
    return SUGGESTIONS.filter(suggestion => {
      const q = suggestion.toLowerCase().trim();
      
      // Determine what category this matches, or use general matching Heuristics
      let targetCategory = '';
      if (q.includes('reels') || q.includes('instagram') || q.includes('reel')) {
        targetCategory = 'video';
      } else if (q.includes('student') || q.includes('academic') || q.includes('education')) {
        targetCategory = 'education';
      } else if (q.includes('coding') || q.includes('code')) {
        targetCategory = 'coding';
      } else if (q.includes('writing') || q.includes('chatgpt')) {
        targetCategory = 'writing';
      } else if (q.includes('marketing')) {
        targetCategory = 'marketing';
      } else if (q.includes('image') || q.includes('design')) {
        targetCategory = 'design';
      }

      // Check if there are any tools in this category, or matching the tokens
      return tools.some(tool => {
        if (targetCategory && tool.category.toLowerCase() === targetCategory) {
          return true;
        }
        
        const tokens = q.split(/\s+/).filter(tok => tok.length > 2 && !['create', 'best', 'for', 'free', 'and', 'the', 'with'].includes(tok));
        if (tokens.length === 0) return true;
        return tokens.some(tok => 
          tool.name?.toLowerCase().includes(tok) || 
          tool.description?.toLowerCase().includes(tok) ||
          tool.tags?.some(tag => tag.toLowerCase().includes(tok))
        );
      });
    });
  }, [tools]);

  // Rotate suggestions
  useEffect(() => {
    if (activeSuggestions.length <= 1) return;
    const interval = setInterval(() => {
      setSuggestionIdx((prev) => (prev + 1) % activeSuggestions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeSuggestions.length]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('search', { query: searchVal.trim() });
  };

  const handleSuggestionClick = (keyword: string) => {
    setSearchVal(keyword);
    navigate('search', { query: keyword });
  };

  // Get Top trending tools (featured or highest trendingScore)
  const trendingTools = [...tools]
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, 6);

  // Get New tools (sorted by latest createdAt or id)
  const newTools = [...tools]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  // Helper to count tools per category
  const getCategoryCount = (catId: string) => {
    return tools.filter(t => t.category.toLowerCase() === catId.toLowerCase()).length;
  };

  // Helper to map string to actual Lucide-React icons
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'PenTool': return <BookOpen className="h-6 w-6" />;
      case 'Megaphone': return <Megaphone className="h-6 w-6" />;
      case 'Palette': return <Palette className="h-6 w-6" />;
      case 'Video': return <Video className="h-6 w-6" />;
      case 'Code': return <Code className="h-6 w-6" />;
      case 'Zap': return <Zap className="h-6 w-6" />;
      case 'Search': return <Search className="h-6 w-6" />;
      case 'GraduationCap': return <GraduationCap className="h-6 w-6" />;
      case 'TrendingUp': return <TrendingIcon className="h-6 w-6" />;
      default: return <Sparkles className="h-6 w-6" />;
    }
  };

  return (
    <div className="space-y-16 py-6">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden text-center max-w-4xl mx-auto px-4 py-12 md:py-20 rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-100/40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <span className="inline-flex items-center space-x-1 text-xs text-indigo-600 bg-indigo-50 border border-indigo-100 font-mono px-3.5 py-1.5 rounded-full mb-6 uppercase tracking-wider animate-bounce">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
          <span>Curated for Creators, Developers & Students</span>
        </span>

        <h1 className="text-4xl md:text-5xl font-extrabold font-sans tracking-tight text-slate-900 leading-tight">
          Find the <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">perfect AI tool</span> <br className="hidden md:inline" />
          for any task.
        </h1>
        
        <p className="mt-4 text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Explore, compare, and discover thousands of AI tools for work, creativity, business, and learning. Discover your next technological superpower.
        </p>

        {/* Big Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-8 max-w-2xl mx-auto relative px-4 flex flex-col sm:flex-row items-stretch gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="What are you trying to build or solve today?"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-400 text-sm shadow-sm"
              id="main-home-search"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-indigo-100 hover:scale-[1.01] active:scale-95 transition-all text-sm flex items-center justify-center space-x-2"
          >
            <span>Search Tool</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Rotating Suggestions */}
        {activeSuggestions.length > 0 && (
          <div className="mt-6 text-xs text-slate-400 flex flex-wrap justify-center items-center gap-2 px-4 select-none">
            <span className="font-mono uppercase text-[10px] tracking-wider text-slate-500">Suggestions:</span>
            
            <div className="h-6 flex items-center relative overflow-hidden px-1.5 bg-slate-50 border border-slate-100 rounded-lg">
              <AnimatePresence mode="wait">
                <motion.button
                  key={suggestionIdx}
                  onClick={() => handleSuggestionClick(activeSuggestions[suggestionIdx % activeSuggestions.length])}
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-indigo-600 font-medium hover:text-indigo-700 flex items-center space-x-1 outline-none"
                >
                  <span>{activeSuggestions[suggestionIdx % activeSuggestions.length]}</span>
                  <MousePointerClick className="h-3 w-3" />
                </motion.button>
              </AnimatePresence>
            </div>

            <span className="text-slate-200">|</span>

            {activeSuggestions.slice(0, 3).map((keyword) => (
              <button
                key={keyword}
                onClick={() => handleSuggestionClick(keyword)}
                className="hover:text-indigo-600 hover:border-indigo-105 transition-colors bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md border border-slate-100 cursor-pointer"
              >
                {keyword}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Trending AI Tools Leaderboard Page Segment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Trending AI Tools</h2>
              <p className="text-xs text-slate-500">The absolute most-active AI products taking over Reddit and Product Hunt today.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('trending')}
            className="flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            <span>View All Trending</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => navigate('tool', { slug: tool.slug })}
              className="group relative bg-white border border-slate-100/80 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-200 hover:-translate-y-1 hover:scale-[1.025] active:scale-[0.985] transition-all duration-300 cursor-pointer"
            >
              {tool.featured && (
                <span className="absolute top-4 right-14 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold uppercase py-0.5 px-2 rounded-full flex items-center space-x-0.5 shadow-sm z-10">
                  <Crown className="h-2.5 w-2.5" />
                  <span>Featured</span>
                </span>
              )}

              {/* Floating Bookmark Button */}
              <button
                type="button"
                onClick={(e) => handleToggleCardBookmark(e, tool.slug)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-350 hover:text-rose-500 hover:bg-rose-50 transition-all z-10 bg-white/80 backdrop-blur-xs border border-slate-200 shadow-2xs hover:scale-105"
                title={bookmarkedSlugs.includes(tool.slug) ? "Remove Bookmark" : "Save / Bookmark tool"}
              >
                <Bookmark className={`h-3.5 w-3.5 ${bookmarkedSlugs.includes(tool.slug) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              </button>
              
              <div className="flex items-center space-x-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow ${tool.logo}`}>
                  {tool.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-850 group-hover:text-indigo-600 transition-colors">
                    {tool.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
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
                </div>
              </div>

              <p className="mt-4 text-slate-500 text-xs leading-relaxed line-clamp-2">
                {tool.description}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex gap-1.5 flex-wrap">
                  {tool.features.slice(0, 2).map((feat) => (
                    <span key={feat} className="text-[10px] text-indigo-600 bg-indigo-50 font-semibold py-0.5 px-1.5 rounded-md">
                      {feat}
                    </span>
                  ))}
                </div>
                <span className="font-mono bg-slate-50 text-slate-500 px-2 py-0.5 border border-slate-100 rounded">
                  {tool.views} Views
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Curated Best Collections */}
      <section className="bg-white border-y border-slate-100 py-16 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="p-2 bg-indigo-55 text-indigo-600 rounded-lg inline-block mb-3 bg-indigo-50">
                <FolderHeart className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-slate-850 tracking-tight">Best AI Tool Collections</h2>
              <p className="text-slate-500 text-xs">Curated lists tailored strictly to specific student, design and marketing fields.</p>
            </div>
            <button
              onClick={() => navigate('collections')}
              className="mt-4 md:mt-0 flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              <span>Explore All Collections</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.slice(0, 3).map((col) => (
              <div
                key={col.id}
                onClick={() => navigate('collections', { collectionSlug: col.slug })}
                className="group bg-slate-50/50 border border-slate-100 rounded-2xl p-6 hover:border-indigo-200 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 hover:scale-[1.025] active:scale-[0.985] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2.5 bg-indigo-100/40 text-indigo-600 rounded-xl group-hover:scale-105 transition-all">
                      <GraduationCap className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="font-bold text-slate-850 group-hover:text-indigo-600 transition-all text-base">
                      {col.name}
                    </h3>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                    {col.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Best For: {col.id.replace('best-ai-tools-for-', '')}</span>
                  <span className="text-indigo-600 group-hover:translate-x-1.5 transition-transform flex items-center space-x-0.5 font-semibold">
                    <span>Read</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories Grid Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight mb-2 text-center">Popular Categories</h2>
        <p className="text-slate-500 text-xs text-center mb-8">Browse curated sets representing direct professional software categories.</p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate('search', { category: cat.id })}
              className="group cursor-pointer rounded-2xl border border-slate-100 bg-white p-6 flex flex-col items-center justify-center text-center hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 hover:scale-[1.04] active:scale-[0.96] transition-all duration-300 shadow-sm"
            >
              <div className={`p-4 rounded-full bg-slate-50 text-indigo-600 mb-4 group-hover:rotate-6 transition-transform border border-slate-100 shadow-sm`}>
                {renderCategoryIcon(cat.icon)}
              </div>
              <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-sm">
                {cat.name}
              </h3>
              <span className="mt-1 text-[11px] font-mono text-slate-400">
                {getCategoryCount(cat.id)} Tools Available
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* New AI Tools Carousel Segment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-transparent">
        <div className="flex items-center space-x-2 mb-8">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-850 tracking-tight">Newly Added Tools</h2>
            <p className="text-xs text-slate-500">Recently mapped additions to the platform database. Explore the bleeding-edge.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 p-0.5">
          {newTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => navigate('tool', { slug: tool.slug })}
              className="group relative bg-white border border-slate-150 hover:border-indigo-200 rounded-xl p-4 cursor-pointer hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 flex flex-col justify-between shadow-xs"
            >
              {/* Floating Bookmark Button */}
              <button
                type="button"
                onClick={(e) => handleToggleCardBookmark(e, tool.slug)}
                className="absolute top-3 right-3 p-1 rounded-md text-slate-350 hover:text-rose-500 hover:bg-rose-50 transition-all z-10 bg-white border border-slate-150 shadow-2xs hover:scale-105"
                title={bookmarkedSlugs.includes(tool.slug) ? "Remove Bookmark" : "Save / Bookmark tool"}
              >
                <Bookmark className={`h-3 w-3 ${bookmarkedSlugs.includes(tool.slug) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              </button>

              <div>
                <div className="flex items-center space-x-2.5 mb-3 select-none pr-4">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${tool.logo}`}>
                    {tool.name.charAt(0)}
                  </div>
                  <h3 className="text-xs font-bold text-slate-850 truncate flex-1 group-hover:text-indigo-400 transition-colors">
                    {tool.name}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-3">
                  {tool.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  tool.pricing === 'Free' 
                    ? 'bg-emerald-50 text-emerald-605 border border-emerald-100' 
                    : tool.pricing === 'Freemium'
                      ? 'bg-sky-50 text-sky-650 border border-sky-100'
                      : 'bg-rose-50 text-rose-650 border border-rose-100'
                }`}>
                  {tool.pricing}
                </span>
                <span className="text-indigo-600 text-[10px] uppercase font-bold tracking-wider">Specs →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

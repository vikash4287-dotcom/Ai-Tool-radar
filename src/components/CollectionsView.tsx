/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useEffect, useState } from 'react';
import { useRouter } from '../lib/router';
import { dbService } from '../lib/db';
import { Collection, AITool } from '../types';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  ArrowLeft, 
  Sparkles, 
  Check, 
  X, 
  ArrowRight, 
  Award, 
  GraduationCap, 
  Megaphone, 
  Palette, 
  Code, 
  Zap,
  Gift,
  Compass,
  Briefcase,
  Bookmark,
  FolderHeart,
  LogIn,
  Trash2
} from 'lucide-react';

export default function CollectionsView() {
  const { route, navigate } = useRouter();
  const slug = route.params.collectionSlug;

  const collections = useMemo(() => dbService.getCollections(), []);
  const tools = useMemo(() => dbService.getTools(), []);

  // Auth and Personal Bookmarks states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarkedTools, setBookmarkedTools] = useState<AITool[]>([]);
  const [activeTab, setActiveTab] = useState<'curated' | 'bookmarks'>('curated');

  // Load user auth and bookmark favorites list
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usr) => {
      setCurrentUser(usr);
      if (usr) {
        try {
          const bms = await dbService.getBookmarks(usr.uid);
          const allTools = dbService.getTools();
          const matched = allTools.filter(t => bms.includes(t.slug));
          setBookmarkedTools(matched);
        } catch (err) {
          console.error("Error loading bookmarks list:", err);
        }
      } else {
        setBookmarkedTools([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const res = await dbService.loginWithGoogle();
      if (res.user) {
        setLoading(true);
        const bms = await dbService.getBookmarks(res.user.uid);
        const allTools = dbService.getTools();
        const matched = allTools.filter(t => bms.includes(t.slug));
        setBookmarkedTools(matched);
        setLoading(false);
      }
    } catch (e: any) {
      alert(`Authentication failed: ${e.message || e}`);
    }
  };

  const handleRemoveBookmark = async (e: React.MouseEvent, toolSlug: string) => {
    e.stopPropagation(); // Avoid card navigation
    if (!currentUser) return;
    try {
      await dbService.toggleBookmark(currentUser.uid, toolSlug);
      setBookmarkedTools(prev => prev.filter(t => t.slug !== toolSlug));
    } catch (err) {
      alert("Error toggling bookmark. Please check your network connection.");
    }
  };

  // Check if detail collection slug exists
  const activeCol = useMemo(() => {
    return slug ? dbService.getCollectionBySlug(slug) : undefined;
  }, [slug]);

  // Find matching tools for this collection
  const matchedTools = useMemo(() => {
    if (!activeCol) return [];
    
    // Categorize matching based on collection theme
    let filterCategory = '';
    
    if (activeCol.slug.includes('students')) {
      // Students gets: research, education, writing
      return tools.filter(t => ['research', 'education', 'writing'].includes(t.category.toLowerCase())).slice(0, 6);
    }
    if (activeCol.slug.includes('marketing')) {
      return tools.filter(t => t.category.toLowerCase() === 'marketing').slice(0, 6);
    }
    if (activeCol.slug.includes('coding')) {
      return tools.filter(t => t.category.toLowerCase() === 'coding').slice(0, 6);
    }
    if (activeCol.slug.includes('startups')) {
      // Startups gets: productivity, sales, marketing
      return tools.filter(t => ['productivity', 'sales', 'marketing'].includes(t.category.toLowerCase())).slice(0, 6);
    }
    if (activeCol.slug.includes('designers')) {
      return tools.filter(t => t.category.toLowerCase() === 'design').slice(0, 6);
    }
    if (activeCol.slug.includes('free')) {
      // Free tools
      return tools.filter(t => t.pricing === 'Free').slice(0, 8);
    }

    return tools.slice(0, 6);
  }, [activeCol, tools]);

  // Recommended tool payload lookup
  const recommendedTool = useMemo(() => {
    if (!activeCol) return undefined;
    return tools.find(t => t.slug === activeCol.recommendedToolSlug);
  }, [activeCol, tools]);

  // Map icon name to React icons
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className="h-6 w-6" />;
      case 'Megaphone': return <Megaphone className="h-6 w-6" />;
      case 'Code': return <Code className="h-6 w-6" />;
      case 'Zap': return <Zap className="h-6 w-6" />;
      case 'Palette': return <Palette className="h-6 w-6" />;
      case 'Gift': return <Gift className="h-6 w-6" />;
      default: return <Compass className="h-6 w-6" />;
    }
  };

  // Rendering logic for Bookmarks collection view
  const renderBookmarksTab = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <div className="h-8 w-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
          <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider">Syncing secure favorites vault...</span>
        </div>
      );
    }

    if (!currentUser) {
      return (
        <div className="bg-white border border-slate-150 rounded-3xl p-8 md:p-12 text-center max-w-lg mx-auto space-y-6 shadow-sm">
          <div className="h-16 w-16 bg-slate-50 text-indigo-500 rounded-2xl mx-auto flex items-center justify-center border border-slate-100 shadow-inner">
            <Bookmark className="h-8 w-8 text-indigo-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Unlock My Collections</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Curate, save, and bookmark all your favorite verified AI tools into your personalized collection dashboard to design your ultimate AI stacks. Syncs across all devices instantly!
            </p>
          </div>
          <button
            onClick={handleLogin}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg shadow-indigo-100 hover:scale-[1.01] active:scale-95 transition-all text-xs flex items-center justify-center space-x-2.5 mx-auto"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In with Google</span>
          </button>
        </div>
      );
    }

    if (bookmarkedTools.length === 0) {
      return (
        <div className="bg-white border border-slate-150 rounded-3xl p-8 md:p-12 text-center max-w-lg mx-auto space-y-6 shadow-sm">
          <div className="h-16 w-16 bg-pink-50 text-pink-500 rounded-2xl mx-auto flex items-center justify-center border border-pink-100 shadow-inner">
            <FolderHeart className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Your Saved Collection is Empty</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              You haven't bookmarked any AI tools yet. Tap "Save / Bookmark" on details page of any tool to construct your safe stack right here!
            </p>
          </div>
          <button
            onClick={() => navigate('home')}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow hover:scale-[1.01] active:scale-95 transition-all text-xs mx-auto"
          >
            Start Discovering Tools
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-slate-500 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Currently-Tracking {bookmarkedTools.length} Favorite AI Tools
          </span>
          <button
            onClick={() => dbService.logout()}
            className="text-slate-400 hover:text-rose-500 text-[11px] font-bold uppercase tracking-wider transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookmarkedTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => navigate('tool', { slug: tool.slug })}
              className="group bg-white hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 hover:scale-[1.025] active:scale-[0.975] p-6 rounded-2xl border border-slate-150 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-sm relative overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center font-bold text-white shadow-sm ${tool.logo}`}>
                      {tool.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-sm">
                        {tool.name}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">{tool.category}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      tool.pricing === 'Free' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : 'bg-sky-50 text-sky-600 border border-sky-100'
                    }`}>
                      {tool.pricing}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleRemoveBookmark(e, tool.slug)}
                      className="p-1 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                <span className="text-[10px] bg-slate-50 text-slate-500 font-semibold px-2 py-0.5 rounded-md border border-slate-150 flex items-center gap-1">
                  Score: {tool.trendingScore}
                </span>
                <span className="text-indigo-600 font-bold group-hover:translate-x-1 transition-transform flex items-center space-x-0.5">
                  <span>Examine specs</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 1. If NO slugs, render the whole collections directory list
  if (!slug) {
    return (
      <div className="py-6 space-y-10">
        
        <div className="text-center space-y-2 max-w-lg mx-auto">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Curated AI Tool Collections</h1>
          <p className="text-slate-500 text-xs">Explore structured matrices built for specific departments, startup founders, and educational tracks.</p>
        </div>

        {/* Tab Controls for switching: Curated Directories vs My Collections / Bookmarks */}
        <div className="flex justify-center">
          <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
            <button
              onClick={() => setActiveTab('curated')}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'curated'
                  ? 'bg-white text-slate-900 shadow-md border-b border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Compass className="h-4 w-4" />
              <span>Curated Directories</span>
            </button>
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                activeTab === 'bookmarks'
                  ? 'bg-white text-slate-900 shadow-md border-b border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Bookmark className="h-4 w-4" />
              <span>My Collections</span>
              {currentUser && bookmarkedTools.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-black h-4.5 w-4.5 rounded-full flex items-center justify-center shadow">
                  {bookmarkedTools.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {activeTab === 'curated' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((col) => (
              <div
                key={col.id}
                onClick={() => navigate('collections', { collectionSlug: col.slug })}
                className="group bg-white border border-slate-150 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 hover:scale-[1.025] active:scale-[0.975] p-6 rounded-3xl transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center space-x-3.5 mb-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-105 transition-transform border border-indigo-100">
                      {renderIcon(col.icon)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-base">
                        {col.name}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">CURATED MANUAL</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                    {col.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Ref: #{col.id.replace('best-ai-tools-for-', '')}</span>
                  <span className="text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1 font-bold">
                    <span>Browse catalog</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          renderBookmarksTab()
        )}

      </div>
    );
  }

  // 2. Render Single Detail curations
  if (!activeCol) {
    return (
      <div className="py-12 text-center max-w-md mx-auto">
        <h2 className="text-lg font-bold text-slate-800">Collection Presets Not Found</h2>
        <button onClick={() => navigate('collections')} className="mt-4 bg-indigo-600 text-white font-bold text-xs py-2 px-4 rounded-xl">
          Back to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-12">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('collections')}
          className="group text-slate-500 hover:text-indigo-600 text-xs font-semibold flex items-center space-x-1 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Collections</span>
        </button>
      </div>

      {/* Main curation intro */}
      <section className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
            {renderIcon(activeCol.icon)}
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{activeCol.name}</h1>
        </div>
        
        <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
          {activeCol.introduction}
        </p>
      </section>

      {/* Recommended Winner Panel */}
      {recommendedTool && (
        <section className="bg-white border border-indigo-100 rounded-3xl p-6 md:p-8 space-y-4 relative overflow-hidden shadow-xs">
          <div className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full flex items-center space-x-1 shadow-sm">
            <Award className="h-3.5 w-3.5" />
            <span>Radar Recommended Winner</span>
          </div>

          <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block tracking-widest">Featured Goldstar Recommendation</span>
          
          <div className="flex items-center space-x-4">
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-md ${recommendedTool.logo}`}>
              {recommendedTool.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-800">{recommendedTool.name}</h3>
              <p className="text-slate-500 text-xs mt-1">{recommendedTool.description}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
            <span className="text-slate-400 font-bold">Best For: {recommendedTool.bestFor}</span>
            <button
              onClick={() => navigate('tool', { slug: recommendedTool.slug })}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow transition-colors w-full sm:w-auto text-center"
            >
              Examine Specifications
            </button>
          </div>
        </section>
      )}

      {/* Pros & Cons review for collection track */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-slate-100 p-6 rounded-3xl shadow-xs">
        <div className="space-y-3">
          <h4 className="text-emerald-600 font-extrabold text-xs uppercase tracking-wider flex items-center space-x-1.5">
            <Check className="h-4 w-4" /> <span>Overall Advantages</span>
          </h4>
          <ul className="space-y-2 text-slate-600 text-xs leading-relaxed">
            {activeCol.pros.map((p, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-emerald-500 mt-0.5">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-rose-600 font-extrabold text-xs uppercase tracking-wider flex items-center space-x-1.5">
            <X className="h-4 w-4" /> <span>Strategic Drawbacks</span>
          </h4>
          <ul className="space-y-2 text-slate-600 text-xs leading-relaxed">
            {activeCol.cons.map((c, i) => (
              <li key={i} className="flex items-start space-x-2">
                <span className="text-rose-500 mt-1">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Directory Tools cards List */}
      <section className="space-y-6">
        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight border-b border-slate-100 pb-3">
          Reviewed AI Helpers ({matchedTools.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matchedTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => navigate('tool', { slug: tool.slug })}
              className="group bg-white hover:shadow-xl hover:shadow-indigo-500/10 border border-slate-150 hover:border-indigo-200 p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-[1.025] active:scale-[0.975] flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center font-bold text-white shadow-sm ${tool.logo}`}>
                      {tool.name.charAt(0)}
                    </div>
                    <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-sm">
                      {tool.name}
                    </h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    tool.pricing === 'Free' 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                      : 'bg-sky-50 text-sky-600 border border-sky-100'
                  }`}>
                    {tool.pricing}
                  </span>
                </div>

                <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                <span>Best For: {tool.category}</span>
                <span className="text-indigo-600 font-bold group-hover:translate-x-1 transition-transform flex items-center space-x-0.5">
                  <span>View Specs</span>
                  <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

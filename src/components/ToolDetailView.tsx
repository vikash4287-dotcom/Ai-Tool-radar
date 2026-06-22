/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from '../lib/router';
import { dbService } from '../lib/db';
import { AITool } from '../types';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  ArrowLeft, 
  ExternalLink, 
  Check, 
  X, 
  Grid, 
  Tag, 
  TrendingUp, 
  Bookmark, 
  Sparkles, 
  ListTodo,
  Layers,
  Award,
  BookOpen,
  CreditCard
} from 'lucide-react';

export default function ToolDetailView() {
  const { route, navigate } = useRouter();
  const slug = route.params.slug;

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Sync bookmark state with auth session
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (usr) => {
      setCurrentUser(usr);
      if (usr && slug) {
        try {
          const bms = await dbService.getBookmarks(usr.uid);
          setIsBookmarked(bms.includes(slug));
        } catch (e) {
          console.warn('Could not retrieve user bookmarks list', e);
        }
      } else {
        setIsBookmarked(false);
      }
    });
    return () => unsub();
  }, [slug]);

  const handleToggleBookmark = async () => {
    if (!currentUser) {
      if (confirm('Create a free account or Sign In with Google to bookmark AI tools.')) {
        try {
          const res = await dbService.loginWithGoogle();
          if (res.user && slug) {
            const added = await dbService.toggleBookmark(res.user.uid, slug);
            setIsBookmarked(added);
          }
        } catch (e: any) {
          alert(`Authentication cancelled or failed: ${e.message || e}`);
        }
      }
      return;
    }

    if (slug) {
      try {
        const added = await dbService.toggleBookmark(currentUser.uid, slug);
        setIsBookmarked(added);
      } catch (e) {
        alert('Action could not complete. Please check network connection.');
      }
    }
  };

  // Track dynamic tool page views
  useEffect(() => {
    if (slug) {
      dbService.incrementViews(slug);
    }
  }, [slug]);

  const tool = useMemo(() => {
    return slug ? dbService.getToolBySlug(slug) : undefined;
  }, [slug]);

  const tools = useMemo(() => dbService.getTools(), []);

  // Use Case Selection Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'usecases' | 'compare'>('overview');

  const similarTools = useMemo(() => {
    if (!tool) return [];
    return tools
      .filter(t => t.category === tool.category && t.slug !== tool.slug)
      .slice(0, 5);
  }, [tool, tools]);

  if (!tool) {
    return (
      <div className="py-12 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-slate-900">Tool Not Found</h2>
        <p className="text-slate-500 mt-2 text-sm">The tool you are searching might have been deleted, moved, or renamed.</p>
        <button
          onClick={() => navigate('home')}
          className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-5 rounded-xl font-bold text-xs cursor-pointer shadow-xs"
        >
          Return to Directory
        </button>
      </div>
    );
  }

  // Structured Use Cases based on tool category
  const useCases = [
    { title: 'Corporate Workflows', desc: `Utilize ${tool.name} to expedite corporate templates, translate cross-company databases, and summarize multi-page board briefs.` },
    { title: 'Indie Hacking', desc: `Incorporate ${tool.name} to bootstrap early code mocks, create landing page metadata, and launch growth newsletters with near-zero overhead.` },
    { title: 'Academic Exploration', desc: `Use ${tool.name} to analyze primary sources, organize reference lists, write essays, and proofread papers with full precision.` }
  ];

  return (
    <div className="py-6 max-w-5xl mx-auto space-y-10">
      
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate('search')}
          className="group text-slate-500 hover:text-slate-900 text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Discovery</span>
        </button>
      </div>

      {/* Tool Header Showcase */}
      <section className="relative overflow-hidden bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-xs">
        
        {/* Decorative backdrop elements */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
          
          <div className="flex items-start md:items-center space-x-5">
            <div className={`h-20 w-20 shrink-0 rounded-2xl flex items-center justify-center font-extrabold text-3xl text-white shadow-md border border-slate-100 ${tool.logo}`}>
              {tool.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-2">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none mb-1">
                  {tool.name}
                </h1>
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-indigo-50 text-indigo-600 border border-indigo-100`}>
                  {tool.category}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  tool.pricing === 'Free'
                    ? 'bg-emerald-55 text-emerald-700 border border-emerald-100'
                    : tool.pricing === 'Freemium'
                      ? 'bg-sky-50 text-sky-700 border border-sky-100'
                      : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}>
                  {tool.pricing}
                </span>
              </div>

              <p className="text-slate-600 text-sm mt-3 max-w-2xl leading-relaxed font-medium">
                {tool.description}
              </p>

              {/* Counter / hit meta bar */}
              <div className="flex items-center space-x-4 mt-4 text-[11px] text-slate-500">
                <span className="flex items-center space-x-1 font-semibold">
                  <BookOpen className="h-4 w-4 text-emerald-600" />
                  <span>{tool.views} platform views</span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 flex items-center space-x-1 font-semibold">
                  <TrendingUp className="h-4 w-4 text-pink-500" />
                  <span>{tool.trendingScore} Trending Score</span>
                </span>
              </div>

            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
            <a
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-3 px-6 rounded-xl transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center space-x-2 text-center"
            >
              <span>Visit Official Site</span>
              <ExternalLink className="h-4 w-4" />
            </a>
            <button
              onClick={() => navigate('compare', { comparison: `${tool.slug}-vs-` })}
              className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 text-xs py-3 px-6 rounded-xl transition-all flex items-center justify-center space-x-1 text-center cursor-pointer mb-1"
            >
              <span>Compare Tools</span>
            </button>
            <button
              onClick={handleToggleBookmark}
              className={`font-bold border text-xs py-3 px-6 rounded-xl transition-all flex items-center justify-center space-x-2 text-center cursor-pointer ${
                isBookmarked 
                  ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm hover:bg-rose-100' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
              <span>{isBookmarked ? 'Saved to Radar' : 'Save / Bookmark'}</span>
            </button>
          </div>

        </div>
      </section>
      {/* Tabs Menu navigation */}
      <div className="border-b border-slate-100 flex items-center space-x-6 text-sm font-semibold mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 border-b-2 text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'overview' ? 'border-indigo-600 text-indigo-600 font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Detailed Specifications
        </button>
        <button
          onClick={() => setActiveTab('usecases')}
          className={`pb-3 border-b-2 text-xs uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === 'usecases' ? 'border-indigo-600 text-indigo-600 font-extrabold' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Primary Use Cases
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-8">
            
            {/* Pros and Cons Block */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
              <h3 className="font-extrabold text-slate-800 mb-6 text-xs flex items-center space-x-1.5 uppercase tracking-wider">
                <Award className="h-5 w-5 text-indigo-650" />
                <span>Editorial Analysis Overview</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Pros */}
                <div className="space-y-3">
                  <h4 className="text-emerald-700 font-bold text-xs uppercase tracking-wide flex items-center space-x-1.5">
                    <span className="p-1 rounded-full bg-emerald-55 text-emerald-600">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>High Strengths (Pros)</span>
                  </h4>
                  <ul className="space-y-2 text-slate-600 text-xs leading-relaxed font-medium">
                    {tool.pros.map((pro, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-emerald-600 mt-0.5 select-none font-extrabold">✓</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="space-y-3">
                  <h4 className="text-rose-700 font-bold text-xs uppercase tracking-wide flex items-center space-x-1.5">
                    <span className="p-1 rounded-full bg-rose-50 text-rose-600">
                      <X className="h-3.5 w-3.5" />
                    </span>
                    <span>Limitations (Cons)</span>
                  </h4>
                  <ul className="space-y-2 text-slate-600 text-xs leading-relaxed font-medium">
                    {tool.cons.map((con, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-rose-600 mt-0.5 select-none font-extrabold">✗</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>

            {/* In Depth Technical Spec sheet */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 shadow-xs">
              <h3 className="font-extrabold text-slate-800 mb-4 text-xs flex items-center space-x-1.5 uppercase tracking-wider">
                <ListTodo className="h-5 w-5 text-indigo-650" />
                <span>System Specifications</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-slate-400 block pb-1">BEST FOR:</span>
                  <span className="text-slate-750 block font-sans">{tool.bestFor}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-slate-400 block pb-1">KEY STRENGTH:</span>
                  <span className="text-slate-750 block font-sans">{tool.strengths || 'Advanced custom contextual reasoning templates.'}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-slate-400 block pb-1 font-mono">PRIMARY LIMITATION:</span>
                  <span className="text-slate-750 block font-sans">{tool.weaknesses || 'Lacks detailed offline data saving channels.'}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-slate-400 block pb-1 font-mono">WEBSITE URL:</span>
                  <a href={tool.website} target="_blank" rel="noreferrer" className="text-indigo-650 block hover:underline truncate font-sans">{tool.website}</a>
                </div>
              </div>
            </div>

          </div>

          <div className="space-y-6">
            
            {/* Pricing Insights Card */}
            <div className="bg-white border border-slate-101 rounded-3xl p-6 space-y-4 shadow-sm relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-20 h-20 opacity-10 rounded-full blur-xl pointer-events-none ${
                tool.pricing === 'Free' ? 'bg-emerald-500' : tool.pricing === 'Freemium' ? 'bg-sky-500' : 'bg-rose-500'
              }`} />
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-2">
                <span className="p-1 rounded-lg bg-indigo-50 text-indigo-600">
                  <CreditCard className="h-3.5 w-3.5" />
                </span>
                <span>Pricing Insights</span>
              </h4>
              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">Pricing Model</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    tool.pricing === 'Free'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs'
                      : tool.pricing === 'Freemium'
                        ? 'bg-sky-50 text-sky-700 border-sky-200 shadow-2xs'
                        : 'bg-rose-50 text-rose-700 border-rose-200 shadow-2xs'
                  }`}>
                    {tool.pricing}
                  </span>
                </div>
                
                <p className="text-slate-500 text-xs mt-3 leading-relaxed font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                  {tool.pricing === 'Free' && "This tool is 100% free to use with no hidden premium subscriptions, payment thresholds, or credit limits."}
                  {tool.pricing === 'Freemium' && "Hybrid pricing model. Offers free access tiers or complimentary daily credits, with paid upgrades for higher capacity or team features."}
                  {tool.pricing === 'Paid' && "Commercial product requiring a monthly subscription or pay-per-use plan. Often includes a free trial duration for testing purposes."}
                </p>

                {/* Micro-meter for visual budget weight */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                    <span>Budget Profile</span>
                    <span className={
                      tool.pricing === 'Free' ? 'text-emerald-600' : tool.pricing === 'Freemium' ? 'text-sky-600' : 'text-rose-600'
                    }>
                      {tool.pricing === 'Free' ? 'Zero Cost' : tool.pricing === 'Freemium' ? 'Flexible / Low' : 'Premium Tier'}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
                    <div className={`h-full rounded-l-full transition-all ${
                      tool.pricing === 'Free' ? 'w-full bg-emerald-500' : 'w-1/3 bg-slate-200'
                    }`} />
                    <div className={`h-full transition-all ${
                      tool.pricing === 'Freemium' ? 'w-2/3 bg-sky-500 animate-pulse' : tool.pricing === 'Free' ? 'w-0' : 'hidden'
                    }`} />
                    <div className={`h-full rounded-r-full transition-all ${
                      tool.pricing === 'Paid' ? 'w-full bg-rose-500' : 'hidden'
                    }`} />
                  </div>
                </div>

                {/* Bullet details based on properties */}
                <div className="mt-4 space-y-2 text-xs font-semibold">
                  {tool.freePlan && (
                    <div className="flex items-center space-x-2 text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>Complimentary free plan available</span>
                    </div>
                  )}
                  {tool.features.includes('Free Trial') && (
                    <div className="flex items-center space-x-2 text-sky-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-500 shrink-0" />
                      <span>Offers a comprehensive Free Trial version</span>
                    </div>
                  )}
                  {tool.features.includes('Open Source') && (
                    <div className="flex items-center space-x-2 text-indigo-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                      <span>Fully Open Source licensed project</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Features list */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-4 shadow-xs">
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Available Features</h4>
              <div className="space-y-2">
                {['API Available', 'Mobile App', 'Browser Extension', 'Open Source', 'Free Trial'].map(feat => {
                  const hasFeat = tool.features.includes(feat);
                  return (
                    <div key={feat} className="flex items-center justify-between text-xs py-1.5 font-semibold">
                      <span className="text-slate-500">{feat}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        hasFeat ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-50 text-slate-400'
                      }`}>
                        {hasFeat ? 'Supported' : 'No support'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tags card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-4">Metadata Tags</h4>
              <div className="flex flex-wrap gap-2">
                {tool.tags.map(tag => (
                  <span key={tag} className="text-[10px] bg-slate-50 text-indigo-700 py-1.5 px-3 rounded-xl border border-slate-100 uppercase font-mono font-bold tracking-wider">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {activeTab === 'usecases' && (
        <div className="space-y-6 max-w-3xl">
          {useCases.map((uc, i) => (
            <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl space-y-2 shadow-xs">
              <h3 className="font-extrabold text-slate-850 flex items-center space-x-2 text-xs uppercase tracking-wider text-indigo-600">
                <Sparkles className="h-4 w-4" />
                <span>{uc.title}</span>
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">{uc.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Alternatives Section (Carousel) */}
      <section className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Similar AI Alternatives</h3>
            <p className="text-xs text-slate-505">Side-by-side alternative tool recommendations under general {tool.category} fields.</p>
          </div>
          <button
            onClick={() => navigate('search', { category: tool.category })}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <span>Browse All {tool.category}</span>
          </button>
        </div>

        {similarTools.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No alternative suggestions available inside this exact category yet.</p>
        ) : (
          <div className="flex overflow-x-auto gap-4 pb-4 select-none scrollbar-thin scrollbar-thumb-slate-205">
            {similarTools.map((altTool) => (
              <div
                key={altTool.id}
                onClick={() => navigate('tool', { slug: altTool.slug })}
                className="group shrink-0 w-64 bg-slate-50/50 border border-slate-100 hover:border-indigo-200 hover:bg-white p-5 rounded-2xl transition-all cursor-pointer flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-white text-xs ${altTool.logo}`}>
                      {altTool.name.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-sm truncate">
                      {altTool.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-505 leading-relaxed font-medium line-clamp-2">
                    {altTool.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                  <span>Price: {altTool.pricing}</span>
                  <span className="text-indigo-655 uppercase text-[9px]">Check Specs</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}

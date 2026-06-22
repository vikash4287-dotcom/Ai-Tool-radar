/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from '../lib/router';
import { dbService } from '../lib/db';
import { AITool } from '../types';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  TrendingUp, 
  Sparkles, 
  Eye, 
  Calendar, 
  ArrowRight, 
  ChevronRight, 
  Award,
  Crown,
  Play,
  Bookmark
} from 'lucide-react';

export default function TrendingView() {
  const { navigate } = useRouter();
  const tools = useMemo(() => dbService.getTools(), []);

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
          console.warn('Could not sync user bookmarks lists in TrendingView:', e);
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
      console.error("Error toggling trending card bookmark:", err);
    }
  };

  // Tabs layout: today, weekly, new, most-viewed
  const [activeTab, setActiveTab ] = useState<'today' | 'weekly' | 'new' | 'viewed'>('today');

  // Math-curation:
  // Today's trending: sorted by trending score
  const todayTrending = useMemo(() => {
    return [...tools].sort((a, b) => b.trendingScore - a.trendingScore).slice(0, 10);
  }, [tools]);

  // Weekly trending: sorted by trending score + small multiplier
  const weeklyTrending = useMemo(() => {
    return [...tools].sort((a, b) => (b.trendingScore * 1.25) - (a.trendingScore * 1.25)).slice(0, 10);
  }, [tools]);

  // Recently added: sorted by date
  const recentlyAdded = useMemo(() => {
    return [...tools].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);
  }, [tools]);

  // Most Viewed: sorted by views
  const mostViewed = useMemo(() => {
    return [...tools].sort((a, b) => b.views - a.views).slice(0, 10);
  }, [tools]);

  const activeToolsList = useMemo(() => {
    switch (activeTab) {
      case 'today': return todayTrending;
      case 'weekly': return weeklyTrending;
      case 'new': return recentlyAdded;
      case 'viewed': return mostViewed;
    }
  }, [activeTab, todayTrending, weeklyTrending, recentlyAdded, mostViewed]);

  const getMetricLabel = (tool: AITool, index: number) => {
    if (activeTab === 'today') {
      return (
        <span className="bg-pink-50 text-pink-700 font-bold text-[10px] py-1 px-2.5 rounded-full border border-pink-100 flex items-center space-x-1 shadow-2xs">
          <TrendingUp className="h-3 w-3 text-pink-500" />
          <span>{tool.trendingScore} Score</span>
        </span>
      );
    }
    if (activeTab === 'weekly') {
      return (
        <span className="bg-indigo-55 text-indigo-700 font-bold text-[10px] py-1 px-2.5 rounded-full border border-indigo-100 flex items-center space-x-1 shadow-2xs">
          <Award className="h-3 w-3 text-indigo-500" />
          <span>{Math.floor(tool.trendingScore * 1.25)} Week Rank</span>
        </span>
      );
    }
    if (activeTab === 'new') {
      return (
        <span className="bg-emerald-50 text-emerald-700 font-bold text-[10px] py-1 px-2.5 rounded-full border border-emerald-100 flex items-center space-x-1 shadow-2xs">
          <Calendar className="h-3 w-3 text-emerald-500" />
          <span>{new Date(tool.createdAt).toLocaleDateString()}</span>
        </span>
      );
    }
    return (
      <span className="bg-sky-50 text-sky-700 font-bold text-[10px] py-1 px-2.5 rounded-full border border-sky-100 flex items-center space-x-1 shadow-2xs">
        <Eye className="h-3 w-3 text-sky-500" />
        <span>{tool.views} Hits</span>
      </span>
    );
  };

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-10">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="p-3 bg-pink-50 text-pink-600 rounded-full inline-flex mb-1 border border-pink-100">
          <TrendingUp className="h-6 w-6 animate-pulse" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">AI Tools Leaderboard</h1>
        <p className="text-slate-505 text-xs max-w-sm mx-auto">Discover which tools are capturing developers, creatives, and student mindshares today.</p>
      </div>

      {/* Leaderboard tabs */}
      <div className="flex items-center justify-center border-b border-slate-100 text-slate-500 text-xs font-semibold tracking-wide gap-3 md:gap-4">
        {[
          { id: 'today', label: 'Trending Today', icon: TrendingUp },
          { id: 'weekly', label: 'Trending This Week', icon: Award },
          { id: 'new', label: 'Recently Added', icon: Sparkles },
          { id: 'viewed', label: 'Most Viewed', icon: Eye }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-1.5 px-3 md:px-5 pb-3 border-b-2 text-[10px] md:text-xs uppercase transition-all outline-none cursor-pointer ${
                isActive 
                  ? 'border-pink-500 text-pink-600 font-extrabold scale-[1.02]' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Leaderboard Table Rows */}
      <section className="bg-white border border-slate-101 rounded-3xl overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-100">
          {activeToolsList.map((tool, index) => {
            const rank = index + 1;
            const isTopThree = rank <= 3;
            return (
              <div
                key={tool.id}
                onClick={() => navigate('tool', { slug: tool.slug })}
                className="group relative flex items-center justify-between p-5 hover:bg-slate-50/50 transition-all cursor-pointer gap-4"
              >
                
                {/* Left side Metadata */}
                <div className="flex items-center space-x-4">
                  {/* Rank Indicator */}
                  <div className="w-8 shrink-0 text-center font-bold text-sm">
                    {isTopThree ? (
                      <span className={`text-lg font-extrabold ${
                        rank === 1 ? 'text-amber-500' : rank === 2 ? 'text-slate-400' : 'text-amber-600'
                      }`}>
                        #{rank}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">#{rank}</span>
                    )}
                  </div>

                  {/* Logo spec */}
                  <div className={`h-11 w-11 shrink-0 rounded-xl flex items-center justify-center font-black text-white text-base shadow-sm ${tool.logo}`}>
                    {tool.name.charAt(0)}
                  </div>

                  {/* Name and Tags */}
                  <div>
                    <div className="flex items-center flex-wrap gap-2">
                      <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 text-sm transition-colors md:text-base">
                        {tool.name}
                      </h3>
                      {tool.featured && (
                        <span className="bg-amber-50 text-amber-600 text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-amber-100 flex items-center space-x-0.5 shadow-2xs">
                          <Crown className="h-2 w-2" />
                          <span>Elite</span>
                        </span>
                      )}
                      <span className="text-[9px] font-mono font-bold uppercase text-slate-400 bg-slate-50 border border-slate-100 py-0.5 px-2 rounded">
                        {tool.category}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        tool.pricing === 'Free' 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                          : tool.pricing === 'Freemium'
                            ? 'bg-sky-50 text-sky-600 border border-sky-100'
                            : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                        {tool.pricing}
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-1 max-w-sm sm:max-w-md lg:max-w-xl">
                      {tool.description}
                    </p>
                  </div>
                </div>

                {/* Right side metric, bookmark button and chevron */}
                <div className="flex items-center space-x-4 shrink-0">
                  {getMetricLabel(tool, index)}
                  
                  {/* Bookmark Button */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleCardBookmark(e, tool.slug)}
                    className="p-2 rounded-xl text-slate-350 hover:text-rose-500 hover:bg-rose-50 border border-slate-100 transition-all z-10 bg-white shadow-2xs hover:scale-105"
                    title={bookmarkedSlugs.includes(tool.slug) ? "Remove Bookmark" : "Save / Bookmark tool"}
                  >
                    <Bookmark className={`h-4 w-4 ${bookmarkedSlugs.includes(tool.slug) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                  </button>

                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>

              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}

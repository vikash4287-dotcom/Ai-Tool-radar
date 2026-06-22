/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useRouter } from '../lib/router';
import { 
  Compass, 
  Layers, 
  TrendingUp, 
  Shuffle, 
  Code, 
  Settings, 
  Search, 
  Menu, 
  X, 
  Zap,
  ArrowLeftRight
} from 'lucide-react';

export default function Navigation() {
  const { route, navigate } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const navItems = [
    { label: 'Discover', page: 'home', icon: Compass },
    { label: 'Trending', page: 'trending', icon: TrendingUp },
    { label: 'Collections', page: 'collections', icon: Layers },
    { label: 'Compare', page: 'compare', icon: ArrowLeftRight },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate('search', { query: searchVal.trim() });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('home')}>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                <Zap className="h-5 w-5 text-white animate-pulse" />
              </div>
              <span className="text-xl font-bold font-sans tracking-tight text-slate-800">
                AI Tools Radar
              </span>
              <span className="hidden sm:inline bg-indigo-50 text-indigo-600 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border border-indigo-100">
                India MVP
              </span>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search problem, tool, profession..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 pl-10 pr-4 py-2 rounded-full border border-slate-200 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 text-sm"
              />
              <button
                type="submit"
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-650 transition-colors flex items-center justify-center pointer-events-auto"
                title="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = route.page === item.page;
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.page as any)}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => navigate('admin')}
              className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                route.page === 'admin'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-4 space-y-3">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search tools, problems, roles..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-650 transition-colors flex items-center justify-center pointer-events-auto"
              title="Search"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = route.page === item.page;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.page as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => {
                navigate('admin');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                route.page === 'admin'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

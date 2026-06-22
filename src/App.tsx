/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import SearchResultsView from './components/SearchResultsView';
import ToolDetailView from './components/ToolDetailView';
import CompareView from './components/CompareView';
import CollectionsView from './components/CollectionsView';
import TrendingView from './components/TrendingView';
import AdminPanelView from './components/AdminPanelView';

import { RouterContext, parseHash, formatHash, PageType } from './lib/router';
import { motion, AnimatePresence } from 'motion/react';
import { useHeadMetadata } from './hooks/useHeadMetadata';

export default function App() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  const [dbTick, setDbTick] = useState(0);

  // Dynamically update head metadata, titles, descriptions, and OG tags
  useHeadMetadata(route);

  // Sync state with live Firestore actions
  useEffect(() => {
    const handleUpdate = () => {
      setDbTick(prev => prev + 1);
    };
    window.addEventListener('db-updated', handleUpdate);
    return () => window.removeEventListener('db-updated', handleUpdate);
  }, []);

  // Capture hash change events from browser routing
  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHash(window.location.hash));
      // Scroll to top on route change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page: PageType, params?: any) => {
    window.location.hash = formatHash(page, params);
  };

  const renderActivePage = () => {
    switch (route.page) {
      case 'home':
        return <HomeView />;
      case 'search':
        return <SearchResultsView />;
      case 'tool':
        return <ToolDetailView />;
      case 'compare':
        return <CompareView />;
      case 'collections':
        return <CollectionsView />;
      case 'trending':
        return <TrendingView />;
      case 'admin':
        return <AdminPanelView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <RouterContext.Provider value={{ route, navigate }}>
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-600/10 selection:text-indigo-900">
        
        {/* Navigation Sticky Bar */}
        <Navigation />

        {/* Core Main View Section with Staggered Framer Motion Entrance */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={route.page + (route.params.slug || route.params.collectionSlug || route.params.comparison || '')}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {renderActivePage()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Curated Gen Z styled Footer Component */}
        <Footer />
        
      </div>
    </RouterContext.Provider>
  );
}

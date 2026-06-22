/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from '../lib/router';
import { safeLocalStorage } from '../lib/db';
import { Sparkles, Calendar, Github, Heart, Mail, Check, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Footer() {
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(null);
  const [error, setError] = useState('');

  // Hydrate subscription state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = safeLocalStorage.getItem('ai_radar_newsletter_email');
      if (stored) {
        setSubscribedEmail(stored);
      }
    }
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Quick regex validation for input emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError('Please provide an email address.');
      return;
    }
    if (!emailRegex.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    setIsSubmitting(true);

    // Simulate standard fast-responding server submission
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      safeLocalStorage.setItem('ai_radar_newsletter_email', email);
      setSubscribedEmail(email);
      setEmail('');
    } catch (err) {
      setError('Unable to store preferences. Local storage disabled.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnsubscribe = () => {
    safeLocalStorage.removeItem('ai_radar_newsletter_email');
    setSubscribedEmail(null);
    setError('');
  };

  return (
    <footer className="bg-white border-t border-slate-100 py-12 mt-16 text-slate-500 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand block */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-slate-800 tracking-tight cursor-pointer" onClick={() => navigate('home')}>AI Tools Radar</span>
              <span className="bg-indigo-50 text-indigo-600 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-indigo-100">
                MVP
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed text-xs">
              Discover the right AI tool in seconds. The definitive directory styled for the new wave of software builders, creators, and students. Developed with pixel perfection.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-slate-800 font-bold mb-3 text-xs uppercase tracking-wider">Explore Radar</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <button onClick={() => navigate('home')} className="hover:text-indigo-600 transition-colors cursor-pointer">
                  Directory Home
                </button>
              </li>
              <li>
                <button onClick={() => navigate('trending')} className="hover:text-indigo-600 transition-colors cursor-pointer">
                  Trending Today
                </button>
              </li>
              <li>
                <button onClick={() => navigate('collections')} className="hover:text-indigo-600 transition-colors cursor-pointer">
                  Curated Collections
                </button>
              </li>
              <li>
                <button onClick={() => navigate('compare')} className="hover:text-indigo-600 transition-colors cursor-pointer">
                  Side-by-Side Comparisons
                </button>
              </li>
            </ul>
          </div>

          {/* Architecture Preps */}
          <div>
            <h4 className="text-slate-800 font-bold mb-3 text-xs uppercase tracking-wider">Upcoming Features</h4>
            <div className="space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-700"></span>
                <span>User profiles & Custom ratings</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-700"></span>
                <span>Product Hunt live API sync</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-700"></span>
                <span>Bookmarks & Saved custom lists</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-700"></span>
                <span>Gemini API dynamic recommendations</span>
              </div>
            </div>
          </div>

          {/* Newsletter / Contact subscriber signup */}
          <div className="space-y-3">
            <h4 className="text-slate-800 font-bold text-xs uppercase tracking-wider">Weekly Updates</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              Join 5,000+ creators receiving our weekly digest of hot AI releases, side-by-side spec sheets, and vetted workflow templates.
            </p>

            <AnimatePresence mode="wait">
              {subscribedEmail ? (
                <motion.div
                  key="subscribed-state"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 space-y-2"
                >
                  <div className="flex items-start space-x-2">
                    <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-emerald-800 font-semibold text-xs leading-tight">Radar subscription active!</p>
                      <p className="text-[10px] text-emerald-600 font-mono truncate max-w-[180px]" title={subscribedEmail}>
                        {subscribedEmail}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleUnsubscribe}
                    className="text-[10px] text-slate-400 hover:text-slate-600 font-mono underline block transition-colors cursor-pointer"
                  >
                    Unsubscribe / Change Email
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form-state"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSubscribe}
                  className="space-y-2"
                >
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="cooper@gatech.edu"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      className="bg-slate-50 border border-slate-200 focus:bg-white text-slate-800 placeholder-slate-400 rounded-lg py-2.5 pl-3 pr-10 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 w-full transition-all"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="absolute right-1.5 top-1.5 text-indigo-500 hover:text-indigo-600 disabled:opacity-50 transition-colors p-1"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Mail className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                  {error && (
                    <p className="text-[10px] text-rose-500 font-mono leading-none">{error}</p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>

            <div className="pt-1 flex items-center space-x-2 text-slate-400 text-[11px] font-mono">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Launched June 2026</span>
            </div>
          </div>

        </div>

        {/* Legal divider */}
        <div className="border-t border-slate-100 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center space-x-1">
            <span>© 2026 AI Tools Radar India. Crafted with</span>
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
            <span>for early builders.</span>
          </div>
          <div className="flex space-x-4">
            <button onClick={() => navigate('privacy')} className="hover:text-indigo-600 transition-all cursor-pointer">Privacy Policy</button>
            <button onClick={() => navigate('terms')} className="hover:text-indigo-600 transition-all cursor-pointer">Terms of Service</button>
            <button onClick={() => navigate('support')} className="hover:text-indigo-600 transition-all cursor-pointer">Contact Support</button>
          </div>
        </div>

      </div>
    </footer>
  );
}

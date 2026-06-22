/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useRouter } from '../lib/router';
import { ArrowLeft, Mail, AlertCircle, MessageSquare, Send, CheckCircle2, Heart } from 'lucide-react';

export default function SupportView() {
  const { navigate } = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Query', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name) {
      setErrorMsg('Please state your name.');
      return;
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMsg('Please state a valid email address.');
      return;
    }
    if (!formData.message || formData.message.length < 10) {
      setErrorMsg('Please describe your support request in at least 10 characters.');
      return;
    }

    setIsSubmitting(true);

    // Simulate sending support request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', subject: 'General Query', message: '' });
    }, 1200);
  };

  return (
    <div className="py-8 max-w-4xl mx-auto px-4" id="contact-support-view">
      {/* Back Button & Header */}
      <button
        onClick={() => navigate('home')}
        className="group mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm transition-colors cursor-pointer"
        id="support-back-btn"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Directory
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Info Channels */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="space-y-1.5">
              <span className="text-xs font-bold font-mono tracking-wider uppercase bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded-full inline-block">
                Hotline
              </span>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">Support Channels</h2>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              {/* Direct email display with copy */}
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-indigo-600">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="font-semibold text-slate-800">Support Email</span>
                </div>
                <p className="text-slate-500 font-mono text-[11px] leading-relaxed">
                  For immediate assistance, listing submissions, or delete requests:
                </p>
                <a
                  href="mailto:influbuz@gmail.com"
                  className="block text-xs font-bold font-mono text-indigo-600 hover:text-indigo-850 underline truncate"
                >
                  influbuz@gmail.com
                </a>
              </div>

              {/* Status checklist */}
              <div className="space-y-2.5 pt-2">
                <p className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">Average Response Times</p>
                <div className="flex items-start gap-2">
                  <div className="h-4 w-4 rounded bg-indigo-50 flex items-center justify-center text-indigo-600 text-[9px] font-mono shrink-0 mt-0.5">1</div>
                  <p className="leading-tight"><strong className="text-slate-700">Listing requests:</strong> Vetted and published within 24–48 hours.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-4 w-4 rounded bg-indigo-50 flex items-center justify-center text-indigo-600 text-[9px] font-mono shrink-0 mt-0.5">2</div>
                  <p className="leading-tight"><strong className="text-slate-700">Technical Bugs:</strong> Escalated to developers in 12 hours.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-4 w-4 rounded bg-indigo-50 flex items-center justify-center text-indigo-600 text-[9px] font-mono shrink-0 mt-0.5">3</div>
                  <p className="leading-tight"><strong className="text-slate-700">General Help:</strong> Handled same business day.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-950 text-white rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5 text-indigo-200">
              <Heart className="h-4 w-4 text-rose-400 fill-rose-400" />
              Community Vibe
            </h3>
            <p className="text-[11px] text-indigo-200/80 leading-relaxed">
              AI Tools Radar is independent, powered by student and creator indexing lists. 
              If you spotted a broken link, stale pricing, or mismatch, drop a line and help the matrix stay golden!
            </p>
          </div>
        </div>

        {/* Right Side: Interactive Request Form */}
        <div className="md:col-span-2">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <MessageSquare className="h-5 w-5" />
                <span className="font-semibold text-xs uppercase tracking-wider font-mono">Interactive Support Hub</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Contact Support</h1>
              <p className="text-slate-500 text-xs mt-1">
                Fill in the query form below, or reach out directly at <strong className="font-mono text-indigo-600">influbuz@gmail.com</strong>.
              </p>
            </div>

            {isSuccess ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center space-y-4 my-4" id="support-success-msg">
                <div className="flex justify-center">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-emerald-900 font-bold text-base">Message Received!</h3>
                  <p className="text-emerald-700 text-xs leading-relaxed max-w-md mx-auto">
                    Your support inquiry was validated successfully. Our moderator team will reach out to you within the next standard 24-hour cycle.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer shadow"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" id="support-query-form">
                {errorMsg && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs rounded-xl p-4 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-slate-700 font-semibold text-xs uppercase tracking-wider" htmlFor="support-form-name">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="support-form-name"
                      name="name"
                      placeholder="e.g. Cooper"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-slate-700 font-semibold text-xs uppercase tracking-wider" htmlFor="support-form-email">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="support-form-email"
                      name="email"
                      placeholder="e.g. cooper@gatech.edu"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-700 font-semibold text-xs uppercase tracking-wider" htmlFor="support-form-subject">
                    Subject / Topic Area
                  </label>
                  <select
                    id="support-form-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all"
                  >
                    <option value="General Query">General Query</option>
                    <option value="Submit Tool Addition">Submit Tool Addition</option>
                    <option value="Broken Hyperlink/Details Error">Broken Hyperlink / Details Error</option>
                    <option value="Remove My Account / Bookmarks">Remove My Account / Bookmarks</option>
                    <option value="Joint Venture / Advertising Info">Partnership / Advertising</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-slate-700 font-semibold text-xs uppercase tracking-wider" htmlFor="support-form-message">
                    Inquiry Details
                  </label>
                  <textarea
                    id="support-form-message"
                    name="message"
                    rows={5}
                    placeholder="Describe your question or request in detail..."
                    value={formData.message}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition-all resize-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-5 py-3 rounded-xl text-xs transition-all tracking-wider uppercase active:scale-95 shadow-md hover:shadow-lg hover:shadow-indigo-500/10"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        Send Support Ticket
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

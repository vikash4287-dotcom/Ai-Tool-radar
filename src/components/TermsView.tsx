/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useRouter } from '../lib/router';
import { ArrowLeft, FileText, Scale, HelpCircle, CheckCircle, AlertTriangle } from 'lucide-react';

export default function TermsView() {
  const { navigate } = useRouter();

  return (
    <div className="py-8 max-w-4xl mx-auto px-4" id="terms-of-service-view">
      {/* Back Button & Header */}
      <button
        onClick={() => navigate('home')}
        className="group mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm transition-colors cursor-pointer"
        id="terms-back-btn"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Directory
      </button>

      <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm space-y-10">
        <div className="border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3 text-indigo-600 mb-3">
            <Scale className="h-8 w-8" />
            <span className="text-xs font-bold font-mono tracking-wider uppercase bg-indigo-50 px-2.5 py-1 rounded-full">
              User Agreement
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Terms of Service</h1>
          <p className="text-slate-400 text-xs mt-2 font-mono">Last Updated: June 22, 2026</p>
        </div>

        {/* Introduction */}
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed text-sm">
            Thank you for using <strong>AI Tools Radar</strong>. These Terms of Service ("Agreement") govern your access to and use of our live AI directory, index list, comparison matrix helper, and synced bookmarks system.
          </p>
          <p className="text-slate-600 leading-relaxed text-sm">
            By visiting our website, creating an account via Google sign in, subscribing to our weekly releases, or bookmarking catalog items, you agree to be bound by these Terms.
          </p>
        </div>

        {/* Section 1: Usage License & Permitted Action */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-slate-800 font-semibold text-lg">
            <CheckCircle className="h-5 w-5 text-indigo-600 shrink-0" />
            <h2>1. Permitted Use</h2>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">
            AI Tools Radar grants users a non-exclusive, non-transferable, revocable license to access, search, filter, and compare the public AI tool catalog for general, research, commercial, academic, or professional decision-making purposes. Automated scraping, crawler spamming, or server overload scripts are strictly prohibited.
          </p>
        </div>

        {/* Section 2: Catalog Accuracy & External Links */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-slate-800 font-semibold text-lg">
            <AlertTriangle className="h-5 w-5 text-indigo-600 shrink-0" />
            <h2>2. No Warranty / Catalog Disclaimer</h2>
          </div>
          <div className="text-slate-600 space-y-3 text-sm leading-relaxed">
            <p>
              We aim for pixel-perfect reliability, but:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Price Tiers & Specs:</strong> Listed pricing parameters, premium trial features, pros, and cons estimates are subject to immediate revision by primary developers. We guarantee no immediate specs accuracy.
              </li>
              <li>
                <strong>Affiliated Outbound Links:</strong> Clicking button hyperlinks redirects users to external software suppliers. We do not validate, endorse, or assume legal liability for third-party scripts, platform security, or service purchases.
              </li>
            </ul>
          </div>
        </div>

        {/* Section 3: User Accounts & Firebases Synergies */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-slate-800 font-semibold text-lg">
            <FileText className="h-5 w-5 text-indigo-600 shrink-0" />
            <h2>3. Account Conduct & Content</h2>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">
            When syncing bookmarks through Google authentication, you keep absolute liability for keeping your system credentials secure. AI Tools Radar remains fully authorized to terminate inactive profiles, remove spam submissions, and prune database artifacts as requested for security reasons.
          </p>
        </div>

        {/* Section 4: Contact & Governing Jurisdiction */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-slate-800 font-semibold text-lg">
            <HelpCircle className="h-5 w-5 text-indigo-600 shrink-0" />
            <h2>4. Questions or Termination Requests</h2>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">
            For operational directory queries, legal concerns, or general inquiries under this agreement, please refer to our support channels or submit an email notice directly to{' '}
            <a href="mailto:influbuz@gmail.com" className="font-mono underline font-semibold text-indigo-600 hover:text-indigo-800">
              influbuz@gmail.com
            </a>
            .
          </p>
        </div>

        {/* Bottom Banner */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-slate-500 text-xs leading-relaxed">
          AI Tools Radar India reserves the right to modify these terms at any time. We will indicate revisions in the "Last Updated" metadata container visible above. Continuing access following layout changes signifies active agreement with our current protocols.
        </div>
      </div>
    </div>
  );
}

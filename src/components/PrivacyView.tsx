/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useRouter } from '../lib/router';
import { ArrowLeft, Shield, Lock, Eye, Database, Globe } from 'lucide-react';

export default function PrivacyView() {
  const { navigate } = useRouter();

  return (
    <div className="py-8 max-w-4xl mx-auto px-4" id="privacy-policy-view">
      {/* Back Button & Header */}
      <button
        onClick={() => navigate('home')}
        className="group mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm transition-colors cursor-pointer"
        id="privacy-back-btn"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Directory
      </button>

      <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm space-y-10">
        <div className="border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3 text-indigo-600 mb-3">
            <Shield className="h-8 w-8" />
            <span className="text-xs font-bold font-mono tracking-wider uppercase bg-indigo-50 px-2.5 py-1 rounded-full">
              Legal Directive
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Privacy Policy</h1>
          <p className="text-slate-400 text-xs mt-2 font-mono">Last Updated: June 22, 2026</p>
        </div>

        {/* Introduction */}
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed text-sm">
            Welcome to <strong>AI Tools Radar</strong>. We are committed to protecting your privacy and security. 
            This Privacy Policy explains how we collect, store, handle, and secure information when you interact with our AI directory platform, persistent bookmarks services, and support communications.
          </p>
        </div>

        {/* Section 1: Information We Collect */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-slate-800 font-semibold text-lg">
            <Lock className="h-5 w-5 text-indigo-600 shrink-0" />
            <h2>1. Information We Collect</h2>
          </div>
          <div className="text-slate-600 space-y-3 text-sm leading-relaxed">
            <p>
              To provide a synchronized curated experience, we collect only the necessary details:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Account Credentials:</strong> If you sign in via Google Authentication, we securely record your user ID, display name, public profile URL, and email address to manage your secure collection database.
              </li>
              <li>
                <strong>Platform Usage Data:</strong> We register counts of tool detail views, comparative parameters requests, and search queries (storing no identity attachments) to compute global scores for our "Trending Today" metric.
              </li>
              <li>
                <strong>Bookmarks & Saved Lists:</strong> User-initiated bookmark records mapping specific AI tool slugs to your account uid are written directly to your secure Firestore container.
              </li>
            </ul>
          </div>
        </div>

        {/* Section 2: How We Use Your Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-slate-800 font-semibold text-lg">
            <Eye className="h-5 w-5 text-indigo-600 shrink-0" />
            <h2>2. How We Use Your Information</h2>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">
            We use your collected parameters strictly for functional directory features:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-600 text-sm leading-relaxed">
            <li>Syncing bookmarked AI tools across multiple desktop or mobile sessions.</li>
            <li>Enabling newsletter newsletters delivery options upon explicit user subscription models.</li>
            <li>Updating statistics on trending products without using target profile details or ad brokers.</li>
          </ul>
        </div>

        {/* Section 3: Data Integrity and Hosting */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-slate-800 font-semibold text-lg">
            <Database className="h-5 w-5 text-indigo-600 shrink-0" />
            <h2>3. Security & Cloud Hosting</h2>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">
            All server-side queries and database instances are provisioned within secure cloud environments. 
            We implement standard encrypted handshakes, strict database security directives, and multi-factor firewalls to avoid unauthorized read or write access to user information.
          </p>
        </div>

        {/* Section 4: Cookies & Third-Party Actions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-slate-800 font-semibold text-lg">
            <Globe className="h-5 w-5 text-indigo-600 shrink-0" />
            <h2>4. Cookies & Analytics</h2>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">
            We utilize standard browser <code>localStorage</code> cache storage to persist client UI preferences (such as newsletter subscription flags and recent searches). We do not implement intrusive advertising cookies, behavioral tracking scripts, or pixel trackers.
          </p>
        </div>

        {/* Footer Contact Directive */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-2 mt-8">
          <h3 className="font-bold text-indigo-900 text-sm">Have any privacy questions?</h3>
          <p className="text-indigo-800 text-xs leading-relaxed">
            If you wish to request full deletion of your synced bookmarks, account records, or associated user information patterns, please head to our Support details or email us directly at{' '}
            <a href="mailto:influbuz@gmail.com" className="font-mono underline font-semibold hover:text-indigo-905">
              influbuz@gmail.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

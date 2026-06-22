/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from '../lib/router';
import { dbService } from '../lib/db';
import { AITool } from '../types';
import { 
  ArrowLeftRight, 
  Check, 
  X, 
  HelpCircle, 
  Zap, 
  Award, 
  Lightbulb,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function CompareView() {
  const { route, navigate } = useRouter();
  const tools = useMemo(() => dbService.getTools(), []);

  // Parse comparison params from URL, e.g., "chatgpt-vs-claude"
  const urlComparison = route.params.comparison || '';
  const [toolASlug, setToolASlug] = useState('');
  const [toolBSlug, setToolBSlug] = useState('');

  // Sync URL state on load / route update
  useEffect(() => {
    if (urlComparison) {
      const parts = urlComparison.split('-vs-');
      if (parts[0]) setToolASlug(parts[0]);
      if (parts[1]) setToolBSlug(parts[1]);
    } else {
      // Defaults on empty compare page
      setToolASlug('chatgpt');
      setToolBSlug('claude');
    }
  }, [urlComparison]);

  const toolA = useMemo(() => tools.find(t => t.slug === toolASlug), [toolASlug, tools]);
  const toolB = useMemo(() => tools.find(t => t.slug === toolBSlug), [toolBSlug, tools]);

  // Update route hash when selection shifts
  const updateComparisonHash = (slugA: string, slugB: string) => {
    navigate('compare', { comparison: `${slugA || ''}-vs-${slugB || ''}` });
  };

  const handleToolAChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextSlug = e.target.value;
    setToolASlug(nextSlug);
    updateComparisonHash(nextSlug, toolBSlug);
  };

  const handleToolBChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextSlug = e.target.value;
    setToolBSlug(nextSlug);
    updateComparisonHash(toolASlug, nextSlug);
  };

  // Switch/Swap tools
  const handleSwap = () => {
    setToolASlug(toolBSlug);
    setToolBSlug(toolASlug);
    updateComparisonHash(toolBSlug, toolASlug);
  };

  // High-fidelity Verdict / Winner Recommendation algorithm
  // Computed dynamically based on views, pricing model completeness and features
  const verdict = useMemo(() => {
    if (!toolA || !toolB) return { winner: null, text: 'Select two tools to generate comparisons.' };

    if (toolA.slug === toolB.slug) {
      return { winner: null, text: 'Choose two separate AI tools to display differences.' };
    }

    let scoreA = 0;
    let scoreB = 0;

    // Pricing scoring: Free > Freemium > Paid
    const pricingScores = { 'Free': 3, 'Freemium': 2, 'Paid': 1 };
    scoreA += pricingScores[toolA.pricing] || 0;
    scoreB += pricingScores[toolB.pricing] || 0;

    // Feature scoring
    scoreA += toolA.features.length * 0.5;
    scoreB += toolB.features.length * 0.5;

    // Popularity scoring (Views)
    if (toolA.views > toolB.views) scoreA += 1;
    else if (toolB.views > toolA.views) scoreB += 1;

    const winnerName = scoreA >= scoreB ? toolA.name : toolB.name;
    const strengthA = toolA.strengths || 'Excellent versatile capabilities';
    const strengthB = toolB.strengths || 'Incredibly high-quality outputs';

    let text = '';
    if (scoreA >= scoreB) {
      text = `We recommend ${toolA.name} for general users because it offers a highly complete balance of features, superior popularity rankings (${toolA.views} views), and a robust ${toolA.pricing} model. However, choose ${toolB.name} if you are looking specifically for ${toolB.bestFor}.`;
    } else {
      text = `We recommend ${toolB.name} as the preferred choice, offering an exceptional value proposition under the ${toolB.pricing} pricing model. It excels significantly in: "${strengthB}". However, choose ${toolA.name} if your workflow prioritizes: "${strengthA}".`;
    }

    return {
      winner: scoreA >= scoreB ? toolA : toolB,
      text
    };
  }, [toolA, toolB]);

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-10">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full inline-flex mb-2 border border-indigo-100">
          <ArrowLeftRight className="h-6 w-6 animate-pulse" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Side-by-Side Comparison</h1>
        <p className="text-slate-500 text-xs max-w-md mx-auto">Analyze specs, pros, features, and verdicts to select your next stack component.</p>
      </div>

      {/* Select Box Grid Selector */}
      <div className="bg-white border border-slate-100 shadow-xs rounded-3xl p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Tool A select dropdown */}
          <div className="w-full md:w-5/12 space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Compare Tool A</label>
            <select
              value={toolASlug}
              onChange={handleToolAChange}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold py-3 px-4 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none"
            >
              {tools.map(tool => (
                <option key={tool.id} value={tool.slug}>{tool.name} ({tool.category})</option>
              ))}
            </select>
          </div>

          {/* Swap Indicator */}
          <button
            onClick={handleSwap}
            className="p-3 bg-slate-50 border border-slate-200 hover:bg-slate-300 text-slate-600 rounded-full transition-all cursor-pointer rotate-90 md:rotate-0"
            title="Swap positions"
          >
            <ArrowLeftRight className="h-5 w-5" />
          </button>

          {/* Tool B select dropdown */}
          <div className="w-full md:w-5/12 space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Compare Tool B</label>
            <select
              value={toolBSlug}
              onChange={handleToolBChange}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm font-bold py-3 px-4 rounded-xl focus:bg-white focus:border-indigo-500 focus:outline-none"
            >
              {tools.map(tool => (
                <option key={tool.id} value={tool.slug}>{tool.name} ({tool.category})</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Comparison Grid Sheet */}
      {toolA && toolB ? (
        <div className="space-y-8">
          
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs">
            <table className="w-full border-collapse text-left text-xs bg-white">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 font-bold uppercase text-slate-400 w-1/4">Specs / Features</th>
                  <th className="p-4 text-sm font-extrabold text-indigo-600 w-3/8 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start space-x-2">
                      <div className={`h-6 w-6 rounded text-[10px] font-bold text-white flex items-center justify-center shadow-xs ${toolA.logo}`}>
                        {toolA.name.charAt(0)}
                      </div>
                      <span>{toolA.name}</span>
                    </div>
                  </th>
                  <th className="p-4 text-sm font-extrabold text-rose-600 w-3/8 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start space-x-2">
                      <div className={`h-6 w-6 rounded text-[10px] font-bold text-white flex items-center justify-center shadow-xs ${toolB.logo}`}>
                        {toolB.name.charAt(0)}
                      </div>
                      <span>{toolB.name}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-101 text-slate-600">
                
                {/* 1. Category */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400">Category</td>
                  <td className="p-4 uppercase text-[11px] text-center md:text-left font-medium">{toolA.category}</td>
                  <td className="p-4 uppercase text-[11px] text-center md:text-left font-medium">{toolB.category}</td>
                </tr>

                {/* 2. Pricing Tier */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400">Pricing Model</td>
                  <td className="p-4 text-center md:text-left">
                    <span className="bg-indigo-55 border border-indigo-100 py-1 px-2.5 rounded font-bold text-indigo-700">
                      {toolA.pricing}
                    </span>
                  </td>
                  <td className="p-4 text-center md:text-left">
                    <span className="bg-rose-50 border border-rose-100 py-1 px-2.5 rounded font-bold text-rose-700">
                      {toolB.pricing}
                    </span>
                  </td>
                </tr>

                {/* 3. Strengths */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400">Primary Strength</td>
                  <td className="p-4 leading-relaxed text-center md:text-left">{toolA.strengths || 'Versatile prompt execution speeds.'}</td>
                  <td className="p-4 leading-relaxed text-center md:text-left">{toolB.strengths || 'Deep integration with complex datasets.'}</td>
                </tr>

                {/* 4. Weakness */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400">Known Limitation</td>
                  <td className="p-4 leading-relaxed text-center md:text-left">{toolA.weaknesses || 'Requires custom fine tuning presets.'}</td>
                  <td className="p-4 leading-relaxed text-center md:text-left">{toolB.weaknesses || 'High usage limits trigger prompt caps.'}</td>
                </tr>

                {/* 5. Best For */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400">Best For</td>
                  <td className="p-4 leading-relaxed text-center md:text-left font-medium text-slate-700">{toolA.bestFor}</td>
                  <td className="p-4 leading-relaxed text-center md:text-left font-medium text-slate-700">{toolB.bestFor}</td>
                </tr>

                {/* 6. Mobile Application */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400">Mobile App Support</td>
                  <td className="p-4 text-center md:text-left">
                    {toolA.features.includes('Mobile App') ? (
                      <span className="text-emerald-600 font-bold flex items-center space-x-1 justify-center md:justify-start">
                        <Check className="h-4 w-4" /> <span>Available</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center space-x-1 justify-center md:justify-start font-medium">
                        <X className="h-4 w-4" /> <span>Web Only</span>
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center md:text-left">
                    {toolB.features.includes('Mobile App') ? (
                      <span className="text-emerald-600 font-bold flex items-center space-x-1 justify-center md:justify-start">
                        <Check className="h-4 w-4" /> <span>Available</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center space-x-1 justify-center md:justify-start font-medium">
                        <X className="h-4 w-4" /> <span>Web Only</span>
                      </span>
                    )}
                  </td>
                </tr>

                {/* 7. API Availability */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400">API Access</td>
                  <td className="p-4 text-center md:text-left">
                    {toolA.features.includes('API Available') ? (
                      <span className="text-emerald-600 font-bold flex items-center space-x-1 justify-center md:justify-start">
                        <Check className="h-4 w-4" /> <span>Supported</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center space-x-1 justify-center md:justify-start font-medium">
                        <X className="h-4 w-4" /> <span>Restricted</span>
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center md:text-left">
                    {toolB.features.includes('API Available') ? (
                      <span className="text-emerald-600 font-bold flex items-center space-x-1 justify-center md:justify-start">
                        <Check className="h-4 w-4" /> <span>Supported</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center space-x-1 justify-center md:justify-start font-medium">
                        <X className="h-4 w-4" /> <span>Restricted</span>
                      </span>
                    )}
                  </td>
                </tr>

                {/* 8. Free Plan Available */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400">Continuous Free Plan</td>
                  <td className="p-4 text-center md:text-left">
                    {toolA.pricing !== 'Paid' ? (
                      <span className="text-emerald-600 font-bold flex items-center space-x-1 justify-center md:justify-start">
                        <Check className="h-4 w-4" /> <span>Yes</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center space-x-1 justify-center md:justify-start font-medium">
                        <X className="h-4 w-4" /> <span>Premium Only</span>
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center md:text-left">
                    {toolB.pricing !== 'Paid' ? (
                      <span className="text-emerald-600 font-bold flex items-center space-x-1 justify-center md:justify-start">
                        <Check className="h-4 w-4" /> <span>Yes</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 flex items-center space-x-1 justify-center md:justify-start font-medium">
                        <X className="h-4 w-4" /> <span>Premium Only</span>
                      </span>
                    )}
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

          {/* AI Winner Recommendation Verdict box */}
          <div className="bg-white border border-indigo-150 rounded-3xl p-6 space-y-3 relative overflow-hidden shadow-xs">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl"></div>
            
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-indigo-650" />
              <h3 className="font-extrabold text-indigo-900 text-xs uppercase tracking-wider">
                Radar AI Winner Verdict
              </h3>
            </div>
            
            <p className="text-slate-600 text-xs leading-relaxed relative z-5">
              {verdict.text}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-2 relative z-5">
              <button
                onClick={() => navigate('tool', { slug: toolASlug })}
                className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Inspect {toolA.name} Spec
              </button>
              <button
                onClick={() => navigate('tool', { slug: toolBSlug })}
                className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Inspect {toolB.name} Spec
              </button>
            </div>
          </div>

        </div>
      ) : (
        <p className="text-center text-slate-500 text-xs font-mono">Select valid tools in dropdown fields above to load matrices.</p>
      )}

    </div>
  );
}

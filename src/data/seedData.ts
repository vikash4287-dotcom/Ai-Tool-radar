/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AITool, Category, Collection } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'writing', name: 'Writing', icon: 'PenTool', color: 'from-pink-500 to-rose-500' },
  { id: 'marketing', name: 'Marketing', icon: 'Megaphone', color: 'from-blue-500 to-indigo-500' },
  { id: 'design', name: 'Design', icon: 'Palette', color: 'from-violet-500 to-purple-500' },
  { id: 'video', name: 'Video', icon: 'Video', color: 'from-amber-500 to-orange-500' },
  { id: 'coding', name: 'Coding', icon: 'Code', color: 'from-emerald-500 to-teal-500' },
  { id: 'productivity', name: 'Productivity', icon: 'Zap', color: 'from-cyan-500 to-blue-600' },
  { id: 'research', name: 'Research', icon: 'Search', color: 'from-sky-500 to-teal-600' },
  { id: 'education', name: 'Education', icon: 'GraduationCap', color: 'from-lime-500 to-emerald-600' },
  { id: 'sales', name: 'Sales', icon: 'TrendingUp', color: 'from-rose-500 to-pink-600' },
  { id: 'customer support', name: 'Customer Support', icon: 'MessageSquare', color: 'from-purple-500 to-indigo-600' }
];

export const COLLECTIONS: Collection[] = [
  {
    id: 'best-ai-tools-for-students',
    name: 'Best AI Tools for Students',
    slug: 'best-ai-tools-for-students',
    description: 'Boost your grades, study smarter, and write faster with the absolute best AI helpers for academic success.',
    icon: 'GraduationCap',
    bestFor: 'College and school students looking for homework help, thesis writing, and research assistance.',
    introduction: 'Being a student in 2026 is all about leverage. These selected AI tools help you automate the busywork – summarizing 50-page PDFs, organizing lectures, and double-checking step-by-step calculus equations – so you can focus on genuine learning and high-level comprehension.',
    pros: ['Save hundreds of hours summarizing references', 'Personal tutor available 24/7', 'Improve assignment quality and formatting'],
    cons: ['Needs double-checking for factual accuracy (halucinations)', 'Can lead to academic dependency if misused'],
    recommendedToolSlug: 'perplexity'
  },
  {
    id: 'best-ai-tools-for-marketers',
    name: 'Best AI Tools for Marketers',
    slug: 'best-ai-tools-for-marketers',
    description: 'Scale content creation, optimize ad spend, and build viral social assets in minutes.',
    icon: 'Megaphone',
    bestFor: 'Social media managers, growth marketers, and campaign creators.',
    introduction: 'Marketing moves incredibly fast. To stand out across Instagram, TikTok, LinkedIn, and newsletters, automation is mandatory. These leading tools allow you to auto-generate creatives, write SEO-optimized blogs, and automate drip campaigns in seconds.',
    pros: ['Rapid copy generation at scale', 'Cost-effective creative testing in real-time', 'Data-driven SEO recommendations'],
    cons: ['May produce repetitive copy if prompts lack character', 'Brand voice tuning requires regular correction'],
    recommendedToolSlug: 'jasper'
  },
  {
    id: 'best-ai-tools-for-coding',
    name: 'Best AI Tools for Coding',
    slug: 'best-ai-tools-for-coding',
    description: 'Deploy features in seconds. The ultimate AI compilation for software developers, designers, and builders.',
    icon: 'Code',
    bestFor: 'Engineers, web developers, indie founders, and beginners looking to write clean code.',
    introduction: 'The world of coding has pivoted from writing lines to directing agents. Whether you want to prototype an entire web app from clear natural language, or integrate autocomplete directly in your IDE, these coding tools are absolute game-changers.',
    pros: ['Speed up development loops by 10x', 'Debug errors with precise, contextual explanations', 'Build entire functional MVPs from simple text prompts'],
    cons: ['Requires architectural review for absolute security', 'Occasionally writes deprecated or redundant syntax'],
    recommendedToolSlug: 'cursor'
  },
  {
    id: 'best-free-ai-tools',
    name: 'Best Free AI Tools',
    slug: 'best-free-ai-tools',
    description: 'Powerful AI capability, zero expenditure. Top tier free AI tools available to everyone.',
    icon: 'Gift',
    bestFor: 'Bootstrappers, hobbyists, and anyone working with limited budget constraints.',
    introduction: 'You do not need to pay $20/month to harness elite artificial intelligence. These tools offer highly generous free plans or are completely open-source, giving you incredible creative and computational power with zero fees.',
    pros: ['100% free or extremely generous continuous tiers', 'High quality outputs with no upfront cards', 'Open-source transparency and customization'],
    cons: ['Free tiers can face heavy usage limits during peak hours', 'Some complex state features might be restricted'],
    recommendedToolSlug: 'perplexity'
  },
  {
    id: 'best-ai-tools-for-startups',
    name: 'Best AI Tools for Startups',
    slug: 'best-ai-tools-for-startups',
    description: 'Ship fast, remain lean, and pitch like a pro. Absolute workspace-savers for early-stage startup teams.',
    icon: 'Zap',
    bestFor: 'Indie builders, initial cofounders, and venture-backed startup teams.',
    introduction: 'Startups suffer from too much to do and too little time. Use these tools to build pitches, automate sales pipelines, generate product designs, and answer complex legal/regulatory queries so you can ship daily.',
    pros: ['Build custom pitch materials in minutes', 'Operate as a 10-person agency with a 2-person staff', 'Maximize runway and performance'],
    cons: ['Vitals require deep personalization', 'Over-automation may dilute early user connections'],
    recommendedToolSlug: 'gamma'
  },
  {
    id: 'best-ai-tools-for-designers',
    name: 'Best AI Tools for Designers',
    slug: 'best-ai-tools-for-designers',
    description: 'Redefine visual aesthetics, edit assets, and build high-fidelity interface Mockups.',
    icon: 'Palette',
    bestFor: 'UI/UX designers, design system leads, and digital illustrators.',
    introduction: 'AI is a fresh brush for human painters and product designers. From generative canvas extensions to zero-effort background extractions and vector generation, these utilities streamline modern visual production pipeline.',
    pros: ['Incredibly fast iteration on concepts and styles', 'Upscale textures and assets to professional grades', 'Generate editable vector layouts and SVG icons'],
    cons: ['Difficulty rendering precise client layouts from single queries', 'Minor visual aberrations require manual fixing in Illustrator'],
    recommendedToolSlug: 'midjourney'
  }
];

// 15 Cornerstone highly recognizable AI Tools with detailed entries
const COVER_TOOLS: AITool[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    slug: 'chatgpt',
    description: 'The industry-defining AI conversational model by OpenAI. Supports text generation, web browsing, custom GPT extensions, advanced voice commands, and robust data synthesis.',
    category: 'writing',
    pricing: 'Freemium',
    website: 'https://chatgpt.com',
    logo: 'bg-emerald-500',
    features: ['API Available', 'Mobile App', 'Free Trial', 'Browser Extension'],
    pros: ['Incredibly versatile across hundreds of domains', 'Advanced search grounding and real-time computation', 'Very quick and straightforward responsive app'],
    cons: ['Occasional hallucination under extremely deep logic rules', 'Voice features require Plus license for continuous usage'],
    tags: ['chatbot', 'openai', 'gpt-4o', 'writing assistant', 'coding helper'],
    alternatives: ['claude', 'perplexity', 'gemini'],
    views: 12450,
    trendingScore: 98,
    featured: true,
    createdAt: '2026-01-10T12:00:00Z',
    bestFor: 'General problem solving, professional copywriting, conversational support, and dynamic coding solutions.',
    strengths: 'Context window integration, dynamic code execution sandbox, rapid text replies',
    weaknesses: 'Long-form deep creative pacing can feel occasionally repetitive compared to Claude',
    freePlan: true
  },
  {
    id: 'claude',
    name: 'Claude',
    slug: 'claude',
    description: 'Anthropic\'s top-tier language model, legendary for its nuanced writing, precise instruction parsing, large-scale code debugging, and rich visual artifacts preview system.',
    category: 'writing',
    pricing: 'Freemium',
    website: 'https://claude.ai',
    logo: 'bg-orange-600',
    features: ['API Available', 'Mobile App', 'Free Trial'],
    pros: ['Excellent, highly humanlike creative and structural tone', 'Massive context window supports uploading entire books', 'Artifacts window lets you preview React components interactive'],
    cons: ['Free tier messages limit resets every 5 hours and fills up quickly', 'Lacks native integrated live search engine, relying on trained knowledge cutoff'],
    tags: ['anthropic', 'writing assistant', 'artifacts', 'expert coding', 'creative writing'],
    alternatives: ['chatgpt', 'perplexity', 'gemini'],
    views: 11200,
    trendingScore: 99,
    featured: true,
    createdAt: '2026-02-15T12:00:00Z',
    bestFor: 'Complex programming architectures, nuanced long-form essays, content editing, and custom interactive dashboard generation.',
    strengths: 'Outstanding reasoning capabilities, code writing precision, deep textual comprehension',
    weaknesses: 'Message limit quota is relatively restrictive on free tiers',
    freePlan: true
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    slug: 'midjourney',
    description: 'The undefeated king of cinematic, highly stylistic generative digital art. Interprets stylistic prompt instructions to render stunning photorealistic or animated graphics.',
    category: 'design',
    pricing: 'Paid',
    website: 'https://midjourney.com',
    logo: 'bg-indigo-600',
    features: ['API Available'],
    pros: ['Unrivaled photo realism, artistic styling, and composition', 'Vibrant community and extensive reference models', 'Web-based interface makes prompting smooth outside Discord'],
    cons: ['No default free plan; require subscription starts at $10/month', 'Can struggle with precise typographic spellings'],
    tags: ['image generator', 'art creator', 'photorealism', 'creative tool'],
    alternatives: ['stable-diffusion', 'dall-e'],
    views: 9400,
    trendingScore: 94,
    featured: true,
    createdAt: '2026-01-20T12:00:00Z',
    bestFor: 'Concept art, visual illustrations, product branding mocks, textured game backdrops, and creative inspiration.',
    strengths: 'Unmatched visual aesthetics, subtle brush detailing, lighting simulation',
    weaknesses: 'Requires subscription, strict Discord historical ties',
    freePlan: false
  },
  {
    id: 'cursor',
    name: 'Cursor',
    slug: 'cursor',
    description: 'The premier AI-first code editor fork of VS Code. Features multi-file edits (Composer), inline chat, predictive symbol transitions, and deep repository embeddings.',
    category: 'coding',
    pricing: 'Freemium',
    website: 'https://cursor.com',
    logo: 'bg-zinc-800',
    features: ['Mobile App', 'Free Trial'],
    pros: ['Seamless integration of Copilot with multi-file edit power', 'Indexer embeds entire codebase for hyper-relevant recommendations', 'Auto-correction of terminal linter bugs'],
    cons: ['Requires importing settings from VS Code', 'High-speed premium models require pro plan subscription'],
    tags: ['ide', 'code editor', 'ai developer', 'programming tool'],
    alternatives: ['copilot', 'bolt'],
    views: 8900,
    trendingScore: 96,
    featured: true,
    createdAt: '2026-03-01T12:00:00Z',
    bestFor: 'Professional software developers, startups looking to ship high-quality features in hours, and learners.',
    strengths: 'Multi-file codebase reasoning, effortless bug search, smooth keyboard shortcuts',
    weaknesses: 'Resource-intensive electron base on older hardware',
    freePlan: true
  },
  {
    id: 'v0',
    name: 'v0 by Vercel',
    slug: 'v0',
    description: 'A revolutionary generative user interface system by Vercel. Generates production-ready React, Tailwind CSS, and shadcn/ui components from natural language descriptions.',
    category: 'coding',
    pricing: 'Freemium',
    website: 'https://v0.dev',
    logo: 'bg-black',
    features: ['API Available', 'Free Trial'],
    pros: ['Generates highly responsive, completely functional modern web pages', 'Integrates with Tailwind and popular libraries seamlessly', 'Direct copy-paste npm command commands to import into projects'],
    cons: ['Strict limit on monthly generation credits', 'Advanced multi-page flows require manual assembly in code editor'],
    tags: ['ui generator', 'react builder', 'tailwind css', 'nextjs', 'frontend helper'],
    alternatives: ['lovable', 'bolt'],
    views: 8700,
    trendingScore: 95,
    featured: true,
    createdAt: '2026-02-28T09:00:00Z',
    bestFor: 'Frontend developers, designers, and indie founders who want to build stunning, modern React UIs in minutes.',
    strengths: 'Exquisite UI designs matching latest web trends, interactive previews',
    weaknesses: 'Focussed strictly on Vercel/NextJS-oriented web setups',
    freePlan: true
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    slug: 'perplexity',
    description: 'The premier AI conversational answer engine that searches the live web to deliver structured, fully cited reports on any topic in seconds. Avoids traditional search engine ad bloat.',
    category: 'research',
    pricing: 'Freemium',
    website: 'https://perplexity.ai',
    logo: 'bg-cyan-700',
    features: ['Mobile App', 'Free Trial', 'Browser Extension'],
    pros: ['Real-time semantic search with academic citation integration', 'Option to toggle between top models (Claude 3.5, GPT-4o)', 'Collections feature to organize deep research logs'],
    cons: ['Can occasionally misinterpret citations for highly niche queries', 'Pro model requires subscription for unlimited uploads'],
    tags: ['search engine', 'researcher', 'educational tool', 'citations'],
    alternatives: ['chatgpt', 'consensus'],
    views: 10100,
    trendingScore: 97,
    featured: true,
    createdAt: '2026-01-18T12:00:00Z',
    bestFor: 'Students doing research, business analysts, and anyone looking for quick, verified answers with inline links.',
    strengths: 'Live web search optimization, clear structured references, clean read formats',
    weaknesses: 'Lacks the pure creative voice capabilities of standard Claude/GPT apps',
    freePlan: true
  },
  {
    id: 'runway',
    name: 'Runway Gen-3',
    slug: 'runway',
    description: 'A revolutionary text-to-video and image-to-video generator capable of outputting hyper-realistic cinema cutscenes, custom camera pans, and cinematic physics effects.',
    category: 'video',
    pricing: 'Freemium',
    website: 'https://runwayml.com',
    logo: 'bg-rose-600',
    features: ['Free Trial', 'API Available'],
    pros: ['Stunning cinematic details, texture definition, and realistic rendering', 'Advanced camera controls (pan, zoom, orbit) inside the prompt editor', 'Incredible speed for high-fidelity assets'],
    cons: ['Video rendering credits deplete rapidly', 'Occasional hand or limb deformations during fast kinetic action'],
    tags: ['video generator', 'runway', 'animation helper', 'art-creator'],
    alternatives: ['sora', 'luma'],
    views: 7800,
    trendingScore: 92,
    featured: true,
    createdAt: '2026-03-10T12:00:00Z',
    bestFor: 'Indie filmmakers, social media advertisers, ad agencies, and music video editors.',
    strengths: 'Cinematic environmental lighting, slow-motion rendering capability',
    weaknesses: 'Relatively expensive custom pricing for large asset batches',
    freePlan: true
  },
  {
    id: 'jasper',
    name: 'Jasper',
    slug: 'jasper',
    description: 'An elite enterprise copywriting suite designed to preserve brand voices across blogs, ad materials, high-converting product landers, and cold email loops.',
    category: 'marketing',
    pricing: 'Paid',
    website: 'https://jasper.ai',
    logo: 'bg-purple-600',
    features: ['API Available', 'Free Trial', 'Browser Extension'],
    pros: ['Superb templates custom-fitted to high-performance advertising campaigns', 'Integrates with SEO tools to provide real-time optimization ranks', 'Define separate voice guidelines for different pipelines'],
    cons: ['No ongoing free plan available (trials require credit cards)', 'Can feel overly complex for a casual standalone writer'],
    tags: ['copywriting', 'marketing suite', 'seo optimizer', 'blog generator'],
    alternatives: ['writesonic', 'copy-ai'],
    views: 6500,
    trendingScore: 88,
    featured: false,
    createdAt: '2026-01-05T12:00:00Z',
    bestFor: 'Corporate marketing agencies, content managers, and multi-brand managers.',
    strengths: 'Consistency in brand voice reproduction, premium layout templates',
    weaknesses: 'Higher pricing entry-point compared to general writing aids',
    freePlan: false
  },
  {
    id: 'synthesia',
    name: 'Synthesia',
    slug: 'synthesia',
    description: 'The leading AI video generation suite utilizing high-fidelity talking avatars. Translates scripts into 140+ languages with synchronized realistic lip movements and expressions.',
    category: 'video',
    pricing: 'Paid',
    website: 'https://synthesia.io',
    logo: 'bg-sky-600',
    features: ['API Available', 'Free Trial'],
    pros: ['Stunning visual sync, eliminates the cost of camera crew and actors', 'Seamless multi-language localization handles accents perfectly', 'Create custom avatars matching real staff faces'],
    cons: ['Avatars can look slightly stiff if vocal pacing has no breathing pauses', 'Pro templates can become recognizable across web fields if not customized'],
    tags: ['talking avatar', 'video voiceover', 'corporate trainer', 'marketing video'],
    alternatives: ['heygen', 'runway'],
    views: 7200,
    trendingScore: 91,
    featured: false,
    createdAt: '2026-02-10T12:00:00Z',
    bestFor: 'Corporate training, product tutorials, educational courses, and customer success explainers.',
    strengths: 'Flawless lip synchronization, huge inventory of real actor presets',
    weaknesses: 'Somewhat corporate aesthetic, lacks kinetic animated camera angles',
    freePlan: false
  },
  {
    id: 'gamma',
    name: 'Gamma App',
    slug: 'gamma',
    description: 'A beautiful presentation builder that turns prompts, notes, or articles into gorgeous, styled slide decks, web pages, or documents within seconds.',
    category: 'productivity',
    pricing: 'Freemium',
    website: 'https://gamma.app',
    logo: 'bg-teal-600',
    features: ['Free Trial', 'Browser Extension'],
    pros: ['Instant, stunning layout and color scheme pairing matched to your theme', 'Completely fluid responsive cards that replace static PowerPoint boundaries', 'Embed live videos, web frames, and active sheets directly into slides'],
    cons: ['Free plan inserts a "Made with Gamma" brand badge in exports', 'Custom fonts require high-tier corporate licenses'],
    tags: ['presentations', 'ppt maker', 'document design', 'visual slides'],
    alternatives: ['beautiful-ai', 'notion-ai'],
    views: 8400,
    trendingScore: 94,
    featured: true,
    createdAt: '2026-01-30T12:00:00Z',
    bestFor: 'Founders pitching ideas, students assembling group presentations, and product managers delivering status updates.',
    strengths: 'Outstanding card-based visual structures, quick structural templates',
    weaknesses: 'Formatting fine-tuning can be tricky compared to Google Slides',
    freePlan: true
  },
  {
    id: 'notion-ai',
    name: 'Notion AI',
    slug: 'notion-ai',
    description: 'Injects the power of conversational and analytical AI directly inside your Notion workspace. Auto-summarizes agendas, parses massive wikis, drafts action lists, and checks grammar.',
    category: 'productivity',
    pricing: 'Paid',
    website: 'https://notion.so',
    logo: 'bg-neutral-900',
    features: ['Mobile App', 'Browser Extension'],
    pros: ['Works exactly where your information already lives', 'Outstanding ability to find connections across massive multi-page databases', 'Summarize meeting summaries and set task priorities, tags, and subtasks'],
    cons: ['Requires Notion subscription + separate $10/month AI add-on', 'Response speeds can stagger slightly during peak business operations'],
    tags: ['workspace', 'notes organizer', 'meeting summarizer', 'productivity helper'],
    alternatives: ['gamma', 'beautiful-ai'],
    views: 7900,
    trendingScore: 89,
    featured: false,
    createdAt: '2026-02-05T12:00:00Z',
    bestFor: 'Notion power users, product manager groups, agile software hubs, and creative planners.',
    strengths: 'Direct integration with databases, excellent formatting cleanup',
    weaknesses: 'Strictly locked inside the Notion document ecosystems',
    freePlan: false
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    slug: 'copilot',
    description: 'The veteran AI pair-programmer that autocomplete lines, drafts complete block functions, generates system-tests, and handles terminal command assistance directly inside IDEs.',
    category: 'coding',
    pricing: 'Paid',
    website: 'https://github.com/features/copilot',
    logo: 'bg-indigo-900',
    features: ['API Available', 'Free Trial'],
    pros: ['Incredibly fluid inline autocomplete speeds up typing pace', 'Supports almost all programming languages, environments, and extensions', 'Deep context parsing of neighboring files in the editor'],
    cons: ['Lacks Cursor-level full multi-file autonomous file-creation abilities', 'Occasionally repeats repetitive loops if code pattern has errors'],
    tags: ['coding assistant', 'github', 'autocompleter', 'software compiler'],
    alternatives: ['cursor', 'codeium'],
    views: 9100,
    trendingScore: 90,
    featured: false,
    createdAt: '2026-01-01T12:00:00Z',
    bestFor: 'Professional software development engineers, student developers, and dev ops teams.',
    strengths: 'Instant keyboard tab completions, lightweight IDE footprint',
    weaknesses: 'Focuses strictly on writing line-by-line rather than editing entire files',
    freePlan: false
  },
  {
    id: 'consensus',
    name: 'Consensus',
    slug: 'consensus',
    description: 'A tailored academic search engine that extracts and aggregates findings directly from 200M+ peer-reviewed scientific papers. Answers health, social science, and technical questions.',
    category: 'research',
    pricing: 'Freemium',
    website: 'https://consensus.app',
    logo: 'bg-cyan-900',
    features: ['Browser Extension', 'Free Trial'],
    pros: ['Extracts true consensus percentages among scientific publications', 'No opinion or blog spam; links directly to primary journals', 'Synthesizes findings into a plain-English, cited, clean abstract'],
    cons: ['Limited value for topics currently lacking published research papers', 'Detailed summaries take some seconds to aggregate'],
    tags: ['citations', 'medical science', 'academic finder', 'expert researcher'],
    alternatives: ['perplexity', 'elicit'],
    views: 6700,
    trendingScore: 93,
    featured: true,
    createdAt: '2026-03-05T12:00:00Z',
    bestFor: 'Medical students, researchers, health and wellness writers, and curious minds looking for factual scientific consensus.',
    strengths: 'Strict empirical sourcing, beautiful metric charts for consensus, clear annotations',
    weaknesses: 'Not ideal for breaking news or colloquial software queries',
    freePlan: true
  },
  {
    id: 'apollo',
    name: 'Apollo.io AI',
    slug: 'apollo',
    description: 'An advanced sales intelligence platform that hyper-automates email sequences, filters 270M+ leads, writes persuasive email openers, and tracks prospect click engagement.',
    category: 'sales',
    pricing: 'Freemium',
    website: 'https://apollo.io',
    logo: 'bg-orange-500',
    features: ['Mobile App', 'Chrome Extension', 'API Available'],
    pros: ['Incredibly massive contact verified database', 'Generates high-performance outbound sequences personalized to lead data', 'Autopilots target list updates based on career changes'],
    cons: ['Pricing scales rapidly if exporting large contact volumes', 'Data validity on highly niche industries requires periodic audits'],
    tags: ['b2b lead gen', 'email automations', 'pipeline planner', 'prospecting'],
    alternatives: ['clay', 'seamless'],
    views: 6100,
    trendingScore: 87,
    featured: false,
    createdAt: '2026-01-25T12:00:00Z',
    bestFor: 'B2B sales representatives, recruiters, business development groups, and agency founders.',
    strengths: 'Actionable database enrichment, easy sales pipeline email scripts',
    weaknesses: 'Outbound templates must be checked to prevent spam-filtering',
    freePlan: true
  },
  {
    id: 'intercom-fin',
    name: 'Intercom Fin',
    slug: 'intercom-fin',
    description: 'Advanced conversational client chatbot powered by Gemini and GPT-4. Syncs with help center pages to resolve up to 60% of customer support queries instantly.',
    category: 'customer support',
    pricing: 'Paid',
    website: 'https://intercom.com',
    logo: 'bg-sky-500',
    features: ['API Available', 'Free Trial', 'Mobile App'],
    pros: ['Outstanding natural language resolution, respects support desk rules', 'Escalates complex requests seamlessly to active humans with transcripts', 'Direct integration with Shopify, Stripe, and ticketing systems'],
    cons: ['Charged per-resolution, which can escalate costs during high traffic', 'Requires deep support-documentation setup to get elite performance'],
    tags: ['customer representative', 'help desk assistant', 'ticketing assistant', 'live chat'],
    alternatives: ['zendesk', 'chatbase'],
    views: 5800,
    trendingScore: 89,
    featured: false,
    createdAt: '2026-02-20T12:00:00Z',
    bestFor: 'E-commerce stores, SaaS platforms, and enterprise support departments wanting to reduce call volumes.',
    strengths: 'Accurate rule execution, safe factual boundaries (no halluncinations)',
    weaknesses: 'Entry pricing is somewhat premium for bootstrap start-ups',
    freePlan: false
  }
];

// Seed lists to programmatically expand the core tools into exactly 100 high-fidelity tools.
// The list keys provide realistic, recognizable products.
const EXPANSION_PRESETS: { name: string; category: string; pricing: 'Free' | 'Freemium' | 'Paid'; features: string[] }[] = [
  // WRITING
  { name: 'Copy.ai', category: 'writing', pricing: 'Freemium', features: ['API Available', 'Free Trial', 'Browser Extension'] },
  { name: 'Writesonic', category: 'writing', pricing: 'Freemium', features: ['API Available', 'Free Trial'] },
  { name: 'Grammarly AI', category: 'writing', pricing: 'Freemium', features: ['Mobile App', 'Browser Extension'] },
  { name: 'Rytr', category: 'writing', pricing: 'Freemium', features: ['Mobile App', 'Browser Extension'] },
  { name: 'Sudowrite', category: 'writing', pricing: 'Paid', features: ['Free Trial'] },
  { name: 'QuillBot', category: 'writing', pricing: 'Freemium', features: ['Browser Extension'] },
  { name: 'NovelAI', category: 'writing', pricing: 'Paid', features: [] },
  { name: 'Wordtune', category: 'writing', pricing: 'Freemium', features: ['Browser Extension', 'Mobile App'] },
  { name: 'Scribe', category: 'writing', pricing: 'Freemium', features: ['Browser Extension'] },

  // CODING
  { name: 'Replit Agent', category: 'coding', pricing: 'Paid', features: ['Mobile App'] },
  { name: 'Tabnine', category: 'coding', pricing: 'Freemium', features: ['API Available', 'Free Trial'] },
  { name: 'Bolt.work', category: 'coding', pricing: 'Freemium', features: ['Free Trial'] },
  { name: 'Lovable.dev', category: 'coding', pricing: 'Freemium', features: ['Free Trial'] },
  { name: 'Supermaven', category: 'coding', pricing: 'Freemium', features: ['Free Trial'] },
  { name: 'Codeium', category: 'coding', pricing: 'Free', features: ['Open Source', 'Browser Extension'] },
  { name: 'Blackbox AI', category: 'coding', pricing: 'Freemium', features: ['Browser Extension', 'Mobile App'] },
  { name: 'Amazon Q Coding', category: 'coding', pricing: 'Freemium', features: ['Browser Extension'] },
  { name: 'Continue.dev', category: 'coding', pricing: 'Free', features: ['Open Source'] },

  // DESIGN
  { name: 'DALL-E 3', category: 'design', pricing: 'Paid', features: ['API Available'] },
  { name: 'Stable Diffusion', category: 'design', pricing: 'Free', features: ['Open Source', 'API Available'] },
  { name: 'Canva Pro AI', category: 'design', pricing: 'Freemium', features: ['Mobile App', 'Browser Extension'] },
  { name: 'Figma AI', category: 'design', pricing: 'Freemium', features: ['Browser Extension'] },
  { name: 'Looka', category: 'design', pricing: 'Paid', features: [] },
  { name: 'Recraft', category: 'design', pricing: 'Freemium', features: ['API Available'] },
  { name: 'Photoroom', category: 'design', pricing: 'Freemium', features: ['Mobile App', 'API Available'] },
  { name: 'Uizard', category: 'design', pricing: 'Freemium', features: ['Free Trial'] },
  { name: 'Clipdrop', category: 'design', pricing: 'Freemium', features: ['API Available', 'Mobile App'] },

  // VIDEO
  { name: 'Sora by OpenAI', category: 'video', pricing: 'Paid', features: ['API Available'] },
  { name: 'Pika Labs', category: 'video', pricing: 'Freemium', features: ['Mobile App'] },
  { name: 'HeyGen', category: 'video', pricing: 'Freemium', features: ['API Available', 'Free Trial'] },
  { name: 'CapCut AI', category: 'video', pricing: 'Freemium', features: ['Mobile App'] },
  { name: 'InVideo AI', category: 'video', pricing: 'Freemium', features: ['Mobile App', 'Free Trial'] },
  { name: 'Descript', category: 'video', pricing: 'Freemium', features: ['Free Trial'] },
  { name: 'Wondershare Filmora AI', category: 'video', pricing: 'Paid', features: ['Mobile App'] },
  { name: 'Luma Dream Machine', category: 'video', pricing: 'Freemium', features: ['API Available'] },
  { name: 'Kaiber', category: 'video', pricing: 'Freemium', features: ['Mobile App'] },

  // MARKETING
  { name: 'AdCreative.ai', category: 'marketing', pricing: 'Paid', features: ['API Available', 'Free Trial'] },
  { name: 'Brandmark.io', category: 'marketing', pricing: 'Paid', features: [] },
  { name: 'Ocoya', category: 'marketing', pricing: 'Paid', features: ['Free Trial', 'Browser Extension'] },
  { name: 'Semrush Copilot', category: 'marketing', pricing: 'Paid', features: ['Browser Extension'] },
  { name: 'Flick AI', category: 'marketing', pricing: 'Paid', features: ['Mobile App', 'Free Trial'] },
  { name: 'Simplified AI', category: 'marketing', pricing: 'Freemium', features: ['Mobile App'] },
  { name: 'Predis.ai', category: 'marketing', pricing: 'Freemium', features: ['API Available', 'Mobile App'] },
  { name: 'Mutiny', category: 'marketing', pricing: 'Paid', features: ['API Available'] },
  { name: 'Pencil AI', category: 'marketing', pricing: 'Paid', features: ['API Available'] },

  // PRODUCTIVITY
  { name: 'Beautiful.ai', category: 'productivity', pricing: 'Paid', features: ['Free Trial'] },
  { name: 'Otter.ai', category: 'productivity', pricing: 'Freemium', features: ['Mobile App', 'Browser Extension'] },
  { name: 'Fireflies.ai', category: 'productivity', pricing: 'Freemium', features: ['API Available', 'Browser Extension'] },
  { name: 'Todoist AI', category: 'productivity', pricing: 'Freemium', features: ['Mobile App', 'Browser Extension'] },
  { name: 'Taskade', category: 'productivity', pricing: 'Freemium', features: ['Mobile App', 'Browser Extension', 'API Available'] },
  { name: 'Amplenote', category: 'productivity', pricing: 'Freemium', features: ['Mobile App'] },
  { name: 'Goblin Tools', category: 'productivity', pricing: 'Free', features: ['Mobile App'] },
  { name: 'x.ai Engine', category: 'productivity', pricing: 'Paid', features: [] },
  { name: 'Tome App', category: 'productivity', pricing: 'Freemium', features: ['Mobile App'] },

  // RESEARCH
  { name: 'Elicit AI', category: 'research', pricing: 'Freemium', features: ['Free Trial'] },
  { name: 'ChatPDF', category: 'research', pricing: 'Freemium', features: ['Browser Extension'] },
  { name: 'Scite.ai', category: 'research', pricing: 'Paid', features: ['Browser Extension'] },
  { name: 'Keenious', category: 'research', pricing: 'Freemium', features: ['Browser Extension'] },
  { name: 'Scholarcy', category: 'research', pricing: 'Freemium', features: ['Browser Extension'] },
  { name: 'Humata AI', category: 'research', pricing: 'Freemium', features: ['Browser Extension'] },
  { name: 'Genei Research', category: 'research', pricing: 'Paid', features: [] },
  { name: 'ResearchRabbit', category: 'research', pricing: 'Free', features: [] },
  { name: 'Paper Digest', category: 'research', pricing: 'Free', features: [] },

  // EDUCATION
  { name: 'Quizlet Q-Chat', category: 'education', pricing: 'Freemium', features: ['Mobile App'] },
  { name: 'Khanmigo', category: 'education', pricing: 'Paid', features: ['Mobile App'] },
  { name: 'Socratic by Google', category: 'education', pricing: 'Free', features: ['Mobile App'] },
  { name: 'Duolingo Max Custom', category: 'education', pricing: 'Paid', features: ['Mobile App'] },
  { name: 'Photomath', category: 'education', pricing: 'Freemium', features: ['Mobile App'] },
  { name: 'Elsa Speak', category: 'education', pricing: 'Freemium', features: ['Mobile App'] },
  { name: 'Brainly AI', category: 'education', pricing: 'Freemium', features: ['Mobile App'] },
  { name: 'TutorAI', category: 'education', pricing: 'Free', features: [] },
  { name: 'Gradescope AI', category: 'education', pricing: 'Paid', features: ['Mobile App'] },
  { name: 'Coursera Coach', category: 'education', pricing: 'Paid', features: ['Mobile App'] },

  // SALES
  { name: 'Lavender Email', category: 'sales', pricing: 'Paid', features: ['Browser Extension'] },
  { name: 'Gong Solutions', category: 'sales', pricing: 'Paid', features: ['API Available', 'Mobile App'] },
  { name: 'Salesloft', category: 'sales', pricing: 'Paid', features: ['API Available'] },
  { name: 'Seamless.ai', category: 'sales', pricing: 'Paid', features: ['Browser Extension'] },
  { name: 'Outreach Copilot', category: 'sales', pricing: 'Paid', features: ['API Available'] },
  { name: 'Regie.ai', category: 'sales', pricing: 'Paid', features: ['Browser Extension'] },
  { name: 'Lusha Contacts', category: 'sales', pricing: 'Freemium', features: ['Browser Extension'] },
  { name: 'Drift Bot', category: 'sales', pricing: 'Paid', features: ['API Available', 'Mobile App'] },
  { name: 'Clay.run Enrichment', category: 'sales', pricing: 'Paid', features: ['API Available'] },

  // CUSTOMER SUPPORT
  { name: 'Zendesk Advanced AI', category: 'customer support', pricing: 'Paid', features: ['API Available', 'Mobile App'] },
  { name: 'Ada support', category: 'customer support', pricing: 'Paid', features: ['API Available'] },
  { name: 'Custify AI', category: 'customer support', pricing: 'Paid', features: ['API Available'] },
  { name: 'Kustomer engine', category: 'customer support', pricing: 'Paid', features: ['API Available'] },
  { name: 'Tidio Lyro AI', category: 'customer support', pricing: 'Freemium', features: ['API Available', 'Mobile App'] },
  { name: 'Gorgias AI helper', category: 'customer support', pricing: 'Paid', features: ['API Available'] },
  { name: 'Chatbase.co', category: 'customer support', pricing: 'Freemium', features: ['API Available'] },
  { name: 'ManyChat Copilot', category: 'customer support', pricing: 'Freemium', features: ['API Available', 'Mobile App'] },
  { name: 'Help Scout AI', category: 'customer support', pricing: 'Paid', features: ['API Available', 'Mobile App'] }
];

// Helper to fill the gaps programmatically up to at least 200 tools, ensuring at least 22 tools in each category
export function generateSeedTools(): AITool[] {
  const tools = [...COVER_TOOLS];

  // First, add all expansion presets to tools (giving us ~100 tools)
  EXPANSION_PRESETS.forEach((preset, idx) => {
    const slug = preset.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Check if slug already exists to prevent duplicate IDs
    const exists = tools.some(t => t.slug === slug);
    if (!exists) {
      // Calculate realistic metrics
      const views = Math.floor(1000 + Math.random() * 8000);
      const trendingScore = Math.floor(50 + Math.random() * 45);
      const featured = idx % 8 === 0;

      // Select random features/pros/cons
      const randomPros = [
        `Incredibly fast processing speed and response cycles.`,
        `Extremely user-friendly interface requiring near-zero training.`,
        `Saves significant manual human editing labor and overhead.`
      ];
      
      const randomCons = [
        `Offline modes are slightly limited in functionality.`,
        `Pricing schedules can become premium on full scalability.`
      ];

      tools.push({
        id: slug + `-${idx}`,
        name: preset.name,
        slug: slug,
        description: `Optimize your workspace with ${preset.name}, an AI-powered solution built specifically for high-efficiency enterprise and creative ${preset.category} workflows.`,
        category: preset.category,
        pricing: preset.pricing,
        website: `https://${slug}.com`,
        logo: getRandomGradient(idx),
        features: preset.features,
        pros: randomPros,
        cons: randomCons,
        tags: [preset.category, 'productivity', 'efficiency', slug],
        alternatives: getAlternativesMock(preset.category, slug),
        views: views,
        trendingScore: trendingScore,
        featured: featured,
        createdAt: new Date(2026, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toISOString(),
        bestFor: `Teams looking to hyper-streamline their ${preset.category} pipelines and cut down production costs.`,
        strengths: `Excellent localized domain intelligence and automated tag-indexing capabilities.`,
        weaknesses: `Initial fine-tuning template creation requires some manual configuration inputs.`,
        freePlan: preset.pricing === 'Free' || preset.pricing === 'Freemium'
      });
    }
  });

  // Name pools for each category to reach at least 22 tools in each
  const pools: Record<string, string[]> = {
    'writing': ['DraftSmith', 'ProsePilot', 'PenFlow', 'WordWeaver AI', 'InkSpark', 'Ghostwriter Pro', 'ContextBrief', 'Stylus AI', 'NovelFlow', 'GrammarGrid', 'EssayShield', 'EditSage', 'SummarySpark', 'CopyFlow', 'ScriptCrafter', 'PoetMatrix'],
    'marketing': ['AdGenius', 'CampaignCraft', 'BrandVoice AI', 'SocialSail', 'MarketPulse', 'SEOShield', 'ClickScale', 'Virality AI', 'TargetFlow', 'LeadStream', 'PromoSprout', 'AdRadar', 'AudienceWave', 'BuzzForge', 'CopyScribe', 'ConversionAI'],
    'design': ['PixelForge', 'CanvasPro AI', 'VividDraw', 'VectorVibe', 'Drafty UI', 'Artistry AI', 'LogoFlow', 'MockupMind', 'PaletteSpark', 'RenderGen', 'StyleShift', 'AssetForge', 'LayerWise', 'TextureGen', 'ColorWave', 'FontPair AI'],
    'video': ['CineFlow', 'MotionForge', 'ClipShift', 'Director AI', 'CutGenius', 'SceneWeaver', 'FramePulse', 'VidCraft', 'AudioSync AI', 'ReelMax', 'MontageMind', 'Splicer AI', 'B-Roll Engine', 'ScreenCraft', 'LipSync Pro', 'Teleprompt AI'],
    'coding': ['CodePilot Pro', 'SyntaxSage', 'DevPulse', 'BugShield AI', 'CommitCraft', 'DeployFlow', 'LinterMax', 'RefactorGrid', 'NestJS Copilot', 'DjangoPilot', 'SchemaForge', 'QueryScribe', 'ScriptSprint', 'API-Weaver', 'DockWorker AI', 'TestSpark'],
    'productivity': ['FocusFlow', 'TaskSync', 'AgendaAI', 'NotesForge', 'CalPilot', 'OrganizePro', 'MeetingMind', 'InboxZero AI', 'DocuStream', 'SlideCraft', 'SheetGrid AI', 'WorkspacePro', 'HabitLoop', 'PriorityWave', 'ReminderAI', 'SyncGrid'],
    'research': ['ScholarScope', 'CiteWise', 'PaperPilot', 'FactShield AI', 'QueryInsight', 'ConsensusGrid', 'SearchSage', 'DataPrism', 'InsightWave', 'Abstractify', 'SourceCheck', 'Reviewer AI', 'ArchiveScan', 'BiblioForge', 'SynthesisAI', 'CuratorPro'],
    'education': ['TutorGrid', 'StudyPulse', 'LessonCraft', 'Academia AI', 'QuizWeaver', 'FlashMind', 'Curriculum AI', 'GradeWise', 'LectorPro', 'SolverSpark', 'ScribeStudy', 'EduFlow', 'CognitiveAI', 'Prepper AI', 'SkillUp', 'MentorBot'],
    'sales': ['LeadPulse', 'DealFlow AI', 'SalesForge', 'ProspectPulse', 'QuoteCraft', 'CloseMax', 'PipelinePro', 'RevenueMind', 'CallWise', 'OutreachAI', 'CRM-Sync', 'B2B-Shield', 'SalesSprint', 'EnrichPro', 'SequenceAI', 'DealScout'],
    'customer support': ['ReplyWise', 'ChatPulse', 'SupportCore', 'TicketFlow', 'ResolvAI', 'DeskPilot', 'ClientCare', 'AgenticHelp', 'QueueMax', 'QueryShield', 'VoxSupport', 'TriageAI', 'FAQ-Forge', 'AnswerStream', 'AssureBot', 'FeedbackMind']
  };

  const categoriesList = [
    'writing', 'marketing', 'design', 'video', 'coding', 
    'productivity', 'research', 'education', 'sales', 'customer support'
  ];

  categoriesList.forEach((cat) => {
    let countInCat = tools.filter(t => t.category === cat).length;
    let poolIndex = 0;
    const pool = pools[cat] || [];

    while (countInCat < 22 && poolIndex < pool.length) {
      const name = pool[poolIndex];
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      // Check if slug already exists to prevent duplicates
      const exists = tools.some(t => t.slug === slug);
      if (!exists) {
        const views = Math.floor(1200 + Math.random() * 4500);
        const trendingScore = Math.floor(55 + Math.random() * 38);
        const featured = poolIndex % 6 === 0;

        const randomPros = [
          `Highly optimized workflows specifically tailored for modern ${cat} operations.`,
          `Intuitive web workspace with near-instant rendering speeds.`,
          `Supports bulk operations and comprehensive reporting options.`
        ];
        
        const randomCons = [
          `Advanced custom integrations require premium subscription options.`,
          `Slightly higher learning curve for enterprise-level automation configs.`
        ];

        const pPricing: 'Free' | 'Freemium' | 'Paid' = poolIndex % 3 === 0 ? 'Free' : (poolIndex % 3 === 1 ? 'Freemium' : 'Paid');

        tools.push({
          id: `${slug}-dyn-${poolIndex}`,
          name: name,
          slug: slug,
          description: `Supercharge your productivity using ${name}, a highly capable AI-driven assistant engineered with state-of-the-art models for automated ${cat} tasks.`,
          category: cat,
          pricing: pPricing,
          website: `https://${slug}.com`,
          logo: getRandomGradient(poolIndex + 12),
          features: pPricing === 'Paid' ? ['API Available', 'Free Trial'] : ['Mobile App', 'Browser Extension'],
          pros: randomPros,
          cons: randomCons,
          tags: [cat, 'automation', 'productivity', slug],
          alternatives: getAlternativesMock(cat, slug),
          views: views,
          trendingScore: trendingScore,
          featured: featured,
          createdAt: new Date(2026, 4, Math.floor(Math.random() * 28) + 1).toISOString(),
          bestFor: `Teams and professionals wanting to hyper-automate their daily ${cat} checklists.`,
          strengths: `State-of-the-art native context awareness and fast-feedback cycles.`,
          weaknesses: `Localized offline capabilities are still receiving improvements in our active beta.`,
          freePlan: pPricing !== 'Paid'
        });

        countInCat++;
      }
      poolIndex++;
    }
  });

  // Specific Tools for Creating Instagram Reels
  const reelsTools = [
    { name: 'AutoReels AI', pricing: 'Freemium' as const },
    { name: 'Virality Reels', pricing: 'Free' as const },
    { name: 'InstaCut AI', pricing: 'Paid' as const },
    { name: 'ReelsGen Pro', pricing: 'Freemium' as const },
    { name: 'ShortBeat AI', pricing: 'Paid' as const },
    { name: 'ClipRise Studio', pricing: 'Free' as const },
    { name: 'TrendViral AI', pricing: 'Freemium' as const },
    { name: 'ReelFlow AI', pricing: 'Paid' as const },
    { name: 'InstaScript AI', pricing: 'Free' as const },
    { name: 'CapReels AI', pricing: 'Freemium' as const },
    { name: 'SnapReel Maker', pricing: 'Paid' as const }
  ];

  reelsTools.forEach((rt, idx) => {
    const slug = rt.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!tools.some(t => t.slug === slug)) {
      tools.push({
        id: `${slug}-reels-${idx}`,
        name: rt.name,
        slug: slug,
        description: `Create viral Instagram Reels and short-form videos with any assets using ${rt.name}. Auto-generate attractive templates, translate voiceovers, sync with trend beats, and edit captions dynamically.`,
        category: 'video',
        pricing: rt.pricing,
        website: `https://${slug}.com`,
        logo: getRandomGradient(idx + 101),
        features: rt.pricing === 'Paid' ? ['API Available', 'Free Trial'] : ['Mobile App', 'Browser Extension'],
        pros: ['Direct optimization presets for Instagram Reels algorithms', 'Kinetic smart editing engine saves hours of clipping', 'Stunning automatic caption presets'],
        cons: ['HD downloads require pro levels of pricing subscription models', 'Requires direct account login to auto-schedule posts on Insta'],
        tags: ['reels', 'instagram', 'instagram reels', 'short video', 'video generator', 'tiktok', 'youtube shorts'],
        alternatives: ['runway', 'heygen'],
        views: Math.floor(2500 + Math.random() * 5000),
        trendingScore: Math.floor(75 + Math.random() * 20),
        featured: idx % 3 === 0,
        createdAt: new Date(2026, 5, 1).toISOString(),
        bestFor: 'Designers, marketers, influencers, and brands looking to scale viral social Reels and TikTok edits.',
        strengths: 'Outstanding trendy sound library integration and fast cloud-rendering queues.',
        weaknesses: 'Occasional format conversion quirks when uploading horizontal reference content.',
        freePlan: rt.pricing !== 'Paid'
      });
    }
  });

  // Specific Tools for Students / Academics
  const studentTools = [
    { name: 'StudyBuddy AI', pricing: 'Free' as const },
    { name: 'HomeWork Hero', pricing: 'Freemium' as const },
    { name: 'ThesisScribe Pro', pricing: 'Paid' as const },
    { name: 'GradCheck Advisor', pricing: 'Freemium' as const },
    { name: 'ClassMate Bot', pricing: 'Free' as const },
    { name: 'LectuNote Summarizer', pricing: 'Freemium' as const },
    { name: 'ExamPrep AI', pricing: 'Paid' as const },
    { name: 'ScholarBot Helper', pricing: 'Free' as const },
    { name: 'Academix Helper', pricing: 'Freemium' as const },
    { name: 'Summify Academic', pricing: 'Paid' as const },
    { name: 'MathSolve Solver', pricing: 'Freemium' as const }
  ];

  studentTools.forEach((st, idx) => {
    const slug = st.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!tools.some(t => t.slug === slug)) {
      tools.push({
        id: `${slug}-student-${idx}`,
        name: st.name,
        slug: slug,
        description: `Supercharge your grades and master research study workloads with ${st.name}. Solve complex formulas, summarize citations, format research papers, and chat with customized textbook assistants.`,
        category: 'education',
        pricing: st.pricing,
        website: `https://${slug}.com`,
        logo: getRandomGradient(idx + 202),
        features: st.pricing === 'Paid' ? ['API Available', 'Free Trial'] : ['Mobile App', 'Browser Extension'],
        pros: ['Detailed formula explanations and graph visualizers', 'Instant context-grounded PDF summaries and reference finders', 'Auto formats standard academic bibs and footnotes'],
        cons: ['Explanatory models require dual checking to avoid hallucinated scientific facts', 'Daily question credit thresholds apply in free models'],
        tags: ['student', 'students', 'education', 'academia', 'study helper', 'homework', 'tutoring', 'citations'],
        alternatives: ['perplexity', 'quizlet-q-chat'],
        views: Math.floor(3000 + Math.random() * 5000),
        trendingScore: Math.floor(70 + Math.random() * 25),
        featured: idx % 3 === 0,
        createdAt: new Date(2026, 5, 2).toISOString(),
        bestFor: 'High school students, college undergraduates, graduate researchers, and educational tutors.',
        strengths: 'Outstanding deep textbook reference mapping tools and customized subject cards.',
        weaknesses: 'Some highly specialized doctoral equations still require clear reference submissions.',
        freePlan: st.pricing !== 'Paid'
      });
    }
  });

  return tools;
}

function getRandomGradient(idx: number): string {
  const gradients = [
    'bg-sky-500', 'bg-purple-500', 'bg-rose-500', 'bg-amber-500', 'bg-violet-500',
    'bg-teal-500', 'bg-emerald-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
  ];
  return gradients[idx % gradients.length];
}

function getAlternativesMock(category: string, currentSlug: string): string[] {
  if (category === 'writing') return ['chatgpt', 'claude'].filter(s => s !== currentSlug);
  if (category === 'coding') return ['cursor', 'v0'].filter(s => s !== currentSlug);
  if (category === 'design') return ['midjourney'].filter(s => s !== currentSlug);
  if (category === 'video') return ['runway', 'synthesia'].filter(s => s !== currentSlug);
  return [];
}

/**
 * Case Studies Data
 *
 * Realistic client results showcasing UNTH.AI's core service verticals.
 * Each case maps to one of the six services: content, assistants,
 * automation, bulk, growth, voice.
 */

import { BrainCircuit, Bot, Workflow, Palette, TrendingUp, AudioWaveform } from 'lucide-react';

export const CASE_STUDIES = [
  {
    id: 'ecommerce-automation',
    title: 'Autonomous Product Catalog Engine',
    client: 'Multi-Brand E-Commerce Group',
    industry: 'E-Commerce / Retail',
    service: 'Workflow Automation',
    serviceKey: 'automation',
    icon: Workflow,
    results: [
      { metric: '300+', label: 'Products processed monthly' },
      { metric: '0', label: 'Hours of manual staging' },
      { metric: '3×', label: 'Faster time-to-listing' },
    ],
    challenge:
      'A Bangkok-based e-commerce group managing six brand stores was spending over 40 hours per week manually staging product photos, writing descriptions, and syncing inventory across platforms. Each product required 15–20 minutes of human effort, creating a bottleneck that limited catalog growth.',
    solution:
      'We built an autonomous product pipeline using n8n workflows connected to their Shopify and Lazada stores. An AI agent receives raw product images, automatically removes backgrounds, generates photorealistic lifestyle scenes via ComfyUI, writes SEO-optimized descriptions in Thai and English, and pushes the finished listing to all sales channels — all without human intervention.',
    outcome:
      'The system now processes 300+ products per month with zero manual staging. Time-to-listing dropped from days to minutes. The client expanded from 2 to 6 brand stores without adding headcount, and reported a 40% increase in conversion on AI-staged products vs. their previous photo-dump approach.',
    quote: '"This completely changed how we think about catalog management. What used to take a full team now runs itself."',
    quoteName: 'Head of Operations',
  },
  {
    id: 'venue-content',
    title: 'Cinematic Content Engine for Nightlife',
    client: 'Premium Nightclub & Event Venue',
    industry: 'Nightlife / Hospitality',
    service: 'AI Content Engine',
    serviceKey: 'content',
    icon: BrainCircuit,
    results: [
      { metric: '4×', label: 'Social media engagement' },
      { metric: '70%', label: 'Faster content production' },
      { metric: '1.2M', label: 'Monthly reach across platforms' },
    ],
    challenge:
      'A high-end Bangkok nightclub needed fresh, cinema-quality promotional content weekly — event posters, Instagram reels, promo videos, and Facebook ads. Hiring a production team for this volume would cost $5,000+/month. Their existing in-house efforts resulted in inconsistent quality and branding.',
    solution:
      'We deployed an AI Content Engine pipeline combining Stable Diffusion for poster generation, RunwayML for short-form video clips, and ElevenLabs for voiceover. A curated brand kit (colors, typography, mood references) ensures every output maintains the venue\'s aesthetic. Weekly drops are scheduled and published via an automated social scheduler.',
    outcome:
      'Content production time dropped by 70%, from 20+ hours/week to under 6. Social engagement increased 4× across Instagram and TikTok, with several AI-generated posts going organic-viral. Monthly platform reach hit 1.2 million. The venue reported a direct correlation between content volume and weekend booking rates.',
    quote: '"The quality is indistinguishable from our previous production team — and the consistency is better."',
    quoteName: 'Marketing Director',
  },
  {
    id: 'voice-hotel',
    title: '24/7 AI Voice Receptionist for Luxury Hospitality',
    client: 'Boutique Hotel Group',
    industry: 'Hospitality / Travel',
    service: 'AI Voice Intelligence',
    serviceKey: 'voice',
    icon: AudioWaveform,
    results: [
      { metric: '40%', label: 'More after-hours bookings' },
      { metric: '92%', label: 'Calls handled autonomously' },
      { metric: '$18K', label: 'Annual savings vs. night staff' },
    ],
    challenge:
      'A boutique hotel group in Osaka was losing after-hours bookings because calls went to voicemail. Human receptionists worked 8 AM–8 PM, leaving 12 hours of missed opportunities daily. Guests often booked competitors who answered instantly. The cost of 24/7 reception staffing was prohibitive at $36,000+/year per property.',
    solution:
      'We deployed an AI Voice Receptionist — a custom GPT-4o-powered voice agent integrated with their booking system. The agent handles calls in Japanese, English, and Mandarin: answers FAQs, checks room availability, processes bookings, and transfers complex requests to human staff during operating hours. The voice uses a warm, professional tone matched to the hotel\'s brand personality.',
    outcome:
      'The AI receptionist handles 92% of calls fully autonomously, with only 8% requiring human escalation. After-hours bookings increased 40%, recovering $24,000 in annual revenue per property. The annual savings of $18,000 (vs. night staff) delivered an ROI-positive deployment within the first month.',
    quote: '"Guests consistently tell us they didn\'t realize they were speaking to AI until we told them."',
    quoteName: 'General Manager',
  },
  {
    id: 'saas-automation',
    title: 'Full-Stack Workflow Automation for SaaS',
    client: 'B2B SaaS Company',
    industry: 'Technology / SaaS',
    service: 'Workflow Automation',
    serviceKey: 'automation',
    icon: Workflow,
    results: [
      { metric: '20+', label: 'Hours saved per week' },
      { metric: '30%', label: 'Faster lead response time' },
      { metric: '15', label: 'Integrated apps & services' },
    ],
    challenge:
      'A growing B2B SaaS company was drowning in manual processes: lead data entered from webforms into HubSpot, invoices created in Stripe, Slack notifications for every deal stage change, and manual reporting across 5 spreadsheets. The CEO estimated the team spent 25+ hours/week on repetitive cross-app tasks.',
    solution:
      'We designed and deployed a centralized n8n automation layer connecting 15 apps: HubSpot, Stripe, Slack, Google Sheets, Gmail, Calendly, QuickBooks, and their proprietary dashboard. Key workflows include: lead enrichment (automatic company lookup via Apollo), deal-stage notifications, invoice generation on closed-won, weekly performance reports, and automated follow-up sequences for stalled deals.',
    outcome:
      'Automation eliminated 20+ hours of manual work per week — equivalent to hiring a half-time employee without the salary. Lead response time dropped from 4 hours to under 15 minutes (30% faster). The CEO reclaimed 10 hours/week from spreadsheet reporting alone. The system paid for itself within the first 2 months.',
    quote: '"I used to dread Monday mornings because of the reporting overhead. Now a Slack bot hands me my weekly numbers."',
    quoteName: 'CEO & Co-Founder',
  },
  {
    id: 'real-estate-growth',
    title: 'AI Growth Engine for Real Estate',
    client: 'International Real Estate Agency',
    industry: 'Real Estate / Property',
    service: 'AI Growth Strategy',
    serviceKey: 'growth',
    icon: TrendingUp,
    results: [
      { metric: '150%', label: 'Increase in qualified leads' },
      { metric: '1,000+', label: 'Prospects contacted monthly' },
      { metric: '8×', label: 'ROI on campaign spend' },
    ],
    challenge:
      'A luxury real estate agency in Phuket serving international buyers (Russian, Chinese, European) relied on cold-calling and paid ads to generate leads. Manual outreach was slow, expensive, and limited to 50–100 prospects per week. Their CRM was populated with thousands of stale contacts that nobody had time to re-engage.',
    solution:
      'We built an AI Growth Engine combining automated lead sourcing (via social listening and property portal scraping), AI-powered enrichment and segmentation (by budget bracket and nationality), and multi-channel outreach sequences (email + LINE + WhatsApp). A GPT-4 agent personalizes each message based on the prospect\'s browsing behavior and property preferences. Campaign performance is tracked in a real-time dashboard.',
    outcome:
      'The engine contacts 1,000+ qualified prospects per month — 10× the manual capacity. Qualified leads increased 150%, and the agency closed three high-value deals ($1.2M+, $850K, $600K) attributed directly to automated outreach. ROI on campaign spend was 8×. The founder now spends her time on closing instead of cold outreach.',
    quote: '"I was skeptical an AI could match the personal touch our clients expect. The deals speak for themselves."',
    quoteName: 'Founder & Lead Agent',
  },
];

export const CASE_STUDY_CATEGORIES = [
  { key: 'all', label: 'All Cases' },
  { key: 'content', label: 'Content Engine' },
  { key: 'assistants', label: 'AI Assistants' },
  { key: 'automation', label: 'Workflow Automation' },
  { key: 'bulk', label: 'Creative Automation' },
  { key: 'growth', label: 'AI Growth' },
  { key: 'voice', label: 'Voice AI' },
];

// Blog posts — single source of truth.
// To add a post: append an entry below. `slug` must be unique + URL-safe.
// `body` is an array of paragraph strings (rendered as <p>).
// `image` is a URL or imported asset for the hero / card thumbnail.

import imgAutomation from '../assets/unthai-ai-automation-bg.webp';
import imgCinematic from '../assets/unthai-cinematic-bg.webp';
import imgHero from '../assets/hero-bg.webp';

export const posts = [
    {
        id: 1,
        slug: 'rise-of-autonomous-ai-agents-in-enterprise',
        title: 'The Rise of Autonomous AI Agents in Enterprise',
        excerpt: 'How intelligent agents are transforming business workflows from reactive to proactive systems.',
        date: '2025-10-24',
        category: 'AI Strategy',
        readTime: '5 min read',
        image: imgCinematic,
        body: [
            'For two decades, enterprise software was a passive tool. Humans clicked buttons, software responded. The work — the thinking, the routing, the chasing of loose ends — stayed on the human side of the screen.',
            'Autonomous agents invert that model. Instead of waiting for a click, an agent observes a system (an inbox, a CRM, a queue, a calendar), decides what action serves the business goal, and executes. The human steps in only when judgment is needed.',
            'In practice, this looks like: a sales agent that researches every inbound lead, scores it, drafts a personalized reply, and books a meeting — before a human sees the email. A support agent that resolves the bottom 60% of tickets without escalation. An ops agent that watches your stack 24/7 and self-heals failed jobs.',
            'The shift is not technological — the models have been good enough for 18 months. The shift is architectural. Companies that win are rebuilding workflows around agents as first-class actors, not bolt-on chatbots.',
            'If your team still measures productivity in tickets-per-human, you are measuring the wrong number. The new unit is outcomes-per-system.',
        ],
    },
    {
        id: 2,
        slug: 'generative-ui-beyond-static-interfaces',
        title: 'Generative UI: Beyond Static Interfaces',
        excerpt: 'Exploring the shift towards fluid, context-aware user interfaces generated on the fly by AI.',
        date: '2025-11-02',
        category: 'Design',
        readTime: '4 min read',
        image: imgHero,
        body: [
            'Static UIs were designed for the average user. Generative UIs are designed for the user in front of the screen, right now.',
            'The pattern is straightforward: instead of shipping a fixed dashboard with 40 widgets, you ship a renderer + a model that decides what to show given the user, their role, the time of day, and the task at hand. The "page" is no longer a file in your repo — it is a rendered answer to a question.',
            'This unlocks two things. First, complexity collapses: power users get density, beginners get clarity, and you ship one codebase. Second, the cost of personalization drops to near zero — every screen can be tailored without a product manager spec.',
            'The risk is coherence. Users still need predictable mental models. The teams winning here treat the model as a layout engine, not a designer — it picks from a curated component library with strict design tokens.',
        ],
    },
    {
        id: 3,
        slug: 'optimizing-n8n-workflows-for-scale',
        title: 'Optimizing n8n Workflows for Scale',
        excerpt: 'Best practices for building robust, error-tolerant automation pipelines that handle thousands of executions.',
        date: '2025-11-15',
        category: 'Automation',
        readTime: '8 min read',
        image: imgAutomation,
        body: [
            'n8n is the workhorse of mid-market automation. It is also the first thing that breaks when volume jumps from 100 to 100,000 executions per day.',
            'Three failure modes account for 90% of incidents. First, unbounded loops — a node iterating over an API response that grew 10× overnight. Always cap iterations and emit a metric. Second, missing retry semantics — third-party APIs fail, and a workflow without exponential backoff turns into a Slack alert storm. Third, shared state — workflows that read and write the same Postgres row without a lock collide silently.',
            'The fix is boring: idempotency keys on every external call, dead-letter queues for failed runs, and a separate worker pool for long-running tasks so a stuck Salesforce sync does not starve your transactional flows.',
            'Treat n8n the way you treat your application code: version it, test it, monitor it. The visual editor is a feature, not an excuse to skip engineering hygiene.',
        ],
    },
    {
        id: 4,
        slug: 'future-of-low-code-development-with-ai',
        title: 'The Future of Low-Code Development with AI',
        excerpt: 'How AI-assisted coding is bridging the gap between no-code simplicity and pro-code power.',
        date: '2025-11-20',
        category: 'Development',
        readTime: '6 min read',
        image: imgCinematic,
        body: [
            'Low-code was always a compromise: faster than writing code, slower than the imagination of the person using it. AI dissolves the compromise.',
            'The new shape is a hybrid. A product manager describes what they want in plain language. An AI layer generates the underlying components, wires them to data, and exposes a low-code editor for fine-tuning. The handoff to engineering happens only when the system needs custom logic that the model cannot safely produce.',
            'This is not "no engineers required." It is "engineers focus on the 10% that matters." The other 90% — CRUD pages, internal tools, dashboards, forms — generates itself.',
            'Companies still investing in giant Salesforce / Power Platform contracts to solve internal-tool sprawl are buying yesterday\'s answer. The cost curve for AI-generated internal apps is dropping by an order of magnitude per year.',
        ],
    },
    {
        id: 5,
        slug: 'building-resilient-data-pipelines',
        title: 'Building Resilient Data Pipelines',
        excerpt: 'Architectural patterns for ensuring data integrity and availability in modern cloud environments.',
        date: '2025-11-28',
        category: 'Data Engineering',
        readTime: '7 min read',
        image: imgHero,
        body: [
            'Data pipelines fail. The question is not "if" but "how loudly, how visibly, and how fast you recover."',
            'Resilient pipelines share four traits. They are idempotent — re-running yesterday\'s job produces the same result, never duplicates. They are observable — every stage emits a row count and a latency, and a dashboard shows divergence in real time. They are decoupled — a slow downstream consumer never blocks an upstream producer. And they have explicit contracts — schemas are versioned, breaking changes are gated.',
            'Most teams skip the contract step and pay for it later. A column rename in source data, six months in, silently nulls out a downstream report and finance does not notice for two weeks. Contracts catch this in CI, not in the boardroom.',
            'Build the boring foundations. The fancy ML model on top fails differently — and recovers faster — when the data under it is trustworthy.',
        ],
    },
    {
        id: 6,
        slug: 'from-chatbots-to-digital-employees',
        title: 'From Chatbots to Digital Employees',
        excerpt: 'The evolution of conversational interfaces into fully autonomous digital workers capable of complex tasks.',
        date: '2025-12-05',
        category: 'AI Workforce',
        readTime: '5 min read',
        image: imgAutomation,
        body: [
            'A chatbot answers questions. A digital employee owns outcomes.',
            'The difference shows up in three places. First, scope: a chatbot handles one turn of conversation; a digital employee handles an entire job-to-be-done, end to end. Second, tools: a chatbot reads from a knowledge base; a digital employee reads, writes, books meetings, sends invoices, and updates records across a dozen systems. Third, accountability: a chatbot has no KPIs; a digital employee has a target — resolved tickets, qualified leads, processed invoices — and you measure it the same way you measure a human teammate.',
            'Organizations adopting this framing are restructuring orgs around outcomes rather than headcount. The question shifts from "how many engineers do we hire?" to "what work do we need done, and what mix of humans and agents delivers it best?"',
            'The companies that get this right in 2026 will run circles around the ones still asking whether to add a chatbot to their support page.',
        ],
    },
];

export const getPostBySlug = (slug) => posts.find((p) => p.slug === slug);

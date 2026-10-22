// Case studies. Facts come from my CV, the PageVow and VelaBid repos, and zintir.com.
// A section with no content is not rendered.

export type Fact = { k: string; v: string };
export type Decision = { t: string; d: string };
export type Section = {
  title: string;
  paras?: string[];
  bullets?: string[];
  decisions?: Decision[];
  numbers?: Fact[];
  diagram?: boolean;
};
export type CaseStudy = {
  slug: string;
  name: string;
  kind: string;
  oneLine: string;
  description: string;
  meta: Fact[];
  links: { label: string; href: string }[];
  numbers: Fact[];
  sections: Section[];
  diagram: { title: string; note: string; nodes: [string, string][] };
  next: string;
  // Home page summary
  role: string;
  summary: string;
  facts: Fact[];
  stack: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: 'pagevow',
    name: 'PageVow',
    kind: 'project',
    oneLine: 'AI-built personal pages that never publish unchecked.',
    description:
      'How I built and run PageVow alone: personal pages for life’s big moments, an AI pipeline that never publishes unchecked output, and a hardened Paystack payment flow.',
    role: 'founder, solo engineer',
    summary:
      'Personal pages for birthdays, proposals, graduations and weddings: letters, albums and invitations. AI writes from the customer’s own notes, nothing is published unchecked, and publishing is the step you pay for.',
    facts: [
      { k: 'users', v: '123' },
      { k: 'pages_generated', v: '600+' },
      { k: 'marketing_spend', v: '0 (first $200 came organically)' },
    ],
    stack: 'TypeScript Turborepo · Next.js · NestJS · Drizzle · PostgreSQL · Cloudflare R2 · Paystack',
    meta: [
      { k: 'role', v: 'Founder and solo engineer' },
      { k: 'status', v: 'Live at pagevow.com' },
      { k: 'since', v: 'March 2026' },
      { k: 'stack', v: 'TypeScript Turborepo · Next.js · NestJS · Drizzle · PostgreSQL · Cloudflare R2 · Paystack' },
    ],
    links: [{ label: 'pagevow.com ↗', href: 'https://pagevow.com' }],
    numbers: [
      { v: '123', k: 'users' },
      { v: '600+', k: 'pages generated' },
      { v: '$0', k: 'spent on marketing' },
    ],
    sections: [
      {
        title: 'The problem, and who it’s for',
        paras: [
          'PageVow makes personal pages for life’s big moments: birthdays, proposals, graduations and weddings. A customer gets an animated letter, a photo album or an invitation with RSVPs, shared with one link or a QR code on a printed card.',
          'They choose a page built with AI or one made by the PageVow team, and it comes in five languages.',
        ],
      },
      {
        title: 'Why I built it',
        paras: [
          'I wanted to own a product end to end, with real customers, real payments and real feedback. At PageVow every decision is mine: what to build, what to charge, and what to fix when a customer writes in.',
        ],
      },
      {
        title: 'What I built',
        paras: ['All of it, as founder and the only engineer. The spine is a five-step pipeline. Click through it.'],
        bullets: [
          'A TypeScript Turborepo: a Next.js web app, and a NestJS API that owns the payment boundary.',
          'The generate → validate → review → pay → publish pipeline.',
          'Validation and optional human review for every piece of model output.',
          'Hardened Paystack payments: signed checkout tokens, idempotent webhooks, replay fingerprinting, server-set amounts and a persistent security audit trail.',
          'Published pages with QR sharing, RSVPs, media and analytics.',
        ],
        diagram: true,
      },
      {
        title: 'The hard parts, and the decisions',
        decisions: [
          { t: 'Model output never goes straight to publish.', d: 'Every generated page is validated, and can go to a human for review, before it can be published.' },
          { t: 'AI writes only from the customer’s notes.', d: 'Captions and pages are written from what the customer told us, so a page says what they meant, not what a model invented.' },
          { t: 'Try first, pay to publish.', d: 'A free, watermarked 24-hour preview, no card needed. Each page is a single purchase, with no subscription to explain or support.' },
          { t: 'The server sets the price.', d: 'Amounts are enforced on the server, so the browser never decides what a customer pays.' },
          { t: 'A webhook can arrive twice. Nothing happens twice.', d: 'Webhooks are idempotent and replay-fingerprinted, and checkout tokens are signed. Every payment event lands in a persistent audit trail.' },
        ],
      },
      {
        title: 'What happened',
        paras: ['With zero marketing:'],
        numbers: [
          { v: '123', k: 'users' },
          { v: '600+', k: 'pages generated' },
          { v: '79', k: 'customer requests' },
          { v: '$200', k: 'first organic revenue' },
        ],
      },
      {
        title: 'What I’d do next',
        bullets: [
          'Charge international buyers in their own currency. Today everyone pays in Kenyan shillings.',
          'Give invitations real guest management, with sending, tracking and reminders per guest. It’s why weddings still pay specialists $60 to $170.',
          'Put reviews and usage numbers on the site, so new buyers can see the 600+ pages that already exist.',
        ],
      },
    ],
    diagram: {
      title: 'pagevow / publishing pipeline',
      note: 'Click a step, or use the arrow keys.',
      nodes: [
        ['Generate', 'A model writes the page from the customer’s own notes, or the PageVow team makes it.'],
        ['Validate', 'The output is checked before anyone sees it. Unchecked model output never goes straight to publish.'],
        ['Review', 'An optional human review. Pages made by the team are approved before payment.'],
        ['Pay', 'Paystack checkout with a signed token. The server sets the amount; webhooks are idempotent and replay-fingerprinted; every event is in the audit trail.'],
        ['Publish', 'The page goes live behind one link and a QR code, with RSVPs, media and analytics.'],
      ],
    },
    next: 'velabid',
  },
  {
    slug: 'velabid',
    name: 'VelaBid',
    kind: 'project',
    oneLine: 'Collector-car auctions where sniping doesn’t work.',
    description:
      'How I built VelaBid alone: an auction marketplace for rare performance cars with server-checked bids, a soft close that stops sniping, and escrowed payments.',
    role: 'founder, solo engineer',
    summary:
      'An auction marketplace for rare performance and collector cars, in an invite-only public beta: listings, timed auctions, real-time bidding, watchlists, messaging and notifications.',
    facts: [
      { k: 'bids', v: 'validated on the server' },
      { k: 'soft_close', v: 'late bids extend the auction' },
      { k: 'settlement', v: 'state transitions with failure recovery' },
    ],
    stack: 'TypeScript Turborepo · Next.js · NestJS · Drizzle · PostgreSQL (RDS) · Socket.IO · BullMQ/Redis · Stripe · S3/CloudFront',
    meta: [
      { k: 'role', v: 'Founder and solo engineer' },
      { k: 'status', v: 'Invite-only public beta at velabid.com' },
      { k: 'since', v: 'October 2025' },
      { k: 'stack', v: 'TypeScript Turborepo · Next.js · NestJS · Drizzle · PostgreSQL (RDS) · Socket.IO · BullMQ/Redis · Stripe · S3/CloudFront' },
    ],
    links: [{ label: 'velabid.com ↗', href: 'https://velabid.com' }],
    numbers: [
      { v: 'Soft close', k: 'late bids extend the auction' },
      { v: 'Server-side', k: 'bid validation' },
      { v: 'Public beta', k: 'invite-only, at velabid.com' },
    ],
    sections: [
      {
        title: 'The problem, and who it’s for',
        paras: [
          'VelaBid is an auction marketplace for rare performance and collector cars, for the people buying and selling them. It has listings, timed auctions, real-time bidding, watchlists, messaging and notifications.',
        ],
      },
      {
        title: 'Why I built it',
        paras: [
          'In a rare-car auction, trust is the product. Buyers need to know that every bid is real and that the close is fair. Sellers need to know the money is there.',
          'So I built VelaBid around the hard parts: bids checked on the server, a soft close that stops sniping, and escrowed payments that recover from failure.',
        ],
      },
      {
        title: 'What I built',
        paras: ['All of it, as founder and the only engineer. Here is an auction’s life, step by step.'],
        bullets: [
          'A TypeScript Turborepo: a Next.js web app, and a NestJS API on PostgreSQL through Drizzle.',
          'Listings, timed auctions, real-time bidding over Socket.IO, watchlists, messaging and notifications.',
          'Bid validation on the server, safeguards that reject conflicting or invalid bids, and a soft close. Reserve prices and buy-now too.',
          'Escrowed payments through Stripe, with automated settlement and payouts. Payments, escrow and settlement are modelled as state transitions with failure recovery.',
          'Trust and safety: KYC checkpoints, moderated messaging, dispute handling and a full audit log.',
          'An event-driven backend: BullMQ workers on Redis for auctions, settlement and notifications.',
          'Media from S3/CloudFront. Observability with OpenTelemetry and Prometheus.',
        ],
        diagram: true,
      },
      {
        title: 'The hard parts, and the decisions',
        decisions: [
          { t: 'The server decides what counts as a bid.', d: 'Every bid is validated on the server and placed in a transaction with optimistic locking and an atomic Redis step, so conflicting or invalid bids are rejected.' },
          { t: 'A soft close, so sniping doesn’t work.', d: 'A bid that arrives late extends the auction, which gives other bidders time to answer.' },
          { t: 'Money moves as state transitions.', d: 'Payments, escrow and settlement are modelled as explicit states, so a failed step can be recovered.' },
          { t: 'Slow work runs on workers.', d: 'BullMQ workers on Redis handle auctions, settlement and notifications.' },
        ],
      },
      {
        title: 'What happened',
        paras: [
          'VelaBid is in an invite-only public beta at velabid.com. Listing, bidding, messaging and payout flows all work. Payments run in Stripe test mode, and marketplace fees stay off until general availability.',
        ],
      },
      {
        title: 'What I’d do next',
        bullets: [
          'Switch payments from Stripe test mode to live, and turn on marketplace fees.',
          'Open the beta beyond invites.',
          'Let real auctions show where the soft close and settlement need tuning.',
        ],
      },
    ],
    diagram: {
      title: 'velabid / an auction’s life (simplified)',
      note: 'Click a step, or use the arrow keys.',
      nodes: [
        ['Listed', 'A car goes up for auction. Media is served from S3/CloudFront.'],
        ['Live', 'Real-time bidding over Socket.IO. Every bid is validated on the server; conflicting or invalid bids are rejected.'],
        ['Soft close', 'A late bid extends the auction, so nobody wins by sniping.'],
        ['Settlement', 'Escrowed payments through Stripe, in test mode during the beta. Settlement and payouts are state transitions that recover from failure.'],
        ['Notified', 'BullMQ workers on Redis send the notifications.'],
      ],
    },
    next: 'startupblink',
  },
  {
    slug: 'startupblink',
    name: 'StartupBlink',
    kind: 'job · lead full-stack engineer',
    oneLine: 'I lead the seven engineers behind 596K+ requests a day.',
    description:
      'My work as lead full-stack engineer at StartupBlink: a TypeScript monorepo, a Cloudflare and Redis setup serving 596K+ requests a day, and a team of seven.',
    role: 'lead full-stack engineer, team of 7',
    summary:
      'A global startup-ecosystem intelligence platform: 300,000+ startups ranked across 2,000+ cities in 118 countries, relied on by 40+ government clients.',
    facts: [
      { k: 'requests_per_day', v: '596K+' },
      { k: 'cache_hit_rate', v: '~70%' },
      { k: 'engagement', v: '+35% in 5 months, after a refactor I led' },
    ],
    stack: 'Turborepo · TypeScript · Node.js · tRPC · Prisma · MySQL · Redis · React/Next.js · Cloudflare',
    meta: [
      { k: 'role', v: 'Lead Full-Stack Engineer (Oct 2023 → now); Full-Stack Engineer before that' },
      { k: 'since', v: 'Oct 2022 · remote' },
      { k: 'team', v: '7 engineers' },
      { k: 'stack', v: 'Turborepo · TypeScript · Node.js · tRPC · Prisma · MySQL · Redis · React/Next.js · Cloudflare' },
    ],
    links: [{ label: 'startupblink.com ↗', href: 'https://www.startupblink.com' }],
    numbers: [
      { v: '596K+', k: 'requests a day' },
      { v: '~70%', k: 'cache-hit rate' },
      { v: '+35%', k: 'engagement in 5 months' },
    ],
    sections: [
      {
        title: 'The problem, and who it’s for',
        paras: [
          'StartupBlink is a global startup-ecosystem intelligence platform. It ranks 300,000+ startups across 2,000+ cities in 118 countries, and 40+ government clients rely on it.',
        ],
      },
      {
        title: 'What the job is',
        paras: [
          'Everything a lead engineer does. I set the architecture and the standards, review the code, plan delivery with seven engineers and keep production healthy. I also own the tooling that makes the team faster, including how we use AI.',
        ],
      },
      {
        title: 'What I own',
        paras: ['Here is the path a request takes.'],
        bullets: [
          'The architecture of a Turborepo monorepo: TypeScript, Node.js, tRPC, Prisma, MySQL, Redis and React/Next.js.',
          'The migration of legacy JavaScript into a TypeScript monorepo of 10+ packages and apps, with shared services reused across 5+ apps.',
          'Operating and tuning the Cloudflare-fronted, Redis-cached setup.',
          'CI/CD that ships 2+ production deploys a week.',
          'Structured AI-assisted engineering for the team: coding agents, MCP integrations, custom skills and multi-agent workflows, all under human review.',
        ],
        diagram: true,
      },
      {
        title: 'The hard parts, and the decisions',
        decisions: [
          { t: 'One typed monorepo.', d: 'Legacy JavaScript moved into a TypeScript Turborepo of 10+ packages and apps. Its shared services are reused across 5+ apps.' },
          { t: 'Cache before compute.', d: 'Cloudflare in front, Redis behind: a ~70% cache-hit rate on 596K+ requests a day.' },
          { t: 'Ship often.', d: '2+ production deploys a week, with deploy time cut by 50%.' },
          { t: 'AI-assisted, human-reviewed.', d: 'Agents help with the work. People review everything that ships.' },
        ],
      },
      {
        title: 'What happened',
        paras: ['The results I can put numbers on. The engagement jump came after an end-to-end platform refactor that I led.'],
        numbers: [
          { v: '+35%', k: 'user engagement in 5 months' },
          { v: '−50%', k: 'deployment time' },
          { v: '2+/week', k: 'production deploys' },
          { v: '37K+', k: 'unique visitors a day' },
        ],
      },
    ],
    diagram: {
      title: 'startupblink / a request’s path (simplified)',
      note: 'Click a step, or use the arrow keys.',
      nodes: [
        ['Visitors', '37K+ unique visitors and 596K+ requests a day.'],
        ['Cloudflare', 'The edge in front of everything. I operate and tune it.'],
        ['Redis', 'The cache behind Cloudflare. Together they reach a ~70% cache-hit rate.'],
        ['Apps', 'React/Next.js apps and Node.js services using tRPC, in a Turborepo of 10+ packages and apps.'],
        ['MySQL', 'The database, through Prisma.'],
      ],
    },
    next: 'pagevow',
  },
];

export const getCase = (slug: string) => caseStudies.find((c) => c.slug === slug);

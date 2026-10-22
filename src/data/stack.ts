// Every tool is wired to the jobs and projects where I used it. Every link comes from my CV.

export type Place = { id: string; name: string; kind: string; role: string; when: string; line: string; link?: string };
export type Tool = { id: string; name: string; cat: string; uses: [string, string][] };

export const places: Place[] = [
  { id: 'pagevow', name: 'PageVow', kind: 'Project', role: 'Founder · solo engineer', when: 'live', line: 'An AI page builder for personal pages. 123 users and 600+ pages with zero marketing.', link: '/work/pagevow' },
  { id: 'velabid', name: 'VelaBid', kind: 'Project', role: 'Founder · solo engineer', when: 'public beta', line: 'A collector-car auction marketplace with server-checked bids and a soft close.', link: '/work/velabid' },
  { id: 'startupblink', name: 'StartupBlink', kind: 'Job', role: 'Lead Full-Stack Engineer', when: 'Oct 2022 → now', line: 'Startup-ecosystem intelligence: 300,000+ startups, 118 countries, 40+ government clients. I lead seven engineers.', link: '/work/startupblink' },
  { id: 'entendre', name: 'Entendre Finance', kind: 'Contract', role: 'Software Engineer', when: 'Sep 2022 – May 2023', line: 'Automated crypto accounting across millions of on-chain transactions. Later acquired by MoonPay.' },
  { id: 'sidehustle', name: 'Side Hustle', kind: 'Job', role: 'Node.js Mentor & Curriculum Developer', when: 'Feb – Dec 2022', line: 'Mentored 1,800+ developers, wrote the backend curriculum and made 50+ training videos.' },
  { id: 'manaknight', name: 'Manaknight Digital', kind: 'Job', role: 'Senior Backend / Full-Stack Engineer', when: 'May 2021 – Jul 2022', line: 'APIs across 5 client products, remote with a Toronto team. Cut latency 67%.' },
  { id: 'fasto', name: 'FastoServices', kind: 'Job', role: 'Software Engineer, Backend/Cloud', when: 'Oct 2019 – May 2021', line: 'Backend and cloud work in Kampala, on AWS.' },
];

const cats: [string, [string, string, [string, string][]][]][] = [
  ['LANGUAGES & RUNTIMES', [
    ['typescript', 'TypeScript', [['startupblink', 'Moved legacy JavaScript into a TypeScript monorepo of 10+ packages and apps.'], ['pagevow', 'The whole product is one TypeScript Turborepo.']]],
    ['node', 'Node.js', [['startupblink', 'Node.js services in the monorepo.'], ['entendre', 'Serverless Node.js on AWS Lambda.'], ['sidehustle', 'Taught it: mentored 1,800+ developers and wrote the backend curriculum.']]],
    ['go', 'Go', [['manaknight', 'A Go service for one client integration.']]],
  ]],
  ['FRAMEWORKS', [
    ['nestjs', 'NestJS', [['pagevow', 'The API that owns the payment boundary.'], ['velabid', 'Event-driven backend for bids, auctions and settlement.']]],
    ['nextjs', 'Next.js', [['startupblink', 'React/Next.js apps in the monorepo.'], ['pagevow', 'The web app.']]],
    ['react', 'React', [['startupblink', 'React/Next.js across the platform.']]],
    ['trpc', 'tRPC', [['startupblink', 'Part of the monorepo’s stack, with Prisma and MySQL.']]],
    ['turborepo', 'Turborepo', [['startupblink', 'I lead the monorepo’s architecture. Its shared services are reused across 5+ apps.'], ['pagevow', 'One monorepo for the whole product.']]],
    ['socketio', 'Socket.IO', [['velabid', 'Real-time bidding.']]],
  ]],
  ['DATA', [
    ['postgres', 'PostgreSQL', [['pagevow', 'The database, accessed with Drizzle.'], ['velabid', 'Runs on AWS RDS.']]],
    ['mysql', 'MySQL', [['startupblink', 'The platform database, accessed with Prisma.']]],
    ['redis', 'Redis', [['startupblink', 'Cache behind Cloudflare: ~70% hit rate on 596K+ requests a day.'], ['velabid', 'Queues for the BullMQ workers.']]],
    ['prisma', 'Prisma', [['startupblink', 'ORM over MySQL.']]],
    ['drizzle', 'Drizzle', [['pagevow', 'ORM over PostgreSQL, including webhook idempotency keys.']]],
    ['mongodb', 'MongoDB', [['entendre', 'With serverless Node.js on Lambda.']]],
    ['bullmq', 'BullMQ', [['velabid', 'Workers for auctions, settlement and notifications.']]],
    ['chains', 'Blockchains', [['entendre', '5+ chains, including Solana, Arbitrum and Optimism.']]],
  ]],
  ['PAYMENTS', [
    ['stripe', 'Stripe', [['velabid', 'Payments. Escrow and settlement are state transitions with failure recovery.']]],
    ['paystack', 'Paystack', [['pagevow', 'Signed checkout tokens, idempotent webhooks, replay fingerprints, server-set amounts and an audit trail.']]],
  ]],
  ['CLOUD & DELIVERY', [
    ['aws', 'AWS', [['velabid', 'RDS, S3 and CloudFront.'], ['entendre', 'Lambda.'], ['fasto', 'Fargate, SNS and SQS.']]],
    ['cloudflare', 'Cloudflare', [['startupblink', 'Fronts the platform. I operate and tune it.'], ['pagevow', 'R2 for storage.']]],
    ['docker', 'Docker', [['fasto', 'Containers, alongside AWS Fargate.']]],
    ['terraform', 'Terraform', [['fasto', 'Infrastructure as code.']]],
    ['ansible', 'Ansible', [['fasto', 'Configuration management.']]],
    ['cicd', 'CI/CD', [['startupblink', '2+ production deploys a week. I cut deploy time by 50%.']]],
  ]],
  ['OBSERVABILITY', [
    ['datadog', 'Datadog', [['fasto', 'I set up the observability.']]],
    ['otel', 'OpenTelemetry', [['velabid', 'Observability for the event-driven backend.']]],
    ['prometheus', 'Prometheus', [['velabid', 'Metrics.']]],
  ]],
  ['WORKFLOW & AI', [
    ['agents', 'Coding agents', [['startupblink', 'Brought structured AI-assisted engineering to the team, all under human review.']]],
    ['mcp', 'MCP + custom skills', [['startupblink', 'MCP integrations, custom skills and multi-agent workflows.']]],
    ['aigen', 'AI generation', [['pagevow', 'Pages are generated, validated and optionally reviewed by a human before anyone pays.']]],
    ['review', 'Code review', [['startupblink', 'I set standards and review for a team of seven.'], ['manaknight', 'Added it with automated tests; production incidents went down.']]],
    ['tests', 'Automated tests', [['manaknight', 'Added them; production incidents went down.']]],
  ]],
];

export const categories = cats.map(([label]) => label);
export const tools: Tool[] = cats.flatMap(([cat, list]) => list.map(([id, name, uses]) => ({ id, name, cat, uses })));
export const edges = tools.flatMap((t) => t.uses.map(([place, text]) => ({ tool: t.id, place, text })));

// Desktop graph geometry, shared by the server render and the client script.
export const GRAPH = { width: 900, catH: 30, toolH: 24, toolW: 250, placeX: 650, placeH: 62 };

export function graphLayout() {
  let y = 0;
  const catTops: { label: string; top: number }[] = [];
  const toolTops: Record<string, number> = {};
  for (const [label, list] of cats) {
    catTops.push({ label, top: y });
    y += GRAPH.catH;
    for (const [id] of list) {
      toolTops[id] = y;
      y += GRAPH.toolH;
    }
  }
  const height = y;
  const placeTops: Record<string, number> = {};
  places.forEach((p, i) => {
    placeTops[p.id] = Math.round((i * (height - GRAPH.placeH)) / (places.length - 1));
  });
  const x1 = GRAPH.toolW;
  const x2 = GRAPH.placeX - 2;
  const paths = edges.map((e) => {
    const y1 = toolTops[e.tool] + 12;
    const y2 = placeTops[e.place] + GRAPH.placeH / 2;
    return { ...e, d: `M${x1} ${y1} C${x1 + 170} ${y1} ${x2 - 170} ${y2} ${x2} ${y2}` };
  });
  return { height, catTops, toolTops, placeTops, paths };
}

export type Role = { when: string; role: string; org: string; hi: string; current?: boolean; facts?: string[]; link?: string };

export const experience: Role[] = [
  {
    when: 'Oct 2023 → now',
    role: 'Lead Full-Stack Engineer',
    org: 'StartupBlink',
    hi: 'I lead seven engineers on a startup-ecosystem intelligence platform that ranks 300,000+ startups across 118 countries and that 40+ government clients rely on. An end-to-end platform refactor I led raised engagement 35% in 5 months.',
    facts: ['~18M requests a month', '~70% cache-hit rate', '2+ deploys a week', 'deploy time −50%'],
    link: '/work/startupblink',
    current: true,
  },
  { when: 'Oct 2022 – Sep 2023', role: 'Full-Stack Engineer', org: 'StartupBlink', hi: 'Joined as an engineer; became lead a year later.' },
  { when: 'Sep 2022 – May 2023', role: 'Software Engineer (contract)', org: 'Entendre Finance', hi: 'Serverless Node.js for crypto accounting across millions of on-chain transactions. Later acquired by MoonPay.' },
  { when: 'Feb – Dec 2022', role: 'Node.js Mentor & Curriculum Developer', org: 'Side Hustle', hi: 'Mentored 1,800+ developers, wrote the backend curriculum and made 50+ training videos.' },
  { when: 'May 2021 – Jul 2022', role: 'Senior Backend / Full-Stack Engineer', org: 'Manaknight Digital', hi: 'APIs across 5 client products, remote with a Toronto team. Cut latency 67%.' },
  { when: 'Oct 2019 – May 2021', role: 'Software Engineer, Backend/Cloud', org: 'FastoServices', hi: 'AWS Fargate, SNS and SQS, Docker, Terraform and Ansible in Kampala. Set up Datadog observability.' },
  { when: 'Aug – Oct 2019', role: 'Full-Stack Engineer', org: 'Fulusi', hi: 'React, Redux and Django, in Kampala.' },
];

export const credentials = [
  'BSc Computer Science · International University of East Africa',
  'AWS Certified Cloud Practitioner',
  'Advanced React (Triplebyte)',
];

export const howIBuild = [
  'Agents draft. I review every change before it ships, and I own the result.',
  'At StartupBlink I brought this to a team of seven: coding agents, MCP integrations, custom skills and multi-agent workflows, all under human review.',
  'On PageVow the rules are written down for the agents: no change without its tests, no bug fix without a test that fails first. 373 test files so far, from unit tests to 52 Playwright journeys.',
  'PageVow holds its own AI to the same standard: unchecked model output never gets published.',
  'I run what I ship: Cloudflare and Redis in production, 2+ deploys a week, and deploy time cut by half.',
];

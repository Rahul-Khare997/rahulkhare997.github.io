import type { LogoSpec } from '@/components/logo';

/**
 * Single source of truth for every fact on the page.
 * Mirrors public/assets/Rahul_Khare_Resume.pdf — when the PDF changes, change
 * this file, not the components.
 */

export const profile = {
  name: 'Rahul Khare',
  role: 'Program Manager — Business & Finance Operations',
  headline:
    'Program Management · Business & Finance Operations · KPI Reporting & Dashboards · Process Improvement',
  typedRoles: [
    'Program Management',
    'Business & Finance Operations',
    'KPI Reporting & Dashboards',
    'Process Improvement',
  ],
  blurb:
    'I run cross-functional programs where delivery, budget, and reporting meet — currently taking an AI mental-healthcare platform from concept to live beta.',
  photo: 'assets/rahul.jpg',
  location: 'Pune, India',
  notice: 'Notice period: 2 weeks',
  openTo: ['Pune', 'Gurugram', 'Hyderabad', 'Bengaluru', 'Mumbai', 'Delhi NCR'],
  targetRoles: [
    'Program Management',
    'Business Operations',
    'Finance Operations',
    'KPI Reporting / MIS',
    'Process Improvement',
    'Project Management',
    'Business Analysis',
  ],
  email: 'rahul.khare997@gmail.com',
  phone: '+91-9890555475',
  linkedin: 'https://linkedin.com/in/rahulkhare997',
  github: 'https://github.com/Rahul-Khare997',
  resume: 'assets/Rahul_Khare_Resume.pdf',
  contactForm:
    'https://docs.google.com/forms/d/e/1FAIpQLScIURqXHX0ZE2JzZBqTpFaKFpAnItw7x23Crsq5yoRlxjzCNg/viewform',
} as const;

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'impact', label: 'Metrics' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
] as const;

export const about = [
  'Program manager with 4+ years across an early-stage AI healthcare startup and TD Bank Group (Canada), running cross-functional programs in business and finance operations.',
  'At **Zenquip Healthcare** I own the allocation plan for **Rs 10 Cr** in new funding and the KPI reporting founders and investors run the business on. I coordinate a **15+ person** team across design, content, clinical, compliance and engineering — concept to live private beta — and have cut monthly burn and infrastructure cost **10%**.',
  'Before that, 3.5 years at **TD Bank Group**, one of Canada’s Big 5, in investment operations and reporting. I led T+1 settlement readiness training for **60+ representatives** and built dashboard automation that saved **500–750 team hours a year**, with zero compliance audit failures throughout.',
  'Relocated from Canada to India in 2025. CIRO/SEC registered across four Canadian Securities Institute designations.',
];

export type Metric = {
  value: string;
  target?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  detail: string;
  feature?: boolean;
};

export const metrics: Metric[] = [
  {
    value: 'Rs 10 Cr',
    label: 'Funding allocation plan owned',
    detail: 'Zenquip · built to founder and investor requirements; spend tracked across product, infrastructure and growth',
    feature: true,
  },
  {
    value: '10%',
    target: 10,
    suffix: '%',
    label: 'Monthly burn + infra cost cut',
    detail: 'Zenquip · direct cloud cost management and expense-control workflows, with no loss of output or quality',
    feature: true,
  },
  {
    value: '30+ / 8+ / 80+',
    label: 'Doctors / clinics / patients in beta',
    detail: 'Zenquip · grown from an initial 5 doctors and 20 patients',
  },
  {
    value: '15+',
    target: 15,
    suffix: '+',
    label: 'Cross-functional team coordinated',
    detail: 'Zenquip · design, content, clinical, compliance and legal, engineering',
  },
  {
    value: '60%',
    target: 60,
    suffix: '%',
    label: 'Demo-to-beta retention',
    detail: 'Zenquip · ~60% of 40+ product-demo participants retained into the program',
  },
  {
    value: '6',
    target: 6,
    label: 'AWS services run in production',
    detail: 'Zenquip · EC2, Lambda, Amplify, CloudWatch, Route 53, Bedrock',
  },
  {
    value: '500–750',
    label: 'Team hours saved annually',
    detail: 'TD Bank · ~25% manual effort reduction across 6+ automated dashboards',
    feature: true,
  },
  {
    value: '60+',
    target: 60,
    suffix: '+',
    label: 'Data sources automated',
    detail: 'TD Bank · SharePoint, Tableau, Excel and internal systems consolidated into role-based reports',
  },
  {
    value: 'Zero',
    label: 'Compliance audit failures',
    detail: 'TD Bank · across 3.5 years of CIRO/IIROC and internal GOS audit cycles',
    feature: true,
  },
];

export type Track = {
  id: string;
  label: string;
  bullets: string[];
  highlights: string[];
};

export type Role = {
  id: string;
  period: string;
  company: string;
  companySub: string;
  role: string;
  metaRight: string[];
  logo: LogoSpec;
  tracks: Track[];
  current?: boolean;
};

export const experience: Role[] = [
  {
    id: 'zenquip',
    period: 'Nov 2025 — Present',
    company: 'Zenquip Healthcare Pvt. Ltd.',
    companySub:
      'Early-stage AI-driven mental-healthcare platform · patient app, clinician dashboard, and AI therapy assistant “Zennie” · B2B to clinics, hospitals and corporates · Gurugram, India',
    role: 'Program Manager — Business & Finance Operations, Product Programs & Analytics',
    metaRight: ['Gurugram, India', 'Nov 2025 – Present · Current Role'],
    // Real mark. Drop a file in public/assets/logos and point `src` at it;
    // without `src` the monogram tile is used instead.
    logo: { src: 'assets/logos/zenquip.png', text: 'ZQ', color: '#0e8f86', bg: '#ffffff' },
    current: true,
    tracks: [
      {
        id: 'program',
        label: 'Program & Delivery',
        bullets: [
          'Run **end-to-end program delivery from concept to live private beta**, coordinating a **15+ person cross-functional team** across design, content, clinical, compliance and legal, and engineering',
          'Run **sprint planning, backlog grooming, and daily stand-ups in Jira and Confluence** — writing user stories, assigning work, reviewing deliverables, and tracking releases through delivery',
          'Authored **PRDs, product roadmaps, and go-to-market plans** for the B2B model targeting clinics, hospitals, and corporates',
        ],
        highlights: ['Concept → live beta', '15+ person team', 'Jira / Confluence', 'PRDs & roadmaps', 'B2B GTM'],
      },
      {
        id: 'finance',
        label: 'Finance & Business Ops',
        bullets: [
          'Built the **allocation plan for Rs 10 Cr in new funding** to founder and investor requirements; track spend across product, infrastructure, and growth',
          'Cut **monthly burn and infrastructure cost 10%** through direct cloud cost management and expense-control workflows',
          'Define and govern **KPI reporting on business costs, delivery milestones, and beta adoption** for founders and investors — used to cut spend without loss of output or quality',
        ],
        highlights: ['Rs 10 Cr allocation plan', '10% burn + infra cut', 'Investor KPI reporting', 'Expense controls'],
      },
      {
        id: 'growth',
        label: 'Growth & Beta Program',
        bullets: [
          'Grew the private beta to **30+ doctors, 8+ clinics and hospitals, and 80+ patients** from an initial 5 doctors and 20 patients',
          '**~60% of 40+ product-demo participants** retained into the beta program',
          'Iterate the product roadmap directly from clinician and patient feedback',
        ],
        highlights: ['30+ doctors', '8+ clinics & hospitals', '80+ patients', '~60% demo retention'],
      },
      {
        id: 'infra',
        label: 'Infrastructure & Compliance',
        bullets: [
          'Host and manage Zenquip’s **AWS environment** — EC2, Lambda, Amplify, CloudWatch, Route 53, and Bedrock',
          'Embedded **DPDPA and GDPR compliance** into the product: consent flows, data-handling standards, and audit readiness for clinic and hospital clients',
        ],
        highlights: ['6 AWS services in prod', 'DPDPA', 'GDPR', 'Consent flows', 'Audit readiness'],
      },
    ],
  },
  {
    id: 'td',
    period: 'Oct 2021 — Feb 2025',
    company: 'TD Bank Group — TD Direct Investing',
    companySub:
      'One of Canada’s Big 5 banks · Canada’s largest self-directed brokerage · Toronto, Canada · CIRO + SEC regulated',
    role: 'Registered Investment Representative — Investment Operations & Reporting',
    metaRight: ['CIRO/SEC Registered', 'Oct 2021 – Feb 2025 · 3.5 Years'],
    logo: { src: 'assets/logos/td.png', text: 'TD', color: '#00B140', bg: '#ffffff' },
    tracks: [
      {
        id: 'mis',
        label: 'MIS / KPI / Automation',
        bullets: [
          'Designed and deployed **6+ automated MIS/KPI dashboards** using Excel VBA, Power Query, and Power BI, consolidating 60+ data sources from SharePoint, Tableau, and internal systems into structured role-based reports adopted by **80+ reps, 6+ team leads, 2 GMs, 2 VPs, and 1 President**',
          'Dashboards tracked agent productivity, SLA, cash transfer pipeline, portfolio exposure, forecasting, and operational exceptions — saving an estimated **500–750 team hours annually** (~25% reduction, 2–3 hours daily per user)',
          'Supported implementation of a centralized **Transformation Reporting Dashboard** on SharePoint replacing legacy Excel tracking, monitoring platform migration volumes and adoption metrics across the team',
          'Following TD-GPT rollout in 2024, generated **7–10 AI-assisted documents daily** — SOPs, RCA summaries, escalation drafts, and process documentation — improving quality and reducing effort ~30%',
          'Acted as **core business analyst and liaison** during platform migration (Thinkorswim → Active Trader) — gathered structured user feedback, translated pain points into IT/PMO requirements, supported UAT and parallel testing with zero BAU disruption',
        ],
        highlights: ['6+ dashboards built', '60+ sources unified', '500–750 hrs saved', '80+ users', 'TD-GPT 7–10 docs/day'],
      },
      {
        id: 'capmarkets',
        label: 'Capital Markets Ops',
        bullets: [
          'Executed **25+ daily client trade orders** across equities, fixed income, ETFs, mutual funds, options/derivatives, GICs, bullion, and OTC instruments via Kyndryl ISM — typical ticket CAD $500K–$2M, largest CAD $10M under defined approval authority',
          'Managed **end-to-end trade lifecycle** — trade capture, prematching, confirmation matching, settlement, and fail management — within regulated deadlines across all asset classes',
          'Executed daily **cash and securities reconciliation** across **20–30 HNI accounts (CAD $15M+ AUM)**, identifying 4–5 daily exceptions and resolving **~60% independently** within **48-hour SLA**',
          'Coordinated 15+ monthly cross-border transfers and 20–25 weekly USD/CAD FX transactions up to CAD $1M each; managed US jurisdiction cases requiring Medallion Stamp documentation',
          'Processed end-to-end mutual fund, money market, and ETF transactions via **FundServ**; corporate actions, estate accounts via ATON/CDS, registered plan operations (RRSP/TFSA/RESP/RRIF)',
        ],
        highlights: ['25+ daily trades', 'CAD $10M single order', '$15M+ AUM daily', '4–5 exceptions/day', 'T+1 certified'],
      },
      {
        id: 'kyc',
        label: 'KYC / AML',
        bullets: [
          'Produced and reviewed 20+ daily KYC/CDD profiles — individuals, corporates, trusts, partnerships — via TD’s CPM platform with Refinitiv-integrated screening; **3-day SLA never missed** across 3.5 years',
          'Applied **Enhanced Due Diligence (EDD)** on ~every third interaction for high-risk or high-value transactions — geographic risk, entity type, PEP exposure, transactional behaviour',
          'Screened client profiles against **PEP indicators, OFAC/UN/CSA sanctions lists, and adverse media** using CPM, Salesforce, and TD’s internal database; full escalation trail documentation',
          'Filed **3–4 daily AML breach reports** through CIRO/SEC compliance channels; managed FATCA/CRS documentation, W-8BEN/1099 for US clients, T5/T3/T5008/NR4 tax documentation',
          'Transaction surveillance — monitored for off-market rate indicators, Cancel & Amend anomalies, front-running, and market manipulation patterns escalated via CIRO/SEC channels',
        ],
        highlights: ['20+ KYC/day', '3-day SLA 100%', 'PEP/OFAC/UN/CSA', 'FATCA/CRS', 'AML breach reports daily'],
      },
      {
        id: 'training',
        label: 'Training & Leadership',
        bullets: [
          'Led **T+1 Settlement Transition training program** — designed slide decks covering regulatory and market policy changes; delivered 5 hours of daily training across 2 weeks to **60+ representatives** ahead of the May 2024 CIRO/SEC rollout',
          'Assigned short-term **TTO (Team Transitioning Officer)** role — trained **30+ new-hire representatives** end-to-end across platform capabilities, compliance procedures, and operational workflows',
          'Independently designed and delivered **8 hours of bi-weekly training** to groups of 10–12 analysts covering reconciliation workflows, compliance procedures, policy updates, and regulatory changes',
          'Served as **Manager on Duty** on bi-weekly rotation — floor-level escalation point, approval authority, and operational decision-maker; participated in 3+ escalated client-leadership calls daily',
          'Owned a **quarterly team budget of CAD $5–10K** — tracked expenditure against plan, verified expense reports and receipts, and routed approval packages to senior management with minimal variance',
        ],
        highlights: ['60+ reps trained', 'T+1 program lead', 'TTO assignment', 'Manager on Duty', 'CAD $5–10K budget'],
      },
      {
        id: 'compliance',
        label: 'Compliance & Awards',
        bullets: [
          '**Zero compliance audit failures** across 3.5 years — cleared every weekly manager-led check and monthly CIRO/IIROC + internal GOS audit; against a peer baseline of ~2 failures per representative annually',
          'Performed daily compliance checks for **6–7 team members**, flagged regulatory fails for escalation, and maintained 100% documentation compliance across all internal and external audit cycles',
          'Monitored for **suspicious trading activity** — AML/KYC red flags, fraud, front-running, and market manipulation; escalated via CIRO/SEC channels',
          'Received **50+ Sunshine Calls** (highest on team), the Legendary Quality Experience Award, and **four consecutive top-tier annual performance ratings** for operational precision and SLA achievement',
        ],
        highlights: ['Zero audit failures', '50+ Sunshine Calls', 'Legendary QX Award', '4× top-tier rating', '100% doc compliance'],
      },
    ],
  },
];

export const earlierRoles = [
  {
    company: 'The Home Depot Canada',
    logo: { src: 'assets/logos/homedepot.svg', text: 'HD', color: '#F96302', bg: '#ffffff' },
    meta: 'Toronto · Mar 2019 – Oct 2021',
    body: 'Head Cashier — cash operations, quarterly team budget ownership, vendor invoice processing via SAP, daily till reconciliation across multiple registers, staff scheduling and onboarding. Promoted within first year.',
  },
  {
    company: 'ATA Freight India Pvt. Ltd.',
    logo: { text: 'ATA', color: '#c9a84c', bg: '#1a3c6e' },
    meta: 'Pune · Jun 2017 – Aug 2017',
    body: 'Business Analyst Intern — revenue recognition and invoicing for 100+ global clients via SAP NetWeaver, Per Diem variance reports supporting leadership cost-reduction, vendor coordination with DHL/FedEx, Agile process improvement sprints.',
  },
];

export type SkillPanel = {
  id: string;
  name: string;
  desc: string;
  bullets: string[];
  chips: { label: string; hi?: boolean }[];
};

export const skillPanels: SkillPanel[] = [
  {
    id: 'program',
    name: 'Program & Delivery',
    desc: 'Roadmaps · Sprints · Cross-functional',
    bullets: [
      'Run **end-to-end program delivery from concept to live private beta**, coordinating a **15+ person cross-functional team** across five functions',
      'Run **sprint planning, backlog grooming, and daily stand-ups in Jira and Confluence** — user stories, work assignment, deliverable review, release tracking',
      'Authored **PRDs, product roadmaps, and go-to-market plans** for a B2B model targeting clinics, hospitals, and corporates',
      'At TD, acted as **core business liaison** on a major trading platform migration — requirements, UAT, parallel testing',
    ],
    chips: [
      { label: 'Program Management', hi: true },
      { label: 'End-to-End Delivery', hi: true },
      { label: 'Jira', hi: true },
      { label: 'Confluence', hi: true },
      { label: 'PRDs & User Stories' },
      { label: 'Roadmaps' },
      { label: 'Sprint Planning' },
      { label: 'Stakeholder Management' },
      { label: 'Go-to-Market (B2B)' },
    ],
  },
  {
    id: 'finops',
    name: 'Business & Finance Ops',
    desc: 'Budget · Burn control · Investor reporting',
    bullets: [
      'Built the **allocation plan for Rs 10 Cr in new funding** to founder and investor requirements; track spend across product, infrastructure, and growth',
      'Cut **monthly burn and infrastructure cost 10%** through direct cloud cost management and expense-control workflows',
      'Define and govern **KPI reporting on business costs, delivery milestones, and beta adoption** for founders and investors',
      'At TD, owned a **quarterly team budget of CAD $5–10K** with expense verification and approval routing',
    ],
    chips: [
      { label: 'Budget Planning & Allocation', hi: true },
      { label: 'Burn-Rate Analysis', hi: true },
      { label: 'Investor Reporting', hi: true },
      { label: 'Cost Control', hi: true },
      { label: 'Forecasting' },
      { label: 'Variance Analysis' },
      { label: 'Expense Controls' },
      { label: 'SAP Purchase Orders' },
    ],
  },
  {
    id: 'mis',
    name: 'KPI Reporting & Dashboards',
    desc: 'Dashboard automation · Power BI · VBA',
    bullets: [
      'Designed and deployed **6+ automated MIS/KPI dashboards** (Excel VBA, Power Query, Power BI) consolidating 60+ data sources into structured role-based reports',
      'Adopted by **80+ representatives, 6+ team leads, 2 Group Managers, 2 VPs, and 1 President** — saving **500–750 team hours annually**',
      'Coverage included agent productivity, SLA tracking, cash transfer pipeline, portfolio exposure, forecasting, and operational exceptions',
      'Built a **Transformation Reporting Dashboard** on SharePoint replacing legacy Excel tracking',
    ],
    chips: [
      { label: 'Excel VBA', hi: true },
      { label: 'Power Query', hi: true },
      { label: 'Power BI', hi: true },
      { label: 'KPI Design', hi: true },
      { label: 'INDEX-MATCH / XLOOKUP' },
      { label: 'Pivot Tables' },
      { label: 'SQL (Working)' },
      { label: 'Tableau' },
      { label: 'SharePoint' },
    ],
  },
  {
    id: 'process',
    name: 'Process Improvement',
    desc: 'RCA · Workflow design · SLA management',
    bullets: [
      'Structured **Root Cause Analysis (RCA)** distinguishing system-driven discrepancies from genuine exposure events, with full audit trail documentation',
      'First line of defence **(1LOD) operational risk** — daily control checks, exception management, breach escalation',
      '**Zero audit failures** across 3.5 years; compliance oversight for 6–7 team members daily',
      'Managed transaction-specific SLAs from same-day to 15-day timelines in a highly regulated environment',
    ],
    chips: [
      { label: 'Root Cause Analysis', hi: true },
      { label: 'Exception Management', hi: true },
      { label: 'SLA Management', hi: true },
      { label: 'UAT' },
      { label: 'Change Management' },
      { label: 'Process Documentation' },
      { label: 'KRI Tracking' },
    ],
  },
  {
    id: 'capmarkets',
    name: 'Capital Markets Operations',
    desc: 'Trade lifecycle · Settlement · Reconciliation',
    bullets: [
      'End-to-end **trade lifecycle management** — capture, prematching, confirmation matching, settlement, and fail management across all asset classes',
      'Executed **25+ daily trade orders**; typical ticket CAD $500K–$2M, largest **CAD $10M**',
      'Daily **cash and securities reconciliation** across **20–30 HNI accounts (CAD $15M+ AUM)**; ~60% of exceptions resolved independently',
      'Led **T+1 Settlement Transition training** for 60+ representatives ahead of the May 2024 rollout',
    ],
    chips: [
      { label: 'Trade Execution', hi: true },
      { label: 'Reconciliation', hi: true },
      { label: 'T+1 Settlement', hi: true },
      { label: 'DVP/RVP' },
      { label: 'FX Processing' },
      { label: 'Corporate Actions' },
      { label: 'FundServ' },
    ],
  },
  {
    id: 'kyc',
    name: 'KYC / AML / Compliance',
    desc: 'Due diligence · Sanctions · DPDPA / GDPR',
    bullets: [
      'Reviewed **20+ daily KYC/CDD profiles** via CPM with Refinitiv-integrated screening; **3-day SLA never missed** across 3.5 years',
      'Applied **Enhanced Due Diligence (EDD)**; PEP/OFAC/UN/CSA sanctions and adverse media screening with full audit trail',
      'Filed **3–4 daily AML breach reports** through CIRO/SEC channels; FATCA/CRS and tax documentation',
      'At Zenquip, embedded **DPDPA and GDPR** into the product — consent flows, data-handling standards, audit readiness',
    ],
    chips: [
      { label: 'CDD / EDD', hi: true },
      { label: 'PEP Screening', hi: true },
      { label: 'Sanctions (OFAC/UN/CSA)', hi: true },
      { label: 'DPDPA / GDPR', hi: true },
      { label: 'FATCA / CRS' },
      { label: 'Adverse Media' },
      { label: 'Risk Rating' },
    ],
  },
  {
    id: 'ai',
    name: 'AI, Cloud & Automation',
    desc: 'AWS · TD-GPT · Agentic workflows',
    bullets: [
      'Host and manage Zenquip’s **AWS environment** — EC2, Lambda, Amplify, CloudWatch, Route 53, and Bedrock',
      '**TD-GPT** — 7–10 AI-assisted documents daily post-rollout; SOPs, RCA summaries, escalation drafts, reducing effort ~30%',
      '**Claude Code, Cursor, ChatGPT, Gemini, Copilot** — AI-assisted product development and workflow automation',
      '**n8n, Power Automate, MCP integrations** applied to operations and reporting workflows',
    ],
    chips: [
      { label: 'AWS (EC2 / Lambda)', hi: true },
      { label: 'CloudWatch', hi: true },
      { label: 'Bedrock', hi: true },
      { label: 'TD-GPT' },
      { label: 'Claude Code / Cursor' },
      { label: 'n8n' },
      { label: 'Power Automate' },
      { label: 'MCP Integrations' },
    ],
  },
];

export type Project = {
  num: string;
  title: string;
  org: string;
  description: string;
  impact: string;
};

export const projects: Project[] = [
  {
    num: '01',
    title: 'Zenquip Private Beta — Concept to Launch',
    org: 'Zenquip Healthcare · 2025—2026',
    description:
      'End-to-end program delivery for an AI mental-healthcare platform — patient app, clinician dashboard, AI therapy assistant “Zennie” — coordinating a 15+ person team across design, content, clinical, compliance and legal, and engineering.',
    impact: '30+ doctors · 8+ clinics & hospitals · 80+ patients · ~60% demo retention',
  },
  {
    num: '02',
    title: 'Rs 10 Cr Allocation Plan & Burn Reduction',
    org: 'Zenquip Healthcare · 2025—2026',
    description:
      'Built the funding allocation plan to founder and investor requirements, then cut recurring cost through direct cloud cost management and expense-control workflows. Defined the KPI reporting the business is run on.',
    impact: '↓ 10% monthly burn + infra cost · No loss of output or quality',
  },
  {
    num: '03',
    title: 'MIS/KPI Dashboard Automation Suite',
    org: 'TD Bank · 2022—2024',
    description:
      '6+ automated dashboards (Excel VBA + Power Query + Power BI) consolidating 60+ data sources into structured role-based reports. Adopted enterprise-wide up to VP and President level.',
    impact: '↓ 500–750 hrs/year · 80+ users · 60+ sources unified',
  },
  {
    num: '04',
    title: 'T+1 Settlement Transition Program',
    org: 'TD Bank · 2024',
    description:
      'Led T+1 readiness training ahead of the May 2024 CIRO/SEC rollout. Designed training decks covering regulatory policy, market policy, and settlement workflow changes. Delivered 5 hrs/day across 2 weeks.',
    impact: '60+ reps trained · On-time transition',
  },
  {
    num: '05',
    title: 'Platform Migration — Active Trader',
    org: 'TD Bank · 2022—2023',
    description:
      'Core business analyst and liaison for TD’s trading platform migration (Thinkorswim → Active Trader). Gathered structured user feedback, translated pain points into IT/PMO requirements, supported UAT and parallel testing.',
    impact: 'Zero BAU disruption · Full UAT coverage',
  },
  {
    num: '06',
    title: 'HNI Client Migration Program',
    org: 'TD Bank · 2023',
    description:
      'Identified HNI self-directed clients suitable for TD Private Investment Advice through structured suitability conversations. Designed outreach strategy and client communication plan.',
    impact: '~60% conversion rate · Strategic AUM growth',
  },
  {
    num: '07',
    title: 'AI-Based Underwriting Capstone',
    org: 'Seneca College · 2020',
    description:
      'Business Analyst for a simulated AI-based underwriting rollout. Authored INVEST user stories, mapped As-Is/To-Be workflows, managed the full Agile sprint backlog in Jira.',
    impact: 'Honours · GPA 3.9/4.0',
  },
  {
    num: '08',
    title: 'Portfolio Website — AI-Assisted Build',
    org: 'Personal Project · 2025—2026',
    description:
      'Built this site with AI-assisted development (Claude Code, prompt engineering, MCP integrations). Next.js static export on GitHub Pages.',
    impact: 'Live: rahul-khare997.github.io',
  },
];

export const education = [
  {
    year: '2020 · Honours',
    degree: 'Post-Graduate Certificate — Financial Technology (FinTech)',
    school: 'Seneca College, Toronto, Canada',
    note: 'GPA 3.9 / 4.0',
  },
  {
    year: '2019 · Honours',
    degree: 'Post-Graduate Certificate — Financial Services',
    school: 'Algonquin College, Ottawa, Canada',
    note: 'GPA 3.65 / 4.0',
  },
  {
    year: '2015—2018',
    degree: 'BBA (Hons.) — Finance & Management',
    school: 'Bharati Vidyapeeth (IMED), Pune, India',
    note: 'CGPA 7.4 / 10',
  },
];

export const certifications = {
  note: 'CSI = Canadian Securities Institute — Canada’s national securities licensing body (equivalent to SEBI/NISM in India; analogous to FINRA Series 7 in the US)',
  items: [
    { name: 'Canadian Securities Course (CSC)', issuer: 'CSI — CIRO/SEC Registered' },
    { name: 'Conduct and Practices Handbook (CPH)', issuer: 'CSI — CIRO/SEC Registered' },
    { name: 'Derivatives Fundamentals & Options Licensing (DFOL)', issuer: 'CSI — CIRO/SEC Registered' },
    { name: 'Personal Financial Services Advice (PFSA)', issuer: 'CSI — CIRO/SEC Registered' },
    { name: 'Anthropic AI Courses', issuer: 'Anthropic — AI & Workflow Automation' },
    { name: 'CyberSecurity', issuer: 'LinkedIn Learning' },
  ],
};

export const languages = [
  { name: 'English', level: 'Full Professional', hi: true },
  { name: 'Hindi', level: 'Native/Bilingual', hi: true },
  { name: 'German', level: 'Limited Working' },
];

export const awards = [
  '50+ Sunshine Calls (highest on team)',
  'Legendary Quality Experience Award',
  'Four consecutive top-tier performance ratings',
  '98%+ service quality score',
  'Zero compliance audit failures across 3.5 years',
];

export const ticker = [
  'PROGRAM MANAGEMENT',
  'BUSINESS & FINANCE OPS',
  'KPI REPORTING',
  'PROCESS IMPROVEMENT',
  'BUDGET & BURN CONTROL',
  'JIRA / CONFLUENCE',
  'POWER BI',
  'EXCEL VBA',
  'AWS',
  'DPDPA / GDPR',
  'CAPITAL MARKETS',
  'KYC / AML',
  'CIRO / SEC REGISTERED',
];

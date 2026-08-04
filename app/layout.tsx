import type { Metadata } from 'next';
import { DM_Serif_Display, Inter, JetBrains_Mono } from 'next/font/google';
import { profile } from '@/lib/content';
import './globals.css';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans-face', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono-face', display: 'swap' });
const serif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif-face',
  display: 'swap',
});

const SITE = 'https://rahul-khare997.github.io';
const TITLE = `${profile.name} — Program Management | Business & Finance Operations | KPI Reporting`;
const DESCRIPTION =
  'Program Manager at Zenquip Healthcare and ex-TD Bank Canada. Program delivery, business and finance operations, KPI reporting and dashboards, process improvement. Notice period: 2 weeks.';

const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='13' fill='%23050d1a'/%3E%3Crect x='2.5' y='2.5' width='59' height='59' rx='11' fill='none' stroke='%23c9a84c' stroke-width='2'/%3E%3Ctext x='32' y='44' font-family='Georgia,Times,serif' font-size='32' font-weight='700' fill='%23c9a84c' text-anchor='middle'%3ERK%3C/text%3E%3C/svg%3E";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: profile.name }],
  alternates: { canonical: '/' },
  icons: { icon: FAVICON },
  openGraph: {
    type: 'website',
    title: TITLE,
    description: DESCRIPTION,
    url: SITE,
    siteName: `${profile.name} — Portfolio`,
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  url: SITE,
  jobTitle: 'Program Manager — Business & Finance Operations, Product Programs & Analytics',
  description: DESCRIPTION,
  email: `mailto:${profile.email}`,
  telephone: profile.phone,
  worksFor: { '@type': 'Organization', name: 'Zenquip Healthcare Pvt. Ltd.' },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Pune',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'Seneca College' },
    { '@type': 'CollegeOrUniversity', name: 'Algonquin College' },
    { '@type': 'CollegeOrUniversity', name: 'Bharati Vidyapeeth (IMED)' },
  ],
  knowsAbout: [
    'Program Management',
    'Business Operations',
    'Finance Operations',
    'Budget Planning & Allocation',
    'KPI Reporting',
    'Process Improvement',
    'Jira',
    'AWS',
    'Power BI',
  ],
  sameAs: [profile.linkedin, profile.github],
};

/**
 * Runs before paint: restores theme and recruiter mode so neither flashes,
 * and marks the document JS-capable. If this never runs, `.js` is absent and
 * no content is hidden by entrance animations.
 */
const bootScript = `
(function(){
  var d = document.documentElement;
  d.classList.add('js');
  try {
    var t = localStorage.getItem('theme');
    var light = t === 'light';
    d.classList.toggle('light', light);
    d.classList.toggle('dark', !light);
    if (localStorage.getItem('recruiter') === '1') d.classList.add('recruiter');
  } catch (e) { d.classList.add('dark') }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${serif.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script
          type="application/ld+json"
          // Static object defined above; `<` escaped so a stray sequence
          // could never close the script tag early.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

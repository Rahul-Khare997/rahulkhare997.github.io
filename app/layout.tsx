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

/** OG/Twitter card, favicons and the mark itself all derive from the RK
 *  logo — sources in .logo-sources/, derived files in public/assets/brand/. */
const OG_IMAGE = {
  url: '/assets/brand/og.png',
  width: 1200,
  height: 630,
  alt: `${profile.name} — Program Manager, Business & Finance Operations`,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: profile.name }],
  alternates: { canonical: '/' },
  icons: {
    icon: [
      { url: '/assets/brand/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/assets/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/assets/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/assets/brand/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    title: TITLE,
    description: DESCRIPTION,
    url: SITE,
    siteName: `${profile.name} — Portfolio`,
    locale: 'en_IN',
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
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

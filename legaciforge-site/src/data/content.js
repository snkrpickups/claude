// ─────────────────────────────────────────────────────────────────────────
//  LEGACI FORGE — CONTENT CONFIG
//  Single source of truth. All copy is final (per client). Images load from
//  legaciforge.org; if any fails it falls back to a forged-metal gradient.
// ─────────────────────────────────────────────────────────────────────────

const CDN = 'https://legaciforge.org/wp-content/uploads'
const A = (path) => `${CDN}/${path}`

export const assets = {
  logo: A('2025/05/Legacy-Forge.png'),
  forge: A('2026/03/Forge.jpg'),
  legaci: A('2026/03/legaci.jpg'),
}

// ── Brand motifs that recur throughout the site ───────────────────────────
export const motifs = {
  headlinePrimary: 'Forging Leaders.\nBuilding Legacies.',
  headlineSecondary: 'Legacy is not inherited. It’s forged.',
  motto: 'Veni. Vidi. Novi.',
  mottoTranslation: 'I came. I saw. I know.',
  scripture: 'As iron sharpens iron, so one person sharpens another.',
  scriptureRef: 'Proverbs 27:17 (NIV)',
}

export const brand = {
  name: 'Legaci Forge',
  domain: 'legaciforge.org',
  org: 'A 501(c)(3) educational nonprofit. IRS determination pending.',
  contactPath: '/contact#form',
  programsLabel: 'our programs',
}

// ── Forged-metal gradient palettes (drive image fallbacks per program) ─────
const palettes = {
  amber: ['#c6822f', '#1a0f04'],
  steel: ['#6f7882', '#0e1116'],
  molten: ['#d9742a', '#1c0c04'],
}

// ─────────────────────────────────────────────────────────────────────────
//  THE PROGRAMS  (Sections 2, 3, 5) — exactly 3
// ─────────────────────────────────────────────────────────────────────────
export const programs = [
  {
    id: 'business-of-you',
    name: 'Business of YOU™',
    tagline: 'The Game Beyond the Game',
    subtagline: 'Built For Competitors. Designed For Life.',
    audience: ['elite & collegiate athletes', 'olympic & NIL athletes'],
    palette: palettes.amber,
    image: A('2026/03/vollebal.jpg'),
    rotationImages: [],
    pillars: [
      { title: 'Command The Numbers', tag: 'Finance of YOU™' },
      { title: 'Control The Capital', tag: 'Business of YOU™' },
      { title: 'Cultivate The Influence', tag: 'Future of YOU™' },
    ],
    sequence: {
      title: 'Iron Sharpens Iron',
      tabs: [
        { term: 'Veni', meaning: 'I Came' },
        { term: 'Vidi', meaning: 'I Saw' },
        { term: 'Novi', meaning: 'I Know' },
      ],
    },
    quote: {
      text:
        'We glamorize the spotlight and the contract because we think it’s sexy. You know what’s really sexy? Not running out of money.',
      who: 'Dr. Tim Naddy, Founder',
    },
    partner: 'powered by Wealthvox / Color Accounting™',
    href: brand.contactPath,
  },
  {
    id: 'hustle-academy',
    name: 'The Hustle Academy™',
    tagline: 'Stop Waiting. Start Building.',
    subtagline: 'Entrepreneurship Education Evolved.',
    audience: ['emerging leaders & student innovators', 'U.S. Armed Forces veterans'],
    palette: palettes.steel,
    image: A('2026/03/tehc.jpg'),
    rotationImages: [],
    pillars: [
      { title: 'Think Like An Owner', tag: '' },
      { title: 'Build With Discipline', tag: 'Followers talk about ideas. Founders build them.' },
      { title: 'Present With Confidence', tag: '' },
    ],
    sequence: {
      title: 'The Why Knot',
      tabs: [
        { term: 'What?', meaning: 'Awareness' },
        { term: 'Why?', meaning: 'Commitment' },
        { term: 'How?', meaning: 'Execution' },
      ],
    },
    veterans: {
      heading: 'Serving Those Who’ve Already Served',
      closing: 'Command the numbers. Control the outcome. Communicate with authority.',
      image: A('2026/03/military2.jpg'),
    },
    quote: {
      text:
        'Leadership isn’t inherited, it’s forged… That’s the very definition of hustle.',
      who: 'Keith Walker, CoFounder',
    },
    partner: '',
    href: brand.contactPath,
  },
  {
    id: 'legaci-amplify',
    name: 'Legaci Amplify™',
    tagline: 'Talent Deserves a Stage',
    subtagline: 'Where Preparation Meets Opportunity.',
    audience: ['disciplined founders', 'fellows & future leaders'],
    palette: palettes.molten,
    image: A('2026/03/science.jpg'),
    rotationImages: [],
    pillars: [
      { title: 'Expand The Signal', tag: 'Good ideas die in small rooms' },
      { title: 'Shape The Message', tag: 'Relevance matters' },
      { title: 'Connect The Dots', tag: 'There’s power in proximity' },
    ],
    sequence: {
      title: 'Amplify In Action',
      tabs: [
        { term: 'Founder', meaning: 'The origin' },
        { term: 'Fellowship', meaning: 'The room' },
        { term: 'Future', meaning: 'The stage' },
      ],
    },
    note: 'The media & exposure engine — including our signature gala pitch event.',
    quote: {
      text:
        'The best ideas don’t always win. The best distributed ideas do. Legaci Amplify™ ensures disciplined leaders aren’t invisible.',
      who: 'Ryan Monahan, Board Member',
    },
    partner: '',
    href: brand.contactPath,
  },
]

// ─────────────────────────────────────────────────────────────────────────
//  WHY IT MATTERS  (Section 4 manifesto)
// ─────────────────────────────────────────────────────────────────────────
export const whyItMatters = {
  label: 'why it matters',
  statements: [
    'Athletes earn earlier and leaders build sooner — yet most financial education stops at vocabulary, not application.',
    'Understanding money is not the same as commanding it.',
    'Clear mechanics improve decisions.',
    'Improved decisions compound.',
    'That’s the difference between information and impact.',
  ],
}

// ─────────────────────────────────────────────────────────────────────────
//  WHO WE ARE  (full-bleed conviction block)
// ─────────────────────────────────────────────────────────────────────────
export const whoWeAre = {
  label: 'who we are',
  lines: [
    'We are not here to motivate.',
    'We are here to prepare.',
    'We do not romanticize potential.',
    'We forge capability.',
  ],
  image: assets.forge,
}

// ─────────────────────────────────────────────────────────────────────────
//  FOOTER  (Section 6)
// ─────────────────────────────────────────────────────────────────────────
export const footer = {
  closing: 'Forging Leaders.\nBuilding Legacies.',
  links: [
    { label: 'Business of YOU™', href: '#offering-business-of-you' },
    { label: 'The Hustle Academy™', href: '#offering-hustle-academy' },
    { label: 'Legaci Amplify™', href: '#offering-legaci-amplify' },
    { label: 'Join The Forge', href: '/contact' },
    { label: 'Community Impact Statement', href: '/community-impact-statement.pdf', external: true },
    { label: 'Contact Us', href: '/contact#form' },
  ],
  socials: [{ label: 'LinkedIn', href: 'https://linkedin.com/company/legaci-forge' }],
  legal: '© 2026 Legaci Forge. All rights reserved. A 501(c)(3) educational nonprofit. IRS determination pending.',
}

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

// ─────────────────────────────────────────────────────────────────────────
//  CALCULATOR — "Business of YOU™: run the numbers"
//  Estimate-only engagement tool. Adjust defaults/labels freely.
// ─────────────────────────────────────────────────────────────────────────
export const calculator = {
  label: 'business of you™',
  heading: 'run the numbers.',
  sub: 'Before you sign anything, see what you actually keep. Pick your state.',
  hook: '78% of pro athletes are under financial stress within two years of retiring. The Business of YOU™ exists so you’re not one of them.',
  disclaimer: 'Rough estimate for illustration only — not financial, tax, or legal advice. Uses top marginal rates.',
  enterCta: 'enter the forge',
  enterNote: 'this is one tool. see what we’re building.',
  share: {
    button: 'share my number',
    title: 'share your number',
    sub: 'AirDrop it, text it, post it. They scan — they run theirs.',
    namePlaceholder: 'your name (optional)',
    shareCta: 'share',
    saveCta: 'save image',
    copyCta: 'copy link',
    copied: 'link copied',
    text: 'Most athletes have no idea what they actually keep. I ran my numbers on Legaci Forge — run yours:',
  },
  // "What do you do with it?" reveal step (compound projection + lead capture)
  paths: {
    prompt: 'so… what do you do with it?',
    question: 'What do you do with your',
    horizons: [10, 20, 30],
    defaultHorizon: 20,
    projectionLead: 'put to work, this could become',
    horizonLabel: 'in {years} years',
    note: 'Hypothetical — assumes a {rate}% average annual return, compounded. Not a guarantee or financial advice.',
    backLabel: 'choose another path',
    // Inline lead-capture form opened by a path CTA. Set `endpoint` to a
    // Formspree/Mailchimp/your-API URL to go live; while empty it runs in demo
    // mode. Posts JSON: { name, email, interest, deal, state, taxPct,
    // takeHome, path, horizonYears, projectedValue }.
    lead: {
      sub: 'Drop your details and we’ll help you build the plan behind this number.',
      name: 'first name',
      email: 'your email',
      cta: 'send it to the forge',
      success: 'We’ve got it. The forge will be in touch.',
      error: 'Something went wrong — try again, or email us directly.',
      endpoint: '',
    },
    options: [
      {
        id: 'passive',
        label: 'Passive',
        tagline: 'Make it work while you sleep.',
        detail: 'Index funds, real estate, dividends.',
        rate: 7,
        cta: 'learn to command it',
        interest: 'passive-investing',
      },
      {
        id: 'active',
        label: 'Active',
        tagline: 'Build something of your own.',
        detail: 'A business, a brand, your next venture.',
        rate: 12,
        cta: 'learn to build it',
        interest: 'active-investing',
      },
      {
        id: 'protect',
        label: 'Protect it',
        tagline: 'Lock in your foundation first.',
        detail: 'Savings, insurance, an emergency fund.',
        rate: 4,
        cta: 'learn to protect it',
        interest: 'protect-capital',
      },
      {
        id: 'idk',
        label: 'I don’t know',
        tagline: 'That’s exactly why we’re here.',
        detail: 'Let’s figure it out together.',
        contact: true,
        cta: 'talk to us',
        message: 'Most people never get taught this. That’s the whole point of Business of YOU™ — we’ll walk you through it, no pressure.',
        interest: 'guidance',
      },
    ],
  },
  // Tax = federalRate + the selected state's top marginal income-tax rate.
  federalRate: 37,
  defaultState: 'CA',
  noTaxNote: 'no state income tax — that’s the advantage athletes move for.',
  states: [
    { code: 'AL', name: 'Alabama', rate: 5.0 },
    { code: 'AK', name: 'Alaska', rate: 0 },
    { code: 'AZ', name: 'Arizona', rate: 2.5 },
    { code: 'AR', name: 'Arkansas', rate: 4.4 },
    { code: 'CA', name: 'California', rate: 13.3 },
    { code: 'CO', name: 'Colorado', rate: 4.4 },
    { code: 'CT', name: 'Connecticut', rate: 6.99 },
    { code: 'DE', name: 'Delaware', rate: 6.6 },
    { code: 'DC', name: 'Washington, D.C.', rate: 10.75 },
    { code: 'FL', name: 'Florida', rate: 0 },
    { code: 'GA', name: 'Georgia', rate: 5.39 },
    { code: 'HI', name: 'Hawaii', rate: 11.0 },
    { code: 'ID', name: 'Idaho', rate: 5.8 },
    { code: 'IL', name: 'Illinois', rate: 4.95 },
    { code: 'IN', name: 'Indiana', rate: 3.05 },
    { code: 'IA', name: 'Iowa', rate: 5.7 },
    { code: 'KS', name: 'Kansas', rate: 5.7 },
    { code: 'KY', name: 'Kentucky', rate: 4.0 },
    { code: 'LA', name: 'Louisiana', rate: 4.25 },
    { code: 'ME', name: 'Maine', rate: 7.15 },
    { code: 'MD', name: 'Maryland', rate: 5.75 },
    { code: 'MA', name: 'Massachusetts', rate: 9.0 },
    { code: 'MI', name: 'Michigan', rate: 4.25 },
    { code: 'MN', name: 'Minnesota', rate: 9.85 },
    { code: 'MS', name: 'Mississippi', rate: 4.7 },
    { code: 'MO', name: 'Missouri', rate: 4.8 },
    { code: 'MT', name: 'Montana', rate: 5.9 },
    { code: 'NE', name: 'Nebraska', rate: 5.84 },
    { code: 'NV', name: 'Nevada', rate: 0 },
    { code: 'NH', name: 'New Hampshire', rate: 0 },
    { code: 'NJ', name: 'New Jersey', rate: 10.75 },
    { code: 'NM', name: 'New Mexico', rate: 5.9 },
    { code: 'NY', name: 'New York', rate: 10.9 },
    { code: 'NC', name: 'North Carolina', rate: 4.5 },
    { code: 'ND', name: 'North Dakota', rate: 2.5 },
    { code: 'OH', name: 'Ohio', rate: 3.5 },
    { code: 'OK', name: 'Oklahoma', rate: 4.75 },
    { code: 'OR', name: 'Oregon', rate: 9.9 },
    { code: 'PA', name: 'Pennsylvania', rate: 3.07 },
    { code: 'RI', name: 'Rhode Island', rate: 5.99 },
    { code: 'SC', name: 'South Carolina', rate: 6.4 },
    { code: 'SD', name: 'South Dakota', rate: 0 },
    { code: 'TN', name: 'Tennessee', rate: 0 },
    { code: 'TX', name: 'Texas', rate: 0 },
    { code: 'UT', name: 'Utah', rate: 4.55 },
    { code: 'VT', name: 'Vermont', rate: 8.75 },
    { code: 'VA', name: 'Virginia', rate: 5.75 },
    { code: 'WA', name: 'Washington', rate: 0 },
    { code: 'WV', name: 'West Virginia', rate: 5.12 },
    { code: 'WI', name: 'Wisconsin', rate: 7.65 },
    { code: 'WY', name: 'Wyoming', rate: 0 },
  ],
  inputs: {
    deal: { label: 'Deal value', min: 50000, max: 10000000, step: 50000, default: 1000000, prefix: '$' },
    agent: { label: 'Agent / management', min: 0, max: 20, step: 0.5, default: 10, suffix: '%' },
    expenses: { label: 'Training, travel & lifestyle', min: 0, max: 40, step: 1, default: 15, suffix: '%' },
  },
}

// ─────────────────────────────────────────────────────────────────────────
//  WAITLIST — "Join The Forge"
//  Set `endpoint` to a Formspree/Mailchimp/your-API URL to go live. While it's
//  empty the form runs in demo mode (validates + shows the success state, no
//  network call). The field posts as { email } via POST JSON.
// ─────────────────────────────────────────────────────────────────────────
export const waitlist = {
  label: 'join the forge',
  heading: 'The next class is forming.',
  sub: 'Be first to know when applications open. No spam — just the work.',
  scarcity: 'founding cohort · limited seats',
  placeholder: 'your email',
  cta: 'request access',
  success: 'You’re on the list. Welcome to the forge.',
  error: 'Something went wrong. Try again or email us directly.',
  endpoint: '', // e.g. 'https://formspree.io/f/xxxx'
}


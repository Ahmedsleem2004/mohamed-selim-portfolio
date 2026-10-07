/**
 * Single source of truth for all content on the site.
 * Only facts supplied by Mohamed Selim Ismail are used here.
 *
 * TO UPDATE LATER
 *  - portrait:       put the image in /public (e.g. /public/portrait.jpg) and set portrait: '/portrait.jpg'
 *  - certificates:   put images in /public/certificates and set image: '/certificates/name.jpg'
 *                    (optionally add title / issuer — leave null until they are provided)
 *  - contact:        replace the null values with the real email / phone
 *  - statement:      the quote is a DESIGN PLACEHOLDER — replace with the final wording
 */

export const profile = {
  name: 'Mohamed Selim Ismail',
  first: 'MOHAMED',
  middle: 'SELIM',
  last: 'ISMAIL',
  title: 'Sales Manager',
  company: 'Al-Dagal Waste Transportation & Contracting',
  location: 'Madinah, Saudi Arabia',

  // Set to a path such as '/portrait.jpg' when the professional portrait is available.
  portrait: null,

  // DESIGN PLACEHOLDER quote — one array item per visual line.
  statement: [
    'Leadership is not about',
    'occupying a position.',
    'It is about creating',
    'direction, building trust,',
    'and delivering results.',
  ],

  summary:
    'Mohamed Selim Ismail is a Sales Manager with more than 10 years of professional experience across sales and operations management roles in Saudi Arabia.',

  // Chronological: earliest → current.
  career: [
    {
      no: '01',
      lines: ['AL-NAJM', 'AL-SAMAWI'],
      role: 'Operations Manager',
      years: 3,
      location: 'Madinah, Saudi Arabia',
      current: false,
    },
    {
      no: '02',
      lines: ['AL ANDALUS', 'HOTEL'],
      role: 'Operations Manager',
      years: 2,
      location: 'Madinah, Saudi Arabia',
      current: false,
    },
    {
      no: '03',
      lines: ['AL-DAGAL'],
      role: 'Sales Manager',
      years: 5,
      location: 'Madinah, Saudi Arabia',
      current: true,
    },
  ],

  // The company's world, as described by the profile owner.
  companyAreas: [
    'Waste Transportation',
    'Contracting',
    'Operations',
    'Business Services',
  ],

  // Capability categories (visual structure only — no quantified claims).
  expertise: [
    {
      name: 'Sales Management',
      text: 'Directing sales activity, pipelines and targets with discipline and focus.',
    },
    {
      name: 'Operations Management',
      text: 'Keeping people, processes and resources running as one reliable system.',
    },
    {
      name: 'Leadership',
      text: 'Setting direction, earning trust and holding the standard for a team.',
    },
    {
      name: 'Business Development',
      text: 'Opening new markets, relationships and opportunities for the business.',
    },
    {
      name: 'Negotiation',
      text: 'Reaching agreements that protect value and strengthen the relationship.',
    },
    {
      name: 'Client Relations',
      text: 'Building long-term partnerships grounded in responsiveness and trust.',
    },
    {
      name: 'Team Management',
      text: 'Aligning, developing and motivating people toward shared results.',
    },
    {
      name: 'Strategic Planning',
      text: 'Turning long-term vision into clear priorities and measured steps.',
    },
  ],

  // Verified figures only.
  impact: [
    {
      value: 10,
      suffix: '+',
      label: 'Years Experience',
    },
    {
      value: 5,
      suffix: '',
      label: 'Years at Al-Dagal',
    },
    {
      value: 3,
      suffix: '',
      label: 'Leadership Roles',
    },
  ],

  // Placeholders — replace image/title/issuer when the documents are provided.
  certificates: [
  {
    id: '01',
    image: null,
    title: 'Diploma in Sales Management',
    issuer: 'Alison',
  },
  {
    id: '02',
    image: null,
    title: 'Diploma in Operations Management',
    issuer: 'Alison',
  },
  {
    id: '03',
    image: null,
    title: 'Certificate of Appreciation — Community Service',
    issuer: 'Seven for Organization',
  },
],

  language: {
    name: 'English',
    level: 'Fluent',
  },

  // Contact information.
  contact: {
    email: 'm.salim@masdevco.com',
    phone: '+966539263604',
    location: 'Madinah, Saudi Arabia',
  },
}

export const navLinks = [
  {
    label: 'PROFILE',
    target: '#profile',
  },
  {
    label: 'CAREER',
    target: '#career',
  },
  {
    label: 'EXPERTISE',
    target: '#expertise',
  },
  {
    label: 'ARCHIVE',
    target: '#archive',
  },
  {
    label: 'CONTACT',
    target: '#contact',
  },
]
import type { AssistantAnswer } from '../types';
import { mockStandards } from './standards';

const genericSources = [
  {
    title: 'BIS Know Your Standard',
    url: 'https://www.bis.gov.in/know-your-standard/',
    page: undefined,
    excerpt: 'Search tool for confirming the current status and title of an Indian Standard by number.',
    sourceType: 'Official BIS' as const,
  },
  {
    title: 'BIS Product Certification Overview',
    url: 'https://www.bis.gov.in/product-certification/',
    page: 4,
    excerpt: 'Describes the ISI Mark (Scheme-I) certification process for licensed manufacturers.',
    sourceType: 'Official BIS' as const,
  },
];

function findStandardMatch(query: string) {
  const q = query.toLowerCase();
  return mockStandards.find((s) =>
    q.includes(s.category.toLowerCase().split(' ')[0]) ||
    s.title.toLowerCase().split(' ').some((word) => word.length > 4 && q.includes(word))
  );
}

export function generateMockAnswer(query: string): AssistantAnswer {
  const match = findStandardMatch(query) ?? mockStandards[0];

  if (/hallmark|jewel|gold/i.test(query)) {
    return {
      answer:
        'Based on available BIS information, gold jewellery and artefacts sold in India are generally required to carry a BIS Hallmark, which certifies purity and includes a unique HUID number. Jewellers must be registered with BIS, and testing takes place at a registered Assaying & Hallmarking Centre.',
      confidence: 'High',
      certification: 'Hallmarking (mandatory, subject to notified exemptions)',
      testing: 'Testing performed at a registered Assaying & Hallmarking Centre (AHC)',
      sources: [
        {
          title: 'BIS Hallmarking Overview',
          url: 'https://www.bis.gov.in/hallmarking-overview/',
          page: 2,
          excerpt: 'Explains the hallmarking process, HUID system, and jeweller registration requirements.',
          sourceType: 'Official BIS',
        },
      ],
      relatedStandards: ['HALLMARK-GEN'],
    };
  }

  if (/laborator|lab\b|test/i.test(query)) {
    return {
      answer:
        'Testing laboratories relevant to your query can be identified based on the applicable Indian Standard. BIS-recognized and empanelled laboratories, listed in official Group-1 and Group-2 lists, are authorized to conduct the required tests for certification purposes.',
      confidence: 'Medium',
      testing: 'A BIS-recognized laboratory matching your product category is required',
      sources: [
        {
          title: 'BIS Recognized Laboratories List',
          url: 'https://www.bis.gov.in/laboratorys/list-of-bis-recognized-lab/',
          page: 1,
          excerpt: 'Periodically published list of Group-1 and Group-2 recognized/empanelled laboratories.',
          sourceType: 'Official BIS',
        },
      ],
    };
  }

  return {
    answer: `Based on the available BIS information, the standard most likely relevant to your query is ${match.number} — "${match.title}". ${match.certificationApplicable ? `Certification under ${match.scheme ?? 'the applicable scheme'} may apply.` : 'This standard does not appear to require independent certification.'}`,
    confidence: match ? 'High' : 'Low',
    relevantStandard: { number: match.number, title: match.title },
    certification: match.certificationApplicable ? (match.scheme ?? 'Scheme applicable — verify specific requirements') : 'Not applicable',
    testing: match.testingRequired ? 'A recognized testing laboratory may be required' : 'Not applicable',
    sources: genericSources,
    relatedStandards: [match.number],
  };
}

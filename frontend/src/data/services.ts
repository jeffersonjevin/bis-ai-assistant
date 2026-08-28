import type { ServiceDetail } from '../types';

export const serviceDetails: ServiceDetail[] = [
  {
    key: 'certification',
    name: 'Certification',
    icon: 'FileCheck2',
    description: 'Understand licensing and product certification processes, including the ISI Mark (Scheme-I) and the Compulsory Registration Scheme (CRS) for electronics.',
    steps: [
      { step: 1, title: 'Identify the applicable standard', description: 'Match your product to the relevant Indian Standard and confirm whether certification is mandatory.' },
      { step: 2, title: 'Check certification requirements', description: 'Review the scheme (ISI Mark or CRS) that applies and the associated Quality Control Order, if any.' },
      { step: 3, title: 'Prepare documents', description: 'Gather business registration, manufacturing process details and factory information.' },
      { step: 4, title: 'Product testing', description: 'Get the product tested at a BIS-recognized or in-house approved laboratory.' },
      { step: 5, title: 'Submit application', description: 'Apply through the BIS ManakOnline portal with test reports and supporting documents.' },
      { step: 6, title: 'Assessment', description: 'BIS reviews the application and may conduct a factory inspection.' },
      { step: 7, title: 'Licence grant', description: 'On successful assessment, a licence (CM/L or R-number) is granted, allowing use of the mark.' },
    ],
    faqs: [
      { question: 'Is BIS certification mandatory for all products?', answer: 'Only for products covered under a Quality Control Order or listed under the Compulsory Registration Scheme. Many other products carry the ISI Mark voluntarily. Always verify against the specific scheme document for your product.' },
      { question: 'How long does certification take?', answer: 'Timelines vary by scheme and whether the applicant is a domestic or foreign manufacturer. Refer to the specific scheme guidelines for indicative timeframes.' },
    ],
  },
  {
    key: 'laboratories',
    name: 'Laboratories',
    icon: 'FlaskConical',
    description: 'Find BIS, government, and recognized private laboratories relevant to the testing requirements of your product.',
    steps: [
      { step: 1, title: 'Identify testing requirement', description: 'Determine which tests your product needs based on the applicable standard.' },
      { step: 2, title: 'Search recognized laboratories', description: 'Filter laboratories by testing area, standard, or location.' },
      { step: 3, title: 'Confirm recognition status', description: 'Check that the laboratory’s recognition is currently valid for your required test.' },
      { step: 4, title: 'Submit samples for testing', description: 'Coordinate directly with the laboratory to submit samples and receive test reports.' },
    ],
    faqs: [
      { question: 'Can I use any private lab for BIS testing?', answer: 'Only laboratories recognized or empanelled by BIS for the relevant test and standard are accepted for certification purposes.' },
    ],
  },
  {
    key: 'hallmarking',
    name: 'Hallmarking',
    icon: 'Gem',
    description: 'Learn about hallmarking requirements for gold jewellery and artefacts, including registration for jewellers and Hallmarking Centres.',
    steps: [
      { step: 1, title: 'What is hallmarking?', description: 'A quality certification for the purity of gold jewellery and artefacts, marked with a Hallmark Unique Identification (HUID) number.' },
      { step: 2, title: 'Jeweller registration', description: 'Jewellers must register with BIS before selling hallmarked gold jewellery.' },
      { step: 3, title: 'Testing at AHC', description: 'Jewellery is tested and marked at an Assaying & Hallmarking Centre (AHC).' },
      { step: 4, title: 'Consumer verification', description: 'Consumers can verify HUID details through BIS CARE.' },
    ],
    faqs: [
      { question: 'Is hallmarking mandatory?', answer: 'Hallmarking is mandatory for gold jewellery and artefacts as per the applicable Hallmarking mandatory order, subject to notified exemptions. Verify current applicability against the official hallmarking order.' },
    ],
  },
  {
    key: 'consumer',
    name: 'Consumer Services',
    icon: 'UserCheck',
    description: 'Get help understanding product safety marks, verifying licences, and raising consumer complaints related to BIS-certified products.',
    steps: [
      { step: 1, title: 'Understand BIS marks', description: 'Learn what the ISI Mark, CRS Mark, and Hallmark represent and where to find them on a product.' },
      { step: 2, title: 'Verify a licence or HUID', description: 'Use BIS CARE or ManakOnline to verify certification details for a product or jeweller.' },
      { step: 3, title: 'Raise a complaint', description: 'File a complaint if a certified product appears non-compliant with the relevant standard.' },
    ],
    faqs: [
      { question: 'How do I verify if a product is genuinely BIS certified?', answer: 'Use the BIS CARE app or ManakOnline portal to verify the licence number printed on the product against BIS records.' },
    ],
  },
];

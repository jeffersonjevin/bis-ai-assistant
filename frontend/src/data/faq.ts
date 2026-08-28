import type { FaqItem } from '../types';

export const mockFaqs: FaqItem[] = [
  {
    id: 'faq-001',
    question: 'What is the ISI Mark?',
    answer: 'The ISI Mark is a certification mark issued by BIS indicating that a product conforms to an Indian Standard. It is issued under Scheme-I of the BIS Conformity Assessment Regulations.',
    category: 'Certification',
  },
  {
    id: 'faq-002',
    question: 'What is the Compulsory Registration Scheme (CRS)?',
    answer: 'CRS is a scheme for electronics and IT goods requiring registration with BIS and display of the Standard Mark, without a full licence-and-inspection process like Scheme-I.',
    category: 'Certification',
  },
  {
    id: 'faq-003',
    question: 'What does hallmarking guarantee?',
    answer: 'Hallmarking certifies the purity/fineness of gold jewellery and artefacts through testing at a registered Assaying & Hallmarking Centre, marked with a HUID number.',
    category: 'Hallmarking',
  },
  {
    id: 'faq-004',
    question: 'How can I verify a BIS licence?',
    answer: 'Licence details can be verified through the BIS CARE mobile app or the ManakOnline portal using the licence or CM/L number printed on the product.',
    category: 'Consumer',
  },
  {
    id: 'faq-005',
    question: 'Are all Indian Standards mandatory?',
    answer: 'No. Only standards linked to a Quality Control Order or a compulsory scheme are mandatory. Many Indian Standards remain voluntary.',
    category: 'Standards',
  },
];

import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ScrollText, FileCheck2, FlaskConical, Gem, UserCheck, ArrowUpRight } from 'lucide-react';
import Reveal from '../common/Reveal';
import SectionHeading from '../common/SectionHeading';

export default function ServiceDiscovery() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { t } = useTranslation();

  const services = [
    {
      icon: ScrollText,
      title: t('home.serviceStandardsTitle'),
      description: t('home.serviceStandardsDesc'),
      to: '/standards',
    },
    {
      icon: FileCheck2,
      title: t('home.serviceCertTitle'),
      description: t('home.serviceCertDesc'),
      to: '/services',
    },
    {
      icon: FlaskConical,
      title: t('home.serviceLabsTitle'),
      description: t('home.serviceLabsDesc'),
      to: '/services',
    },
    {
      icon: Gem,
      title: t('home.serviceHallmarkTitle'),
      description: t('home.serviceHallmarkDesc'),
      to: '/services',
    },
    {
      icon: UserCheck,
      title: t('home.serviceConsumerTitle'),
      description: t('home.serviceConsumerDesc'),
      to: '/services',
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <Reveal>
        <SectionHeading eyebrow={t('home.servicesEyebrow')} title={t('home.servicesTitle')} align="left" />
      </Reveal>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {services.map((service, i) => {
          const Icon = service.icon;
          return (
            <Reveal key={service.title} delay={i * 0.06} className="h-full">
              <motion.button
                onClick={() => navigate(service.to)}
                whileHover={reduceMotion ? undefined : { y: -5 }}
                className="focus-ring group h-full w-full text-left rounded-2xl border border-line bg-surface-raised p-5 shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)] hover:border-blue/30"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-light text-blue">
                    <Icon size={18} />
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="text-ink-faint opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0"
                  />
                </div>
                <h3 className="mt-4 font-display font-semibold text-ink text-sm">{service.title}</h3>
                <p className="mt-1.5 text-xs text-ink-soft leading-relaxed">{service.description}</p>
              </motion.button>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

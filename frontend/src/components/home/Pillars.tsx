import { Compass, BookOpenCheck, Waypoints, ShieldCheck } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Reveal from '../common/Reveal';
import SectionHeading from '../common/SectionHeading';

export default function Pillars() {
  const reduceMotion = useReducedMotion();
  const { t } = useTranslation();

  const pillars = [
    { icon: Compass, title: t('home.pillarDiscoverTitle'), description: t('home.pillarDiscoverDesc') },
    { icon: BookOpenCheck, title: t('home.pillarUnderstandTitle'), description: t('home.pillarUnderstandDesc') },
    { icon: Waypoints, title: t('home.pillarNavigateTitle'), description: t('home.pillarNavigateDesc') },
    { icon: ShieldCheck, title: t('home.pillarVerifyTitle'), description: t('home.pillarVerifyDesc') },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <Reveal>
        <SectionHeading eyebrow={t('home.pillarsEyebrow')} title={t('home.pillarsTitle')} />
      </Reveal>

      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {pillars.map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <Reveal key={pillar.title} delay={i * 0.08}>
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -6 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="group h-full rounded-2xl border border-line bg-surface-raised p-6 shadow-[var(--shadow-card)] transition-shadow duration-300 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-blue-light text-blue mb-5 overflow-hidden">
                  <motion.span
                    whileHover={reduceMotion ? undefined : { rotate: 8, scale: 1.1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="flex"
                  >
                    <Icon size={22} />
                  </motion.span>
                </div>
                <span className="font-mono text-[11px] tracking-widest uppercase text-ink-faint">
                  0{i + 1}
                </span>
                <h3 className="mt-1 font-display text-lg font-semibold text-ink">{pillar.title}</h3>
                <p className="mt-1.5 text-sm text-ink-soft leading-relaxed">{pillar.description}</p>
              </motion.div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

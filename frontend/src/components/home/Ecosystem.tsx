import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Factory, Building2, Users, Briefcase, Landmark, Bot } from 'lucide-react';
import Reveal from '../common/Reveal';
import SectionHeading from '../common/SectionHeading';

export default function Ecosystem() {
  const reduceMotion = useReducedMotion();
  const { t } = useTranslation();
  const [active, setActive] = useState<string | null>(null);

  const stakeholders = [
    {
      key: 'industries',
      label: t('home.stakeholderIndustries'),
      icon: Factory,
      angle: -90,
      benefit: t('home.stakeholderIndustriesBenefit'),
    },
    {
      key: 'msmes',
      label: t('home.stakeholderMsmes'),
      icon: Building2,
      angle: -18,
      benefit: t('home.stakeholderMsmesBenefit'),
    },
    {
      key: 'consumers',
      label: t('home.stakeholderConsumers'),
      icon: Users,
      angle: 54,
      benefit: t('home.stakeholderConsumersBenefit'),
    },
    {
      key: 'professionals',
      label: t('home.stakeholderProfessionals'),
      icon: Briefcase,
      angle: 126,
      benefit: t('home.stakeholderProfessionalsBenefit'),
    },
    {
      key: 'ecosystem',
      label: t('home.stakeholderEcosystem'),
      icon: Landmark,
      angle: 198,
      benefit: t('home.stakeholderEcosystemBenefit'),
    },
  ];

  const activeItem = stakeholders.find((s) => s.key === active);
  const radius = 160;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <Reveal>
        <SectionHeading eyebrow={t('home.ecosystemEyebrow')} title={t('home.ecosystemTitle')} />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="relative mx-auto mt-16 mb-6 h-[420px] sm:h-[440px] max-w-xl">
          <svg
            className="absolute inset-0 w-full h-full overflow-visible"
            viewBox="-200 -200 400 400"
            preserveAspectRatio="xMidYMid meet"
          >
            {stakeholders.map((s) => {
              const rad = (s.angle * Math.PI) / 180;
              const x = Math.cos(rad) * radius;
              const y = Math.sin(rad) * radius;
              const isActive = active === s.key;
              return (
                <motion.line
                  key={s.key}
                  x1={0}
                  y1={0}
                  x2={x}
                  y2={y}
                  stroke={isActive ? 'var(--color-blue)' : 'var(--color-line)'}
                  strokeWidth={isActive ? 1.75 : 1}
                  initial={reduceMotion ? undefined : { pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                />
              );
            })}
          </svg>

          {/* center hub */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center h-24 w-24 rounded-2xl bg-navy text-white shadow-[0_8px_28px_-8px_rgba(11,36,71,0.55)] z-10">
            <Bot size={22} />
            <span className="mt-1 text-[10px] font-mono text-center leading-tight px-1">
              BIS AI
              <br />
              ASSISTANT
            </span>
          </div>

          {stakeholders.map((s, i) => {
            const rad = (s.angle * Math.PI) / 180;
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;
            const Icon = s.icon;
            const isActive = active === s.key;
            return (
              <motion.button
                key={s.key}
                onMouseEnter={() => setActive(s.key)}
                onFocus={() => setActive(s.key)}
                onMouseLeave={() => setActive(null)}
                onBlur={() => setActive(null)}
                className="focus-ring absolute left-1/2 top-1/2 flex flex-col items-center gap-1.5 -translate-x-1/2 -translate-y-1/2"
                style={{ marginLeft: x, marginTop: y }}
                initial={reduceMotion ? undefined : { opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
              >
                <motion.span
                  whileHover={reduceMotion ? undefined : { scale: 1.1 }}
                  className={`flex h-14 w-14 items-center justify-center rounded-xl border shadow-[var(--shadow-card)] transition-colors duration-200 ${
                    isActive ? 'bg-navy text-white border-navy' : 'bg-surface-raised text-navy border-line'
                  }`}
                >
                  <Icon size={20} />
                </motion.span>
                <span className="text-xs font-medium text-ink-soft whitespace-nowrap">{s.label}</span>
              </motion.button>
            );
          })}
        </div>
      </Reveal>

      <div className="h-14 flex items-center justify-center">
        <motion.p
          key={activeItem?.key ?? 'empty'}
          initial={reduceMotion ? undefined : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-ink-soft text-center max-w-md px-4"
        >
          {activeItem ? activeItem.benefit : t('home.ecosystemHint')}
        </motion.p>
      </div>
    </section>
  );
}

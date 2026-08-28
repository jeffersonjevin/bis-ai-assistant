import { Languages, Radar, Anchor, Sparkles, BadgeCheck, ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Reveal from '../common/Reveal';
import SectionHeading from '../common/SectionHeading';

export default function Pipeline() {
  const reduceMotion = useReducedMotion();
  const { t } = useTranslation();

  const stages = [
    { icon: Languages, title: t('home.stageUnderstandTitle'), detail: t('home.stageUnderstandDetail') },
    { icon: Radar, title: t('home.stageRetrieveTitle'), detail: t('home.stageRetrieveDetail') },
    { icon: Anchor, title: t('home.stageGroundTitle'), detail: t('home.stageGroundDetail') },
    { icon: Sparkles, title: t('home.stageGenerateTitle'), detail: t('home.stageGenerateDetail') },
    { icon: BadgeCheck, title: t('home.stageVerifyTitle'), detail: t('home.stageVerifyDetail') },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <Reveal>
        <SectionHeading eyebrow={t('home.pipelineEyebrow')} title={t('home.pipelineTitle')} />
      </Reveal>

      <div className="mt-14 flex flex-col lg:flex-row items-stretch gap-3 lg:gap-0">
        {stages.map((stage, i) => {
          const Icon = stage.icon;
          return (
            <div key={stage.title} className="flex items-center lg:flex-1">
              <Reveal delay={i * 0.09} className="w-full lg:w-auto flex-1">
                <motion.div
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                  className="flex-1 rounded-2xl border border-line bg-surface-raised px-5 py-6 text-center shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
                >
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white mb-3">
                    <Icon size={18} strokeWidth={2.2} />
                  </div>
                  <span className="font-mono text-[11px] text-ink-faint">0{i + 1}</span>
                  <h3 className="font-display text-sm font-semibold text-ink mt-0.5">{stage.title}</h3>
                  <p className="mt-1 text-xs text-ink-soft leading-snug">{stage.detail}</p>
                </motion.div>
              </Reveal>

              {i < stages.length - 1 && (
                <div className="hidden lg:flex items-center justify-center w-8 shrink-0 text-ink-faint">
                  <ArrowRight size={16} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

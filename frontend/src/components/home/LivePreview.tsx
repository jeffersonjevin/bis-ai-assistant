import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, AnimatePresence, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Bot, Search, FileSearch2, ShieldCheck, CheckCircle2, User } from 'lucide-react';
import Reveal from '../common/Reveal';

export default function LivePreview() {
  const reduceMotion = useReducedMotion();
  const { t } = useTranslation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [stage, setStage] = useState<'idle' | 'typing' | 'searching' | 'answered'>('idle');
  const [stepIndex, setStepIndex] = useState(0);

  const question = t('home.demoQuestion');
  const searchSteps = [
    { icon: Search, label: t('home.demoStep1') },
    { icon: FileSearch2, label: t('home.demoStep2') },
    { icon: ShieldCheck, label: t('home.demoStep3') },
  ];

  useEffect(() => {
    if (!inView || stage !== 'idle') return;
    const t2 = setTimeout(() => setStage('typing'), 400);
    return () => clearTimeout(t2);
  }, [inView, stage]);

  useEffect(() => {
    if (stage !== 'typing') return;
    const t2 = setTimeout(() => setStage('searching'), 1000);
    return () => clearTimeout(t2);
  }, [stage]);

  useEffect(() => {
    if (stage !== 'searching') return;
    if (stepIndex >= searchSteps.length - 1) {
      const t2 = setTimeout(() => setStage('answered'), 700);
      return () => clearTimeout(t2);
    }
    const t2 = setTimeout(() => setStepIndex((s) => s + 1), 650);
    return () => clearTimeout(t2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, stepIndex]);

  return (
    <section className="bg-navy relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-50"
        style={{ background: 'radial-gradient(700px 360px at 15% 0%, rgba(29,95,168,0.45), transparent)' }}
      />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-block text-xs font-mono font-semibold tracking-widest uppercase text-blue-light/80 mb-3">
              {t('home.liveEyebrow')}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">
              {t('home.liveTitle')}
            </h2>
          </div>
        </Reveal>

        <div ref={ref} className="mt-12 max-w-lg mx-auto">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-blue-light">
                <Bot size={14} />
              </span>
              <span className="text-sm font-medium text-white/90 font-display">{t('assistant.assistantName')}</span>
              <span className="ml-auto flex items-center gap-1 text-[11px] text-white/40 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-verified" />
                live
              </span>
            </div>

            <div className="px-4 py-6 min-h-[260px] flex flex-col justify-end gap-4">
              {/* user bubble */}
              <div className="flex justify-end">
                <div className="flex items-start gap-2 max-w-[85%]">
                  <div className="rounded-2xl rounded-tr-sm bg-blue text-white text-sm px-4 py-2.5 leading-snug">
                    {reduceMotion || stage === 'idle' ? (
                      question
                    ) : (
                      <TypedText text={question} active={stage === 'typing'} />
                    )}
                  </div>
                  <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/70">
                    <User size={12} />
                  </span>
                </div>
              </div>

              {/* assistant response */}
              <AnimatePresence>
                {(stage === 'searching' || stage === 'answered') && (
                  <motion.div
                    initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start gap-2 max-w-[90%]">
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-light text-navy">
                        <Bot size={12} />
                      </span>
                      <div className="rounded-2xl rounded-tl-sm bg-white/[0.06] border border-white/10 text-sm px-4 py-3 leading-snug min-w-[220px]">
                        {stage === 'searching' && (
                          <div className="flex items-center gap-2 text-white/70">
                            {(() => {
                              const StepIcon = searchSteps[stepIndex].icon;
                              return <StepIcon size={14} className="text-blue-light animate-pulse-dot" />;
                            })()}
                            <span key={stepIndex} className="animate-fade-up">
                              {searchSteps[stepIndex].label}
                            </span>
                          </div>
                        )}

                        {stage === 'answered' && (
                          <motion.div
                            initial={reduceMotion ? undefined : { opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <p className="text-white/85">{t('home.demoAnswer')}</p>
                            <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-verified-soft/90 text-verified text-xs font-medium px-2.5 py-1.5 w-fit">
                              <CheckCircle2 size={13} />
                              {t('home.demoGrounded')}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TypedText({ text, active }: { text: string; active: boolean }) {
  const [count, setCount] = useState(active ? 0 : text.length);

  useEffect(() => {
    if (!active) return;
    setCount(0);
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) clearInterval(interval);
    }, 28);
    return () => clearInterval(interval);
  }, [active, text]);

  return (
    <span>
      {text.slice(0, count)}
      {active && count < text.length && <span className="inline-block w-[2px] h-3.5 bg-white/80 ml-0.5 align-middle animate-pulse-dot" />}
    </span>
  );
}

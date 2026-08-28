import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Chip from '../components/ui/Chip';
import AnimatedFlow from '../components/common/AnimatedFlow';
import Reveal from '../components/common/Reveal';
import Pillars from '../components/home/Pillars';
import Pipeline from '../components/home/Pipeline';
import LivePreview from '../components/home/LivePreview';
import Ecosystem from '../components/home/Ecosystem';
import ServiceDiscovery from '../components/home/ServiceDiscovery';

export default function Home() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const { t } = useTranslation();

  const exampleQuestions = [
    t('home.exampleQ1'),
    t('home.exampleQ2'),
    t('home.exampleQ3'),
    t('home.exampleQ4'),
  ];

  const goToAssistant = (query?: string) => {
    navigate('/assistant', { state: query ? { prefill: query } : undefined });
  };

  return (
    <div>
      {/* SECTION 1 — HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(1100px 480px at 85% -10%, rgba(29,95,168,0.09), transparent), radial-gradient(700px 400px at 0% 10%, rgba(11,36,71,0.06), transparent)',
          }}
        />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-16 items-center">
            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold leading-[1.08] tracking-tight text-ink text-balance">
                <motion.span
                  className="block"
                  initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.12 }}
                >
                  {t('home.heroLine1')}
                </motion.span>

                <motion.span
                  className="block"
                  initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.22 }}
                >
                  {t('home.heroLine2')}
                </motion.span>

                <motion.span
                  className="block text-blue"
                  initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.32 }}
                >
                  {t('home.heroHighlight')}
                </motion.span>
              </h1>

              <motion.p
                initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.42 }}
                className="mt-6 text-lg text-ink-soft leading-relaxed max-w-xl"
              >
                {t('home.heroDescription')}
              </motion.p>

              <motion.div
                initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.52 }}
                className="mt-9 flex flex-wrap gap-3"
              >
                <Button
                  size="lg"
                  onClick={() => goToAssistant()}
                  iconRight={<ArrowRight size={18} />}
                >
                  <Sparkles size={16} className="mr-0.5" />
                  {t('home.askAI')}
                </Button>

                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate('/standards')}
                >
                  {t('home.exploreStandards')}
                  <ArrowRight size={16} />
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Card
                padding="lg"
                className="bg-gradient-to-b from-white to-blue-mist/40"
              >
                <AnimatedFlow />
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — 4 PILLARS */}
      <Pillars />

      {/* SECTION 3 — HOW IT WORKS PIPELINE */}
      <Pipeline />

      {/* SECTION 4 — LIVE AI PREVIEW */}
      <LivePreview />

      {/* SECTION 5 — STAKEHOLDER ECOSYSTEM */}
      <Ecosystem />

      {/* SECTION 6 — SERVICE DISCOVERY */}
      <ServiceDiscovery />

      {/* Ask in your own words — kept as a light-touch bridge before the final CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-4">
        <Reveal>
          <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
            {exampleQuestions.map((q) => (
              <Chip key={q} onClick={() => goToAssistant(q)}>
                {q}
              </Chip>
            ))}
          </div>
        </Reveal>
      </section>

      {/* SECTION 7 — FINAL CTA */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl">
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(600px 260px at 50% -20%, rgba(29,95,168,0.35), transparent), linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-deep) 100%)',
              }}
            />

            {!reduceMotion && (
              <motion.div
                className="absolute -inset-32 opacity-40"
                style={{
                  background:
                    'radial-gradient(300px 300px at 50% 50%, rgba(29,95,168,0.5), transparent 70%)',
                }}
                animate={{ opacity: [0.25, 0.5, 0.25] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}

            <div className="relative px-6 py-16 sm:py-20 text-center">
              <h3 className="font-display text-2xl sm:text-4xl font-semibold text-white text-balance max-w-2xl mx-auto leading-tight">
                {t('home.ctaLine1')}
                <br />
                {t('home.ctaLine2')}
              </h3>

              <div className="mt-8">
                <Button
                  size="lg"
                  onClick={() => goToAssistant()}
                  className="bg-white text-navy hover:bg-blue-mist shadow-[0_8px_28px_-6px_rgba(0,0,0,0.35)]"
                >
                  <Sparkles size={16} />
                  {t('home.askAI')}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
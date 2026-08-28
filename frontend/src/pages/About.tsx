import { useTranslation } from 'react-i18next';
import { FileText, Database, Layers, Search, Cpu, ShieldCheck, AlertTriangle } from 'lucide-react';
import Card from '../components/ui/Card';
import SectionHeading from '../components/common/SectionHeading';

export default function About() {
  const { t } = useTranslation();

  const pipeline = [
    { icon: FileText, label: t('about.pipelineSources') },
    { icon: Database, label: t('about.pipelineProcessing') },
    { icon: Layers, label: t('about.pipelineKnowledge') },
    { icon: Search, label: t('about.pipelineRag') },
    { icon: Cpu, label: t('about.pipelineLlm') },
    { icon: ShieldCheck, label: t('about.pipelineAnswer') },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
      <SectionHeading eyebrow={`${t('about.eyebrow')} · PS 26107`} title={t('about.title')} align="left" />

      <div className="mt-10 space-y-10">
        <section>
          <h2 className="font-display text-xl font-semibold text-ink">{t('about.aboutBisTitle')}</h2>
          <p className="mt-3 text-ink-soft leading-relaxed">{t('about.aboutBisBody')}</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">{t('about.aboutAssistantTitle')}</h2>
          <p className="mt-3 text-ink-soft leading-relaxed">{t('about.aboutAssistantBody')}</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink mb-6">{t('about.howItWorksTitle')}</h2>
          <Card padding="lg">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {pipeline.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-2 w-24 text-center">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-mist text-blue">
                        <Icon size={18} />
                      </div>
                      <span className="text-xs font-medium text-ink-soft leading-tight">{step.label}</span>
                    </div>
                    {i < pipeline.length - 1 && <span className="text-ink-faint hidden sm:block">→</span>}
                  </div>
                );
              })}
            </div>
          </Card>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-ink">{t('about.transparencyTitle')}</h2>
          <p className="mt-3 text-ink-soft leading-relaxed">{t('about.transparencyBody')}</p>
        </section>

        <section className="rounded-2xl border border-seal/30 bg-seal-soft p-5 flex gap-3">
          <AlertTriangle size={20} className="text-seal shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display font-semibold text-ink">{t('about.limitationTitle')}</h3>
            <p className="mt-1.5 text-sm text-ink-soft leading-relaxed">{t('about.limitationBody')}</p>
          </div>
        </section>
      </div>
    </div>
  );
}

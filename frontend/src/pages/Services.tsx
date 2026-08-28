import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileCheck2, FlaskConical, Gem, UserCheck, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';
import ServiceDetailModal from '../components/services/ServiceDetailModal';
import { serviceDetails } from '../data/services';
import type { ServiceKey } from '../types';

const icons: Record<ServiceKey, typeof FileCheck2> = {
  certification: FileCheck2,
  laboratories: FlaskConical,
  hallmarking: Gem,
  consumer: UserCheck,
};

export default function Services() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState<ServiceKey | null>(null);
  const activeService = serviceDetails.find((s) => s.key === activeKey) ?? null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-display text-4xl font-semibold text-ink tracking-tight">{t('services.title')}</h1>
        <p className="mt-3 text-ink-soft">{t('services.subtitle')}</p>
      </div>

      <div className="mt-12 grid sm:grid-cols-2 gap-6">
        {serviceDetails.map((service, i) => {
          const Icon = icons[service.key];
          return (
            <button
              key={service.key}
              onClick={() => setActiveKey(service.key)}
              className="focus-ring text-left animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <Card hover padding="lg" className="h-full">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-light text-blue mb-5">
                  <Icon size={22} />
                </div>
                <h3 className="font-display text-lg font-semibold text-ink">{service.name}</h3>
                <p className="mt-2 text-sm text-ink-soft leading-relaxed">{service.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue">
                  {t('services.learnMore')} <ArrowRight size={14} />
                </span>
              </Card>
            </button>
          );
        })}
      </div>

      <ServiceDetailModal
        service={activeService}
        onClose={() => setActiveKey(null)}
        onAskAi={(query) => navigate('/assistant', { state: { prefill: query } })}
      />
    </div>
  );
}

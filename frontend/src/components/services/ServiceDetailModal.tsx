import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, FlaskConical, MessageCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import type { ServiceDetail, Laboratory } from '../../types';
import { searchLaboratories } from '../../services/api';

interface ServiceDetailModalProps {
  service: ServiceDetail | null;
  onClose: () => void;
  onAskAi: (query: string) => void;
}

function LabSearch() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [labs, setLabs] = useState<Laboratory[]>([]);

  useEffect(() => {
    searchLaboratories({ query }).then(setLabs);
  }, [query]);

  return (
    <div className="mt-5">
      <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2.5">
        <Search size={16} className="text-ink-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('services.labSearchPlaceholder')}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-faint"
        />
      </div>
      <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
        {labs.map((lab) => (
          <div key={lab.id} className="rounded-xl border border-line p-3.5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-ink">{lab.name}</p>
              <span className="text-[10px] font-medium uppercase tracking-wide text-ink-faint bg-surface rounded-full px-2 py-0.5 shrink-0">
                {lab.type}
              </span>
            </div>
            <p className="text-xs text-ink-soft mt-1 flex items-center gap-1">
              <MapPin size={11} /> {lab.city}, {lab.state}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {lab.testingAreas.map((a) => (
                <span key={a} className="text-[11px] rounded-full bg-blue-light text-blue px-2 py-0.5">{a}</span>
              ))}
            </div>
          </div>
        ))}
        {labs.length === 0 && <p className="text-sm text-ink-faint text-center py-6">{t('services.noLabs')}</p>}
      </div>
    </div>
  );
}

export default function ServiceDetailModal({ service, onClose, onAskAi }: ServiceDetailModalProps) {
  const { t } = useTranslation();
  return (
    <Modal open={!!service} onClose={onClose} title={service?.name} widthClass="max-w-xl">
      {service && (
        <div>
          <p className="text-sm text-ink-soft leading-relaxed">{service.description}</p>

          <div className="mt-6">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-faint mb-3">{t('services.process')}</h4>
            <ol className="space-y-4">
              {service.steps.map((s) => (
                <li key={s.step} className="flex gap-3.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-mist text-blue text-xs font-mono font-semibold">
                    {String(s.step).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{s.title}</p>
                    <p className="text-sm text-ink-soft mt-0.5 leading-relaxed">{s.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {service.key === 'laboratories' && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-faint mt-6 mb-1 flex items-center gap-1.5">
                <FlaskConical size={13} /> {t('services.searchLabs')}
              </h4>
              <LabSearch />
            </div>
          )}

          {service.faqs.length > 0 && (
            <div className="mt-6">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-ink-faint mb-3">{t('services.faqs')}</h4>
              <div className="space-y-3">
                {service.faqs.map((f) => (
                  <div key={f.question} className="rounded-xl bg-surface p-3.5">
                    <p className="text-sm font-medium text-ink">{f.question}</p>
                    <p className="text-sm text-ink-soft mt-1 leading-relaxed">{f.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <Button
              className="w-full"
              icon={<MessageCircle size={15} />}
              onClick={() => onAskAi(`Tell me more about BIS ${service.name}.`)}
            >
              {t('services.askAboutService')} {service.name}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

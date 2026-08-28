import { useTranslation } from 'react-i18next';
import { FlaskConical, ArrowRight, MessageCircle } from 'lucide-react';
import type { Standard } from '../../types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const statusTone: Record<string, 'verified' | 'seal' | 'alert' | 'neutral' | 'blue'> = {
  Active: 'verified',
  Reaffirmed: 'blue',
  Amended: 'seal',
  Withdrawn: 'alert',
  Superseded: 'neutral',
};

interface StandardCardProps {
  standard: Standard;
  onView: () => void;
  onAskAi: () => void;
}

export default function StandardCard({ standard, onView, onAskAi }: StandardCardProps) {
  const { t } = useTranslation();
  return (
    <Card hover padding="md" className="flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-base font-semibold text-navy">{standard.number}</span>
        <Badge tone={statusTone[standard.status] ?? 'neutral'}>{standard.status}</Badge>
      </div>
      <h3 className="mt-2 font-display font-semibold text-ink leading-snug">{standard.title}</h3>

      <dl className="mt-4 space-y-1.5 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-ink-faint">{t('standards.category')}</dt>
          <dd className="text-ink-soft text-right">{standard.category}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-ink-faint">{t('standards.certification')}</dt>
          <dd className="text-ink-soft text-right">
            {standard.certificationApplicable ? t('standards.applicable') : t('standards.notApplicable')}
          </dd>
        </div>
        <div className="flex justify-between gap-3 items-center">
          <dt className="text-ink-faint">{t('standards.testing')}</dt>
          <dd className="text-ink-soft flex items-center gap-1">
            {standard.testingRequired && <FlaskConical size={13} className="text-blue" />}
            {standard.testingRequired ? t('standards.required') : t('standards.notRequired')}
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex gap-2 pt-4 border-t border-line">
        <button
          onClick={onView}
          className="focus-ring flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-medium text-navy hover:bg-blue-mist transition-colors"
        >
          {t('standards.viewDetails')}
          <ArrowRight size={13} />
        </button>
        <button
          onClick={onAskAi}
          className="focus-ring flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-navy px-3 py-2 text-xs font-medium text-white hover:bg-navy-deep transition-colors"
        >
          <MessageCircle size={13} />
          {t('standards.askAI')}
        </button>
      </div>
    </Card>
  );
}

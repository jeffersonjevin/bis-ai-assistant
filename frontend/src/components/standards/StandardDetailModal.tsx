import { useTranslation } from 'react-i18next';
import { MessageCircle, ExternalLink, FlaskConical, CheckCircle2, Info } from 'lucide-react';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import type { Standard } from '../../types';

interface StandardDetailModalProps {
  standard: Standard | null;
  onClose: () => void;
  onAskAi: (standard: Standard) => void;
}

export default function StandardDetailModal({ standard, onClose, onAskAi }: StandardDetailModalProps) {
  const { t } = useTranslation();
  return (
    <Modal open={!!standard} onClose={onClose} title={t('standards.modalTitle')} widthClass="max-w-xl">
      {standard && (
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="font-mono text-xl font-semibold text-navy">{standard.number}</span>
              <h3 className="mt-1 font-display text-lg font-semibold text-ink leading-snug">{standard.title}</h3>
            </div>
            <Badge tone="verified">{standard.status}</Badge>
          </div>

          <div className="mt-5 grid sm:grid-cols-2 gap-3">
            <div className="rounded-xl bg-surface px-3.5 py-3">
              <p className="text-xs font-semibold text-ink-faint uppercase tracking-wide">{t('standards.productCategory')}</p>
              <p className="text-sm text-ink mt-0.5">{standard.category}</p>
            </div>
            <div className="rounded-xl bg-surface px-3.5 py-3">
              <p className="text-xs font-semibold text-ink-faint uppercase tracking-wide">{t('standards.industry')}</p>
              <p className="text-sm text-ink mt-0.5">{standard.industry}</p>
            </div>
            <div className="rounded-xl bg-surface px-3.5 py-3 flex items-start gap-2">
              <CheckCircle2 size={15} className="text-verified mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-ink-faint uppercase tracking-wide">{t('standards.certification')}</p>
                <p className="text-sm text-ink mt-0.5">
                  {standard.scheme ?? (standard.certificationApplicable ? t('standards.applicable') : t('standards.notApplicable'))}
                </p>
              </div>
            </div>
            <div className="rounded-xl bg-surface px-3.5 py-3 flex items-start gap-2">
              <FlaskConical size={15} className="text-blue mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-ink-faint uppercase tracking-wide">{t('standards.testing')}</p>
                <p className="text-sm text-ink mt-0.5">
                  {standard.testingRequired ? t('standards.required') : t('standards.notRequired')}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-line p-3.5">
            <p className="text-xs font-semibold text-ink-faint uppercase tracking-wide mb-1">{t('standards.relatedInformation')}</p>
            <p className="text-sm text-ink-soft leading-relaxed">{standard.relatedInformation}</p>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-xl bg-blue-mist px-3.5 py-3">
            <Info size={15} className="text-blue mt-0.5 shrink-0" />
            <p className="text-xs text-ink-soft leading-relaxed">
              {t('standards.lastUpdated')}: {standard.lastUpdated}. {t('standards.source')}:{' '}
              <a href={standard.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-blue hover:text-navy inline-flex items-center gap-1">
                {standard.sourceTitle} <ExternalLink size={11} />
              </a>
            </p>
          </div>

          <div className="mt-6 flex gap-2">
            <Button variant="primary" className="flex-1" icon={<MessageCircle size={15} />} onClick={() => onAskAi(standard)}>
              {t('standards.askAboutStandard')}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

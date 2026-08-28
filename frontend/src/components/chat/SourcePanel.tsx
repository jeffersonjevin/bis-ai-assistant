import { useTranslation } from 'react-i18next';
import { ExternalLink, ShieldCheck, FileText } from 'lucide-react';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import type { SourceRef } from '../../types';

interface SourcePanelProps {
  open: boolean;
  onClose: () => void;
  sources: SourceRef[];
}

export default function SourcePanel({ open, onClose, sources }: SourcePanelProps) {
  const { t } = useTranslation();
  return (
    <Modal open={open} onClose={onClose} title={t('assistant.sourcesModalTitle')} widthClass="max-w-md">
      <div className="space-y-4">
        {sources.map((s) => (
          <div key={s.title} className="rounded-2xl border border-line p-4 notch-corner-sm bg-surface">
            <div className="flex items-center justify-between gap-2 mb-2">
              <Badge tone="verified" icon={<ShieldCheck size={11} />}>
                {s.sourceType}
              </Badge>
              {s.page && <span className="text-xs font-mono text-ink-faint">{t('assistant.page')} {s.page}</span>}
            </div>
            <div className="flex items-start gap-2">
              <FileText size={16} className="text-ink-faint mt-0.5 shrink-0" />
              <h4 className="font-display font-semibold text-sm text-ink leading-snug">{s.title}</h4>
            </div>
            <p className="mt-2 text-sm text-ink-soft leading-relaxed italic">&ldquo;{s.excerpt}&rdquo;</p>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue hover:text-navy transition-colors"
            >
              {t('assistant.openSource')}
              <ExternalLink size={12} />
            </a>
          </div>
        ))}
      </div>
    </Modal>
  );
}

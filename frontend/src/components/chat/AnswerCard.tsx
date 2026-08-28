import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  FileText,
  FlaskConical,
  CheckCircle2,
  Copy,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Check,
} from 'lucide-react';
import type { AssistantAnswer } from '../../types';
import Badge from '../ui/Badge';

interface AnswerCardProps {
  answer: AssistantAnswer;
  onViewSources: () => void;
}

export default function AnswerCard({ answer, onViewSources }: AnswerCardProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const handleCopy = () => {
    navigator.clipboard?.writeText(answer.answer).catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-2xl w-full animate-fade-up">
      <div className="flex items-center gap-2 mb-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy text-white shrink-0">
          <ShieldCheck size={14} />
        </span>
        <span className="font-display text-sm font-semibold text-ink">{t('assistant.assistantName')}</span>
        <Badge tone="verified" icon={<CheckCircle2 size={11} />} className="ml-auto sm:ml-1">
          {answer.confidence} {t('assistant.confidence')}
        </Badge>
      </div>

      <div className="rounded-2xl border border-line bg-surface-raised shadow-[var(--shadow-card)] overflow-hidden">
        <div className="p-5">
          <p className="text-[15px] text-ink leading-relaxed">{answer.answer}</p>

          {answer.relevantStandard && (
            <div className="mt-4 rounded-xl border border-line bg-blue-mist p-4 notch-corner-sm">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wide text-blue">
                {t('assistant.relevantStandard')}
              </span>
              <p className="mt-1 font-mono text-base font-semibold text-navy">{answer.relevantStandard.number}</p>
              <p className="text-sm text-ink-soft mt-0.5 leading-snug">{answer.relevantStandard.title}</p>
            </div>
          )}

          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            {answer.certification && (
              <div className="flex items-start gap-2.5 rounded-xl bg-surface px-3.5 py-3">
                <CheckCircle2 size={16} className="text-verified mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink-soft uppercase tracking-wide">{t('assistant.certification')}</p>
                  <p className="text-sm text-ink mt-0.5">{answer.certification}</p>
                </div>
              </div>
            )}
            {answer.testing && (
              <div className="flex items-start gap-2.5 rounded-xl bg-surface px-3.5 py-3">
                <FlaskConical size={16} className="text-blue mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink-soft uppercase tracking-wide">{t('assistant.testing')}</p>
                  <p className="text-sm text-ink mt-0.5">{answer.testing}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-line px-5 py-4 bg-surface/60">
          <div className="flex items-center gap-2 mb-2.5">
            <FileText size={14} className="text-ink-faint" />
            <span className="text-xs font-semibold text-ink-soft uppercase tracking-wide">{t('assistant.sources')}</span>
          </div>
          <div className="space-y-1.5">
            {answer.sources.map((s) => (
              <p key={s.title} className="text-sm text-ink-soft flex items-center gap-2">
                <span className="text-ink-faint">📄</span> {s.title}
              </p>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-line">
            <button
              onClick={onViewSources}
              className="focus-ring rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-navy hover:bg-blue-mist transition-colors"
            >
              {t('assistant.viewSources')}
            </button>
            <button
              onClick={handleCopy}
              className="focus-ring inline-flex items-center gap-1 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink-soft hover:bg-surface transition-colors"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? t('assistant.copied') : t('assistant.copy')}
            </button>
            <button
              onClick={() => setSaved((v) => !v)}
              className={`focus-ring inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                saved ? 'border-seal text-seal bg-seal-soft' : 'border-line text-ink-soft hover:bg-surface'
              }`}
            >
              <Bookmark size={13} fill={saved ? 'currentColor' : 'none'} />
              {saved ? t('assistant.savedState') : t('assistant.save')}
            </button>
            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={() => setFeedback('up')}
                aria-label="Helpful"
                className={`focus-ring rounded-lg p-1.5 transition-colors ${
                  feedback === 'up' ? 'text-verified bg-verified-soft' : 'text-ink-faint hover:bg-surface'
                }`}
              >
                <ThumbsUp size={14} />
              </button>
              <button
                onClick={() => setFeedback('down')}
                aria-label="Not helpful"
                className={`focus-ring rounded-lg p-1.5 transition-colors ${
                  feedback === 'down' ? 'text-alert bg-alert-soft' : 'text-ink-faint hover:bg-surface'
                }`}
              >
                <ThumbsDown size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useRef, useState, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUp } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  value?: string;
  onValueChange?: (v: string) => void;
}

export default function ChatInput({ onSend, disabled, value, onValueChange }: ChatInputProps) {
  const { t } = useTranslation();
  const [internal, setInternal] = useState('');
  const text = value !== undefined ? value : internal;
  const setText = onValueChange ?? setInternal;
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = `${Math.min(ref.current.scrollHeight, 160)}px`;
    }
  }, [text]);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex items-end gap-2 rounded-2xl border border-line bg-surface-raised px-3 py-2.5 shadow-[var(--shadow-card)] focus-within:border-blue transition-colors">
      <textarea
        ref={ref}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('assistant.inputPlaceholder')}
        aria-label="Ask a question"
        className="flex-1 resize-none bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none py-1.5 max-h-40"
      />
      <button
        onClick={submit}
        disabled={!text.trim() || disabled}
        aria-label="Send message"
        className="focus-ring shrink-0 flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-white disabled:opacity-30 hover:bg-navy-deep transition-colors"
      >
        <ArrowUp size={17} />
      </button>
    </div>
  );
}

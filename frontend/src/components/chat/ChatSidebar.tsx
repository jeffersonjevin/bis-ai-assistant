import { useTranslation } from 'react-i18next';
import { Plus, MessageSquare, Bookmark, Settings, X } from 'lucide-react';
import type { Conversation } from '../../types';

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  mobileOpen,
  onCloseMobile,
}: ChatSidebarProps) {
  const { t } = useTranslation();

  const content = (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <button
          onClick={onNew}
          className="focus-ring w-full inline-flex items-center justify-center gap-2 rounded-xl bg-navy text-white px-4 py-2.5 text-sm font-medium hover:bg-navy-deep transition-colors"
        >
          <Plus size={16} />
          {t('assistant.newChat')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink-faint">{t('assistant.recent')}</p>
        <div className="space-y-1">
          {conversations.length === 0 && (
            <p className="px-2 py-3 text-sm text-ink-faint">{t('assistant.noConversations')}</p>
          )}
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`focus-ring w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm text-left transition-colors ${
                activeId === c.id ? 'bg-blue-mist text-navy font-medium' : 'text-ink-soft hover:bg-surface'
              }`}
            >
              <MessageSquare size={15} className="shrink-0" />
              <span className="truncate">{c.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-line p-3 space-y-1">
        <button className="focus-ring w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm text-ink-soft hover:bg-surface transition-colors">
          <Bookmark size={15} />
          {t('assistant.saved')}
        </button>
        <button className="focus-ring w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm text-ink-soft hover:bg-surface transition-colors">
          <Settings size={15} />
          {t('assistant.settings')}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-line bg-surface-raised">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-navy-deep/40" onClick={onCloseMobile} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-surface-raised shadow-[var(--shadow-card-hover)] animate-fade-up">
            <div className="flex items-center justify-between px-4 py-3 border-b border-line">
              <span className="font-display font-semibold text-sm text-ink">{t('assistant.conversations')}</span>
              <button onClick={onCloseMobile} className="focus-ring rounded-lg p-1.5 text-ink-faint hover:bg-surface">
                <X size={18} />
              </button>
            </div>
            <div className="h-[calc(100%-49px)]">{content}</div>
          </div>
        </div>
      )}
    </>
  );
}

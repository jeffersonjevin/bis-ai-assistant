import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Search, FileCheck2, FlaskConical, Gem, ShieldCheck } from 'lucide-react';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatInput from '../components/chat/ChatInput';
import AnswerCard from '../components/chat/AnswerCard';
import SourcePanel from '../components/chat/SourcePanel';
import TypingIndicator from '../components/chat/TypingIndicator';
import { askAssistant } from '../services/api';
import type { ChatMessage, Conversation, SourceRef } from '../types';

function newConversation(title: string): Conversation {
  return { id: crypto.randomUUID(), title, messages: [], createdAt: Date.now() };
}

export default function Assistant() {
  const { t } = useTranslation();
  const location = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeSources, setActiveSources] = useState<SourceRef[] | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestionCards = [
    { icon: Search, label: t('assistant.suggestFindStandard'), query: 'Which BIS standard applies to domestic electric fans?' },
    { icon: FileCheck2, label: t('assistant.suggestCertification'), query: 'How do I get BIS certification for my product?' },
    { icon: FlaskConical, label: t('assistant.suggestFindLab'), query: 'Find a recognized testing laboratory for steel products.' },
    { icon: Gem, label: t('assistant.suggestHallmarking'), query: 'What are the hallmarking requirements for gold jewellery?' },
  ];

  const active = conversations.find((c) => c.id === activeId) ?? null;

  useEffect(() => {
    const first = newConversation(t('assistant.newChat'));
    setConversations([first]);
    setActiveId(first.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const prefill = (location.state as { prefill?: string } | null)?.prefill;
    if (prefill) {
      setInputValue(prefill);
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [active?.messages.length, loading]);

  const handleNew = () => {
    const conv = newConversation(t('assistant.newChat'));
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
    setMobileSidebarOpen(false);
  };

  const handleSend = async (text: string) => {
    if (!activeId) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', text, timestamp: Date.now() };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, title: c.messages.length === 0 ? text.slice(0, 42) : c.title, messages: [...c.messages, userMsg] }
          : c
      )
    );

    setLoading(true);
    const answer = await askAssistant(text);
    setLoading(false);

    const aiMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      text: answer.answer,
      answer,
      timestamp: Date.now(),
    };
    setConversations((prev) => prev.map((c) => (c.id === activeId ? { ...c, messages: [...c.messages, aiMsg] } : c)));
  };

  const isEmpty = !active || active.messages.length === 0;

  return (
    <div className="flex h-full">
      <ChatSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={(id) => {
          setActiveId(id);
          setMobileSidebarOpen(false);
        }}
        onNew={handleNew}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-3 border-b border-line px-4 sm:px-6 py-3.5 bg-surface-raised">
          <button
            className="focus-ring lg:hidden rounded-lg p-1.5 text-ink-soft hover:bg-surface"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open conversations"
          >
            <Menu size={19} />
          </button>
          <h1 className="font-display font-semibold text-ink">{t('assistant.title')}</h1>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center px-4 sm:px-6 py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-white mb-5 animate-fade-up">
                <ShieldCheck size={26} />
              </div>
              <h2 className="font-display text-2xl font-semibold text-ink animate-fade-up" style={{ animationDelay: '80ms' }}>
                {t('assistant.emptyTitle')}
              </h2>
              <p className="mt-2 text-ink-soft max-w-md animate-fade-up" style={{ animationDelay: '140ms' }}>
                {t('assistant.emptySubtitle')}
              </p>

              <div className="mt-8 grid sm:grid-cols-2 gap-4 max-w-xl w-full">
                {suggestionCards.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.label}
                      onClick={() => setInputValue(s.query)}
                      className="focus-ring text-left rounded-2xl border border-line bg-surface-raised p-4 hover:border-blue hover:shadow-[var(--shadow-card)] transition-all animate-fade-up"
                      style={{ animationDelay: `${180 + i * 60}ms` }}
                    >
                      <Icon size={18} className="text-blue mb-2" />
                      <p className="text-sm font-medium text-ink">{s.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
              {active?.messages.map((m) =>
                m.role === 'user' ? (
                  <div key={m.id} className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-br-md bg-navy text-white px-4 py-2.5 text-sm leading-relaxed animate-fade-up">
                      {m.text}
                    </div>
                  </div>
                ) : (
                  <AnswerCard
                    key={m.id}
                    answer={m.answer!}
                    onViewSources={() => setActiveSources(m.answer!.sources)}
                  />
                )
              )}
              {loading && (
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy text-white">
                    <ShieldCheck size={14} />
                  </span>
                  <TypingIndicator />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-line bg-surface-raised px-4 sm:px-6 py-4">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSend={handleSend} disabled={loading} value={inputValue} onValueChange={setInputValue} />
            <p className="mt-2 text-center text-xs text-ink-faint">{t('assistant.disclaimer')}</p>
          </div>
        </div>
      </div>

      <SourcePanel open={!!activeSources} onClose={() => setActiveSources(null)} sources={activeSources ?? []} />
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, SlidersHorizontal, FileSearch } from 'lucide-react';
import { searchStandards } from '../services/api';
import { mockStandards } from '../data/standards';
import type { Standard } from '../types';
import StandardCard from '../components/standards/StandardCard';
import StandardDetailModal from '../components/standards/StandardDetailModal';
import Button from '../components/ui/Button';

const categories = ['All', ...Array.from(new Set(mockStandards.map((s) => s.category)))];
const statuses = ['All', 'Active', 'Reaffirmed', 'Amended', 'Withdrawn', 'Superseded'];

export default function Standards() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [certOnly, setCertOnly] = useState(false);
  const [results, setResults] = useState<Standard[]>(mockStandards);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Standard | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilterCount = useMemo(
    () => [category !== 'All', status !== 'All', certOnly].filter(Boolean).length,
    [category, status, certOnly]
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const timer = setTimeout(async () => {
      const res = await searchStandards({ query, category, status, certificationOnly: certOnly });
      if (!cancelled) {
        setResults(res);
        setLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, category, status, certOnly]);

  const askAi = (standard: Standard) => {
    navigate('/assistant', { state: { prefill: `Tell me more about ${standard.number} — ${standard.title}` } });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-display text-4xl font-semibold text-ink tracking-tight">{t('standards.title')}</h1>
        <p className="mt-3 text-ink-soft">{t('standards.subtitle')}</p>
      </div>

      <div className="mt-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface-raised px-4 py-3 shadow-[var(--shadow-card)] focus-within:border-blue transition-colors">
          <Search size={18} className="text-ink-faint shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('standards.searchPlaceholder')}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-faint"
          />
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className={`focus-ring inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeFilterCount > 0 ? 'bg-blue-light text-blue' : 'text-ink-soft hover:bg-surface'
            }`}
          >
            <SlidersHorizontal size={14} />
            {t('standards.filters')} {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
        </div>

        {filtersOpen && (
          <div className="mt-3 grid sm:grid-cols-3 gap-3 animate-fade-up">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="focus-ring rounded-xl border border-line bg-surface-raised px-3 py-2 text-sm text-ink-soft"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'All' ? t('standards.allCategories') : c}</option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="focus-ring rounded-xl border border-line bg-surface-raised px-3 py-2 text-sm text-ink-soft"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s === 'All' ? t('standards.allStatuses') : s}</option>
              ))}
            </select>
            <label className="focus-ring flex items-center gap-2 rounded-xl border border-line bg-surface-raised px-3 py-2 text-sm text-ink-soft cursor-pointer">
              <input type="checkbox" checked={certOnly} onChange={(e) => setCertOnly(e.target.checked)} className="accent-blue" />
              {t('standards.certOnly')}
            </label>
          </div>
        )}
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-56 rounded-2xl bg-line/50 animate-shimmer bg-gradient-to-r from-line via-white to-line" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <FileSearch size={40} className="mx-auto text-ink-faint mb-4" />
            <h3 className="font-display font-semibold text-ink text-lg">{t('standards.noResultsTitle')}</h3>
            <p className="text-ink-soft text-sm mt-1">{t('standards.noResultsSubtitle')}</p>
            <div className="mt-4">
              <Button variant="secondary" onClick={() => { setQuery(''); setCategory('All'); setStatus('All'); setCertOnly(false); }}>
                {t('standards.clearFilters')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((s) => (
              <StandardCard key={s.id} standard={s} onView={() => setSelected(s)} onAskAi={() => askAi(s)} />
            ))}
          </div>
        )}
      </div>

      <StandardDetailModal standard={selected} onClose={() => setSelected(null)} onAskAi={askAi} />
    </div>
  );
}

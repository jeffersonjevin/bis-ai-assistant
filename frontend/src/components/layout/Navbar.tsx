import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Globe, Menu, X, ShieldCheck, Sparkles, Check } from 'lucide-react';
import { supportedLanguages, setLanguage } from '../../i18n/config';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const langMenuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { to: '/', label: t('nav.home') },
    { to: '/assistant', label: t('nav.assistant') },
    { to: '/standards', label: t('nav.standards') },
    { to: '/services', label: t('nav.services') },
    { to: '/about', label: t('nav.about') },
  ];

  const activeLanguage = supportedLanguages.find((l) => l.code === i18n.language) ?? supportedLanguages[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!langOpen) return;
    const onClick = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setLangOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [langOpen]);

  const chooseLanguage = (code: string) => {
    setLanguage(code);
    setLangOpen(false);
  };

  const dropdownMotionProps = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: -6, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -6, scale: 0.98 },
        transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <header
      className={`sticky top-0 z-40 bg-surface-raised/90 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? 'shadow-[var(--shadow-nav)]' : ''
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 font-display font-semibold text-navy shrink-0 focus-ring rounded-lg">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-white">
            <ShieldCheck size={17} strokeWidth={2.3} />
          </span>
          <span className="hidden sm:inline text-[15px] tracking-tight">BIS Intelligent Assistant</span>
          <span className="sm:hidden text-[15px]">BIS AI</span>
        </NavLink>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `focus-ring relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive ? 'text-navy' : 'text-ink-soft hover:text-navy'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <span className="absolute left-3.5 right-3.5 -bottom-[1px] h-[2px] rounded-full bg-blue" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block" ref={langMenuRef}>
            <button
              onClick={() => setLangOpen((v) => !v)}
              className="focus-ring flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-ink-soft hover:bg-surface transition-colors"
              aria-haspopup="listbox"
              aria-expanded={langOpen}
              aria-label={t('nav.language')}
            >
              <Globe size={16} />
              {activeLanguage.nativeLabel}
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  role="listbox"
                  aria-label={t('nav.language')}
                  {...dropdownMotionProps}
                  className="absolute right-0 mt-1 w-40 rounded-xl border border-line bg-surface-raised shadow-[var(--shadow-card-hover)] py-1 origin-top-right"
                >
                  {supportedLanguages.map((l) => (
                    <button
                      key={l.code}
                      role="option"
                      aria-selected={activeLanguage.code === l.code}
                      onClick={() => chooseLanguage(l.code)}
                      className="focus-ring w-full flex items-center gap-2 text-left px-3 py-1.5 text-sm text-ink-soft hover:bg-surface hover:text-ink"
                    >
                      <span aria-hidden="true">🌐</span>
                      <span className="flex-1">{l.nativeLabel}</span>
                      {activeLanguage.code === l.code && <Check size={14} className="text-blue" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => navigate('/assistant')}
            className="focus-ring hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-navy text-white px-4 py-2 text-sm font-medium hover:bg-navy-deep transition-colors shadow-[0_2px_10px_-2px_rgba(11,36,71,0.45)]"
          >
            <Sparkles size={15} />
            {t('nav.askAI')}
          </button>

          <button
            className="focus-ring md:hidden rounded-lg p-2 text-ink-soft hover:bg-surface"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-line bg-surface-raised px-4 py-3 animate-fade-up">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `focus-ring rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-blue-mist text-navy' : 'text-ink-soft hover:bg-surface'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <div className="mt-2 border-t border-line pt-2">
              <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                {t('nav.language')}
              </p>
              <div className="grid grid-cols-2 gap-1 px-1">
                {supportedLanguages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => chooseLanguage(l.code)}
                    className={`focus-ring flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                      activeLanguage.code === l.code
                        ? 'bg-blue-mist text-navy font-medium'
                        : 'text-ink-soft hover:bg-surface'
                    }`}
                  >
                    <span aria-hidden="true">🌐</span>
                    {l.nativeLabel}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setMobileOpen(false);
                navigate('/assistant');
              }}
              className="focus-ring mt-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-navy text-white px-4 py-2.5 text-sm font-medium"
            >
              <Sparkles size={15} />
              {t('nav.askAI')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

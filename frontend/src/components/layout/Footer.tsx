import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-line bg-surface-raised">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2 font-display font-semibold text-navy">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy text-white">
              <ShieldCheck size={14} strokeWidth={2.3} />
            </span>
            BIS Intelligent Assistant
          </div>
          <p className="mt-3 text-sm text-ink-soft leading-relaxed max-w-xs">{t('footer.tagline')}</p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-ink mb-3">{t('footer.quickLinks')}</h4>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li><Link className="focus-ring hover:text-navy transition-colors" to="/">{t('nav.home')}</Link></li>
            <li><Link className="focus-ring hover:text-navy transition-colors" to="/assistant">{t('nav.assistant')}</Link></li>
            <li><Link className="focus-ring hover:text-navy transition-colors" to="/standards">{t('nav.standards')}</Link></li>
            <li><Link className="focus-ring hover:text-navy transition-colors" to="/services">{t('nav.services')}</Link></li>
            <li><Link className="focus-ring hover:text-navy transition-colors" to="/about">{t('nav.about')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold text-ink mb-3">{t('footer.knowledgeSources')}</h4>
          <p className="text-sm text-ink-soft leading-relaxed">{t('footer.knowledgeSourcesBody')}</p>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink-faint">
          <span>{t('footer.copyright')}</span>
          <span>{t('footer.disclaimer')}</span>
        </div>
      </div>
    </footer>
  );
}

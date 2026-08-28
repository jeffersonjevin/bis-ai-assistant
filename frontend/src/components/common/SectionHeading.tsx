interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({ eyebrow, title, subtitle, align = 'center' }: SectionHeadingProps) {
  return (
    <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <span className="inline-block text-xs font-mono font-semibold tracking-widest uppercase text-blue mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl sm:text-4xl font-semibold text-ink tracking-tight text-balance">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-ink-soft leading-relaxed">{subtitle}</p>}
    </div>
  );
}

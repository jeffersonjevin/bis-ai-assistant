import { Search, Bot, FileText, ShieldCheck } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

const nodes = [
  {
    icon: Search,
    label: 'User query',
    detail: '"Which standard applies to my product?"',
    tone: 'text-navy bg-blue-light',
  },
  {
    icon: Bot,
    label: 'BIS AI Assistant',
    detail: 'Interprets intent, retrieves relevant context',
    tone: 'text-white bg-navy',
  },
  {
    icon: FileText,
    label: 'BIS knowledge sources',
    detail: 'Standards · Schemes · Labs · Hallmarking',
    tone: 'text-navy bg-blue-light',
  },
  {
    icon: ShieldCheck,
    label: 'Verified answer',
    detail: 'Response with cited BIS sources',
    tone: 'text-verified bg-verified-soft',
  },
];

export default function AnimatedFlow() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative w-full max-w-sm mx-auto lg:mx-0">
      {/* connector line */}
      <div className="absolute left-6 top-8 bottom-8 w-px bg-line overflow-hidden">
        {!reduceMotion && (
          <>
            <motion.span
              className="absolute left-1/2 -translate-x-1/2 h-14 w-px"
              style={{
                background: 'linear-gradient(to bottom, transparent, var(--color-blue), transparent)',
              }}
              initial={{ top: '-15%' }}
              animate={{ top: '115%' }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }}
            />
            <motion.span
              className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue"
              style={{ boxShadow: '0 0 10px 3px rgba(29,95,168,0.55)' }}
              initial={{ top: '-4%' }}
              animate={{ top: '104%' }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }}
            />
          </>
        )}
      </div>

      <div className="flex flex-col gap-5">
        {nodes.map((node, i) => {
          const Icon = node.icon;
          return (
            <motion.div
              key={node.label}
              className="relative flex items-start gap-4"
              initial={reduceMotion ? undefined : { opacity: 0, x: -14 }}
              animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.16, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                whileHover={reduceMotion ? undefined : { scale: 1.08 }}
                className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${node.tone} shadow-sm`}
              >
                <Icon size={20} strokeWidth={2} />
                {i === nodes.length - 1 && !reduceMotion && (
                  <motion.span
                    className="absolute inset-0 rounded-xl"
                    style={{ boxShadow: '0 0 0 0 rgba(31,138,94,0.45)' }}
                    animate={{
                      boxShadow: [
                        '0 0 0 0 rgba(31,138,94,0.45)',
                        '0 0 0 8px rgba(31,138,94,0)',
                      ],
                    }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}
              </motion.div>
              <div className="pt-1.5 min-w-0">
                <p className="font-display text-sm font-semibold text-ink">{node.label}</p>
                <p className="text-xs text-ink-faint mt-0.5 leading-snug">{node.detail}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

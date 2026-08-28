export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-ink-faint animate-pulse-dot"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </div>
  );
}

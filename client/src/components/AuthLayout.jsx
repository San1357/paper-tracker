import { BookOpenText, Sparkles } from "lucide-react";

function Wordmark({ className = "" }) {
  return (
    <div className={`flex items-center gap-2 font-serif text-xl ${className}`}>
      <BookOpenText size={22} aria-hidden="true" />
      Paper Tracker
    </div>
  );
}

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.15fr_1fr]">
      {/* Left panel */}
      <aside className="graph-paper-dark relative hidden flex-col justify-between overflow-hidden bg-ink p-12 text-white lg:flex">
        <Wordmark />

        <div className="mx-auto w-full max-w-md">
          <p className="font-serif text-4xl leading-tight tracking-tight">
            Every paper you read, in one place.
          </p>

          {/* Stacked sheets of paper */}
          <div className="relative mt-14">
            <div aria-hidden="true" className="absolute inset-0 -rotate-6 rounded-lg bg-white/85 shadow-2xl shadow-black/40" />
            <div aria-hidden="true" className="absolute inset-0 rotate-3 rounded-lg bg-white/95 shadow-2xl shadow-black/40" />

            <figure className="relative rounded-lg bg-white p-8 text-ink shadow-2xl shadow-black/50">
              <p className="text-xs text-ink-soft">arXiv 1706.03762</p>
              <p className="mt-3 font-serif text-2xl leading-snug">
                <span className="highlight" style={{ animationDelay: "500ms" }}>
                  Attention Is All You Need
                </span>
              </p>
              <p className="mt-2 text-sm text-ink-soft">Vaswani, Shazeer, Parmar et al. (2017)</p>

              <div className="mt-6 border-l-2 border-pen pl-4">
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  <Sparkles size={14} className="text-pen" aria-hidden="true" />
                  AI summary
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  Replaces recurrence with attention alone, trains faster, and sets new results on
                  machine translation.
                </p>
              </div>

              <div className="mt-6 flex gap-3 text-sm text-pen">
                <span>#transformers</span>
                <span>#nlp</span>
              </div>
            </figure>
          </div>
        </div>

        <p className="text-sm text-white/50">Save from arXiv. Track your reading. Get a summary.</p>
      </aside>

      {/* Right: form */}
      <main className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <Wordmark className="mb-10 text-ink lg:hidden" />
          <h1 className="font-serif text-4xl tracking-tight">{title}</h1>
          <p className="mt-2 text-ink-soft">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <p className="mt-6 text-sm text-ink-soft">{footer}</p>}
        </div>
      </main>
    </div>
  );
}
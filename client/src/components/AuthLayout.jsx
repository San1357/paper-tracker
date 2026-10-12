import { BookOpenText } from "lucide-react";

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
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* Left panel: sirf bade screen pe */}
      <aside className="hidden flex-col justify-between bg-ink p-12 text-white lg:flex">
        <Wordmark />

        <div className="max-w-md">
          <p className="font-serif text-3xl leading-snug">
            Save papers from arXiv, track what you're reading, and get a short summary of each one.
          </p>

          <figure className="mt-10 border-l-2 border-highlight pl-5">
            <p className="font-serif text-lg">
              <span className="highlight-dark">Attention Is All You Need</span>
            </p>
            <p className="mt-1 text-sm text-white/60">Vaswani, Shazeer, Parmar et al., 2017</p>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Summary: replaces recurrence with attention alone, trains faster, and sets new
              results on machine translation.
            </p>
          </figure>
        </div>

        <p className="text-sm text-white/50">Built for students who read a lot of papers.</p>
      </aside>

      {/* Right: form */}
      <main className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <Wordmark className="mb-10 text-ink lg:hidden" />
          <h1 className="font-serif text-3xl">{title}</h1>
          <p className="mt-2 text-ink-soft">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <p className="mt-6 text-sm text-ink-soft">{footer}</p>}
        </div>
      </main>
    </div>
  );
}
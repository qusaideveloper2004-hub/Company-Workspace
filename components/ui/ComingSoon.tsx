interface ComingSoonProps {
  title: string;
  description: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="flex min-h-[calc(100vh-96px)] flex-col items-center justify-center px-6 text-center py-16">
      <span className="mb-3 inline-flex rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        Coming soon
      </span>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
        {description}
      </p>
    </div>
  );
}

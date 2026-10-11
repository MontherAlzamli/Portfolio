type SectionHeadingProps = {
  index: string;
  label: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  index,
  label,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <header className="mb-12 max-w-2xl lg:mb-16" data-reveal>
      <p className="mb-3 font-mono text-sm text-brand">
        <span aria-hidden="true">{`${index} // `}</span>
        {label}
      </p>
      <h2 className="font-mono text-title font-semibold text-fg text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-muted">{description}</p>
      )}
    </header>
  );
}

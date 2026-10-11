'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';

type HeroTerminalProps = {
  name: string;
  title: string;
  stack: Record<string, string[]>;
};

type Progress = { block: number; chars: number; output: boolean };

const TYPE_MS = 45;
const START_MS = 900;
const OUTPUT_MS = 220;
const NEXT_MS = 650;
const PIPELINE = ['lint', 'type-check', 'tests', 'build'];

// A short terminal session that types itself out once on page load. Every line
// keeps its place in the layout from the start, so only opacity changes.
export function HeroTerminal({ name, title, stack }: HeroTerminalProps) {
  // 'pending' is the server-rendered state: the finished session, which
  // globals.css hides only until this component takes over
  const [status, setStatus] = useState<'pending' | 'running' | 'done'>(
    'pending'
  );
  const [progress, setProgress] = useState<Progress>({
    block: 0,
    chars: 0,
    output: false,
  });

  const stackEntries = Object.entries(stack);

  const blocks: { command: string; output: ReactNode }[] = [
    {
      command: 'whoami',
      output: (
        <p className="text-term-muted">
          {name}, {title}
        </p>
      ),
    },
    {
      command: 'cat stack.json',
      output: (
        <div className="text-term-muted">
          <p>{'{'}</p>
          {stackEntries.map(([area, items], i) => (
            <p key={area} className="break-words pl-4">
              <span className="text-term-fg">&quot;{area}&quot;</span>: [
              {items.map(item => `"${item}"`).join(', ')}]
              {i < stackEntries.length - 1 ? ',' : ''}
            </p>
          ))}
          <p>{'}'}</p>
        </div>
      ),
    },
    {
      command: 'npm run deploy',
      output: (
        <ul className="text-term-muted">
          {PIPELINE.map((stepName, i) => (
            <li
              key={stepName}
              className="term-step"
              style={{ '--i': i } as CSSProperties}
            >
              <span className="text-term-accent">✓</span> {stepName}
            </li>
          ))}
          <li
            className="term-step text-term-fg"
            style={{ '--i': PIPELINE.length } as CSSProperties}
          >
            <span className="text-term-accent">→</span> deployed to production
          </li>
        </ul>
      ),
    },
  ];

  const commands = blocks.map(block => block.command);
  const lastBlock = blocks.length - 1;
  const pipelineMs = (PIPELINE.length + 1) * 160 + 300;

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStatus('done');
      return;
    }
    const start = setTimeout(() => setStatus('running'), START_MS);
    return () => clearTimeout(start);
  }, []);

  useEffect(() => {
    if (status !== 'running') return;
    const { block, chars, output } = progress;
    let timer: ReturnType<typeof setTimeout>;

    if (chars < commands[block].length) {
      timer = setTimeout(
        () => setProgress({ block, chars: chars + 1, output }),
        TYPE_MS
      );
    } else if (!output) {
      timer = setTimeout(
        () => setProgress({ block, chars, output: true }),
        OUTPUT_MS
      );
    } else if (block < lastBlock) {
      timer = setTimeout(
        () => setProgress({ block: block + 1, chars: 0, output: false }),
        NEXT_MS
      );
    } else {
      timer = setTimeout(() => setStatus('done'), pipelineMs);
    }

    return () => clearTimeout(timer);
    // commands, lastBlock and pipelineMs are derived from props and constants
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, progress]);

  const running = status === 'running';

  return (
    <div
      data-term={status}
      className="space-y-4 p-5 font-mono text-[0.8125rem] leading-relaxed text-term-fg sm:text-sm"
    >
      <div data-term-body className="space-y-4">
        {blocks.map((block, i) => {
          const started = !running || i <= progress.block;
          const typed = !running
            ? block.command.length
            : i < progress.block
              ? block.command.length
              : i === progress.block
                ? progress.chars
                : 0;
          const showOutput =
            !running ||
            i < progress.block ||
            (i === progress.block && progress.output);
          const typing =
            running && i === progress.block && typed < block.command.length;

          return (
            <div key={block.command}>
              <p className={started ? undefined : 'opacity-0'}>
                <span className="text-term-accent">$</span>{' '}
                {block.command.slice(0, typed)}
                {/* Zero-width holder so the cursor never moves the text after it */}
                <span className="relative inline-block h-4 w-0 align-middle">
                  {typing && (
                    <span className="absolute left-px top-0 h-4 w-2 bg-term-accent" />
                  )}
                </span>
                <span className="opacity-0">{block.command.slice(typed)}</span>
              </p>
              <div data-shown={showOutput} className="term-output">
                {block.output}
              </div>
            </div>
          );
        })}

        <p className={status === 'running' ? 'opacity-0' : undefined}>
          <span className="text-term-accent">$</span>
          <span className="cursor-blink ml-2 inline-block h-4 w-2 translate-y-0.5 bg-term-accent" />
        </p>
      </div>
    </div>
  );
}

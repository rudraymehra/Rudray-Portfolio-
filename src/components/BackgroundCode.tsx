import React, { useEffect, useRef, useState } from 'react';

// Ambient, on-theme snippets that "type out" in the background.
const SNIPPETS = [
  '$ kubectl get pods -n sentinel',
  'def diagnose(incident): return brain.analyze(incident)',
  'graph.add_node("remediate", remediation_planner)',
  '@RestController class AuthController { /* ... */ }',
  'spring.security.oauth2.resourceserver.jwt.issuer-uri=...',
  'anchor build && anchor deploy --provider.cluster devnet',
  'const order = await jupiter.execute(limitOrder);',
  'cargo run --release   # keeper service online',
  'reward = grader.score(trajectory)   # 0.0 - 1.0',
  'POST /api/v1/evaluations  200 OK  (62ms)',
  'SELECT id, name FROM students WHERE active = true;',
  'docker compose up -d --build',
  'git push origin main   # CI/CD pipeline triggered',
  'curl -s localhost:8080/health  ->  { "status": "UP" }',
  'export RUST_LOG=info && solana program deploy ./target/...',
  'task_success_rate: 60% -> 90%  ✓',
  'qdrant.search(collection="docs", vector=embedding, top_k=5)',
  'npm run build && vite preview',
];

const MAX_LINES = 40;

const BackgroundCode: React.FC = () => {
  const [lines, setLines] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const snipIdx = useRef(0);
  const charIdx = useRef(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      setLines(SNIPPETS.slice(0, 18));
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const snip = SNIPPETS[snipIdx.current % SNIPPETS.length];
      if (charIdx.current < snip.length) {
        charIdx.current += 1;
        setCurrent(snip.slice(0, charIdx.current));
        timer = setTimeout(tick, 30 + Math.random() * 50);
      } else {
        setLines((prev) => {
          const next = [...prev, snip];
          return next.length > MAX_LINES ? next.slice(next.length - MAX_LINES) : next;
        });
        setCurrent('');
        charIdx.current = 0;
        snipIdx.current += 1;
        timer = setTimeout(tick, 450);
      }
    };
    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-0 overflow-hidden select-none"
      style={{ zIndex: -1 }}
    >
      <pre className="absolute bottom-0 left-0 right-0 p-4 lg:p-8 font-mono text-[10px] sm:text-xs leading-relaxed text-terminal-primary opacity-[0.07] whitespace-pre-wrap">
        {lines.join('\n')}
        {lines.length ? '\n' : ''}
        {current}
        <span className="animate-blink">▋</span>
      </pre>
    </div>
  );
};

export default BackgroundCode;

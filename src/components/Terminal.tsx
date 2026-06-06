import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, FileText, Building2, Lock } from 'lucide-react';
import BackgroundCode from './BackgroundCode';

interface Command {
  input: string;
  output: React.ReactNode;
}

interface CommandFunction {
  (input?: string): React.ReactNode;
}

const RESUME_URL =
  'https://drive.google.com/file/d/13b4NwEOqp40CgT8qV-bPAvziPOwFl2BT/view?usp=sharing';

// Curated commands the ↑/↓ keys cycle through, so visitors can browse without typing.
const QUICK_COMMANDS = [
  'about',
  'projects',
  'skills',
  'experience',
  'education',
  'achievements',
  'contact',
  'resume',
  'help',
];

// Levenshtein distance for "did you mean?" suggestions
const levenshtein = (a: string, b: string): number => {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
    }
  }
  return matrix[a.length][b.length];
};

const longestCommonPrefix = (words: string[]): string => {
  if (!words.length) return '';
  let prefix = words[0];
  for (const w of words) {
    while (!w.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
};

const BOOT_SEQUENCE = [
  'booting rudray@portfolio ...',
  'loading modules [ about · projects · skills · experience · education ] ... ok',
  'establishing secure shell ... ok',
  'type "help" to begin. ready.',
].join('\n');

const Terminal = () => {
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<Command[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [booting, setBooting] = useState(true);
  const [bootText, setBootText] = useState('');
  const commandHistoryRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const bootTimer = useRef<ReturnType<typeof setTimeout>>();

  const welcomeOutput = () => (
    <div className="text-terminal-text">
      <div className="space-y-2">
        <div className="text-terminal-accent">Welcome to Rudray's Portfolio Terminal! 🚀</div>
        <div className="text-sm">
          Full Stack &amp; Backend Engineer. Previously an SDE intern at InterviewBit (Scaler AI Labs),
          building RL environments for frontier-model training.
        </div>
        <div className="text-sm mt-4">Quick Start:</div>
        <div className="ml-4 space-y-1 text-sm">
          <div>• Type <span className="text-terminal-primary">help</span> to see all commands</div>
          <div>• Type <span className="text-terminal-primary">about</span> to learn more about me</div>
          <div>• Type <span className="text-terminal-primary">projects</span> to view my work</div>
          <div>• Type <span className="text-terminal-primary">experience</span> to see where I've worked</div>
        </div>
        <div className="text-terminal-muted text-xs mt-3">
          Tip: use <span className="text-terminal-primary">↑ / ↓</span> for history,
          {' '}<span className="text-terminal-primary">Tab</span> to autocomplete.
        </div>
      </div>
    </div>
  );

  const commands: Record<string, CommandFunction> = {
    help: () => (
      <div className="text-terminal-accent">
        <div>Available commands:</div>
        <div className="ml-4 mt-2 space-y-1">
          <div><span className="text-terminal-primary">welcome</span> - Display welcome message</div>
          <div><span className="text-terminal-primary">about</span> - Learn more about me</div>
          <div><span className="text-terminal-primary">projects</span> - View my projects</div>
          <div><span className="text-terminal-primary">contact</span> - Get in touch</div>
          <div><span className="text-terminal-primary">skills</span> - Technical skills</div>
          <div><span className="text-terminal-primary">experience</span> - Work experience</div>
          <div><span className="text-terminal-primary">education</span> - Educational background</div>
          <div><span className="text-terminal-primary">achievements</span> - My accomplishments</div>
          <div><span className="text-terminal-primary">resume</span> - Download my resume</div>
          <div><span className="text-terminal-primary">history</span> - Show command history</div>
          <div><span className="text-terminal-primary">crt</span> - Toggle retro CRT/scanline effect</div>
          <div><span className="text-terminal-primary">clear</span> - Clear terminal</div>
          <div><span className="text-terminal-primary">theme</span> - Change terminal theme</div>
          <div><span className="text-terminal-primary">fortune</span> - Display a random programming quote</div>
        </div>
        <div className="mt-4 text-terminal-text">
          For more commands, type <span className="text-terminal-primary">man</span> to see the complete manual.
        </div>
        <div className="mt-1 text-terminal-muted text-xs">
          Navigate with <span className="text-terminal-primary">↑ / ↓</span> (history) and
          {' '}<span className="text-terminal-primary">Tab</span> (autocomplete).
        </div>
      </div>
    ),
    about: () => (
      <div className="text-terminal-text">
        <div className="text-terminal-secondary mb-3 term-section">▶ About Rudray</div>
        <div className="ml-4 space-y-2">
          <div>👋 Hey there! I'm Rudray Mehra, a Full Stack Developer &amp; Backend Engineer.</div>
          <div>🤖 Most recently an SDE intern at InterviewBit (Scaler AI Labs), where I built RL environments and evaluation pipelines used to train frontier models from OpenAI &amp; xAI.</div>
          <div>🚀 I love building scalable backend systems with Spring Boot, Node.js, and modern React/Next.js frontends.</div>
          <div>⛓️ Lately exploring Solana/Anchor (ZK compression) and AI infra on Kubernetes (FastAPI, LangGraph, Ollama).</div>
          <div>📚 Pursuing a B.S. in Computer Science at BITS Pilani (Graduation 2027).</div>
          <div>🎯 Goal: build robust, scalable systems that solve real-world problems.</div>
        </div>
      </div>
    ),
    projects: () => (
      <div className="text-terminal-text">
        <div className="text-terminal-secondary mb-3 term-section">▶ Featured Projects</div>
        <div className="ml-4 space-y-3">
          <div className="term-card">
            <div className="text-terminal-accent font-bold">🛡️ Sentinel - AI Observability &amp; Auto-Remediation for Kubernetes</div>
            <div className="text-sm mt-1">AI-powered platform that detects, diagnoses, and recovers from cluster incidents using a three-brain architecture.</div>
            <div className="tech-chips">
              {['Kubernetes', 'FastAPI', 'Ollama', 'LangGraph', 'Qdrant'].map((t) => (
                <span key={t} className="tech-chip">{t}</span>
              ))}
            </div>
            <div className="text-xs mt-1">• Three-brain pipeline for detection, diagnosis, and recovery</div>
            <div className="text-xs">• Integrated K8sGPT, OpenTelemetry, and VictoriaMetrics for grounded signals</div>
            <div className="text-xs">• Generates remediation plans with human-in-the-loop safeguards</div>
            <div className="text-terminal-muted text-xs mt-2 flex items-center gap-2">
              <Lock size={12} />
              <span>Private repo · May 2026 - Present</span>
            </div>
          </div>
          <div className="term-card">
            <div className="text-terminal-accent font-bold">⛓️ KLIRA - Solana Limit-Order Protocol</div>
            <div className="text-sm mt-1">On-chain limit orders with ZK compression that removes per-order rent costs while preserving self-custody.</div>
            <div className="tech-chips">
              {['Solana', 'Rust', 'Anchor', 'TypeScript', 'Next.js', 'PostgreSQL'].map((t) => (
                <span key={t} className="tech-chip">{t}</span>
              ))}
            </div>
            <div className="text-xs mt-1">• Used Light Protocol ZK compression to eliminate per-order rent</div>
            <div className="text-xs">• Rust/Anchor smart contracts + a TypeScript keeper service executing via Jupiter</div>
            <div className="text-xs">• Next.js frontend with wallet integration, Dockerized deploy, and CI/CD</div>
            <div className="text-terminal-muted text-xs mt-2 flex items-center gap-2">
              <Lock size={12} />
              <span>Private repo · Jan 2026 - Mar 2026</span>
            </div>
          </div>
          <div className="term-card">
            <div className="text-terminal-accent font-bold">🎯 InterviewLytics - AI Interview Intelligence Platform</div>
            <div className="text-sm mt-1">AI-powered platform for candidate evaluation, recruiter workflows, and analytics dashboards.</div>
            <div className="tech-chips">
              {['Next.js', 'TypeScript', 'Tailwind CSS'].map((t) => (
                <span key={t} className="tech-chip">{t}</span>
              ))}
            </div>
            <div className="text-xs mt-1">• Built authentication, recruiter dashboards, and interview scheduling</div>
            <div className="text-xs">• Implemented analytics visualizations for hiring insights</div>
            <div className="mt-2 flex gap-4">
              <a
                href="https://github.com/rudraymehra/InterviewLytics"
                target="_blank"
                rel="noopener noreferrer"
                className="text-terminal-primary hover:text-terminal-accent transition-colors flex items-center gap-2 text-xs"
              >
                <Github size={12} />
                <span>View Code</span>
              </a>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-terminal-muted">
            <div className="text-terminal-accent font-bold mb-2">📦 More on GitHub</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <a href="https://github.com/rudraymehra/HTTP-SERVER" target="_blank" rel="noopener noreferrer" className="text-terminal-primary hover:text-terminal-accent flex items-center gap-2">
                <Github size={12} /> HTTP-SERVER — production-ready HTTP server (Java)
              </a>
              <a href="https://github.com/rudraymehra/StockMarketPredictor" target="_blank" rel="noopener noreferrer" className="text-terminal-primary hover:text-terminal-accent flex items-center gap-2">
                <Github size={12} /> Crypto Tracker — live prices via CoinGecko (JS)
              </a>
              <a href="https://github.com/rudraymehra/citepdf" target="_blank" rel="noopener noreferrer" className="text-terminal-primary hover:text-terminal-accent flex items-center gap-2">
                <Github size={12} /> citepdf — citation-first PDF RAG (Python)
              </a>
              <a href="https://github.com/rudraymehra/ScholarAi" target="_blank" rel="noopener noreferrer" className="text-terminal-primary hover:text-terminal-accent flex items-center gap-2">
                <Github size={12} /> ScholarAi — research assistant (TypeScript)
              </a>
              <a href="https://github.com/rudraymehra/RESS-Attrition-Prediction" target="_blank" rel="noopener noreferrer" className="text-terminal-primary hover:text-terminal-accent flex items-center gap-2">
                <Github size={12} /> RESS — employee attrition prediction (Notebook)
              </a>
            </div>
            <div className="mt-3">
              <a
                href="https://github.com/rudraymehra?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                className="text-terminal-primary hover:text-terminal-accent transition-colors flex items-center gap-2 text-xs"
              >
                <Github size={12} />
                <span>View All Projects → github.com/rudraymehra</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    ),
    skills: () => (
      <div className="text-terminal-text">
        <div className="text-terminal-secondary mb-3 term-section">▶ Technical Skills</div>
        <div className="ml-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <div className="text-terminal-accent mb-2">Languages</div>
              <div className="text-sm space-y-1">
                <div>• Java</div>
                <div>• Python</div>
                <div>• JavaScript (ES6+)</div>
                <div>• TypeScript</div>
                <div>• SQL</div>
              </div>
            </div>
            <div>
              <div className="text-terminal-accent mb-2">Backend</div>
              <div className="text-sm space-y-1">
                <div>• Spring Boot</div>
                <div>• Node.js</div>
                <div>• Express.js</div>
                <div>• Spring Security</div>
                <div>• REST APIs</div>
                <div>• JWT</div>
              </div>
            </div>
            <div>
              <div className="text-terminal-accent mb-2">Frontend</div>
              <div className="text-sm space-y-1">
                <div>• React.js</div>
                <div>• Next.js</div>
                <div>• Tailwind CSS</div>
              </div>
            </div>
            <div>
              <div className="text-terminal-accent mb-2">Databases</div>
              <div className="text-sm space-y-1">
                <div>• PostgreSQL</div>
                <div>• MySQL</div>
                <div>• MongoDB</div>
              </div>
            </div>
            <div>
              <div className="text-terminal-accent mb-2">Tools &amp; Platforms</div>
              <div className="text-sm space-y-1">
                <div>• Git &amp; GitHub Actions</div>
                <div>• Docker</div>
                <div>• AWS</div>
                <div>• Postman</div>
                <div>• Solana · Anchor · Light Protocol</div>
              </div>
            </div>
            <div>
              <div className="text-terminal-accent mb-2">AI / Infra</div>
              <div className="text-sm space-y-1">
                <div>• Kubernetes</div>
                <div>• FastAPI</div>
                <div>• LangGraph</div>
                <div>• Ollama</div>
                <div>• Qdrant</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    experience: () => (
      <div className="text-terminal-text">
        <div className="text-terminal-secondary mb-3 term-section">▶ Work Experience</div>
        <div className="ml-4 space-y-4">
          <div className="border-l-2 border-terminal-primary pl-4">
            <div className="text-terminal-accent font-bold flex items-center gap-2">
              <Building2 size={16} />
              Software Development Engineer (SDE) Intern
            </div>
            <div className="text-terminal-primary text-sm">InterviewBit (Scaler AI Labs) • Nov 2025 - Feb 2026</div>
            <div className="text-terminal-muted text-xs">Bengaluru, India</div>
            <div className="text-sm mt-2 space-y-1">
              <div>• Developed 4 high-fidelity RL environments (Ramp, Stripe, Linear, Intercom) for frontier-model training</div>
              <div>• Built custom tasks, automated graders, and evaluation pipelines for OpenAI &amp; xAI training workflows</div>
              <div>• Resolved QA failures across SAP, Ramp, and Gorgias environments, raising task success rates from 60% to 90%</div>
            </div>
          </div>
          <div className="border-l-2 border-terminal-primary pl-4">
            <div className="text-terminal-accent font-bold flex items-center gap-2">
              <Building2 size={16} />
              Backend Developer
            </div>
            <div className="text-terminal-primary text-sm">SST Internal Tools • Nov 2024 - Aug 2025</div>
            <div className="text-sm mt-2 space-y-1">
              <div>• Built a unified campus platform integrating academic, administrative, and student workflows with Spring Boot &amp; PostgreSQL</div>
              <div>• Implemented JWT authentication, RBAC, and secure REST APIs using Spring Security</div>
              <div>• Delivered automation features: Excel processing, PDF generation, scheduling, and notifications</div>
            </div>
          </div>
        </div>
      </div>
    ),
    education: () => (
      <div className="text-terminal-text">
        <div className="text-terminal-secondary mb-3 term-section">▶ Education</div>
        <div className="ml-4 space-y-3">
          <div className="term-card">
            <div className="text-terminal-accent font-bold">B.S. in Computer Science</div>
            <div className="text-terminal-primary text-sm">Birla Institute of Technology (BITS Pilani) • Graduation 2027</div>
          </div>
          <div className="term-card">
            <div className="text-terminal-accent font-bold">Senior Secondary (IB Board)</div>
            <div className="text-terminal-primary text-sm">School of Specialized Excellence (SoSE), Delhi • 2022 - 2024</div>
          </div>
        </div>
      </div>
    ),
    achievements: () => (
      <div className="text-terminal-text">
        <div className="text-terminal-secondary mb-3 term-section">▶ Leadership &amp; Achievements</div>
        <div className="ml-4 space-y-2">
          <div>🏅 Head, Event Management Committee — led planning, sponsorships, logistics, and execution of college events</div>
          <div>🏆 CodeChef 3★ (Max rating 1611) — Global Rank 166 in CodeChef Contest 199</div>
          <div>🤖 Built 4 RL environments for frontier-model training at Scaler AI Labs</div>
          <div>🛠️ Built a unified campus platform for SST (SST Internal Tools)</div>
        </div>
      </div>
    ),
    contact: () => (
      <div className="text-terminal-text">
        <div className="text-terminal-secondary mb-3 term-section">▶ Contact Information</div>
        <div className="ml-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-terminal-accent">📍 Location:</span>
            <span>Bengaluru, India</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-terminal-accent">📧 Email:</span>
            <a href="mailto:rudraymehra@gmail.com" className="text-terminal-primary hover:text-terminal-accent">rudraymehra@gmail.com</a>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-terminal-accent">🌐 GitHub:</span>
            <a href="https://github.com/rudraymehra" target="_blank" rel="noopener noreferrer" className="text-terminal-primary hover:text-terminal-accent">github.com/rudraymehra</a>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-terminal-accent">💼 LinkedIn:</span>
            <a href="https://linkedin.com/in/rudray-mehra" target="_blank" rel="noopener noreferrer" className="text-terminal-primary hover:text-terminal-accent">linkedin.com/in/rudray-mehra</a>
          </div>
        </div>
      </div>
    ),
    resume: () => (
      <div className="text-terminal-text">
        <div className="text-terminal-secondary mb-3 term-section">▶ Resume</div>
        <div className="ml-4 space-y-2">
          <div>📄 Download my resume:</div>
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-terminal-primary hover:text-terminal-accent transition-colors flex items-center gap-2"
          >
            <FileText size={14} />
            <span>View on Google Drive</span>
          </a>
          <div className="text-sm text-terminal-muted mt-2">
            Click the link above to view or download my resume.
          </div>
        </div>
      </div>
    ),
    theme: () => (
      <div className="text-terminal-accent">
        <div>🎨 Available themes:</div>
        <div className="ml-4 mt-2 space-y-1 text-sm">
          <div>• <span className="text-terminal-primary">matrix</span> - Classic green terminal</div>
          <div>• <span className="text-terminal-primary">cyberpunk</span> - Current neon theme</div>
          <div>• <span className="text-terminal-primary">retro</span> - Vintage amber terminal</div>
          <div className="mt-2 text-terminal-text">Type: theme [name] to switch</div>
        </div>
      </div>
    ),
    clear: () => {
      setCommandHistory([]);
      setHistoryIndex(-1);
      return null;
    },
    crt: () => {
      const enabled = document.documentElement.classList.toggle('crt-effect');
      return (
        <div className="text-terminal-accent">
          📺 CRT / scanline effect {enabled ? 'enabled' : 'disabled'}. Run <span className="text-terminal-primary">crt</span> again to toggle.
        </div>
      );
    },
    history: () => {
      const entries = commandHistory.map((c) => c.input).filter(Boolean);
      if (!entries.length) {
        return <div className="text-terminal-muted">No commands in history yet.</div>;
      }
      return (
        <div className="text-terminal-text">
          {entries.map((cmd, i) => (
            <div key={i} className="text-sm">
              <span className="text-terminal-muted mr-3">{i + 1}</span>
              {cmd}
            </div>
          ))}
        </div>
      );
    },
    ls: () => (
      <div className="text-terminal-text">
        <div>Directory listing:</div>
        <div className="ml-4">
          <div>📁 about</div>
          <div>📁 projects</div>
          <div>📁 contact</div>
          <div>📁 skills</div>
          <div>📁 experience</div>
          <div>📁 education</div>
          <div>📁 achievements</div>
          <div>🔗 resume</div>
        </div>
      </div>
    ),
    exit: () => {
      const shouldExit = window.confirm('Are you sure you want to exit the terminal?');
      if (shouldExit) {
        window.close();
        return <div>Closing terminal...</div>;
      }
      return <div>Exit cancelled.</div>;
    },
    pwd: () => (
      <div className="text-terminal-text">
        /home/rudray/portfolio
      </div>
    ),
    cd: () => (
      <div className="text-terminal-text">
        <div className="text-red-400">Error: Cannot change directory in this terminal session.</div>
        <div className="text-terminal-muted text-sm mt-1">This is a read-only terminal for portfolio navigation.</div>
      </div>
    ),
    mkdir: () => (
      <div className="text-terminal-text">
        <div className="text-red-400">Error: Cannot create directories in this terminal session.</div>
        <div className="text-terminal-muted text-sm mt-1">This is a read-only terminal for portfolio navigation.</div>
      </div>
    ),
    touch: () => (
      <div className="text-terminal-text">
        <div className="text-red-400">Error: Cannot create files in this terminal session.</div>
        <div className="text-terminal-muted text-sm mt-1">This is a read-only terminal for portfolio navigation.</div>
      </div>
    ),
    cat: () => (
      <div className="text-terminal-text">
        <div className="text-red-400">Error: Cannot read files in this terminal session.</div>
        <div className="text-terminal-muted text-sm mt-1">This is a read-only terminal for portfolio navigation.</div>
      </div>
    ),
    echo: (input: string = '') => {
      const message = input.replace('echo', '').trim();
      return (
        <div className="text-terminal-text">
          {message || ''}
        </div>
      );
    },
    whoami: () => (
      <div className="text-terminal-text">
        rudray@portfolio
      </div>
    ),
    date: () => {
      const now = new Date();
      return (
        <div className="text-terminal-text">
          {now.toLocaleString()}
        </div>
      );
    },
    sudo: () => (
      <div className="text-terminal-text">
        <div className="text-red-400">Error: Permission denied.</div>
        <div className="text-terminal-muted text-sm mt-1">This is a read-only terminal for portfolio navigation.</div>
      </div>
    ),
    rm: () => (
      <div className="text-terminal-text">
        <div className="text-red-400">Error: Cannot remove files in this terminal session.</div>
        <div className="text-terminal-muted text-sm mt-1">This is a read-only terminal for portfolio navigation.</div>
      </div>
    ),
    man: () => (
      <div className="text-terminal-text">
        <div className="text-terminal-secondary mb-3 term-section">▶ Manual Pages</div>
        <div className="ml-4 space-y-2">
          <div>Available commands:</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div>• help - Show available commands</div>
            <div>• ls - List directory contents</div>
            <div>• pwd - Print working directory</div>
            <div>• whoami - Print effective user ID</div>
            <div>• date - Display system date/time</div>
            <div>• echo - Display a line of text</div>
            <div>• history - Show command history</div>
            <div>• crt - Toggle CRT/scanline effect</div>
            <div>• clear - Clear terminal screen</div>
            <div>• exit - Exit the terminal</div>
            <div>• theme - Change terminal theme</div>
            <div>• about - About me</div>
            <div>• projects - View projects</div>
            <div>• contact - Contact information</div>
            <div>• skills - Technical skills</div>
            <div>• experience - Work experience</div>
            <div>• education - Educational background</div>
            <div>• achievements - My accomplishments</div>
            <div>• resume - Download resume</div>
            <div>• fortune - Display random programming quotes</div>
            <div>• cowsay - Display message in ASCII art</div>
            <div>• neofetch - Display system information</div>
            <div>• cd - Change directory (simulated)</div>
            <div>• mkdir - Make directory (simulated)</div>
            <div>• touch - Create file (simulated)</div>
            <div>• cat - Read file (simulated)</div>
            <div>• rm - Remove file (simulated)</div>
            <div>• sudo - Execute as superuser (simulated)</div>
          </div>
          <div className="text-terminal-muted text-sm mt-2">
            Note: Some commands are simulated and have limited functionality.
          </div>
        </div>
      </div>
    ),
    fortune: () => {
      const quotes = [
        "A real resume is just a catalog of all your sufferings - Naval Ravikant",
        "The only way to do great work is to love what you do. - Steve Jobs",
        "The best way to predict the future is to implement it. - Alan Kay",
        "Talk is cheap. Show me the code. - Linus Torvalds",
        "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. - Martin Fowler",
        "First, solve the problem. Then, write the code. - John Johnson",
        "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday's code. - Dan Salomon",
        "It's not a bug – it's an undocumented feature. - Anonymous",
        "Code never lies, comments sometimes do. - Ron Jeffries",
        "Programming isn't about what you know; it's about what you can figure out. - Chris Pine",
        "The only way to learn a new programming language is by writing programs in it. - Dennis Ritchie",
        "Sometimes the best way to solve a problem is to stop participating in the problem. - Jonathan Mead",
        "The most damaging phrase in the language is 'We've always done it this way.' - Grace Hopper",
        "Good code is like a good joke: it needs no explanation. - Russ Olsen",
        "Programming is the art of telling another human what one wants the computer to do. - Donald Knuth",
        "The best error message is the one that never shows up. - Thomas Fuchs",
        "Code is like humor. When you have to explain it, it's bad. - Cory House"
      ];
      return <div className="text-terminal-text">{quotes[Math.floor(Math.random() * quotes.length)]}</div>;
    },
    welcome: () => welcomeOutput(),
    cowsay: (input: string = '') => {
      const message = input.replace('cowsay', '').trim() || 'Moo!';
      return (
        <div className="text-terminal-text font-mono">
          <pre>{`
 ${'_'.repeat(message.length + 2)}
< ${message} >
 ${'-'.repeat(message.length + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
      `}</pre>
        </div>
      );
    },
    neofetch: () => (
      <div className="text-terminal-text font-mono">
        <pre>{`
    rudray@portfolio
    ---------------
    OS: Portfolio Terminal
    Host: React.js + Vite
    Kernel: TypeScript
    Shell: Custom Terminal
    Theme: Cyberpunk
    Icons: Lucide Icons
    Terminal: Web Browser
    CPU: JavaScript Engine
    Memory: Browser Memory
    Languages: Java, TypeScript, Python
    Framework: Spring Boot, Next.js, React
    `}</pre>
      </div>
    )
  };

  // List of typed commands used for autocomplete + "did you mean?"
  const commandList = Object.keys(commands);

  // ↑/↓ cycle a curated menu first, then any extra commands the visitor actually typed.
  const typedCommands = commandHistory
    .map((c) => c.input.trim().toLowerCase())
    .filter((i) => i && i !== 'welcome');
  const navItems = [...new Set([...QUICK_COMMANDS, ...typedCommands])];

  // Ghost autocomplete suggestion for the current input
  const trimmedLower = currentInput.toLowerCase();
  const suggestion =
    currentInput && !currentInput.includes(' ')
      ? commandList.find((c) => c.startsWith(trimmedLower) && c !== trimmedLower)
      : undefined;
  const ghost = suggestion ? suggestion.slice(currentInput.length) : '';

  const handleCommand = (input: string) => {
    const trimmedInput = input.trim().toLowerCase();

    // Handle sudo commands
    if (trimmedInput.startsWith('sudo ')) {
      const command = trimmedInput.replace('sudo', '').trim();
      setCommandHistory(prev => [...prev, {
        input,
        output: <div className="text-terminal-text">
          <div className="text-red-400">Permission denied: {command}</div>
          <div className="text-terminal-muted text-sm mt-1">This is a read-only terminal for portfolio navigation.</div>
        </div>
      }]);
      setHistoryIndex(-1);
      return;
    }

    // Handle echo command separately since it needs the full input
    if (trimmedInput.startsWith('echo ')) {
      const output = commands.echo(input);
      setCommandHistory(prev => [...prev, { input, output }]);
      setHistoryIndex(-1);
      return;
    }

    // Handle cowsay command separately since it needs the full input
    if (trimmedInput.startsWith('cowsay ')) {
      const output = commands.cowsay(input);
      setCommandHistory(prev => [...prev, { input, output }]);
      setHistoryIndex(-1);
      return;
    }

    // Handle theme command
    if (trimmedInput.startsWith('theme ')) {
      const themeName = trimmedInput.split(' ')[1];
      const validThemes = ['matrix', 'cyberpunk', 'retro'];

      if (validThemes.includes(themeName)) {
        // Remove existing theme classes
        document.documentElement.classList.remove('theme-matrix', 'theme-cyberpunk', 'theme-retro');
        // Add new theme class
        document.documentElement.classList.add(`theme-${themeName}`);

        setCommandHistory(prev => [...prev, {
          input,
          output: <div className="text-terminal-accent">Theme switched to {themeName} successfully!</div>
        }]);
        setHistoryIndex(-1);
        return;
      } else {
        setCommandHistory(prev => [...prev, {
          input,
          output: <div className="text-red-400">Invalid theme. Available themes: matrix, cyberpunk, retro</div>
        }]);
        setHistoryIndex(-1);
        return;
      }
    }

    const command = commands[trimmedInput as keyof typeof commands];

    if (trimmedInput === 'clear') {
      setCommandHistory([]);
      setHistoryIndex(-1);
      return;
    }

    let output: React.ReactNode;
    if (command) {
      output = command();
    } else {
      // "Did you mean?" — closest command by edit distance
      const closest = commandList
        .map((c) => ({ c, d: levenshtein(trimmedInput, c) }))
        .sort((a, b) => a.d - b.d)[0];
      output = (
        <div className="text-red-400">
          Command '{input}' not found. Type 'help' for available commands.
          {closest && closest.d <= 2 && (
            <div className="text-terminal-muted mt-1">
              Did you mean '<span className="text-terminal-primary">{closest.c}</span>'?
            </div>
          )}
        </div>
      );
    }

    setCommandHistory(prev => [...prev, { input, output }]);
    setHistoryIndex(-1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (currentInput.trim()) {
        handleCommand(currentInput);
      }
      setCurrentInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!navItems.length) return;
      // Step backwards; from empty input, jump to the last item.
      const newIndex = historyIndex === -1 ? navItems.length - 1 : historyIndex - 1;
      if (newIndex < 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      } else {
        setHistoryIndex(newIndex);
        setCurrentInput(navItems[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!navItems.length) return;
      // Step forwards; from empty input, jump to the first item.
      const newIndex = historyIndex === -1 ? 0 : historyIndex + 1;
      if (newIndex >= navItems.length) {
        setHistoryIndex(-1);
        setCurrentInput('');
      } else {
        setHistoryIndex(newIndex);
        setCurrentInput(navItems[newIndex]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const val = trimmedLower.trim();
      if (!val) return;
      const matches = commandList.filter((c) => c.startsWith(val));
      if (matches.length === 1) {
        setCurrentInput(matches[0]);
      } else if (matches.length > 1) {
        const prefix = longestCommonPrefix(matches);
        if (prefix.length > val.length) {
          setCurrentInput(prefix);
        } else {
          // Print candidates like a real shell
          setCommandHistory(prev => [...prev, {
            input: currentInput,
            output: (
              <div className="text-terminal-text flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {matches.map((m) => (
                  <span key={m} className="text-terminal-primary">{m}</span>
                ))}
              </div>
            ),
          }]);
          setHistoryIndex(-1);
        }
      }
    } else if (e.key === 'ArrowRight' && ghost) {
      // Accept ghost suggestion only when caret is at the end
      if (e.currentTarget.selectionStart === currentInput.length) {
        e.preventDefault();
        setCurrentInput(suggestion as string);
      }
    }
  };

  const asciiName = `
██████  ██    ██ ██████  ██████   █████  ██    ██
██   ██ ██    ██ ██   ██ ██   ██ ██   ██  ██  ██
██████  ██    ██ ██   ██ ██████  ███████   ████
██   ██ ██    ██ ██   ██ ██   ██ ██   ██    ██
██   ██  ██████  ██████  ██   ██ ██   ██    ██
  `;

  // Boot sequence typing animation on first load
  useEffect(() => {
    let i = 0;
    const type = () => {
      i += 1;
      setBootText(BOOT_SEQUENCE.slice(0, i));
      if (i < BOOT_SEQUENCE.length) {
        bootTimer.current = setTimeout(type, 18);
      } else {
        bootTimer.current = setTimeout(() => {
          setBooting(false);
          setCommandHistory([{ input: 'welcome', output: welcomeOutput() }]);
          inputRef.current?.focus();
        }, 350);
      }
    };
    bootTimer.current = setTimeout(type, 250);
    return () => clearTimeout(bootTimer.current);
  }, []);

  const skipBoot = () => {
    if (!booting) return;
    clearTimeout(bootTimer.current);
    setBooting(false);
    setBootText(BOOT_SEQUENCE);
    setCommandHistory([{ input: 'welcome', output: welcomeOutput() }]);
    inputRef.current?.focus();
  };

  useEffect(() => {
    // Scroll the terminal pane (not the page) to the latest line
    const el = commandHistoryRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [commandHistory]);

  return (
    <div className="min-h-screen bg-terminal-bg terminal-background relative overflow-hidden" onClick={() => inputRef.current?.focus()}>
      {/* Ambient background typing effect */}
      <BackgroundCode />

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-4 lg:p-6 border-b border-terminal-muted/20 gap-4 lg:gap-0">
        {/* Name Section */}
        <div className="flex flex-col items-start gap-2">
          <div className="ascii-art text-terminal-primary font-bold neon-glow">
            <pre className="text-[9px] sm:text-xs lg:text-sm leading-tight">{asciiName}</pre>
          </div>
          <div className="text-terminal-muted text-xs sm:text-sm pl-0.5">Full Stack &amp; Backend Engineer • BITS Pilani</div>
          <div className="flex items-center gap-2 text-xs sm:text-sm pl-0.5">
            <span className="status-dot" />
            <span className="text-terminal-primary">open to opportunities</span>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex flex-col gap-2 text-xs sm:text-sm w-full lg:w-auto lg:items-end">
          <div className="space-y-1">
            <a href="https://github.com/rudraymehra" target="_blank" rel="noopener noreferrer" className="text-terminal-text hover:text-terminal-primary transition-colors flex items-center gap-2">
              <Github size={14} />
              <span className="truncate">GitHub → github.com/rudraymehra</span>
            </a>
            <a href="https://linkedin.com/in/rudray-mehra" target="_blank" rel="noopener noreferrer" className="text-terminal-text hover:text-terminal-primary transition-colors flex items-center gap-2">
              <Linkedin size={14} />
              <span className="truncate">LinkedIn → linkedin.com/in/rudray-mehra</span>
            </a>
            <a href="mailto:rudraymehra@gmail.com" className="text-terminal-text hover:text-terminal-primary transition-colors flex items-center gap-2">
              <Mail size={14} />
              <span className="truncate">Email → rudraymehra@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 lg:p-6 pb-8">
        {/* Terminal Window */}
        <div className="terminal-window rounded-xl overflow-hidden">
          <div className="term-titlebar flex items-center gap-2 px-4 lg:px-5 py-3">
            <div className="flex items-center gap-2">
              <div className="term-dot bg-[#ff5f57]"></div>
              <div className="term-dot bg-[#febc2e]"></div>
              <div className="term-dot bg-[#28c840]"></div>
            </div>
            <div className="flex-1 text-center text-terminal-muted text-xs tracking-wide">
              rudray@portfolio — ~/portfolio — zsh
            </div>
            <div className="w-[52px]"></div>
          </div>

          <div className="px-4 lg:px-6 pt-4 lg:pt-5 pb-3 lg:pb-4 flex flex-col h-[60vh] md:h-[65vh]">

          {booting ? (
            /* Boot sequence */
            <div
              className="text-terminal-primary text-sm font-mono cursor-pointer flex-1"
              onClick={skipBoot}
            >
              <pre className="whitespace-pre-wrap leading-relaxed">{bootText}<span className="block-cursor align-middle" /></pre>
              <div className="text-terminal-muted text-xs mt-4">(click anywhere to skip)</div>
            </div>
          ) : (
            <>
              {/* Command History + live prompt (scrolls internally) */}
              <div
                ref={commandHistoryRef}
                className="term-scroll flex-1 min-h-0 overflow-y-auto space-y-4 pr-1"
              >
                {commandHistory.map((cmd, index) => (
                  <div key={index} className="animate-fade-in-up">
                    <div className="command-line text-terminal-primary text-sm">{cmd.input}</div>
                    {cmd.output && <div className="mt-2 ml-6">{cmd.output}</div>}
                  </div>
                ))}

              {/* Current Input (flows directly under the latest output) */}
              <div className="flex items-center pt-1">
                <span className="text-terminal-primary mr-2 text-sm font-semibold">rudray@portfolio
                  <span className="text-terminal-muted">:</span>
                  <span className="text-terminal-accent">~</span>
                  <span className="text-terminal-muted"> $</span>
                </span>
                <div className="relative flex-1 flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onKeyDown={handleKeyDown}
                    style={{ caretColor: 'var(--terminal-primary)' }}
                    className="bg-transparent border-none outline-none text-terminal-text w-full font-mono text-sm px-0 placeholder:text-terminal-muted/70"
                    placeholder={'type a command — or press ↑ ↓ to browse'}
                    autoFocus
                    autoComplete="off"
                    spellCheck={false}
                  />
                  {ghost && (
                    <div className="pointer-events-none absolute inset-0 flex items-center font-mono text-sm">
                      <span className="invisible whitespace-pre">{currentInput}</span>
                      <span className="text-terminal-muted whitespace-pre">{ghost}</span>
                    </div>
                  )}
                </div>
              </div>
              </div>

              {/* Hint / status bar (always visible, doesn't scroll) */}
              <div className="term-hintbar shrink-0 mt-3 text-terminal-muted text-xs flex flex-wrap items-center gap-x-5 gap-y-2">
                <span className="flex items-center gap-1.5"><span className="kbd">↑</span><span className="kbd">↓</span> browse commands</span>
                <span className="flex items-center gap-1.5"><span className="kbd">Tab</span> autocomplete</span>
                <span className="flex items-center gap-1.5"><span className="kbd">help</span> all commands</span>
                <span className="flex items-center gap-1.5"><span className="kbd">crt</span> retro mode</span>
              </div>
            </>
          )}
          </div>
        </div>
      </div>

      {/* Internship Badge - Fixed to bottom right */}
      <div className="fixed bottom-4 right-4 z-20 hidden sm:block">
        <div className="terminal-window term-card rounded-lg p-3 text-xs text-terminal-text max-w-[16rem]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="status-dot" />
            <span className="text-terminal-muted uppercase tracking-[0.18em] text-[10px]">most recent role</span>
          </div>
          <div className="text-terminal-accent font-semibold">SDE Intern · Scaler AI Labs</div>
          <div className="text-terminal-text/80 truncate">InterviewBit · frontier-model RL</div>
          <div className="text-terminal-muted truncate mt-0.5">Nov 2025 — Feb 2026</div>
          <a
            href="https://www.interviewbit.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-terminal-secondary hover:text-terminal-primary transition-colors text-xs mt-1.5 inline-flex items-center gap-1"
          >
            Learn more →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Terminal;

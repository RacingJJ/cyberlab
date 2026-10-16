import { useMemo, useState, useCallback, useEffect } from 'react'
import { BookOpen, BrainCircuit, Activity, Shield, Terminal, Network, Gauge, Target, Trophy, Flame, Layers3 } from 'lucide-react'
import { lessons, labs, quizzes, type Lesson, type Lab, type QuizQuestion } from './data/lessons'
import { loadProgress, saveProgress, type Progress } from './lib/progress'

const defaultProgress = loadProgress()

function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'lessons' | 'labs' | 'terminal' | 'networking' | 'quizzes'>('dashboard')
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(lessons[0])
  const [progress, setProgress] = useState<Progress>(defaultProgress)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const completedCount = progress.completedLessons.length + progress.completedLabs.length
  const totalTracked = 25
  const overallPercent = Math.min(100, Math.round((completedCount / totalTracked) * 100))

  const completeLesson = useCallback((id: string) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(id)) return prev
      const next = { ...prev, completedLessons: [...prev.completedLessons, id], xp: prev.xp + 25 }
      if (!next.badges.includes('Lesson Explorer')) next.badges.push('Lesson Explorer')
      return next
    })
  }, [])

  const completeLab = useCallback((id: string) => {
    setProgress(prev => {
      if (prev.completedLabs.includes(id)) return prev
      const next = { ...prev, completedLabs: [...prev.completedLabs, id], xp: prev.xp + 45 }
      if (!next.badges.includes('Lab Specialist')) next.badges.push('Lab Specialist')
      return next
    })
  }, [])

  const markQuiz = useCallback((score: number) => {
    setProgress(prev => ({
      ...prev,
      quizHistory: [...prev.quizHistory, { id: `quiz-${Date.now()}`, score, date: new Date().toISOString() }]
    }))
  }, [])

  const totalXp = progress.xp
  const level = Math.max(1, Math.floor(totalXp / 100) + 1)

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">CL</div>
          <div className="brand-text">
            <strong>CyberLab</strong>
            <span>Learning Sandbox</span>
          </div>
        </div>

        <nav className="nav">
          {[
            ['dashboard', 'Dashboard', Activity],
            ['lessons', 'Lessons', BookOpen],
            ['labs', 'Labs', Shield],
            ['terminal', 'Terminal', Terminal],
            ['networking', 'Networking', Network],
            ['quizzes', 'Quizzes', BrainCircuit]
          ].map(([key, label, Icon]) => (
            <button
              key={key}
              className={activeView === key ? 'active' : ''}
              onClick={() => setActiveView(key as any)}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>

        <div className="card">
          <div className="metric">
            <div>
              <small>XP</small>
              <strong>{progress.xp}</strong>
            </div>
            <Trophy size={20} color="#2ce7c6" />
          </div>
          <div style={{ marginTop: 12, color: '#a7bac7' }}>Level {level}</div>
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div>
            <p style={{ margin: 0, color: '#9fb1bf', fontSize: '.8rem' }}>Secure training environment</p>
            <h1 className="title">CyberLab</h1>
          </div>
          <div className="pill">Simulated datasets only</div>
        </div>

        {activeView === 'dashboard' && (
          <Dashboard view={{ overallPercent, progress, completeLesson, completeLab, markQuiz, level }} />
        )}

        {activeView === 'lessons' && (
          <Lessons view={{ selectedLesson, setSelectedLesson, completeLesson }} />
        )}

        {activeView === 'labs' && (
          <Labs view={{ completeLab }} />
        )}

        {activeView === 'terminal' && (
          <TerminalSection />
        )}

        {activeView === 'networking' && (
          <NetworkingToolkit />
        )}

        {activeView === 'quizzes' && (
          <Quizzes view={{ markQuiz }} />
        )}
      </main>
    </div>
  )
}

function Dashboard({ view }: any) {
  const { overallPercent, progress, level } = view

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <section className="stats-grid">
        <StatCard label="Overall progress" value={`${overallPercent}%`} detail={`${progress.completedLessons.length + progress.completedLabs.length} completed activities`} icon={<Gauge size={18} />} />
        <StatCard label="Daily streak" value={`${progress.streak ?? 0} days`} detail="Keep learning daily" icon={<Flame size={18} />} />
        <StatCard label="Completed lessons" value={String(progress.completedLessons.length)} detail="Structured learning" icon={<BookOpen size={18} />} />
        <StatCard label="Quiz score" value={`${progress.quizHistory.length ? Math.round(progress.quizHistory.reduce((a: number, q: any) => a + q.score, 0) / progress.quizHistory.length) : 0}%`} detail="Average result" icon={<Target size={18} />} />
      </section>

      <section className="grid-two">
        <div className="card">
          <h3>Welcome back</h3>
          <p style={{ color: '#a9bbca', marginTop: 0 }}>Continue your cyber defense journey with safe, educational simulations.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ProgressRing value={overallPercent} />
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>{overallPercent}%</div>
              <div style={{ color: '#9fb1bf' }}>Level {level} analyst</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Quick access</h3>
          <div className="grid-two" style={{ marginTop: '.8rem' }}>
            <button className="primary-btn">Continue lesson</button>
            <button className="secondary-btn">Open lab</button>
            <button className="secondary-btn">Launch terminal</button>
            <button className="secondary-btn">Review quiz</button>
          </div>
        </div>
      </section>

      <section className="grid-two">
        <div className="card">
          <h3>Recommended next lesson</h3>
          <div className="lesson-item active">
            <strong>Authentication and Authorization</strong>
            <div style={{ color: '#9fb1bf', marginTop: '.35rem' }}>Learn how identities are verified and how access is granted across systems.</div>
          </div>
        </div>

        <div className="card">
          <h3>Achievement badges</h3>
          <div className="badge-row" style={{ marginTop: '.5rem' }}>
            {progress.badges.length ? progress.badges.map((badge: string) => <span key={badge} className="badge">{badge}</span>) : <span className="badge">First Step</span>}
          </div>
        </div>
      </section>

      <section className="grid-two">
        <div className="card">
          <h3>Learning roadmap</h3>
          <ul className="clean" style={{ marginTop: '.7rem' }}>
            <li>Fundamentals — 4 lessons</li>
            <li>Networking — 5 lessons</li>
            <li>Linux — 4 lessons</li>
            <li>Web Security — 5 lessons</li>
            <li>Defensive Security — 5 lessons</li>
          </ul>
        </div>

        <div className="card">
          <h3>Recently opened labs</h3>
          <ul className="clean" style={{ marginTop: '.7rem' }}>
            <li>Password Strength</li>
            <li>Network Detective</li>
            <li>Linux Command Challenge</li>
          </ul>
        </div>
      </section>
    </div>
  )
}

function Lessons({ view }: any) {
  const { selectedLesson, setSelectedLesson, completeLesson } = view

  return (
    <div className="grid-two">
      <div className="card">
        <h3>Learning paths</h3>
        <div className="lesson-list" style={{ marginTop: '1rem' }}>
          {lessons.map((lesson: Lesson) => (
            <button
              key={lesson.id}
              className={`lesson-item ${selectedLesson.id === lesson.id ? 'active' : ''}`}
              style={{ textAlign: 'left', cursor: 'pointer', color: '#e5edf5' }}
              onClick={() => setSelectedLesson(lesson)}
            >
              <div><strong>{lesson.title}</strong></div>
              <div style={{ color: '#9fb1bf', fontSize: '.8rem' }}>{lesson.path}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>{selectedLesson.title}</h3>
        <div style={{ color: '#a9bbca', marginBottom: '1rem' }}>{selectedLesson.path}</div>
        <div className="lesson-content">{selectedLesson.content}</div>
        <div style={{ marginTop: '1rem' }}>
          <button className="primary-btn" onClick={() => completeLesson(selectedLesson.id)}>Mark complete</button>
        </div>
      </div>
    </div>
  )
}

function Labs({ view }: any) {
  const { completeLab } = view

  const [password, setPassword] = useState('')
  const [result, setResult] = useState<string>('')
  const [networkGuess, setNetworkGuess] = useState('')
  const [networkFeedback, setNetworkFeedback] = useState('')
  const [terminalTask, setTerminalTask] = useState('')
  const [terminalFeedback, setTerminalFeedback] = useState('')

  const assessPassword = () => {
    const strong = password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)
    const weak = ['password', '123456', 'qwerty', 'admin'].includes(password.toLowerCase())
    if (!password) return setResult('Enter a sample password to evaluate.')
    if (weak) return setResult('Weak — this password is common and easy to guess.')
    if (strong) return setResult('Strong — long, mixed-character, and less predictable.')
    setResult('Moderate — add more length and mixed character types.')
  }

  const evaluateNetwork = () => {
    if (networkGuess.trim() === '10.9.3.55') {
      setNetworkFeedback('Correct — repeated failed SSH attempts from 10.9.3.55 indicate suspicious activity.')
      return
    }
    setNetworkFeedback('Not quite — look for repeated failed login attempts on a private network toward the end of the log.')
  }

  const evaluateTerminalTask = () => {
    if (terminalTask.trim().toLowerCase() === 'ls /home && cat /home/readme.txt') {
      setTerminalFeedback('Correct — the safe command sequence correctly lists the directory and reads the example file.')
      return
    }
    setTerminalFeedback('Hint: use ls to view the directory, then cat to read the file. Do not use host system commands.')
  }

  return (
    <div className="grid-two">
      <div className="card">
        <h3>Interactive labs</h3>
        <div className="lab-list" style={{ marginTop: '1rem' }}>
          {labs.map((lab: Lab) => (
            <div className="lab-item" key={lab.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '.5rem' }}>
                <strong>{lab.title}</strong>
                <span style={{ color: '#9fb1bf' }}>{lab.difficulty}</span>
              </div>
              <ul className="clean" style={{ marginTop: '.6rem' }}>
                {lab.objectives.map((obj: string) => <li key={obj}>• {obj}</li>)}
              </ul>
              <div style={{ marginTop: '0.8rem' }}>
                <button className="primary-btn" onClick={() => completeLab(lab.id)}>Complete lab</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Try the first labs</h3>

        <div style={{ marginBottom: '1rem' }}>
          <h4>Password Strength</h4>
          <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Try: P@ssw0rd!2024" />
          <div style={{ display: 'flex', gap: '.6rem', marginTop: '.75rem' }}>
            <button className="primary-btn" onClick={assessPassword}>Evaluate</button>
          </div>
          {result && <div style={{ marginTop: '.8rem', color: '#dfeaf5' }}>{result}</div>}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <h4>Network Detective</h4>
          <input className="input" value={networkGuess} onChange={(e) => setNetworkGuess(e.target.value)} placeholder="Enter suspicious IP" />
          <div style={{ display: 'flex', gap: '.6rem', marginTop: '.75rem' }}>
            <button className="primary-btn" onClick={evaluateNetwork}>Check answer</button>
          </div>
          {networkFeedback && <div style={{ marginTop: '.8rem', color: '#dfeaf5' }}>{networkFeedback}</div>}
        </div>

        <div>
          <h4>Linux Command Challenge</h4>
          <input className="input" value={terminalTask} onChange={(e) => setTerminalTask(e.target.value)} placeholder="Example: ls /home && cat /home/readme.txt" />
          <div style={{ display: 'flex', gap: '.6rem', marginTop: '.75rem' }}>
            <button className="primary-btn" onClick={evaluateTerminalTask}>Submit</button>
          </div>
          {terminalFeedback && <div style={{ marginTop: '.8rem', color: '#dfeaf5' }}>{terminalFeedback}</div>}
        </div>
      </div>
    </div>
  )
}

function TerminalSection() {
  const [history, setHistory] = useState<string[]>(['Welcome to CyberLab terminal. Type help to view the safe command set.'])
  const [cmd, setCmd] = useState('')
  const [cwd, setCwd] = useState('/home')

  const safeCommands = ['ls', 'cd', 'pwd', 'cat', 'mkdir', 'grep', 'clear', 'help', 'reset']
  const safeFiles = {
    '/home': ['readme.txt', 'notes.txt'],
    '/var': ['auth.log'],
    '/etc': ['hosts']
  }

  const runCommand = () => {
    const input = cmd.trim()
    if (!input) return

    const [command, ...args] = input.split(' ')
    const lower = command.toLowerCase()

    if (!safeCommands.includes(lower)) {
      setHistory((prev) => [...prev, `$ ${input}`, `Command not allowed in this educational sandbox.`])
      setCmd('')
      return
    }

    if (lower === 'help') {
      setHistory((prev) => [...prev, `$ ${input}`, 'Allowed commands: ls, cd, pwd, cat, mkdir, grep, clear, help, reset'])
      setCmd('')
      return
    }
    if (lower === 'pwd') {
      setHistory((prev) => [...prev, `$ ${input}`, cwd])
      setCmd('')
      return
    }
    if (lower === 'ls') {
      const target = args[0] || cwd
      setHistory((prev) => [...prev, `$ ${input}`, (safeFiles[target as keyof typeof safeFiles] || ['readme.txt', 'notes.txt']).join('  ')])
      setCmd('')
      return
    }
    if (lower === 'cat') {
      const file = args[0] || 'readme.txt'
      setHistory((prev) => [...prev, `$ ${input}`, file === 'readme.txt' ? 'Sample file: This is a simulated Linux example for CyberLab.' : 'Sample content'])
      setCmd('')
      return
    }
    if (lower === 'mkdir') {
      setHistory((prev) => [...prev, `$ ${input}`, 'Directory created in the simulated filesystem.'])
      setCmd('')
      return
    }
    if (lower === 'clear') {
      setHistory(['CyberLab terminal reset.'])
      setCmd('')
      return
    }
    if (lower === 'reset') {
      setHistory(['Filesystem reset.'])
      setCwd('/home')
      setCmd('')
      return
    }
    if (lower === 'cd') {
      const target = args[0] || '/home'
      setCwd(target)
      setHistory((prev) => [...prev, `$ ${input}`, `cwd -> ${target}`])
      setCmd('')
      return
    }

    setHistory((prev) => [...prev, `$ ${input}`, 'Operation completed in the sandbox.'])
    setCmd('')
  }

  return (
    <div className="card">
      <h3>Linux Terminal Simulator</h3>
      <div className="terminal-panel" style={{ marginTop: '1rem' }}>
        <div className="terminal-header">
          <span>cyberlab@training:~</span>
          <span>{cwd}</span>
        </div>
        <div className="terminal-output">
          {history.map((line, i) => (
            <div className="terminal-line" key={i}>{line}</div>
          ))}
        </div>
        <div className="terminal-prompt">
          <span style={{ color: '#2ce7c6' }}>{cwd}$</span>
          <input
            className="terminal-input"
            value={cmd}
            onChange={(e) => setCmd(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') runCommand() }}
            placeholder="Type help or ls"
          />
          <button className="primary-btn" onClick={runCommand}>Run</button>
        </div>
      </div>
    </div>
  )
}

function NetworkingToolkit() {
  const [ip, setIp] = useState('192.168.1.12')
  const [validated, setValidated] = useState<string>('')
  const [cidr, setCidr] = useState('10.0.0.0/24')

  const inspectIp = () => {
    const parts = ip.split('.')
    const valid = parts.length === 4 && parts.every((part) => /^\d+$/.test(part) && Number(part) >= 0 && Number(part) <= 255)
    setValidated(valid ? 'Valid IPv4 sample — private range detected, simulated only.' : 'Invalid IPv4 format. Example: 192.168.1.12')
  }

  return (
    <div className="tool-grid">
      <div className="card">
        <h3>IPv4 Inspector</h3>
        <label className="small-label">IPv4 address</label>
        <input className="input" value={ip} onChange={(e) => setIp(e.target.value)} />
        <div style={{ marginTop: '.8rem' }}>
          <button className="primary-btn" onClick={inspectIp}>Inspect</button>
        </div>
        {validated && <div style={{ marginTop: '.9rem', color: '#dfeaf5' }}>{validated}</div>}
      </div>

      <div className="card">
        <h3>CIDR Helper</h3>
        <label className="small-label">Example CIDR</label>
        <input className="input" value={cidr} onChange={(e) => setCidr(e.target.value)} />
        <div style={{ marginTop: '.9rem', color: '#dfeaf5' }}>10.0.0.0/24 represents a 256-address subnet in educational sample data.</div>
      </div>

      <div className="card">
        <h3>Common ports</h3>
        <ul className="clean" style={{ marginTop: '.7rem' }}>
          <li>22 — SSH</li>
          <li>53 — DNS</li>
          <li>80 — HTTP</li>
          <li>443 — HTTPS</li>
          <li>3306 — MySQL</li>
          <li>8080 — Alternate web service</li>
        </ul>
      </div>

      <div className="card">
        <h3>DNS sample records</h3>
        <ul className="clean" style={{ marginTop: '.7rem' }}>
          <li>cyberlab.local → 10.0.0.15</li>
          <li>api.cyberlab.local → 10.0.0.21</li>
          <li>mail.cyberlab.local → 10.0.0.30</li>
        </ul>
      </div>
    </div>
  )
}

function Quizzes({ view }: any) {
  const { markQuiz } = view
  const [selected, setSelected] = useState<number | null>(null)
  const [qIndex, setQIndex] = useState(0)
  const [answerState, setAnswerState] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [score, setScore] = useState(0)

  const current = quizzes[qIndex]

  const submit = () => {
    if (selected === null) return
    const isCorrect = current.options[selected].value === current.answer
    setAnswerState(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setScore((s) => s + 1)
  }

  const next = () => {
    if (qIndex < quizzes.length - 1) {
      setQIndex((i) => i + 1)
      setSelected(null)
      setAnswerState('idle')
    } else {
      const percent = Math.round((score / quizzes.length) * 100)
      markQuiz(percent)
      alert(`Quiz complete — score ${percent}%`)
      setQIndex(0)
      setScore(0)
      setSelected(null)
      setAnswerState('idle')
    }
  }

  return (
    <div className="card">
      <h3>Quiz engine</h3>
      <div style={{ color: '#9fb1bf', marginBottom: '1rem' }}>Question {qIndex + 1} of {quizzes.length}</div>
      <h4>{current.prompt}</h4>
      <div className="answer-options">
        {current.options.map((option: any, idx: number) => (
          <div
            key={option.label}
            className={`answer-option ${selected === idx ? 'selected' : ''}`}
            onClick={() => setSelected(idx)}
          >
            <span>{option.label}</span>
          </div>
        ))}
      </div>

      {answerState !== 'idle' && (
        <div style={{ marginTop: '1rem', color: answerState === 'correct' ? '#62d196' : '#ff7a7a' }}>
          {answerState === 'correct' ? 'Correct — ' + current.explanation : 'Incorrect — ' + current.explanation}
        </div>
      )}

      <div style={{ display: 'flex', gap: '.8rem', marginTop: '1rem' }}>
        <button className="primary-btn" onClick={submit}>Check answer</button>
        <button className="secondary-btn" onClick={next}>Next</button>
      </div>
    </div>
  )
}

function StatCard({ label, value, detail, icon }: { label: string; value: string; detail: string; icon: React.ReactNode }) {
  return (
    <div className="card">
      <div className="metric">
        <div>
          <small>{label}</small>
          <strong>{value}</strong>
        </div>
        <div>{icon}</div>
      </div>
      <div style={{ color: '#9fb1bf', marginTop: '.5rem' }}>{detail}</div>
    </div>
  )
}

function ProgressRing({ value }: { value: number }) {
  const radius = 46
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="progress-ring">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="10" fill="none" />
        <circle cx="60" cy="60" r={radius} stroke="#2ce7c6" strokeWidth="10" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="center">{value}%</div>
    </div>
  )
}

export default App

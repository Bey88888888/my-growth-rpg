import { useEffect, useMemo, useState } from 'react'

const APP_KEY = 'growth-rpg-v4'
const SESSION_KEY = 'growth-rpg-v4-session'
const MAX_LEVEL = 60

const THEME_OPTIONS = [
  { id: 'aurora', name: '白蓝 · Aurora', note: '清爽、理性、适合日常复盘' },
  { id: 'onyx', name: '黑金 · Onyx', note: '克制、高级、适合专注推进' },
  { id: 'rose', name: '粉灰 · Rose', note: '柔和、低压、适合长期陪伴' },
  { id: 'sage', name: '鼠尾草 · Sage', note: '安静、自然、适合身心平衡' }
]

const ROLE_OPTIONS = [
  { id: 'explorer', name: '探索者', copy: '把未知拆成可以尝试的小步。' },
  { id: 'cultivator', name: '修炼者', copy: '用稳定动作获得长期复利。' },
  { id: 'creator', name: '创造者', copy: '把想法做成可以被看见的作品。' }
]

const DIMENSIONS = [
  { id: 'study', icon: '🔬', name: '科研学习', target: '建立长期输入体系，形成可发表、可展示的成果。' },
  { id: 'media', icon: '✍️', name: '自媒体', target: '持续输出个人表达，形成审美、选题和传播能力。' },
  { id: 'fitness', icon: '🏃', name: '运动健身', target: '维持身体能量，建立不依赖情绪的行动节律。' },
  { id: 'beauty', icon: '💄', name: '形象管理', target: '找到适合自己的日常风格，让状态更稳定。' },
  { id: 'camera', icon: '🔍', name: '影像观察', target: '练习观察、构图与审美判断，提升视觉表达。' },
  { id: 'speech', icon: '🗣️', name: '表达能力', target: '提升公开表达、沟通边界和结构化讲述能力。' },
  { id: 'editing', icon: '✂️', name: '剪辑技能', target: '完成有个人风格的内容片段，形成可复用流程。' },
  { id: 'coding', icon: '💻', name: '编程能力', target: '把自己的想法做成网页、工具和自动化系统。' }
]

const DEFAULT_TASKS = [
  { title: '阅读或学习 20 分钟', dimension: 'study', exp: 60, energy: 8, difficulty: '轻量', type: '输入' },
  { title: '整理一个笔记或观点', dimension: 'study', exp: 70, energy: 7, difficulty: '中等', type: '内化' },
  { title: '运动或拉伸 15 分钟', dimension: 'fitness', exp: 55, energy: 10, difficulty: '轻量', type: '生活' },
  { title: '完成一件拖延的小事', dimension: 'speech', exp: 65, energy: 9, difficulty: '中等', type: '行动' },
  { title: '写一段公开表达草稿', dimension: 'media', exp: 75, energy: 8, difficulty: '中等', type: '输出' },
  { title: '复盘今日一个情绪波动', dimension: 'speech', exp: 50, energy: 6, difficulty: '轻量', type: '复盘' },
  { title: '优化一处生活秩序', dimension: 'beauty', exp: 45, energy: 7, difficulty: '轻量', type: '生活' },
  { title: '练习一个技术小问题', dimension: 'coding', exp: 80, energy: 8, difficulty: '进阶', type: '技能' }
]

const MONSTERS = [
  { key: 'delay', name: '拖延雾', icon: '🌫️', maxHp: 260, copy: '它不凶，只会让重要的事无限延后。' },
  { key: 'noise', name: '内耗回声', icon: '〰️', maxHp: 320, copy: '它用过度解释消耗你的判断力。' },
  { key: 'anxiety', name: '焦虑风暴', icon: '🌪️', maxHp: 360, copy: '它让你在开始之前，就提前经历失败。' },
  { key: 'night', name: '熬夜黑洞', icon: '🌑', maxHp: 300, copy: '它吞掉恢复力，也偷走第二天的清醒。' }
]

const QUOTES = [
  '真正的变化，通常先表现为你不再急着证明自己。',
  '今天的完成度不需要完美，只需要足以让明天更容易开始。',
  '你不是落后，你是在重新建立自己的秩序。',
  '保持节奏，比一时爆发更接近长期答案。',
  '把注意力收回来，就是一种高级的自救。',
  '一个人变稳，不是没有情绪，而是不再被情绪接管。',
  '不用向所有人解释你的节奏，结果会慢慢替你说明。'
]

const DEFAULT_NOTES = [
  { title: '为什么我容易拖延？', tag: '问题复盘', body: '拖延不是懒，很多时候是任务定义不清、反馈太远、启动成本过高。下一步：把任务切到 15 分钟内可以开始。', dimension: 'speech' },
  { title: '一个可复用的学习闭环', tag: '方法库', body: '输入 → 记录 → 复述 → 输出 → 应用 → 复盘。不要只收藏信息，要让信息经过自己的判断。', dimension: 'study' },
  { title: '内容选题观察', tag: '灵感库', body: '好的选题通常来自真实困惑、反复出现的需求，以及你已经走过一点点的路。', dimension: 'media' }
]

const DEFAULT_PROBLEMS = [
  { title: '如何打破信息茧房？', tag: '学习 · 信息筛选', status: '待解决', days: 18, body: '定期引入反方材料，记录自己改变观点的证据，而不是只收藏让自己舒服的信息。' },
  { title: '如何保持注意力集中？', tag: '生活 · 时间管理', status: '待解决', days: 12, body: '减少入口，固定时间块，把手机从默认可见的位置移走。' },
  { title: '如何避免沟通中被误解？', tag: '关系 · 表达边界', status: '已解决', days: 7, body: '先给结论，再给原因；重要事项尽量留文字记录。' },
  { title: '如何稳定输出内容？', tag: '创作 · 节律', status: '待解决', days: 21, body: '不要等灵感。建立素材池、标题池和固定发布窗口。' }
]

function todayKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function monthKey(date = new Date()) {
  return todayKey(date).slice(0, 7)
}

function uid(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

function simpleHash(value) {
  let hash = 0
  const str = String(value)
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return `h_${Math.abs(hash).toString(36)}`
}

function xpNeeded(level) {
  if (level >= MAX_LEVEL) return 0
  return Math.round(180 + level * 42 + Math.pow(level, 1.55) * 10)
}

function levelFromExp(totalExp) {
  let level = 1
  let exp = totalExp
  while (level < MAX_LEVEL && exp >= xpNeeded(level)) {
    exp -= xpNeeded(level)
    level += 1
  }
  return { level, current: level >= MAX_LEVEL ? 0 : exp, need: xpNeeded(level) }
}

function loadStore() {
  try {
    return JSON.parse(localStorage.getItem(APP_KEY)) || { users: {} }
  } catch {
    return { users: {} }
  }
}

function saveStore(store) {
  localStorage.setItem(APP_KEY, JSON.stringify(store))
}

function createUserData({ email, nickname, role, theme }) {
  const now = new Date().toISOString()
  const baseTasks = DEFAULT_TASKS.map((task) => ({ ...task, id: uid('task'), custom: false, createdAt: now }))
  const monsterState = MONSTERS.reduce((acc, monster) => {
    acc[monster.key] = { hp: monster.maxHp, defeated: false, defeatedAt: null }
    return acc
  }, {})
  return {
    id: simpleHash(email),
    email: normalizeEmail(email),
    nickname: nickname.trim() || 'Be better',
    role,
    theme,
    createdAt: now,
    updatedAt: now,
    totalExp: 0,
    energy: 72,
    mood: '稳定推进',
    tasks: baseTasks,
    logs: [],
    notes: DEFAULT_NOTES.map((note) => ({ ...note, id: uid('note'), createdAt: now })),
    problems: DEFAULT_PROBLEMS.map((problem) => ({ ...problem, id: uid('problem'), createdAt: now })),
    monsters: monsterState,
    badges: [],
    yearlyGoals: [
      { id: uid('goal'), title: '建立持续学习与输出节律', done: false },
      { id: uid('goal'), title: '完成一个可以公开展示的个人项目', done: false },
      { id: uid('goal'), title: '让身体状态稳定回到可控范围', done: false },
      { id: uid('goal'), title: '形成自己的审美素材库与表达系统', done: false }
    ]
  }
}

function getDimension(id) {
  return DIMENSIONS.find((item) => item.id === id) || DIMENSIONS[0]
}

function getThemeName(id) {
  return THEME_OPTIONS.find((item) => item.id === id)?.name || THEME_OPTIONS[0].name
}

function quoteOfDay() {
  const date = new Date()
  const index = (date.getFullYear() + date.getMonth() * 7 + date.getDate()) % QUOTES.length
  return QUOTES[index]
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState('signup')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [role, setRole] = useState('explorer')
  const [theme, setTheme] = useState('aurora')
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    setError('')
    const mail = normalizeEmail(email)
    if (!mail || !mail.includes('@')) {
      setError('请输入一个有效邮箱，用于区分你的本地存档。')
      return
    }
    if (password.length < 6) {
      setError('密码至少 6 位。当前版本只在本地保存密码摘要。')
      return
    }
    const store = loadStore()
    const key = simpleHash(mail)
    if (mode === 'signup') {
      if (store.users[key]) {
        setError('这个邮箱已经创建过存档，请切换到登录。')
        return
      }
      store.users[key] = {
        passwordHash: simpleHash(`${mail}:${password}`),
        data: createUserData({ email: mail, nickname, role, theme })
      }
      saveStore(store)
      localStorage.setItem(SESSION_KEY, key)
      onLogin(store.users[key].data)
      return
    }
    if (!store.users[key] || store.users[key].passwordHash !== simpleHash(`${mail}:${password}`)) {
      setError('邮箱或密码不正确。')
      return
    }
    localStorage.setItem(SESSION_KEY, key)
    onLogin(store.users[key].data)
  }

  return (
    <main className="login-shell theme-aurora">
      <div className="login-orb orb-one" />
      <div className="login-orb orb-two" />
      <section className="login-card glass-panel">
        <div className="login-copy">
          <p className="eyebrow">GROWTH OS · PERSONAL ARCHIVE</p>
          <h1>Be better.</h1>
          <p className="login-lead">一个克制、安静、可持续的个人成长面板。记录行动，沉淀复盘，让进步有迹可循。</p>
          <div className="privacy-card">
            <strong>隐私说明</strong>
            <p>你的成长档案默认只保存在当前设备。注册邮箱账号后，系统会为你建立独立存档。我们不会要求真实姓名，也不会公开你的任务、情绪和成长记录。</p>
          </div>
          <div className="metric-strip">
            <span><b>60</b> 满级</span>
            <span><b>8</b> 维能力</span>
            <span><b>∞</b> 本地存档</span>
          </div>
        </div>

        <form className="auth-panel" onSubmit={submit}>
          <div className="switcher compact">
            <button type="button" className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>注册存档</button>
            <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>登录存档</button>
          </div>

          <label>
            <span>邮箱</span>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <label>
            <span>密码</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="至少 6 位" />
          </label>
          {mode === 'signup' && (
            <>
              <label>
                <span>昵称</span>
                <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="例如：北" />
              </label>
              <div className="choice-grid">
                {ROLE_OPTIONS.map((item) => (
                  <button key={item.id} type="button" className={role === item.id ? 'choice active' : 'choice'} onClick={() => setRole(item.id)}>
                    <b>{item.name}</b>
                    <small>{item.copy}</small>
                  </button>
                ))}
              </div>
              <div className="choice-grid theme-choice-grid">
                {THEME_OPTIONS.slice(0, 3).map((item) => (
                  <button key={item.id} type="button" className={theme === item.id ? `choice swatch ${item.id} active` : `choice swatch ${item.id}`} onClick={() => setTheme(item.id)}>
                    <b>{item.name}</b>
                    <small>{item.note}</small>
                  </button>
                ))}
              </div>
            </>
          )}
          {error && <p className="error-line">{error}</p>}
          <button className="primary-action" type="submit">{mode === 'signup' ? '创建我的成长档案' : '进入我的成长档案'}</button>
        </form>
      </section>
    </main>
  )
}

function Sidebar({ tab, setTab, data, level }) {
  const nav = [
    ['overview', '⌘', '总览'],
    ['today', '◷', '今日行动'],
    ['tasks', '□', '任务营地'],
    ['notes', '✎', '第二大脑'],
    ['archive', '◎', '回顾存档'],
    ['achievements', '◈', '成就徽章'],
    ['settings', '⚙', '设置']
  ]
  return (
    <aside className="sidebar glass-panel">
      <div className="level-ring" style={{ '--value': `${Math.min(100, (level.level / MAX_LEVEL) * 100)}%` }}>
        <div>LV.{level.level}</div>
      </div>
      <div className="side-identity">
        <b>{data.nickname}</b>
        <span>{getThemeName(data.theme)}</span>
      </div>
      <nav>
        {nav.map(([id, icon, label]) => (
          <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>
            <span>{icon}</span>{label}
          </button>
        ))}
      </nav>
    </aside>
  )
}

function Hero({ data, level }) {
  return (
    <section className="hero glass-panel">
      <div>
        <p className="eyebrow">BE BETTER · LEVEL {level.level}/{MAX_LEVEL}</p>
        <h1>{data.nickname}的成长系统</h1>
        <p className="hero-sub">自由不是放任，而是逐渐拥有选择自己的能力。</p>
        <div className="hero-meta">
          <span>{new Date().toLocaleString('zh-CN', { hour12: false })}</span>
          <span>{getDimension(data.role === 'creator' ? 'media' : data.role === 'cultivator' ? 'fitness' : 'study').name}倾向</span>
        </div>
      </div>
      <div className="quote-bubble">
        <span>今日提醒</span>
        <p>{quoteOfDay()}</p>
      </div>
    </section>
  )
}

function StatCards({ data, level, todayLogs }) {
  const completed = data.logs.length
  const todayExp = todayLogs.reduce((sum, log) => sum + log.exp, 0)
  const defeated = Object.values(data.monsters).filter((item) => item.defeated).length
  const cards = [
    { label: '总经验', value: data.totalExp, sub: `距下级 ${level.need ? Math.max(0, level.need - level.current) : 0}` },
    { label: '今日行动', value: todayLogs.length, sub: `今日 +${todayExp} EXP` },
    { label: '能量值', value: data.energy, sub: data.mood },
    { label: '徽章', value: data.badges.length, sub: `击败 ${defeated} 个阻力` }
  ]
  return (
    <div className="stat-grid">
      {cards.map((card) => (
        <div className="stat-card glass-panel" key={card.label}>
          <span>{card.label}</span>
          <strong>{card.value}</strong>
          <small>{card.sub}</small>
        </div>
      ))}
    </div>
  )
}

function ProgressPanel({ data, level }) {
  const pct = level.need ? Math.round((level.current / level.need) * 100) : 100
  return (
    <section className="card glass-panel progress-card">
      <div className="card-head">
        <div>
          <p className="eyebrow">ROLE PANEL</p>
          <h2>角色总览</h2>
        </div>
        <span className="pill">Lv.{level.level} / {MAX_LEVEL}</span>
      </div>
      <div className="big-level">
        <span>LV.{level.level}</span>
        <div>
          <strong>{data.totalExp} 总经验</strong>
          <p>{level.level >= MAX_LEVEL ? '已抵达满级' : `还需 ${Math.max(0, level.need - level.current)} 经验升级`}</p>
        </div>
      </div>
      <div className="progress-track"><i style={{ width: `${pct}%` }} /></div>
      <div className="mini-grid">
        <span><b>{data.tasks.length}</b>任务</span>
        <span><b>{data.logs.length}</b>完成</span>
        <span><b>{data.notes.length}</b>笔记</span>
        <span><b>{data.problems.length}</b>问题</span>
      </div>
    </section>
  )
}

function RadarChart({ scores }) {
  const size = 270
  const center = size / 2
  const max = 10
  const radius = 102
  const angleStep = (Math.PI * 2) / DIMENSIONS.length
  const points = DIMENSIONS.map((dimension, index) => {
    const value = Math.min(max, scores[dimension.id] || 1)
    const angle = -Math.PI / 2 + index * angleStep
    const r = (value / max) * radius
    return [center + Math.cos(angle) * r, center + Math.sin(angle) * r]
  })
  const polygon = points.map((p) => p.join(',')).join(' ')
  return (
    <section className="card glass-panel radar-card">
      <div className="card-head">
        <div>
          <p className="eyebrow">8 DIMENSIONS</p>
          <h2>能力雷达</h2>
        </div>
      </div>
      <svg viewBox={`0 0 ${size} ${size}`} className="radar">
        {[2, 4, 6, 8, 10].map((n) => {
          const r = (n / max) * radius
          const ring = DIMENSIONS.map((_, index) => {
            const angle = -Math.PI / 2 + index * angleStep
            return [center + Math.cos(angle) * r, center + Math.sin(angle) * r]
          }).map((p) => p.join(',')).join(' ')
          return <polygon key={n} points={ring} className="radar-ring" />
        })}
        {DIMENSIONS.map((dimension, index) => {
          const angle = -Math.PI / 2 + index * angleStep
          const x = center + Math.cos(angle) * radius
          const y = center + Math.sin(angle) * radius
          const lx = center + Math.cos(angle) * (radius + 28)
          const ly = center + Math.sin(angle) * (radius + 28)
          return (
            <g key={dimension.id}>
              <line x1={center} y1={center} x2={x} y2={y} className="radar-axis" />
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle">{dimension.name}</text>
            </g>
          )
        })}
        <polygon points={polygon} className="radar-fill" />
        {points.map(([x, y], index) => <circle key={index} cx={x} cy={y} r="3.6" className="radar-dot" />)}
      </svg>
    </section>
  )
}

function computeScores(logs) {
  const scores = {}
  DIMENSIONS.forEach((dimension) => { scores[dimension.id] = 1 })
  logs.forEach((log) => {
    scores[log.dimension] = Math.min(10, (scores[log.dimension] || 1) + Math.max(0.2, log.exp / 180))
  })
  return scores
}

function DimensionRows({ data, scores }) {
  return (
    <section className="card glass-panel full-span">
      <div className="card-head">
        <div>
          <p className="eyebrow">GROWTH MAP</p>
          <h2>八维成长进度</h2>
        </div>
      </div>
      <div className="dimension-list">
        {DIMENSIONS.map((dimension) => {
          const logs = data.logs.filter((log) => log.dimension === dimension.id)
          const exp = logs.reduce((sum, log) => sum + log.exp, 0)
          const lv = Math.min(10, Math.max(1, Math.floor(exp / 220) + 1))
          const pct = Math.min(100, Math.round((exp % 220) / 220 * 100))
          return (
            <div className="dimension-row" key={dimension.id}>
              <div className="dimension-name"><span>{dimension.icon}</span><b>{dimension.name}</b></div>
              <span className="pill blue">LV.{lv}</span>
              <div className="thin-track"><i style={{ width: `${pct || scores[dimension.id] * 8}%` }} /></div>
              <small>{exp % 220}/220</small>
              <p>{dimension.target}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function TaskCard({ task, done, onComplete, compact = false }) {
  const dim = getDimension(task.dimension)
  return (
    <article className={done ? 'task-card done' : 'task-card'}>
      <div className="task-title"><span>{dim.icon}</span><b>{task.title}</b></div>
      <p>{dim.name} · {task.type} · {task.difficulty}</p>
      <div className="task-footer">
        <span className="pill">+{task.exp} EXP</span>
        <span className="pill muted">能量 +{task.energy}</span>
        {!done && !compact && <button onClick={() => onComplete(task.id)}>完成</button>}
        {done && <em>已完成</em>}
      </div>
    </article>
  )
}

function TodayPanel({ data, onComplete }) {
  const today = todayKey()
  const todayLogs = data.logs.filter((log) => log.date === today)
  const completedIds = new Set(todayLogs.map((log) => log.taskId))
  return (
    <section className="card glass-panel full-span">
      <div className="card-head">
        <div>
          <p className="eyebrow">TODAY</p>
          <h2>今日行动卡</h2>
        </div>
        <span className="pill">{todayLogs.length} 已完成</span>
      </div>
      <div className="task-grid">
        {data.tasks.slice(0, 10).map((task) => (
          <TaskCard key={task.id} task={task} done={completedIds.has(task.id)} onComplete={onComplete} />
        ))}
      </div>
    </section>
  )
}

function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [dimension, setDimension] = useState('study')
  const [exp, setExp] = useState(60)
  const [type, setType] = useState('行动')

  const submit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({ title: title.trim(), dimension, exp: Number(exp), energy: 6, difficulty: Number(exp) >= 80 ? '进阶' : Number(exp) >= 60 ? '中等' : '轻量', type })
    setTitle('')
  }

  return (
    <form className="add-form glass-panel" onSubmit={submit}>
      <div>
        <p className="eyebrow">CUSTOM TASK</p>
        <h2>添加自己的任务</h2>
      </div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例如：整理博士申请材料 30 分钟" />
      <select value={dimension} onChange={(e) => setDimension(e.target.value)}>
        {DIMENSIONS.map((dimensionItem) => <option key={dimensionItem.id} value={dimensionItem.id}>{dimensionItem.name}</option>)}
      </select>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        {['输入', '内化', '输出', '行动', '生活', '技能', '复盘'].map((item) => <option key={item}>{item}</option>)}
      </select>
      <input type="number" min="20" max="160" step="5" value={exp} onChange={(e) => setExp(e.target.value)} />
      <button className="primary-action" type="submit">添加任务</button>
    </form>
  )
}

function MonsterPanel({ data }) {
  return (
    <section className="card glass-panel full-span">
      <div className="card-head">
        <div>
          <p className="eyebrow">BOSS MAP</p>
          <h2>阻力地图</h2>
        </div>
      </div>
      <div className="monster-grid">
        {MONSTERS.map((monster) => {
          const state = data.monsters[monster.key]
          const pct = Math.max(0, Math.round((state.hp / monster.maxHp) * 100))
          return (
            <article className={state.defeated ? 'monster defeated' : 'monster'} key={monster.key}>
              <div className="monster-top"><span>{monster.icon}</span><b>{monster.name}</b><em>{state.defeated ? '已击败' : `${state.hp}/${monster.maxHp}`}</em></div>
              <p>{monster.copy}</p>
              <div className="thin-track danger"><i style={{ width: `${pct}%` }} /></div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function ReviewCards({ data }) {
  const grouped = data.logs.reduce((acc, log) => {
    acc[log.date] = acc[log.date] || []
    acc[log.date].push(log)
    return acc
  }, {})
  const days = Object.keys(grouped).sort().reverse().slice(0, 8)
  return (
    <section className="card glass-panel full-span">
      <div className="card-head">
        <div>
          <p className="eyebrow">DAILY REVIEW</p>
          <h2>每一次行动都有迹可循</h2>
        </div>
      </div>
      <div className="review-scroll">
        {days.length === 0 && <p className="empty">今天完成第一张行动卡后，这里会自动生成复盘卡片。</p>}
        {days.map((day) => {
          const logs = grouped[day]
          const exp = logs.reduce((sum, log) => sum + log.exp, 0)
          const dimensions = [...new Set(logs.map((log) => getDimension(log.dimension).name))]
          return (
            <article className="review-card" key={day}>
              <span>@{day}</span>
              <b>完成 {logs.length} 个行动</b>
              <p>覆盖 {dimensions.join('、')}；获得 {exp} 经验。</p>
              <small>{QUOTES[(exp + logs.length) % QUOTES.length]}</small>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function CalendarPanel({ data }) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const first = new Date(year, month, 1)
  const startDay = first.getDay() || 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 1; i < startDay; i += 1) cells.push(null)
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d)
  const logMap = data.logs.reduce((acc, log) => {
    if (log.date.slice(0, 7) === monthKey(now)) {
      acc[Number(log.date.slice(-2))] = (acc[Number(log.date.slice(-2))] || 0) + log.exp
    }
    return acc
  }, {})
  return (
    <section className="card glass-panel calendar-card">
      <div className="card-head">
        <div>
          <p className="eyebrow">MONTH</p>
          <h2>{year}年{month + 1}月</h2>
        </div>
      </div>
      <div className="calendar-grid labels">{'一二三四五六日'.split('').map((d) => <span key={d}>{d}</span>)}</div>
      <div className="calendar-grid">
        {cells.map((day, index) => (
          <div className={day && logMap[day] ? 'day active' : 'day'} key={`${day}-${index}`}>
            {day && <><b>{day}</b>{logMap[day] && <small>+{logMap[day]}</small>}</>}
          </div>
        ))}
      </div>
    </section>
  )
}

function LogTable({ data }) {
  return (
    <section className="card glass-panel log-card">
      <div className="card-head"><h2>最近打卡记录</h2></div>
      <div className="log-table">
        <div className="log-head"><span>日期</span><span>维度</span><span>行动</span><span>经验</span></div>
        {data.logs.slice().reverse().slice(0, 10).map((log) => (
          <div className="log-row" key={log.id}>
            <span>{log.date}</span>
            <span>{getDimension(log.dimension).name}</span>
            <span>{log.title}</span>
            <b>+{log.exp}</b>
          </div>
        ))}
        {data.logs.length === 0 && <p className="empty">暂无记录。完成任务后这里会自动更新。</p>}
      </div>
    </section>
  )
}

function NotesPanel({ data, onAddNote }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [dimension, setDimension] = useState('study')
  const submit = (e) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return
    onAddNote({ title, body, dimension, tag: '个人笔记' })
    setTitle('')
    setBody('')
  }
  return (
    <div className="page-stack">
      <section className="feature-banner glass-panel">
        <p className="eyebrow">SECOND BRAIN</p>
        <h2>用记录，唤醒你的第二大脑</h2>
        <p>笔记不是收藏夹。它应该帮助你把输入沉淀成判断，把判断转化为行动，再通过复盘形成自己的方法库。</p>
      </section>
      <section className="notes-layout">
        <form className="note-form glass-panel" onSubmit={submit}>
          <h3>写一张新笔记</h3>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="标题" />
          <select value={dimension} onChange={(e) => setDimension(e.target.value)}>
            {DIMENSIONS.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="记录一个观点、问题、方法或灵感。" />
          <button className="primary-action">保存笔记</button>
        </form>
        <div className="kanban glass-panel">
          {data.notes.map((note) => (
            <article className="note-card" key={note.id}>
              <span>{note.tag}</span>
              <h3>{note.title}</h3>
              <p>{note.body}</p>
              <small>{getDimension(note.dimension).name} · {formatDate(note.createdAt)}</small>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

function ProblemsPanel({ data, onAddProblem }) {
  const [title, setTitle] = useState('')
  const [tag, setTag] = useState('生活 · 自我管理')
  const [body, setBody] = useState('')
  const submit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onAddProblem({ title, tag, body: body || '先记录问题，再寻找证据和行动路径。' })
    setTitle('')
    setBody('')
  }
  return (
    <section className="card glass-panel full-span">
      <div className="card-head">
        <div>
          <p className="eyebrow">PROBLEM LIBRARY</p>
          <h2>用问题，描绘你的第二大脑</h2>
        </div>
      </div>
      <form className="inline-form" onSubmit={submit}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="记录一个正在困扰你的问题" />
        <input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="分类，例如：学习 · 信息筛选" />
        <input value={body} onChange={(e) => setBody(e.target.value)} placeholder="一句初步判断，可选" />
        <button>记录问题</button>
      </form>
      <div className="problem-grid">
        {data.problems.map((problem) => (
          <article className="problem-card" key={problem.id}>
            <h3>{problem.title}</h3>
            <span>{problem.tag}</span>
            <p>{problem.body}</p>
            <small>{problem.status} · 已记录 {problem.days || 1} 天</small>
          </article>
        ))}
      </div>
    </section>
  )
}

function GoalsPanel({ data, onToggleGoal }) {
  return (
    <section className="card glass-panel goal-card">
      <div className="card-head"><h2>年度目标</h2></div>
      <div className="goal-list">
        {data.yearlyGoals.map((goal) => (
          <label key={goal.id}>
            <input type="checkbox" checked={goal.done} onChange={() => onToggleGoal(goal.id)} />
            <span>{goal.title}</span>
          </label>
        ))}
      </div>
    </section>
  )
}

function Achievements({ data, level }) {
  const definitions = [
    { key: 'starter', title: '微光启动者', desc: '累计完成 3 个任务' },
    { key: 'level3', title: '稳定进化中', desc: '达到 3 级' },
    { key: 'monster1', title: '反内耗勇士', desc: '击败第一个阻力' },
    { key: 'notes5', title: '记录成形', desc: '写下 5 张笔记' },
    { key: 'level10', title: '长期主义者', desc: '达到 10 级' }
  ]
  const badgeSet = new Set(data.badges.map((b) => b.key))
  return (
    <section className="card glass-panel full-span">
      <div className="card-head">
        <div><p className="eyebrow">BADGES</p><h2>成就徽章</h2></div>
        <span className="pill">{data.badges.length}/{definitions.length}</span>
      </div>
      <div className="badge-grid">
        {definitions.map((badge) => (
          <article key={badge.key} className={badgeSet.has(badge.key) ? 'badge unlocked' : 'badge'}>
            <span>◈</span>
            <h3>{badge.title}</h3>
            <p>{badge.desc}</p>
            <small>{badgeSet.has(badge.key) ? '已获得' : '未解锁'}</small>
          </article>
        ))}
      </div>
    </section>
  )
}

function SettingsPanel({ data, onUpdate, onLogout }) {
  const [importText, setImportText] = useState('')
  const exportArchive = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `growth-archive-${data.nickname}-${todayKey()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
  const importArchive = () => {
    try {
      const next = JSON.parse(importText)
      if (!next.email || !next.tasks || !next.logs) throw new Error('invalid')
      onUpdate({ ...next, email: data.email, id: data.id, updatedAt: new Date().toISOString() })
      setImportText('')
    } catch {
      alert('存档格式不正确。')
    }
  }
  return (
    <div className="settings-grid">
      <section className="card glass-panel">
        <div className="card-head"><h2>外观主题</h2></div>
        <div className="theme-list">
          {THEME_OPTIONS.map((theme) => (
            <button key={theme.id} className={data.theme === theme.id ? `theme-tile ${theme.id} active` : `theme-tile ${theme.id}`} onClick={() => onUpdate({ ...data, theme: theme.id })}>
              <b>{theme.name}</b><span>{theme.note}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="card glass-panel">
        <div className="card-head"><h2>存档与隐私</h2></div>
        <p className="privacy-text">你的成长档案默认只保存在当前设备。注册邮箱账号后，系统会为你建立独立存档。我们不会要求真实姓名，也不会公开你的任务、情绪和成长记录。</p>
        <div className="action-row">
          <button onClick={exportArchive}>导出 JSON 存档</button>
          <button onClick={onLogout}>退出当前账号</button>
        </div>
        <textarea value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="粘贴 JSON 存档，可在当前账号下恢复。" />
        <button className="primary-action" onClick={importArchive}>导入存档</button>
      </section>
    </div>
  )
}

function App() {
  const [data, setData] = useState(null)
  const [tab, setTab] = useState('overview')
  const [toast, setToast] = useState('')

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY)
    if (!session) return
    const store = loadStore()
    if (store.users[session]?.data) setData(store.users[session].data)
  }, [])

  useEffect(() => {
    if (!data) return
    const store = loadStore()
    const key = simpleHash(data.email)
    if (!store.users[key]) return
    store.users[key].data = { ...data, updatedAt: new Date().toISOString() }
    saveStore(store)
  }, [data])

  const level = useMemo(() => data ? levelFromExp(data.totalExp) : { level: 1, current: 0, need: xpNeeded(1) }, [data])
  const scores = useMemo(() => data ? computeScores(data.logs) : {}, [data])
  const todayLogs = useMemo(() => data ? data.logs.filter((log) => log.date === todayKey()) : [], [data])

  const updateBadges = (next) => {
    const badges = [...next.badges]
    const add = (key, title) => {
      if (!badges.some((badge) => badge.key === key)) badges.push({ key, title, at: new Date().toISOString() })
    }
    const nextLevel = levelFromExp(next.totalExp).level
    const defeatedCount = Object.values(next.monsters).filter((item) => item.defeated).length
    if (next.logs.length >= 3) add('starter', '微光启动者')
    if (nextLevel >= 3) add('level3', '稳定进化中')
    if (defeatedCount >= 1) add('monster1', '反内耗勇士')
    if (next.notes.length >= 5) add('notes5', '记录成形')
    if (nextLevel >= 10) add('level10', '长期主义者')
    return { ...next, badges }
  }

  const completeTask = (taskId) => {
    setData((prev) => {
      const task = prev.tasks.find((item) => item.id === taskId)
      if (!task) return prev
      const today = todayKey()
      if (prev.logs.some((log) => log.taskId === taskId && log.date === today)) return prev
      const damage = Math.round(task.exp * 0.8)
      const monsterKey = MONSTERS.find((monster) => !prev.monsters[monster.key].defeated)?.key || MONSTERS[0].key
      const monster = MONSTERS.find((item) => item.key === monsterKey)
      const currentMonster = prev.monsters[monsterKey]
      const hp = Math.max(0, currentMonster.hp - damage)
      const monsters = {
        ...prev.monsters,
        [monsterKey]: {
          ...currentMonster,
          hp,
          defeated: hp === 0 || currentMonster.defeated,
          defeatedAt: hp === 0 && !currentMonster.defeated ? new Date().toISOString() : currentMonster.defeatedAt
        }
      }
      const log = {
        id: uid('log'),
        taskId,
        title: task.title,
        dimension: task.dimension,
        exp: task.exp,
        energy: task.energy,
        date: today,
        at: new Date().toISOString()
      }
      const next = {
        ...prev,
        totalExp: Math.min(999999, prev.totalExp + task.exp),
        energy: Math.min(100, prev.energy + task.energy),
        logs: [...prev.logs, log],
        monsters,
        mood: todayLogs.length >= 2 ? '稳定推进' : '已启动'
      }
      const feedback = hp === 0 && !currentMonster.defeated ? `你击败了${monster.name}。真正的力量，是把事做完。` : '完成不是终点，是秩序正在恢复的证据。'
      setToast(feedback)
      setTimeout(() => setToast(''), 2800)
      return updateBadges(next)
    })
  }

  const addTask = (task) => {
    setData((prev) => ({ ...prev, tasks: [{ ...task, id: uid('task'), custom: true, createdAt: new Date().toISOString() }, ...prev.tasks] }))
    setToast('任务已加入。接下来，只需要让它发生一次。')
    setTimeout(() => setToast(''), 2400)
  }

  const addNote = (note) => {
    setData((prev) => updateBadges({ ...prev, notes: [{ ...note, id: uid('note'), createdAt: new Date().toISOString() }, ...prev.notes], totalExp: prev.totalExp + 25 }))
  }

  const addProblem = (problem) => {
    setData((prev) => ({ ...prev, problems: [{ ...problem, id: uid('problem'), status: '待解决', days: 1, createdAt: new Date().toISOString() }, ...prev.problems] }))
  }

  const toggleGoal = (goalId) => {
    setData((prev) => ({ ...prev, yearlyGoals: prev.yearlyGoals.map((goal) => goal.id === goalId ? { ...goal, done: !goal.done } : goal) }))
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setData(null)
    setTab('overview')
  }

  if (!data) return <LoginScreen onLogin={setData} />

  return (
    <main className={`app theme-${data.theme}`}>
      <Sidebar tab={tab} setTab={setTab} data={data} level={level} />
      <section className="workspace">
        <Hero data={data} level={level} />
        {tab === 'overview' && (
          <>
            <StatCards data={data} level={level} todayLogs={todayLogs} />
            <div className="dashboard-grid">
              <ProgressPanel data={data} level={level} />
              <RadarChart scores={scores} />
              <TodayPanel data={data} onComplete={completeTask} />
              <DimensionRows data={data} scores={scores} />
              <LogTable data={data} />
              <CalendarPanel data={data} />
              <GoalsPanel data={data} onToggleGoal={toggleGoal} />
              <ReviewCards data={data} />
            </div>
          </>
        )}
        {tab === 'today' && (
          <div className="dashboard-grid single-page">
            <TodayPanel data={data} onComplete={completeTask} />
            <ReviewCards data={data} />
            <MonsterPanel data={data} />
          </div>
        )}
        {tab === 'tasks' && (
          <div className="page-stack">
            <AddTaskForm onAdd={addTask} />
            <TodayPanel data={data} onComplete={completeTask} />
            <MonsterPanel data={data} />
          </div>
        )}
        {tab === 'notes' && <NotesPanel data={data} onAddNote={addNote} />}
        {tab === 'archive' && (
          <div className="dashboard-grid single-page">
            <ReviewCards data={data} />
            <LogTable data={data} />
            <CalendarPanel data={data} />
            <ProblemsPanel data={data} onAddProblem={addProblem} />
          </div>
        )}
        {tab === 'achievements' && (
          <div className="dashboard-grid single-page">
            <Achievements data={data} level={level} />
            <MonsterPanel data={data} />
            <ProblemsPanel data={data} onAddProblem={addProblem} />
          </div>
        )}
        {tab === 'settings' && <SettingsPanel data={data} onUpdate={setData} onLogout={logout} />}
      </section>
      {toast && <div className="toast">{toast}</div>}
    </main>
  )
}

export default App

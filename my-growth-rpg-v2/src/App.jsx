import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'my_growth_rpg_accounts_v2'
const ACTIVE_KEY = 'my_growth_rpg_active_account_v2'
const MAX_LEVEL = 60

const roles = [
  { id: 'explorer', name: '探索者', title: '新手探索者', desc: '适合喜欢发现新方向、持续拓展边界的人。' },
  { id: 'monk', name: '修炼者', title: '安静修炼者', desc: '适合重视自律、节奏、长期积累的人。' },
  { id: 'creator', name: '创造者', title: '灵感创造者', desc: '适合用作品、表达和行动塑造生活的人。' }
]

const themes = [
  { id: 'blue', name: '白蓝配色', desc: '清爽、理性、适合学习和长期规划。' },
  { id: 'gold', name: '黑金配色', desc: '克制、专注、适合夜间复盘。' },
  { id: 'pink', name: '粉灰配色', desc: '柔和、轻盈、适合情绪修复。' }
]

const dimensions = [
  { id: 'study', name: '科研学习', icon: '🔬', goal: '沉淀高质量知识成果，形成稳定学习系统。' },
  { id: 'media', name: '自媒体', icon: '✍️', goal: '持续输出有辨识度的内容，建立长期表达资产。' },
  { id: 'fitness', name: '运动健身', icon: '🏃', goal: '形成稳定运动习惯，让身体成为生活底盘。' },
  { id: 'beauty', name: '形象管理', icon: '💄', goal: '找到适合自己的日常风格，保持清爽和松弛。' },
  { id: 'craft', name: '技能操作', icon: '🔍', goal: '掌握可复用的具体技能，让能力变成竞争力。' },
  { id: 'expression', name: '表达能力', icon: '🗣️', goal: '表达清晰、有边界、有力量。' },
  { id: 'editing', name: '剪辑技能', icon: '✂️', goal: '形成个人风格的视频表达和内容节奏。' },
  { id: 'code', name: '编程能力', icon: '💻', goal: '实现自己的想法，复现项目，并持续靠近技术表达。' }
]

const defaultTasks = [
  { id: 'water', title: '喝水并站起来活动 3 分钟', dimension: 'fitness', exp: 30, damage: 14, difficulty: '轻量', feedback: '你没有浪费今天，你刚刚把身体重新接回了自己。' },
  { id: 'read', title: '阅读 10 分钟', dimension: 'study', exp: 45, damage: 18, difficulty: '轻量', feedback: '真正的进步，常常是十分钟十分钟累积出来的。' },
  { id: 'move', title: '运动 15 分钟', dimension: 'fitness', exp: 55, damage: 22, difficulty: '中等', feedback: '身体先动起来，情绪会慢慢跟上。' },
  { id: 'room', title: '整理一个小区域', dimension: 'craft', exp: 40, damage: 16, difficulty: '轻量', feedback: '外部秩序恢复一点，内部噪音就会少一点。' },
  { id: 'delay', title: '完成一件拖延的小事', dimension: 'expression', exp: 70, damage: 30, difficulty: '关键', feedback: '你不是突然变强了，是你决定不再被它拖住。' },
  { id: 'write', title: '写 100 字复盘或灵感', dimension: 'media', exp: 50, damage: 20, difficulty: '中等', feedback: '表达不是为了完美，是为了让混乱开始有形状。' }
]

const defaultMonsters = [
  { id: 'delay_monster', name: '拖延怪', icon: '🕳️', maxHp: 120, hp: 120, badge: '破局行动者', desc: '它靠“等一下”变强，你靠“先做一点”削弱它。' },
  { id: 'anxiety_monster', name: '焦虑怪', icon: '🌫️', maxHp: 150, hp: 150, badge: '冷静推进者', desc: '它会放大未来，你用行动把注意力带回现在。' },
  { id: 'noise_monster', name: '内耗怪', icon: '🌀', maxHp: 180, hp: 180, badge: '反内耗勇士', desc: '它制造自我怀疑，你用完成记录反驳它。' },
  { id: 'night_monster', name: '熬夜怪', icon: '🌙', maxHp: 160, hp: 160, badge: '节律守护者', desc: '它偷走第二天的能量，你用边界把夜晚还给自己。' }
]

const gentleWords = [
  '慢慢来，每天进步一点点，时间会给你答案。',
  '你不是没有进步，只是在安静升级。',
  '稳定不是平庸，是一种能够反复抵达的能力。',
  '今天不需要赢过所有人，只需要把自己从混乱里带出来一点。',
  '真正的自律不是压迫自己，而是减少反复消耗自己的机会。',
  '你可以慢，但不要把方向交给情绪。',
  '微小完成也有重量，它会慢慢改写你对自己的判断。'
]

const moods = ['平静', '专注', '疲惫', '焦虑', '清醒', '松弛']

function safeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function todayKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatChineseDate(date = new Date()) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: '2-digit', minute: '2-digit'
  }).format(date)
}

function expForLevel(level) {
  return Math.round(130 + level * 35 + Math.pow(level, 1.35) * 16)
}

function getLevelInfo(totalXP) {
  let level = 1
  let rest = totalXP
  while (level < MAX_LEVEL && rest >= expForLevel(level)) {
    rest -= expForLevel(level)
    level += 1
  }
  const next = expForLevel(level)
  const current = level >= MAX_LEVEL ? next : rest
  const percent = level >= MAX_LEVEL ? 100 : Math.min(100, Math.round((current / next) * 100))
  return { level, current, next, percent, toNext: level >= MAX_LEVEL ? 0 : Math.max(0, next - current) }
}

function loadAccounts() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function buildDimensionXP() {
  return Object.fromEntries(dimensions.map((item) => [item.id, 0]))
}

function createProfile({ account, nickname, role, theme }) {
  const roleObj = roles.find((item) => item.id === role) || roles[0]
  return {
    id: safeId(),
    account: account.trim(),
    nickname: nickname.trim() || account.trim(),
    role,
    roleName: roleObj.name,
    theme,
    createdAt: new Date().toISOString(),
    totalXP: 0,
    mood: '平静',
    dimensionXP: buildDimensionXP(),
    taskTemplates: [...defaultTasks],
    completedByDate: {},
    taskLog: [],
    monsters: defaultMonsters.map((monster) => ({ ...monster, defeated: false })),
    badges: [],
    yearlyGoals: [
      { id: 'goal-study', text: '建立稳定学习系统，每周完成一次知识复盘', done: false },
      { id: 'goal-media', text: '持续输出内容，形成自己的表达风格', done: false },
      { id: 'goal-fitness', text: '坚持每周运动，让身体状态稳定向上', done: false }
    ],
    lastFeedback: '从今天开始，把成长变成一套可见的系统。',
    privacyAccepted: true
  }
}

function getAchievements(profile, levelInfo) {
  const todayCompleted = profile.completedByDate[todayKey()]?.length || 0
  const totalTasks = profile.taskLog.length
  const hasDefeatedMonster = profile.monsters.some((monster) => monster.defeated)
  const activeDates = new Set(profile.taskLog.map((item) => item.date)).size
  return [
    { id: 'starter', name: '微光启动者', icon: '✨', desc: '同一天连续完成 3 个任务', achieved: todayCompleted >= 3 },
    { id: 'level3', name: '稳定进化中', icon: '🌱', desc: '等级达到 Lv.3', achieved: levelInfo.level >= 3 },
    { id: 'monster1', name: '反内耗勇士', icon: '🛡️', desc: '击败第一个成长怪物', achieved: hasDefeatedMonster },
    { id: 'ten', name: '十次行动证明', icon: '📌', desc: '累计完成 10 个任务', achieved: totalTasks >= 10 },
    { id: 'days7', name: '稳定出现的人', icon: '🗓️', desc: '累计 7 天有成长记录', achieved: activeDates >= 7 }
  ]
}

function getDimensionLevel(xp) {
  const level = Math.min(10, Math.max(1, Math.floor(xp / 160) + 1))
  const current = xp % 160
  return { level, current, percent: Math.min(100, Math.round((current / 160) * 100)) }
}

function StatCard({ label, value, hint }) {
  return (
    <div className="stat-card">
      <strong>{value}</strong>
      <span>{label}</span>
      {hint && <small>{hint}</small>}
    </div>
  )
}

function ProgressBar({ value }) {
  return (
    <div className="progress-track" aria-label="进度条">
      <span style={{ width: `${Math.max(4, Math.min(100, value))}%` }} />
    </div>
  )
}

function LevelRing({ level, percent }) {
  return (
    <div className="level-ring" style={{ '--ring': `${percent * 3.6}deg` }}>
      <div>
        <span>LV.{level}</span>
        <small>{percent}%</small>
      </div>
    </div>
  )
}

function RadarChart({ profile }) {
  const size = 260
  const center = size / 2
  const radius = 92
  const values = dimensions.map((item) => getDimensionLevel(profile.dimensionXP[item.id] || 0).level)
  const points = values.map((value, index) => {
    const angle = (-90 + index * (360 / dimensions.length)) * (Math.PI / 180)
    const distance = radius * (value / 10)
    return [center + Math.cos(angle) * distance, center + Math.sin(angle) * distance]
  })
  const polygon = points.map(([x, y]) => `${x},${y}`).join(' ')

  return (
    <div className="radar-wrap">
      <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label="八维能力雷达图">
        {[2, 4, 6, 8, 10].map((step) => {
          const r = radius * (step / 10)
          const ringPoints = dimensions.map((_, index) => {
            const angle = (-90 + index * (360 / dimensions.length)) * (Math.PI / 180)
            return `${center + Math.cos(angle) * r},${center + Math.sin(angle) * r}`
          }).join(' ')
          return <polygon key={step} points={ringPoints} className="radar-grid" />
        })}
        {dimensions.map((item, index) => {
          const angle = (-90 + index * (360 / dimensions.length)) * (Math.PI / 180)
          const x = center + Math.cos(angle) * radius
          const y = center + Math.sin(angle) * radius
          const labelX = center + Math.cos(angle) * (radius + 34)
          const labelY = center + Math.sin(angle) * (radius + 34)
          return (
            <g key={item.id}>
              <line x1={center} y1={center} x2={x} y2={y} className="radar-axis" />
              <text x={labelX} y={labelY} textAnchor="middle" dominantBaseline="middle" className="radar-label">{item.name}</text>
            </g>
          )
        })}
        <polygon points={polygon} className="radar-area" />
        {points.map(([x, y], index) => <circle key={index} cx={x} cy={y} r="4" className="radar-dot" />)}
      </svg>
    </div>
  )
}

function CalendarPanel({ taskLog }) {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const totalDays = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const byDate = taskLog.reduce((acc, item) => {
    acc[item.date] = (acc[item.date] || 0) + item.exp
    return acc
  }, {})
  const cells = []
  for (let i = 0; i < firstDay; i += 1) cells.push(null)
  for (let day = 1; day <= totalDays; day += 1) cells.push(day)

  return (
    <div className="card calendar-card">
      <div className="section-title">
        <h3>{year}年{month + 1}月</h3>
        <span>成长日历</span>
      </div>
      <div className="calendar-weekdays">
        {['日', '一', '二', '三', '四', '五', '六'].map((item) => <span key={item}>{item}</span>)}
      </div>
      <div className="calendar-grid">
        {cells.map((day, index) => {
          if (!day) return <span className="calendar-empty" key={`empty-${index}`} />
          const date = todayKey(new Date(year, month, day))
          const exp = byDate[date] || 0
          return (
            <span key={date} className={`calendar-day ${exp ? 'active' : ''} ${date === todayKey() ? 'today' : ''}`}>
              <b>{day}</b>
              {exp > 0 && <small>+{exp}</small>}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function LoginScreen({ accounts, onCreate, onSelect }) {
  const [form, setForm] = useState({ account: '', nickname: '', role: 'explorer', theme: 'blue' })
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    const account = form.account.trim()
    if (!account) {
      setError('请先设置一个登录账号。可以用英文、拼音或昵称，不建议使用身份证号等敏感信息。')
      return
    }
    if (accounts.some((item) => item.account.toLowerCase() === account.toLowerCase())) {
      setError('这个账号已经存在。你可以在下方“继续已有账号”中进入。')
      return
    }
    onCreate(form)
  }

  const wechatMock = () => {
    const suffix = String(Date.now()).slice(-4)
    onCreate({ account: `wechat-local-${suffix}`, nickname: '微信用户', role: 'explorer', theme: 'blue' })
  }

  return (
    <main className="login-shell theme-blue">
      <section className="login-card glass-card">
        <p className="eyebrow">MY GROWTH RPG · v2</p>
        <h1>把个人成长做成一套可视化升级系统</h1>
        <p className="login-subtitle">本版本是前端原型：数据只保存在你的浏览器 localStorage 中，不上传服务器。适合先验证产品体验，再接真实后端。</p>

        <form onSubmit={submit} className="login-form">
          <label>
            登录账号
            <input value={form.account} onChange={(event) => setForm({ ...form, account: event.target.value })} placeholder="例如：bei_growth" />
          </label>
          <label>
            显示昵称
            <input value={form.nickname} onChange={(event) => setForm({ ...form, nickname: event.target.value })} placeholder="例如：北" />
          </label>

          <div className="choice-block">
            <span>选择初始角色风格</span>
            <div className="choice-grid">
              {roles.map((role) => (
                <button type="button" key={role.id} className={form.role === role.id ? 'choice active' : 'choice'} onClick={() => setForm({ ...form, role: role.id })}>
                  <strong>{role.name}</strong>
                  <small>{role.desc}</small>
                </button>
              ))}
            </div>
          </div>

          <div className="choice-block">
            <span>选择网页配色</span>
            <div className="theme-choice-row">
              {themes.map((theme) => <button type="button" key={theme.id} className={`theme-pill ${form.theme === theme.id ? 'active' : ''}`} onClick={() => setForm({ ...form, theme: theme.id })}>{theme.name}</button>)}
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}
          <button className="primary-btn" type="submit">开始我的成长旅程</button>
          <button className="ghost-btn" type="button" onClick={wechatMock}>使用微信登录（原型）</button>
          <p className="privacy-note">真实微信登录需要微信开放平台 AppID、已备案域名和后端 OAuth 鉴权。本按钮当前仅用于展示产品入口，不会读取你的微信信息。</p>
        </form>

        {accounts.length > 0 && (
          <div className="saved-accounts">
            <h3>继续已有账号</h3>
            <div className="saved-list">
              {accounts.map((account) => {
                const levelInfo = getLevelInfo(account.totalXP)
                return (
                  <button key={account.id} onClick={() => onSelect(account.id)}>
                    <span>{account.nickname}</span>
                    <small>{account.account} · LV.{levelInfo.level}</small>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default function App() {
  const [accounts, setAccounts] = useState(loadAccounts)
  const [activeId, setActiveId] = useState(() => localStorage.getItem(ACTIVE_KEY) || '')
  const [activeTab, setActiveTab] = useState('overview')
  const [now, setNow] = useState(new Date())
  const [taskForm, setTaskForm] = useState({ title: '', dimension: 'study', exp: 45 })
  const [goalText, setGoalText] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts))
  }, [accounts])

  useEffect(() => {
    if (activeId) localStorage.setItem(ACTIVE_KEY, activeId)
    else localStorage.removeItem(ACTIVE_KEY)
  }, [activeId])

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const profile = accounts.find((account) => account.id === activeId)

  const updateProfile = (updater) => {
    setAccounts((prev) => prev.map((item) => {
      if (item.id !== activeId) return item
      return typeof updater === 'function' ? updater(item) : { ...item, ...updater }
    }))
  }

  const createAccount = (form) => {
    const next = createProfile(form)
    setAccounts((prev) => [...prev, next])
    setActiveId(next.id)
    setActiveTab('overview')
  }

  const levelInfo = useMemo(() => profile ? getLevelInfo(profile.totalXP) : null, [profile])
  const achievements = useMemo(() => profile && levelInfo ? getAchievements(profile, levelInfo) : [], [profile, levelInfo])
  const todayCompletedIds = profile?.completedByDate?.[todayKey()] || []
  const todayCompletedCount = todayCompletedIds.length
  const todayXP = profile?.taskLog?.filter((item) => item.date === todayKey()).reduce((sum, item) => sum + item.exp, 0) || 0
  const activeMonster = profile?.monsters?.find((monster) => !monster.defeated) || null
  const roleObj = roles.find((item) => item.id === profile?.role) || roles[0]

  if (!profile) {
    return <LoginScreen accounts={accounts} onCreate={createAccount} onSelect={setActiveId} />
  }

  const completeTask = (task) => {
    if (todayCompletedIds.includes(task.id)) return
    updateProfile((current) => {
      const date = todayKey()
      const nextCompleted = { ...current.completedByDate, [date]: [...(current.completedByDate[date] || []), task.id] }
      let gainedBadge = ''
      const nextMonsters = current.monsters.map((monster) => {
        if (monster.defeated || gainedBadge) return monster
        const hp = Math.max(0, monster.hp - task.damage)
        const defeated = hp <= 0
        if (defeated) gainedBadge = monster.badge
        return { ...monster, hp, defeated }
      })
      const nextBadges = gainedBadge && !current.badges.includes(gainedBadge) ? [...current.badges, gainedBadge] : current.badges
      const nextDimensionXP = { ...current.dimensionXP, [task.dimension]: (current.dimensionXP[task.dimension] || 0) + task.exp }
      const logItem = {
        id: safeId(),
        date,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        title: task.title,
        dimension: task.dimension,
        dimensionName: dimensions.find((item) => item.id === task.dimension)?.name || task.dimension,
        difficulty: task.difficulty || '自定义',
        exp: task.exp
      }
      return {
        ...current,
        totalXP: current.totalXP + task.exp,
        dimensionXP: nextDimensionXP,
        completedByDate: nextCompleted,
        taskLog: [logItem, ...current.taskLog].slice(0, 80),
        monsters: nextMonsters,
        badges: nextBadges,
        lastFeedback: gainedBadge ? `你击败了一个成长阻力，获得徽章「${gainedBadge}」。` : task.feedback,
        lastActiveDate: new Date().toISOString()
      }
    })
  }

  const addTask = (event) => {
    event.preventDefault()
    const title = taskForm.title.trim()
    if (!title) return
    const exp = Math.max(10, Math.min(160, Number(taskForm.exp) || 45))
    const newTask = {
      id: `custom-${safeId()}`,
      title,
      dimension: taskForm.dimension,
      exp,
      damage: Math.max(8, Math.round(exp * 0.42)),
      difficulty: '自定义',
      custom: true,
      feedback: '你刚刚把一个模糊愿望，改写成了可以完成的行动。'
    }
    updateProfile((current) => ({ ...current, taskTemplates: [newTask, ...current.taskTemplates] }))
    setTaskForm({ title: '', dimension: 'study', exp: 45 })
  }

  const deleteTask = (taskId) => {
    updateProfile((current) => ({ ...current, taskTemplates: current.taskTemplates.filter((task) => task.id !== taskId) }))
  }

  const toggleGoal = (goalId) => {
    updateProfile((current) => ({
      ...current,
      yearlyGoals: current.yearlyGoals.map((goal) => goal.id === goalId ? { ...goal, done: !goal.done } : goal)
    }))
  }

  const addGoal = (event) => {
    event.preventDefault()
    const text = goalText.trim()
    if (!text) return
    updateProfile((current) => ({ ...current, yearlyGoals: [...current.yearlyGoals, { id: safeId(), text, done: false }] }))
    setGoalText('')
  }

  const removeGoal = (goalId) => {
    updateProfile((current) => ({ ...current, yearlyGoals: current.yearlyGoals.filter((goal) => goal.id !== goalId) }))
  }

  const resetToday = () => {
    updateProfile((current) => {
      const next = { ...current.completedByDate }
      delete next[todayKey()]
      return { ...current, completedByDate: next, lastFeedback: '今日任务状态已重置，但历史经验记录仍保留。' }
    })
  }

  const clearAccount = () => {
    const ok = window.confirm('确认清空当前账号的所有本地数据吗？此操作无法恢复。')
    if (!ok) return
    setAccounts((prev) => prev.filter((item) => item.id !== activeId))
    setActiveId('')
  }

  const navItems = [
    ['overview', '🏠', '总览'],
    ['today', '🕘', '今日战绩'],
    ['tasks', '💼', '任务营地'],
    ['growth', '🧭', '成长图谱'],
    ['badges', '🏆', '成就勋章'],
    ['settings', '⚙️', '设置中心']
  ]

  return (
    <div className={`app-shell theme-${profile.theme || 'blue'}`}>
      <aside className="sidebar">
        <LevelRing level={levelInfo.level} percent={levelInfo.percent} />
        <nav>
          {navItems.map(([id, icon, label]) => (
            <button key={id} className={activeTab === id ? 'active' : ''} onClick={() => setActiveTab(id)}>
              <span>{icon}</span>{label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-panel">
        <header className="hero-card card">
          <div>
            <p className="eyebrow">{roleObj.name} · LV.{levelInfo.level}/{MAX_LEVEL}</p>
            <h1>{profile.nickname}的努力可视化系统</h1>
            <p className="hero-sentence">{roleObj.title}｜自由不是逃离秩序，而是把秩序变成自己的工具。</p>
            <span className="date-line">{formatChineseDate(now)}</span>
          </div>
          <div className="hero-quote">
            <p>{gentleWords[new Date().getDate() % gentleWords.length]}</p>
            <span>今日情绪：{profile.mood}</span>
          </div>
        </header>

        {activeTab === 'overview' && (
          <section className="page-grid">
            <div className="card overview-card">
              <div className="section-title"><h2>角色总览</h2><span>{profile.account}</span></div>
              <div className="level-summary">
                <div className="level-badge">LV.{levelInfo.level}</div>
                <div>
                  <h3>{profile.totalXP} 总经验</h3>
                  <p>{levelInfo.level >= MAX_LEVEL ? '已满级' : `还需 ${levelInfo.toNext} 经验升级`}</p>
                  <ProgressBar value={levelInfo.percent} />
                </div>
              </div>
              <div className="stat-grid compact">
                <StatCard label="今日经验" value={`+${todayXP}`} />
                <StatCard label="今日完成" value={todayCompletedCount} />
                <StatCard label="已获徽章" value={profile.badges.length} />
                <StatCard label="今日能量" value={`${Math.min(100, 62 + todayCompletedCount * 8)}%`} />
              </div>
            </div>

            <div className="card radar-card">
              <div className="section-title"><h2>八维能力雷达图</h2><span>能力分布</span></div>
              <RadarChart profile={profile} />
            </div>

            <div className="card full-card task-preview">
              <div className="section-title"><h2>今日打卡卡片</h2><button onClick={() => setActiveTab('tasks')}>添加任务</button></div>
              <div className="task-grid">
                {profile.taskTemplates.slice(0, 8).map((task) => {
                  const done = todayCompletedIds.includes(task.id)
                  const dim = dimensions.find((item) => item.id === task.dimension)
                  return (
                    <button key={task.id} className={`task-card ${done ? 'done' : ''}`} onClick={() => completeTask(task)} disabled={done}>
                      <strong>{dim?.icon} {task.title}</strong>
                      <span>{dim?.name} · +{task.exp} EXP</span>
                      <small>{done ? '已完成' : '点击完成'}</small>
                    </button>
                  )
                })}
              </div>
            </div>

            <DimensionTable profile={profile} />
            <RecentLog profile={profile} />
            <QuotePanel feedback={profile.lastFeedback} />
            <GoalsPanel goals={profile.yearlyGoals} onToggle={toggleGoal} />
            <CalendarPanel taskLog={profile.taskLog} />
          </section>
        )}

        {activeTab === 'today' && (
          <section className="page-grid two-column">
            <div className="card full-card">
              <div className="section-title"><h2>今日任务</h2><button onClick={resetToday}>重置今日完成状态</button></div>
              <div className="task-grid large">
                {profile.taskTemplates.map((task) => {
                  const done = todayCompletedIds.includes(task.id)
                  const dim = dimensions.find((item) => item.id === task.dimension)
                  return (
                    <div key={task.id} className={`mission-card ${done ? 'done' : ''}`}>
                      <div>
                        <strong>{dim?.icon} {task.title}</strong>
                        <p>{dim?.name} · {task.difficulty} · +{task.exp} EXP · -{task.damage} HP</p>
                      </div>
                      <button onClick={() => completeTask(task)} disabled={done}>{done ? '已完成' : '完成任务'}</button>
                    </div>
                  )
                })}
              </div>
            </div>

            <MonsterPanel monster={activeMonster} monsters={profile.monsters} badges={profile.badges} />
            <QuotePanel feedback={profile.lastFeedback} />
          </section>
        )}

        {activeTab === 'tasks' && (
          <section className="page-grid two-column">
            <div className="card">
              <div className="section-title"><h2>添加自定义任务</h2><span>让系统适配你的生活</span></div>
              <form className="task-form" onSubmit={addTask}>
                <label>任务名称<input value={taskForm.title} onChange={(event) => setTaskForm({ ...taskForm, title: event.target.value })} placeholder="例如：写完一页论文 / 剪一个视频片段" /></label>
                <label>能力维度<select value={taskForm.dimension} onChange={(event) => setTaskForm({ ...taskForm, dimension: event.target.value })}>{dimensions.map((dim) => <option key={dim.id} value={dim.id}>{dim.name}</option>)}</select></label>
                <label>经验值<input type="number" min="10" max="160" value={taskForm.exp} onChange={(event) => setTaskForm({ ...taskForm, exp: event.target.value })} /></label>
                <button className="primary-btn" type="submit">添加到任务营地</button>
              </form>
            </div>
            <div className="card">
              <div className="section-title"><h2>任务库</h2><span>{profile.taskTemplates.length} 个任务</span></div>
              <div className="task-list">
                {profile.taskTemplates.map((task) => {
                  const dim = dimensions.find((item) => item.id === task.dimension)
                  return (
                    <div key={task.id} className="task-row">
                      <div><strong>{dim?.icon} {task.title}</strong><span>{dim?.name} · +{task.exp} EXP</span></div>
                      {task.custom && <button onClick={() => deleteTask(task.id)}>删除</button>}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {activeTab === 'growth' && (
          <section className="page-grid">
            <DimensionTable profile={profile} full />
            <div className="card">
              <div className="section-title"><h2>年度目标管理</h2><span>不追求多，追求持续</span></div>
              <form className="goal-form" onSubmit={addGoal}>
                <input value={goalText} onChange={(event) => setGoalText(event.target.value)} placeholder="添加一个今年想稳定推进的目标" />
                <button type="submit">添加</button>
              </form>
              <div className="goals-list editable">
                {profile.yearlyGoals.map((goal) => (
                  <div key={goal.id} className={goal.done ? 'goal done' : 'goal'}>
                    <button onClick={() => toggleGoal(goal.id)}>{goal.done ? '●' : '○'}</button>
                    <span>{goal.text}</span>
                    <button onClick={() => removeGoal(goal.id)}>删除</button>
                  </div>
                ))}
              </div>
            </div>
            <CalendarPanel taskLog={profile.taskLog} />
          </section>
        )}

        {activeTab === 'badges' && (
          <section className="page-grid two-column">
            <div className="card">
              <div className="section-title"><h2>成就系统</h2><span>{achievements.filter((item) => item.achieved).length}/{achievements.length}</span></div>
              <div className="achievement-grid">
                {achievements.map((item) => <div key={item.id} className={`achievement ${item.achieved ? 'achieved' : ''}`}><strong>{item.icon} {item.name}</strong><span>{item.desc}</span></div>)}
              </div>
            </div>
            <MonsterPanel monster={activeMonster} monsters={profile.monsters} badges={profile.badges} />
          </section>
        )}

        {activeTab === 'settings' && (
          <section className="page-grid two-column">
            <div className="card">
              <div className="section-title"><h2>设置中心</h2><span>账号与主题</span></div>
              <div className="settings-stack">
                <label>昵称<input value={profile.nickname} onChange={(event) => updateProfile({ nickname: event.target.value })} /></label>
                <label>今日情绪<select value={profile.mood} onChange={(event) => updateProfile({ mood: event.target.value })}>{moods.map((mood) => <option key={mood}>{mood}</option>)}</select></label>
                <label>网页配色<select value={profile.theme} onChange={(event) => updateProfile({ theme: event.target.value })}>{themes.map((theme) => <option key={theme.id} value={theme.id}>{theme.name}</option>)}</select></label>
                <div className="theme-preview-row">{themes.map((theme) => <button key={theme.id} className={`preview-dot ${theme.id} ${profile.theme === theme.id ? 'active' : ''}`} onClick={() => updateProfile({ theme: theme.id })}>{theme.name}</button>)}</div>
                <button className="ghost-btn" onClick={() => setActiveId('')}>退出到登录入口</button>
                <button className="danger-btn" onClick={clearAccount}>清空当前账号本地数据</button>
              </div>
            </div>
            <div className="card privacy-card">
              <div className="section-title"><h2>隐私说明</h2><span>当前原型</span></div>
              <p>这个版本没有真实数据库，所有昵称、任务、经验、情绪状态都只保存在当前浏览器的 localStorage 中。</p>
              <p>换电脑、换浏览器或清理浏览器数据后，记录可能消失。正式上线前建议接入后端数据库和真实登录系统。</p>
              <p>微信登录不能只靠前端实现，需要微信开放平台配置、合法域名、后端换取 access_token，并设计用户隐私授权页面。</p>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

function DimensionTable({ profile, full = false }) {
  return (
    <div className={`card dimension-card ${full ? 'full-card' : 'full-card'}`}>
      <div className="section-title"><h2>八维成长进度</h2><span>满级 10 级 / 角色满级 60 级</span></div>
      <div className="dimension-table">
        {dimensions.map((dim) => {
          const xp = profile.dimensionXP[dim.id] || 0
          const info = getDimensionLevel(xp)
          return (
            <div className="dimension-row" key={dim.id}>
              <strong>{dim.icon} {dim.name}</strong>
              <span className="lv-chip">LV.{info.level}</span>
              <ProgressBar value={info.percent} />
              <span className="xp-cell">{info.current}/160</span>
              <p>{dim.goal}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function RecentLog({ profile }) {
  return (
    <div className="card log-card">
      <div className="section-title"><h2>最近打卡记录</h2><span>{profile.taskLog.length} 条</span></div>
      <div className="log-table">
        <div className="log-head"><span>状态</span><span>日期</span><span>维度</span><span>任务</span><span>经验</span></div>
        {profile.taskLog.slice(0, 8).map((log) => (
          <div className="log-row" key={log.id}><span className="status-dot">完成</span><span>{log.date}</span><span>{log.dimensionName}</span><span>{log.title}</span><b>+{log.exp}</b></div>
        ))}
        {profile.taskLog.length === 0 && <p className="empty-state">还没有记录。完成第一个任务后，这里会开始积累你的成长证据。</p>}
      </div>
    </div>
  )
}

function QuotePanel({ feedback }) {
  return (
    <div className="card quote-card">
      <div className="section-title"><h2>碎碎念感悟</h2><span>{todayKey()}</span></div>
      <p>{feedback}</p>
      <div className="line-art" aria-hidden="true" />
    </div>
  )
}

function GoalsPanel({ goals, onToggle }) {
  return (
    <div className="card goals-card">
      <div className="section-title"><h2>年度目标进度</h2><span>2026</span></div>
      <div className="goals-list">
        {goals.map((goal) => (
          <button key={goal.id} className={goal.done ? 'goal done' : 'goal'} onClick={() => onToggle(goal.id)}>
            <span>{goal.done ? '●' : '○'}</span>{goal.text}
          </button>
        ))}
      </div>
    </div>
  )
}

function MonsterPanel({ monster, monsters, badges }) {
  return (
    <div className="card monster-card">
      <div className="section-title"><h2>打怪升级系统</h2><span>非暴力成长阻力</span></div>
      {monster ? (
        <>
          <div className="monster-main">
            <span className="monster-icon">{monster.icon}</span>
            <div><h3>{monster.name}</h3><p>{monster.desc}</p></div>
          </div>
          <ProgressBar value={Math.round((monster.hp / monster.maxHp) * 100)} />
          <p className="hp-line">HP {monster.hp}/{monster.maxHp}</p>
        </>
      ) : (
        <div className="empty-state">本轮怪物已全部击败。你已经证明：问题可以被拆解，状态可以被重建。</div>
      )}
      <div className="monster-list">
        {monsters.map((item) => <span key={item.id} className={item.defeated ? 'defeated' : ''}>{item.icon} {item.name}</span>)}
      </div>
      <div className="badge-list">
        {badges.length ? badges.map((badge) => <span key={badge}>🏅 {badge}</span>) : <small>击败第一个怪物后会获得徽章。</small>}
      </div>
    </div>
  )
}

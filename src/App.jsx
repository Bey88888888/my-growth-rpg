import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'my-growth-rpg-save-v1';

const ROLE_OPTIONS = [
  {
    id: 'explorer',
    name: '探索者',
    title: '新手探索者',
    description: '适合想重新打开生活边界的人。',
    accent: '探索'
  },
  {
    id: 'cultivator',
    name: '修炼者',
    title: '稳定修炼者',
    description: '适合想建立节律、减少内耗的人。',
    accent: '修炼'
  },
  {
    id: 'creator',
    name: '创造者',
    title: '初阶创造者',
    description: '适合想持续输出、积累作品的人。',
    accent: '创造'
  }
];

const BASE_TASKS = [
  {
    id: 'water',
    name: '喝水',
    description: '给身体一个很小但确定的照顾。',
    xp: 20,
    damage: 18
  },
  {
    id: 'read',
    name: '阅读 10 分钟',
    description: '不求读完，只要重新进入专注。',
    xp: 30,
    damage: 24
  },
  {
    id: 'move',
    name: '运动 15 分钟',
    description: '让情绪从身体里找到出口。',
    xp: 35,
    damage: 28
  },
  {
    id: 'tidy',
    name: '整理房间',
    description: '外部秩序会轻轻托住内部秩序。',
    xp: 25,
    damage: 22
  },
  {
    id: 'delay',
    name: '完成一件拖延的小事',
    description: '不用宏大，只要把一个结打开。',
    xp: 40,
    damage: 34
  }
];

const BASE_MONSTERS = [
  {
    id: 'procrastination',
    name: '拖延怪',
    hp: 90,
    maxHp: 90,
    note: '它不强，只是擅长让你迟一点开始。',
    badgeId: 'delay-breaker',
    badgeName: '拖延破壁者'
  },
  {
    id: 'anxiety',
    name: '焦虑怪',
    hp: 110,
    maxHp: 110,
    note: '它会放大未来，但你可以先拿回今天。',
    badgeId: 'calm-holder',
    badgeName: '冷静持有者'
  },
  {
    id: 'overthinking',
    name: '内耗怪',
    hp: 120,
    maxHp: 120,
    note: '它消耗你，但并不能定义你。',
    badgeId: 'anti-overthinking',
    badgeName: '反内耗勇士'
  },
  {
    id: 'late-night',
    name: '熬夜怪',
    hp: 100,
    maxHp: 100,
    note: '它靠惯性生长，也会被新的节律削弱。',
    badgeId: 'night-reset',
    badgeName: '夜航修正者'
  }
];

const ACHIEVEMENTS = [
  {
    id: 'micro-light',
    name: '微光启动者',
    description: '单日完成 3 个任务。',
    icon: '✦'
  },
  {
    id: 'stable-evolution',
    name: '稳定进化中',
    description: '角色等级升到 3 级。',
    icon: '◆'
  },
  {
    id: 'first-monster',
    name: '反内耗勇士',
    description: '击败第一个成长阻力。',
    icon: '◇'
  },
  {
    id: 'delay-breaker',
    name: '拖延破壁者',
    description: '击败拖延怪。',
    icon: '◈'
  },
  {
    id: 'calm-holder',
    name: '冷静持有者',
    description: '击败焦虑怪。',
    icon: '◌'
  },
  {
    id: 'anti-overthinking',
    name: '内耗止损者',
    description: '击败内耗怪。',
    icon: '◎'
  },
  {
    id: 'night-reset',
    name: '夜航修正者',
    description: '击败熬夜怪。',
    icon: '◐'
  }
];

const MOODS = ['平静', '疲惫', '清醒', '低电量', '有点焦虑', '正在恢复'];

const DAILY_QUOTES = [
  '你不是没有进步，只是在安静升级。',
  '今天不需要赢过所有人，只需要把自己从惯性里带出来一点。',
  '真正的稳定，不是永远高能量，而是低能量时也不彻底放弃。',
  '把注意力放回可控制的小事，秩序会慢慢回来。',
  '你可以慢一点，但不要把慢误解成停滞。',
  '成熟的成长，是允许波动存在，同时继续行动。',
  '不必用情绪证明努力，完成一件小事就够了。',
  '今天的你只需要留下一个可被明天继承的痕迹。'
];

const FEEDBACK_LINES = [
  '你不是没有进步，只是在安静升级。',
  '这一步很小，但它把你从原地带走了。',
  '完成比完美更接近真正的改变。',
  '你刚刚赢回了一点对生活的控制权。',
  '不用声势浩大，稳定本身就很有力量。',
  '你正在把混乱拆成可以处理的小块。',
  '今天的你，已经比刚才更清醒一点。'
];

function getTodayKey() {
  return new Date().toLocaleDateString('en-CA');
}

function getDailyQuote() {
  const today = getTodayKey();
  const seed = today.split('-').reduce((sum, part) => sum + Number(part), 0);
  return DAILY_QUOTES[seed % DAILY_QUOTES.length];
}

function xpToNextLevel(level) {
  return 100 + (level - 1) * 55;
}

function createTasks() {
  return BASE_TASKS.map((task) => ({ ...task, completed: false }));
}

function createMonsters() {
  return BASE_MONSTERS.map((monster) => ({ ...monster }));
}

function getRole(roleId) {
  return ROLE_OPTIONS.find((role) => role.id === roleId) || ROLE_OPTIONS[0];
}

function createNewGame({ nickname, role }) {
  return {
    profile: {
      nickname: nickname.trim() || '未命名玩家',
      role
    },
    level: 1,
    xp: 0,
    energy: 72,
    mood: '平静',
    tasks: createTasks(),
    monsters: createMonsters(),
    badges: [],
    lastActiveDate: getTodayKey(),
    lastFeedback: '旅程已经开始。先完成一件很小的事。'
  };
}

function normalizeGame(game) {
  if (!game || !game.profile) return null;

  const today = getTodayKey();
  const knownBadges = Array.isArray(game.badges) ? game.badges : [];
  const base = {
    ...game,
    level: game.level || 1,
    xp: game.xp || 0,
    energy: typeof game.energy === 'number' ? game.energy : 72,
    mood: game.mood || '平静',
    tasks: Array.isArray(game.tasks) && game.tasks.length ? game.tasks : createTasks(),
    monsters: Array.isArray(game.monsters) && game.monsters.length ? game.monsters : createMonsters(),
    badges: knownBadges,
    lastFeedback: game.lastFeedback || '继续保持一个可持续的节奏。',
    lastActiveDate: game.lastActiveDate || today
  };

  if (base.lastActiveDate !== today) {
    return {
      ...base,
      tasks: createTasks(),
      energy: 72,
      mood: '平静',
      lastActiveDate: today,
      lastFeedback: '新的一天已刷新。今天从一个低阻力动作开始。'
    };
  }

  return base;
}

function loadGame() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeGame(JSON.parse(raw)) : null;
  } catch (error) {
    console.warn('Failed to load save data:', error);
    return null;
  }
}

function addBadge(badges, badgeId) {
  if (badges.includes(badgeId)) return badges;
  return [...badges, badgeId];
}

function LoginPage({ onStart }) {
  const [nickname, setNickname] = useState('');
  const [role, setRole] = useState('explorer');

  function handleSubmit(event) {
    event.preventDefault();
    onStart(createNewGame({ nickname, role }));
  }

  return (
    <main className="login-shell">
      <section className="login-card">
        <div className="eyebrow">MY GROWTH RPG</div>
        <h1>把个人成长做成一场安静升级的游戏</h1>
        <p className="login-copy">
          这不是打卡压力系统，而是一个把任务、情绪、经验值和自我秩序放在一起的成长面板。
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="field-label" htmlFor="nickname">
            昵称
          </label>
          <input
            id="nickname"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="例如：北"
            maxLength={18}
          />

          <div className="field-label">选择初始角色风格</div>
          <div className="role-grid">
            {ROLE_OPTIONS.map((option) => (
              <button
                type="button"
                key={option.id}
                className={`role-card ${role === option.id ? 'active' : ''}`}
                onClick={() => setRole(option.id)}
              >
                <span>{option.name}</span>
                <small>{option.description}</small>
              </button>
            ))}
          </div>

          <button className="primary-button" type="submit">
            开始我的成长旅程
          </button>
        </form>
      </section>
    </main>
  );
}

function ProgressBar({ value, max, label }) {
  const percent = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className="progress-block" aria-label={label}>
      <div className="progress-meta">
        <span>{label}</span>
        <span>
          {value}/{max}
        </span>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function StatCard({ label, value, hint }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{hint}</small>
    </div>
  );
}

function DashboardHeader({ game, onMoodChange, onReset }) {
  const role = getRole(game.profile.role);
  const nextXp = xpToNextLevel(game.level);
  const completedCount = game.tasks.filter((task) => task.completed).length;
  const title = `Lv.${game.level} ${game.level === 1 ? role.title : role.name}`;

  return (
    <section className="hero-panel panel">
      <div className="hero-content">
        <div className="eyebrow">ROLE PANEL</div>
        <h1>{game.profile.nickname}</h1>
        <p className="role-title">{title}</p>
        <p className="quote">“{getDailyQuote()}”</p>
      </div>

      <div className="hero-side">
        <div className="avatar-orb">
          <span>{role.accent}</span>
        </div>
        <button className="ghost-button" onClick={onReset} type="button">
          重新开始
        </button>
      </div>

      <div className="stats-grid full-row">
        <StatCard label="等级" value={`Lv.${game.level}`} hint="自动升级" />
        <StatCard label="经验值" value={`${game.xp}/${nextXp}`} hint="完成任务获得" />
        <StatCard label="今日能量" value={game.energy} hint="上限 100" />
        <StatCard label="今日完成" value={`${completedCount}/5`} hint="每日刷新" />
      </div>

      <div className="full-row">
        <ProgressBar value={game.xp} max={nextXp} label="经验条" />
      </div>

      <div className="mood-row full-row">
        <span>今日情绪状态</span>
        <div className="mood-pills">
          {MOODS.map((mood) => (
            <button
              type="button"
              key={mood}
              className={game.mood === mood ? 'active' : ''}
              onClick={() => onMoodChange(mood)}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function TasksPanel({ tasks, onComplete }) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <div className="eyebrow">DAILY QUESTS</div>
          <h2>每日任务系统</h2>
        </div>
        <p>完成任务获得经验，并对成长阻力造成伤害。</p>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <article key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
            <div>
              <h3>{task.name}</h3>
              <p>{task.description}</p>
              <small>
                +{task.xp} EXP · 伤害 {task.damage}
              </small>
            </div>
            <button type="button" onClick={() => onComplete(task.id)} disabled={task.completed}>
              {task.completed ? '已完成' : '完成'}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function MonsterPanel({ monsters }) {
  const activeMonster = monsters.find((monster) => monster.hp > 0);

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <div className="eyebrow">INNER BOSSES</div>
          <h2>打怪升级系统</h2>
        </div>
        <p>这里的怪物不是敌人，而是需要被拆小处理的阻力。</p>
      </div>

      {activeMonster ? (
        <div className="boss-card">
          <div className="boss-topline">
            <div>
              <span className="boss-label">当前阻力</span>
              <h3>{activeMonster.name}</h3>
            </div>
            <strong>
              {activeMonster.hp}/{activeMonster.maxHp}
            </strong>
          </div>
          <p>{activeMonster.note}</p>
          <ProgressBar value={activeMonster.hp} max={activeMonster.maxHp} label="剩余生命值" />
        </div>
      ) : (
        <div className="boss-card cleared">
          <span className="boss-label">全部清除</span>
          <h3>今日阻力已被你逐个拆解</h3>
          <p>保持这种节奏，不需要用力过猛。</p>
        </div>
      )}

      <div className="monster-grid">
        {monsters.map((monster) => (
          <div key={monster.id} className={`monster-chip ${monster.hp === 0 ? 'defeated' : ''}`}>
            <span>{monster.name}</span>
            <small>{monster.hp === 0 ? monster.badgeName : `${monster.hp} HP`}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

function AchievementsPanel({ badges }) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <div className="eyebrow">BADGES</div>
          <h2>成就系统</h2>
        </div>
        <p>徽章不是炫耀，是提醒你已经跨过某些阻力。</p>
      </div>

      <div className="achievement-grid">
        {ACHIEVEMENTS.map((achievement) => {
          const unlocked = badges.includes(achievement.id);
          return (
            <article key={achievement.id} className={`achievement-card ${unlocked ? 'unlocked' : ''}`}>
              <div className="achievement-icon">{achievement.icon}</div>
              <div>
                <h3>{achievement.name}</h3>
                <p>{achievement.description}</p>
                <small>{unlocked ? '已获得' : '未解锁'}</small>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function EmotionPanel({ feedback }) {
  return (
    <section className="panel emotion-panel">
      <div className="section-heading compact">
        <div>
          <div className="eyebrow">CALM FEEDBACK</div>
          <h2>情绪价值模块</h2>
        </div>
      </div>
      <p>{feedback}</p>
    </section>
  );
}

export default function App() {
  const [game, setGame] = useState(loadGame);

  useEffect(() => {
    if (game) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
    }
  }, [game]);

  const completionRate = useMemo(() => {
    if (!game) return 0;
    return Math.round((game.tasks.filter((task) => task.completed).length / game.tasks.length) * 100);
  }, [game]);

  function handleStart(newGame) {
    setGame(newGame);
  }

  function handleReset() {
    localStorage.removeItem(STORAGE_KEY);
    setGame(null);
  }

  function handleMoodChange(mood) {
    setGame((current) => ({ ...current, mood }));
  }

  function handleCompleteTask(taskId) {
    setGame((current) => {
      const task = current.tasks.find((item) => item.id === taskId);
      if (!task || task.completed) return current;

      const updatedTasks = current.tasks.map((item) =>
        item.id === taskId ? { ...item, completed: true } : item
      );

      let nextXp = current.xp + task.xp;
      let nextLevel = current.level;
      let leveledUp = false;

      while (nextXp >= xpToNextLevel(nextLevel)) {
        nextXp -= xpToNextLevel(nextLevel);
        nextLevel += 1;
        leveledUp = true;
      }

      const activeMonsterIndex = current.monsters.findIndex((monster) => monster.hp > 0);
      let monsterDefeated = null;
      const updatedMonsters = current.monsters.map((monster, index) => {
        if (index !== activeMonsterIndex) return monster;
        const nextHp = Math.max(0, monster.hp - task.damage);
        if (nextHp === 0 && monster.hp > 0) {
          monsterDefeated = monster;
        }
        return { ...monster, hp: nextHp };
      });

      const completedToday = updatedTasks.filter((item) => item.completed).length;
      let updatedBadges = [...current.badges];

      if (completedToday >= 3) updatedBadges = addBadge(updatedBadges, 'micro-light');
      if (nextLevel >= 3) updatedBadges = addBadge(updatedBadges, 'stable-evolution');
      if (monsterDefeated) {
        updatedBadges = addBadge(updatedBadges, 'first-monster');
        updatedBadges = addBadge(updatedBadges, monsterDefeated.badgeId);
      }

      const feedbackSeed = Math.floor(Math.random() * FEEDBACK_LINES.length);
      const feedback = monsterDefeated
        ? `你击败了${monsterDefeated.name}，获得「${monsterDefeated.badgeName}」。阻力没有消失，但你已经证明它可以被处理。`
        : leveledUp
          ? `升级完成。Lv.${nextLevel} 的你，不是突然变强，而是持续累积终于显形。`
          : FEEDBACK_LINES[feedbackSeed];

      return {
        ...current,
        level: nextLevel,
        xp: nextXp,
        energy: Math.min(100, current.energy + 4),
        tasks: updatedTasks,
        monsters: updatedMonsters,
        badges: updatedBadges,
        lastFeedback: feedback
      };
    });
  }

  if (!game) {
    return <LoginPage onStart={handleStart} />;
  }

  return (
    <main className="app-shell">
      <DashboardHeader game={game} onMoodChange={handleMoodChange} onReset={handleReset} />

      <div className="content-grid">
        <div className="main-column">
          <TasksPanel tasks={game.tasks} onComplete={handleCompleteTask} />
          <AchievementsPanel badges={game.badges} />
        </div>

        <aside className="side-column">
          <EmotionPanel feedback={game.lastFeedback} />
          <MonsterPanel monsters={game.monsters} />
          <section className="panel compact-panel">
            <div className="eyebrow">TODAY</div>
            <h2>{completionRate}%</h2>
            <p>今日任务完成率。保持真实，不追求表演式自律。</p>
          </section>
        </aside>
      </div>
    </main>
  );
}

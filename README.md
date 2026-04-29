# My Growth RPG

一个使用 React + Vite 制作的「个人成长 RPG 网站」前端原型。

当前版本是纯前端原型：

- 假登录：输入昵称、选择角色风格即可进入。
- 本地保存：使用 `localStorage` 保存角色数据、任务进度、经验值、等级、怪物血量和徽章。
- 每日刷新：新的一天会刷新每日任务、能量值和情绪状态，但等级、经验、怪物进度和徽章会保留。
- 无真实数据库、无后端、无复杂依赖，适合直接部署到 Vercel。

## 项目结构

```txt
my-growth-rpg/
├── package.json
├── index.html
├── README.md
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    └── index.css
```

## 本地运行

进入项目目录后执行：

```bash
npm install
npm run dev
```

浏览器打开终端显示的本地地址，一般是：

```txt
http://localhost:5173
```

## 打包构建

```bash
npm run build
```

构建产物会生成在 `dist/` 目录。

## 上传 GitHub

### 方法一：使用 GitHub 网页上传

1. 登录 GitHub。
2. 点击右上角 `+`，选择 `New repository`。
3. Repository name 填写：`my-growth-rpg`。
4. 建议先不要勾选初始化 README，避免文件冲突。
5. 创建仓库后，点击 `uploading an existing file`。
6. 把本项目解压后的全部文件拖进去。
7. 点击 `Commit changes`。

### 方法二：使用命令行上传

```bash
cd my-growth-rpg
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/my-growth-rpg.git
git push -u origin main
```

请把 `YOUR_USERNAME` 替换成你的 GitHub 用户名。

## 部署到 Vercel

1. 登录 Vercel。
2. 点击 `Add New...` / `New Project`。
3. 选择刚刚上传到 GitHub 的 `my-growth-rpg` 仓库。
4. Framework Preset 选择 `Vite`。
5. Build Command 保持：`npm run build`。
6. Output Directory 保持：`dist`。
7. 点击 `Deploy`。

部署完成后，Vercel 会生成一个可访问的网址。

## 后续可迭代方向

- 增加真实账号系统，例如 Firebase / Supabase。
- 增加任务自定义功能。
- 增加周报、月报和成长曲线。
- 增加装备系统、技能树和更细的情绪记录。
- 增加云端同步，让不同设备共享同一份成长数据。

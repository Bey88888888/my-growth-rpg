# My Growth RPG

一个个人成长 RPG 前端原型：把日常任务、经验值、等级、八维能力、打怪系统、成就徽章和年度目标做成可视化面板。

## 当前版本

v2.0.0

## 功能

- React + Vite
- 前端假登录 / 本地账号
- localStorage 自动保存数据
- 角色满级 60 级
- 八维能力成长：科研学习、自媒体、运动健身、形象管理、技能操作、表达能力、剪辑技能、编程能力
- 每日任务打卡
- 自定义添加任务
- 任务完成后增加经验值并攻击成长怪物
- 打败怪物获得徽章
- 成就系统
- 年度目标进度
- 月度成长日历
- 三套主题：白蓝、黑金、粉灰
- 手机和电脑自适应

## 隐私说明

当前版本没有后端数据库，也没有真实微信登录。所有数据只保存在当前浏览器的 localStorage 中。

这意味着：

- 关闭网页再打开，数据还在。
- 换电脑、换浏览器、清理浏览器缓存后，数据可能消失。
- 当前“微信登录”按钮只是产品原型入口，不会读取微信信息。
- 如果要做真实微信登录，需要微信开放平台 AppID、合法域名、后端 OAuth 鉴权和用户隐私授权流程。

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开终端显示的地址，通常是：

```txt
http://localhost:5173
```

## 构建

```bash
npm run build
```

构建产物会生成在：

```txt
dist/
```

## 部署到 Vercel

Vercel 会自动识别 Vite 项目。建议配置：

```txt
Framework Preset: Vite
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

如果你已经把 GitHub 仓库连接到 Vercel，只要把新代码提交到 GitHub，Vercel 会自动重新部署。

## 项目结构

```txt
my-growth-rpg/
├── package.json
├── index.html
├── README.md
├── vite.config.js
├── .gitignore
└── src/
    ├── main.jsx
    ├── App.jsx
    └── index.css
```

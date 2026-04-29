# my-growth-rpg

一个使用 React + Vite 构建的个人成长 RPG 前端原型。

## v4 更新

- 封面改为更克制的 `Be better.`
- 增强 Apple-like 的留白、玻璃卡片、柔和渐变与小字号信息密度
- 1–60 级成长系统
- 邮箱注册 / 登录形式的本地独立存档
- 自动保存到当前设备 localStorage
- 支持导出 / 导入 JSON 存档
- 自定义任务、八维能力、今日行动、阻力地图、成就徽章
- 第二大脑：笔记、问题库、每日回顾、月度日历
- 四套主题：白蓝、黑金、粉灰、鼠尾草

## 隐私说明

你的成长档案默认只保存在当前设备。注册邮箱账号后，系统会为你建立独立存档。我们不会要求真实姓名，也不会公开你的任务、情绪和成长记录。

> 当前版本不是云端数据库登录。邮箱仅用于在本地浏览器中区分不同用户档案。跨设备使用请导出 JSON 存档后导入。

## 本地运行

```bash
npm install
npm run dev
```

## Vercel 部署设置

- Framework Preset: Vite
- Build Command: npm run build
- Output Directory: dist
- Install Command: npm install

## 文件结构

```txt
my-growth-rpg-v4/
├── package.json
├── index.html
├── vite.config.js
├── README.md
├── .gitignore
└── src/
    ├── main.jsx
    ├── App.jsx
    └── index.css
```

# My Growth RPG

一个“个人成长 RPG 网站”前端项目，使用 React + Vite 构建，可部署到 Vercel。

## v3 更新

- 增加邮箱注册 / 登录入口
- 每个邮箱在当前设备上拥有独立成长存档
- 自动保存等级、经验、任务、情绪、怪物、徽章、目标和打卡记录
- 增加导出 / 导入 JSON 存档
- 保留 1–60 级成长系统
- 支持自定义任务
- 支持白蓝、黑金、粉灰三套配色
- 保留八维能力雷达图、成长进度、年度目标和成长日历

## 隐私说明

你的成长档案默认只保存在当前设备。
注册邮箱账号后，系统会为你建立独立存档。
我们不会要求真实姓名，也不会公开你的任务、情绪和成长记录。

当前版本是前端原型：邮箱用于区分同一设备上的不同用户，本地记录保存在浏览器 localStorage。若需要跨设备同步，需要继续接入 Supabase / Firebase 等真实后端服务。

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

## 部署到 Vercel

1. 上传项目到 GitHub。
2. 在 Vercel 选择 `Import Git Repository`。
3. 选择该仓库。
4. Framework Preset 选择 `Vite`。
5. Build Command 使用：

```bash
npm run build
```

6. Output Directory 使用：

```txt
dist
```

7. 点击 Deploy。

## 后续升级建议

如需让用户在不同设备上登录后读取同一份成长档案，需要新增：

- Supabase Auth 或 Firebase Auth
- 云端数据库
- 用户数据表与 Row Level Security
- 前端环境变量配置
- 账号删除与隐私政策页面

# BoleChain 伯乐智信 MVP

华人学生跨境升学（港澳+新加坡）AI规划 + 区块链材料认证演示产品。

## 技术栈

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Auth & DB**: Supabase (Auth + PostgreSQL + Storage)
- **Package Manager**: Bun
- **Deployment**: Vercel

## 快速开始

### 1. 安装依赖

```bash
bun install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local` 并填入你的 Supabase 凭证：

```bash
cp .env.example .env.local
```

### 3. 初始化数据库

在 Supabase Dashboard 的 SQL Editor 中执行 `supabase/migrations/001_init_schema.sql`。

### 4. 启动开发服务器

```bash
bun dev
```

访问 http://localhost:3000

## 项目结构

```
bolechain-mvp/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing Page
│   │   ├── layout.tsx            # Root Layout
│   │   ├── register/
│   │   │   └── page.tsx          # 三角色注册页
│   │   ├── dashboard/
│   │   │   ├── layout.tsx        # Dashboard Layout (Sidebar)
│   │   │   └── page.tsx          # Dashboard 主页
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts      # Auth callback handler
│   ├── components/
│   │   ├── ui/                   # shadcn/ui 组件
│   │   ├── app-sidebar.tsx       # 侧边栏导航
│   │   └── dashboard-header.tsx  # 顶部栏
│   ├── hooks/
│   │   └── use-mobile.ts        # 移动端检测
│   ├── lib/
│   │   ├── utils.ts             # 工具函数
│   │   └── supabase/
│   │       ├── client.ts        # 浏览器端 Supabase client
│   │       └── server.ts        # 服务端 Supabase client
│   └── middleware.ts            # Auth middleware (session refresh + route protection)
├── supabase/
│   └── migrations/
│       └── 001_init_schema.sql  # Schema + RLS + Seed
├── .env.example
├── .env.local                   # (gitignored)
└── package.json
```

## 数据库表

| 表名 | 说明 |
|------|------|
| users | 用户扩展表（role, linked_student_id, invite_code） |
| schools | 院校信息（含 DSE/ALevel 要求、面试形式） |
| applications | 申请记录 |
| credentials | 材料凭证（区块链认证） |

## 角色说明

- **Student**: 学生，可管理自己的材料和申请
- **Parent**: 家长，通过邀请码绑定学生，只读查看
- **Counselor**: 升学顾问，需机构码 `BOLE2026` 注册，可签发凭证

## RLS 策略

- Student: 只能读写自己的 credentials/applications
- Parent: 通过 linked_student_id 只读对应 student 的数据
- Counselor: 只能写 issuer_did=self 的 credentials

## 部署到 Vercel

```bash
vercel
```

确保在 Vercel 项目设置中配置环境变量。

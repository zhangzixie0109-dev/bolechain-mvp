# BoleChain 伯乐智信 MVP

华人学生跨境升学（港澳+新加坡）AI规划 + 区块链材料认证演示产品。

**纯静态演示版本** — 所有交互在浏览器端完成，无需任何后端服务或环境变量。

## 技术栈

- **Framework**: Next.js 16 (App Router, Static Export) + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Auth**: localStorage 模拟（演示用）
- **Data**: 硬编码 mock 数据 + localStorage 持久化
- **Package Manager**: Bun
- **Deployment**: Vercel (Static)

## 快速开始

```bash
# 安装依赖
bun install

# 开发模式
bun dev

# 构建静态站点
bun run build

# 本地预览构建产物
bunx serve out
```

访问 http://localhost:3000

## 项目结构

```
bolechain-mvp/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing Page
│   │   ├── layout.tsx                  # Root Layout
│   │   ├── register/
│   │   │   └── page.tsx                # 三角色登录页
│   │   └── dashboard/
│   │       ├── layout.tsx              # Dashboard Layout (Sidebar)
│   │       ├── page.tsx                # Dashboard 主页
│   │       ├── planning/
│   │       │   └── page.tsx            # AI 升学规划（mock）
│   │       ├── credentials/
│   │       │   └── page.tsx            # 材料库（上传+区块链模拟）
│   │       └── portfolio/
│   │           └── page.tsx            # 求职档案（placeholder）
│   ├── components/
│   │   ├── ui/                         # shadcn/ui 组件
│   │   ├── app-sidebar.tsx             # 左侧导航
│   │   └── dashboard-header.tsx        # 顶部栏
│   ├── lib/
│   │   ├── utils.ts                    # cn() 工具函数
│   │   ├── auth.ts                     # localStorage Auth 工具
│   │   └── mock-data.ts               # Mock 数据（schools, credentials, AI output）
│   └── hooks/
│       └── use-mobile.ts              # 移动端检测
├── supabase/
│   └── migrations/
│       └── 001_init_schema.sql        # 数据库 Schema（供后续接入）
├── vercel.json
├── next.config.ts                     # output: "export"
└── package.json
```

## 演示功能

| 功能 | 说明 |
|------|------|
| 三角色登录 | 选角色 + 输入邮箱即可进入（localStorage） |
| AI 升学规划 | 点击按钮生成 mock 规划结果 |
| 材料上传认证 | 模拟文件哈希计算 + 区块链锚定 |
| 求职档案 | Placeholder，即将上线 |

## 部署

Vercel 自动检测 Next.js 静态导出，**无需配置任何环境变量**。

```bash
# 直接推送到 GitHub，Vercel 自动部署
git push origin main
```

## 角色说明

- **Student**: 学生，可使用 AI 规划和材料上传
- **Parent**: 家长，通过邀请码绑定学生
- **Counselor**: 升学顾问，需机构码 `BOLE2026`

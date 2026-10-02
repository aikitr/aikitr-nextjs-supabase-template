# Aikitr Next.js + Supabase 模板

一个可复用的全栈应用起步模板，提供邮箱密码认证、受保护的示例仪表盘，以及带 Row Level Security（RLS）的待办事项表。

## 技术栈

- Next.js 16.3.8 App Router、React 19、TypeScript 严格模式
- Tailwind CSS 与 shadcn/ui
- Supabase Auth、Postgres、`@supabase/ssr`
- pnpm、ESLint、Prettier、Vitest

## 开始使用

### 环境要求

- Node.js 22.18 或更高版本（Cloudflare `cf` CLI 要求）；CI 使用 Node.js 24
- pnpm 12.7.0（仓库已通过 `packageManager` 固定版本）
- 一个托管 Supabase 项目

安装依赖并创建本地环境文件：

```bash
pnpm install
cp .env.example .env.local
```

在 `.env.local` 中填写 Supabase 项目 URL、publishable key 和站点地址：

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
SITE_URL=http://localhost:3000
```

只在浏览器和服务端使用 publishable key。不要将 Supabase secret/service-role key 放进 `NEXT_PUBLIC_*` 变量或提交到仓库。

### 配置 Supabase Auth

在 Supabase Dashboard 的 **Authentication → URL Configuration** 中：

1. 将 **Site URL** 设置为 `SITE_URL` 对应的站点地址。
2. 在允许的 Redirect URLs 中添加 `http://localhost:3000/auth/callback`。
3. 部署后，将生产地址对应的 `/auth/callback` 也加入允许列表，并将生产环境 `SITE_URL` 设置为 HTTPS 地址。
4. 在 **Authentication → Providers → Email** 中启用邮箱确认。托管项目通常默认要求确认邮箱。

模板支持 Supabase PKCE `code` 回跳，也支持自定义邮件模板中的 `token_hash` 回跳。邮箱确认和密码重置都需要正确配置允许的回跳地址。生产环境请配置自有 SMTP 服务。

### 应用数据库迁移

仓库中的迁移创建 `public.todos` 表，并为 select、insert、update、delete 配置用户级 RLS 策略。CLI 会把迁移应用到已关联的**托管项目**，无需启动本地 Supabase 或 Docker：

```bash
pnpm exec supabase login
pnpm exec supabase link --project-ref <你的项目引用 ID>
pnpm db:push
pnpm db:types
```

`db:push` 仅应用尚未执行的迁移。修改或新增表后，先创建新的迁移文件，再运行 `pnpm db:push` 和 `pnpm db:types`。

### 启动应用

```bash
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000)。注册邮箱、完成确认后即可登录并使用待办事项示例。

## 部署到 Cloudflare Workers

项目通过 Cloudflare Workers 和 `vinext` 运行 Next.js App Router。`vinext` 目前仍处于 beta；部署前可运行 `pnpm dlx vinext check` 查看项目使用的 Next.js 功能兼容状态。

首次部署时，确保 `.env.local` 中的 Supabase URL 和 publishable key 已填写；用 Cloudflare workers.dev 地址覆盖部署命令中的 `SITE_URL`：

```bash
pnpm exec cf auth login
SITE_URL=https://aikitr-nextjs-supabase-template.<账户子域>.workers.dev pnpm deploy:vinext
```

Worker 名称固定为 `aikitr-nextjs-supabase-template`，默认地址为 `https://aikitr-nextjs-supabase-template.<账户子域>.workers.dev`。部署后将实际地址设为 Supabase Auth 的 **Site URL**，并把 `https://aikitr-nextjs-supabase-template.<账户子域>.workers.dev/auth/callback` 添加到 **Redirect URLs**。本地开发的 `http://localhost:3000/auth/callback` 继续保留。

要启用推送自动部署，在 Cloudflare Dashboard 的 **Workers & Pages → aikitr-nextjs-supabase-template → Settings → Builds → Connect** 中连接此 GitHub 仓库，选择 `main` 作为生产分支。Build command 设为 `pnpm build:vinext`，Deploy command 设为 `pnpm deploy:vinext --skip-build`。Workers Builds 默认使用 Node.js 24；项目需要 Node.js 22.18 或更高版本。

在 Workers Builds 的构建变量中设置 `NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 和 `SITE_URL`；部署脚本会校验这三个值，Cloudflare 配置会将它们写入 Worker 运行时环境。不要配置 Supabase secret/service-role key。连接后每次推送 `main` 都会构建并部署。

Workers Builds 需要先在 Cloudflare Dashboard 安装并授权 Cloudflare GitHub App。该配置由 Cloudflare 保存，仓库里不包含 Cloudflare API token 或 Supabase 项目密钥。

## 页面与认证流程

- `/`：模板介绍页
- `/sign-up`：邮箱密码注册和确认邮件提示
- `/login`：登录；受保护路由会在登录后返回原页面
- `/forgot-password`：申请密码重置邮件
- `/auth/callback`：验证 Supabase 回跳并写入会话 Cookie
- `/update-password`：设置新密码，只允许有效的重置会话访问
- `/dashboard`：受保护仪表盘，可新增、完成和删除个人待办事项

服务器端使用 `auth.getClaims()` 验证用户。Server Actions 会再次检查用户身份，数据库还通过 RLS 限制数据归属；`proxy.ts` 负责刷新会话 Cookie，不能替代页面、Server Action 或 RLS 的授权检查。

## 常用命令

| 命令                 | 用途                                           |
| -------------------- | ---------------------------------------------- |
| `pnpm dev`           | 启动开发服务器                                 |
| `pnpm build`         | 创建生产构建                                   |
| `pnpm start`         | 启动生产服务器                                 |
| `pnpm lint`          | 运行 ESLint                                    |
| `pnpm typecheck`     | 检查 TypeScript 类型                           |
| `pnpm test`          | 运行单元测试                                   |
| `pnpm format`        | 格式化受支持的文件                             |
| `pnpm format:check`  | 检查格式                                       |
| `pnpm db:push`       | 将待应用的迁移推送到已关联的托管 Supabase 项目 |
| `pnpm db:types`      | 根据已关联项目生成数据库类型                   |
| `pnpm build:vinext`  | 构建 Cloudflare Workers 部署产物               |
| `pnpm deploy:vinext` | 构建并部署到 Cloudflare Workers                |

## 安全说明

- `public.todos` 开启 RLS；策略按 `auth.uid() = user_id` 限制用户只能访问自己的记录。
- 页面和 Server Actions 使用可公开的 publishable key，并各自执行身份检查；业务授权由数据库 RLS 再次保护。
- 认证回跳只接受站内路径。重置邮件响应不泄露邮箱是否已注册。
- **安全更新：**模板精确固定 Next.js 与 `eslint-config-next` 16.3.8，包含 Next.js 官方 2026 年 9 月安全修复。请持续关注官方公告，并及时升级后续修复版本：[September 2026 Security Release](https://nextjs.org/blog/september-2026-security-release)。

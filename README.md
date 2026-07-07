# Build a Hooper

**在线体验：** [https://buildahooper.org](https://buildahooper.org)

Build a Hooper 是一款非官方浏览器篮球模拟游戏的内容入口站。玩家可以转出传奇与现役球队属性、打造自定义球员，并在 82 场赛季里冲击总冠军。本站提供中英文介绍、玩法说明、赛季攻略，并内嵌游戏 iframe 直接开玩。

> 本站与 NBA 或任何官方球队品牌无隶属或授权关系。

## 站点

| 地址                                               | 说明         |
| -------------------------------------------------- | ------------ |
| [buildahooper.org](https://buildahooper.org)       | 主站（英文） |
| [buildahooper.org/zh](https://buildahooper.org/zh) | 中文版       |

## 本地开发

基于 [ShipAny](https://shipany.ai)（TanStack Start + React 19 + Drizzle ORM）构建。

```bash
pnpm install
cp .env.example .env.development   # 填写 AUTH_SECRET 等配置
pnpm db:push
pnpm rbac:init --admin-email=admin@example.com --admin-password=your-password
pnpm dev
```

开发服务器默认运行在 `http://localhost:3000`。

## 常用命令

| 命令               | 说明                        |
| ------------------ | --------------------------- |
| `pnpm dev`         | 启动开发服务器（端口 3000） |
| `pnpm build`       | 生产构建                    |
| `pnpm start`       | 运行生产服务器              |
| `pnpm cf:build`    | Cloudflare Workers 构建     |
| `pnpm cf:deploy`   | 部署到 Cloudflare           |
| `pnpm db:push`     | 同步数据库 schema（开发）   |
| `pnpm db:generate` | 生成迁移 SQL（生产）        |
| `pnpm db:migrate`  | 执行迁移（生产）            |

## 项目结构

```
src/
├── blocks/         # 落地页区块（hero、features、guide、faq 等）
├── components/     # 可复用 UI 组件
├── content/pages/  # MDX 静态页面（隐私政策等）
├── messages/       # 中英文翻译源文件
└── routes/         # 页面与 API 路由
```

## 环境变量

```env
VITE_APP_URL=https://buildahooper.org
VITE_APP_NAME=Build a Hooper
DATABASE_PROVIDER=sqlite
DATABASE_URL=file:data/local.db
AUTH_SECRET=generate-with-openssl-rand-base64-32
```

本地开发使用 `.env.development`（已 gitignore）。完整变量说明见 `.env.example`。

## License

Proprietary. See [LICENSE](./LICENSE).

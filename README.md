# BeeScene

AI × Vehicle scenario explorer with 100 research-defined candidates, Chinese/English switching, need and capability filters, an opportunity map, HAI interaction designs, and three investment decision case studies.

Website: https://kartoffelyang.github.io/BeeScene/

## Run locally

```sh
npm ci
npm run dev -- --port 5178
```

Open http://127.0.0.1:5178/.

## Build and validate

```sh
node tests/top100.mjs
node tests/hai.mjs
node tests/decision-evidence.mjs
node tests/i18n.mjs
npm run build
```

## Deployment

Pushes to `main` run validation, build the site for `/BeeScene/`, and publish to GitHub Pages using `.github/workflows/pages.yml`. For a local Pages-path build, run `GITHUB_PAGES=true npm run build`.

## Research boundaries

Rankings and research horizons express research judgments. User value, implementation feasibility and commercial outcomes remain unvalidated. AI-generated scene images illustrate concepts and do not establish implementation or validation evidence. HAI flows are reference designs, not a connected runtime executor.

The active scenario data is `src/top100.js`. Scenario IDs stay stable across filtering and language changes. Bulk TOP100 export controls have been removed; single-scenario and decision/evidence backup exports remain available.

Language preference, research shortlist and investment decision-card evidence remain browser-local. Personal scenario versions and their market records are saved to the authenticated backend database. User-entered records are not uploaded to GitHub.

## 账户与个人场景后台

Node.js 24 + 内置 SQLite。公共TOP100不因个人修改改变：注册用户只读写自己的自定义场景/个人副本，管理员可查看所有用户场景（不修改他人场景）。用户数据只从登录后的API返回，不写入静态构建、GitHub或前端本地缓存。会话使用HttpOnly Cookie；密码scrypt存储；保存带版本检查，防止覆盖更新。

本地启动：

```sh
cp .env.example .env.local
# 填写 ADMIN_PASSWORD，勿提交 .env.local
npm run api
npm run dev -- --port 5178
```

管理员用户名为 `admin`；ADMIN_PASSWORD只用于首次建库初始化，之后改环境变量不会重置已有密码。普通用户在“我的场景 / 登录”注册。尚未包含邮件验证和自助密码找回。

GPT生成需要后端配置 `OPENAI_API_KEY`、`OPENAI_MODEL`，使用Responses API与严格JSON Schema；先生成可修改草稿，经保存后才持久化。品牌来源不由模型生成。接口每用户每小时最多10次；未配置时可手工编辑。仅验证过模拟API响应，实际模型可用性需配置后实测。

市场证据在 `src/marketEvidence.json`，注明来源、匹配范围、车型/市场条件；未核实不代表不存在。历史年款资料不保证2026现款或所有地区可用。人工修改会保存在个人版本里，标记人工记录；不会自动成为公共库研究结论。

## www.beeeval.com/scene 部署

GitHub Pages仅能提供静态公共浏览，注册/保存需同域后台。服务器需Node24；API监听127.0.0.1:5180。使用 `SITE_BASE_PATH=/scene/ npm run build`；将dist发布到`/var/www/beescene`，server发布到`/opt/beescene/server`；数据库必须置于静态目录之外，生产建议`DATABASE_PATH=/var/lib/beescene/beescene.sqlite`。

`deploy/nginx-scene.conf`合并到现有HTTPS虚拟主机；`deploy/beescene.service`为服务模板。环境文件`/etc/beescene.env`由beescene用户可读，权限0600，配置`COOKIE_SECURE=true`。部署前核对Node可执行路径，运行`nginx -t`，备份数据库后再变更。

验证：`npm run test:backend`覆盖账户隔离、管理员查询、越权写入、来源校验、重复个人版本、版本冲突、重启保存、退出会话及生成结果校验。

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
npm run test:industry
npm run test:backend
npm run build
```

## Deployment

Pushes to `main` run validation, build the site for `/BeeScene/`, and publish to GitHub Pages using `.github/workflows/pages.yml`. For a local Pages-path build, run `GITHUB_PAGES=true npm run build`.

## Research boundaries

Rankings and research horizons express research judgments. User value, implementation feasibility and commercial outcomes remain unvalidated. AI-generated scene images illustrate concepts and do not establish implementation or validation evidence. HAI flows are reference designs, not a connected runtime executor.

The active scenario data is `src/top100.js`. Scenario IDs stay stable across filtering and language changes. Bulk TOP100 export controls have been removed; single-scenario and decision/evidence backup exports remain available.

Language preference, research shortlist and investment decision-card evidence remain browser-local. Custom personal scenarios and their market records are saved to the authenticated backend database. User-entered records are not uploaded to GitHub.

## 账户与个人场景后台

Node.js 24 + 内置 SQLite。公共TOP100不因个人修改改变：注册用户可单独新增并编辑自己的自定义场景；现有公共场景不可修改或创建个人副本，已有历史副本只读，管理员可查看所有用户场景（不修改他人场景）。用户数据只从登录后的API返回，不写入静态构建、GitHub或前端本地缓存。会话使用HttpOnly Cookie；密码scrypt存储；保存带版本检查，防止覆盖更新。

本地启动：

```sh
cp .env.example .env.local
# 填写 ADMIN_PASSWORD，勿提交 .env.local
npm run api
npm run dev -- --port 5178
```

管理员用户名为 `admin`；ADMIN_PASSWORD只用于首次建库初始化，之后改环境变量不会重置已有密码。普通用户在“新增场景 / 我的场景”注册。尚未包含邮件验证和自助密码找回。

GPT生成需要后端配置 `OPENAI_API_KEY`、`OPENAI_MODEL`，使用Responses API与严格JSON Schema；先生成可修改草稿，经保存后才持久化。品牌来源不由模型生成。接口每用户每小时最多10次；未配置时可手工编辑。仅验证过模拟API响应，实际模型可用性需配置后实测。

行业应用现状的车型证据在 `src/marketEvidence.json`，注明来源、匹配范围、车型/市场条件；未核实不代表不存在。历史年款资料不保证2026现款或所有地区可用。人工记录会保存在自定义场景里，标记人工记录；不会自动成为公共库研究结论。

## www.beeeval.com/scene 部署

GitHub Pages仅能提供静态公共浏览，注册/保存需同域后台。服务器需Node24；API监听127.0.0.1:5180。使用 `SITE_BASE_PATH=/scene/ npm run build`；将dist发布到`/var/www/beescene`，server发布到`/opt/beescene/server`；数据库必须置于静态目录之外，生产建议`DATABASE_PATH=/var/lib/beescene/beescene.sqlite`。

`deploy/nginx-scene.conf`合并到现有HTTPS虚拟主机；`deploy/beescene.service`为服务模板。环境文件`/etc/beescene.env`由beescene用户可读，权限0600，配置`COOKIE_SECURE=true`。部署前核对Node可执行路径，运行`nginx -t`，备份数据库后再变更。

验证：`npm run test:backend`覆盖账户隔离、管理员查询、越权写入、来源校验、公共场景副本禁止写入、版本冲突、重启保存、退出会话及生成结果校验。

## 行业应用现状（2026-10-07）

首页每个场景仅显示中国与海外的定性结论，点击后查看车型、功能、来源与适用边界。“行业全景”按中国23个、海外19个区域OEM体系梳理代表车型或平台（跨区域体系不是独立集团数量）。资料位于 `src/industryCoverage.json`。

基本语音与联网服务覆盖广泛，大模型对话已扩展至多家传统OEM；相关能力不能直接证明完整AI场景已量产。判定区分基础功能已普及、多品牌应用、少量应用、相关功能已应用、发布/推送中及尚未发现应用。多品牌仅指核查资料中至少3个不同OEM体系存在核心相关实现，不代表统计渗透率。尚未发现证据不代表市场没有。未做销量加权或全量年款配置普查；资料中的地区、历史年款、订阅、硬件、语言及OTA限制必须保留。

本次共86条场景匹配证据覆盖48个公共场景，其余场景保留证据不足的状态。42个区域体系清单用于梳理行业总体基础能力，不能推断每一家已实现全部100个场景。

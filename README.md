# BeeScene

AI × Vehicle scenario explorer with the original TOP100 and additional patent-inspired candidates, Chinese/English switching, need and capability filters, an opportunity map, HAI interaction designs, and three investment decision case studies.

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
node tests/patents.mjs
npm run test:industry
npm run test:backend
npm run build
```

## Deployment

Pushes to `main` run validation, build the site for `/BeeScene/`, and publish to GitHub Pages using `.github/workflows/pages.yml`. For a local Pages-path build, run `GITHUB_PAGES=true npm run build`.

## Research boundaries

Rankings and research horizons express research judgments. User value, implementation feasibility and commercial outcomes remain unvalidated. AI-generated scene images illustrate concepts and do not establish implementation or validation evidence. HAI flows are reference designs, not a connected runtime executor.

The full public library is `src/scenarios.js`, combining the original `src/top100.js` and expandable `src/patentScenes.json`. Scenario IDs stay stable across filtering and language changes. Bulk TOP100 export controls have been removed; single-scenario and decision/evidence backup exports remain available.

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

## 逐场景行业应用现状（2026-10-07）

每个场景单独核查中国、海外的应用OEM与车型。首页显示两地定性阶段和已核实OEM下限；点击后显示计数对象、OEM名单、车型、功能、来源和限制。已移除重复的行业总表入口；`src/industryCoverage.json`仅保留为背景研究资料，不加载到网站。

按集团去重：1—2家起步应用，3—4家逐步扩散，5家及以上开始普及。数量是已找到官方证据的下限，不是市场总量、销量或装车率。完整匹配和部分核心实现分别列出；只有聊天、一般导航等相关能力以及试点、原型、官方发布均不计入已应用OEM数。各场景注明具体计数对象，基础实现扩散不能证明完整AI场景普及。地区、历史年款、配置、联网、订阅及OTA条件必须保留。

目前150条匹配证据涉及50个场景；其余50个保留未发现证据状态，不能判定市场零应用。自主补能明确区分蔚来的监督式辅助泊入/自动换电、现代示范项目、大众机器人原型和Tesla预约充电。休息、露营、守护、宠物、遥控泊车及出发准备等按场景补查，所有100个场景分别计算两地状态。

## 专利与场景领域（2026-10-07）

公共库现为108项：原始TOP100保持编号与排序，8项专利启发候选使用PAT编号，不参与TOP排名。以后按新增数据继续扩展，首页和筛选没有100项上限。19件相关专利记录在`src/patentEvidence.json`，按摘要及相关权利要求对应场景；首页“相关专利”打开申请人、申请/公开日期、方案概括、匹配边界及公开文本入口。14件来自报告线索，5件来自额外行业检索（包括Stellantis与Ford）。不包含附件全文或专利全文转载。

申请公开文本与授权公告文本分开显示；公开日期按照专利检索页核对，未沿用报告中混为公开日的申请月份。法律有效性、权利覆盖和实施自由未作判定。专利不计入行业量产应用OEM数。新增候选的车型应用未完成核查，明确标为“应用待核查”，不解释为市场零应用。

第四个筛选维度为座舱场景/舱驾融合场景，每项有分类依据。需要驾驶状态、底盘能力或专用车辆移动系统协同完成目标时列为融合；仅读取位置、路线背景或停驻条件不自动列为融合。当前为96项座舱、12项融合，属于对当前场景定义的分析。个人场景支持同一维度，GPT草稿要求中英文分类依据；旧私人记录缺失字段时暂列座舱并标记依据待明确。保存延续用户隔离、管理员可见、公共场景不可编辑的规则。

`tests/patents.mjs`验证扩展数量、关联完整性、双语及HAI、领域分析、原始TOP100保持不变和专利不产生量产应用计数；后台测试验证领域字段持久化与模型请求约束。

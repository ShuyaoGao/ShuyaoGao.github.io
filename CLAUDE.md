# 总导览站：给编程 agent 的说明

这个仓库是 `https://shuyaogao.github.io/` 的源码：一个总入口，把 ShuyaoGao 账号下所有能在浏览器里直接体验的 AI 教学演示，按**主题**和**课程**组织成多个导览。

读者是两类人：上课的学生，和听 AI 课的企业管理者。他们多数不写代码，打开链接就想直接点进去玩。

## 现状

- 已有：`catalog.js`（全部项目、主题、课程的数据，**唯一的数据来源**）、本文件、`README.md`。
- 还没有：页面本身。你的任务是把它做出来。

## 要做的页面

一个单页应用，`index.html` + `app.js` + `style.css`，用地址里的 `#` 切换视图：

| 地址 | 显示什么 |
|---|---|
| `#/`（首页） | 顶部一句话介绍 + 搜索框；下面是各个主题导览，每个主题一行标题 + 一句说明 + 一排项目卡片；再往下是"课程导览"入口列表；最下面一栏"研究"（可折叠） |
| `#/track/<id>` | 单个主题导览：标题、说明、这个主题下的全部卡片 |
| `#/course/<id>` | 单个课程导览：课程名、适合谁、建议用时；项目按课堂顺序编号排列，每个项目旁边写"这一步讲什么"（数据里的 `note`） |

上课时老师会直接发 `#/course/<id>` 的链接给学生，所以课程页要能单独看懂，不依赖首页。

### 项目卡片

- 封面图、标题、一句话简介、标签
- 两个按钮：**「打开体验」**（`url`）和**「看代码」**（`https://github.com/<repo>`）
- `status: "building"` 的卡片：灰色，按钮换成"即将上线"，不可点
- `status: "hidden"` 的项目不显示

### 封面图

每个演示仓库的 `docs/img/` 下都有截图。为每个项目挑一张横版截图，缩到宽 640px 左右，压成 webp 或 jpg，存到本仓库 `img/<项目 id>.webp`，在 `catalog.js` 的 `cover` 字段写路径。**不要直接外链别的仓库的图片**（别的仓库改名或删图会导致这里坏掉）。没有图的先用一个纯色块 + 项目首字代替。

## 技术要求（和其他演示仓库保持一致）

- 纯手写 HTML / CSS / JavaScript，**不依赖任何库，不需要构建步骤**，不联网也能打开（除了点出去的链接）。
- 数据用 `catalog.js`（`window.CATALOG = {...}`）而不是 `.json`：这样双击 `index.html` 用 `file://` 打开也能读到数据（`fetch` 本地 json 在 `file://` 下会失败）。
- 手机竖屏优先：卡片在手机上一列、平板两列、电脑三到四列；所有可点区域不小于 44px；页面不能横向滚动。
- 跟随系统深浅色。界面全部中文。
- 根目录放 `.nojekyll`（GitHub Pages 不要用 Jekyll 处理）。
- 页脚：`Shuyao Gao · aSSIST University (Seoul School of Integrated Sciences and Technologies) · 서울과학종합대학원대학교`，以及"代码 MIT · 文档与教学素材 CC BY 4.0"（和其他演示仓库一样）。

## 数据规则（catalog.js）

- **只收公开仓库。** 私有仓库（个人内部项目、未发表的研究）一律不写进来。加新项目前先确认：`gh repo view ShuyaoGao/<repo> --json visibility`。
- 一个项目可以出现在多个课程里，但只属于一个主题（`track`）。
- 字段说明写在 `catalog.js` 顶部注释里。改页面时不要把项目信息写死在 HTML 里，一律从 `CATALOG` 读。
- 课程（`courses`）里的内容目前是**草稿**，由用户来改顺序和讲解词，不要自己发挥扩写。

## 以后加一个新演示的流程

1. 新演示在自己的仓库做好，仓库改成公开，开 GitHub Pages。
2. 在 `catalog.js` 的 `projects` 里加一条，选好 `track`，需要的话加进某个课程。
3. 放一张封面图到 `img/`。
4. 在那个演示仓库的 README 第一行加：`> [← 返回 AI 教学演示总导览](https://shuyaogao.github.io/)`。

## 待用户决定的事（不要自行处理）

- `text2world` 和 `text-to-3d-world` 内容重复，目前只收了已有网页的 `text-to-3d-world`，`text2world` 标为 `hidden`。
- `ai-business-blueprint` 还是私有仓库、尚未开发，标为 `building`；等它公开并上线后改成 `online`，填上 `url`。
- "研究"一栏要不要显示，由用户决定；目前默认折叠显示。

## 上线

本仓库目前是私有的。免费账号的私有仓库开不了 GitHub Pages，**需要用户自己在 GitHub 网页上把仓库改成公开**，然后 Settings → Pages → Source 选 `main` 分支根目录。agent 不要去改仓库的公开/私有设置。

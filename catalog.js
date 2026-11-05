/*
 * 总导览站的唯一数据来源。页面一律从 window.CATALOG 读取，不要把项目写死在 HTML 里。
 *
 * tracks   主题导览：{ id, title, intro }，按数组顺序在首页显示
 * projects 项目：
 *   id       仓库名
 *   repo     "ShuyaoGao/<仓库名>"
 *   title    卡片标题（短）
 *   summary  一句话简介
 *   url      在线体验地址（GitHub Pages）；building 状态可为空
 *   track    所属主题 id（只能一个）
 *   tags     标签，用于搜索和筛选
 *   cover    封面图路径，如 "img/snake-dqn-brain.webp"；暂缺为 null
 *   status   "online" 已上线 | "building" 开发中（灰色显示）| "hidden" 不显示
 * courses  课程导览（草稿，由用户修改）：
 *   { id, title, audience, duration, intro, steps: [{ project, note }] }
 *   steps 按课堂顺序排列；note 写"这一步讲什么"
 * research 研究栏：公开的论文复现仓库，首页最下方折叠显示
 */
window.CATALOG = {
  site: {
    title: "AI 教学演示",
    intro: "每个演示都能在浏览器里直接打开，手机电脑都能用，不用安装。"
  },

  tracks: [
    { id: "thinking-tools", title: "思维与建模工具", intro: "把想法、业务和系统画出来：思维导图、业务拆解、系统动力学。" },
    { id: "rl-games", title: "强化学习与游戏 AI", intro: "看 AI 怎么在游戏里学会做决策，神经网络每一层在想什么。" },
    { id: "card-engines", title: "卡牌规则引擎", intro: "把一种牌的规则写成程序，AI 每一步都告诉你它依据的是哪条规则。" },
    { id: "see-ml", title: "看懂机器学习", intro: "视觉、语音、回归：把一个模型从输入到输出一步步摊开。" },
    { id: "gen-agents", title: "生成与 Agent", intro: "大模型、Agent 流水线和生成式应用是怎么拼起来的。" }
  ],

  projects: [
    // ---- 思维与建模工具
    { id: "markdown-mindmap", repo: "ShuyaoGao/markdown-mindmap", title: "键盘思维导图",
      summary: "回车 / Tab 快速建节点，Markdown 与图实时互转，支持 JSON / OPML / FreeMind 导入导出。",
      url: "https://shuyaogao.github.io/markdown-mindmap/", track: "thinking-tools",
      tags: ["思维导图", "Markdown"], cover: "img/markdown-mindmap.webp", status: "online" },
    { id: "ai-business-blueprint", repo: "ShuyaoGao/ai-business-blueprint", title: "AI 业务拆解画板",
      summary: "把业务拆成相互连接的小方框，标出每块用什么 AI / 机器学习、哪些数据要本地存储。",
      url: "", track: "thinking-tools",
      tags: ["业务拆解", "企业管理者"], cover: null, status: "building" },
    { id: "system-dynamics-lab", repo: "ShuyaoGao/system-dynamics-lab", title: "系统动力学建模台",
      summary: "画因果回路图看信号转圈，搭存量流量图、写方程、拖滑块实时仿真；内置 25 个经典模型。",
      url: "https://shuyaogao.github.io/system-dynamics-lab/", track: "thinking-tools",
      tags: ["系统动力学", "仿真"], cover: "img/system-dynamics-lab.webp", status: "online" },

    // ---- 强化学习与游戏 AI
    { id: "snake-dqn-brain", repo: "ShuyaoGao/snake-dqn-brain", title: "贪吃蛇 · 看懂 AI 的大脑",
      summary: "4 个可切换的神经网络（PPO 卷积网、全连接网、Double DQN）在浏览器里实时展示每一层。",
      url: "https://shuyaogao.github.io/snake-dqn-brain/", track: "rl-games",
      tags: ["强化学习", "DQN", "PPO", "可解释性"], cover: "img/snake-dqn-brain.webp", status: "online" },
    { id: "fighting-brain-lab", repo: "ShuyaoGao/fighting-brain-lab", title: "格斗大脑实验台",
      summary: "看得见神经网络的格斗游戏强化学习演示。",
      url: "https://shuyaogao.github.io/fighting-brain-lab/", track: "rl-games",
      tags: ["强化学习", "神经网络可视化"], cover: "img/fighting-brain-lab.webp", status: "online" },
    { id: "doudizhu-dmc-lab", repo: "ShuyaoGao/doudizhu-dmc-lab", title: "斗地主 · 强化学习 AI",
      summary: "三个强化学习 AI 同桌打斗地主，实时画出 Q 网络的真实激活；可观战、对战、练习。",
      url: "https://shuyaogao.github.io/doudizhu-dmc-lab/", track: "rl-games",
      tags: ["强化学习", "斗地主"], cover: "img/doudizhu-dmc-lab.webp", status: "online" },
    { id: "four-player-doudizhu-rl", repo: "ShuyaoGao/four-player-doudizhu-rl", title: "四人斗地主 · 强化学习",
      summary: "两副牌四人斗地主规则引擎，实时画出 DMC 网络给每个合法出牌打的分。",
      url: "https://shuyaogao.github.io/four-player-doudizhu-rl/", track: "rl-games",
      tags: ["强化学习", "斗地主"], cover: "img/four-player-doudizhu-rl.webp", status: "online" },
    { id: "doudizhu-endgame-solver", repo: "ShuyaoGao/doudizhu-endgame-solver", title: "斗地主残局求解器",
      summary: "明牌残局精确求解，找出只有一条活路的胜负手，画出胜率坍缩曲线。",
      url: "https://shuyaogao.github.io/doudizhu-endgame-solver/", track: "rl-games",
      tags: ["博弈树搜索", "斗地主"], cover: "img/doudizhu-endgame-solver.webp", status: "online" },
    { id: "turn-based-balance-lab", repo: "ShuyaoGao/turn-based-balance-lab", title: "回合制数值策划实验",
      summary: "蒙特卡洛、进化算法、Q 表强化学习、新角色冲击检测、抽卡经济。",
      url: "https://shuyaogao.github.io/turn-based-balance-lab/", track: "rl-games",
      tags: ["数值平衡", "蒙特卡洛", "遗传算法"], cover: "img/turn-based-balance-lab.webp", status: "online" },

    // ---- 卡牌规则引擎
    { id: "guandan-card-engine", repo: "ShuyaoGao/guandan-card-engine", title: "掼蛋规则引擎",
      summary: "级牌、逢人配、同花顺、接风、进贡还贡；AI 每一步依据的规则显示在右栏。",
      url: "https://shuyaogao.github.io/guandan-card-engine/", track: "card-engines",
      tags: ["规则引擎", "掼蛋"], cover: "img/guandan-card-engine.webp", status: "online" },
    { id: "shengji-card-engine", repo: "ShuyaoGao/shengji-card-engine", title: "升级（打百分）规则引擎",
      summary: "亮主、跟门、抓分、扣底、升级轮庄；AI 每一步依据的规则显示在右栏。",
      url: "https://shuyaogao.github.io/shengji-card-engine/", track: "card-engines",
      tags: ["规则引擎", "升级"], cover: "img/shengji-card-engine.webp", status: "online" },
    { id: "gouji-card-engine", repo: "ShuyaoGao/gouji-card-engine", title: "够级规则引擎",
      summary: "四副牌六人够级：隔位一伙、够级牌只有对头能管。",
      url: "https://shuyaogao.github.io/gouji-card-engine/", track: "card-engines",
      tags: ["规则引擎", "够级"], cover: "img/gouji-card-engine.webp", status: "online" },
    { id: "baohuang-card-engine", repo: "ShuyaoGao/baohuang-card-engine", title: "保皇规则引擎",
      summary: "四副牌五人保皇：皇帝、保子、自保、名次计分。",
      url: "https://shuyaogao.github.io/baohuang-card-engine/", track: "card-engines",
      tags: ["规则引擎", "保皇"], cover: "img/baohuang-card-engine.webp", status: "online" },

    // ---- 看懂机器学习
    { id: "handwritten-digit-lab", repo: "ShuyaoGao/handwritten-digit-lab", title: "手写数字实验台",
      summary: "手写一个数字，看卷积神经网络一层层认出它；再把它压成平面上的一个点，画回数字的影子。",
      url: "https://shuyaogao.github.io/handwritten-digit-lab/", track: "see-ml",
      tags: ["卷积神经网络", "自编码器", "MNIST"], cover: "img/handwritten-digit-lab.webp", status: "online" },
    { id: "house-price-leakage-lab", repo: "ShuyaoGao/house-price-leakage-lab", title: "房价回归与数据泄漏",
      summary: "七个回归模型对比加州房价，外加一局数据泄漏擂台。",
      url: "https://shuyaogao.github.io/house-price-leakage-lab/", track: "see-ml",
      tags: ["回归", "数据泄漏"], cover: "img/house-price-leakage-lab.webp", status: "online" },
    { id: "pronunciation-gop-lab", repo: "ShuyaoGao/pronunciation-gop-lab", title: "发音评分实验室",
      summary: "把英语发音评分拆成 5 步逐步摊开，麦克风现场测流利度和语调。",
      url: "https://shuyaogao.github.io/pronunciation-gop-lab/", track: "see-ml",
      tags: ["语音", "发音评分"], cover: "img/pronunciation-gop-lab.webp", status: "online" },
    { id: "pose-fitness-coach", repo: "ShuyaoGao/pose-fitness-coach", title: "姿态识别健身教练",
      summary: "摄像头姿态识别 + 可解释规则引擎：深蹲、开合跳实时计数与纠错。",
      url: "https://shuyaogao.github.io/pose-fitness-coach/", track: "see-ml",
      tags: ["姿态识别", "摄像头"], cover: "img/pose-fitness-coach.webp", status: "online" },

    // ---- 生成与 Agent
    { id: "fogbell-ai-trpg", repo: "ShuyaoGao/fogbell-ai-trpg", title: "AI 跑团",
      summary: "大模型只讲故事，掷骰和判定交给规则引擎：主持人 + 机器人队友 + 裁判面板。",
      url: "https://shuyaogao.github.io/fogbell-ai-trpg/", track: "gen-agents",
      tags: ["大模型", "Agent", "函数调用"], cover: "img/fogbell-ai-trpg.webp", status: "online" },
    { id: "comic-agent-pipeline", repo: "ShuyaoGao/comic-agent-pipeline", title: "漫画 Agent 流水线",
      summary: "一句创意经 9 个 Agent 流水线生成剧本、分镜、导演台与草样片。",
      url: "https://shuyaogao.github.io/comic-agent-pipeline/", track: "gen-agents",
      tags: ["多 Agent", "工作流"], cover: "img/comic-agent-pipeline.webp", status: "online" },
    { id: "text-to-3d-world", repo: "ShuyaoGao/text-to-3d-world", title: "一句话生成 3D 世界",
      summary: "一句中文描述 → 规则引擎 → 生成计划 → 3D 场景，理解过程全部可视化。",
      url: "https://shuyaogao.github.io/text-to-3d-world/", track: "gen-agents",
      tags: ["程序化生成", "three.js"], cover: "img/text-to-3d-world.webp", status: "online" },
    { id: "text2world", repo: "ShuyaoGao/text2world", title: "文字生成世界",
      summary: "与 text-to-3d-world 重复，待用户决定是否合并。",
      url: "", track: "gen-agents",
      tags: [], cover: null, status: "hidden" },
    { id: "replayable-image-editor", repo: "ShuyaoGao/replayable-image-editor", title: "可回放图像编辑器",
      summary: "每一次修图操作记成一行 JSON，按日志回放逐像素还原画面，顺手得到行为克隆训练数据。",
      url: "https://shuyaogao.github.io/replayable-image-editor/", track: "gen-agents",
      tags: ["行为克隆", "图像编辑"], cover: "img/replayable-image-editor.webp", status: "online" }
  ],

  // 课程导览：草稿，顺序和讲解词由用户修改
  courses: [
    { id: "ai-for-executives", title: "给企业管理者的 AI 课（草稿）",
      audience: "企业老板、管理层：不关心算法细节，关心业务怎么拆、哪里用 AI",
      duration: "约 2 小时",
      intro: "从看懂 AI 能做什么，到把自己的业务拆开、标出每一块该用什么。",
      steps: [
        { project: "handwritten-digit-lab", note: "AI 是怎么\"认出\"东西的：一个最直观的例子" },
        { project: "house-price-leakage-lab", note: "预测靠数据：数据用错了，模型再好也是假的" },
        { project: "fogbell-ai-trpg", note: "大模型擅长什么、不擅长什么：故事交给它，规则交给程序" },
        { project: "comic-agent-pipeline", note: "一个任务拆成多个 Agent 流水线" },
        { project: "markdown-mindmap", note: "动手：先用思维导图把自己的业务列出来" },
        { project: "ai-business-blueprint", note: "动手：把业务拆成方框，标出每块用什么 AI、数据放哪" }
      ] },
    { id: "system-thinking", title: "系统思维与系统动力学（草稿）",
      audience: "系统动力学课程的学生",
      duration: "按讲次使用",
      intro: "从画因果回路图开始，到搭存量流量模型、做政策实验。",
      steps: [
        { project: "markdown-mindmap", note: "先把问题里的要素列出来" },
        { project: "system-dynamics-lab", note: "画回路、搭模型、拖滑块看结果" }
      ] }
  ],

  // 研究：公开的论文复现仓库
  research: [
    { repo: "ShuyaoGao/occupational-micro-actions", title: "The Atomic Structure of Work",
      summary: "从 1,961 项 O*NET 工作活动拆出 15,817 个原子微动作（Gao & Huang 2026）。",
      url: "https://doi.org/10.5281/zenodo.21395793" },
    { repo: "ShuyaoGao/coord-desync-snn", title: "Coordinate-System Desynchronization in a Spiking Reservoir",
      summary: "论文复现代码与数据（Gao & Huang 2026）。",
      url: "" }
  ]
};

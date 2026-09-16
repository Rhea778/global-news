const categories = [
  { id: "all", zh: "今日精选", en: "Top stories" },
  { id: "world", zh: "国际时政", en: "World" },
  { id: "economy", zh: "经济财经", en: "Business" },
  { id: "tech", zh: "科技", en: "Technology" },
  { id: "security", zh: "冲突与安全", en: "Security" },
  { id: "science", zh: "科学健康", en: "Science" },
  { id: "culture", zh: "社会文化", en: "Culture" },
  { id: "china", zh: "中国", en: "China" }
];

// 前端原型数据：正式版由 collector/cleaner/enricher 流程生成同样结构的 JSON。
let stories = [
  {
    id: "climate-finance", category: "world", importance: 9, sourcesCount: 5,
    titleZh: "多国就新一轮气候融资框架达成原则性共识",
    titleEn: "Countries reach an initial agreement on a new climate-finance framework",
    summaryZh: "经过延长谈判，各方同意提高对发展中经济体的资金支持，并在年底前完成执行细则。",
    summaryEn: "After extended talks, negotiators agreed to increase support for developing economies and finalize implementation rules by year-end.",
    detailZh: "谈判焦点集中在资金来源、分担比例和透明度机制。与会代表表示，新的框架将优先支持减排、气候适应和灾害预警项目。由于各国财政状况不同，长期资金规模与私人资本的计入方式仍需进一步协调。",
    detailEn: "The talks focused on funding sources, burden sharing and transparency. Delegates said the framework would prioritize emissions reduction, climate adaptation and early-warning projects. The long-term funding scale and how private capital is counted still require further coordination.",
    tags: ["气候", "国际合作"], sources: ["Reuters", "AP", "BBC"]
  },
  {
    id: "trade-corridor", category: "world", importance: 8, sourcesCount: 3,
    titleZh: "两国签署边境贸易便利化协议，三个口岸将先行试点",
    titleEn: "Two countries sign a border-trade pact, with three crossings set for a pilot",
    summaryZh: "协议将统一部分电子单证和查验流程，预计试点口岸的平均通关时间将明显缩短。",
    summaryEn: "The pact standardizes selected electronic documents and inspection procedures, with faster clearance expected at the pilot crossings.",
    detailZh: "协议覆盖海关数据交换、货物风险分级和跨境支付等环节。双方将先在三个主要口岸进行为期六个月的试点，再根据企业和监管部门的反馈决定是否扩大范围。观察人士认为，协议的实际效果取决于两国信息系统能否稳定互联。",
    detailEn: "The agreement covers customs-data exchange, cargo risk classification and cross-border payments. A six-month pilot will begin at three major crossings before the scope is reviewed. Analysts say the result will depend on the reliability of the two countries’ connected information systems.",
    tags: ["贸易", "区域合作"], sources: ["AFP", "DW", "官方公报"]
  },
  {
    id: "rate-path", category: "economy", importance: 8, sourcesCount: 4,
    titleZh: "主要央行释放谨慎信号，市场重新评估降息路径",
    titleEn: "Major central banks signal caution as markets reassess the path for rate cuts",
    summaryZh: "最新政策表态强调通胀仍有黏性，投资者预计未来几个月的货币政策会更依赖数据。",
    summaryEn: "Officials stressed that inflation remains sticky, leading investors to expect more data-dependent policy decisions in the coming months.",
    detailZh: "政策制定者在公开讲话中同时关注服务价格、工资增速与就业市场。市场定价显示，投资者降低了对快速连续降息的预期，但不同经济体的增长差异意味着政策节奏不会完全同步。企业和家庭的融资成本仍将是影响需求的重要变量。",
    detailEn: "Policymakers are watching services prices, wage growth and labor-market conditions. Market pricing has reduced expectations for rapid consecutive cuts, while divergent growth means policy paths will not move in lockstep. Borrowing costs remain an important variable for demand.",
    tags: ["利率", "通胀"], sources: ["CNBC", "FT", "Bloomberg", "日经中文网"]
  },
  {
    id: "ai-safety", category: "tech", importance: 8, sourcesCount: 4,
    titleZh: "多家人工智能公司发布模型安全评估新框架",
    titleEn: "AI companies publish a new framework for model-safety evaluations",
    summaryZh: "新框架尝试统一高风险能力测试、红队记录和部署后的持续监测指标。",
    summaryEn: "The framework seeks common tests for high-risk capabilities, red-team reporting and post-deployment monitoring.",
    detailZh: "参与方表示，框架的目标不是给模型简单打分，而是让开发者能够记录测试条件、风险边界和修复过程。研究人员提醒，评估仍存在覆盖不足的问题，尤其是模型与外部工具、用户和复杂环境交互时的风险。",
    detailEn: "Participants say the framework is designed to document test conditions, risk boundaries and remediation rather than assign a single score. Researchers caution that coverage remains incomplete, especially when models interact with tools, users and complex environments.",
    tags: ["人工智能", "安全"], sources: ["TechCrunch", "The Verge", "MIT Technology Review"]
  },
  {
    id: "health-study", category: "science", importance: 7, sourcesCount: 3,
    titleZh: "大型长期研究为城市空气质量与慢性病风险提供新证据",
    titleEn: "A long-term study adds evidence linking urban air quality to chronic-disease risk",
    summaryZh: "研究团队指出，持续改善细颗粒物暴露水平可能带来可测量的公共健康收益。",
    summaryEn: "Researchers say sustained reductions in fine-particle exposure could produce measurable public-health benefits.",
    detailZh: "研究分析了多个城市的长期环境数据与健康记录，重点观察心肺系统相关疾病。作者强调，这类观察性研究能够发现关联，但不能单独证明因果关系；个人风险还会受到年龄、职业、生活方式和医疗可及性等因素影响。",
    detailEn: "The study examined long-term environmental data and health records across several cities, focusing on cardiopulmonary conditions. The authors note that observational research can identify associations but cannot prove causation on its own.",
    tags: ["公共健康", "环境"], sources: ["Nature News", "Science", "Phys.org"]
  },
  {
    id: "cultural-archive", category: "culture", importance: 6, sourcesCount: 2,
    titleZh: "多个文化机构启动数字档案共享计划",
    titleEn: "Cultural institutions launch a shared digital-archives initiative",
    summaryZh: "计划将优先整理濒危语言、地方音乐和历史影像，向公众开放部分可复用素材。",
    summaryEn: "The initiative will prioritize endangered languages, local music and historical footage, with selected materials released for public reuse.",
    detailZh: "参与机构将共同制定元数据和版权标注标准，并为社区组织提供数字化工具。项目方表示，开放并不意味着所有材料都可自由商用，具体权限仍需依据捐赠协议和文化社群的意见确定。",
    detailEn: "The institutions will develop shared metadata and rights-labeling standards while providing digitization tools to community groups. Open access does not mean every item can be used commercially; permissions will depend on agreements and community consent.",
    tags: ["文化", "数字化"], sources: ["The Guardian", "France 24"]
  }
];

const state = { category: "all", language: "zh", theme: localStorage.getItem("news-theme") || "light" };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "long", day: "numeric", weekday: "long" }).format(date);
}

function getCategory(id) { return categories.find((category) => category.id === id) || categories[0]; }

function renderCategories() {
  $("#category-tabs").innerHTML = categories.map((category) => `
    <button class="category-button ${state.category === category.id ? "is-active" : ""}" data-category="${category.id}" type="button">
      ${category.zh}
    </button>`).join("");
  $$(".category-button").forEach((button) => button.addEventListener("click", () => {
    state.category = button.dataset.category;
    $("#archive-panel").classList.add("is-hidden");
    $("#story-list").classList.remove("is-hidden");
    renderCategories(); renderStories();
  }));
}

function storyCard(story) {
  const category = getCategory(story.category);
  return `
    <article class="story-card ${story.importance >= 8 ? "is-important" : ""}" data-story-id="${story.id}" tabindex="0" role="button">
      <div class="story-meta"><span class="category-label">${category.zh}</span><span>·</span><span>重要度 ${story.importance}/10</span></div>
      <h3>${escapeHtml(story.titleZh)}</h3>
      <p class="story-en-title">${escapeHtml(story.titleEn)}</p>
      <p class="story-summary">${escapeHtml(story.summaryZh)}</p>
      <p class="story-en-summary">${escapeHtml(story.summaryEn)}</p>
      <div class="story-footer"><span>${story.sourcesCount} 家来源交叉核实</span><span class="tag">${escapeHtml(story.tags[0])}</span><span class="story-arrow">→</span></div>
    </article>`;
}

function renderStories() {
  const current = state.category === "all" ? stories : stories.filter((story) => story.category === state.category);
  const category = getCategory(state.category);
  $("#category-title").textContent = category.zh;
  $("#view-kicker").textContent = state.category === "all" ? "TODAY'S EDITION" : category.en.toUpperCase();
  $("#story-list").innerHTML = current.sort((a, b) => b.importance - a.importance).map(storyCard).join("");
  $("#empty-state").classList.toggle("is-hidden", current.length > 0);
  $$(".story-card").forEach((card) => {
    card.addEventListener("click", () => openDetail(card.dataset.storyId));
    card.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") openDetail(card.dataset.storyId); });
  });
}

function openDetail(storyId) {
  const story = stories.find((item) => item.id === storyId);
  if (!story) return;
  const category = getCategory(story.category);
  $("#detail-content").innerHTML = `
    <div class="story-meta"><span class="category-label">${category.zh}</span><span>·</span><span>${story.sourcesCount} 家来源</span><span>·</span><span>重要度 ${story.importance}/10</span></div>
    <h2 id="detail-title">${escapeHtml(story.titleZh)}</h2>
    <p class="detail-en-title">${escapeHtml(story.titleEn)}</p>
    <p class="detail-lead">${escapeHtml(story.summaryZh)}</p>
    <div class="detail-section"><h3>事件经过 / WHAT HAPPENED</h3><p>${escapeHtml(story.detailZh)}</p><p class="detail-en">${escapeHtml(story.detailEn)}</p></div>
    <div class="detail-section"><h3>标签 / TOPICS</h3><div class="source-list">${story.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div></div>
    <div class="detail-section"><h3>原文来源 / SOURCES</h3><div class="source-list">${story.sources.map((source, index) => `<a href="${escapeHtml(story.sourceUrls?.[index] || `https://www.google.com/search?q=${encodeURIComponent(source + " news")}`)}" target="_blank" rel="noreferrer">${escapeHtml(source)} ↗</a>`).join("")}</div></div>`;
  $("#detail-modal").classList.remove("is-hidden");
  document.body.classList.add("modal-open");
}

function closeModal(modal) { modal.classList.add("is-hidden"); document.body.classList.remove("modal-open"); }

function renderArchive(query = "") {
  const normalized = query.trim().toLowerCase();
  const result = stories.filter((story) => !normalized || [story.titleZh, story.titleEn, story.summaryZh, ...story.tags].join(" ").toLowerCase().includes(normalized));
  $("#archive-results").innerHTML = result.map((story) => `<div class="archive-result" data-story-id="${story.id}" role="button" tabindex="0"><div><div class="archive-result-date">2026年9月16日 · ${getCategory(story.category).zh}</div><h3>${escapeHtml(story.titleZh)}</h3></div><span class="archive-result-arrow">→</span></div>`).join("") || `<p class="empty-state">暂无匹配结果</p>`;
  $$(".archive-result").forEach((item) => item.addEventListener("click", () => openDetail(item.dataset.storyId)));
}

async function loadRemoteStories() {
  try {
    const response = await fetch(`data/stories.json?ts=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`stories.json: ${response.status}`);
    const remoteStories = await response.json();
    if (Array.isArray(remoteStories) && remoteStories.length) stories = remoteStories;
  } catch (error) {
    // 直接双击 index.html 时浏览器可能禁止读取本地 JSON，保留内置演示数据作为降级。
    console.info("Using bundled demo stories:", error.message);
  }
}

async function init() {
  await loadRemoteStories();
  document.documentElement.dataset.theme = state.theme;
  $("#today-label").textContent = formatDate();
  renderCategories(); renderStories();

  $$(".language-button").forEach((button) => button.addEventListener("click", () => {
    state.language = button.dataset.language;
    document.body.dataset.language = state.language;
    $$(".language-button").forEach((item) => item.classList.toggle("is-active", item === button));
  }));
  $("#theme-toggle").addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = state.theme;
    localStorage.setItem("news-theme", state.theme);
  });
  $("#notice-close").addEventListener("click", () => $("#demo-notice").remove());
  $("#about-toggle").addEventListener("click", () => $("#about-modal").classList.remove("is-hidden"));
  $("#about-close").addEventListener("click", () => closeModal($("#about-modal")));
  $("#detail-close").addEventListener("click", () => closeModal($("#detail-modal")));
  $$(".modal-backdrop").forEach((modal) => modal.addEventListener("click", (event) => { if (event.target === modal) closeModal(modal); }));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") $$(".modal-backdrop").forEach((modal) => closeModal(modal)); });
  $("#archive-toggle").addEventListener("click", () => { $("#story-list").classList.add("is-hidden"); $("#empty-state").classList.add("is-hidden"); $("#archive-panel").classList.remove("is-hidden"); renderArchive(); });
  $("#archive-close").addEventListener("click", () => { $("#archive-panel").classList.add("is-hidden"); $("#story-list").classList.remove("is-hidden"); renderStories(); });
  $("#archive-search").addEventListener("input", (event) => renderArchive(event.target.value));

  let installPrompt;
  window.addEventListener("beforeinstallprompt", (event) => { event.preventDefault(); installPrompt = event; $("#install-button").classList.remove("is-hidden"); });
  $("#install-button").addEventListener("click", async () => { if (!installPrompt) return; installPrompt.prompt(); await installPrompt.userChoice; installPrompt = null; $("#install-button").classList.add("is-hidden"); });
  if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}

init();

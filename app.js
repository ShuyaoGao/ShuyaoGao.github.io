/*
 * 总导览页面。所有内容都从 window.CATALOG（catalog.js）读取，这里不写死任何项目。
 *
 * 用地址里的 # 切换视图：
 *   #/              首页：介绍 + 搜索 + 各主题 + 课程导览入口 + 研究（折叠）
 *   #/track/<id>    单个主题导览
 *   #/course/<id>   单个课程导览（老师直接把这个链接发给学生，所以要能单独看懂）
 */
(function () {
  "use strict";

  var app = document.getElementById("app");
  var C = window.CATALOG;

  if (!C) {
    app.replaceChildren(el("p", { class: "notice" }, "演示列表没有加载出来：请确认 catalog.js 和 index.html 在同一个文件夹里。"));
    return;
  }

  // ---------- 数据

  var site = C.site || {};
  var SITE_TITLE = site.title || "AI 教学演示";
  var tracks = C.tracks || [];
  var courses = C.courses || [];
  var research = C.research || [];
  var projects = (C.projects || []).filter(function (p) { return p.status !== "hidden"; });

  var projectById = new Map(projects.map(function (p) { return [p.id, p]; }));
  var trackIndex = new Map(tracks.map(function (t, i) { return [t.id, i]; }));

  // 帮改 catalog.js 的人发现拼错的 id（只在浏览器控制台里提示）
  var allIds = new Set((C.projects || []).map(function (p) { return p.id; }));
  projects.forEach(function (p) {
    if (!trackIndex.has(p.track)) console.warn("catalog.js：项目 " + p.id + " 的 track「" + p.track + "」不存在");
  });
  courses.forEach(function (c) {
    (c.steps || []).forEach(function (s) {
      if (!allIds.has(s.project)) console.warn("catalog.js：课程 " + c.id + " 里的项目「" + s.project + "」不存在");
    });
  });

  function projectsOfTrack(id) {
    return projects.filter(function (p) { return p.track === id; });
  }

  function courseSteps(c) {
    return (c.steps || [])
      .map(function (s) { return { note: s.note, p: projectById.get(s.project) }; })
      .filter(function (s) { return s.p; });
  }

  function isLive(p) { return p.status === "online" && !!p.url; }

  function repoUrl(repo) { return "https://github.com/" + repo; }

  // 每个主题一个色相，用在标题小色块和缺图时的占位色块上
  function hue(trackId) {
    var i = trackIndex.has(trackId) ? trackIndex.get(trackId) : 0;
    return (210 + i * 67) % 360;
  }

  // 占位色块上的字：中文取第一个字，英文开头取前两个字母（如 "AI"）
  function initial(title) {
    var m = /^[A-Za-z0-9]+/.exec(title || "");
    return m ? m[0].slice(0, 2).toUpperCase() : Array.from(title || "?")[0];
  }

  // 搜索框的示例词：取出现次数最多的几个标签
  function topTags(n) {
    var count = new Map();
    projects.forEach(function (p) {
      (p.tags || []).forEach(function (t) { count.set(t, (count.get(t) || 0) + 1); });
    });
    return Array.from(count.entries())
      .sort(function (a, b) { return b[1] - a[1]; })
      .slice(0, n)
      .map(function (e) { return e[0]; });
  }

  // ---------- 小工具

  function el(tag, props) {
    var node = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (v == null || v === false) return;
        if (k === "class") node.className = v;
        else if (k.slice(0, 2) === "on") node.addEventListener(k.slice(2), v);
        else node.setAttribute(k, v === true ? "" : String(v));
      });
    }
    append(node, Array.prototype.slice.call(arguments, 2));
    return node;
  }

  function append(node, kids) {
    kids.forEach(function (kid) {
      if (kid == null || kid === false) return;
      if (Array.isArray(kid)) append(node, kid);
      else node.append(kid.nodeType ? kid : String(kid));
    });
  }

  function mount() {
    app.replaceChildren();
    append(app, Array.prototype.slice.call(arguments));
  }

  function setTitle(t) {
    document.title = t ? t + " · " + SITE_TITLE : SITE_TITLE;
  }

  function external(href, cls, text, label) {
    return el("a", { class: cls, href: href, target: "_blank", rel: "noopener", "aria-label": label }, text);
  }

  function backLink() {
    return el("a", { class: "back", href: "#/" },
      el("span", { "aria-hidden": "true" }, "←"), "返回总导览");
  }

  // ---------- 项目卡片

  function placeholder(p) {
    return el("span", { class: "ph", style: "--h:" + hue(p.track) }, initial(p.title));
  }

  function coverImage(p) {
    if (!p.cover) return placeholder(p);
    var img = el("img", { src: p.cover, alt: "", loading: "lazy", decoding: "async", width: 640, height: 360 });
    img.addEventListener("error", function () { img.replaceWith(placeholder(p)); }, { once: true });
    return img;
  }

  // 封面也能点（和「打开体验」是同一个链接，所以对读屏软件隐藏，避免重复）
  function cover(p, cls) {
    if (isLive(p)) {
      return el("a", { class: cls, href: p.url, target: "_blank", rel: "noopener", tabindex: "-1", "aria-hidden": "true" },
        coverImage(p));
    }
    return el("div", { class: cls, "aria-hidden": "true" }, coverImage(p), el("span", { class: "badge" }, "开发中"));
  }

  function actions(p) {
    if (!isLive(p)) {
      return el("div", { class: "actions" },
        el("span", { class: "btn btn-disabled", "aria-disabled": "true" }, "即将上线"));
    }
    return el("div", { class: "actions" },
      external(p.url, "btn btn-primary", "打开体验", "打开体验：" + p.title),
      external(repoUrl(p.repo), "btn", "看代码", "看代码：" + p.title));
  }

  function tagList(tags) {
    if (!tags || !tags.length) return null;
    return el("ul", { class: "tags", "aria-label": "标签" },
      tags.map(function (t) { return el("li", null, t); }));
  }

  function card(p, level) {
    return el("article", { class: "card" + (isLive(p) ? "" : " is-building") },
      cover(p, "card-cover"),
      el("div", { class: "card-body" },
        el("h" + level, { class: "card-title" }, p.title),
        el("p", { class: "card-summary" }, p.summary),
        tagList(p.tags)),
      actions(p));
  }

  function grid(list, level) {
    return el("div", { class: "grid" }, list.map(function (p) { return card(p, level); }));
  }

  // ---------- 首页

  var query = "";

  function renderHome() {
    setTitle("");

    var examples = topTags(2);
    var input = el("input", {
      type: "search", id: "q", class: "search-input", value: query,
      placeholder: "搜索演示" + (examples.length ? "，如：" + examples.join("、") : ""),
      autocomplete: "off", spellcheck: "false", enterkeyhint: "search"
    });
    var status = el("p", { class: "vh", role: "status", "aria-live": "polite" });
    var results = el("section", { class: "results", "aria-labelledby": "results-h", hidden: true });
    var browse = el("div", null,
      jumpNav(),
      tracks.map(trackSection),
      coursesSection(),
      researchSection());

    function clear() {
      input.value = "";
      query = "";
      apply();
      input.focus();
    }

    function apply() {
      var terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
      browse.hidden = terms.length > 0;
      results.hidden = terms.length === 0;
      if (!terms.length) { status.textContent = ""; return; }

      var hits = projects.filter(function (p) {
        var t = tracks[trackIndex.get(p.track)];
        var hay = [p.title, p.summary, p.id, (p.tags || []).join(" "), t ? t.title : ""].join(" ").toLowerCase();
        return terms.every(function (w) { return hay.indexOf(w) !== -1; });
      });

      var msg = hits.length ? "找到 " + hits.length + " 个演示" : "没有找到和「" + query.trim() + "」有关的演示";
      status.textContent = msg;
      results.replaceChildren(
        el("h2", { id: "results-h", class: "results-title" }, msg),
        hits.length
          ? grid(hits, 3)
          : el("div", { class: "empty" },
              el("p", { style: "margin:0" }, "换个词试试，或者看看下面的全部演示。"),
              el("button", { type: "button", class: "btn", onclick: clear }, "清空搜索")));
    }

    input.addEventListener("input", function () { query = input.value; apply(); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && input.value) { e.preventDefault(); clear(); }
    });

    mount(
      el("header", { class: "hero" },
        el("h1", { tabindex: "-1" }, SITE_TITLE),
        site.intro ? el("p", { class: "lead" }, site.intro) : null,
        el("p", { class: "stats" },
          [projects.length + " 个演示", tracks.length + " 个主题", courses.length ? courses.length + " 条课程导览" : null]
            .filter(Boolean).join(" · "))),
      el("form", { class: "search", role: "search", onsubmit: function (e) { e.preventDefault(); input.blur(); } },
        el("label", { for: "q", class: "vh" }, "搜索演示"),
        input,
        status),
      results,
      browse);

    apply();
  }

  function jumpTo(id) {
    var node = document.getElementById(id);
    if (!node) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    node.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    var h = node.querySelector("h2");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }

  function jumpNav() {
    var items = tracks
      .filter(function (t) { return projectsOfTrack(t.id).length; })
      .map(function (t) { return [t.title, "track-" + t.id]; });
    if (courses.length) items.push(["课程导览", "courses"]);
    return el("nav", { class: "jump", "aria-label": "跳到某个主题" },
      items.map(function (it) {
        return el("button", { type: "button", class: "chip", onclick: function () { jumpTo(it[1]); } }, it[0]);
      }));
  }

  function trackSection(t) {
    var list = projectsOfTrack(t.id);
    if (!list.length) return null;
    return el("section", { class: "section track-section", id: "track-" + t.id, "aria-labelledby": "h-" + t.id, style: "--h:" + hue(t.id) },
      el("div", { class: "section-head" },
        el("h2", { id: "h-" + t.id, class: "section-title" }, t.title),
        el("a", { class: "more", href: "#/track/" + encodeURIComponent(t.id), "aria-label": "单独打开主题：" + t.title },
          "主题页", el("span", { "aria-hidden": "true" }, "→"))),
      t.intro ? el("p", { class: "section-intro" }, t.intro) : null,
      grid(list, 3));
  }

  function metaList(rows) {
    var items = rows.filter(function (r) { return r[1]; });
    if (!items.length) return null;
    return el("dl", { class: "meta" }, items.map(function (r) {
      return el("div", null, el("dt", null, r[0]), el("dd", null, r[1]));
    }));
  }

  function coursesSection() {
    if (!courses.length) return null;
    return el("section", { class: "section", id: "courses", "aria-labelledby": "h-courses" },
      el("div", { class: "section-head" },
        el("h2", { id: "h-courses", class: "section-title" }, "课程导览")),
      el("p", { class: "section-intro" }, "按上课顺序串好的一组演示，每一步都写了要讲什么。"),
      el("div", { class: "course-grid" }, courses.map(function (c) {
        return el("article", { class: "course-card" },
          el("h3", { class: "course-title" }, el("a", { href: "#/course/" + encodeURIComponent(c.id) }, c.title)),
          c.intro ? el("p", { class: "course-intro" }, c.intro) : null,
          metaList([["适合谁", c.audience], ["建议用时", c.duration], ["演示", courseSteps(c).length + " 个"]]),
          el("span", { class: "course-go", "aria-hidden": "true" }, "进入课程 →"));
      })));
  }

  function researchSection() {
    if (!research.length) return null;
    return el("section", { class: "section", id: "research" },
      el("details", { class: "research" },
        el("summary", null,
          el("h2", { class: "section-title" }, "研究"),
          el("span", { class: "research-hint" }, research.length + " 项 · 论文复现代码与数据")),
        el("ul", { class: "research-list" }, research.map(function (r) {
          return el("li", { class: "research-item" },
            el("h3", null, r.title),
            r.summary ? el("p", null, r.summary) : null,
            el("div", { class: "actions" },
              r.url ? external(r.url, "btn", "论文页面", "论文页面：" + r.title) : null,
              external(repoUrl(r.repo), "btn", "看代码", "看代码：" + r.title)));
        }))));
  }

  // ---------- 主题页

  function renderTrack(id) {
    var t = tracks[trackIndex.get(id)];
    if (!t) return renderNotFound();
    var list = projectsOfTrack(t.id);
    setTitle(t.title);

    var others = tracks.filter(function (x) { return x.id !== t.id && projectsOfTrack(x.id).length; });

    mount(
      backLink(),
      el("header", { class: "page-head" },
        el("p", { class: "eyebrow" }, "主题导览"),
        el("h1", { tabindex: "-1" }, t.title),
        t.intro ? el("p", { class: "lead" }, t.intro) : null,
        el("p", { class: "count" }, list.length + " 个演示")),
      grid(list, 2),
      others.length
        ? el("nav", { class: "other-tracks", "aria-labelledby": "h-others" },
            el("h2", { id: "h-others" }, "其他主题"),
            el("div", { class: "jump" }, others.map(function (x) {
              return el("a", { class: "chip", href: "#/track/" + encodeURIComponent(x.id) }, x.title);
            })))
        : null);
  }

  // ---------- 课程页

  function renderCourse(id) {
    var c = courses.filter(function (x) { return x.id === id; })[0];
    if (!c) return renderNotFound();
    var steps = courseSteps(c);
    setTitle(c.title);

    mount(
      backLink(),
      el("header", { class: "page-head" },
        el("p", { class: "eyebrow" }, "课程导览"),
        el("h1", { tabindex: "-1" }, c.title),
        c.intro ? el("p", { class: "lead" }, c.intro) : null,
        metaList([["适合谁", c.audience], ["建议用时", c.duration], ["步骤", "共 " + steps.length + " 步，按顺序打开"]])),
      el("ol", { class: "steps", role: "list" }, steps.map(function (s, i) {
        var p = s.p;
        return el("li", { class: "step" + (isLive(p) ? "" : " is-building") },
          cover(p, "step-cover"),
          el("div", { class: "step-body" },
            el("h2", { class: "step-title" },
              el("span", { class: "step-num" },
                el("span", { class: "vh" }, "第 "), String(i + 1), el("span", { class: "vh" }, " 步：")),
              el("span", null, p.title)),
            s.note
              ? el("div", { class: "step-note" },
                  el("span", { class: "step-note-label" }, "这一步讲什么"),
                  el("p", null, s.note))
              : null,
            el("p", { class: "step-summary" }, p.summary),
            actions(p)));
      })),
      el("p", { class: "course-foot" }, "想看全部演示？", el("a", { href: "#/" }, "回到总导览")));
  }

  // ---------- 找不到

  function renderNotFound() {
    setTitle("没有找到这个页面");
    mount(
      el("header", { class: "page-head" },
        el("h1", { tabindex: "-1" }, "没有找到这个页面"),
        el("p", { class: "lead" }, "链接可能写错了，或者这个导览已经改名。")),
      el("a", { class: "btn btn-primary", href: "#/" }, "回到全部演示"));
  }

  // ---------- 路由

  var scrollMemo = new Map();
  var currentKey = null;

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  function route() {
    var parts;
    try {
      parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
    } catch (e) {
      parts = ["?"];
    }

    // 记住离开时的位置，从主题页、课程页返回首页时回到原处
    if (currentKey !== null) scrollMemo.set(currentKey, window.scrollY);
    var key = parts.join("/");

    if (!parts.length) renderHome();
    else if (parts[0] === "track" && parts.length === 2) renderTrack(parts[1]);
    else if (parts[0] === "course" && parts.length === 2) renderCourse(parts[1]);
    else renderNotFound();

    var firstLoad = currentKey === null;
    currentKey = key;
    window.scrollTo(0, scrollMemo.get(key) || 0);

    // 换页后把焦点移到新标题上，键盘和读屏用户从这里接着读
    if (!firstLoad) {
      var h1 = app.querySelector("h1");
      if (h1) h1.focus({ preventScroll: true });
    }
  }

  window.addEventListener("hashchange", route);
  route();
})();

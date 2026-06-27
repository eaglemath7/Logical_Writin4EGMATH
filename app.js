/* ============================================================
   배곧독수리수학 콘텐츠 메이커 — app.js
   ------------------------------------------------------------
   · 1단계: 서버 없이 브라우저 단독 동작 (GitHub Pages 배포용)
   · BYOK: Gemini(기본) / Claude / ChatGPT 탭 전환
   · 블로그 글(마크다운) + 카드뉴스(templates.js 엔진)
   · 설정·문체견본은 localStorage에 저장
   ============================================================ */
(function () {
  "use strict";

  /* ===== 모델명 ===== */
  var MODELS = {
    gemini: "gemini-2.5-flash",
    claude: "claude-sonnet-4-6",
    openai: "gpt-4o",
  };

  /* ===== 학원 기본값 ===== */
  var ACADEMY_DEFAULTS = {
    academyName: "배곧독수리수학학원",
    region: "배곧",
    brandOn: true,
    brandMain: "#003090",
    brandPoint: "#C00018",
  };

  /* ===== AI 제공사별 키 안내 ===== */
  var PROVIDERS = {
    gemini: {
      name: "Gemini",
      keyUrl: "https://aistudio.google.com/app/apikey",
      help: "Google AI Studio에 로그인 → <b>[Create API key]</b> 클릭 → 생성된 키 복사. <a href='https://aistudio.google.com/app/apikey' target='_blank' rel='noopener'>→ 발급 페이지 열기</a>",
      intro: "Gemini(구글) API 키예요. 저렴하고 빨라서 기본 글쓰기에 추천해요.",
      steps: [
        { tx: "구글 계정으로 <b>Google AI Studio</b>에 로그인해요.", shot: "<div class='mock'>Google AI Studio · 로그인</div>" },
        { tx: "<b>'Create API key(API 키 만들기)'</b> 버튼을 눌러요.", shot: "<div class='mock'>＋ Create API key</div>" },
        { tx: "만들어진 키 옆 <b>'Copy(복사)'</b>를 눌러요.", shot: "<div class='mock'>AIza… 📋 Copy</div>" },
        { tx: "이 앱으로 돌아와 키 칸에 붙여넣고 <b>[연결 테스트]</b>를 눌러요." },
      ],
      cost: "<b>비용</b> — 사용량에 따라 요금이 부과돼요. Google AI Studio에서 월 사용 한도를 설정해 두면 예상 밖 비용을 막을 수 있어요.",
    },
    claude: {
      name: "Claude",
      keyUrl: "https://console.anthropic.com/settings/keys",
      help: "Anthropic 콘솔 로그인 → <b>[Create Key]</b> → 키 복사. 키는 <code>sk-ant-…</code> 형태예요. <a href='https://console.anthropic.com/settings/keys' target='_blank' rel='noopener'>→ 발급 페이지 열기</a>",
      intro: "Claude는 <b>글 품질이 가장 좋아</b> 공들인 글에 추천해요. 비용이 높으니 특별한 글에만 쓰세요.",
      steps: [
        { tx: "<b>Anthropic 콘솔</b>에 로그인 → <b>Settings → API Keys</b>로 들어가요." },
        { tx: "<b>'Create Key'</b>를 눌러요.", shot: "<div class='mock'>＋ Create Key</div>" },
        { tx: "<code>sk-ant-…</code> 키가 나오면 <b>복사</b>해요. (한 번만 보여요)", shot: "<div class='mock'>sk-ant-api03-… 📋</div>" },
        { tx: "이 앱 키 칸에 붙여넣고 <b>[연결 테스트]</b>를 눌러요." },
      ],
      cost: "<b>비용</b> — Gemini보다 단가가 높아요. 평소엔 Gemini, 공들일 글에만 Claude를 쓰는 걸 권해요. 콘솔에서 '월 사용 한도'를 꼭 걸어두세요.",
    },
    openai: {
      name: "ChatGPT",
      keyUrl: "https://platform.openai.com/api-keys",
      help: "OpenAI 플랫폼 로그인 → <b>[Create new secret key]</b> → 키 복사. 키는 <code>sk-…</code> 형태예요. <a href='https://platform.openai.com/api-keys' target='_blank' rel='noopener'>→ 발급 페이지 열기</a>",
      intro: "ChatGPT(OpenAI) 키예요. 결제수단 등록이 필요할 수 있어요.",
      steps: [
        { tx: "<b>OpenAI 플랫폼</b>에 로그인 → <b>API keys</b>로 들어가요." },
        { tx: "<b>'Create new secret key'</b>를 눌러요.", shot: "<div class='mock'>＋ Create new secret key</div>" },
        { tx: "<code>sk-…</code> 키를 <b>복사</b>해요. (한 번만 보여요)", shot: "<div class='mock'>sk-… 📋 Copy</div>" },
        { tx: "이 앱 키 칸에 붙여넣고 <b>[연결 테스트]</b>를 눌러요." },
      ],
      cost: "<b>비용</b> — 'Billing → Usage limits'에서 월 한도를 설정해두면 안전해요.",
    },
  };

  /* ============================================================
     앱 상태
     ============================================================ */
  var state = {
    provider: "gemini",
    apiKey: "",
    source: "direct",
    photos: [],
    blog: null,
    cardData: null,
    style: null,
    settings: {},
  };

  /* ===== 도우미 ===== */
  var $ = function (s) { return document.querySelector(s); };
  function show(el) { if (el) el.classList.remove("hidden"); }
  function hide(el) { if (el) el.classList.add("hidden"); }

  function toast(msg) {
    var t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add("show"); });
    setTimeout(function () { t.classList.remove("show"); setTimeout(function () { t.remove(); }, 300); }, 2400);
  }

  function spinner(btn, on, label) {
    if (!btn) return;
    if (on) {
      btn.dataset.label = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="spin"></span>' + (label || "처리 중…");
    } else {
      btn.disabled = false;
      if (btn.dataset.label) btn.innerHTML = btn.dataset.label;
    }
  }

  function raf2() {
    return new Promise(function (r) { requestAnimationFrame(function () { requestAnimationFrame(r); }); });
  }

  function pad2num(n) { return n < 10 ? "0" + n : "" + n; }

  /* ============================================================
     설정 (localStorage)
     ============================================================ */
  var SETTINGS_KEY = "dsr_settings_v1";

  function loadSettings() {
    try {
      var saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
      return Object.assign({}, ACADEMY_DEFAULTS, saved);
    } catch (e) { return Object.assign({}, ACADEMY_DEFAULTS); }
  }

  function saveSettings(s) {
    state.settings = s;
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch (e) {}
  }

  /* ============================================================
     (A) AI 연결
     ============================================================ */
  function renderKeyHelp() {
    var p = PROVIDERS[state.provider];
    $("#keyHelp").innerHTML = "🔑 <b>" + p.name + " API 키</b> — " + p.help;
  }

  $("#aiTabs").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-ai]");
    if (!b) return;
    $("#aiTabs").querySelectorAll(".t").forEach(function (t) { t.classList.remove("on"); });
    b.classList.add("on");
    state.provider = b.dataset.ai;
    setStatus("", "");
    renderKeyHelp();
  });

  $("#apiKey").addEventListener("input", function (e) {
    state.apiKey = e.target.value.trim();
    setStatus("", "");
  });

  $("#testBtn").addEventListener("click", async function () {
    if (!state.apiKey) { setStatus("err", "키를 먼저 입력해 주세요"); return; }
    setStatus("loading", "테스트 중…");
    spinner($("#testBtn"), true, "테스트 중…");
    try {
      await callAI(state.provider, state.apiKey, "You are a connection test.", "ping", { maxTokens: 5 });
      setStatus("ok", "연결 완료! 이제 글을 만들 수 있어요 ✓");
    } catch (err) {
      setStatus("err", "실패: " + friendlyError(err));
    } finally {
      spinner($("#testBtn"), false);
    }
  });

  function setStatus(kind, text) {
    var el = $("#aiStatus");
    el.className = "status" + (kind ? " " + kind : "");
    el.textContent = text;
  }

  /* ----- 키 발급 가이드 모달 ----- */
  $("#keyGuideBtn").addEventListener("click", openKeyGuide);
  $("#closeGuide").addEventListener("click", function () { hide($("#keyGuideModal")); });
  $("#keyGuideModal").addEventListener("click", function (e) { if (e.target === this) hide(this); });

  function openKeyGuide() {
    var p = PROVIDERS[state.provider];
    $("#guideTitle").textContent = p.name + " 키 발급 — 단계별 안내";
    var html = '<div class="guide-intro">' + p.intro + "</div>";
    p.steps.forEach(function (st, i) {
      html += '<div class="guide-step"><div class="gn">' + (i + 1) + '</div><div class="gtx">' + st.tx +
        (st.shot ? '<div class="guide-shot">' + st.shot + "</div>" : "") + "</div></div>";
    });
    html += '<a class="guide-cta" href="' + p.keyUrl + '" target="_blank" rel="noopener">→ ' + p.name + " 키 발급 페이지 열기</a>";
    html += '<div class="guide-cost">' + p.cost + "</div>";
    $("#guideBody").innerHTML = html;
    show($("#keyGuideModal"));
  }

  /* ============================================================
     (B) 입력
     ============================================================ */
  $("#photos").addEventListener("change", async function (e) {
    state.photos = [];
    $("#thumbs").innerHTML = "";
    var files = Array.prototype.slice.call(e.target.files).slice(0, 4);
    for (var i = 0; i < files.length; i++) {
      var url = await fileToDataUrl(files[i]);
      state.photos.push(url);
      var img = document.createElement("img");
      img.src = url;
      $("#thumbs").appendChild(img);
    }
    if (e.target.files.length > 4) toast("참고 사진은 최대 4장까지 사용해요.");
  });

  function gatherRequest() {
    var s = state.settings;
    return {
      subject: ($("#reqSubject") ? $("#reqSubject").value.trim() : ""),
      target: ($("#reqTarget") ? $("#reqTarget").value.trim() : ""),
      purpose: ($("#reqPurpose") ? $("#reqPurpose").value.trim() : ""),
      tone: ($("#reqTone") ? $("#reqTone").value.trim() : "") || s.defaultTone || "",
      etc: ($("#reqEtc") ? $("#reqEtc").value.trim() : ""),
      region: s.region || "배곧",
      keyword: ($("#reqKeyword") ? $("#reqKeyword").value.trim() : ""),
      experience: ($("#reqExperience") ? $("#reqExperience").value.trim() : ""),
      capacity: ($("#reqCapacity") ? $("#reqCapacity").value.trim() : ""),
      deadline: ($("#reqDeadline") ? $("#reqDeadline").value.trim() : ""),
      contact: ($("#reqContact") ? $("#reqContact").value.trim() : ""),
    };
  }

  function gatherSource() {
    return {
      kind: "direct",
      topic: ($("#topic") ? $("#topic").value.trim() : ""),
      desc: ($("#desc") ? $("#desc").value.trim() : ""),
    };
  }

  function collectImages() {
    return (state.photos || []).slice(0, 4);
  }

  /* ============================================================
     (C) 블로그 글 생성
     ============================================================ */
  $("#genBtn").addEventListener("click", generateBlog);
  $("#regenBtn").addEventListener("click", generateBlog);

  async function generateBlog() {
    if (!validateBeforeGenerate()) return;
    var btn = $("#genBtn");
    spinner(btn, true, "글을 쓰는 중… (20~40초)");
    try {
      var req = gatherRequest();
      var src = gatherSource();
      var userContent = buildBlogUserPrompt(req, src);
      var raw = await callAI(state.provider, state.apiKey, BLOG_SYSTEM, userContent, { json: false, maxTokens: 8192 });
      state.blog = parseBlogResponse(raw);
      renderBlog();
      show($("#secResult"));
      show($("#secCards"));
      hide($("#cardArea"));
      state.cardData = null;
      $("#secResult").scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      toast("글 생성 실패: " + friendlyError(err));
    } finally {
      spinner(btn, false);
    }
  }

  function validateBeforeGenerate() {
    if (!state.apiKey) {
      toast("먼저 AI를 연결하고 API 키를 입력해 주세요.");
      $("#secAI").scrollIntoView({ behavior: "smooth" });
      return false;
    }
    var src = gatherSource();
    var req = gatherRequest();
    var hasSource = (src.topic || src.desc);
    if (!hasSource && !req.subject) {
      toast("주제나 과목/업종을 최소한 하나 입력해 주세요.");
      return false;
    }
    return true;
  }

  function renderBlog() {
    $("#blogOut").innerHTML = mdToHtml(state.blog.markdown);
    var box = $("#keywordBox");
    box.innerHTML = "";
    if (state.blog.main.length) box.appendChild(kwGroup("메인 키워드", state.blog.main, true));
    if (state.blog.related.length) box.appendChild(kwGroup("연관 키워드", state.blog.related, false));
    renderSeoCheck();
  }

  function renderSeoCheck() {
    var host = $("#seoCheck");
    if (!host) {
      host = document.createElement("div");
      host.id = "seoCheck";
      host.className = "seo-check";
      $("#keywordBox").insertAdjacentElement("afterend", host);
    }
    var md = (state.blog && state.blog.markdown) || "";
    var lines = md.split("\n");
    var titleLine = (lines.find(function (l) { return /^#\s+/.test(l); }) || "").replace(/^#\s+/, "").trim();
    var bodyChars = md.replace(/^#.*$/gm, "").replace(/[#*`>\-\|\s]/g, "").length;
    var subCount = lines.filter(function (l) { return /^#{2,3}\s+/.test(l); }).length;
    var req = gatherRequest();
    var kw = req.keyword || (state.blog && state.blog.main && state.blog.main[0]) || "";
    var kwCount = 0;
    if (kw) {
      try { kwCount = (md.match(new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length; } catch (e) {}
    }
    var kwFront = kw && titleLine && titleLine.indexOf(kw) !== -1 && titleLine.indexOf(kw) <= Math.max(2, Math.floor(titleLine.length / 2));
    var items = [
      { ok: !!kwFront, t: "제목 앞쪽에 핵심 키워드", v: kw ? (kwFront ? "있어요" : "앞쪽에 없어요") : "키워드 미입력" },
      { ok: bodyChars >= 1500, t: "본문 1,500자 이상", v: bodyChars.toLocaleString() + "자" },
      { ok: subCount >= 3, t: "소제목 3개 이상", v: subCount + "개" },
      { ok: kw ? (kwCount >= 3 && kwCount <= 9) : false, t: "핵심 키워드 3~5회", v: kw ? (kwCount + "회" + (kwCount >= 10 ? " (도배 주의)" : "")) : "키워드 미입력" },
    ];
    host.innerHTML =
      '<div class="seo-check-head">네이버 2026 자가 점검 <em>표시용이에요 · 글은 그대로 써도 돼요</em></div>' +
      '<ul class="seo-check-list">' +
      items.map(function (it) {
        return '<li class="' + (it.ok ? "ok" : "warn") + '"><span class="ic">' + (it.ok ? "✓" : "!") + "</span>" +
          '<span class="t">' + it.t + '</span><span class="v">' + escHtml(it.v) + "</span></li>";
      }).join("") + "</ul>";
  }

  function kwGroup(label, arr, main) {
    var g = document.createElement("div");
    g.className = "kw-group";
    g.innerHTML = '<span class="kw-label">' + label + "</span>";
    arr.forEach(function (k) {
      var c = document.createElement("span");
      c.className = "chip" + (main ? " main" : "");
      c.textContent = k;
      g.appendChild(c);
    });
    return g;
  }

  $("#copyBtn").addEventListener("click", function () {
    var text = state.blog ? state.blog.markdown : "";
    navigator.clipboard.writeText(text).then(
      function () { toast("글 전체를 복사했어요! 네이버 에디터에 붙여넣으세요."); },
      function () { toast("복사 실패. 직접 선택해 복사해 주세요."); }
    );
  });

  /* ============================================================
     (D) 카드뉴스 생성
     ============================================================ */
  $("#cardGenBtn").addEventListener("click", function () { generateCards(false); });
  $("#quickCardBtn").addEventListener("click", function () { generateCards(true); });

  async function generateCards(quick) {
    if (!state.apiKey) { toast("먼저 AI를 연결해 주세요."); $("#secAI").scrollIntoView({ behavior: "smooth" }); return; }
    if (!quick && !state.blog) { toast("먼저 블로그 글을 생성하거나 '빠르게 만들기'를 눌러요."); return; }
    if (quick) {
      var src = gatherSource(), req = gatherRequest();
      var has = src.topic || src.desc || req.subject || req.etc;
      if (!has) { toast("주제나 과목을 먼저 입력해 주세요."); $("#secInput").scrollIntoView({ behavior: "smooth" }); return; }
    }
    var btn = quick ? $("#quickCardBtn") : $("#cardGenBtn");
    spinner(btn, true, "카드뉴스 문구 만드는 중…");
    try {
      var user = buildCardUserPrompt(quick);
      var raw = await callAI(state.provider, state.apiKey, CARD_SYSTEM, user, { json: true, maxTokens: 3200 });
      var parsed = extractJson(raw);
      state.cardData = normalizeCardData(parsed);
      state.style = state.cardData.style;
      $("#autoMood").textContent = "이 글엔 '" + (CardTemplates.STYLE_LABEL[state.style] || state.style) + "' 스타일이 어울려요";
      syncStyleTabs();
      await renderCards();
      buildInstaCaption();
      show($("#cardArea"));
      $("#cardArea").scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      toast("카드뉴스 생성 실패: " + friendlyError(err));
    } finally {
      spinner(btn, false);
    }
  }

  function normalizeSlide(s) {
    s = s || {};
    var fmt = String(s.format || "text").toLowerCase();
    if (CardTemplates.FORMATS.indexOf(fmt) === -1) fmt = "text";
    return {
      format: fmt,
      heading: s.heading || "",
      body: s.body || "",
      highlight: s.highlight || "",
      items: Array.isArray(s.items) ? s.items : [],
      emphasizeIndex: typeof s.emphasizeIndex === "number" ? s.emphasizeIndex : -1,
      number: s.number || "",
      unit: s.unit || "",
      source: s.source || "",
      left: s.left || null,
      right: s.right || null,
      steps: Array.isArray(s.steps) ? s.steps : [],
      bars: Array.isArray(s.bars) ? s.bars : [],
      note: s.note || "",
      before: s.before || "",
      after: s.after || "",
      quote: s.quote || "",
      who: s.who || "",
      caption: s.caption || "",
      label: s.label || "",
      flow: Array.isArray(s.flow) ? s.flow : [],
      badge: s.badge || "",
      title: s.title || "",
      sub: s.sub || "",
      button: s.button || "",
      tel: s.tel || "",
    };
  }

  function normalizeCardData(p) {
    var style = String(p.style || "navy").toLowerCase();
    if (CardTemplates.STYLES.indexOf(style) === -1) style = "navy";
    var cover = p.cover || {};
    var slides = (p.slides || []).slice(0, 7).map(normalizeSlide);
    if (!slides.length) slides = [normalizeSlide({ format: "text", heading: cover.title || "핵심 내용" })];

    var req = gatherRequest();
    var hasCta = slides.some(function (s) { return s.format === "cta"; });
    if (!hasCta) {
      var capDl = [req.capacity, req.deadline].filter(Boolean).join(" · ");
      slides.push(normalizeSlide({
        format: "cta",
        badge: capDl || "지금 문의하세요",
        title: cover.title || (req.subject ? req.subject + " 상담" : "지금 신청하세요"),
        sub: "궁금한 점은 편하게 문의하세요",
        button: "상담 신청하기",
        tel: req.contact || "",
      }));
    }
    slides.forEach(function (s) { if (s.format === "cta") sanitizeCtaFacts(s, req); });
    return {
      style: style,
      cover: {
        badge: cover.badge || "",
        kicker: cover.kicker || "",
        title: cover.title || "",
        highlight: cover.highlight || "",
        sub: cover.sub || "",
        label: cover.label || "",
      },
      slides: slides,
    };
  }

  function sanitizeCtaFacts(s, req) {
    var stripDate = !req.deadline, stripCap = !req.capacity;
    function clean(v) {
      if (!v) return v;
      var out = String(v);
      if (stripDate) {
        out = out.replace(/\d{1,2}\s*[\/.]\s*\d{1,2}/g, "")
                 .replace(/\d{1,2}\s*월\s*\d{0,2}\s*일?/g, "")
                 .replace(/\d{1,2}\s*일\s*마감/g, "")
                 .replace(/마감일?/g, "");
      }
      if (stripCap) {
        out = out.replace(/선착순\s*\d+\s*명?/g, "선착순")
                 .replace(/\d+\s*명\s*(한정|모집|선착)?/g, "")
                 .replace(/\d+\s*자리/g, "");
      }
      return out.replace(/\(\s*\)/g, "").replace(/\s{2,}/g, " ")
                .replace(/^[\s·・,\-–]+|[\s·・,\-–]+$/g, "").trim();
    }
    if (stripDate || stripCap) {
      s.badge = clean(s.badge);
      s.sub = clean(s.sub);
      s.title = clean(s.title);
      s.button = clean(s.button);
      if (!s.badge) s.badge = "지금 문의하세요";
      if (!s.title) s.title = "지금 신청하세요";
    }
    if (!req.contact && s.tel && /\d/.test(s.tel)) s.tel = "";
  }

  $("#styleTabs").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-style]");
    if (!b || !state.cardData) return;
    state.style = b.dataset.style;
    syncStyleTabs();
    renderCards();
  });

  function syncStyleTabs() {
    $("#styleTabs").querySelectorAll(".t").forEach(function (t) {
      t.classList.toggle("on", t.dataset.style === state.style);
    });
  }

  function logoMetrics(s) {
    var base = s.logoSize === "sm" ? 56 : s.logoSize === "lg" ? 94 : 72;
    var aspect = s.logoAspect || 1;
    var wide = aspect >= 1.7;
    var square = aspect <= 1.3;
    var h = wide ? Math.round(base * 1.18) : base;
    h = Math.max(h, 50);
    var maxW = wide ? 560 : square ? 280 : 360;
    return { logoH: h, logoMaxW: maxW };
  }

  function cardOpts() {
    var s = state.settings;
    var lm = logoMetrics(s);
    var o = {
      logoDataUrl: s.logoDataUrl || "",
      academyName: s.academyName || "배곧독수리수학학원",
      logoPos: s.logoPos || "bl",
      logoH: lm.logoH,
      logoMaxW: lm.logoMaxW,
      images: collectImages(),
      subject: gatherRequest().subject || "",
      region: s.region || "배곧",
    };
    if (s.brandOn !== false && s.brandMain) {
      o.brandMain = s.brandMain;
      if (s.brandPoint) o.brandPoint = s.brandPoint;
    }
    return o;
  }

  async function renderCards() {
    var stage = $("#cardStage");
    stage.innerHTML = "";
    var cards = CardTemplates.render(state.style, state.cardData, cardOpts());
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
    cards.forEach(function (cardEl, i) {
      var wrap = document.createElement("div");
      wrap.className = "card-wrap";
      var scaler = document.createElement("div");
      scaler.className = "card-scaler" + (CardTemplates.cardHeight(state.style) === 1350 ? " tall" : "");
      var inner = document.createElement("div");
      inner.className = "card-scale-inner";
      inner.appendChild(cardEl);
      scaler.appendChild(inner);
      var cap = document.createElement("div");
      cap.className = "card-cap";
      var nm = document.createElement("span");
      nm.className = "name";
      nm.textContent = i === 0 ? "표지" : "내용 " + i;
      var dl = document.createElement("button");
      dl.className = "btn ghost sm";
      dl.textContent = "⬇ PNG";
      dl.addEventListener("click", function () { saveCard(cardEl, i); });
      cap.appendChild(nm);
      cap.appendChild(dl);
      wrap.appendChild(scaler);
      wrap.appendChild(cap);
      stage.appendChild(wrap);
      CardTemplates.autoFit(cardEl);
    });
  }

  /* ----- 인라인 편집 ----- */
  var fitTimer = null;
  $("#cardStage").addEventListener("input", function (e) {
    var el = e.target.closest("[data-ek]");
    if (!el) return;
    var card = el.closest(".card-1080");
    if (!card) return;
    clearTimeout(fitTimer);
    fitTimer = setTimeout(function () { CardTemplates.autoFit(card); }, 220);
  });
  $("#cardStage").addEventListener("focusout", function (e) {
    var el = e.target.closest("[data-ek]");
    if (!el || !state.cardData) return;
    var key = el.getAttribute("data-ek");
    var val = el.textContent.trim();
    if (/\.who$/.test(key)) val = val.replace(/^—\s*/, "");
    if (/\.button$/.test(key)) val = val.replace(/\s*→\s*$/, "");
    setByPath(state.cardData, key, val);
    buildInstaCaption();
  });

  function setByPath(root, path, val) {
    if (!root) return;
    var parts = path.split(".");
    var target;
    if (parts[0] === "cover") { target = root.cover; parts = parts.slice(1); }
    else if (/^s\d+$/.test(parts[0])) { target = root.slides && root.slides[parseInt(parts[0].slice(1), 10)]; parts = parts.slice(1); }
    else return;
    if (!target) return;
    for (var i = 0; i < parts.length - 1; i++) {
      var p = Array.isArray(target) ? parseInt(parts[i], 10) : parts[i];
      if (target[p] == null) target[p] = /^\d+$/.test(parts[i + 1]) ? [] : {};
      target = target[p];
    }
    var last = Array.isArray(target) ? parseInt(parts[parts.length - 1], 10) : parts[parts.length - 1];
    target[last] = val;
  }

  /* ============================================================
     PNG / ZIP 저장
     ============================================================ */
  function getCaptureHost() {
    var host = document.getElementById("cn-capture-host");
    if (!host) {
      host = document.createElement("div");
      host.id = "cn-capture-host";
      host.style.cssText = "position:fixed;left:-100000px;top:0;width:1080px;height:1080px;overflow:hidden;background:#ffffff;pointer-events:none;z-index:-1;";
      document.body.appendChild(host);
    }
    return host;
  }

  async function cardToCanvas(cardEl, scaleOpt) {
    var host = getCaptureHost();
    var capH = cardEl.classList.contains("tall") ? 1350 : 1080;
    host.style.height = capH + "px";
    var clone = cardEl.cloneNode(true);
    clone.querySelectorAll("[data-fs]").forEach(function (el) { el.style.fontSize = ""; });
    clone.querySelectorAll("[contenteditable]").forEach(function (el) { el.removeAttribute("contenteditable"); });
    host.innerHTML = "";
    host.appendChild(clone);
    if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch (e) {} }
    CardTemplates.autoFit(clone);
    await raf2();
    var canvas = await html2canvas(clone, {
      width: 1080, height: capH,
      windowWidth: 1080, windowHeight: capH,
      scale: scaleOpt || 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });
    host.innerHTML = "";
    return canvas;
  }

  async function saveCard(cardEl, idx) {
    try {
      var canvas = await cardToCanvas(cardEl);
      var link = document.createElement("a");
      link.download = "카드뉴스_" + (idx === 0 ? "표지" : "내용" + idx) + ".png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      toast("이미지 저장에 실패했어요.");
    }
  }

  $("#saveAllBtn").addEventListener("click", async function () {
    var cards = $("#cardStage").querySelectorAll(".card-1080");
    if (!cards.length) return;
    spinner($("#saveAllBtn"), true, "저장 중…");
    try {
      for (var i = 0; i < cards.length; i++) {
        await saveCard(cards[i], i);
        await new Promise(function (r) { setTimeout(r, 350); });
      }
      toast("카드뉴스를 모두 저장했어요!");
    } finally {
      spinner($("#saveAllBtn"), false);
    }
  });

  $("#saveZipBtn").addEventListener("click", async function () {
    if (typeof JSZip === "undefined") { toast("ZIP 기능을 불러오지 못했어요. '전체 PNG'를 이용해 주세요."); return; }
    var cards = $("#cardStage").querySelectorAll(".card-1080");
    if (!cards.length) return;
    spinner($("#saveZipBtn"), true, "ZIP 만드는 중…");
    try {
      var zip = new JSZip();
      for (var i = 0; i < cards.length; i++) {
        var canvas = await cardToCanvas(cards[i]);
        var b64 = canvas.toDataURL("image/png").split(",")[1];
        var name = (i === 0 ? "01_표지" : pad2num(i + 1) + "_내용" + i) + ".png";
        zip.file(name, b64, { base64: true });
      }
      var blob = await zip.generateAsync({ type: "blob" });
      var link = document.createElement("a");
      link.download = "카드뉴스_전체.zip";
      link.href = URL.createObjectURL(blob);
      link.click();
      setTimeout(function () { URL.revokeObjectURL(link.href); }, 4000);
      toast("ZIP으로 모두 저장했어요!");
    } catch (err) {
      toast("ZIP 저장 실패. '전체 PNG'를 이용해 주세요.");
    } finally {
      spinner($("#saveZipBtn"), false);
    }
  });

  /* ============================================================
     인스타 캡션
     ============================================================ */
  function buildInstaCaption() {
    var cd = state.cardData;
    if (!cd) return;
    var b = state.blog, req = gatherRequest();
    var lines = [];
    var title = (b && firstHeading(b.markdown)) || cd.cover.title || "";
    if (title) lines.push(title.replace(/\n/g, " "));
    if (cd.cover.sub) lines.push(cd.cover.sub);
    var firstContent = cd.slides.filter(function (s) { return s.format !== "cta" && s.heading; })[0];
    if (firstContent && firstContent.heading) { lines.push(""); lines.push("· " + firstContent.heading); }
    var cta = cd.slides.filter(function (s) { return s.format === "cta"; })[0];
    if (cta) {
      lines.push("");
      lines.push("👉 " + (cta.title || "") + (cta.button ? " — " + cta.button : ""));
      if (cta.sub) lines.push(cta.sub);
      if (cta.tel) lines.push(cta.tel);
    }
    lines.push("");
    lines.push(buildHashtags(req, b).join(" "));
    $("#instaText").value = lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  }

  function buildHashtags(req, b) {
    var tags = [];
    function add(t) {
      t = String(t || "").replace(/[#\s·,]/g, "");
      if (t && tags.indexOf("#" + t) === -1) tags.push("#" + t);
    }
    if (req.region) { add(req.region); if (req.subject) add(req.region + req.subject); }
    if (req.subject) { add(req.subject); add(req.subject + "학원"); if (req.region) add(req.region + "학원"); }
    if (req.target) add(req.target);
    if (b && b.main) b.main.forEach(add);
    if (b && b.related) b.related.slice(0, 4).forEach(add);
    add("배곧독수리수학"); add("수학학원"); add("배곧학원");
    return tags.slice(0, 15);
  }

  function firstHeading(md) {
    var m = String(md || "").match(/^#\s*(.+)$/m);
    return m ? m[1].trim() : "";
  }

  $("#copyInstaBtn").addEventListener("click", function () {
    var text = $("#instaText").value;
    if (!text) return;
    navigator.clipboard.writeText(text).then(
      function () { toast("인스타 캡션을 복사했어요!"); },
      function () { toast("복사 실패. 직접 선택해 복사해 주세요."); }
    );
  });

  /* ============================================================
     설정 모달
     ============================================================ */
  $("#openSettings").addEventListener("click", function () { renderVoiceList(); applySettingsToUI(); show($("#settingsModal")); });
  $("#closeSettings").addEventListener("click", function () { hide($("#settingsModal")); });
  $("#settingsModal").addEventListener("click", function (e) { if (e.target === this) hide(this); });

  /* 로고 업로드 (설정 모달) */
  $("#logoFile").addEventListener("change", async function (e) {
    var f = e.target.files[0];
    if (!f) return;
    var raw = await fileToDataUrl(f);
    var p = await processLogo(raw);
    state.settings.logoDataUrl = p.dataUrl;
    state.settings.logoAspect = p.aspect;
    renderLogoPreviews();
  });

  /* 로고 업로드 (메인 화면 빠른 설정) */
  $("#logoFileMain").addEventListener("change", async function (e) {
    var f = e.target.files[0];
    if (!f) return;
    var raw = await fileToDataUrl(f);
    var p = await processLogo(raw);
    state.settings.logoDataUrl = p.dataUrl;
    state.settings.logoAspect = p.aspect;
    renderLogoPreviews();
    saveSettings(state.settings);
    if (state.cardData) renderCards();
    toast("로고를 저장했어요.");
  });

  $("#academyNameMain").addEventListener("input", function (e) {
    state.settings.academyName = e.target.value.trim();
    if ($("#academyName")) $("#academyName").value = state.settings.academyName;
    saveSettings(state.settings);
    if (state.cardData) renderCards();
  });

  $("#logoPosTabs").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-pos]");
    if (!b) return;
    this.querySelectorAll(".t").forEach(function (t) { t.classList.remove("on"); });
    b.classList.add("on");
    state.settings.logoPos = b.dataset.pos;
  });

  $("#logoSizeTabs").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-size]");
    if (!b) return;
    this.querySelectorAll(".t").forEach(function (t) { t.classList.remove("on"); });
    b.classList.add("on");
    state.settings.logoSize = b.dataset.size;
    if (state.cardData) renderCards();
  });

  /* 브랜드 색 동기화 */
  function syncBrandFromColor(which) {
    var color = $("#brand" + which).value;
    $("#brand" + which + "Hex").value = color;
    state.settings["brand" + which] = color;
    state.settings.brandOn = true;
    if ($("#brandOn")) $("#brandOn").checked = true;
    if (state.cardData) renderCards();
  }
  $("#brandMain").addEventListener("input", function () { syncBrandFromColor("Main"); });
  $("#brandPoint").addEventListener("input", function () { syncBrandFromColor("Point"); });

  function syncBrandFromHex(which) {
    var hex = $("#brand" + which + "Hex").value.trim();
    if (/^#?[0-9a-fA-F]{6}$/.test(hex)) {
      if (hex[0] !== "#") hex = "#" + hex;
      $("#brand" + which).value = hex;
      state.settings["brand" + which] = hex;
      if (state.cardData) renderCards();
    }
  }
  $("#brandMainHex").addEventListener("change", function () { syncBrandFromHex("Main"); });
  $("#brandPointHex").addEventListener("change", function () { syncBrandFromHex("Point"); });
  $("#brandOn").addEventListener("change", function (e) {
    state.settings.brandOn = e.target.checked;
    if (state.cardData) renderCards();
  });

  $("#saveSettings").addEventListener("click", function () {
    state.settings.academyName = $("#academyName").value.trim();
    state.settings.defaultTone = $("#defaultTone").value.trim();
    state.settings.region = $("#region").value.trim();
    state.settings.brandMain = $("#brandMainHex").value.trim() || $("#brandMain").value;
    state.settings.brandPoint = $("#brandPointHex").value.trim() || $("#brandPoint").value;
    state.settings.brandOn = $("#brandOn").checked;
    if ($("#academyNameMain")) $("#academyNameMain").value = state.settings.academyName;
    saveSettings(state.settings);
    hide($("#settingsModal"));
    toast("설정을 저장했어요.");
    if (state.cardData) renderCards();
  });

  function renderLogoPreviews() {
    var html = state.settings.logoDataUrl
      ? '<img src="' + state.settings.logoDataUrl + '" alt="로고">'
      : "<span>로고<br>미리보기</span>";
    var a = $("#logoPrev"), b = $("#logoPrevMain");
    if (a) a.innerHTML = html;
    if (b) b.innerHTML = html;
  }

  function applySettingsToUI() {
    var s = state.settings;
    if ($("#academyName")) $("#academyName").value = s.academyName || "";
    if ($("#academyNameMain")) $("#academyNameMain").value = s.academyName || "";
    if ($("#defaultTone")) $("#defaultTone").value = s.defaultTone || "";
    if ($("#region")) $("#region").value = s.region || "";
    if (s.brandMain) {
      if ($("#brandMain")) $("#brandMain").value = s.brandMain;
      if ($("#brandMainHex")) $("#brandMainHex").value = s.brandMain;
    }
    if (s.brandPoint) {
      if ($("#brandPoint")) $("#brandPoint").value = s.brandPoint;
      if ($("#brandPointHex")) $("#brandPointHex").value = s.brandPoint;
    }
    if ($("#brandOn")) $("#brandOn").checked = !!s.brandOn;
    $("#logoSizeTabs").querySelectorAll(".t").forEach(function (t) {
      t.classList.toggle("on", t.dataset.size === (s.logoSize || "md"));
    });
    renderLogoPreviews();
    $("#logoPosTabs").querySelectorAll(".t").forEach(function (t) {
      t.classList.toggle("on", t.dataset.pos === (s.logoPos || "bl"));
    });
  }

  /* ============================================================
     내 문체 (Voice Samples)
     ============================================================ */
  var VOICE_SYSTEM =
    "당신은 글의 '문체'만 분석하는 도우미입니다. 주어진 글을 쓴 사람의 문체 특징만 한국어로 8줄 이내로 요약하세요. " +
    "내용 요약이 아니라 '어떻게 쓰는가'(문장 길이 경향, 자주 쓰는 어미·표현·구어체, 격식 수준, 단락 구성 습관, 이모지·기호 사용, 호흡)만 적습니다. " +
    "글의 주제/정보는 절대 적지 마세요.";

  function voiceMsg(text, kind) {
    var el = $("#voiceMsg");
    if (!el) return;
    el.textContent = text || "";
    el.style.color = kind === "err" ? "var(--err)" : kind === "ok" ? "var(--ok)" : "var(--muted)";
  }

  function renderVoiceList() {
    var list = $("#voiceList");
    if (!list) return;
    list.innerHTML = "";
    var samples = state.settings.voiceSamples || [];
    samples.forEach(function (s, i) {
      var item = document.createElement("div");
      item.className = "voice-item";
      var hasSummary = s.summary && s.summary.length > 4;
      item.innerHTML =
        '<div class="vt"><b>' + escHtml(s.title || ("견본 " + (i + 1))) + " " +
        (hasSummary ? '<span class="voice-badge">문체 분석됨</span>' : '<span class="voice-badge" style="color:var(--muted);background:var(--fill-2)">분석 대기</span>') +
        '</b><div class="vc">' + escHtml((s.summary || s.text || "").slice(0, 120)) + "</div></div>" +
        '<button class="vdel" data-i="' + i + '" title="삭제">✕</button>';
      list.appendChild(item);
    });
  }

  if ($("#voiceList")) {
    $("#voiceList").addEventListener("click", function (e) {
      var b = e.target.closest(".vdel");
      if (!b) return;
      var i = parseInt(b.dataset.i, 10);
      state.settings.voiceSamples.splice(i, 1);
      saveSettings(state.settings);
      renderVoiceList();
      voiceMsg("견본을 삭제했어요.", "");
    });
  }

  async function addVoiceSample(title, text) {
    text = String(text || "").trim();
    if (text.length < 80) { voiceMsg("글이 너무 짧아요. 문단 몇 개 이상 넣어주세요.", "err"); return; }
    if ((state.settings.voiceSamples || []).length >= 3) { voiceMsg("견본은 최대 3개까지예요.", "err"); return; }
    if (!state.apiKey) { voiceMsg("문체 분석을 위해 먼저 AI를 연결해 주세요.", "err"); return; }
    voiceMsg("문체를 분석하는 중…", "");
    var summary = "";
    try {
      summary = await callAI(state.provider, state.apiKey, VOICE_SYSTEM, text.slice(0, 6000), { maxTokens: 400 });
    } catch (e) { summary = ""; }
    var sample = {
      title: title || ("견본 " + (((state.settings.voiceSamples || []).length) + 1)),
      text: text.slice(0, 6000),
      summary: (summary || "").trim(),
    };
    state.settings.voiceSamples = (state.settings.voiceSamples || []).concat([sample]);
    saveSettings(state.settings);
    renderVoiceList();
    voiceMsg(summary ? "✅ 문체 견본을 추가했어요. 이제 글이 선생님 말투로 나와요." : "견본은 저장했지만 분석에 실패했어요.", summary ? "ok" : "err");
  }

  if ($("#voicePasteAdd")) {
    $("#voicePasteAdd").addEventListener("click", async function () {
      var text = $("#voicePaste").value;
      spinner($("#voicePasteAdd"), true, "분석 중…");
      try { await addVoiceSample("붙여넣은 글", text); if ($("#voicePaste")) $("#voicePaste").value = ""; }
      finally { spinner($("#voicePasteAdd"), false); }
    });
  }

  /* ============================================================
     로고 트림 + 비율 판별
     ============================================================ */
  function processLogo(dataUrl) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        var w = img.naturalWidth, h = img.naturalHeight;
        if (!w || !h) { resolve({ dataUrl: dataUrl, aspect: 1 }); return; }
        var cv = document.createElement("canvas");
        cv.width = w; cv.height = h;
        var ctx = cv.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var out = dataUrl, tw = w, th = h;
        try {
          var d = ctx.getImageData(0, 0, w, h).data;
          var minX = w, minY = h, maxX = 0, maxY = 0, found = false;
          for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
              if (d[(y * w + x) * 4 + 3] > 12) {
                found = true;
                if (x < minX) minX = x; if (x > maxX) maxX = x;
                if (y < minY) minY = y; if (y > maxY) maxY = y;
              }
            }
          }
          if (found && maxX > minX && maxY > minY) {
            var pad = Math.round(Math.max(w, h) * 0.012);
            minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
            maxX = Math.min(w - 1, maxX + pad); maxY = Math.min(h - 1, maxY + pad);
            tw = maxX - minX + 1; th = maxY - minY + 1;
            var c2 = document.createElement("canvas");
            c2.width = tw; c2.height = th;
            c2.getContext("2d").drawImage(cv, minX, minY, tw, th, 0, 0, tw, th);
            out = c2.toDataURL("image/png");
          }
        } catch (e) {}
        resolve({ dataUrl: out, aspect: tw / th });
      };
      img.onerror = function () { resolve({ dataUrl: dataUrl, aspect: 1 }); };
      img.src = dataUrl;
    });
  }

  /* ============================================================
     AI 공통 호출 (3사 추상화)
     ============================================================ */
  async function callAI(provider, key, system, user, opts) {
    opts = opts || {};
    var maxTokens = opts.maxTokens || 4096;
    var json = !!opts.json;
    var text = typeof user === "string" ? user : user.text || "";
    var images = (typeof user === "object" && user.images) || [];

    function once() {
      if (provider === "gemini") return callGemini(key, system, text, images, json, maxTokens);
      if (provider === "claude") return callClaude(key, system, text, images, json, maxTokens);
      if (provider === "openai") return callOpenAI(key, system, text, images, json, maxTokens);
      throw new Error("알 수 없는 AI 종류");
    }

    var attempt = 0;
    while (true) {
      try {
        return await once();
      } catch (err) {
        var s = err && err.status;
        var retryable = s === 429 || (s >= 500 && s < 600);
        if (retryable && attempt < 2) {
          attempt++;
          await new Promise(function (r) { setTimeout(r, 1200 * attempt); });
          continue;
        }
        throw err;
      }
    }
  }

  async function callGemini(key, system, text, images, json, maxTokens) {
    var parts = [{ text: text }];
    images.forEach(function (d) {
      var m = parseDataUrl(d);
      if (m) parts.push({ inline_data: { mime_type: m.mime, data: m.data } });
    });
    var body = {
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: parts }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: maxTokens,
        thinkingConfig: { thinkingBudget: 0 },
      },
    };
    if (json) body.generationConfig.responseMimeType = "application/json";
    var url = "https://generativelanguage.googleapis.com/v1beta/models/" +
      MODELS.gemini + ":generateContent?key=" + encodeURIComponent(key);
    var r = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    var data = await r.json();
    if (!r.ok) throw apiError(r.status, data && data.error && data.error.message);
    var cand = data.candidates && data.candidates[0];
    var out = cand && cand.content && cand.content.parts && cand.content.parts.map(function (p) { return p.text || ""; }).join("");
    if (!out) {
      var fr = cand && cand.finishReason;
      if (fr === "MAX_TOKENS") throw new Error("글이 너무 길어 잘렸어요. 다시 시도하거나 요청을 줄여보세요.");
      if (fr === "SAFETY" || fr === "RECITATION") throw new Error("AI가 이 내용 생성을 거절했어요. 입력 자료를 조금 바꿔보세요.");
      throw new Error("응답이 비어 있어요. 다시 시도해 주세요.");
    }
    return out;
  }

  async function callClaude(key, system, text, images, json, maxTokens) {
    var content = [];
    images.forEach(function (d) {
      var m = parseDataUrl(d);
      if (m) content.push({ type: "image", source: { type: "base64", media_type: m.mime, data: m.data } });
    });
    content.push({ type: "text", text: text + (json ? "\n\n반드시 유효한 JSON 객체 하나만 출력하세요. 설명·코드블록 금지." : "") });
    var body = { model: MODELS.claude, max_tokens: maxTokens, system: system, messages: [{ role: "user", content: content }] };
    var r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify(body),
    });
    var data = await r.json();
    if (!r.ok) throw apiError(r.status, data && data.error && data.error.message);
    var out = data.content && data.content.map(function (b) { return b.text || ""; }).join("");
    if (!out) throw new Error("응답이 비어 있어요.");
    return out;
  }

  async function callOpenAI(key, system, text, images, json, maxTokens) {
    var userContent = [{ type: "text", text: text }];
    images.forEach(function (d) { userContent.push({ type: "image_url", image_url: { url: d } }); });
    var body = {
      model: MODELS.openai,
      messages: [
        { role: "system", content: system },
        { role: "user", content: images.length ? userContent : text },
      ],
      temperature: 0.7,
      max_tokens: maxTokens,
    };
    if (json) body.response_format = { type: "json_object" };
    var r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", Authorization: "Bearer " + key },
      body: JSON.stringify(body),
    });
    var data = await r.json();
    if (!r.ok) throw apiError(r.status, data && data.error && data.error.message);
    var out = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!out) throw new Error("응답이 비어 있어요.");
    return out;
  }

  function apiError(status, message) {
    var e = new Error(message || ("HTTP " + status));
    e.status = status;
    return e;
  }

  function friendlyError(err) {
    var s = err && err.status;
    var msg = (err && err.message) || "";
    if (s === 401 || s === 403) return "API 키가 올바르지 않거나 권한이 없어요. 키를 다시 복사해 붙여넣어 주세요(앞뒤 공백 주의).";
    if (s === 429) {
      if (/quota|billing|credit|insufficient/i.test(msg)) return "이 키에 결제 정보·크레딧이 없어요.";
      return "사용 한도를 초과했어요. 잠시 후 다시 시도해 주세요.";
    }
    if (s === 400) return "요청 형식 문제예요. 모델명/키를 확인해 주세요. (" + msg + ")";
    if (s >= 500) return "AI 서버가 일시적으로 불안정해요. 잠시 후 다시 시도해 주세요.";
    return msg || "알 수 없는 오류";
  }

  /* ============================================================
     프롬프트
     ============================================================ */
  var BLOG_SYSTEM =
    "당신은 배곧독수리수학학원 원장 선생님의 블로그 글쓰기를 돕는 전문가입니다. " +
    "이 학원은 경기도 시흥시 배곧신도시에 있으며, 초등~고등 수학을 가르칩니다. " +
    "원장은 연세대학교 인지심리학·뇌인지과학 석사과정이며 28년 교육 경력을 가진 수학 선생님입니다.\n\n" +

    "【2026 SEO + GEO 핵심】\n" +
    "① 네이버 SEO: AI 브리핑이 여러 글을 요약해 먼저 보여주므로, 검색 질문에 직접 답하는 글이 노출됩니다. " +
    "키워드 도배 금지. E-E-A-T(경험·전문성·신뢰)가 핵심입니다.\n" +
    "② GEO(Generative Engine Optimization): ChatGPT·Claude·Perplexity 같은 AI 검색에서 인용되려면 " +
    "'질문 → 명확한 답 → 근거' 구조로 써야 합니다. " +
    "첫 문단에 핵심 답을 바로 쓰고, 정의·단계·비교·수치로 뒷받침하면 AI가 이 글을 출처로 인용할 가능성이 높아집니다. " +
    "학원 이름·위치·전문 분야를 글 안에 자연스럽게 명시하세요.\n" +
    "③ GEO 이모지 활용: 제목(#) 앞에 주제를 상징하는 이모지 1개, 소제목(##) 앞에 내용을 나타내는 이모지 1개를 붙입니다. " +
    "이모지가 있으면 AI 검색 결과에서 시각적으로 돋보이고, 클릭률이 높아집니다. " +
    "예: 📐 수학 / 🧠 인지심리 / 📊 성적·데이터 / 🎯 목표·전략 / 📖 학습법 / 💡 팁·핵심 / ✅ 체크리스트 / 🔎 분석·진단.\n\n" +

    "【★★★ 문체 규칙 — 가장 중요, 반드시 지킬 것 ★★★】\n" +
    "이 선생님은 아래와 같은 특유의 글쓰기 스타일을 가집니다. 반드시 이 스타일을 따르세요.\n\n" +

    "① 문장 호흡: 한 문장 또는 짧은 구절이 끝나면 반드시 줄바꿈(\\n)합니다. " +
    "절대 긴 단락을 만들지 않습니다. 모바일에서 읽기 편하게, 2~3문장마다 빈 줄을 넣습니다.\n\n" +

    "② 이야기 순서: 학생과의 실제 장면·대화를 글의 앞부분에 배치합니다. " +
    "설명보다 장면이 먼저입니다. '이런 일이 있었어요'로 시작하는 구조를 선호합니다. " +
    "단, 입력에 없는 학생 실명·점수·연락처는 절대 지어내지 않습니다. 학생은 '@@이'처럼 익명으로 표현합니다.\n\n" +

    "③ 괄호 활용: 본문에서 하고 싶은 말을 다 하고, 덧붙일 내용은 (괄호 안에) 넣습니다. " +
    "이게 이 선생님 글의 개성입니다.\n\n" +

    "④ 감탄·이모티콘: '^^', '~~', '..!!', 'ᅲᅲ' 등을 자연스러운 감정의 흐름에서 씁니다. " +
    "억지로 넣지 않고, 진짜 그 순간의 감정으로 씁니다.\n\n" +

    "⑤ 솔직함: 완벽하지 않은 결과도 솔직하게 씁니다. " +
    "'전원 100점 실패'도 제목이 될 수 있는 선생님입니다. 단, 오류 원인 분석과 다음 계획을 함께 씁니다.\n\n" +

    "⑥ 인지심리학 개념: 학술 용어를 쓰지 않고 쉬운 말로 풀어 씁니다. " +
    "예: '인출연습'→'배운 걸 덮고 스스로 떠올려 보는 연습', " +
    "'간격반복'→'시간 간격을 두고 다시 꺼내 풀어보는 기억 주기', " +
    "'시험불안'→'머릿속이 하얘지는 순간'. 글 전체에서 한두 군데만 은은하게 씁니다.\n\n" +

    "⑦ CTA: 홍보는 글 맨 마지막에 딱 두 줄. 억지로 밀어붙이지 않습니다. " +
    "\"언제든 편하게 문의해 주세요 ^^\" 수준으로 끝냅니다.\n\n" +

    "⑧ 이모지 활용: 소제목(##) 앞에 내용과 어울리는 이모지를 하나씩 넣어 눈에 띄게 합니다. " +
    "예: 📌 핵심 정리, ✅ 체크리스트, 📖 개념 설명, 💡 팁·아이디어, 🧠 인지심리 포인트, " +
    "📊 성적·통계, 🎯 목표·전략, 🔎 진단·분석, 📝 학습 방법, 💬 학생 이야기, 📞 문의. " +
    "본문 중간에는 이모지를 억지로 넣지 않고, 소제목에만 자연스럽게 씁니다.\n\n" +

    "【출력 형식】\n" +
    "마크다운(# 제목, ## 소제목)으로 씁니다. " +
    "'CTA:', 'H2:', 'SEO:', '서론:', '결론:' 같은 라벨은 절대 쓰지 않습니다. " +
    "글 끝에 키워드 블록을 추가합니다:\n" +
    "===KEYWORDS===\n메인: 키워드1, 키워드2\n연관: 키워드3, 키워드4";

  function voiceBlock() {
    var v = (state.settings.voiceSamples || []).filter(function (x) { return x && x.summary; });
    if (!v.length) return "";
    var lines = ["## ★내 문체 (이 말투·어투·문장 호흡을 그대로 따라 쓰세요)"];
    v.forEach(function (x, i) { lines.push("- 견본" + (i + 1) + " 문체 특징: " + x.summary.replace(/\n+/g, " ")); });
    lines.push("위 문체를 살려 '같은 사람이 쓴 글'처럼 작성하세요. 단, 아래 SEO·마케팅 규칙은 그대로 지킵니다.");
    return lines.join("\n") + "\n";
  }

  function buildBlogUserPrompt(req, src) {
    var lines = [];
    lines.push("아래 조건으로 네이버 블로그용 글 초안을 작성해 주세요.\n");

    var vb = voiceBlock();
    if (vb) lines.push(vb);

    lines.push("## 이번 글 요청사항 (★최우선 반영★)");
    lines.push("- 핵심 키워드(1개, 제목·첫문단·본문에 자연스럽게 3~5회): " + (req.keyword || "(미지정 — 주제/과목에서 가장 중요한 검색어 1개를 스스로 정해 사용)"));
    lines.push("- 과목/업종: " + (req.subject || "(미지정)"));
    lines.push("- 대상 독자: " + (req.target || "(미지정 — 학부모로 가정)"));
    lines.push("- 글의 목적: " + (req.purpose || "(미지정)"));
    lines.push("- 원하는 톤: " + (req.tone || "따뜻하고 친근하게"));
    if (req.region) lines.push("- 지역명(제목·본문에 자연스럽게 포함): " + req.region);
    if (req.experience) lines.push("- ★직접 경험/사례(이 내용만 본문에 녹이고, 여기 없는 수치·후기·날짜는 지어내지 말 것): " + req.experience);
    if (req.etc) lines.push("- 기타 요청: " + req.etc);
    lines.push("");

    lines.push("## 참고 자료");
    if (src.topic) lines.push("주제/키워드: " + src.topic);
    if (src.desc) lines.push("추가 설명: " + src.desc);
    if (!src.topic && !src.desc) lines.push("(직접 입력 자료 없음 — 요청사항 중심으로 작성)");
    var images = collectImages();
    if (images.length) lines.push("(첨부 이미지 " + images.length + "장 — 표·그림 속 정보도 글 내용에 자연스럽게 반영. 단, 대괄호 자리표시 문구는 넣지 말 것.)");
    lines.push("");

    lines.push("## 반드시 지킬 작성 규칙 (네이버 2026 기준)");
    lines.push("[제목] 핵심 키워드를 제목 맨 앞쪽에. 길이 25자 내외(모바일 기준). 낚시성 제목 금지.");
    lines.push("[글 구조] 첫 문단(3~4줄)에 핵심 답 먼저. 소제목 3~5개(## / ###)로 구분. 한 문단 3~4문장 이내.");
    lines.push("[분량] 본문 1,500자 이상. 같은 말 반복·군더더기로 글자 수만 채우기 금지.");
    lines.push("[키워드] 핵심 키워드 총 3~5회만. 10회 이상 반복 금지(저품질 판정).");
    lines.push("[신뢰] 직접 경험/사례 최소 1개. 입력값에 없는 수치·날짜·후기 지어내기 금지.");
    lines.push("[마케팅] 정보 80% : 학원 안내 20%. 도입은 학부모 고민 공감으로 시작.");
    lines.push("[완결성] 대괄호 [ ] 자리표시, '여기에 ~넣어주세요' 같은 안내 문구 본문에 절대 남기지 말 것.");
    lines.push("");

    lines.push("## 출력 형식");
    lines.push("1) 블로그 글 전체를 마크다운으로 작성 (# 제목, ## 소제목). 'CTA:', 'H2:' 라벨 절대 금지.");
    lines.push("2) 글 끝에 아래 형식으로 키워드 추가:");
    lines.push("");
    lines.push("===KEYWORDS===");
    lines.push("메인: 키워드1, 키워드2");
    lines.push("연관: 키워드3, 키워드4, 키워드5");

    return { text: lines.join("\n"), images: images };
  }

  var CARD_SYSTEM =
    "당신은 카드뉴스 아트디렉터 겸 마케팅 카피라이터입니다. 카드뉴스는 정보 나열이 아니라 '이야기 흐름'으로 짜야 문의로 이어집니다. " +
    "글(또는 주제)의 분위기에 맞는 '스타일' 하나를 고르고, 슬라이드를 HOOK→공감→근거→해결→변화→신청(CTA) 흐름으로 구성합니다. " +
    "마지막 CTA 카드는 반드시 포함합니다. 글씨가 넘치면 안 되므로 매우 짧고 강하게 씁니다. " +
    "★절대 규칙: 정원·마감일·할인율·연락처 같은 사실은 사용자가 입력한 값이 있을 때만 쓰고, 없으면 절대 지어내지 않습니다. " +
    "출력은 JSON 객체 하나로만 합니다.";

  function toneToStyle(tone) {
    var t = String(tone || "");
    if (/독수리|eagle|학원 공식|레드|네이비|학원/.test(t)) return "eagle";
    if (/크림|보라|학습 가이드|체계|정돈|단계별/.test(t)) return "cream";
    if (/소개|커리큘럼|교육 철학|에디토리얼|매거진|차분/.test(t)) return "editorial";
    if (/전문|신뢰|입시|프리미엄|고급/.test(t)) return "navy";
    if (/성적|점수|통계|데이터|수치|진단/.test(t)) return "info";
    if (/개념|학습법|공부법|원리|이해|수업/.test(t)) return "chalk";
    if (/초등 저학년|저학년|키즈|초등/.test(t)) return "kids";
    if (/담백|차분|미니멀|여백|심플/.test(t)) return "minimal";
    if (/발랄|친근|밝|경쾌|귀엽/.test(t)) return "pastel";
    if (/감성|따뜻|후기|정성/.test(t)) return "paper";
    if (/임팩트|강조|모집|이벤트|강렬/.test(t)) return "yellow";
    return "eagle";  // 기본값: 독수리 아카데미 스타일
  }

  function buildCardUserPrompt(quick) {
    var req = gatherRequest();
    var L = [];
    if (quick) {
      var src = gatherSource();
      L.push("아래 주제·요청으로 '문의 전환'을 노린 카드뉴스를 만들어 주세요.\n");
      L.push("## 주제·요청");
      if (req.subject) L.push("- 과목/업종: " + req.subject);
      if (req.target) L.push("- 대상: " + req.target);
      if (req.purpose) L.push("- 목적: " + req.purpose);
      if (req.tone) L.push("- 원하는 톤: " + req.tone);
      if (req.etc) L.push("- 기타: " + req.etc);
      if (src.topic) L.push("- 주제/키워드: " + src.topic);
      if (src.desc) L.push("- 추가 설명: " + src.desc);
      L.push("");
    } else {
      L.push("아래 블로그 글을 '문의 전환'을 노린 카드뉴스로 만들어 주세요.\n");
      L.push("## 원본 글");
      L.push(state.blog.markdown.slice(0, 4000));
      L.push("");
    }

    L.push("## 1) 스타일 선택 (15종 중 하나)");
    L.push("eagle·yellow·blue·paper·navy·pastel·dark·magazine·craft·minimal·chalk·info·kids·editorial·cream");
    L.push("※ 기본 추천 스타일은 'eagle'(레드+네이비, 학원 공식 색상)입니다.");
    var hint = toneToStyle(req.tone);
    if (hint) L.push("※ 원하는 톤이 '" + req.tone + "'이므로 '" + hint + "' 스타일을 우선 고려하세요.");
    L.push("");
    L.push("## 2) 슬라이드 6장 내외 (HOOK→공감→근거→해결→변화→CTA)");
    L.push("  ① 표지: 시선 잡는 질문/문제 한 줄");
    L.push("  ② 공감(check): 학부모 고민 2~3개");
    L.push("  ③ 근거(stat): 큰 숫자 하나로 신뢰 (출처 불명 통계 지어내지 말 것)");
    L.push("  ④ 해결(step): 우리 학원이 어떻게 하는지 단계로");
    L.push("  ⑤ 변화(beforeafter): 전→후");
    L.push("  ⑥ ★CTA 반드시 포함 (format:cta)");
    L.push("");
    L.push("## 모집 정보 (없으면 절대 지어내지 말 것)");
    L.push("- 정원/인원: " + (req.capacity || "(미입력 → 숫자 쓰지 말 것)"));
    L.push("- 마감일: " + (req.deadline || "(미입력 → 날짜 쓰지 말 것)"));
    L.push("- 연락 방법: " + (req.contact || "(미입력 → 연락처 쓰지 말 것)"));
    L.push("");
    L.push("## 글자 수 제한 (반드시)");
    L.push("- 표지 title 14자 이내, sub 24자 이내, badge 14자 이내");
    L.push("- heading 16자 이내. check items 각 18자·3개. stat number 10자 이내.");
    L.push("- step 3개(label 6자·sub 16자). beforeafter 각 22자.");
    L.push("- CTA: title 14자, sub 22자, button 14자.");
    if (req.subject) L.push("- 과목: " + req.subject);
    if (req.region) L.push("- 지역: " + req.region);
    L.push("");
    var nImg = collectImages().length;
    if (nImg > 0) L.push("※ 첨부 사진 " + nImg + "장이 있어요. imagecaption 양식을 1장 활용하면 좋아요.");
    else L.push("※ 첨부 사진 없음. imagecaption 양식은 쓰지 마세요.");
    L.push("");
    L.push('## 출력 형식 (JSON 객체 하나로만, 코드블록 금지)');
    L.push('{ "style":"14종 중 하나", "cover":{"badge":"","title":"","highlight":"","sub":""}, "slides":[...] }');
    return L.join("\n");
  }

  /* ============================================================
     블로그 응답 파싱
     ============================================================ */
  function parseBlogResponse(raw) {
    var text = String(raw || "").trim();
    text = text.replace(/^```[a-zA-Z]*\s*/, "").replace(/```\s*$/, "").trim();

    var main = [], related = [], markdown = text;
    var m = text.match(/===\s*KEYWORDS\s*===/i);
    if (m) {
      markdown = text.slice(0, m.index).trim();
      var kw = text.slice(m.index + m[0].length);
      var mMain = kw.match(/메인\s*[:：]\s*(.+)/);
      var mRel = kw.match(/연관\s*[:：]\s*(.+)/);
      if (mMain) main = splitKw(mMain[1]);
      if (mRel) related = splitKw(mRel[1]);
    }
    markdown = stripPlaceholders(markdown);
    markdown = stripLabels(markdown);
    if (!markdown) throw new Error("AI가 빈 글을 보냈어요. 다시 시도해 주세요.");
    return { markdown: markdown, main: main, related: related };
  }

  function stripPlaceholders(md) {
    md = md.replace(/\[[^\]\n]*(넣어|채워|여기에|경험|사진|자리|작성하|추가하|기입|입력하)[^\]\n]*\]/g, "");
    md = md.replace(/\(\s*\)/g, "");
    md = md.split("\n").map(function (l) { return l.replace(/[ \t]+$/g, ""); }).join("\n");
    md = md.replace(/\n{3,}/g, "\n\n").trim();
    return md;
  }

  function stripLabels(md) {
    return md.split("\n").map(function (l) {
      return l.replace(/^\s*(cta|h1|h2|h3|seo|aeo|geo|hook|제목|소제목|본문|도입|결론|행동유도)\s*[:：]\s*/i, "");
    }).join("\n").replace(/\n{3,}/g, "\n\n").trim();
  }

  function splitKw(s) {
    return String(s).split(/[,，·]/)
      .map(function (x) { return x.replace(/[*`#\[\]]/g, "").trim(); })
      .filter(function (x) { return x && x.length < 30; })
      .slice(0, 10);
  }

  function extractJson(raw) {
    if (!raw) throw new Error("빈 응답");
    try { return JSON.parse(raw); } catch (e) {}
    var first = raw.indexOf("{"), last = raw.lastIndexOf("}");
    if (first !== -1 && last !== -1 && last > first) {
      var slice = raw.slice(first, last + 1);
      try { return JSON.parse(slice); } catch (e2) {}
    }
    throw new Error("AI 응답을 해석하지 못했어요. 다시 시도해 주세요.");
  }

  /* ============================================================
     마크다운 → HTML
     ============================================================ */
  function escHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function inline(s) {
    s = escHtml(s);
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    return s;
  }
  function mdToHtml(md) {
    if (!md) return "<p>(내용이 없어요)</p>";
    var linesArr = md.replace(/\r/g, "").split("\n");
    var html = [];
    var i = 0;
    function flushList(tag, items) {
      html.push("<" + tag + ">" + items.map(function (t) { return "<li>" + inline(t) + "</li>"; }).join("") + "</" + tag + ">");
    }
    while (i < linesArr.length) {
      var line = linesArr[i];
      var t = line.trim();
      if (!t) { i++; continue; }
      if (/^\|.*\|/.test(t)) {
        var rows = [];
        while (i < linesArr.length && /^\|.*\|/.test(linesArr[i].trim())) { rows.push(linesArr[i].trim()); i++; }
        html.push(renderTable(rows));
        continue;
      }
      if (/^#{1,6}\s/.test(t)) {
        var lvl = t.match(/^#+/)[0].length;
        var txt = t.replace(/^#+\s*/, "");
        var tag = lvl === 1 ? "h1" : lvl === 2 ? "h2" : "h3";
        html.push("<" + tag + ">" + inline(txt) + "</" + tag + ">");
        i++; continue;
      }
      if (/^\d+\.\s/.test(t)) {
        var ol = [];
        while (i < linesArr.length && /^\d+\.\s/.test(linesArr[i].trim())) { ol.push(linesArr[i].trim().replace(/^\d+\.\s*/, "")); i++; }
        flushList("ol", ol); continue;
      }
      if (/^[-*]\s/.test(t)) {
        var ul = [];
        while (i < linesArr.length && /^[-*]\s/.test(linesArr[i].trim())) { ul.push(linesArr[i].trim().replace(/^[-*]\s*/, "")); i++; }
        flushList("ul", ul); continue;
      }
      html.push("<p>" + inline(t) + "</p>");
      i++;
    }
    return html.join("\n");
  }
  function renderTable(rows) {
    var body = rows.filter(function (r) { return !/^\|[\s:\-|]+\|$/.test(r); });
    var cells = body.map(function (r) {
      return r.replace(/^\|/, "").replace(/\|$/, "").split("|").map(function (c) { return c.trim(); });
    });
    if (!cells.length) return "";
    var out = "<table>";
    out += "<tr>" + cells[0].map(function (c) { return "<th>" + inline(c) + "</th>"; }).join("") + "</tr>";
    for (var r = 1; r < cells.length; r++) {
      out += "<tr>" + cells[r].map(function (c) { return "<td>" + inline(c) + "</td>"; }).join("") + "</tr>";
    }
    return out + "</table>";
  }

  /* ============================================================
     파일 유틸
     ============================================================ */
  function fileToDataUrl(file) {
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onload = function (e) { resolve(e.target.result); };
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
  }
  function parseDataUrl(d) {
    var m = /^data:([^;]+);base64,(.*)$/.exec(d || "");
    if (!m) return null;
    return { mime: m[1], data: m[2] };
  }

  /* =================================================== */
  (function init() {
    state.settings = loadSettings();
    applySettingsToUI();
    renderKeyHelp();
  })();
})();

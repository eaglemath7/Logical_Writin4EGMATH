/* ============================================================
   마케팅 뚝딱 메이커 — 카드뉴스 템플릿 (스타일 12종 × 양식 11종 + 마케팅 스토리 구성)
   ------------------------------------------------------------
   - 출력 규격: 1080 x 1080
   - 스타일(STYLE) = 글 분위기로 선택 (yellow/blue/paper/navy/pastel/dark/magazine/craft/minimal/chalk/info/kids)
   - 양식(FORMAT) = 슬라이드 내용 구조로 선택, 슬라이드마다 섞음
       cover 표지 · text 기본 · list 리스트 · check 체크리스트(공감)
       stat 통계(큰 숫자) · step 단계 · compare 비교(VS) · beforeafter 변화(전→후)
       quote 인용 · qa Q&A · imagecaption 이미지+캡션 · cta 신청(★)
   - 마케팅 구성: HOOK→공감→근거→해결→변화→CTA 흐름. CTA 카드는 메인컬러로 꽉 채움.
   - 휑함 방지: 위계 + 전 카드 하단 인디케이터(●●●○○○ + 01/06)
   - 글씨 깨짐 방지: word-break:keep-all + autoFit(실측 높이 기준)
   - 로고/이름: 고정 위치 일관 · 크기 조절 가능 (제작자 표기 없음)
   - ★브랜드 일관성: opts.brandMain/brandPoint 로 8종 모든 템플릿의 악센트를 학원 색으로 통일
   - ★인라인 편집: 모든 텍스트에 data-ek(편집키) → 미리보기에서 바로 고침
   ============================================================ */
(function (global) {
  "use strict";

  var CARD = 1080;
  var STYLES = ["yellow", "blue", "paper", "navy", "pastel", "dark", "magazine", "craft", "minimal", "chalk", "info", "kids", "editorial", "cream", "hand", "note", "txt"];
  var STYLE_LABEL = {
    yellow: "옐로 임팩트", blue: "블루 브라우저", paper: "종이 메모", navy: "네이비 프리미엄",
    pastel: "파스텔 소프트", dark: "다크 모던", magazine: "매거진 그리드", craft: "크래프트 손글씨",
    minimal: "미니멀 화이트", chalk: "칠판 · 교육", info: "인포그래픽", kids: "키즈 팝",
    editorial: "매거진 에디토리얼", cream: "크림 · 보라",
    hand: "손글씨 감성", note: "손그림 노트", txt: "텍스트 캐러셀",
  };
  // 세로형(4:5, 1080×1350) 스타일 — 그 외는 정사각(1080×1080)
  var TALL = { hand: 1, note: 1, txt: 1 };
  function cardHeight(style) { return TALL[style] ? 1350 : 1080; }
  var FORMATS = ["text", "list", "check", "stat", "step", "compare", "beforeafter", "quote", "qa", "imagecaption", "cta", "chart"];

  function injectStyles() {
    if (document.getElementById("cn-styles")) return;
    var css = `
.card-1080{width:${CARD}px;height:${CARD}px;position:relative;overflow:hidden;font-family:'Noto Sans KR',sans-serif;--c-dot:rgba(0,0,0,.16);--c-hl:var(--c-accent);--logo-h:66px;--logo-maxw:330px;}
.card-1080 *{word-break:keep-all;overflow-wrap:break-word;box-sizing:border-box;}
.card-1080 [contenteditable]{outline:none;}
.card-1080 [contenteditable]:focus{background:rgba(120,170,255,.16);border-radius:6px;box-shadow:0 0 0 3px rgba(120,170,255,.35);}
.cn-inner{position:absolute;inset:0;z-index:3;display:flex;flex-direction:column;justify-content:center;padding:118px 104px 156px;}
.cn-logo{position:absolute;z-index:9;font-family:'Jua',sans-serif;font-size:34px;line-height:1;opacity:.95;color:var(--c-logo);}
.cn-logo img{height:var(--logo-h);width:auto;max-width:var(--logo-maxw);object-fit:contain;display:block;}
.cn-pos-br{bottom:56px;right:66px;text-align:right;}
.cn-pos-bl{bottom:56px;left:66px;text-align:left;}
.cn-pos-tr{top:56px;right:66px;text-align:right;}

/* 하단 인디케이터(시리즈 표시) — 모든 카드 공통 */
.cn-ind{position:absolute;bottom:50px;left:50%;transform:translateX(-50%);z-index:7;display:flex;flex-direction:column;align-items:center;gap:11px;}
.cn-ind .num{font-family:var(--ff-body);font-size:23px;font-weight:700;color:var(--c-sub);letter-spacing:1.5px;}
.cn-ind .dots{display:flex;gap:9px;}
.cn-ind .dots b{width:11px;height:11px;border-radius:50%;background:var(--c-dot);display:block;}
.cn-ind .dots b.on{width:30px;border-radius:6px;background:var(--c-accent);}

/* ----- 공용 양식 요소 (색/폰트는 스타일 변수) ----- */
.cn-badge{align-self:flex-start;background:var(--c-accent);color:var(--c-onacc);font-family:var(--ff-body);font-weight:800;font-size:30px;padding:12px 24px;border-radius:999px;margin-bottom:26px;line-height:1.2;}
.cn-kicker{font-family:var(--ff-title);font-size:40px;color:var(--c-sub);margin-bottom:20px;line-height:1.3;}
.cn-title{font-family:var(--ff-title);font-size:92px;line-height:1.22;color:var(--c-ink);letter-spacing:var(--ls,0);}
.cn-title .hl{color:var(--c-hl);}
.cn-sub{font-family:var(--ff-body);font-size:36px;font-weight:500;color:var(--c-body);line-height:1.5;margin-top:24px;}
.cn-go{font-family:var(--ff-body);font-size:29px;font-weight:700;color:var(--c-accent);margin-top:30px;}
.cn-heading{font-family:var(--ff-title);font-size:60px;line-height:1.26;color:var(--c-ink);margin-bottom:28px;letter-spacing:var(--ls,0);}
.cn-heading .hl{color:var(--c-hl);}
.cn-body{font-family:var(--ff-body);font-size:42px;line-height:1.7;color:var(--c-body);}

.cn-list{display:flex;flex-direction:column;gap:22px;}
.cn-list .item{font-family:var(--ff-body);font-size:40px;font-weight:700;color:var(--c-ink);background:var(--c-fill);border:2px solid var(--c-edge);border-radius:var(--r-pill,999px);padding:26px 36px;line-height:1.4;}
.cn-list .item.on{background:var(--c-accent);color:var(--c-onacc);border-color:var(--c-accent);}

.cn-check{display:flex;flex-direction:column;gap:18px;}
.cn-check .ck{display:flex;gap:18px;align-items:flex-start;background:var(--c-fill);border:2px solid var(--c-edge);border-radius:20px;padding:24px 28px;}
.cn-check .ic{flex:none;width:50px;height:50px;border-radius:13px;border:3px solid var(--c-accent);color:var(--c-accent);font-weight:900;font-size:28px;display:flex;align-items:center;justify-content:center;}
.cn-check .tx{font-family:var(--ff-body);font-size:38px;font-weight:700;color:var(--c-ink);line-height:1.4;padding-top:5px;}
.cn-check .ck.on{background:var(--c-accent);border-color:var(--c-accent);}
.cn-check .ck.on .ic{background:rgba(255,255,255,.25);border-color:transparent;color:var(--c-onacc);}
.cn-check .ck.on .tx{color:var(--c-onacc);}

.cn-stat{display:flex;flex-direction:column;}
.cn-stat .num{font-family:var(--ff-stat,var(--ff-title));font-weight:900;font-size:150px;line-height:.95;color:var(--c-accent);letter-spacing:-2px;}
.cn-stat .num small{font-size:64px;color:var(--c-ink);letter-spacing:0;}
.cn-stat .desc{font-family:var(--ff-body);font-size:44px;font-weight:700;color:var(--c-ink);margin-top:22px;line-height:1.45;}
.cn-stat .src{font-family:var(--ff-body);font-size:28px;color:var(--c-sub);margin-top:16px;line-height:1.4;}

.cn-step{display:flex;flex-direction:column;gap:26px;}
.cn-step .s{display:flex;gap:24px;align-items:flex-start;}
.cn-step .n{flex:0 0 auto;width:78px;height:78px;border-radius:50%;background:var(--c-accent);color:var(--c-onacc);font-family:var(--ff-title);font-size:44px;display:flex;align-items:center;justify-content:center;}
.cn-step .st-l{font-family:var(--ff-title);font-size:42px;color:var(--c-ink);line-height:1.3;padding-top:8px;}
.cn-step .st-s{font-family:var(--ff-body);font-size:30px;color:var(--c-sub);margin-top:4px;line-height:1.4;}

.cn-cmp{display:flex;gap:20px;align-items:stretch;}
.cn-cmp .col{flex:1;background:var(--c-fill);border:2px solid var(--c-edge);border-radius:26px;padding:36px 30px;}
.cn-cmp .vs{flex:0 0 auto;align-self:center;font-family:var(--ff-title);font-size:60px;color:var(--c-accent);}
.cn-cmp .lab{font-family:var(--ff-title);font-size:46px;color:var(--c-accent);margin-bottom:16px;line-height:1.2;}
.cn-cmp .d{font-family:var(--ff-body);font-size:35px;color:var(--c-body);line-height:1.55;}

.cn-ba{display:flex;flex-direction:column;gap:14px;}
.cn-ba .box{border-radius:20px;padding:28px 30px;}
.cn-ba .before{background:var(--c-fill);border:2px dashed var(--c-edge);}
.cn-ba .after{background:var(--c-accent);}
.cn-ba .bt{font-family:var(--ff-body);font-weight:800;font-size:25px;letter-spacing:2px;margin-bottom:9px;}
.cn-ba .before .bt{color:var(--c-sub);}
.cn-ba .after .bt{color:var(--c-onacc);opacity:.85;}
.cn-ba .bp{font-family:var(--ff-body);font-size:37px;font-weight:600;line-height:1.45;}
.cn-ba .before .bp{color:var(--c-body);}
.cn-ba .after .bp{color:var(--c-onacc);}
.cn-ba .arrow{text-align:center;font-size:46px;font-weight:900;color:var(--c-accent);line-height:.8;}

.cn-quote .mark{font-family:Georgia,serif;font-size:160px;line-height:.5;height:90px;color:var(--c-accent);}
.cn-quote .q{font-family:var(--ff-title);font-size:58px;line-height:1.5;color:var(--c-ink);}
.cn-quote .who{font-family:var(--ff-body);font-size:36px;color:var(--c-sub);margin-top:30px;}

.cn-qa{display:flex;flex-direction:column;gap:30px;}
.cn-qa .q{font-family:var(--ff-title);font-size:44px;color:var(--c-ink);line-height:1.35;}
.cn-qa .q b,.cn-qa .a b{color:var(--c-accent);}
.cn-qa .a{font-family:var(--ff-body);font-size:37px;color:var(--c-body);line-height:1.55;margin-top:10px;}

.cn-imgcap{display:flex;flex-direction:column;height:100%;justify-content:center;}
.cn-imgcap .photo{flex:0 0 auto;height:440px;border-radius:26px;overflow:hidden;background:var(--c-fill);margin-bottom:30px;box-shadow:0 10px 26px rgba(0,0,0,.12);}
.cn-imgcap .photo img{width:100%;height:100%;object-fit:cover;display:block;}

/* ----- CTA(신청) 카드: 메인컬러로 꽉 채움 ----- */
.ctacard{background:var(--c-accent) !important;}
.ctacard .cn-inner{align-items:center;text-align:center;}
.ctacard .cn-logo{color:var(--c-onacc);opacity:.75;}
.ctacard .cn-ind .num{color:var(--c-onacc);opacity:.75;}
.ctacard .cn-ind .dots b{background:rgba(255,255,255,.4);}
.ctacard .cn-ind .dots b.on{background:var(--c-onacc);}
.cn-cta{display:flex;flex-direction:column;align-items:center;}
.cn-cta .b{background:rgba(255,255,255,.2);color:var(--c-onacc);font-family:var(--ff-body);font-weight:800;font-size:30px;padding:13px 26px;border-radius:999px;margin-bottom:26px;}
.cn-cta .t{font-family:var(--ff-title);font-size:74px;font-weight:900;color:var(--c-onacc);line-height:1.24;letter-spacing:var(--ls,0);}
.cn-cta .s{font-family:var(--ff-body);font-size:34px;color:var(--c-onacc);opacity:.92;margin-top:18px;line-height:1.45;}
.cn-cta .btn{margin-top:34px;background:var(--c-onacc);color:var(--c-accent);font-family:var(--ff-title);font-size:40px;font-weight:900;padding:24px 46px;border-radius:999px;}
.cn-cta .tel{margin-top:22px;font-family:var(--ff-body);font-size:28px;color:var(--c-onacc);opacity:.85;}

/* ===================== 스타일 8종 ===================== */
.cn-yellow{--c-ink:#1a1a1a;--c-accent:#E8503C;--c-onacc:#fff;--c-sub:#8a6a1f;--c-body:#3a2f10;--c-fill:#fff;--c-edge:#e8cf86;--c-logo:#1a1a1a;--ff-title:'Do Hyeon',sans-serif;--ff-body:'Noto Sans KR',sans-serif;--ls:.5px;background:#FFC926;}
.cn-yellow.content{background:#FFFBEF;}
.cn-yellow .uline{position:absolute;top:116px;left:104px;width:128px;height:14px;background:#1a1a1a;border-radius:4px;z-index:4;}
.cn-yellow.cover .cn-inner{padding-top:168px;}
.cn-yellow .ycorner{position:absolute;width:300px;height:300px;background:#1a1a1a;opacity:.06;transform:rotate(45deg);right:-150px;bottom:-150px;z-index:1;}

.cn-blue{--c-ink:#16223c;--c-accent:#2E6BE6;--c-onacc:#fff;--c-sub:#6a7891;--c-body:#3a4a63;--c-fill:#fff;--c-edge:#dbe6fa;--c-logo:#a7b8d3;--ff-title:'Noto Sans KR',sans-serif;--ff-body:'Noto Sans KR',sans-serif;--ls:-1px;background:radial-gradient(circle at 14% 14%, rgba(46,107,230,.06) 0 2px, transparent 2.2px) 0 0/26px 26px, linear-gradient(165deg,#ffffff 0%,#eaf1fc 100%);}
.cn-blue .cn-title,.cn-blue .cn-heading{font-weight:900;}
.cn-blue .cn-inner{padding:150px 100px 156px;}
.cn-blue .win{position:absolute;inset:54px;border:2.5px solid #cfdcf6;border-radius:42px;z-index:1;}
.cn-blue .dots3{position:absolute;top:88px;left:92px;display:flex;gap:16px;z-index:4;}
.cn-blue .dots3 i{width:24px;height:24px;border-radius:50%;background:#3b78e7;display:block;}
.cn-blue .dots3 i:nth-child(2){background:#7aa6f0;}
.cn-blue .dots3 i:nth-child(3){background:#b9d0f7;}
.cn-blue .xmark{position:absolute;top:80px;right:92px;font-size:44px;color:#9fb4d4;z-index:4;}

.cn-paper{--c-ink:#3a3027;--c-accent:#C2724B;--c-onacc:#fff;--c-sub:#9a8b7a;--c-body:#5a4f44;--c-fill:#FBF3DF;--c-edge:#e6d6b8;--c-logo:#C2724B;--ff-title:'Gowun Dodum',sans-serif;--ff-body:'Gowun Dodum',sans-serif;--ls:-.5px;background:#e8ecf2;}
.cn-paper .paper-bg{position:absolute;background:#fff;border:1.5px solid #e2e2e2;z-index:1;}
.cn-paper .p1{inset:88px 110px 110px 88px;transform:rotate(-2deg);box-shadow:0 10px 30px rgba(40,50,70,.10);}
.cn-paper .p2{inset:96px 88px 102px 110px;transform:rotate(1.4deg);box-shadow:0 8px 24px rgba(40,50,70,.08);}
.cn-paper .paper{position:absolute;inset:78px;background:#fff;border:1.5px solid #ececec;box-shadow:0 16px 40px rgba(40,50,70,.14);z-index:2;}
.cn-paper .cn-inner{padding:130px 110px 156px;}
.cn-paper .cn-kicker{font-family:'Gaegu',cursive;font-weight:700;color:var(--c-accent);}
.cn-paper .cn-title .uacc,.cn-paper .cn-heading .hl{border-bottom:10px solid #F0C36B;padding-bottom:2px;color:var(--c-ink);}

.cn-navy{--c-ink:#F4F1E8;--c-accent:#E6C778;--c-onacc:#1a233b;--c-sub:#D4AF5A;--c-body:#cfd4e0;--c-fill:rgba(255,255,255,.06);--c-edge:rgba(212,175,90,.5);--c-logo:#D4AF5A;--c-dot:rgba(255,255,255,.3);--ff-title:'Hahmlet',serif;--ff-body:'Noto Serif KR',serif;--ff-stat:'Hahmlet',serif;--ls:-.5px;background:linear-gradient(160deg,#22304F 0%,#16213B 100%);}
.cn-navy .cn-title,.cn-navy .cn-heading{font-weight:700;}
.cn-navy .cn-kicker{font-weight:600;letter-spacing:3px;}
.cn-navy .goldline{position:absolute;top:0;left:74px;width:2px;height:100%;background:rgba(212,175,90,.45);z-index:1;}
.cn-navy .cn-inner{padding-left:120px;}

.cn-pastel{--c-ink:#5b4b57;--c-accent:#E08AAE;--c-onacc:#fff;--c-sub:#9a8aa0;--c-body:#6f6270;--c-fill:#fff;--c-edge:#f0d9e6;--c-logo:#E08AAE;--r-pill:30px;--ff-title:'Jua',sans-serif;--ff-body:'Noto Sans KR',sans-serif;background:linear-gradient(150deg,#FDEEF4 0%,#E7F6F1 100%);}
.cn-pastel .blob{position:absolute;border-radius:50%;z-index:1;opacity:.6;}
.cn-pastel .b1{width:240px;height:240px;background:#FAD1E0;top:-60px;right:-50px;}
.cn-pastel .b2{width:150px;height:150px;background:#BFEBDD;bottom:120px;left:-40px;}

.cn-dark{--c-ink:#f3f4f7;--c-accent:#36E2B0;--c-onacc:#0c1116;--c-sub:#8a93a3;--c-body:#c3c9d4;--c-fill:#1d232d;--c-edge:#313a47;--c-logo:#36E2B0;--c-dot:rgba(255,255,255,.22);--ff-title:'Noto Sans KR',sans-serif;--ff-body:'Noto Sans KR',sans-serif;--ls:-1px;background:#12161c;}
.cn-dark .cn-title,.cn-dark .cn-heading{font-weight:900;}
.cn-dark .neon{position:absolute;top:0;left:0;width:100%;height:14px;background:linear-gradient(90deg,var(--c-accent),#4d8bff);z-index:4;}
.cn-dark .cn-cmp .vs{color:#4d8bff;}

.cn-magazine{--c-ink:#1a1a1a;--c-accent:#C0392B;--c-onacc:#fff;--c-sub:#8a8175;--c-body:#3a3833;--c-fill:#efebe2;--c-edge:#d8d1c2;--c-logo:#1a1a1a;--ff-title:'Song Myung',serif;--ff-body:'Noto Sans KR',sans-serif;--ls:-.5px;background:#f5f2ec;}
.cn-magazine .magtop{position:absolute;top:74px;left:104px;right:104px;display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #1a1a1a;padding-bottom:16px;z-index:4;}
.cn-magazine .magtop .cat{font-family:'Noto Sans KR',sans-serif;font-weight:900;font-size:28px;letter-spacing:4px;color:var(--c-accent);}
.cn-magazine .magtop .ed{font-family:'Song Myung',serif;font-size:28px;color:#8a8175;}
.cn-magazine .cn-inner{padding-top:168px;}
.cn-magazine.cover .cn-title{font-size:104px;}

.cn-craft{--c-ink:#3a2f22;--c-accent:#C2603A;--c-onacc:#fff;--c-sub:#8a7456;--c-body:#5a4a36;--c-fill:#fffdf5;--c-edge:#d8c4a0;--c-logo:#6b4f2a;--ff-title:'Gaegu',cursive;--ff-body:'Gaegu',cursive;background:#D9C4A3;}
.cn-craft .cn-title,.cn-craft .cn-heading{font-weight:700;}
.cn-craft .craftcard{position:absolute;inset:70px;background:#fffdf5;border:1.5px solid #e8dcc2;box-shadow:0 14px 36px rgba(60,45,25,.18);z-index:1;}
.cn-craft .tape{position:absolute;width:170px;height:48px;background:rgba(193,150,90,.45);z-index:5;top:50px;left:50%;transform:translateX(-50%) rotate(-4deg);}
.cn-craft .cn-inner{padding:128px 110px 156px;}
.cn-craft .cn-qa .q,.cn-craft .cn-qa .a{font-weight:700;}

/* ===================== 새 스타일 4종 (⑨~⑫) ===================== */
/* ⑨ 미니멀 화이트 — 넉넉한 여백 + 잉크그린 포인트 + 대문자 eyebrow */
.cn-minimal{--c-ink:#16221d;--c-accent:#1F5C44;--c-onacc:#fff;--c-sub:#9aa39d;--c-body:#5d655f;--c-fill:#fff;--c-edge:#e6eae5;--c-logo:#b3bab5;--c-dot:rgba(31,92,68,.18);--ff-title:'Noto Sans KR',sans-serif;--ff-body:'Noto Sans KR',sans-serif;--ls:-1px;background:#FCFCFA;}
.cn-minimal .cn-title,.cn-minimal .cn-heading{font-weight:900;}
.cn-minimal .cn-body{font-weight:400;}
.cn-minimal .cn-kicker{font-weight:700;font-size:30px;letter-spacing:6px;text-transform:uppercase;color:var(--c-sub);}
.cn-minimal .cn-inner{padding:150px 104px 160px;}
.cn-minimal .mrule{position:absolute;top:150px;left:104px;width:64px;height:4px;background:var(--c-accent);border-radius:2px;z-index:4;}

/* ⑩ 칠판·교육 — 칠판 그린 텍스처 + 나무 테두리 + 분필 손글씨 */
.cn-chalk{--c-ink:#F4F1E8;--c-accent:#F2D06B;--c-onacc:#2b3a32;--c-sub:#9FC8A6;--c-body:#cfe0d2;--c-fill:rgba(255,255,255,.06);--c-edge:rgba(159,200,166,.4);--c-logo:#9FC8A6;--c-dot:rgba(244,241,232,.28);--ff-title:'Gaegu',cursive;--ff-body:'Gaegu',cursive;--ls:0;background:radial-gradient(circle at 22% 30%, rgba(255,255,255,.05) 0 2px, transparent 2.5px) 0 0/52px 52px, radial-gradient(circle at 70% 76%, rgba(255,255,255,.04) 0 2px, transparent 2.5px) 0 0/68px 68px, #25342E;}
.cn-chalk .cn-title,.cn-chalk .cn-heading{font-weight:700;}
.cn-chalk .cn-kicker{color:var(--c-accent);font-weight:700;}
.cn-chalk .cn-title .hl,.cn-chalk .cn-heading .hl{color:var(--c-accent);border-bottom:5px dashed rgba(242,208,107,.6);padding-bottom:2px;}
.cn-chalk .cn-step .st-l{color:var(--c-ink);}
.cn-chalk .chalkframe{position:absolute;inset:0;border:14px solid #6B4F35;z-index:6;pointer-events:none;}

/* ⑪ 인포그래픽 — 큰 숫자(Archivo Black) + 데이터 블루/그린 */
.cn-info{--c-ink:#14213D;--c-accent:#2E6BE6;--c-onacc:#fff;--c-sub:#8893a8;--c-body:#5a6480;--c-fill:#eef3fb;--c-edge:#d7e3f7;--c-logo:#9fb1d0;--c-dot:rgba(46,107,230,.2);--ff-title:'Noto Sans KR',sans-serif;--ff-body:'Noto Sans KR',sans-serif;--ff-stat:'Archivo Black',sans-serif;--ls:-.5px;background:linear-gradient(160deg,#F4F8FF 0%,#E7F0FF 100%);}
.cn-info.content{background:#fff;}
.cn-info .cn-title,.cn-info .cn-heading{font-weight:900;}

/* ⑫ 키즈 팝 — 크림/흰 바탕 + 알록달록 둥근 도형 + 통통한 글씨 */
.cn-kids{--c-ink:#3A2C12;--c-accent:#E84C8A;--c-onacc:#fff;--c-sub:#F2820C;--c-body:#5a4a36;--c-fill:#fff;--c-edge:#FFE2B0;--c-logo:#F2820C;--c-dot:rgba(232,76,138,.22);--r-pill:30px;--ff-title:'Do Hyeon',sans-serif;--ff-body:'Jua',sans-serif;--ls:.5px;background:#FFF6DC;}
.cn-kids.content{background:#fff;}
.cn-kids .cn-kicker{font-family:'Jua',sans-serif;color:var(--c-sub);}
.cn-kids .kblob{position:absolute;border-radius:50%;z-index:1;}
.cn-kids .kb1{width:230px;height:230px;background:#7FC8F8;opacity:.85;top:-66px;right:-54px;}
.cn-kids .kb2{width:120px;height:120px;background:#FF9ECb;bottom:120px;left:-40px;}
.cn-kids .kb3{width:64px;height:64px;border-radius:20px;background:#9BE3A2;transform:rotate(18deg);top:130px;left:78px;}

/* ⑬ 매거진 에디토리얼 — 미색 종이 + 검정 고딕 + 주홍 하나, 러닝헤드/풋 + ISSUE 번호 */
.cn-editorial{--c-ink:#1F1C18;--c-accent:#C0472B;--c-onacc:#fff;--c-sub:#A89F8E;--c-body:#6b6358;--c-fill:#fff;--c-edge:#D8D2C4;--c-logo:#1F1C18;--ff-title:'Noto Sans KR',sans-serif;--ff-body:'Noto Sans KR',sans-serif;--ls:-1px;background:#F4F0E6;}
.cn-editorial .cn-title,.cn-editorial .cn-heading{font-weight:900;}
.cn-editorial .cn-body{font-weight:400;}
.cn-editorial .cn-inner{padding:178px 96px 172px;counter-reset:fig;}
.cn-editorial.cover .cn-title{font-size:104px;}
/* 러닝헤드/풋 (5장 통일 — 한 권의 잡지 느낌) */
.cn-ed-head{position:absolute;top:74px;left:96px;right:96px;z-index:7;border-bottom:1.5px solid var(--c-edge);padding-bottom:18px;display:flex;justify-content:space-between;align-items:baseline;gap:16px;}
.cn-ed-head .l{font-family:var(--ff-body);font-weight:800;font-size:27px;letter-spacing:2px;color:var(--c-ink);}
.cn-ed-head .r{font-family:var(--ff-body);font-weight:700;font-size:25px;letter-spacing:2px;color:var(--c-sub);white-space:nowrap;}
.cn-ed-foot{position:absolute;bottom:64px;left:96px;right:96px;z-index:7;border-top:1.5px solid var(--c-edge);padding-top:18px;display:flex;justify-content:space-between;align-items:center;gap:16px;}
.cn-ed-foot .l{font-family:var(--ff-body);font-weight:800;font-size:27px;color:var(--c-ink);}
.cn-ed-foot .l img{height:48px;width:auto;max-width:320px;object-fit:contain;display:block;}
.cn-ed-foot .r{font-family:var(--ff-body);font-size:25px;color:var(--c-sub);white-space:nowrap;}
/* 섹션 라벨 (■ 주홍 네모 + 라벨) */
.cn-seclabel{display:flex;align-items:center;gap:14px;margin-bottom:26px;}
.cn-seclabel .sq{width:24px;height:24px;background:var(--c-accent);flex:none;}
.cn-seclabel .lb{font-family:var(--ff-body);font-weight:800;font-size:30px;letter-spacing:1.5px;color:var(--c-accent);line-height:1.2;}
/* 표지 짧은 주홍 밑줄 */
.cn-editorial .cn-uline{width:92px;height:8px;background:var(--c-accent);border-radius:2px;margin-top:34px;}
.cn-editorial .cn-sub{font-weight:400;}
/* 번호 목록 */
.cn-ed-list{border-bottom:1.5px solid var(--c-edge);}
.cn-ed-list .row{display:flex;gap:40px;align-items:baseline;padding:34px 4px;border-top:1.5px solid var(--c-edge);}
.cn-ed-list .n{font-family:var(--ff-title);font-weight:900;font-size:62px;color:var(--c-accent);flex:none;min-width:92px;letter-spacing:-1px;}
.cn-ed-list .t{font-family:var(--ff-body);font-weight:700;font-size:42px;color:var(--c-ink);line-height:1.35;}
/* FIG 자료 도판 (각진 직사각형 + 얇은 검정 테두리 + 회색 겹침 그림자) */
.cn-ed-fig{position:relative;margin-top:8px;}
.cn-ed-fig .shadow{position:absolute;left:16px;right:-16px;top:16px;bottom:-16px;background:#ded7c7;z-index:0;}
.cn-ed-fig .frame{position:relative;z-index:1;border:2px solid #1F1C18;background:#fff;overflow:hidden;height:440px;}
.cn-ed-fig .frame img{width:100%;height:100%;object-fit:cover;display:block;}
.cn-ed-fig-cap{font-family:var(--ff-body);font-size:30px;color:var(--c-sub);margin-top:30px;letter-spacing:.5px;counter-increment:fig;}
.cn-ed-fig-cap::before{content:"FIG. " counter(fig,decimal-leading-zero) " — ";}
/* 가로 플로우 (읽기 → 분석 → 풀이) */
.cn-ed-flow{display:flex;flex-wrap:wrap;align-items:center;gap:14px;margin-top:30px;}
.cn-ed-flow .w{font-family:var(--ff-body);font-weight:800;font-size:38px;color:var(--c-accent);}
.cn-ed-flow .a{font-size:34px;color:var(--c-sub);}
/* CTA 정보 박스 (두꺼운 주홍 상단선 + 얇은 검정 테두리) */
.cn-ed-cta .box{margin-top:42px;border:1.5px solid #1F1C18;border-top:10px solid var(--c-accent);padding:40px 44px;background:#fff;}
.cn-ed-cta .box .name{font-family:var(--ff-title);font-weight:900;font-size:50px;color:var(--c-ink);}
.cn-ed-cta .box .ln{height:1.5px;background:var(--c-edge);margin:26px 0;}
.cn-ed-cta .box .row{display:flex;gap:26px;font-size:32px;margin-top:14px;align-items:baseline;}
.cn-ed-cta .box .row .k{color:var(--c-sub);flex:none;min-width:76px;font-weight:700;}
.cn-ed-cta .box .row .v{color:var(--c-ink);font-weight:600;line-height:1.4;}

/* ----- 막대그래프(chart) 공용 양식 (점점 높아지는 막대 + 막대 아래 캡션) ----- */
.cn-chart{display:flex;align-items:flex-end;gap:22px;height:360px;margin-top:8px;}
.cn-chart .bar{flex:1;border-radius:18px 18px 0 0;display:flex;align-items:flex-start;justify-content:center;padding:24px 10px 0;background:var(--c-accent);}
.cn-chart .bar:nth-child(1){background:var(--cr-step1,rgba(0,0,0,.22));}
.cn-chart .bar:nth-child(2){background:var(--cr-step2,rgba(0,0,0,.45));}
.cn-chart .bar:nth-child(3){background:var(--cr-step3,var(--c-accent));}
.cn-chart .bar .bl{font-family:var(--ff-body);font-weight:700;font-size:30px;line-height:1.3;text-align:center;color:var(--c-onacc);}
.cn-chart-caps{display:flex;gap:22px;margin-top:18px;}
.cn-chart-caps span{flex:1;text-align:center;font-family:var(--ff-body);font-size:28px;color:var(--c-body);line-height:1.35;}

/* ===================== ⑭ 크림 · 보라 (레이아웃 디자인 시스템) ===================== */
/* 크림 배경 + 보라 포인트 + 남색 제목. 표지/마무리는 하단 남색 띠. 공통 푸터(빨간 점+학원명+n/N). */
.cn-cream{--c-ink:#262F40;--c-accent:#624DD6;--c-onacc:#fff;--c-sub:#B3B3B1;--c-body:#585E69;--c-fill:#fff;--c-edge:#E6E2D6;--c-logo:#262F40;--ff-title:'Pretendard',sans-serif;--ff-body:'Pretendard',sans-serif;--ff-stat:'Pretendard',sans-serif;--ls:-.5px;--cr-navy:#262F40;--cr-step1:#DDD9CD;--cr-step2:#ABB2C4;--cr-step3:#624DD6;--cr-red:#DE4547;background:#FAF6EA;}
.cn-cream .cn-title,.cn-cream .cn-heading{font-weight:700;}
.cn-cream .cn-inner{padding:96px 88px 132px;}
.cn-cream .cn-sub{color:var(--c-body);font-weight:500;font-size:30px;}
.cn-cream .cn-title .hl,.cn-cream .cn-heading .hl{color:var(--c-accent);border-bottom:8px solid var(--c-accent);padding-bottom:2px;}

/* 공통 푸터 */
.cn-cr-foot{position:absolute;left:88px;right:88px;bottom:52px;z-index:8;display:flex;justify-content:space-between;align-items:center;gap:16px;}
.cn-cr-foot .l{display:flex;align-items:center;gap:12px;font-family:var(--ff-body);font-weight:600;font-size:26px;color:var(--c-ink);}
.cn-cr-foot .l .dot{width:12px;height:12px;border-radius:50%;background:var(--cr-red);flex:none;}
.cn-cr-foot .l img{height:44px;width:auto;max-width:300px;object-fit:contain;display:block;}
.cn-cr-foot .r{font-family:var(--ff-body);font-weight:500;font-size:26px;color:var(--c-sub);white-space:nowrap;}
.cn-cream.cover .cn-cr-foot .l{color:#fff;}
.cn-cream.cover .cn-cr-foot .r{color:rgba(255,255,255,.7);}

/* 섹션 라벨(보라) */
.cn-cr-label{font-family:var(--ff-body);font-weight:700;font-size:26px;letter-spacing:1px;color:var(--c-accent);margin-bottom:18px;line-height:1.25;}

/* 표지(A)·마무리(E) 하단 남색 띠 */
.cn-cr-band{position:absolute;left:0;right:0;bottom:0;height:25%;background:var(--cr-navy);z-index:1;overflow:hidden;}
.cn-cr-band .math{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:48px;font-family:var(--ff-title);font-weight:800;font-size:128px;color:#FAF6EA;opacity:.16;letter-spacing:8px;white-space:nowrap;}
.cn-cream.cover .cn-inner{inset:0 0 25% 0;justify-content:center;padding:96px 88px;}
.cn-cream.cover .cn-title{font-size:88px;font-weight:800;line-height:1.18;}
.cn-cr-cat{font-family:var(--ff-body);font-weight:700;font-size:26px;letter-spacing:1px;color:var(--c-accent);margin-bottom:10px;}
.cn-cr-uline{width:44px;height:4px;background:var(--c-accent);border-radius:2px;margin-bottom:26px;}
.cn-cr-cap{font-family:var(--ff-body);font-size:26px;color:var(--c-sub);margin-top:10px;}

/* 비교(B) 세로 2박스 */
.cn-cr-cmp{display:flex;flex-direction:column;gap:18px;margin-top:4px;}
.cn-cr-cmp .box{border-radius:22px;padding:30px 34px;}
.cn-cr-cmp .box.top{background:#fff;border:2px solid var(--c-edge);}
.cn-cr-cmp .box.bot{background:var(--c-accent);}
.cn-cr-cmp .lab{font-family:var(--ff-title);font-weight:700;font-size:42px;line-height:1.2;}
.cn-cr-cmp .box.top .lab{color:var(--c-ink);}
.cn-cr-cmp .box.bot .lab{color:#fff;}
.cn-cr-cmp .uline{width:40px;height:4px;background:var(--c-accent);border-radius:2px;margin:12px 0 14px;}
.cn-cr-cmp .box.bot .uline{background:rgba(255,255,255,.75);}
.cn-cr-cmp .d{font-family:var(--ff-body);font-size:30px;line-height:1.5;}
.cn-cr-cmp .box.top .d{color:var(--c-body);}
.cn-cr-cmp .box.bot .d{color:rgba(255,255,255,.92);}
.cn-cr-note{font-family:var(--ff-body);font-size:30px;color:var(--c-ink);margin-top:20px;line-height:1.5;}

/* 차트(C) 막대 라벨 대비 보정 (밝은 막대 위 글자는 남색) */
.cn-cream .cn-chart .bar:nth-child(1) .bl,.cn-cream .cn-chart .bar:nth-child(2) .bl{color:#262F40;}

/* 번호 리스트(D) */
.cn-cr-nlist{display:flex;flex-direction:column;}
.cn-cr-nlist .row{display:flex;gap:24px;align-items:flex-start;padding:24px 0;}
.cn-cr-nlist .row + .row{border-top:1px solid var(--c-edge);}
.cn-cr-nlist .n{font-family:var(--ff-title);font-weight:800;font-size:52px;color:#A99BEE;flex:none;min-width:72px;line-height:1.05;}
.cn-cr-nlist .vbar{flex:none;width:4px;align-self:stretch;background:var(--c-accent);border-radius:2px;}
.cn-cr-nlist .tx .t{font-family:var(--ff-title);font-weight:700;font-size:40px;color:var(--c-ink);line-height:1.3;}
.cn-cr-nlist .tx .s{font-family:var(--ff-body);font-size:28px;color:var(--c-body);margin-top:6px;line-height:1.45;}

/* 마무리(E) — 위 크림(라벨+제목) / 아래 남색 띠(학원 안내) */
.cn-cream.cr-outro .cn-inner{inset:0;padding:0;}
.cn-cream.cr-outro .cn-heading{font-size:66px;margin-bottom:0;}
.cn-cr-otop{position:absolute;left:88px;right:88px;top:0;height:75%;display:flex;flex-direction:column;justify-content:center;z-index:3;}
.cn-cr-outbox{position:absolute;left:88px;right:88px;bottom:0;height:25%;display:flex;flex-direction:column;justify-content:center;z-index:4;}
.cn-cr-outbox .nm{font-family:var(--ff-title);font-weight:800;font-size:44px;color:#fff;}
.cn-cr-outbox .ln{font-family:var(--ff-body);font-weight:500;font-size:28px;color:rgba(255,255,255,.84);line-height:1.45;margin-top:6px;}

/* 표지/CTA 가운데 정렬 스타일(블루·매거진) */
.cn-blue.cover .cn-title,.cn-magazine.cover .cn-title{text-align:center;}
.cn-blue.cover .cn-badge,.cn-magazine.cover .cn-badge{align-self:center;}
.cn-blue.cover .cn-inner,.cn-magazine.cover .cn-inner{align-items:center;text-align:center;}

/* ===================== 세로형(4:5) 공통 ===================== */
.card-1080.tall{height:1350px;}

/* ===================== ⑮ 손글씨 감성 (흰 배경 + 하늘/빨강 손그림 낙서) ===================== */
.cn-hand{--c-ink:#2B2B2B;--c-accent:#F85540;--c-onacc:#fff;--c-sub:#7a7a7a;--c-body:#3a3a3a;--c-fill:#fff;--c-edge:#eee;--c-logo:#2B2B2B;--sky:#98D0F0;--sky-ul:#C5E6F8;--red:#F85540;--ff-title:'Gaegu',cursive;--ff-body:'Gaegu',cursive;--ls:0;background:#FFFFFF;}
.cn-hand .cn-inner{padding:130px 96px 210px;align-items:center;text-align:center;justify-content:center;}
.cn-hand .cn-title,.cn-hand .cn-heading{font-weight:700;color:var(--c-ink);}
.cn-hand .cn-title{font-size:92px;line-height:1.26;}
.cn-hand .cn-heading{font-size:76px;line-height:1.3;margin-bottom:24px;}
.cn-hand .cn-body{font-family:var(--ff-body);font-size:38px;color:var(--c-body);line-height:1.6;font-weight:400;}
.cn-hand .cn-body + .cn-body{margin-top:16px;}
.cn-hand .hl{background:linear-gradient(transparent 56%, var(--sky-ul) 56% 92%, transparent 92%);padding:0 .08em;border-radius:3px;}
.cn-hand-label{align-self:center;font-family:var(--ff-title);font-weight:700;font-size:34px;color:var(--red);line-height:1.2;display:inline-block;border-bottom:5px solid var(--red);padding-bottom:6px;margin-bottom:42px;}
.cn-hand-num{display:block;margin:0 auto 24px;}
.cn-hand-handle{position:absolute;left:0;right:0;bottom:96px;z-index:8;text-align:center;font-family:'Caveat',cursive;font-weight:700;font-size:50px;color:var(--c-ink);}
.cn-hand .stk{position:absolute;z-index:6;pointer-events:none;}
.cn-hand-photo{margin:30px auto 0;width:80%;border-radius:30px;overflow:hidden;box-shadow:0 10px 24px rgba(0,0,0,.13);}
.cn-hand-photo img{width:100%;display:block;}
.cn-hand-cap{font-family:var(--ff-body);font-size:34px;color:var(--c-body);margin-top:22px;line-height:1.5;}
.cn-hand-arrows{font-family:'Caveat',cursive;font-weight:700;color:var(--red);font-size:72px;line-height:.7;margin-top:30px;letter-spacing:14px;}

/* ===================== ⑯ 손그림 노트 (베이지 + 흰 노트카드 · 무채색+노랑) ===================== */
.cn-note{--c-ink:#303030;--c-accent:#F8C068;--c-onacc:#303030;--c-sub:#8a857e;--c-body:#5A5550;--c-fill:#fff;--c-edge:#303030;--c-logo:#303030;--paper-bg:#EDEAE6;--note:#fff;--ink-soft:#5A5550;--yellow:#F8C068;--ff-title:'Gaegu',cursive;--ff-body:'Gaegu',cursive;--ls:0;background:#EDEAE6;}
.cn-note .notecard{position:absolute;inset:40px;background:var(--note);border:4px solid var(--c-ink);border-radius:46px 52px 44px 50px;z-index:1;}
.cn-note .notecard .dots{position:absolute;top:42px;right:50px;display:flex;gap:18px;align-items:center;}
.cn-note .notecard .dots i{width:26px;height:26px;border-radius:50%;border:3px solid var(--c-ink);display:block;}
.cn-note .notecard .dots i.fill{background:var(--c-ink);}
.cn-note .notecard .baseline{position:absolute;left:64px;right:64px;bottom:150px;height:3px;background:var(--c-ink);opacity:.85;}
.cn-note .notecard .baseline::before{content:"";position:absolute;left:0;top:-7px;width:16px;height:16px;border-radius:50%;background:var(--c-ink);}
.cn-note-pill{position:absolute;left:50%;transform:translateX(-50%);bottom:74px;z-index:8;background:var(--c-ink);color:#fff;font-family:'Caveat',cursive;font-weight:700;font-size:42px;padding:13px 42px;border-radius:999px;}
.cn-note .cn-inner{padding:120px 110px 220px;align-items:center;text-align:center;justify-content:center;}
.cn-note .cn-title,.cn-note .cn-heading{font-weight:700;color:var(--c-ink);}
.cn-note .cn-title{font-size:84px;line-height:1.26;}
.cn-note .cn-heading{font-size:70px;line-height:1.3;margin-bottom:24px;}
.cn-note .cn-body{font-family:var(--ff-body);font-size:36px;color:var(--c-body);line-height:1.6;font-weight:400;}
.cn-note-ill{margin:34px auto 0;width:300px;height:300px;background:var(--c-ink);border-radius:34px;display:flex;align-items:center;justify-content:center;}
.cn-note-ill.sm{width:170px;height:170px;border-radius:26px;margin-top:28px;}
.cn-note-list{display:flex;flex-direction:column;width:100%;margin-top:20px;}
.cn-note-list .row{display:flex;align-items:center;gap:24px;padding:26px 6px;text-align:left;}
.cn-note-list .row + .row{border-top:2px dotted rgba(48,48,48,.42);}
.cn-note-list .n{flex:none;width:66px;height:66px;border-radius:50%;background:var(--yellow);color:var(--c-ink);font-family:var(--ff-title);font-weight:700;font-size:40px;display:flex;align-items:center;justify-content:center;}
.cn-note-list .t{font-family:var(--ff-body);font-size:38px;color:var(--c-ink);line-height:1.35;}
.cn-note-frame{margin:26px auto 0;width:82%;border:4px solid var(--c-ink);border-radius:24px;overflow:hidden;background:#fff;}
.cn-note-frame .pic{height:380px;background:var(--paper-bg);}
.cn-note-frame .pic img{width:100%;height:100%;object-fit:cover;display:block;}
.cn-note-frame .ctrl{display:flex;gap:22px;align-items:center;padding:14px 24px;border-top:3px solid var(--c-ink);font-size:32px;color:var(--c-ink);}

/* ===================== ⑰ 텍스트 캐러셀 (회색 미니멀 고딕 · 좌측정렬) ===================== */
.cn-txt{--c-ink:#404040;--c-accent:#F5C84B;--c-onacc:#222;--c-sub:#9A9A9A;--c-body:#707070;--c-fill:#FAFAFA;--c-edge:#e3e1e1;--c-logo:#9A9A9A;--bg:#F1EFEF;--box:#FAFAFA;--muted:#9A9A9A;--accent:#F5C84B;--ff-title:'Pretendard',sans-serif;--ff-body:'Pretendard',sans-serif;--ls:-1px;background:#F1EFEF;}
.cn-txt .cn-inner{padding:120px 88px 150px;align-items:flex-start;text-align:left;justify-content:center;}
.cn-txt .cn-title{font-family:var(--ff-title);font-weight:400;font-size:60px;line-height:1.32;color:var(--c-ink);letter-spacing:var(--ls);}
.cn-txt .cn-title .hl{font-weight:800;color:var(--c-ink);}
.cn-txt .cn-heading{font-family:var(--ff-title);font-weight:800;font-size:58px;line-height:1.3;color:var(--c-ink);margin-bottom:34px;letter-spacing:var(--ls);}
.cn-txt .cn-heading .hl{color:var(--c-ink);}
.cn-txt .cn-body{font-family:var(--ff-body);font-weight:400;font-size:34px;color:var(--c-body);line-height:1.7;white-space:pre-line;}
.cn-txt .cn-body + .cn-body{margin-top:26px;}
.cn-txt-sub{font-family:var(--ff-body);font-weight:400;font-size:28px;color:var(--muted);line-height:1.5;margin-top:24px;}
.cn-txt-ico{margin-bottom:32px;line-height:0;}
.cn-txt-handle{position:absolute;left:88px;bottom:100px;z-index:8;font-family:var(--ff-body);font-weight:400;font-size:30px;color:var(--muted);}
.cn-txt-box{margin-top:42px;background:var(--box);border:1px solid var(--c-edge);border-radius:22px;padding:34px 36px;display:flex;gap:18px;align-items:flex-start;}
.cn-txt-box .ic{flex:none;font-size:34px;line-height:1.25;color:var(--accent);}
.cn-txt-box .tx{font-family:var(--ff-body);font-weight:700;font-size:34px;color:var(--c-ink);line-height:1.45;}
.cn-txt-follow{margin-top:54px;width:100%;background:var(--box);border:1px solid var(--c-edge);border-radius:26px;padding:30px 32px;display:flex;align-items:center;gap:22px;}
.cn-txt-follow .pf{flex:none;width:88px;height:88px;border-radius:50%;background:#e7e4e4;overflow:hidden;display:flex;align-items:center;justify-content:center;}
.cn-txt-follow .pf img{width:100%;height:100%;object-fit:cover;}
.cn-txt-follow .h{flex:1;font-family:var(--ff-body);font-weight:700;font-size:34px;color:var(--c-ink);}
.cn-txt-follow .b{flex:none;background:#e7e4e4;color:#555;font-family:var(--ff-body);font-weight:700;font-size:28px;padding:14px 28px;border-radius:14px;}
`;
    var s = document.createElement("style");
    s.id = "cn-styles";
    s.textContent = css;
    document.head.appendChild(s);
  }

  /* ---------------- 유틸 ---------------- */
  function esc(t) { var d = document.createElement("div"); d.textContent = t == null ? "" : String(t); return d.innerHTML; }
  function withHighlight(text, hl, cls) {
    cls = cls || "hl";
    var safe = esc(text);
    if (hl && text && String(text).indexOf(hl) !== -1) safe = safe.replace(esc(hl), '<span class="' + cls + '">' + esc(hl) + "</span>");
    return safe;
  }
  function arr(x) { return Array.isArray(x) ? x : x ? [x] : []; }
  function pad2(n) { n = parseInt(n, 10) || 0; return n < 10 ? "0" + n : "" + n; }
  // 막대그래프: 막대 개수에 맞춰 점점 높아지는 높이(%) 배열
  function ascHeights(n) {
    if (n <= 1) return [96];
    var out = [], min = 44;
    for (var i = 0; i < n; i++) out.push(Math.round(min + (96 - min) * i / (n - 1)));
    return out;
  }
  // 막대그래프 본문 (공용 — cream 외 스타일도 사용 가능)
  function chartInner(s, ek) {
    var bars = arr(s.bars).length ? arr(s.bars) : arr(s.steps);
    if (!bars.length) bars = [{}, {}, {}];
    bars = bars.slice(0, 4);
    var hs = ascHeights(bars.length);
    var barHtml = bars.map(function (b, i) {
      b = typeof b === "string" ? { label: b } : (b || {});
      var lab = b.label || b.title || "";
      return '<div class="bar" style="height:' + hs[i] + '%"><span class="bl" data-fs="30"' + EA(ek + ".bars." + i + ".label") + ">" + esc(lab) + "</span></div>";
    }).join("");
    var capHtml = bars.map(function (b, i) {
      b = typeof b === "string" ? {} : (b || {});
      return '<span data-fs="28"' + EA(ek + ".bars." + i + ".sub") + ">" + esc(b.sub || "") + "</span>";
    }).join("");
    return H(s.heading, 56, s.highlight, ek + ".heading") +
      '<div class="cn-chart">' + barHtml + '</div><div class="cn-chart-caps">' + capHtml + "</div>";
  }
  // 편집키 속성 — 미리보기에서 바로 고칠 수 있게(contenteditable) + 저장키(data-ek)
  function EA(key) { return ' contenteditable="true" spellcheck="false" data-ek="' + key + '"'; }

  function logoEl(opts) {
    var el = document.createElement("div");
    el.className = "cn-logo cn-pos-" + (opts.logoPos || "br");
    if (opts.logoDataUrl) {
      var img = document.createElement("img");
      img.src = opts.logoDataUrl;
      if (opts.logoH) img.style.height = opts.logoH + "px";
      if (opts.logoMaxW) img.style.maxWidth = opts.logoMaxW + "px";
      el.appendChild(img);
    } else {
      el.textContent = opts.academyName || "○○학원";
      if (opts.logoH) el.style.fontSize = Math.round(opts.logoH * 0.52) + "px";
    }
    return el;
  }
  function indicator(meta) {
    var dots = "";
    for (var i = 0; i < meta.total; i++) dots += "<b" + (i === meta.index - 1 ? ' class="on"' : "") + "></b>";
    return '<div class="cn-ind"><div class="num">' + pad2(meta.index) + " / " + pad2(meta.total) +
      '</div><div class="dots">' + dots + "</div></div>";
  }

  /* 스타일별 시그니처 장식 (cta 카드는 깔끔하게 장식 생략) */
  function deco(style, isCover, isCta) {
    if (isCta) return "";
    switch (style) {
      case "yellow": return '<div class="ycorner"></div>' + (isCover ? '<div class="uline"></div>' : "");
      case "blue": return '<div class="win"></div><div class="dots3"><i></i><i></i><i></i></div><div class="xmark">✕</div>';
      case "paper": return isCover ? '<div class="paper-bg p1"></div><div class="paper-bg p2"></div><div class="paper"></div>' : '<div class="paper"></div>';
      case "navy": return '<div class="goldline"></div>';
      case "pastel": return '<div class="blob b1"></div><div class="blob b2"></div>';
      case "dark": return '<div class="neon"></div>';
      case "magazine": return '<div class="magtop"><span class="cat">CARD NEWS</span><span class="ed">Editorial</span></div>';
      case "craft": return '<div class="craftcard"></div>' + (isCover ? '<div class="tape"></div>' : "");
      case "minimal": return isCover ? '<div class="mrule"></div>' : "";
      case "chalk": return '<div class="chalkframe"></div>';
      case "info": return "";
      case "kids": return '<span class="kblob kb1"></span><span class="kblob kb2"></span><span class="kblob kb3"></span>';
      default: return "";
    }
  }

  /* ---------------- 매거진 에디토리얼 전용 조각 ---------------- */
  function edLabel(s) {
    return s && s.label ? '<div class="cn-seclabel"><span class="sq"></span><span class="lb">' + esc(s.label) + "</span></div>" : "";
  }
  function edList(s, ek) {
    return H(s.heading, 56, s.highlight, ek + ".heading") + '<div class="cn-ed-list">' +
      arr(s.items).map(function (it, i) {
        return '<div class="row"><span class="n">' + pad2(i + 1) + '</span><span class="t" data-fs="42"' + EA(ek + ".items." + i) + ">" + esc(it) + "</span></div>";
      }).join("") + "</div>";
  }
  function edFig(s, ek) {
    var head = H(s.heading, 54, s.highlight, ek + ".heading");
    if (s._img) {
      // 각진 도판 + 캡션(FIG. 번호 자동) — 도판 아래 흐름이 있으면 함께
      var flow = arr(s.flow);
      var flowHtml = flow.length
        ? '<div class="cn-ed-flow">' + flow.map(function (w, i) {
            return (i ? '<span class="a">→</span>' : "") + '<span class="w" data-fs="38"' + EA(ek + ".flow." + i) + ">" + esc(w) + "</span>";
          }).join("") + "</div>"
        : "";
      return head + '<div class="cn-ed-fig"><div class="shadow"></div><div class="frame"><img src="' + s._img + '" alt=""></div></div>' +
        (s.caption ? '<div class="cn-ed-fig-cap" data-fs="30"' + EA(ek + ".caption") + ">" + esc(s.caption) + "</div>" : "") + flowHtml;
    }
    // 사진 없으면 빈 도판 대신 텍스트 카드로
    return head + (s.caption ? '<div class="cn-body" data-fs="40"' + EA(ek + ".caption") + ">" + esc(s.caption) + "</div>" : "");
  }
  function edCta(s, ek, opts) {
    var name = (opts && opts.academyName) || "우리 학원";
    return '<div class="cn-ed-cta">' +
      '<h3 class="cn-heading" data-fs="74"' + EA(ek + ".title") + ">" + withHighlight(s.title || s.heading || "함께해요", s.highlight) + "</h3>" +
      (s.sub ? '<div class="cn-sub" data-fs="34"' + EA(ek + ".sub") + ">" + esc(s.sub) + "</div>" : "") +
      '<div class="box"><div class="name"' + EA(ek + ".name") + ">" + esc(name) + "</div><div class=\"ln\"></div>" +
        (s.tel ? '<div class="row"><span class="k">문의</span><span class="v" data-fs="32"' + EA(ek + ".tel") + ">" + esc(s.tel) + "</span></div>" : "") +
        (s.button ? '<div class="row"><span class="k">신청</span><span class="v" data-fs="32"' + EA(ek + ".button") + ">" + esc(s.button) + "</span></div>" : "") +
      "</div></div>";
  }
  /* ---------------- 크림·보라 전용 조각 (레이아웃 디자인 시스템) ---------------- */
  function creamLabel(s, ek) {
    if (!s || !s.label) return "";
    return '<div class="cn-cr-label" data-fs="26"' + (ek ? EA(ek + ".label") : "") + ">" + esc(s.label) + "</div>";
  }
  function creamCover(c, ek, opts) {
    var cat = c.badge || c.kicker || c.label || (opts && opts.subject) || "";
    return (cat ? '<div class="cn-cr-cat" data-fs="26"' + EA(ek + ".badge") + ">" + esc(cat) + "</div>" : "") +
      '<div class="cn-cr-uline"></div>' +
      '<h3 class="cn-title" data-fs="88"' + EA(ek + ".title") + ">" + withHighlight(c.title, c.highlight) + "</h3>" +
      (c.sub ? '<div class="cn-sub" data-fs="30"' + EA(ek + ".sub") + ">" + esc(c.sub) + "</div>" : "") +
      (c.cap ? '<div class="cn-cr-cap" data-fs="26"' + EA(ek + ".cap") + ">" + esc(c.cap) + "</div>" : "");
  }
  function creamCompare(s, ek) {
    var L = s.left || {}, R = s.right || {};
    return H(s.heading, 56, s.highlight, ek + ".heading") +
      '<div class="cn-cr-cmp">' +
        '<div class="box top"><div class="lab" data-fs="42"' + EA(ek + ".left.label") + ">" + esc(L.label || "") + '</div><div class="uline"></div><div class="d" data-fs="30"' + EA(ek + ".left.body") + ">" + esc(L.body || "") + "</div></div>" +
        '<div class="box bot"><div class="lab" data-fs="42"' + EA(ek + ".right.label") + ">" + esc(R.label || "") + '</div><div class="uline"></div><div class="d" data-fs="30"' + EA(ek + ".right.body") + ">" + esc(R.body || "") + "</div></div>" +
      "</div>" +
      (s.note ? '<div class="cn-cr-note" data-fs="30"' + EA(ek + ".note") + ">" + esc(s.note) + "</div>" : "");
  }
  function creamList(s, ek) {
    // items(리스트/체크) 또는 steps(단계) 어느 쪽이든 번호 리스트로 렌더
    var useSteps = !arr(s.items).length && arr(s.steps).length;
    var rows = useSteps ? arr(s.steps) : arr(s.items);
    var base = useSteps ? "steps" : "items";
    return H(s.heading, 56, s.highlight, ek + ".heading") + '<div class="cn-cr-nlist">' +
      rows.slice(0, 4).map(function (it, i) {
        var isStr = typeof it === "string";
        var t = isStr ? it : (it && (it.title || it.label)) || "";
        var sub = !isStr && it ? it.sub : "";
        // 문자열 항목은 그 칸 자체가 키, 객체는 .title(또는 단계는 .label) / .sub
        var titleKey = isStr ? (ek + "." + base + "." + i) : (ek + "." + base + "." + i + "." + (useSteps ? "label" : "title"));
        return '<div class="row"><span class="n">' + pad2(i + 1) + '</span><span class="vbar"></span>' +
          '<div class="tx"><div class="t" data-fs="40"' + EA(titleKey) + ">" + esc(t) + "</div>" +
          (sub ? '<div class="s" data-fs="28"' + EA(ek + "." + base + "." + i + ".sub") + ">" + esc(sub) + "</div>" : "") + "</div></div>";
      }).join("") + "</div>";
  }
  function creamCta(s, ek, opts) {
    var name = (opts && opts.academyName) || "우리 학원";
    var loc = (opts && opts.region) || "";
    var guide = s.sub || "상담 문의는 편하게 연락 주세요";
    return '<div class="cn-cr-otop">' + creamLabel(s, ek) +
        '<h3 class="cn-heading" data-fs="66"' + EA(ek + ".title") + ">" + withHighlight(s.title || s.heading || "함께해요", s.highlight) + "</h3>" +
      "</div>" +
      '<div class="cn-cr-outbox">' +
        '<div class="nm" data-fs="44"' + EA(ek + ".name") + ">" + esc(name) + "</div>" +
        (loc ? '<div class="ln">' + esc(loc) + "</div>" : "") +
        '<div class="ln" data-fs="28"' + EA(ek + ".sub") + ">" + esc(guide) + "</div>" +
        (s.tel ? '<div class="ln" data-fs="28"' + EA(ek + ".tel") + ">" + esc(s.tel) + "</div>" : "") +
      "</div>";
  }
  // 크림 표지/마무리 하단 남색 띠
  function creamBand(format) {
    if (format === "cover") return '<div class="cn-cr-band"><div class="math">+ − × ÷ =</div></div>';
    if (format === "cta") return '<div class="cn-cr-band"></div>';
    return "";
  }
  // 크림 공통 푸터(빨간 점 + 학원명 + n/N) — 마무리 카드는 남색 띠에 학원 안내가 있어 생략
  function creamChrome(opts, meta, format) {
    if (format === "cta") return "";
    var name = opts.logoDataUrl ? '<img src="' + opts.logoDataUrl + '" alt="">' : esc(opts.academyName || "○○학원");
    return '<div class="cn-cr-foot"><span class="l"><span class="dot"></span>' + name + "</span>" +
      '<span class="r">' + pad2(meta.index) + " / " + pad2(meta.total) + "</span></div>";
  }

  function editorialChrome(opts, meta) {
    var headL = esc(opts.academyName || "○○학원") + (opts.subject ? " · " + esc(opts.subject) : "");
    var footL = opts.logoDataUrl ? '<img src="' + opts.logoDataUrl + '" alt="">' : esc(opts.academyName || "○○학원");
    var footR = [opts.region, opts.subject].filter(Boolean).map(esc).join(" · ");
    return '<div class="cn-ed-head"><span class="l">' + headL + '</span><span class="r">ISSUE ' + pad2(meta.index) + " / " + pad2(meta.total) + "</span></div>" +
      '<div class="cn-ed-foot"><span class="l">' + footL + '</span><span class="r">' + footR + "</span></div>";
  }

  /* ---------------- 세로형 3종 공통: 인스타 핸들 ---------------- */
  // ⚠️ 학원 인스타 계정 자리(@reallygreatsite 등은 샘플). 학원명에서 임시 핸들 생성.
  function handleOf(opts) {
    var n = (opts && opts.academyName) || "우리학원";
    return "@" + String(n).replace(/\s+/g, "").toLowerCase();
  }

  /* ---------------- ⑮ 손글씨 감성 전용 조각 (SVG 손그림 낙서) ---------------- */
  function handStarPair() {
    return '<svg viewBox="0 0 170 100" width="100%" height="100%" fill="none" stroke="#F85540" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"><path d="M50 10 L60 36 L88 36 L65 53 L74 82 L50 65 L26 82 L35 53 L12 36 L40 36 Z"/><path d="M128 44 L135 62 L156 62 L139 75 L146 95 L128 82 L110 95 L117 75 L100 62 L121 62 Z"/></svg>';
  }
  function handCat() {
    return '<svg viewBox="0 0 120 105" width="100%" height="100%" fill="none" stroke="#98D0F0" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M22 46 L30 14 L50 32"/><path d="M98 46 L90 14 L70 32"/><path d="M22 46 C14 88 30 100 60 100 C90 100 106 88 98 46"/><circle cx="45" cy="58" r="3.5" fill="#98D0F0" stroke="none"/><circle cx="75" cy="58" r="3.5" fill="#98D0F0" stroke="none"/><path d="M52 66 q8 8 16 0"/></svg>';
  }
  function handCloud() {
    return '<svg viewBox="0 0 130 70" width="100%" height="100%" fill="none" stroke="#98D0F0" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M28 62 C8 62 10 40 30 40 C30 18 64 16 70 36 C92 24 110 44 96 52 C118 52 116 62 100 62 Z"/></svg>';
  }
  function handCircleNum(n) {
    return '<svg class="cn-hand-num" viewBox="0 0 110 110" width="110" height="110"><ellipse cx="55" cy="55" rx="44" ry="40" fill="none" stroke="#F85540" stroke-width="4"/><text x="55" y="74" text-anchor="middle" font-family="Gaegu,cursive" font-weight="700" font-size="56" fill="#F85540">' + esc(n) + "</text></svg>";
  }
  function handNum(ek) { var n = parseInt(String(ek).replace(/\D/g, ""), 10); return handCircleNum(isNaN(n) ? 1 : n + 1); }
  // 스티커 + 핸들 (카드 본문 밖 절대배치 — autoFit에 영향 없음)
  function handChrome(opts, meta, format) {
    var out = '<div class="stk" style="top:96px;right:84px;width:150px;height:92px;">' + handStarPair() + "</div>";
    if (format === "cover") {
      out += '<div class="stk" style="left:130px;bottom:330px;width:150px;height:84px;">' + handCloud() + "</div>";
      out += '<div class="stk" style="left:50%;transform:translateX(-50%);bottom:236px;width:176px;height:150px;">' + handCat() + "</div>";
    } else if (format === "cta") {
      out += '<div class="stk" style="left:50%;transform:translateX(-50%);top:160px;width:176px;height:150px;">' + handCat() + "</div>";
    } else {
      var even = meta.index % 2 === 0;
      out += '<div class="stk" style="' + (even ? "left:110px" : "right:110px") + ';bottom:250px;width:150px;height:84px;">' + (even ? handCloud() : handCat()) + "</div>";
    }
    if (format === "cover" || format === "cta") out += '<div class="cn-hand-handle">' + esc(handleOf(opts)) + "</div>";
    return out;
  }
  function handCover(c, ek, opts) {
    var label = c.badge || c.kicker || c.label || (opts && opts.subject) || "컨텐츠 노하우";
    return '<div class="cn-hand-label" data-fs="34"' + EA(ek + ".badge") + ">" + esc(label) + "</div>" +
      '<h3 class="cn-title" data-fs="92"' + EA(ek + ".title") + ">" + withHighlight(c.title, c.highlight) + "</h3>" +
      (c.sub ? '<div class="cn-body" data-fs="38"' + EA(ek + ".sub") + ">" + esc(c.sub) + "</div>" : "");
  }
  function handFormat(s, ek, opts) {
    var f = FORMATS.indexOf(s.format) !== -1 ? s.format : "text";
    var head = s.heading ? '<div class="cn-heading" data-fs="76"' + EA(ek + ".heading") + ">" + withHighlight(s.heading, s.highlight) + "</div>" : "";
    if (f === "cta") {
      return '<div class="cn-heading" data-fs="72"' + EA(ek + ".title") + ">" + withHighlight(s.title || s.heading || "팔로우 하시고\n다양한 소식을 만나보세요", s.highlight) + "</div>" +
        (s.sub ? '<div class="cn-body" data-fs="38"' + EA(ek + ".sub") + ">" + esc(s.sub) + "</div>" : "") +
        '<div class="cn-hand-arrows">↓ ↓ ↓</div>';
    }
    if (f === "imagecaption" && s._img) {
      return handNum(ek) + head + '<div class="cn-hand-photo"><img src="' + s._img + '" alt=""></div>' +
        (s.caption ? '<div class="cn-hand-cap" data-fs="34"' + EA(ek + ".caption") + ">" + esc(s.caption) + "</div>" : "");
    }
    var body = "";
    if (arr(s.items).length) {
      body = arr(s.items).map(function (it, i) { return '<div class="cn-body" data-fs="38"' + EA(ek + ".items." + i) + ">" + esc(it) + "</div>"; }).join("");
    } else if (s.body) {
      body = '<div class="cn-body" data-fs="38"' + EA(ek + ".body") + ">" + esc(s.body) + "</div>";
    } else if (s.caption) {
      body = '<div class="cn-body" data-fs="38"' + EA(ek + ".caption") + ">" + esc(s.caption) + "</div>";
    }
    return handNum(ek) + head + body;
  }

  /* ---------------- ⑯ 손그림 노트 전용 조각 ---------------- */
  function noteMascot() {
    return '<svg viewBox="0 0 120 120" width="62%" height="62%" fill="none"><path d="M60 16 C28 16 22 46 26 72 C30 98 50 106 60 106 C70 106 90 98 94 72 C98 46 92 16 60 16 Z" fill="#fff"/><circle cx="46" cy="62" r="5" fill="#303030"/><circle cx="74" cy="62" r="5" fill="#303030"/><path d="M50 78 q10 10 20 0" stroke="#303030" stroke-width="4" stroke-linecap="round" fill="none"/><circle cx="36" cy="74" r="6" fill="#F8C068"/><circle cx="84" cy="74" r="6" fill="#F8C068"/></svg>';
  }
  function noteIll(sm) { return '<div class="cn-note-ill' + (sm ? " sm" : "") + '">' + noteMascot() + "</div>"; }
  function noteCardFrame() { return '<div class="notecard"><span class="dots"><i></i><i class="fill"></i></span><span class="baseline"></span></div>'; }
  function notePill(opts) { return '<div class="cn-note-pill">' + esc(handleOf(opts)) + "</div>"; }
  function noteCover(c, ek, opts) {
    return '<h3 class="cn-title" data-fs="84"' + EA(ek + ".title") + ">" + withHighlight(c.title, c.highlight) + "</h3>" +
      (c.sub ? '<div class="cn-body" data-fs="36"' + EA(ek + ".sub") + ">" + esc(c.sub) + "</div>" : "") + noteIll(false);
  }
  function noteFormat(s, ek, opts) {
    var f = FORMATS.indexOf(s.format) !== -1 ? s.format : "text";
    var head = s.heading ? '<div class="cn-heading" data-fs="70"' + EA(ek + ".heading") + ">" + withHighlight(s.heading, s.highlight) + "</div>" : "";
    if (f === "imagecaption") {
      var pic = s._img ? '<div class="pic"><img src="' + s._img + '" alt=""></div>' : '<div class="pic"></div>';
      return head + '<div class="cn-note-frame">' + pic + '<div class="ctrl"><span>&#9776;</span><span>&#9632;</span></div></div>' +
        (s.caption ? '<div class="cn-body" data-fs="36"' + EA(ek + ".caption") + ">" + esc(s.caption) + "</div>" : "");
    }
    if (f === "list" || f === "check" || f === "step") {
      var useSteps = !arr(s.items).length && arr(s.steps).length;
      var rows = useSteps ? arr(s.steps) : arr(s.items);
      var base = useSteps ? "steps" : "items";
      var intro = s.body ? '<div class="cn-body" data-fs="36"' + EA(ek + ".body") + ">" + esc(s.body) + "</div>" : "";
      return head + intro + '<div class="cn-note-list">' + rows.slice(0, 4).map(function (it, i) {
        var isStr = typeof it === "string";
        var t = isStr ? it : (it && (it.title || it.label)) || "";
        var key = isStr ? (ek + "." + base + "." + i) : (ek + "." + base + "." + i + "." + (useSteps ? "label" : "title"));
        return '<div class="row"><span class="n">' + (i + 1) + '</span><span class="t" data-fs="38"' + EA(key) + ">" + esc(t) + "</span></div>";
      }).join("") + "</div>";
    }
    if (f === "cta") {
      var txt = s.body || s.sub || "";
      return head + (txt ? '<div class="cn-body" data-fs="36"' + EA(ek + (s.body ? ".body" : ".sub")) + ">" + esc(txt) + "</div>" : "") + noteIll(true);
    }
    var body = s.body ? '<div class="cn-body" data-fs="36"' + EA(ek + ".body") + ">" + esc(s.body) + "</div>"
      : (s.caption ? '<div class="cn-body" data-fs="36"' + EA(ek + ".caption") + ">" + esc(s.caption) + "</div>" : "");
    return head + noteIll(true) + body;
  }

  /* ---------------- ⑰ 텍스트 캐러셀 전용 조각 ---------------- */
  function txtBookmark() {
    return '<svg viewBox="0 0 40 52" width="40" height="52"><path d="M6 3 H34 V49 L20 38 L6 49 Z" fill="none" stroke="#404040" stroke-width="3.5" stroke-linejoin="round"/></svg>';
  }
  function txtChrome(opts, format) {
    return format === "cover" ? '<div class="cn-txt-handle">' + esc(handleOf(opts)) + "</div>" : "";
  }
  function txtCover(c, ek, opts) {
    return '<div class="cn-txt-ico">' + txtBookmark() + "</div>" +
      '<h3 class="cn-title" data-fs="60"' + EA(ek + ".title") + ">" + withHighlight(c.title, c.highlight) + "</h3>" +
      (c.sub ? '<div class="cn-txt-sub" data-fs="28"' + EA(ek + ".sub") + ">" + esc(c.sub) + "</div>" : "");
  }
  function txtFormat(s, ek, opts) {
    var f = FORMATS.indexOf(s.format) !== -1 ? s.format : "text";
    if (f === "cta") {
      var pf = opts && opts.logoDataUrl ? '<img src="' + opts.logoDataUrl + '" alt="">' : "";
      return '<h3 class="cn-heading" data-fs="58"' + EA(ek + ".title") + ">" + withHighlight(s.title || s.heading || "팔로우하시고\n더 많은 소식을 받아보세요", s.highlight) + "</h3>" +
        (s.sub ? '<div class="cn-txt-sub" data-fs="28"' + EA(ek + ".sub") + ">" + esc(s.sub) + "</div>" : "") +
        '<div class="cn-txt-follow"><span class="pf">' + pf + '</span><span class="h">' + esc(handleOf(opts)) + '</span><span class="b">팔로우</span></div>';
    }
    var head = s.heading ? '<div class="cn-heading" data-fs="58"' + EA(ek + ".heading") + ">" + withHighlight(s.heading, s.highlight) + "</div>" : "";
    var body = "";
    if (s.body) body = '<div class="cn-body" data-fs="34"' + EA(ek + ".body") + ">" + esc(s.body) + "</div>";
    else if (arr(s.items).length) body = arr(s.items).map(function (it, i) { return '<div class="cn-body" data-fs="34"' + EA(ek + ".items." + i) + ">" + esc(it) + "</div>"; }).join("");
    var box = s.note ? '<div class="cn-txt-box"><span class="ic">&#9733;</span><span class="tx" data-fs="34"' + EA(ek + ".note") + ">" + esc(s.note) + "</span></div>" : "";
    return head + body + box;
  }

  /* ---------------- 양식별 내부 HTML ---------------- */
  function coverInner(style, c, ek, opts) {
    if (style === "hand") return handCover(c, ek, opts);
    if (style === "note") return noteCover(c, ek, opts);
    if (style === "txt") return txtCover(c, ek, opts);
    if (style === "cream") return creamCover(c, ek, opts);
    if (style === "editorial") {
      return edLabel(c) +
        '<h3 class="cn-title" data-fs="104"' + EA(ek + ".title") + ">" + withHighlight(c.title, c.highlight, "hl") + "</h3>" +
        '<div class="cn-uline"></div>' +
        (c.sub ? '<div class="cn-sub" data-fs="34"' + EA(ek + ".sub") + ">" + esc(c.sub) + "</div>" : "");
    }
    var titleCls = style === "paper" ? "uacc" : "hl";
    return (
      (c.badge ? '<div class="cn-badge" data-fs="30"' + EA(ek + ".badge") + ">" + esc(c.badge) + "</div>" : "") +
      (c.kicker ? '<div class="cn-kicker" data-fs="40"' + EA(ek + ".kicker") + ">" + esc(c.kicker) + "</div>" : "") +
      '<h3 class="cn-title" data-fs="92"' + EA(ek + ".title") + ">" + withHighlight(c.title, c.highlight, titleCls) + "</h3>" +
      (c.sub ? '<div class="cn-sub" data-fs="36"' + EA(ek + ".sub") + ">" + esc(c.sub) + "</div>" : "") +
      '<div class="cn-go" data-fs="29">→ 넘겨서 확인하기</div>'
    );
  }

  function H(txt, fs, hl, ek) { return '<div class="cn-heading" data-fs="' + (fs || 60) + '"' + (ek ? EA(ek) : "") + ">" + withHighlight(txt, hl) + "</div>"; }

  function formatInner(style, s, ek, opts) {
    if (style === "hand") return handFormat(s, ek, opts);
    if (style === "note") return noteFormat(s, ek, opts);
    if (style === "txt") return txtFormat(s, ek, opts);
    if (style === "cream") {
      var fc = FORMATS.indexOf(s.format) !== -1 ? s.format : "text";
      if (fc === "cta") return creamCta(s, ek, opts);                       // 마무리(E)
      var lab = creamLabel(s, ek);
      if (fc === "compare") return lab + creamCompare(s, ek);               // 비교(B) 세로 2박스
      if (fc === "chart") return lab + chartInner(s, ek);                          // 막대그래프(C) — 명시적 chart만
      if (fc === "list" || fc === "check" || fc === "step") return lab + creamList(s, ek); // 번호 리스트(D)
      return lab + formatInnerBase(s, ek);                                  // 그 외는 공용(크림 테마)
    }
    if (style === "editorial") {
      var f0 = FORMATS.indexOf(s.format) !== -1 ? s.format : "text";
      var lab = edLabel(s);
      if (f0 === "list" || f0 === "check") return lab + edList(s, ek);     // 번호 목록
      if (f0 === "imagecaption") return lab + edFig(s, ek);                 // FIG 도판
      if (f0 === "cta") return lab + edCta(s, ek, opts);                    // 정보 박스
      return lab + formatInnerBase(s, ek);                                  // 그 외는 공용(테마만 적용)
    }
    return formatInnerBase(s, ek);
  }

  function formatInnerBase(s, ek) {
    var f = FORMATS.indexOf(s.format) !== -1 ? s.format : "text";
    switch (f) {
      case "list":
        return H(s.heading, 58, s.highlight, ek + ".heading") + '<div class="cn-list">' +
          arr(s.items).map(function (it, i) { return '<div class="item' + (i === s.emphasizeIndex ? " on" : "") + '" data-fs="40"' + EA(ek + ".items." + i) + ">" + esc(it) + "</div>"; }).join("") + "</div>";
      case "check":
        return H(s.heading, 56, s.highlight, ek + ".heading") + '<div class="cn-check">' +
          arr(s.items).map(function (it, i) {
            return '<div class="ck' + (i === s.emphasizeIndex ? " on" : "") + '"><span class="ic">✓</span><span class="tx" data-fs="38"' + EA(ek + ".items." + i) + ">" + esc(it) + "</span></div>";
          }).join("") + "</div>";
      case "stat":
        return '<div class="cn-stat"><div class="num" data-fs="150"' + EA(ek + ".number") + ">" + esc(s.number || "") +
          (s.unit ? "<small>" + esc(s.unit) + "</small>" : "") + "</div>" +
          (s.heading ? '<div class="desc" data-fs="44"' + EA(ek + ".heading") + ">" + withHighlight(s.heading, s.highlight) + "</div>" : "") +
          (s.source ? '<div class="src" data-fs="28"' + EA(ek + ".source") + ">" + esc(s.source) + "</div>" : "") + "</div>";
      case "step":
        return H(s.heading, 56, s.highlight, ek + ".heading") + '<div class="cn-step">' +
          arr(s.steps).map(function (st, i) {
            var label = typeof st === "string" ? st : (st && st.label) || "";
            var sub = typeof st === "object" && st ? st.sub : "";
            return '<div class="s"><div class="n" data-fs="44">' + (i + 1) + '</div><div><div class="st-l" data-fs="42"' + EA(ek + ".steps." + i + ".label") + ">" + esc(label) + "</div>" +
              (sub ? '<div class="st-s" data-fs="30"' + EA(ek + ".steps." + i + ".sub") + ">" + esc(sub) + "</div>" : "") + "</div></div>";
          }).join("") + "</div>";
      case "compare":
        var L = s.left || {}, R = s.right || {};
        return H(s.heading, 56, s.highlight, ek + ".heading") + '<div class="cn-cmp">' +
          '<div class="col"><div class="lab" data-fs="46"' + EA(ek + ".left.label") + ">" + esc(L.label || "") + '</div><div class="d" data-fs="35"' + EA(ek + ".left.body") + ">" + esc(L.body || "") + "</div></div>" +
          '<div class="vs" data-fs="56">VS</div>' +
          '<div class="col"><div class="lab" data-fs="46"' + EA(ek + ".right.label") + ">" + esc(R.label || "") + '</div><div class="d" data-fs="35"' + EA(ek + ".right.body") + ">" + esc(R.body || "") + "</div></div></div>";
      case "beforeafter":
        return H(s.heading, 54, s.highlight, ek + ".heading") + '<div class="cn-ba">' +
          '<div class="box before"><div class="bt">BEFORE</div><div class="bp" data-fs="37"' + EA(ek + ".before") + ">" + esc(s.before || "") + "</div></div>" +
          '<div class="arrow">↓</div>' +
          '<div class="box after"><div class="bt">AFTER</div><div class="bp" data-fs="37"' + EA(ek + ".after") + ">" + esc(s.after || "") + "</div></div></div>";
      case "quote":
        return '<div class="cn-quote"><div class="mark">&ldquo;</div><div class="q" data-fs="58"' + EA(ek + ".quote") + ">" + withHighlight(s.quote || s.body || "", s.highlight) + "</div>" +
          (s.who ? '<div class="who" data-fs="36"' + EA(ek + ".who") + ">— " + esc(s.who) + "</div>" : "") + "</div>";
      case "qa":
        return '<div class="cn-qa">' + arr(s.items).map(function (p, i) {
          p = p || {};
          return '<div><div class="q" data-fs="44"><b>Q.</b> <span' + EA(ek + ".items." + i + ".q") + ">" + esc(p.q || "") + '</span></div><div class="a" data-fs="37"><b>A.</b> <span' + EA(ek + ".items." + i + ".a") + ">" + esc(p.a || "") + "</span></div></div>";
        }).join("") + "</div>";
      case "imagecaption":
        if (s._img) {
          // 첨부한 실제 사진을 카드에 그대로 넣음 (편집 불필요)
          return '<div class="cn-imgcap">' + H(s.heading, 54, s.highlight, ek + ".heading") +
            '<div class="photo"><img src="' + s._img + '" alt=""></div>' +
            (s.caption ? '<div class="cn-body" data-fs="37"' + EA(ek + ".caption") + ">" + esc(s.caption) + "</div>" : "") + "</div>";
        }
        // 사진이 없으면 빈 자리표시 대신 일반 텍스트 카드로 (휑한 빈칸 방지)
        return H(s.heading, 58, s.highlight, ek + ".heading") +
          (s.caption ? '<div class="cn-body" data-fs="42"' + EA(ek + ".caption") + ">" + esc(s.caption) + "</div>" : "");
      case "chart":
        return chartInner(s, ek);
      case "cta":
        return '<div class="cn-cta">' +
          (s.badge ? '<div class="b" data-fs="30"' + EA(ek + ".badge") + ">" + esc(s.badge) + "</div>" : "") +
          '<div class="t" data-fs="74"' + EA(ek + ".title") + ">" + esc(s.title || s.heading || "지금 신청하세요") + "</div>" +
          (s.sub ? '<div class="s" data-fs="34"' + EA(ek + ".sub") + ">" + esc(s.sub) + "</div>" : "") +
          '<div class="btn" data-fs="40"' + EA(ek + ".button") + ">" + esc(s.button || "지금 신청하기") + " →</div>" +
          (s.tel ? '<div class="tel" data-fs="28"' + EA(ek + ".tel") + ">" + esc(s.tel) + "</div>" : "") + "</div>";
      default:
        return H(s.heading, 60, s.highlight, ek + ".heading") + (s.body ? '<div class="cn-body" data-fs="42"' + EA(ek + ".body") + ">" + esc(s.body) + "</div>" : "");
    }
  }

  /* ---------------- 브랜드 컬러 주입 ---------------- */
  // opts.brandMain → 카드 악센트(배지/CTA/테두리), opts.brandPoint → 강조 단어(.hl)
  // 글자색(--c-onacc)은 배경 명도에 따라 흰/검 자동 선택 (WCAG 대비 확보)
  function applyBrand(el, opts) {
    if (opts.brandMain) {
      el.style.setProperty("--c-accent", opts.brandMain);
      el.style.setProperty("--c-onacc", readableOn(opts.brandMain));
      // 포인트가 따로 없으면 강조 단어도 메인색으로 통일
      el.style.setProperty("--c-hl", opts.brandPoint || opts.brandMain);
    } else if (opts.brandPoint) {
      el.style.setProperty("--c-hl", opts.brandPoint);
    }
  }
  // 배경색 위에 올릴 글자색(흰/검) 자동 판별 — 상대휘도 기반
  function readableOn(hex) {
    var c = hexToRgb(hex);
    if (!c) return "#ffffff";
    var L = relLum(c);
    // 흰색(L=1)/검정(L=0) 중 대비비가 큰 쪽 선택
    var contrastWhite = (1 + 0.05) / (L + 0.05);
    var contrastBlack = (L + 0.05) / 0.05;
    return contrastWhite >= contrastBlack ? "#ffffff" : "#161616";
  }
  function hexToRgb(hex) {
    if (!hex) return null;
    hex = String(hex).trim().replace(/^#/, "");
    if (hex.length === 3) hex = hex.split("").map(function (x) { return x + x; }).join("");
    if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null;
    return { r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4, 6), 16) };
  }
  function relLum(c) {
    var a = [c.r, c.g, c.b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }

  /* ---------------- 카드 조립 ---------------- */
  function buildCard(style, format, innerHtml, opts, meta) {
    var isEd = style === "editorial";
    var isCream = style === "cream";
    var isTall = !!TALL[style];
    var isCover = format === "cover";
    var isCta = format === "cta" && !isEd && !isCream && !isTall; // 에디토리얼·크림·세로형 CTA는 메인색 채움 X
    var c = document.createElement("div");
    c.className = "card-1080 cn-" + style + (isCover ? " cover" : " content") + (isCta ? " ctacard" : "") +
      (isCream && format === "cta" ? " cr-outro" : "") + (isTall ? " tall" : "");
    if (opts.logoH) c.style.setProperty("--logo-h", opts.logoH + "px");
    if (opts.logoMaxW) c.style.setProperty("--logo-maxw", opts.logoMaxW + "px");
    applyBrand(c, opts);
    if (isEd) {
      // 에디토리얼: 하단 인디케이터/로고 대신 러닝헤드·풋(ISSUE 번호) 사용
      c.innerHTML = '<div class="cn-inner">' + innerHtml + "</div>" + editorialChrome(opts, meta);
    } else if (isCream) {
      // 크림: 표지/마무리 남색 띠 + 공통 푸터(빨간 점·학원명·n/N)
      c.innerHTML = creamBand(format) + '<div class="cn-inner">' + innerHtml + "</div>" + creamChrome(opts, meta, format);
    } else if (style === "hand") {
      // 손글씨 감성: 손그림 스티커 + @핸들(표지·CTA)
      c.innerHTML = '<div class="cn-inner">' + innerHtml + "</div>" + handChrome(opts, meta, format);
    } else if (style === "note") {
      // 손그림 노트: 흰 노트카드 프레임 + 알약 핸들(모든 카드)
      c.innerHTML = noteCardFrame() + '<div class="cn-inner">' + innerHtml + "</div>" + notePill(opts);
    } else if (style === "txt") {
      // 텍스트 캐러셀: 표지에만 @핸들(좌하단)
      c.innerHTML = '<div class="cn-inner">' + innerHtml + "</div>" + txtChrome(opts, format);
    } else {
      c.innerHTML = deco(style, isCover, isCta) + '<div class="cn-inner">' + innerHtml + "</div>" + indicator(meta);
      c.appendChild(logoEl(opts));
    }
    return c;
  }

  /* ---------------- 글씨 자동 축소 (실측 렌더 높이 기준) ---------------- */
  function autoFit(card) {
    var inner = card.querySelector(".cn-inner");
    if (!inner) return;
    var els = card.querySelectorAll("[data-fs]");
    if (!els.length) return;
    var scale = 1, guard = 0;
    function apply() { els.forEach(function (el) { el.style.fontSize = Math.round(parseFloat(el.dataset.fs) * scale) + "px"; }); }
    var saved = inner.style.justifyContent;
    inner.style.justifyContent = "flex-start";
    apply();
    // 실제 렌더된 높이(scrollHeight)가 카드 안(clientHeight)을 넘으면 단계적으로 축소
    while (inner.scrollHeight > inner.clientHeight + 1 && scale > 0.4 && guard < 60) { scale -= 0.05; apply(); guard++; }
    inner.style.justifyContent = saved;
  }

  /* ---------------- 공개 API ---------------- */
  function render(style, data, opts) {
    injectStyles();
    opts = opts || {};
    style = STYLES.indexOf(style) !== -1 ? style : "yellow";
    data = data || {};
    var slides = data.slides || [];
    var total = slides.length + 1;
    var pool = (opts.images || []).slice(); // 첨부 사진(업로드+노션) 풀
    var out = [];
    out.push(buildCard(style, "cover", coverInner(style, data.cover || {}, "cover", opts), opts, { index: 1, total: total }));
    slides.forEach(function (s, i) {
      s = s || {};
      // imagecaption 카드에는 첨부 사진을 순서대로 실제로 채워 넣음
      if (s.format === "imagecaption" && pool.length) s = Object.assign({}, s, { _img: pool.shift() });
      out.push(buildCard(style, s.format || "text", formatInner(style, s, "s" + i, opts), opts, { index: i + 2, total: total }));
    });
    return out;
  }

  global.CardTemplates = {
    render: render, autoFit: autoFit, injectStyles: injectStyles,
    readableOn: readableOn, cardHeight: cardHeight,
    STYLES: STYLES, STYLE_LABEL: STYLE_LABEL, FORMATS: FORMATS,
  };
})(window);

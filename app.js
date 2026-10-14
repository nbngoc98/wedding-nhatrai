/* ==========================================================================
   app.js – ĐỌC config.js VÀ ĐỔ DỮ LIỆU VÀO TRANG (không cần sửa file này)
   --------------------------------------------------------------------------
   Thứ tự chạy:
     1. <head>:  config.js  →  app.js        (định nghĩa window.WeddingApp)
     2. cuối <body>, ngay trước LadiPage:  WeddingApp.applyDom()
        → ghi chữ / ảnh / lịch, vá dữ liệu sự kiện của LadiPage
     3. DOMContentLoaded:  WeddingApp.init()
        → nhạc nền, màn hình mở thiệp, tên khách, đồng hồ đếm ngược, chặn copy
   ========================================================================== */
(function () {
  "use strict";

  var C = window.WEDDING_CONFIG;
  if (!C) { console.error("[Wedding] Không tìm thấy config.js (window.WEDDING_CONFIG)."); return; }

  /* ---------- Bảng ánh xạ: khóa trong config.images  →  phần tử LadiPage ---------- */
  var IMAGE_TARGETS = {
    hero:          "#IMAGE3>.ladi-image>.ladi-image-background",
    invitationBg:  "#SECTION11>.ladi-section-background",
    groomPhoto:    "#IMAGE26>.ladi-image>.ladi-image-background",
    bridePhoto:    "#IMAGE27>.ladi-image>.ladi-image-background",
    storyBanner:   "#IMAGE28>.ladi-image>.ladi-image-background",
    venueFrame:    "#IMAGE8>.ladi-image>.ladi-image-background",
    venueLogo:     "#IMAGE7>.ladi-image>.ladi-image-background",
    calendarBg:    "#IMAGE9>.ladi-image>.ladi-image-background",
    albumHero:     "#IMAGE17>.ladi-image>.ladi-image-background",
    albumThumb1:   "#IMAGE18>.ladi-image>.ladi-image-background",
    albumThumb2:   "#IMAGE19>.ladi-image>.ladi-image-background",
    albumThumb3:   "#IMAGE20>.ladi-image>.ladi-image-background",
    thankYouBg:    "#IMAGE22>.ladi-image>.ladi-image-background",
    thankYouPopup: "#IMAGE23>.ladi-image>.ladi-image-background"
  };

  /* Lưới lịch 6 hàng x 7 cột (Thứ 2 → CN), mỗi ô là 1 HEADLINE của LadiPage */
  var CAL_GRID = [
    ["HEADLINE32","HEADLINE33","HEADLINE34","HEADLINE35","HEADLINE36","HEADLINE37","HEADLINE38"],
    ["HEADLINE45","HEADLINE44","HEADLINE43","HEADLINE42","HEADLINE41","HEADLINE40","HEADLINE39"],
    ["HEADLINE46","HEADLINE47","HEADLINE48","HEADLINE49","HEADLINE50","HEADLINE51","HEADLINE52"],
    ["HEADLINE53","HEADLINE54","HEADLINE55","HEADLINE56","HEADLINE57","HEADLINE58","HEADLINE59"],
    ["HEADLINE60","HEADLINE61","HEADLINE62","HEADLINE63","HEADLINE64","HEADLINE65","HEADLINE66"],
    ["HEADLINE67","HEADLINE68","HEADLINE69","HEADLINE70","HEADLINE71","HEADLINE72","HEADLINE73"]
  ];
  var CAL_TOP0 = 90.722, CAL_ROW_H = 30, CAL_COL_W = 60;    // toạ độ gốc của lưới lịch (px)
  var HEART_DX = 11, HEART_DY = -5;                         // trái tim lệch so với ô ngày

  var TIMELINE_IDS = ["HEADLINE124","HEADLINE125","HEADLINE126","HEADLINE127","HEADLINE128","HEADLINE129"];
  var DRESS_IDS    = ["BOX11","BOX12","BOX13","BOX14","BOX15"];

  var WEEKDAYS = ["CHỦ NHẬT","THỨ HAI","THỨ BA","THỨ TƯ","THỨ NĂM","THỨ SÁU","THỨ BẢY"];
  var MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  /* ---------- tiện ích ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function cssUrl(u) { return 'url("' + String(u).replace(/"/g, "%22") + '")'; }

  /* Tách ngày giờ bằng regex (không dùng new Date(string) để khỏi lệch múi giờ) */
  function parseEvent() {
    var m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec((C.event && C.event.date) || "");
    if (!m) { console.warn("[Wedding] event.date sai định dạng, cần YYYY-MM-DDTHH:mm:00+07:00"); return null; }
    var y = +m[1], mo = +m[2], d = +m[3];
    return {
      y: y, mo: mo, d: d, hh: m[4], mm: m[5],
      dow: new Date(Date.UTC(y, mo - 1, d)).getUTCDay(),
      firstDow: new Date(Date.UTC(y, mo - 1, 1)).getUTCDay(),
      days: new Date(Date.UTC(y, mo, 0)).getUTCDate(),
      ts: Date.parse(C.event.date)
    };
  }
  var EV = parseEvent();

  function setText(id, html) {
    var el = document.getElementById(id);
    if (!el) return;
    var t = el.querySelector(".ladi-headline, .ladi-paragraph") || el;
    t.innerHTML = html;
  }

  /* Giải mã base64 → UTF-8 (chịu được base64url, thiếu "=", "+" bị URL đổi thành khoảng trắng) */
  function decodeB64(s) {
    var b = String(s).trim().replace(/ /g, "+").replace(/-/g, "+").replace(/_/g, "/");
    while (b.length % 4) b += "=";
    var bin = atob(b), bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  }

  var _guest;
  function guestName() {
    if (_guest !== undefined) return _guest;
    var G = C.guest || {}, raw = "";
    try { raw = new URLSearchParams(location.search).get(G.param || "name") || ""; } catch (e) {}
    raw = raw.trim();
    if (raw && G.base64 !== false) {
      try { raw = decodeB64(raw).trim(); }
      catch (e) { console.warn("[Wedding] Tên khách không phải base64 hợp lệ, dùng nguyên văn.", e); }
    }
    return (_guest = raw);
  }

  /* ---------- CSS ghi đè (ảnh, màu, lịch). Dùng "body " để thắng độ ưu tiên của CSS gốc,
                không dùng !important để giữ cơ chế lazyload của LadiPage ---------- */
  function buildOverrideCss() {
    var css = [], I = C.images || {}, k;
    for (k in IMAGE_TARGETS) {
      if (I[k]) css.push("body " + IMAGE_TARGETS[k] + "{background-image:" + cssUrl(I[k]) + ";}");
    }
    (C.gallery || []).forEach(function (src, i) {
      if (!src) return;
      css.push('body #GALLERY1 .ladi-gallery .ladi-gallery-view-item[data-index="' + i + '"],' +
               'body #GALLERY1 .ladi-gallery .ladi-gallery-control-item[data-index="' + i + '"]' +
               "{background-image:" + cssUrl(src) + ";}");
    });
    var G = C.gifts || {};
    if (G.groom && G.groom.qrImage) css.push("body #IMAGE24>.ladi-image>.ladi-image-background{background-image:" + cssUrl(G.groom.qrImage) + ";}");
    if (G.bride && G.bride.qrImage) css.push("body #IMAGE25>.ladi-image>.ladi-image-background{background-image:" + cssUrl(G.bride.qrImage) + ";}");

    // Màu chữ ô ngày: mặc định trắng, riêng ngày cưới màu chủ đạo
    var primary = (C.theme && C.theme.primary) || "#9E8130";
    css.push("body #HEADLINE38>.ladi-headline{color:#fff;text-shadow:rgb(0,0,0) 1px 1px 3px;}");
    if (EV) {
      var col = (EV.firstDow + 6) % 7, idx = col + EV.d - 1;
      var row = Math.floor(idx / 7), c = idx % 7;
      css.push("body #" + CAL_GRID[row][c] + ">.ladi-headline{color:" + primary + ";text-shadow:rgb(255,255,255) 1px 1px 3px;}");
      css.push("body #SHAPE2{left:" + (c * CAL_COL_W + HEART_DX) + "px;top:" + (CAL_TOP0 + row * CAL_ROW_H + HEART_DY) + "px;}");
    }
    return css.join("\n");
  }

  function injectStyle(id, css) {
    var s = document.getElementById(id);
    if (!s) { s = document.createElement("style"); s.id = id; document.head.appendChild(s); }
    s.textContent = css;
  }

  /* ---------- <head>: title, description, og, favicon ---------- */
  function applyMeta() {
    var M = C.meta || {};
    function setAttr(sel, attr, val) { var e = $(sel); if (e && val) e.setAttribute(attr, val); }
    if (M.title) { document.title = M.title; setAttr('meta[property="og:title"]', "content", M.title); }
    if (M.description) {
      setAttr('meta[name="description"]', "content", M.description);
      setAttr('meta[property="og:description"]', "content", M.description);
    }
    if (M.ogImage) setAttr('meta[property="og:image"]', "content", M.ogImage);
    if (M.favicon) {
      ["icon", "shortcut icon", "apple-touch-icon", "apple-touch-icon-precomposed"].forEach(function (rel) {
        setAttr('link[rel="' + rel + '"]', "href", M.favicon);
      });
      setAttr('meta[name="msapplication-TileImage"]', "content", M.favicon);
    }
  }

  /* ---------- Chữ ---------- */
  function family(side) {
    return esc(side.label) + '<br><span style="font-weight: normal; font-size: 14px;">Bố: ' +
           esc(side.father) + "<br>Mẹ: " + esc(side.mother) + "</span>";
  }

  /* Dòng tên khách dưới "Trân trọng kính mời" (HEADLINE21): lấy từ ?name= (base64) hoặc defaultName */
  function applyGuest() {
    var name = guestName() || (C.guest && C.guest.defaultName) || "";
    var el = document.getElementById("HEADLINE21");
    var t = el && (el.querySelector(".ladi-headline") || el);
    if (t && t.textContent.trim() !== name) t.textContent = name;
  }

  function applyTexts() {
    var cp = C.couple || {}, V = C.venue || {}, F = C.families || {};
    setText("HEADLINE142", esc(cp.groom) + " &amp; " + esc(cp.bride));
    setText("HEADLINE115", esc(cp.groomLabel));
    setText("HEADLINE116", esc(cp.groom));
    setText("HEADLINE117", esc(cp.brideLabel));
    setText("HEADLINE118", esc(cp.bride));
    setText("HEADLINE119", (C.story || []).map(esc).join("<br>"));

    if (EV) {
      setText("HEADLINE143", pad(EV.d) + " . " + pad(EV.mo) + " . " + EV.y);
      setText("HEADLINE213", pad(EV.d) + "." + pad(EV.mo) + "." + EV.y);
      // setText("HEADLINE19", EV.hh + ":" + EV.mm);
      setText("HEADLINE20", WEEKDAYS[EV.dow]);
      setText("HEADLINE24", "Tháng " + EV.mo + " - " + MONTHS_EN[EV.mo - 1]);
      var col = (EV.firstDow + 6) % 7;
      for (var i = 0; i < 42; i++) {
        var day = i - col + 1;
        setText(CAL_GRID[Math.floor(i / 7)][i % 7], day >= 1 && day <= EV.days ? String(day) : "");
      }
    }
    setText("HEADLINE130", esc((C.event || {}).lunarText));

    setText("HEADLINE16", esc(V.intro));
    setText("HEADLINE17", esc(V.name));
    setText("HEADLINE224", (V.addressLines || []).map(esc).join("<br>"));

    if (F.groomSide) setText("HEADLINE14", family(F.groomSide));
    if (F.brideSide) setText("HEADLINE15", family(F.brideSide));

    (C.timeline || []).slice(0, TIMELINE_IDS.length).forEach(function (t, i) {
      setText(TIMELINE_IDS[i],
        '<span style="text-decoration-line: underline; color: rgb(121, 102, 50); font-weight: bold;">' +
        esc(t.time) + "</span><br>" + esc(t.label));
    });

    var dc = C.dressCode || [];
    DRESS_IDS.forEach(function (id, i) {
      var box = document.getElementById(id), b = box && box.querySelector(".ladi-box");
      if (b && dc[i]) b.style.backgroundColor = dc[i];
    });

    if (C.footer && C.footer.brand) setText("HEADLINE103", esc(C.footer.brand));

    applyGuest();

    // Các đoạn chữ tự do trong config.texts (cho phép HTML) – áp sau cùng để ghi đè được tất cả
    var T = C.texts || {};
    Object.keys(T).forEach(function (id) { setText(id, T[id]); });
  }

  /* ---------- Vá JSON sự kiện của LadiPage (lightbox, link, ảnh form...) ---------- */
  function patchEventData() {
    var node = document.getElementById("script_event_data");
    if (!node) return;
    var data;
    try { data = JSON.parse(node.textContent); } catch (e) { console.warn("[Wedding] không đọc được script_event_data", e); return; }

    var I = C.images || {}, G = C.gifts || {}, Ft = C.footer || {}, V = C.venue || {};
    function act(id) { return data[id] && data[id].cs && data[id].cs[0]; }
    function set(id, key, val) { var a = act(id); if (a) a[key] = val; }

    // Lightbox ảnh album + ảnh cặp đôi
    [["IMAGE18", "albumThumb1"], ["IMAGE19", "albumThumb2"], ["IMAGE20", "albumThumb3"],
     ["IMAGE26", "groomPhoto"], ["IMAGE27", "bridePhoto"]].forEach(function (p) {
      if (I[p[1]]) set(p[0], "dC", I[p[1]]);
    });

    // Ảnh lựa chọn "Chú rể / Cô dâu" trong form xác nhận
    var sv = data.FORM_ITEM9 && data.FORM_ITEM9.aR && data.FORM_ITEM9.aR.cQ;
    if (sv) {
      if (sv[0] && I.rsvpGroom) sv[0].eo = I.rsvpGroom;
      if (sv[1] && I.rsvpBride) sv[1].eo = I.rsvpBride;
    }

    // Link mạng xã hội chân trang
    set("SHAPE7", "dw", Ft.tiktok); set("SHAPE8", "dw", Ft.facebook); set("SHAPE9", "dw", Ft.zalo);

    // Nút "Chỉ đường"
    if (V.mapsUrl) set("GROUP4", "dw", V.mapsUrl); else if (data.GROUP4) delete data.GROUP4.cs;

    // Mừng cưới: [ảnh QR, nút tải QR, nút copy STK]
    [["groom", "IMAGE24", "BUTTON8", "BUTTON9"], ["bride", "IMAGE25", "BUTTON10", "BUTTON11"]].forEach(function (g) {
      var info = G[g[0]]; if (!info) return;
      var a = act(g[1]);
      if (a) { a.dC = info.qrImage || ""; a.image_url_desktop = info.qrImage || ""; a.image_url_mobile = info.qrImage || ""; }
      set(g[2], "dw", info.qrImage || "");
      set(g[3], "dw", info.accountNumber || ""); set(g[3], "dL", info.accountNumber || "");
    });

    // Đồng hồ đếm ngược: bản gốc là bộ đếm cố định 64614 giây, thay bằng bộ đếm riêng tới ngày cưới
    ["COUNTDOWN1", "COUNTDOWN_ITEM1", "COUNTDOWN_ITEM2", "COUNTDOWN_ITEM3", "COUNTDOWN_ITEM4"].forEach(function (id) { delete data[id]; });

    node.textContent = JSON.stringify(data);
  }

  /* ========================== BƯỚC 2: GHI VÀO DOM ========================== */
  function applyDom() {
    applyMeta();
    injectStyle("wedding-override-css", buildOverrideCss());
    applyTexts();
    patchEventData();
  }

  /* ========================== ĐỒNG HỒ ĐẾM NGƯỢC ========================== */
  function startCountdown() {
    if (!EV || isNaN(EV.ts)) return;
    var spans = [1, 2, 3, 4].map(function (n) { return $("#COUNTDOWN_ITEM" + n + " .ladi-countdown-text span"); });
    if (!spans.every(Boolean)) return;
    function tick() {
      var left = Math.max(0, Math.floor((EV.ts - Date.now()) / 1000));
      var v = [Math.floor(left / 86400), Math.floor(left % 86400 / 3600), Math.floor(left % 3600 / 60), left % 60];
      v.forEach(function (n, i) { spans[i].textContent = pad(n); });
    }
    tick(); setInterval(tick, 1000);
  }

  /* ========================== NHẠC NỀN ========================== */
  function setupMusic() {
    var M = C.music || {}, T = C.theme || {};
    if (!M.src) return;

    injectStyle("wedding-music-css",
      "#music-toggle{position:fixed;bottom:15px;left:15px;width:50px;height:50px;border-radius:50%;" +
      "background:" + (T.primary || "#9E8130") + ";box-shadow:0 3px 10px rgba(0,0,0,.2);display:flex;" +
      "justify-content:center;align-items:center;z-index:9999;cursor:pointer;" +
      "transition:transform .2s ease,box-shadow .2s ease;}" +
      "#music-toggle:hover{transform:scale(1.1);box-shadow:0 4px 12px rgba(0,0,0,.3);}" +
      "#music-toggle svg{pointer-events:none;}" +
      ".vibrating{animation:wd-pulse 1.2s infinite,wd-rotate 4s linear infinite,wd-glow 2s ease-in-out infinite;" +
      "box-shadow:0 0 15px rgba(139,0,0,.6),0 0 25px rgba(139,0,0,.4);}" +
      "@keyframes wd-pulse{0%{transform:scale(1)}50%{transform:scale(1.05) rotate(1deg)}100%{transform:scale(1) rotate(-1deg)}}" +
      "@keyframes wd-rotate{from{transform:rotate(0)}to{transform:rotate(360deg)}}" +
      "@keyframes wd-glow{0%{box-shadow:0 0 10px rgba(139,0,0,.2),0 0 20px rgba(139,0,0,.2)}" +
      "50%{box-shadow:0 0 20px rgba(139,0,0,.6),0 0 30px rgba(139,0,0,.5)}" +
      "100%{box-shadow:0 0 10px rgba(139,0,0,.2),0 0 20px rgba(139,0,0,.2)}}");

    var audio = document.createElement("audio");
    audio.id = "background-music"; audio.loop = true; audio.preload = "auto";
    audio.src = M.src;
    audio.volume = typeof M.volume === "number" ? Math.min(1, Math.max(0, M.volume)) : 1;
    document.body.appendChild(audio);

    var btn = document.createElement("div");
    btn.id = "music-toggle"; btn.title = "Bật / Tắt nhạc";
    btn.innerHTML =
      '<svg id="play-icon" viewBox="0 0 24 24" width="24" height="24"><polygon points="6,4 20,12 6,20" fill="#fff"></polygon></svg>' +
      '<svg id="pause-icon" viewBox="0 0 24 24" width="24" height="24" style="display:none"><rect x="5" y="4" width="4" height="16" fill="#fff"></rect><rect x="13" y="4" width="4" height="16" fill="#fff"></rect></svg>';
    document.body.appendChild(btn);
    var playIcon = $("#play-icon", btn), pauseIcon = $("#pause-icon", btn);

    function ui(on) {
      playIcon.style.display = on ? "none" : "block";
      pauseIcon.style.display = on ? "block" : "none";
      btn.classList.toggle("vibrating", on);
    }
    function play() {
      var p = audio.play();
      if (p && p.then) return p.then(function () { ui(true); return true; }, function () { return false; });
      ui(true); return Promise.resolve(true);
    }

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (audio.paused) play(); else { audio.pause(); ui(false); }
    });
    audio.addEventListener("pause", function () { ui(false); });
    audio.addEventListener("play", function () { ui(true); });

    if (M.autoStartOnFirstTouch !== false) {
      var evs = ["pointerdown", "touchend", "click", "keydown"];
      var onFirst = function (e) {
        if (e.target && e.target.closest && e.target.closest("#music-toggle")) return;  // nút nhạc tự xử lý
        play().then(function (ok) {
          if (ok) evs.forEach(function (n) { document.removeEventListener(n, onFirst, true); });
        });
      };
      evs.forEach(function (n) { document.addEventListener(n, onFirst, true); });
      play();   // thử phát ngay (một số trình duyệt cho phép)
    }
  }

  /* ========================== MÀN HÌNH MỞ THIỆP ========================== */
  function setupIntro() {
    var N = C.intro || {};
    if (!N.enabled) return;
    var T = C.theme || {}, cp = C.couple || {};
    var primary = T.primary || "#9E8130", accent = T.accent || "#d4af37", text = T.introText || "#f5e6c8", door2 = T.doorColor2 || "#3b0000";
    var name = guestName();
    var greeting = esc(N.greeting || "Xin chào") + (name ? ", " + esc(name) : "");
    var fT = "'Cormorant Garamond', serif", fS = "'Montserrat', sans-serif", fN = "'Yeseva One', cursive";

    var style = document.createElement("style");
    style.id = "wedding-intro-css";
    style.textContent =
      "@import url('assets/css/google-fonts-24aaf2.css');" +
      ".elegant-overlay{position:fixed!important;inset:0!important;z-index:2147483647!important;overflow:hidden!important;font-family:" + fT + ";transform:translateZ(0);pointer-events:auto!important;}" +
      ".elegant-overlay *{pointer-events:auto!important;}" +
      ".door-panel{position:absolute!important;inset:0!important;background:linear-gradient(145deg," + primary + "," + door2 + ")!important;backdrop-filter:blur(5px)!important;display:flex!important;align-items:center!important;justify-content:center!important;transition:transform 1.4s cubic-bezier(.77,0,.18,1)!important;z-index:1!important;}" +
      ".elegant-overlay.open .door-panel{transform:translateX(" + (N.slideDirection === "left" ? "-100%" : "100%") + ")!important;}" +
      ".intro-content{text-align:center;max-width:600px;padding:20px;transition:opacity .4s ease;position:relative;z-index:2;}" +
      ".elegant-overlay.open .intro-content{opacity:0;}" +
      ".intro-subtitle{font-family:" + fS + ";letter-spacing:5px;text-transform:uppercase;color:" + accent + ";font-size:16px;margin-bottom:10px;opacity:0;font-weight:900;animation:wd-fadeUp 1s ease forwards .3s;}" +
      ".intro-subtitle2{font-family:" + fS + ";letter-spacing:5px;text-transform:uppercase;color:" + accent + ";font-size:18px;margin-bottom:20px;opacity:0;animation:wd-fadeUp 1s ease forwards .3s;font-weight:700;}" +
      ".intro-names{font-family:" + fN + ";font-size:64px;font-weight:400;color:" + text + ";line-height:1.2;margin:10px 0;opacity:0;animation:wd-zoomIn 1.5s ease forwards .7s;}" +
      ".intro-ampersand{font-family:" + fT + ";font-size:40px;font-weight:600;color:" + accent + ";display:block;margin:8px 0;}" +
      ".intro-message{font-family:" + fS + ";letter-spacing:4px;color:" + accent + "cc;font-size:12px;margin-top:25px;opacity:0;animation:wd-fadeUp 1s ease forwards 1s;}" +
      ".sparkle-layer{position:absolute;inset:0;pointer-events:none;z-index:10;}" +
      ".sparkle{position:absolute;border-radius:50%;background:" + accent + ";opacity:0;animation:wd-sparkle linear forwards;}" +
      "@keyframes wd-sparkle{0%{opacity:0;transform:translateY(0) scale(.2)}15%{opacity:.9;transform:scale(1.2)}30%{opacity:.7}100%{opacity:0;transform:translateY(-280px) scale(.5)}}" +
      "@keyframes wd-fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}" +
      "@keyframes wd-zoomIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}" +
      "@media (max-width:768px){.intro-names{font-size:38px}.intro-ampersand{font-size:26px}.intro-subtitle,.intro-message{font-size:10px;letter-spacing:3px}}";
    document.head.appendChild(style);

    var PIN = '[data-ladipage-pin],.ladipage-pin,.lp-pin,[class*="pin"],.fixed-element,.floating-button';
    document.querySelectorAll(PIN).forEach(function (el) {
      el.style.setProperty("z-index", "0", "important");
      el.style.setProperty("pointer-events", "none", "important");
    });

    var overlay = document.createElement("div");
    overlay.className = "elegant-overlay";
    overlay.innerHTML =
      '<div class="door-panel"><div class="intro-content">' +
      '<div class="intro-subtitle">' + greeting + "</div>" +
      '<div class="intro-subtitle2">' + esc(N.subtitle) + "</div>" +
      '<div class="intro-names">' + esc(cp.groom) + '<span class="intro-ampersand">&amp;</span>' + esc(cp.bride) + "</div>" +
      '<div class="intro-message">' + esc(N.message) + "</div>" +
      '</div></div><div class="sparkle-layer"></div>';
    document.body.prepend(overlay);

    var layer = $(".sparkle-layer", overlay);
    function sparkle() {
      var n = Math.floor(Math.random() * 4) + 2;
      for (var i = 0; i < n; i++) {
        var s = document.createElement("div"), size = Math.random() * 5 + 2;
        s.className = "sparkle";
        s.style.cssText = "width:" + size + "px;height:" + size + "px;left:" + Math.random() * 100 + "%;top:" + Math.random() * 100 +
          "%;box-shadow:0 0 12px " + accent + ",0 0 4px white;animation-duration:" + (Math.random() * 2.5 + 1.5) + "s;animation-delay:" + Math.random() * 0.5 + "s;";
        layer.appendChild(s);
        setTimeout(function (el) { el.remove(); }.bind(null, s), 4000);
      }
    }
    var timer = setInterval(sparkle, 80);
    document.body.style.overflow = "hidden";

    setTimeout(function () {
      overlay.classList.add("open");
      clearInterval(timer);
      setTimeout(function () {
        overlay.remove();
        document.body.style.overflow = "";
        document.querySelectorAll(PIN).forEach(function (el) {
          el.style.removeProperty("z-index");
          el.style.removeProperty("pointer-events");
        });
      }, 1500);
    }, typeof N.autoOpenDelay === "number" ? N.autoOpenDelay : 4200);
  }

  /* ========================== TÊN KHÁCH TRONG FORM ========================== */
  function fillGuestInputs() {
    var name = guestName();
    if (!name) return;
    document.querySelectorAll('input[placeholder*="tên"],input[placeholder*="Tên"],input[data-key*="name"],input[name*="name"]')
      .forEach(function (input) {
        input.value = name;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
  }

  /* ========================== CHẶN COPY / DEVTOOLS ========================== */
  function protect() {
    if (!C.protectContent) return;
    injectStyle("wedding-protect-css",
      "body{-webkit-user-select:none;-ms-user-select:none;-moz-user-select:none;user-select:none;-webkit-touch-callout:none;}" +
      "input,textarea,select{-webkit-user-select:text;user-select:text;}" +   // vẫn cho gõ vào form
      "img{pointer-events:none;}");
    document.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    document.addEventListener("keydown", function (e) {
      var k = e.key ? e.key.toUpperCase() : "";
      if (e.key === "F12" ||
          (e.ctrlKey && e.shiftKey && (k === "I" || k === "C" || k === "J")) ||
          (e.ctrlKey && (k === "U" || k === "S"))) e.preventDefault();
    });
  }

  /* ========================== BƯỚC 3: KHỞI ĐỘNG ========================== */
  function init() {
    applyGuest();
    window.addEventListener("load", function () { applyGuest(); setTimeout(applyGuest, 1500); });  // phòng LadiPage ghi đè lại
    startCountdown();
    setupMusic();
    fillGuestInputs();
    protect();
    setupIntro();
  }

  window.WeddingApp = { applyDom: applyDom, init: init };

  // applyMeta chạy sớm để tab/title đổi ngay
  applyMeta();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
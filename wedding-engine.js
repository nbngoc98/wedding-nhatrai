/* =====================================================================
   WEDDING ENGINE — đọc config.js và áp vào trang. KHÔNG cần sửa file này.
   Chạy đồng bộ ngay trước khi LadiPage khởi động (nên đặt ngay trước
   <script id="script_ladipage_run">). Trang nào xác định bởi
   <body data-wedding-page="cover|content">.
   ===================================================================== */
(function () {
  "use strict";

  var C = window.WEDDING_CONFIG;
  if (!C) { console.error("[wedding] Không tìm thấy config.js"); return; }

  var PAGE = document.body.getAttribute("data-wedding-page");
  var css = [];

  /* ---------------------------------------------------------------
     Helpers
  --------------------------------------------------------------- */
  function $(id) { return document.getElementById(id); }
  function q(id, sel) { var e = $(id); return e ? e.querySelector(sel) : null; }
  function has(v) { return v !== undefined && v !== null && String(v) !== ""; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function cssUrl(u) { return 'url("' + String(u).replace(/\\/g, "\\\\").replace(/"/g, "\\\"").replace(/[\r\n]/g, "") + '")'; }

  /* Gán chữ (an toàn: dùng textContent, \n => <br>).
     Chèn {guest} vào chữ => thay bằng tên khách mời (in đậm). */
  function setText(id, text, sel) {
    if (!has(text)) return;
    var el = q(id, sel || ".ladi-headline");
    if (!el) return;
    el.textContent = "";
    String(text).split("\n").forEach(function (line, i) {
      if (i) el.appendChild(document.createElement("br"));
      line.split("{guest}").forEach(function (part, j) {
        if (j) {
          var b = document.createElement("span");
          var gs = C.guestLineStyle || {};
          b.style.fontWeight = has(gs.fontWeight) ? gs.fontWeight : "700";
          if (has(gs.fontFamily)) b.style.fontFamily = gs.fontFamily;
          if (has(gs.fontSize)) b.style.fontSize = gs.fontSize;
          if (has(gs.color)) b.style.color = gs.color;
          if (has(gs.letterSpacing)) b.style.letterSpacing = gs.letterSpacing;
          b.style.textTransform = has(gs.textTransform) ? gs.textTransform : "none";   // khung HEADLINE20 gốc có uppercase => ép về giữ nguyên chữ hoa/thường
          b.style.lineHeight = has(gs.lineHeight) ? gs.lineHeight : "1.1";
          b.textContent = GUEST.name;
          el.appendChild(b);
        }
        if (part) el.appendChild(document.createTextNode(part));
      });
    });
  }

  /* Gán ảnh nền qua stylesheet (giữ nguyên cơ chế lazyload của LadiPage) */
  function setBg(id, url) {
    if (!has(url)) return;
    var el = $(id);
    if (!el) return;
    if (el.querySelector(".ladi-image-background")) {
      css.push("#" + id + ">.ladi-image>.ladi-image-background{background-image:" + cssUrl(url) + "}");
    } else if (el.querySelector(".ladi-box")) {
      css.push("#" + id + ">.ladi-box{background-image:" + cssUrl(url) + "}");
    }
  }
  function setBgMany(ids, url) { (ids || []).forEach(function (id) { setBg(id, url); }); }

  function hide(id) { if ($(id)) css.push("#" + id + "{display:none!important}"); }

  function setLink(id, url) {
    var el = $(id);
    if (!el) return;
    if (!has(url)) { hide(id); return; }
    if (el.tagName === "A") el.setAttribute("href", url);
  }

  /* Vá JSON sự kiện của LadiPage (đếm ngược, link) trước khi nó chạy */
  function patchEvents(fn) {
    var s = $("script_event_data");
    if (!s) return;
    try {
      var d = JSON.parse(s.textContent);
      fn(d);
      s.textContent = JSON.stringify(d);
    } catch (e) { console.warn("[wedding] Không vá được script_event_data", e); }
  }
  function patchLink(d, id, url) {
    if (!d[id] || !has(url)) return;
    d[id].cs = [{ dr: "action", dv: "_blank", dw: String(url).replace(/&/g, "&#38;"), a: "link" }];
  }

  function setMeta(selector, attr, value) {
    if (!has(value)) return;
    var m = document.head.querySelector(selector);
    if (m) m.setAttribute(attr, value);
  }
  function applySite(site) {
    if (!site) return;
    if (has(site.title)) {
      document.title = site.title;
      setMeta('meta[property="og:title"]', "content", site.title);
    }
    if (has(site.favicon)) {
      var links = document.head.querySelectorAll('link[rel*="icon"]');
      for (var i = 0; i < links.length; i++) links[i].setAttribute("href", site.favicon);
    }
  }

  /* ---------------------------------------------------------------
     Khách mời từ URL
  --------------------------------------------------------------- */
  function getGuest() {
    var g = C.guest || {};
    var names = [g.paramName || "name"].concat(g.aliases || []);
    var params;
    try { params = new URLSearchParams(window.location.search); } catch (e) { params = null; }
    if (params) {
      for (var i = 0; i < names.length; i++) {
        var v = params.get(names[i]);
        if (v && v.trim()) {
          v = v.replace(/[\u0000-\u001f\u007f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, g.maxLength || 60);
          if (v) return { name: v, fromUrl: true };
        }
      }
    }
    return { name: has(g.defaultName) ? g.defaultName : "Quý Khách", fromUrl: false };
  }
  var GUEST = getGuest();

  /* Nạp Google Font cho dòng tên khách (guestLineStyle.googleFont) */
  (function () {
    var gs = C.guestLineStyle || {};
    if (!has(gs.googleFont)) return;
    var fams = [].concat(gs.googleFont).filter(has).map(function (f) {
      return "family=" + encodeURIComponent(String(f)).replace(/%20/g, "+");
    });
    if (!fams.length) return;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?" + fams.join("&") + "&display=swap";
    document.head.appendChild(l);
  })();

  function contentUrl() {
    var base = (C.pages && C.pages.content) || "content.html";
    if (!GUEST.fromUrl) return base;
    var key = (C.guest && C.guest.paramName) || "name";
    return base + (base.indexOf("?") > -1 ? "&" : "?") + encodeURIComponent(key) + "=" + encodeURIComponent(GUEST.name);
  }

  /* ---------------------------------------------------------------
     Ngày tháng
  --------------------------------------------------------------- */
  var WEEKDAY_VI = ["chủ nhật", "thứ hai", "thứ ba", "thứ tư", "thứ năm", "thứ sáu", "thứ bảy"];
  var WEEKDAY_EN = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  function parseDate(s) {
    var m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(String(s || ""));
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }
  var DATE = parseDate(C.event && C.event.date);

  /* ---------------------------------------------------------------
     Phần chung: ảnh nâng cao / chữ nâng cao / ẩn phần tử
  --------------------------------------------------------------- */
  function applyAdvanced(pageKey) {
    var a = (C.advanced && C.advanced[pageKey]) || {};
    Object.keys(a.imageOverrides || {}).forEach(function (id) { setBg(id, a.imageOverrides[id]); });
    Object.keys(a.textOverrides || {}).forEach(function (id) { setText(id, a.textOverrides[id]); });
    (a.hide || []).forEach(hide);
  }

  /* ===============================================================
     TRANG BÌA
  =============================================================== */
  var COVER_DECOR = {
    paperTexture: ["IMAGE9", "IMAGE2"],
    borderFlower: ["IMAGE22", "IMAGE24"],
    photoFrame:   ["IMAGE19"],
    heartIcon:    ["IMAGE13"],
    tapIcon:      ["IMAGE16"],
    flowerSprayA: ["IMAGE33"],
    flowerSprayB: ["IMAGE34"]
  };

  function applyCover() {
    applySite(C.site && C.site.cover);

    // Tên khách (textContent => an toàn trước XSS)
    setText("HEADLINE8", GUEST.name);
    var nameEl = q("HEADLINE8", ".ladi-headline");
    var g = C.guest || {};
    if (nameEl && g.autoShrink !== false) {
      var base = 40, fit = 13;           // 40px vừa khoảng 13 ký tự trong khung
      var len = GUEST.name.length;
      if (len > fit) nameEl.style.fontSize = Math.max(20, Math.floor(base * fit / len)) + "px";
    }

    setText("HEADLINE9", C.texts && C.texts.cover && C.texts.cover.invite);

    if (DATE) setText("HEADLINE3", pad(DATE.getDate()) + "." + pad(DATE.getMonth() + 1) + "." + DATE.getFullYear());

    // Nút mở thiệp => content.html (kèm ?name=...)
    var url = contentUrl();
    setLink("IMAGE13", url);
    setLink("IMAGE16", url);
    patchEvents(function (d) { patchLink(d, "IMAGE13", url); patchLink(d, "IMAGE16", url); });

    // Chặn handler click riêng của LadiPage (nó có thể mở link gốc "content.html" làm mất ?name=)
    // và để trình duyệt tự mở đúng href (đã gắn ?name=...), vẫn _blank như cũ.
    window.addEventListener("click", function (ev) {
      var a = ev.target && ev.target.closest ? ev.target.closest("#IMAGE13, #IMAGE16") : null;
      if (!a) return;
      a.setAttribute("href", contentUrl());
      a.setAttribute("target", "_blank");
      ev.stopPropagation();          // KHÔNG preventDefault => href mặc định vẫn chạy
    }, true);

    var dec = (C.decor && C.decor.cover) || {};
    Object.keys(COVER_DECOR).forEach(function (k) { setBgMany(COVER_DECOR[k], dec[k]); });

    applyAdvanced("cover");
  }

  /* ===============================================================
     TRANG NỘI DUNG
  =============================================================== */
  var PHOTO_MAP = {
    heroPolaroidTop:    ["BOX2"],
    heroPolaroidBottom: ["BOX3"],
    bannerWeAre:        ["BOX4"],
    bannerWhereLove:    ["BOX6"],
    fullPhoto:          ["BOX17"],
    saveTheDateFrame:   ["BOX8"],
    bridePhoto:         ["BOX11"],
    groomPhoto:         ["BOX10"],
    thankYouPhoto:      ["BOX12"],
    popupPhoto:         ["BOX13"]
  };

  var CONTENT_DECOR = {
    paperTexture:    ["IMAGE2", "IMAGE3", "IMAGE12", "IMAGE13", "IMAGE20", "IMAGE21", "IMAGE22", "IMAGE33", "IMAGE34", "IMAGE74", "IMAGE88", "IMAGE93"],
    topBorderFlower: ["IMAGE5", "IMAGE14", "IMAGE90"],
    cornerFlowers:   ["IMAGE76", "IMAGE75", "IMAGE70", "IMAGE69", "IMAGE91", "IMAGE92"],
    flowerSprayA:    ["IMAGE54", "IMAGE83"],
    flowerSprayB:    ["IMAGE55"],
    leafRibbon:      ["IMAGE58", "IMAGE66", "IMAGE77"],
    photoFrameBack:  ["IMAGE27"],
    photoFrameFront: ["IMAGE25"],
    heartIcon:       ["IMAGE24", "IMAGE31", "IMAGE41"],
    plasterTexture:  ["IMAGE47", "IMAGE48"]
  };

  var TEXT_MAP = {
    saveTheDateSmall: "HEADLINE3",
    countdownTitle:   "HEADLINE9",
    weAre:            "HEADLINE14",
    gettingMarried:   "HEADLINE15",
    inviteLine:       "HEADLINE20",
    directions:       "HEADLINE26",
    closing:          "HEADLINE31",
    whereSmall:       "HEADLINE32",
    whereBig:         "HEADLINE33",
    timelineTitle:    "HEADLINE73",
    dressCodeTitle:   "HEADLINE78",
    saveTheDateTitle: "HEADLINE49",
    loveStory:        "HEADLINE50",
    rsvpIntro:        "HEADLINE55",
    rsvpButton:       "BUTTON_TEXT2",
    thankYou:         "HEADLINE62",
    footerBrand:      "HEADLINE66",
    popupMessage:     "HEADLINE63",
    popupTitle:       "HEADLINE64"
  };

  // Timeline: từ trên xuống dưới => [headline, group]
  var TIMELINE_SLOTS = [
    ["HEADLINE75", "GROUP56", "IMAGE85"],
    ["HEADLINE74", "GROUP55", "IMAGE84"],
    ["HEADLINE76", "GROUP57", "IMAGE86"],
    ["HEADLINE77", "GROUP58", "IMAGE87"]
  ];
  // Dress code: trái -> phải
  var DRESS_BOXES = ["BOX28", "BOX27", "BOX26", "BOX25"];

  function setTimelineText(id, time, title) {
    var el = q(id, ".ladi-headline");
    if (!el) return;
    el.textContent = "";
    var b = document.createElement("span");
    b.style.fontWeight = "700";
    b.textContent = time || "";
    el.appendChild(b);
    el.appendChild(document.createElement("br"));
    el.appendChild(document.createTextNode(title || ""));
  }

  function setSelect(itemId, placeholder, options) {
    var sel = q(itemId, "select");
    if (!sel) return;
    var oldPlaceholder = sel.options[0] ? sel.options[0].textContent : "";
    sel.textContent = "";
    var o0 = document.createElement("option");
    o0.value = "";
    o0.textContent = has(placeholder) ? placeholder : oldPlaceholder;
    sel.appendChild(o0);
    (options || []).forEach(function (t) {
      var o = document.createElement("option");
      o.value = t;
      o.textContent = t;
      sel.appendChild(o);
    });
  }
  function setPlaceholder(itemId, sel, text) {
    var el = q(itemId, sel);
    if (el && has(text)) el.setAttribute("placeholder", text);
  }

  function applyGallery(list) {
    var gal = $("GALLERY1");
    if (!gal || !list || !list.length) return;
    var viewParent = gal.querySelector(".ladi-gallery-view");
    var ctrlParent = gal.querySelector(".ladi-gallery-control-box");
    var views = viewParent.querySelectorAll(".ladi-gallery-view-item");
    var ctrls = ctrlParent.querySelectorAll(".ladi-gallery-control-item");
    var n = list.length;

    while (views.length < n) {
      var cv = views[views.length - 1].cloneNode(false);
      cv.classList.remove("selected");
      viewParent.appendChild(cv);
      views = viewParent.querySelectorAll(".ladi-gallery-view-item");
    }
    while (ctrls.length < n) {
      var cc = ctrls[ctrls.length - 1].cloneNode(false);
      cc.classList.remove("selected");
      ctrlParent.appendChild(cc);
      ctrls = ctrlParent.querySelectorAll(".ladi-gallery-control-item");
    }
    while (views.length > n) { viewParent.removeChild(views[views.length - 1]); views = viewParent.querySelectorAll(".ladi-gallery-view-item"); }
    while (ctrls.length > n) { ctrlParent.removeChild(ctrls[ctrls.length - 1]); ctrls = ctrlParent.querySelectorAll(".ladi-gallery-control-item"); }

    for (var i = 0; i < n; i++) {
      views[i].setAttribute("data-index", i);
      ctrls[i].setAttribute("data-index", i);
      var full = typeof list[i] === "string" ? list[i] : (list[i].src || "");
      var thumb = typeof list[i] === "string" ? "" : (list[i].thumb || "");
      if (!thumb) thumb = full.replace(/(w\.ladicdn\.com\/)s\d+x\d+(\/)/, "$1s400x400$2");
      css.push('#GALLERY1 .ladi-gallery .ladi-gallery-view-item[data-index="' + i + '"]{background-image:' + cssUrl(full) + "}");
      css.push('#GALLERY1 .ladi-gallery .ladi-gallery-control-item[data-index="' + i + '"]{background-image:' + cssUrl(thumb) + "}");
    }
  }

  function applyContent() {
    applySite(C.site && C.site.content);
    var cp = C.couple || {}, gr = cp.groom || {}, br = cp.bride || {}, ev = C.event || {};

    /* --- Tên --- */
    setText("HEADLINE7", gr.name);  setText("HEADLINE8", br.name);
    setText("HEADLINE21", gr.name); setText("HEADLINE22", br.name);
    setText("HEADLINE51", br.name); setText("HEADLINE52", br.role);
    setText("HEADLINE53", gr.name); setText("HEADLINE54", gr.role);

    /* --- Gia đình --- */
    setText("HEADLINE16", cp.groomFamilyLabel);
    setText("HEADLINE18", cp.brideFamilyLabel);
    // if (has(gr.father) || has(gr.mother)) setText("HEADLINE17", [gr.father, gr.mother].filter(has).join("\n"));
    // if (has(br.father) || has(br.mother)) setText("HEADLINE19", [br.father, br.mother].filter(has).join("\n"));

    /* --- Ngày giờ / địa điểm --- */
    var t = C.texts && C.texts.content || {};
    if (DATE) {
      var d = DATE.getDate(), m = DATE.getMonth() + 1, y = DATE.getFullYear();
      setText("HEADLINE4", pad(d)); setText("HEADLINE5", pad(m)); setText("HEADLINE6", String(y));
      setText("HEADLINE27", pad(d));
      setText("HEADLINE28", "tháng " + m);
      setText("HEADLINE29", "năm " + y);
      setText("HEADLINE41", "tháng " + m);
      var intro = has(t.eventIntro) ? t.eventIntro : "được tổ chức vào lúc";
      setText("HEADLINE24", intro + "\n" + (ev.time || "") + ", " + WEEKDAY_VI[DATE.getDay()]);
      // Lịch 7 ngày: ngày cưới ở giữa
      for (var i = 0; i < 7; i++) {
        var dd = new Date(y, m - 1, d + i - 3);
        setText("HEADLINE" + (34 + i), WEEKDAY_EN[dd.getDay()]);
        setText("HEADLINE" + (42 + i), String(dd.getDate()));
      }
    }
    setText("HEADLINE30", ev.lunarDate);
    setText("HEADLINE25", ev.venueLabel);
    setText("HEADLINE23", ev.address);

    /* --- Chữ cố định --- */
    Object.keys(TEXT_MAP).forEach(function (k) { setText(TEXT_MAP[k], t[k]); });

    /* --- Timeline --- */
    var tl = C.timeline || [];
    TIMELINE_SLOTS.forEach(function (slot, i) {
      if (tl[i]) setTimelineText(slot[0], tl[i].time, tl[i].title);
      else if (C.timeline) hide(slot[1]);
    });

    /* --- Dress code --- */
    (C.dressCode || []).forEach(function (color, i) {
      if (DRESS_BOXES[i] && has(color)) css.push("#" + DRESS_BOXES[i] + ">.ladi-box{background-color:" + color + "}");
    });

    /* --- Ảnh --- */
    var ph = C.photos || {};
    Object.keys(PHOTO_MAP).forEach(function (k) { setBgMany(PHOTO_MAP[k], ph[k]); });
    applyGallery(ph.gallery);

    var dec = (C.decor && C.decor.content) || {};
    Object.keys(CONTENT_DECOR).forEach(function (k) { setBgMany(CONTENT_DECOR[k], dec[k]); });
    (dec.timelineIcons || []).forEach(function (u, i) { if (TIMELINE_SLOTS[i]) setBg(TIMELINE_SLOTS[i][2], u); });

    /* --- Link: bản đồ, MXH, đếm ngược --- */
    var soc = C.social || {};
    setLink("GROUP15", ev.mapLink);
    setLink("IMAGE50", soc.facebook);
    setLink("IMAGE51", soc.tiktok);
    setLink("IMAGE52", soc.zalo);
    var cd = ev.countdownTo ? Date.parse(ev.countdownTo) : NaN;
    patchEvents(function (data) {
      patchLink(data, "GROUP15", ev.mapLink);
      patchLink(data, "IMAGE50", soc.facebook);
      patchLink(data, "IMAGE51", soc.tiktok);
      patchLink(data, "IMAGE52", soc.zalo);
      if (!isNaN(cd) && data.COUNTDOWN1) data.COUNTDOWN1.bT = cd;
    });

    // Bấm "Chỉ đường" / icon MXH => luôn mở đúng link trong config (chặn handler LadiPage làm hỏng click)
    // Chữ bấm được => mở bản đồ. Danh sách ID chỉnh ở config: event.mapClickIds
    // (HEADLINE23 = địa chỉ, HEADLINE25 = "tại tư gia...", HEADLINE31 = "Hân hạnh được đón tiếp!")
    var mapIds = (ev.mapClickIds || ["HEADLINE23", "HEADLINE25", "HEADLINE31"]).filter(has);
    if (has(ev.mapLink) && ev.addressClickable !== false && mapIds.length) {
      var selAll = mapIds.map(function (id) { return "#" + id; }).join(",");
      var selKids = mapIds.map(function (id) { return "#" + id + ",#" + id + " *"; }).join(",");
      css.push(selKids + "{cursor:pointer!important;pointer-events:auto!important}");
      css.push(selAll + "{z-index:50}");
      // Ảnh trang trí (hoa, lá, khung...) phủ lên chữ => cho click xuyên qua
      var through = [];
      Object.keys(CONTENT_DECOR).forEach(function (k) { through = through.concat(CONTENT_DECOR[k]); });
      through = through.concat(["IMAGE17", "GROUP7"]);   // khung ảnh lớn + nhóm nền, đè lên địa chỉ / HEADLINE31
      through = through.concat(((C.advanced && C.advanced.content && C.advanced.content.clickThrough) || []));
      through.forEach(function (id) { css.push("#" + id + "{pointer-events:none!important}"); });
      window.addEventListener("click", function (e) {
        var t = e.target && e.target.closest ? e.target.closest(selAll) : null;
        if (!t) return;
        e.stopPropagation();
        window.open(ev.mapLink, "_blank", "noopener");
      }, true);
    }
    css.push("#GROUP15,#GROUP15 *,#IMAGE50,#IMAGE51,#IMAGE52{cursor:pointer!important;pointer-events:auto!important}");
    css.push("#GROUP15,#IMAGE50,#IMAGE51,#IMAGE52{z-index:50}");

    var CLICK_LINKS = { GROUP15: ev.mapLink, IMAGE50: soc.facebook, IMAGE51: soc.tiktok, IMAGE52: soc.zalo };
    window.addEventListener("click", function (e) {
      var a = e.target && e.target.closest ? e.target.closest("#GROUP15, #IMAGE50, #IMAGE51, #IMAGE52") : null;
      if (!a || !has(CLICK_LINKS[a.id])) return;
      a.setAttribute("href", CLICK_LINKS[a.id]);
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
      e.stopPropagation();           // KHÔNG preventDefault => trình duyệt tự mở href
    }, true);

    /* --- Form xác nhận --- */
    var r = C.rsvp || {};
    setPlaceholder("FORM_ITEM2", "input", r.namePlaceholder);
    setPlaceholder("FORM_ITEM3", "textarea", r.messagePlaceholder);
    if (r.attendanceOptions) setSelect("FORM_ITEM4", r.attendancePlaceholder, r.attendanceOptions);
    if (r.sideOptions) setSelect("FORM_ITEM5", r.sidePlaceholder, r.sideOptions);
    setPlaceholder("FORM_ITEM6", "input", r.companionsPlaceholder);
    if (GUEST.fromUrl && (C.guest || {}).prefillRsvpName !== false) {
      var nameInput = q("FORM_ITEM2", "input");
      if (nameInput) nameInput.value = GUEST.name;
    }

    /* --- Khung lời chúc --- */
    var w = C.wishes || {};
    var title = document.querySelector(".jmii-title");
    var cap = document.querySelector(".jmii-caption");
    var load = document.querySelector(".jmii-loading");
    if (title && has(w.title)) title.textContent = w.title;
    if (cap && has(w.caption)) cap.textContent = w.caption;
    if (load && has(w.loadingText)) load.textContent = w.loadingText;

    applyAdvanced("content");
  }

  /* ---------------------------------------------------------------
     Chạy
  --------------------------------------------------------------- */
  try {
    if (PAGE === "cover") applyCover();
    else if (PAGE === "content") applyContent();
    else console.warn('[wedding] Thiếu <body data-wedding-page="cover|content">');
  } catch (e) {
    console.error("[wedding] Lỗi khi áp config:", e);
  }

  if (css.length) {
    var st = document.createElement("style");
    st.id = "wedding-config-style";
    st.appendChild(document.createTextNode(css.join("\n")));
    document.body.appendChild(st);   // đặt sau các <style> gốc => thắng cascade
  }

  /* ---------------------------------------------------------------
     Xoá khung "Powered by LadiPage" (script LadiPage tự chèn lúc chạy, có thể chèn trễ).
     Tắt bằng config: advanced.removeBadge = false
  --------------------------------------------------------------- */
  (function removeLadiBadge() {
    if (C.advanced && C.advanced.removeBadge === false) return;

    var st = document.createElement("style");
    st.id = "wedding-badge-style";
    st.appendChild(document.createTextNode(
      'body>a[href*="ladipage"],body>div[class*="badge" i][class*="ladi" i],[id*="ladipage-badge" i],[class*="ladipage-badge" i],[class*="ladi-badge" i]{display:none!important}'));
    document.head.appendChild(st);

    function isPageContent(el) {
      return el === document.body || el === document.documentElement ||
        (el.querySelector && el.querySelector(".ladi-wraper, .ladi-section, #music-toggle, #wishes-form"));
    }
    function looksLikeBadge(el) {
      var t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (t.length < 80 && /powered\s*by/i.test(t) && /ladi/i.test(t + (el.innerHTML || ""))) return true;
      var a = el.matches && el.matches('a[href*="ladipage"]') ? el : (el.querySelector && el.querySelector('a[href*="ladipage"]'));
      return !!a && t.length < 80;
    }
    function topBlock(el) {                       // leo lên tới khối ngoài cùng (con trực tiếp của body) nhưng không chạm nội dung thiệp
      var cur = el;
      while (cur.parentElement && cur.parentElement !== document.body && !isPageContent(cur.parentElement)) cur = cur.parentElement;
      return cur;
    }
    function scan() {
      // Huy hiệu chỉ là chữ, tách thành nhiều thẻ con ("Powered by" + "ladipage") và nằm trực tiếp trong body
      var kids = document.body ? document.body.children : [];
      for (var k = kids.length - 1; k >= 0; k--) {
        var kid = kids[k];
        if (!kid || kid.id === "wedding-badge-style" || /^(SCRIPT|STYLE|NOSCRIPT|LINK|META)$/.test(kid.tagName) || isPageContent(kid)) continue;
        var kt = (kid.textContent || "").replace(/\s+/g, " ").trim();
        if (kt.length < 80 && /powered\s*by/i.test(kt) && /ladi/i.test(kt + (kid.innerHTML || ""))) kid.parentNode.removeChild(kid);
      }
      var nodes = document.body ? document.body.querySelectorAll("*") : [];
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        if (el.id === "wedding-badge-style" || /^(SCRIPT|STYLE|NOSCRIPT|LINK|META)$/.test(el.tagName) || isPageContent(el)) continue;
        var hit = false;
        if (el.shadowRoot && /powered\s*by/i.test(el.shadowRoot.textContent || "")) hit = true;
        else if (!el.children.length || el.tagName === "A") hit = looksLikeBadge(el);
        if (hit) {
          var blk = topBlock(el);
          if (!isPageContent(blk) && blk.parentNode) blk.parentNode.removeChild(blk);
        }
      }
    }
    var queued = false;
    function schedule() {
      if (queued) return;
      queued = true;
      (window.requestAnimationFrame || setTimeout)(function () { queued = false; scan(); });
    }
    function start() {
      scan();
      try { new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true }); } catch (e) { }
      var n = 0, t = setInterval(function () { scan(); if (++n > 40) clearInterval(t); }, 500);   // dự phòng ~20 giây đầu
    }
    if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
  })();

  window.WeddingGuest = GUEST;
})();
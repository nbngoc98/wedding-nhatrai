/* =====================================================================
   LỜI CHÚC — gửi + hiển thị.  Cấu hình ở config.js (WEDDING_CONFIG.wishes).
   Không cần sửa file này.

   provider = "firebase" : Firestore (có form gửi lời chúc + danh sách realtime)
   provider = "sheet"    : Google Apps Script cũ (chỉ hiển thị danh sách)
   Nếu provider = "firebase" nhưng chưa dán firebaseConfig => tự dùng "sheet".
   ===================================================================== */
(function () {
  "use strict";

  var C = window.WEDDING_CONFIG || {};
  var W = C.wishes || {};
  var F = W.form || {};
  var FB = W.firebase || {};
  var FC = FB.firebaseConfig || {};

  function has(v) { return v !== undefined && v !== null && String(v).trim() !== ""; }
  function txt(v, d) { return has(v) ? String(v) : d; }

  var T = {
    empty:       txt(F.emptyText, "Hãy là người đầu tiên gửi lời chúc 💌"),
    sheetEmpty:  txt(W.emptyText, "Chưa có lời chúc nào."),
    error:       txt(W.errorText, "Không thể tải lời chúc."),
    connect:     txt(W.connectErrorText, "Không thể kết nối hệ thống."),
    noId:        "Chưa xác định mã thiệp."
  };

  function getList() { return document.getElementById("jmii-list"); }

  function showMessage(text) {
    var list = getList();
    if (!list) return;
    list.textContent = "";
    var d = document.createElement("div");
    d.className = "jmii-loading";
    d.textContent = text;
    list.appendChild(d);
  }

  function appendWish(list, name, message) {
    var item = document.createElement("div");
    item.className = "jmii-wish";
    var n = document.createElement("div");
    n.className = "jmii-name";
    n.textContent = name || "Khách mời";
    var m = document.createElement("div");
    m.className = "jmii-message";
    m.textContent = message || "";
    item.appendChild(n);
    item.appendChild(m);
    list.appendChild(item);
  }

  /* ===================================================================
     A. GOOGLE SHEET (cũ) — chỉ hiển thị
  =================================================================== */
  function startSheet() {
    var WEDDING_ID = W.weddingId || "";
    var API = W.api || "";

    function render(wishes) {
      var list = getList();
      if (!list) return;
      list.textContent = "";
      if (!wishes || !Array.isArray(wishes) || wishes.length === 0) { showMessage(T.sheetEmpty); return; }
      wishes.forEach(function (w) { appendWish(list, w.name, w.message); });
    }

    function load() {
      if (!has(WEDDING_ID)) { showMessage(T.noId); return; }
      if (!has(API)) { showMessage(T.connect); return; }
      var cb = "jmiiWishesCallback_" + Date.now() + "_" + Math.floor(Math.random() * 100000);
      var script = document.createElement("script");
      function cleanup() {
        try { delete window[cb]; } catch (e) { window[cb] = null; }
        if (script.parentNode) script.parentNode.removeChild(script);
      }
      window[cb] = function (data) {
        if (data && data.success === true) render(data.wishes);
        else { console.error("JMII API ERROR:", data); showMessage(T.error); }
        cleanup();
      };
      script.onerror = function () { showMessage(T.connect); cleanup(); };
      script.src = API + (API.indexOf("?") > -1 ? "&" : "?") + "weddingId=" + encodeURIComponent(WEDDING_ID) +
        "&callback=" + encodeURIComponent(cb) + "&t=" + Date.now();
      script.async = true;
      document.head.appendChild(script);
    }

    setTimeout(load, 1000);
  }

  /* ===================================================================
     B. FIREBASE FIRESTORE
  =================================================================== */
  var MAX_NAME = Number(F.maxName) > 0 ? Number(F.maxName) : 100;
  var MAX_MSG = Number(F.maxMessage) > 0 ? Number(F.maxMessage) : 1000;
  var COOLDOWN = Number(F.cooldownSeconds) >= 0 ? Number(F.cooldownSeconds) : 15;

  var FT = {
    title:       txt(F.title, "Gửi lời chúc"),
    caption:     txt(F.caption, "Hãy để lại đôi dòng yêu thương cho cô dâu & chú rể"),
    namePh:      txt(F.namePlaceholder, "Tên của bạn"),
    messagePh:   txt(F.messagePlaceholder, "Lời chúc của bạn..."),
    sendBtn:     txt(F.sendButton, "💌 Gửi"),
    sending:     txt(F.sendingText, "⏳ Đang gửi..."),
    success:     txt(F.successText, "Gửi lời chúc thành công 💌"),
    needInfo:    txt(F.needInfoText, "Vui lòng nhập đầy đủ tên và lời chúc."),
    tooLong:     txt(F.tooLongText, "Tên tối đa " + MAX_NAME + " ký tự, lời chúc tối đa " + MAX_MSG + " ký tự."),
    sendError:   txt(F.errorText, "Gửi chưa thành công. Vui lòng thử lại."),
    wait:        txt(F.waitText, "Bạn vừa gửi xong, vui lòng đợi vài giây rồi gửi tiếp nhé.")
  };

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.async = false;
      s.onload = resolve;
      s.onerror = function () { reject(new Error("Không tải được " + src)); };
      document.head.appendChild(s);
    });
  }

  function ensureSdk() {
    if (window.firebase && window.firebase.firestore) return Promise.resolve();
    var v = txt(FB.sdkVersion, "10.12.2");
    var base = "https://www.gstatic.com/firebasejs/" + v + "/";
    return loadScript(base + "firebase-app-compat.js").then(function () {
      return loadScript(base + "firebase-firestore-compat.js");
    });
  }

  /* --- Pháo hoa khi gửi thành công --- */
  function showFireworks() {
    if (F.fireworks === false) return;
    try {
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    } catch (e) { }
    var w = window.innerWidth, h = window.innerHeight;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var cv = document.createElement("canvas");
    cv.style.cssText = "position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:2147483000";
    cv.width = w * dpr; cv.height = h * dpr;
    var ctx = cv.getContext && cv.getContext("2d");
    if (!ctx) return;
    document.body.appendChild(cv);
    ctx.scale(dpr, dpr);
    var colors = ["#881D1D", "#d4a24c", "#e8b4b8", "#f6e3b4", "#c0504d", "#ffffff"];
    var parts = [], t0 = null, fired = 0;
    var spots = [[0.28, 0.32, 0], [0.72, 0.26, 260], [0.5, 0.42, 520]];
    function burst(x, y) {
      for (var i = 0; i < 48; i++) {
        var a = Math.random() * Math.PI * 2, s = 1.5 + Math.random() * 4.5;
        parts.push({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1,
          decay: 0.012 + Math.random() * 0.01, c: colors[(Math.random() * colors.length) | 0], r: 1.5 + Math.random() * 2 });
      }
    }
    function frame(now) {
      if (t0 === null) t0 = now;
      var el = now - t0;
      while (fired < spots.length && el >= spots[fired][2]) { burst(w * spots[fired][0], h * spots[fired][1]); fired++; }
      ctx.clearRect(0, 0, w, h);
      parts = parts.filter(function (p) { return p.life > 0; });
      parts.forEach(function (p) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.vx *= 0.985; p.life -= p.decay;
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (fired < spots.length || parts.length) window.requestAnimationFrame(frame);
      else if (cv.parentNode) cv.parentNode.removeChild(cv);
    }
    window.requestAnimationFrame(frame);
  }
  window.showFireworks = showFireworks;

  /* --- Form gửi lời chúc (chèn ngay trước khung "YOUR WISHES") --- */
  var FORM_CSS =
    ".wf-section{position:relative;width:100%;box-sizing:border-box;padding:38px 28px 34px;text-align:center;color:#881D1D;" +
    "background-color:#fff;background-size:cover;background-position:center top;background-repeat:no-repeat}" +
    ".wf-title{font-family:Georgia,serif;font-size:26px;letter-spacing:2px;line-height:1.3;text-transform:uppercase}" +
    ".wf-line{width:70px;height:1px;background:#881D1D;opacity:.55;margin:12px auto}" +
    ".wf-caption{font-family:'Lora',Georgia,serif;font-size:13px;line-height:1.7;margin-bottom:18px}" +
    ".wf-form{display:flex;flex-direction:column;gap:12px;text-align:left}" +
    ".wf-input{width:100%;box-sizing:border-box;padding:12px 14px;border:1px solid rgba(136,29,29,.45);border-radius:10px;" +
    "background:rgba(255,255,255,.75);color:#4a1010;font-family:'Lora',Georgia,serif;font-size:12px;line-height:1.5;outline:none;" +
    "-webkit-appearance:none;appearance:none;-webkit-user-select:text;-moz-user-select:text;-ms-user-select:text;user-select:text}" +
    ".wf-input::placeholder{color:rgba(136,29,29,.55)}" +
    ".wf-input:focus{border-color:#881D1D;box-shadow:0 0 0 3px rgba(136,29,29,.12)}" +
    "textarea.wf-input{min-height:120px;resize:vertical}" +
    ".wf-btn{align-self:center;min-width:150px;padding:12px 30px;border:0;border-radius:999px;background:#881D1D;color:#fff;" +
    "font-family:'Lora',Georgia,serif;font-size:12px;letter-spacing:.5px;cursor:pointer;transition:opacity .2s,transform .1s}" +
    ".wf-btn:active{transform:scale(.97)}" +
    ".wf-btn[disabled]{opacity:.6;cursor:default}" +
    ".wf-status{min-height:20px;margin-top:2px;text-align:center;font-family:'Lora',Georgia,serif;font-size:13px;line-height:1.6}" +
    ".wf-status.ok{color:#2f6b3a}.wf-status.err{color:#b3261e}";

  function buildForm() {
    var anchor = document.getElementById("SECTION8");
    var parent = anchor ? anchor.parentNode : null;
    if (!parent) { parent = document.querySelector(".ladi-wraper") || document.body; }

    var style = document.createElement("style");
    style.id = "wishes-form-style";
    style.appendChild(document.createTextNode(FORM_CSS));
    document.head.appendChild(style);

    var sec = document.createElement("div");
    sec.id = "wishes-form";
    sec.className = "wf-section";
    var bg = C.decor && C.decor.content && C.decor.content.plasterTexture;
    if (has(bg)) sec.style.backgroundImage = 'url("' + String(bg).replace(/"/g, "%22") + '")';

    function el(tag, cls, text) {
      var e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text !== undefined) e.textContent = text;
      return e;
    }

    sec.appendChild(el("div", "wf-title", FT.title));
    sec.appendChild(el("div", "wf-line"));
    sec.appendChild(el("div", "wf-caption", FT.caption));

    var form = el("form", "wf-form");
    form.setAttribute("novalidate", "novalidate");
    form.setAttribute("autocomplete", "off");

    var name = el("input", "wf-input");
    name.type = "text"; name.id = "wf-name"; name.name = "wf-name";
    name.placeholder = FT.namePh; name.maxLength = MAX_NAME;
    name.setAttribute("aria-label", FT.namePh);
    name.setAttribute("enterkeyhint", "next");
    if (F.prefillGuestName !== false && window.WeddingGuest && window.WeddingGuest.fromUrl) name.value = window.WeddingGuest.name;

    var msg = el("textarea", "wf-input");
    msg.id = "wf-message"; msg.name = "wf-message";
    msg.placeholder = FT.messagePh; msg.maxLength = MAX_MSG; msg.rows = 5;
    msg.setAttribute("aria-label", FT.messagePh);

    var btn = el("button", "wf-btn", FT.sendBtn);
    btn.type = "submit"; btn.id = "wf-send";

    var status = el("div", "wf-status");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");

    form.appendChild(name); form.appendChild(msg); form.appendChild(btn); form.appendChild(status);
    sec.appendChild(form);

    if (anchor) parent.insertBefore(sec, anchor); else parent.appendChild(sec);
    return { form: form, name: name, msg: msg, btn: btn, status: status };
  }

  function startFirebase() {
    var ui = buildForm();
    showMessage(txt(W.loadingText, "Đang tải lời chúc..."));

    function setStatus(text, kind) {
      ui.status.textContent = text || "";
      ui.status.className = "wf-status" + (kind ? " " + kind : "");
    }

    ensureSdk().then(function () {
      var fb = window.firebase;
      if (!fb.apps || !fb.apps.length) fb.initializeApp(FC);
      var db = fb.firestore();
      var wishesRef = db.collection(txt(FB.collection, "wishes"));
      var limit = Number(FB.limit) > 0 ? Number(FB.limit) : 200;

      // Danh sách tự cập nhật theo thời gian thực
      wishesRef.orderBy("createdAt", "desc").limit(limit).onSnapshot(
        function (snapshot) {
          var list = getList();
          if (!list) return;
          list.textContent = "";
          if (snapshot.empty) { showMessage(T.empty); return; }
          snapshot.forEach(function (doc) {
            var w = doc.data() || {};
            appendWish(list, w.name, w.message);
          });
        },
        function (error) {
          console.error("Lỗi tải lời chúc:", error);
          showMessage(T.error);
        }
      );

      var lastSent = 0, busy = false;
      ui.form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        if (busy) return;

        var name = ui.name.value.trim();
        var message = ui.msg.value.trim();
        if (!name || !message) { setStatus(FT.needInfo, "err"); return; }
        if (name.length > MAX_NAME || message.length > MAX_MSG) { setStatus(FT.tooLong, "err"); return; }
        if (COOLDOWN > 0 && lastSent && Date.now() - lastSent < COOLDOWN * 1000) { setStatus(FT.wait, "err"); return; }

        busy = true;
        ui.btn.disabled = true;
        ui.btn.textContent = FT.sending;
        setStatus("");

        wishesRef.add({
          name: name,
          message: message,
          createdAt: fb.firestore.FieldValue.serverTimestamp()
        }).then(function () {
          lastSent = Date.now();
          ui.msg.value = "";
          setStatus(FT.success, "ok");
          showFireworks();
        }).catch(function (error) {
          console.error("Lỗi gửi lời chúc:", error);
          setStatus(FT.sendError, "err");
        }).then(function () {
          busy = false;
          ui.btn.disabled = false;
          ui.btn.textContent = FT.sendBtn;
        });
      });
    }).catch(function (err) {
      console.error("Không khởi động được Firebase:", err);
      showMessage(T.connect);
      setStatus(T.connect, "err");
    });
  }

  /* ===================================================================
     Chạy
  =================================================================== */
  function start() {
    var wantFirebase = String(W.provider || "firebase").toLowerCase() === "firebase";
    var ready = has(FC.apiKey) && has(FC.projectId);
    if (wantFirebase && ready) startFirebase();
    else {
      if (wantFirebase) console.warn("[wishes] Chưa dán firebaseConfig trong config.js => dùng Google Sheet (chỉ hiển thị, chưa có form gửi).");
      startSheet();
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
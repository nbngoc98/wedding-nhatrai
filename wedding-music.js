/* Nhạc nền — đọc từ config.js (WEDDING_CONFIG.music). Không cần sửa file này. */
(function () {
  "use strict";

  var cfg = (window.WEDDING_CONFIG && window.WEDDING_CONFIG.music) || {};
  var list = (cfg.playlist || []).filter(function (u) { return u && String(u).trim() !== ""; });

  var toggleBtn = document.getElementById("music-toggle");
  var iconOn = document.getElementById("icon-on");
  var iconOff = document.getElementById("icon-off");
  if (!toggleBtn) return;

  if (cfg.enabled === false || !list.length) {
    toggleBtn.style.display = "none";
    return;
  }

  var index = 0;
  var audio = new Audio();
  audio.preload = "auto";
  audio.setAttribute("playsinline", "");
  audio.src = list[index];
  audio.loop = false;
  audio.volume = typeof cfg.volume === "number" ? Math.max(0, Math.min(1, cfg.volume)) : 1;

  var musicStarted = false;
  var isPlaying = false;

  function updateIcon() {
    if (isPlaying) {
      iconOn.style.display = "block";
      iconOff.style.display = "none";
      toggleBtn.classList.add("playing");
      toggleBtn.setAttribute("aria-pressed", "true");
      toggleBtn.setAttribute("title", "Tắt nhạc");
    } else {
      iconOn.style.display = "none";
      iconOff.style.display = "block";
      toggleBtn.classList.remove("playing");
      toggleBtn.setAttribute("aria-pressed", "false");
      toggleBtn.setAttribute("title", "Bật nhạc");
    }
  }

  function safePlay() {
    return audio.play().then(function () {
      musicStarted = true;
      isPlaying = true;
      hideHint();
      updateIcon();
    }).catch(function (err) {
      console.debug("Audio play blocked or failed:", err);
      throw err;
    });
  }

  function pauseMusic() {
    audio.pause();
    isPlaying = false;
    updateIcon();
  }

  function nextTrack() {
    index = (index + 1) % list.length;
    audio.src = list[index];
    return audio.play().then(function () {
      isPlaying = true;
      updateIcon();
    }).catch(function () {
      isPlaying = false;
      updateIcon();
    });
  }

  audio.addEventListener("ended", nextTrack);

  // File nhạc không tải được (sai đường dẫn / sai hoa-thường / chưa upload / server lỗi)
  var failed = 0;
  audio.addEventListener("error", function () {
    var code = audio.error ? audio.error.code : "?";
    console.error("[music] Không phát được: " + audio.currentSrc + "  (MediaError " + code +
      (code === 4 ? " = không tìm thấy file hoặc định dạng không hỗ trợ" : "") + ")");
    failed++;
    isPlaying = false;
    updateIcon();
    if (list.length > 1 && failed < list.length) nextTrack();   // bỏ qua bài lỗi, sang bài kế
  });
  audio.addEventListener("playing", function () { failed = 0; });

  // Tự phát khi khách cuộn trang / rê chuột / chạm / bấm (chỉnh ở config.js: music.startOn).
  // Lưu ý: trình duyệt chỉ cho phép phát tiếng sau khi khách có tương tác thật (bấm, chạm, nhấn phím).
  // Cuộn và rê chuột chỉ phát được khi trình duyệt đã "tin" trang này; chưa được thì code
  // thử lại ở mỗi lần cuộn/rê và chốt ở lần bấm/chạm đầu tiên.
  var EVENT_GROUPS = {
    scroll: ["scroll", "wheel", "touchmove"],
    hover:  ["mousemove", "pointermove"],
    touch:  ["touchstart", "touchend"],
    click:  ["pointerup", "click", "keydown"]
  };
  var startOn = Array.isArray(cfg.startOn) && cfg.startOn.length ? cfg.startOn : ["scroll", "hover", "touch", "click"];
  var GESTURES = [];
  startOn.forEach(function (g) {
    (EVENT_GROUPS[g] || []).forEach(function (n) { if (GESTURES.indexOf(n) < 0) GESTURES.push(n); });
  });
  // Luôn giữ các sự kiện "bấm thật" làm phương án chốt
  EVENT_GROUPS.click.concat(["touchend"]).forEach(function (n) { if (GESTURES.indexOf(n) < 0) GESTURES.push(n); });

  // Sự kiện "bấm thật": trình duyệt mới cho phát tiếng => luôn thử, không bị giới hạn tần suất.
  var REAL = { pointerup: 1, touchend: 1, click: 1, keydown: 1 };
  var trying = false, lastTry = 0;
  function removeGestureListeners() {
    GESTURES.forEach(function (n) { window.removeEventListener(n, startOnGesture, true); });
  }
  function startOnGesture(ev) {
    if (musicStarted) { removeGestureListeners(); return; }
    if (ev.target && ev.target.nodeType === 1 && toggleBtn.contains(ev.target)) return;   // nút bật/tắt tự xử lý
    if (!REAL[ev.type]) {                              // cuộn / rê chuột / touchstart: chỉ thử, giới hạn tần suất
      var now = Date.now();
      if (trying || now - lastTry < 400) return;
      trying = true; lastTry = now;
      safePlay().then(removeGestureListeners).catch(function () { }).then(function () { trying = false; });
      return;
    }
    safePlay().then(removeGestureListeners).catch(function () { });
  }
  GESTURES.forEach(function (n) { window.addEventListener(n, startOnGesture, { capture: true, passive: true }); });

  /* Gợi ý nổi "Chạm để bật nhạc" — hiện khi trình duyệt chặn tự phát, mất khi nhạc chạy.
     Đổi chữ: music.hint trong config.js; đặt "" để tắt. */
  var hintEl = null;
  // var hintText = cfg.hint === undefined ? "🎵 Chạm vào màn hình để bật nhạc" : String(cfg.hint);
  // function hideHint() {
  //   if (hintEl && hintEl.parentNode) hintEl.parentNode.removeChild(hintEl);
  //   hintEl = null;
  // }
  // function showHint() {
  //   if (musicStarted || hintEl || !hintText) return;
  //   hintEl = document.createElement("div");
  //   hintEl.id = "music-hint";
  //   hintEl.setAttribute("role", "status");
  //   hintEl.textContent = hintText;
  //   hintEl.style.cssText = "position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:2147483000;" +
  //     "max-width:86vw;padding:10px 18px;border-radius:999px;background:rgba(136,29,29,.92);color:#fff;" +
  //     "font:14px/1.4 Lora,Georgia,serif;text-align:center;box-shadow:0 4px 14px rgba(0,0,0,.25);" +
  //     "pointer-events:none;animation:musicHintPulse 1.8s ease-in-out infinite";
  //   if (!document.getElementById("music-hint-style")) {
  //     var st = document.createElement("style");
  //     st.id = "music-hint-style";
  //     st.textContent = "@keyframes musicHintPulse{0%,100%{opacity:1}50%{opacity:.55}}";
  //     document.head.appendChild(st);
  //   }
  //   document.body.appendChild(hintEl);
  // }
  // setTimeout(showHint, 1500);

  toggleBtn.addEventListener("click", function (ev) {
    ev.preventDefault();
    if (!musicStarted) {
      safePlay().catch(function () { isPlaying = false; updateIcon(); });
      return;
    }
    if (isPlaying) pauseMusic();
    else safePlay().catch(function () { isPlaying = false; updateIcon(); });
  });

  toggleBtn.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleBtn.click();
    }
  });

  isPlaying = false;
  updateIcon();
  window.WeddingMusic = { audio: audio, playlist: list };
})();
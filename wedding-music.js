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
  var audio = new Audio(list[index]);
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

  audio.addEventListener("ended", function () {
    index = (index + 1) % list.length;
    audio.src = list[index];
    audio.play().then(function () {
      isPlaying = true;
      updateIcon();
    }).catch(function () {
      isPlaying = false;
      updateIcon();
    });
  });

  // Tự phát ở lần chạm / cuộn đầu tiên (iOS + Desktop)
  function startOnFirstGesture() {
    if (musicStarted) return;
    safePlay().catch(function () { });
  }
  document.addEventListener("touchstart", startOnFirstGesture, { once: true, passive: true });
  document.addEventListener("mousedown", startOnFirstGesture, { once: true });
  document.addEventListener("wheel", startOnFirstGesture, { once: true });

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
})();

/* Lời chúc (Google Apps Script, JSONP) — đọc từ config.js (WEDDING_CONFIG.wishes). Không cần sửa file này. */
(function () {
  "use strict";

  var W = (window.WEDDING_CONFIG && window.WEDDING_CONFIG.wishes) || {};
  var WEDDING_ID = W.weddingId || "";
  var API = W.api || "";
  var T = {
    empty: W.emptyText || "Chưa có lời chúc nào.",
    error: W.errorText || "Không thể tải lời chúc.",
    connect: W.connectErrorText || "Không thể kết nối hệ thống.",
    noId: "Chưa xác định mã thiệp."
  };

  function getList() { return document.getElementById("jmii-list"); }

  function showMessage(text) {
    var list = getList();
    if (!list) { console.error("JMII: Không tìm thấy #jmii-list"); return; }
    list.textContent = "";
    var d = document.createElement("div");
    d.className = "jmii-loading";
    d.textContent = text;
    list.appendChild(d);
  }

  function renderWishes(wishes) {
    var list = getList();
    if (!list) { console.error("JMII: Không tìm thấy #jmii-list"); return; }
    list.textContent = "";
    if (!wishes || !Array.isArray(wishes) || wishes.length === 0) {
      showMessage(T.empty);
      return;
    }
    wishes.forEach(function (wish) {
      var item = document.createElement("div");
      item.className = "jmii-wish";
      var name = document.createElement("div");
      name.className = "jmii-name";
      name.textContent = wish.name || "";
      var message = document.createElement("div");
      message.className = "jmii-message";
      message.textContent = wish.message || "";
      item.appendChild(name);
      item.appendChild(message);
      list.appendChild(item);
    });
  }

  function loadWishes() {
    if (!WEDDING_ID || String(WEDDING_ID).trim() === "") {
      showMessage(T.noId);
      console.error("JMII: weddingId đang trống trong config.js");
      return;
    }
    if (!API) {
      showMessage(T.connect);
      console.error("JMII: wishes.api đang trống trong config.js");
      return;
    }

    var callbackName = "jmiiWishesCallback_" + Date.now() + "_" + Math.floor(Math.random() * 100000);
    var script = document.createElement("script");

    function cleanup() {
      try { delete window[callbackName]; } catch (e) { window[callbackName] = null; }
      if (script.parentNode) script.parentNode.removeChild(script);
    }

    window[callbackName] = function (data) {
      if (data && data.success === true) {
        renderWishes(data.wishes);
      } else {
        console.error("JMII API ERROR:", data);
        showMessage(T.error);
      }
      cleanup();
    };

    script.onerror = function () {
      console.error("JMII: Không thể kết nối Google Apps Script.");
      showMessage(T.connect);
      cleanup();
    };

    script.src = API +
      (API.indexOf("?") > -1 ? "&" : "?") + "weddingId=" + encodeURIComponent(WEDDING_ID) +
      "&callback=" + encodeURIComponent(callbackName) +
      "&t=" + Date.now();
    script.async = true;
    document.head.appendChild(script);
  }

  function start() { setTimeout(loadWishes, 1000); }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();

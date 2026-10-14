/* ==========================================================================
   CẤU HÌNH THIỆP CƯỚI  –  CHỈ CẦN SỬA FILE NÀY
   --------------------------------------------------------------------------
   - Thay thông tin, ảnh, nhạc, link tại đây rồi lưu lại, không cần đụng vào HTML.
   - Đường dẫn ảnh: để trong thư mục assets/images/ rồi ghi đúng tên file,
     hoặc dán link https://... đều được.
   ========================================================================== */
window.WEDDING_CONFIG = {

  /* ---------- 1. THÔNG TIN TRANG (tab trình duyệt, chia sẻ) ---------- */
  meta: {
    title: "Golden | Tựa ánh hoàng hôn, nhẹ nhàng và rực rỡ trong ngày trọng đại",
    description: "Mỗi lời chúc, mỗi sự hiện diện đều là điều đáng quý mà chúng tôi luôn trân trọng. Cảm ơn vì bạn đã là một phần trong ngày đặc biệt này.",
    ogImage: "assets/images/snapedit_1754669975683-20250809035547-0jooj.jpeg",
    favicon: "assets/images/beige-and-brown-elegant-initials-wedding-logo-1-20251009123923-9zixk.png",
    // Lưu ý: Facebook/Zalo không chạy JS, muốn đổi preview khi chia sẻ link
    // thì vẫn phải sửa thẻ <meta og:*> trong index.html.
  },

  /* ---------- 2. MÀU CHỦ ĐẠO (dùng cho nút nhạc + màn hình mở thiệp) ---------- */
  theme: {
    primary: "#9E8130",
    accent: "#d4af37",
    introText: "#f5e6c8",
    doorColor2: "#3b0000",     // màu cuối của gradient cánh cửa mở thiệp
  },

  /* ---------- 3. CÔ DÂU – CHÚ RỂ ---------- */
  couple: {
    groom: "Bảo Ngọc",
    bride: "Hoàng Nhi",
    groomLabel: "Chú rể",
    brideLabel: "Cô dâu",
  },

  /* ---------- 4. NGÀY GIỜ ----------
     Chỉ cần sửa `date` (YYYY-MM-DDTHH:mm:00+07:00). Các chỗ sau tự suy ra:
     "02 . 11 . 2025", "02.11.2025", "CHỦ NHẬT", "10:00", lịch tháng,
     trái tim đánh dấu ngày cưới, đồng hồ đếm ngược. */
  event: {
    date: "2026-12-06T11:30:00+07:00",
    lunarText: "(Tức ngày 28 tháng 10 năm Bính Ngọ)",   // âm lịch: tự ghi tay
  },

  /* ---------- 5. GIA ĐÌNH ---------- */
  families: {
    groomSide: { label: "Nhà Trai", father: "Nguyễn Mạnh Hùng",    mother: "Nguyễn Thị Tố Nga" },
    brideSide: { label: "Nhà Gái",  father: "Huỳnh Tấn Quang", mother: "Lê Thị Hằng" },
  },

  /* ---------- 6. ĐỊA ĐIỂM ---------- */
  venue: {
    intro: "tiệc cưới được tổ chức tại",
    name: "Sân Vận Động Tân Hòa",
    addressLines: ["Phường Tân Hải", "TP. Hồ Chí Minh"],
    mapsUrl: "",          // link Google Maps cho nút "Chỉ đường" (để trống = không mở gì)
  },

  /* ---------- 7. CÂU CHUYỆN (mỗi phần tử = 1 dòng) ---------- */
  story: [
    "Chúng tôi gặp nhau như một sự tình cờ, nhưng lại ở bên nhau như một điều đã được định sẵn.",
    "Từ những tin nhắn vu vơ, những buổi hẹn hò giản dị, tình cảm lớn lên từng ngày.",
    "Và giờ đây, chúng tôi quyết định cùng nhau viết tiếp câu chuyện ấy, bằng một đám cưới trọn vẹn yêu thương.",
  ],

  /* ---------- 8. TIMELINE (đúng 6 mục) ---------- */
  timeline: [
    { time: "10:30", label: "Đón khách" },
    { time: "11:30", label: "Khai tiệc" },
  ],

  /* ---------- 9. DRESS CODE (đúng 5 màu) ---------- */
  dressCode: ["#f1f3f4", "#fff6d3", "#000000", "#ffffff", "#9E8130"],

  /* ---------- 9b. KHÁCH MỜI ----------
     Tên khách hiện ở "Trân trọng kính mời ...", màn hình mở thiệp và ô tên trong form.
     - defaultName: tên hiện khi link KHÔNG có tham số (ghi rõ tên người được mời, vd "Anh Nam & gia đình").
     - param: tên tham số trên URL.
     - base64: true = tên trong URL được mã hóa base64 (UTF-8, hỗ trợ cả base64url); false = chữ thường.
     Ví dụ link: index.html?name=QW5oIE5hbQ==   (= "Anh Nam")
     Lấy chuỗi mã hóa: mở Console trình duyệt gõ  btoa(unescape(encodeURIComponent("Anh Nam")))  */
  guest: {
    defaultName: "",
    param: "name",
    base64: true,
  },

  /* ---------- 10. CÁC ĐOẠN CHỮ KHÁC (key = id phần tử LadiPage, cho phép HTML) ---------- */
  texts: {
    HEADLINE140: "We Get",
    HEADLINE141: "Married",
    HEADLINE113: "Trân trọng kính mời",
    HEADLINE114: "Đến dự buổi lễ cưới của",
    HEADLINE121: "Timeline",
    HEADLINE122: "Dress code",
    HEADLINE123: "Mặc đúng màu sắc để lên hình được đẹp hơn nha",
    HEADLINE104: "Gửi Lời Chúc",
    HEADLINE105: "Mỗi lời chúc, mỗi sự hiện diện đều là điều đáng quý mà chúng tôi luôn trân trọng. Cảm ơn vì bạn đã là một phần trong ngày đặc biệt này.",
    HEADLINE84:  "Beautiful",
    HEADLINE85:  "chapter",
    HEADLINE86:  "Từng khoảnh khắc bên nhau đều là một mảnh ghép quý giá trong câu chuyện tình yêu của chúng tôi. Hãy cùng chúng tôi ngắm nhìn lại những hình ảnh đã lưu giữ trọn vẹn niềm vui, tiếng cười và cả những giây phút lặng yên đầy yêu thương.",
    HEADLINE87:  "Mỗi lời hồi đáp của bạn chính là một niềm vui lớn đối với chúng tôi. Hãy nhấn xác nhận để cùng chung vui nhé!",
    HEADLINE94:  "Countdown",
    HEADLINE99:  "Chúng tôi chân thành cảm ơn gia đình, bạn bè và những người thân yêu đã đồng hành và gửi lời chúc tốt đẹp.<br>Sự hiện diện của bạn là niềm hạnh phúc lớn nhất với chúng tôi.",
    HEADLINE100: "Thank you!",
    HEADLINE101: "Cảm ơn bạn đã xác nhận tham dự!<br>Chúng tôi rất vui và háo hức được gặp bạn trong ngày trọng đại này.<br>Hãy cùng nhau lưu giữ những khoảnh khắc thật đẹp nhé!",
    HEADLINE106: "Hộp mừng cưới",
  },

  /* ---------- 11. ẢNH ---------- */
  images: {
    hero:          "assets/images/tai-xuong-20250809012834-nl0rs.jpg",                                   // ảnh bìa đầu trang
    invitationBg:  "assets/images/tai-xuong-3-20250809013906-e7pns.jpg",                                 // nền phần lời mời
    groomPhoto:    "assets/images/betterimage_1754671511212-20250809012834-ygz08.jpeg",                  // ảnh chú rể
    bridePhoto:    "assets/images/z6888086411462_e6d2e5a13ee8213498d76f9c59acac10-20250809012835-jo_ki.jpg", // ảnh cô dâu
    storyBanner:   "assets/images/z6888117023198_c24fe7d0cb4f28c899222a499b237729-20250809012834-9fkoy.jpg", // ảnh dưới câu chuyện
    venueFrame:    "assets/images/khung-1-20260627103609-ljqxv.png",                                     // khung phần địa điểm
    venueLogo:     "assets/images/logo-1-20260627103708-dbcrb.png",                                      // logo phần địa điểm
    calendarBg:    "assets/images/tai-xuong-2-20250809012834-fpjgn.jpg",                                 // nền lịch
    albumHero:     "assets/images/snapedit_1754670036384-20250809012838-xbxki.jpeg",                     // ảnh lớn đầu album
    albumThumb1:   "assets/images/snapedit_1754669957636-20250809012839-8oehf.jpeg",                     // 3 ảnh nhỏ bên phải
    albumThumb2:   "assets/images/z6888086411462_e6d2e5a13ee8213498d76f9c59acac10-20250809012835-jo_ki-45b8b8.jpg",
    albumThumb3:   "assets/images/z6888086390173_724fd2f9e818a30255fd5376535e6323-20250809012835-wcp3l.jpg",
    thankYouBg:    "assets/images/z6888086390153_6ad418f0bd3ef4e64e5141b55a7f606c-20250809012838-3nxjw-b771be.jpg",
    thankYouPopup: "assets/images/z6888117029043_537cea14c5d7211be8130d3285da74cd-20250809012834-pe7nn-7bdbbc.jpg",
    rsvpGroom:     "assets/images/betterimage_1754671511212-20250809012834-ygz08-c54c61.jpeg",           // ảnh chọn "Chú Rể" trong form
    rsvpBride:     "assets/images/tai-xuong-1-20250809012834-bywlo-ecbf68.jpg",                          // ảnh chọn "Cô Dâu" trong form
  },

  // Thư viện ảnh (số lượng giữ nguyên 14; muốn thêm/bớt phải sửa HTML gallery)
  gallery: [
    "assets/images/z6888117023198_c24fe7d0cb4f28c899222a499b237729-20250809012834-9fkoy-152ef1.jpg",
    "assets/images/tai-xuong-2-20250809012834-fpjgn-4ef087.jpg",
    "assets/images/tai-xuong-20250809012834-nl0rs-5bc344.jpg",
    "assets/images/tai-xuong-1-20250809012834-bywlo.jpg",
    "assets/images/snapedit_1754669975683-20250809012839-rumax.jpeg",
    "assets/images/z6888086390173_724fd2f9e818a30255fd5376535e6323-20250809012835-wcp3l-27baf2.jpg",
    "assets/images/z6888086411462_e6d2e5a13ee8213498d76f9c59acac10-20250809012835-jo_ki-8c86fd.jpg",
    "assets/images/z6888086411495_2cdf05ca7fc44fab7677126b5bf0e43e-20250809012835-g3u2m.jpg",
    "assets/images/z6888086390153_6ad418f0bd3ef4e64e5141b55a7f606c-20250809012838-3nxjw.jpg",
    "assets/images/snapedit_1754670036384-20250809012838-xbxki-1d51c0.jpeg",
    "assets/images/betterimage_1754671494992-20250809012834-m-edg.jpeg",
    "assets/images/betterimage_1754671511212-20250809012834-ygz08-c1fdc2.jpeg",
    "assets/images/z6888117029043_537cea14c5d7211be8130d3285da74cd-20250809012834-pe7nn.jpg",
    "assets/images/snapedit_1754669957636-20250809012839-8oehf-0af852.jpeg",
  ],

  /* ---------- 12. NHẠC NỀN ---------- */
  music: {
    src: "https://cdn.jsdelivr.net/gh/beckneee-dev/mp3-hosting/Lana Del Rey - Young And Beautiful.mp3",
    // Hoặc file nội bộ: "assets/music/bai-hat.mp3"
    autoStartOnFirstTouch: true,   // tự phát khi khách chạm/click lần đầu
    volume: 1,                     // 0 → 1
  },

  /* ---------- 13. MỪNG CƯỚI (QR + số tài khoản) ---------- */
  gifts: {
    groom: { qrImage: "", accountNumber: "" },   // ảnh QR + số tài khoản chú rể
    bride: { qrImage: "", accountNumber: "" },   // ảnh QR + số tài khoản cô dâu
  },

  /* ---------- 14. CHÂN TRANG ---------- */
  footer: {
    brand: "Thiệp cưới online - Nhà Có Hỷ",
    tiktok:   "https://www.tiktok.com/@nhacohyonline",
    facebook: "https://www.facebook.com/thiepcuoionlinenhacohy",
    zalo:     "https://zalo.me/0397336324",
  },

  /* ---------- 15. LỜI CHÚC (Google Apps Script) ---------- */
  wishApiUrl: "https://script.google.com/macros/s/AKfycbzxzPLM6pqpWh_eGME3JnYHbmveRaTSle17xcivQjliJBAOhUcE1ZVbYtsiW6_HFVtQ/exec",

  /* ---------- 16. MÀN HÌNH MỞ THIỆP ---------- */
  intro: {
    enabled: true,
    greeting: "Xin chào",             // thêm ", <tên khách>" nếu link có ?name=
    subtitle: "Đang mở thiệp cưới của",
    message: "Vui lòng chờ...",
    autoOpenDelay: 4200,              // ms
    slideDirection: "right",          // "left" | "right"
  },

  /* ---------- 17. KHÁC ---------- */
  protectContent: true,               // chặn chuột phải, F12, Ctrl+U/S, bôi đen chữ
};
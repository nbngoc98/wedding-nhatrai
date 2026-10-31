/* =====================================================================
   CONFIG THIỆP CƯỚI  —  CHỈ CẦN SỬA FILE NÀY
   ---------------------------------------------------------------------
   - Dùng chung cho index.html (trang bìa) và content.html (nội dung).
   - Để trống ("") một mục ảnh/chữ  => giữ nguyên giá trị gốc trong thiệp.
   - Xuống dòng trong chữ: dùng \n
   - Ảnh: dán link https://... hoặc đường dẫn file, ví dụ "images/anh1.jpg"
   ===================================================================== */
window.WEDDING_CONFIG = {

  /* ===================================================================
     1. KHÁCH MỜI  (tên hiển thị ở trang bìa, thay cho "Mai Anh")
     -------------------------------------------------------------------
     Gửi link theo mẫu:
        https://domain.com/index.html?name=Mai%20Anh
        https://domain.com/index.html?name=Anh+Tuấn
     Không có ?name=...  =>  hiện defaultName ("Quý Khách")
     =================================================================== */
  guest: {
    paramName: "name",                 // tên tham số trên URL
    aliases: ["ten", "guest", "to"],   // các tên tham số khác cũng được chấp nhận
    defaultName: "Quý Khách",          // khi URL không có tên
    maxLength: 60,                     // cắt bớt nếu tên quá dài
    autoShrink: true,                  // tên dài thì tự thu nhỏ chữ cho vừa khung
    prefillRsvpName: true              // tự điền tên khách vào ô "Tên của bạn" ở form xác nhận
  },

  /* ===================================================================
     2. TÊN TRANG / TIÊU ĐỀ TAB TRÌNH DUYỆT
     Lưu ý: ảnh/mô tả khi chia sẻ qua Zalo/Facebook được đọc từ thẻ <meta>
     trong file HTML (bot không chạy JavaScript), nên muốn đổi phần đó
     phải sửa thẻ og:* trong <head> của HTML.
     =================================================================== */
  pages: {
    cover:   "index.html",             // trang bìa
    content: "content.html"            // trang nội dung (nút trên bìa sẽ mở trang này)
  },
  site: {
    cover:   { title: "Bảo Ngọc & Hoàng Nhi Wedding", favicon: "" },
    content: { title: "Bảo Ngọc & Hoàng Nhi Wedding", favicon: "" }
  },

  /* ===================================================================
     3. CÔ DÂU – CHÚ RỂ – GIA ĐÌNH
     =================================================================== */
  couple: {
    groom: {
      name: "Bảo Ngọc",
      role: "Chú rể",
      father: "Ông. Nguyễn Mạnh Hùng",
      mother: "Bà. Nguyễn Thị Tố Nga"
    },
    bride: {
      name: "Hoàng Nhi",
      role: "Cô dâu",
      father: "Ông. Huỳnh Tấn Quang",
      mother: "Bà. Lê Thị Hằng"
    },
    groomFamilyLabel: "nhà trai",
    brideFamilyLabel: "nhà gái"
  },

  /* ===================================================================
     4. NGÀY GIỜ – ĐỊA ĐIỂM
     Ngày tháng năm, thứ trong tuần, lịch tuần "Save the date"
     đều TỰ SINH từ event.date.
     =================================================================== */
  event: {
    date: "2026-12-06",                // YYYY-MM-DD
    time: "11:30",                     // giờ ghi trên thiệp
    lunarDate: "( Tức ngày 28 tháng 10 năm Bính Ngọ )",
    venueLabel: "Sân Vận Động Tân Hòa",
    address: "Phường Tân Hải, TP. Hồ Chí Minh",
    mapLink: "https://maps.app.goo.gl/1Xue7gxabbVfxvGZ9",
    // Thời điểm đồng hồ đếm ngược chạy tới (giờ Việt Nam +07:00)
    countdownTo: "2026-12-06T00:00:00+07:00"
  },

  /* ===================================================================
     5. TIMELINE  (xếp từ trên xuống dưới, tối đa 4 mục)
     =================================================================== */
  timeline: [
    { time: "10:30",  title: "Đón Khách" },
    { time: "11:30", title: "Lễ Nghi" },
    { time: "11:45", title: "Khai tiệc" },
    // { time: "21:30", title: "ÂM NHẠC" }
  ],

  
  /* ===================================================================
     6. DRESS CODE  (4 ô màu, từ trái sang phải)
     =================================================================== */
  dressCode: ["#000000", "#840b1d", "#705628", "#e1d5bf"],
 
  /* ===================================================================
     7. ẢNH CỦA CẶP ĐÔI
     =================================================================== */
  photos: {
    // --- trang nội dung ---
    heroPolaroidTop:     "image/BAO_6453.jpg",  // ảnh nghiêng trên cùng (bìa)
    heroPolaroidBottom:  "image/BAO_6322.jpg",   // ảnh nghiêng dưới (bìa)
    bannerWeAre:         "image/BAO_6453.jpg",   // nền "We are Getting Married"
    bannerWhereLove:     "image/BAO_6183.jpg",   // nền "Where Love Begins"
    fullPhoto:           "image/BAO_5973.jpg",   // ảnh lớn ngay sau Timeline
    saveTheDateFrame:    "image/BAO_5924.jpg",   // ảnh trong khung ở mục Save the date
    bridePhoto:          "image/BAO_6769.jpg",   // ảnh cô dâu
    groomPhoto:          "image/BAO_8381.jpg",   // ảnh chú rể
    thankYouPhoto:       "image/BAO_7488.jpg",   // ảnh phần "Thank you!" (cuối trang)
    popupPhoto:          "image/BAO_7488.jpg",   // ảnh popup sau khi gửi xác nhận
 
    // --- album: thêm / bớt bao nhiêu ảnh tuỳ ý (mỗi dòng 1 ảnh) ---
    gallery: [
      "image/BAO_6453.jpg",
      "image/BAO_6322.jpg",
      "image/BAO_6183.jpg",
      "image/BAO_5973.jpg",
      "image/BAO_5924.jpg",
      "image/BAO_6769.jpg",
      "image/BAO_8381.jpg",
      "image/BAO_7488.jpg"
    ]
  },
 
  /* ===================================================================
     8. NHẠC NỀN  (trang nội dung)
     Có thể thêm nhiều bài, hết bài sẽ chuyển bài kế tiếp rồi quay vòng.
     =================================================================== */
  music: {
    enabled: true,
    playlist: [
      "https://camcui.vn/bai417.mp3"
      // , "music/bai2.mp3"
    ],
    volume: 1                          // 0 → 1
  },
 
  /* ===================================================================
     9. LIÊN KẾT MẠNG XÃ HỘI (chân trang). Để "" để ẩn biểu tượng.
     =================================================================== */
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61557384251600",
    tiktok:   "https://www.tiktok.com/@thiepcuoi.online?is_from_webapp=1&sender_device=pc",
    zalo:     "https://zalo.me/0968378902"
  },
 
  /* ===================================================================
     10. LỜI CHÚC (Google Apps Script)
     weddingId: mã để tách lời chúc của từng thiệp trong cùng 1 sheet.
     =================================================================== */
  wishes: {
    weddingId: "ivy",
    api: "https://script.google.com/macros/s/AKfycbxMQvp2C4Dz6ntvpPoNHzJl0doaknjNmX86VmeI83E64dJ8M25RVl5-t01aqyuZR7PS/exec",
    title: "YOUR WISHES",
    caption: "Messages from our loved ones",
    loadingText: "Đang tải lời chúc...",
    emptyText: "Chưa có lời chúc nào.",
    errorText: "Không thể tải lời chúc.",
    connectErrorText: "Không thể kết nối hệ thống."
  },
 
  /* ===================================================================
     11. FORM XÁC NHẬN THAM DỰ
     =================================================================== */
  rsvp: {
    namePlaceholder: "Tên của bạn",
    messagePlaceholder: "Gửi lời nhắn đến cô dâu chú rể",
    attendancePlaceholder: "Bạn sẽ đến chứ?",
    attendanceOptions: ["Tôi chắc chắn sẽ đến", "Xin lỗi, Tôi bận rồi!"],
    sidePlaceholder: "Bạn là khách mời của ai?",
    sideOptions: ["Khách mời Cô Dâu", "Khách mời Chú Rể"],
    companionsPlaceholder: "Số lượng tham dự cùng?"
  },
 
  /* ===================================================================
     11b. KIỂU CHỮ CỦA DÒNG TÊN KHÁCH (chỗ {guest} trong inviteLine)
     Font có sẵn trong thiệp (dán nguyên mã vào fontFamily):
       "VVZOSGhVGFMSdGY"                         chữ viết tay (giống tên khách ở trang bìa)
       "QkhOIEJQIEVDQVRIRVJJTkEgTUVESVVNLkURg"   chữ thư pháp (giống tên cô dâu chú rể)
       "MUZUViWSVAtQlJJVElTSCHUkVFTiUVEY"        chữ in hoa trang trọng
       "TESQSSRUdVTEFSLlRURg"                    chữ thường (Lora)
     Để "" = kế thừa từ câu chữ xung quanh.
     =================================================================== */
  guestLineStyle: {
     googleFont: ["Pinyon Script", "Great Vibes"],
    fontFamily: '"Pinyon Script", "Great Vibes", "TESQSSRUdVTEFSLlRURg", cursive',
    fontSize: "20px",          // chữ thư pháp nhìn nhỏ hơn chữ thường nên để lớn hơn
    fontWeight: "400",
    color: "",                 // vd "#6b4423"; để "" = cùng màu chữ xung quanh
    letterSpacing: "0px",
    textTransform: "capitalize",
    lineHeight: "1.2"
  },
 
  /* ===================================================================
     12. CÂU CHỮ CỐ ĐỊNH TRÊN THIỆP
     =================================================================== */
  texts: {
    cover: {
      invite: "trân trọng kính mời"
    },
    content: {
      saveTheDateSmall: "save the date",
      countdownTitle:   "begins in...",
      weAre:            "We are",
      gettingMarried:   "Getting Married",
      inviteLine:       "trân trọng kính mời\n{guest}\n đến dự bữa tiệc chung vui cùng gia đình chúng tôi",   // {guest} = tên khách (?name=...), mặc định "Quý Khách"
      eventIntro:       "được tổ chức vào lúc",   // dòng trên "11:00, chủ nhật"
      directions:       "Chỉ đường",
      closing:          "Hân hạnh được đón tiếp!",
      whereSmall:       "Where",
      whereBig:         "Love Begins",
      timelineTitle:    "Timeline",
      dressCodeTitle:   "Dress code",
      saveTheDateTitle: "Save the date",
      loveStory:        "Tình yêu của anh và em là một hành trình kỳ diệu, vượt qua bao thử thách để cùng nhau bước đến ngày trọng đại\n– đám cưới của chúng mình.\nĐám cưới này là lời cam kết chân thành, là sự bắt đầu của một chương mới – nơi chúng ta cùng vun đắp tổ ấm, cùng sẻ chia mọi vui buồn và cùng nắm tay nhau đi đến cuối con đường mang tên hạnh phúc.",
      rsvpIntro:        "Hãy xác nhận sự có mặt của bạn để chúng mình\nchuẩn bị đón tiếp một cách chu đáo nhất.\nTrân trọng!",
      rsvpButton:       "GỬI LỜI NHẮN & xác nhận",
      thankYou:         "Thank you!",
      footerBrand:      "JMII Wedding Invitation",
      popupMessage:     "Cảm ơn bạn đã dành thời gian phản hồi.\nChúng mình vô cùng trân quý sự quan tâm của bạn.",
      popupTitle:       "Thank you!"
    }
  },
 
  /* ===================================================================
     13. ẢNH TRANG TRÍ (hoa, khung, giấy nền...) — thường giữ nguyên.
     Một key đổi nhiều vị trí cùng lúc. Để "" = giữ nguyên.
     =================================================================== */
  decor: {
    cover: {
      paperTexture:  "https://w.ladicdn.com/s750x950/6322a62f2dad980013bb5005/thiep-thanh-dat-element_0033_1-20251010160355-v6bgi.png",
      borderFlower:  "https://w.ladicdn.com/s750x550/6322a62f2dad980013bb5005/elm_0016_vector-smart-object-copy-4-20260730161858-5w9cj.png",
      photoFrame:    "https://w.ladicdn.com/s700x550/6322a62f2dad980013bb5005/elm_0000s_0003_chatgpt-image-aug-23-2026-02_39_42-am-20260823161520-k75gk.png",
      heartIcon:     "https://w.ladicdn.com/s400x400/6322a62f2dad980013bb5005/elm_0000s_0000_chatgpt-image-aug-23-2026-01_31_51-am-20260823161520-a7lma.png",
      tapIcon:       "https://w.ladicdn.com/s400x400/6322a62f2dad980013bb5005/fff-20250420034256-byv87.png",
      flowerSprayA:  "https://w.ladicdn.com/s450x600/6322a62f2dad980013bb5005/group-1-copy-20260824180757-2kfru.png",
      flowerSprayB:  "https://w.ladicdn.com/s400x600/6322a62f2dad980013bb5005/group-2-copy-20260824180758-_oxqa.png"
    },
    content: {
      paperTexture:    "https://w.ladicdn.com/s750x950/6322a62f2dad980013bb5005/thiep-thanh-dat-element_0033_1-20251010160355-v6bgi.png",
      topBorderFlower: "https://w.ladicdn.com/s750x550/6322a62f2dad980013bb5005/vector-smart-object-20260823154006-exf34.png",
      cornerFlowers:   "https://w.ladicdn.com/s550x700/6322a62f2dad980013bb5005/chatgpt-image-aug-25-2026-01_38_30-am-20260824183718-ju4w5.png",
      flowerSprayA:    "https://w.ladicdn.com/s450x600/6322a62f2dad980013bb5005/group-1-copy-20260824180757-2kfru.png",
      flowerSprayB:    "https://w.ladicdn.com/s400x600/6322a62f2dad980013bb5005/group-2-copy-20260824180758-_oxqa.png",
      leafRibbon:      "https://w.ladicdn.com/s550x500/6322a62f2dad980013bb5005/fff-20260824182259-z1o8d.png",
      photoFrameBack:  "https://w.ladicdn.com/s650x550/6322a62f2dad980013bb5005/elm_0000s_0003_chatgpt-image-aug-23-2026-02_39_42-am-20260823161520-k75gk.png",
      photoFrameFront: "https://w.ladicdn.com/s650x550/6322a62f2dad980013bb5005/elm_0000s_0002_1785579634202_1005136413222070383_g5656411048527800034_e187c354984d4457f0b040903c177648-20260823161520-ckkhc.png",
      heartIcon:       "https://w.ladicdn.com/s400x400/6322a62f2dad980013bb5005/elm_0000s_0000_chatgpt-image-aug-23-2026-01_31_51-am-20260823161520-a7lma.png",
      plasterTexture:  "https://w.ladicdn.com/s750x1100/67a2c614dc936a00127438e5/thiep-phuong-anh-element_0038_clear-white-plaster-texture-pattern-copy-9-20260626180121-miev4.png",
      // icon timeline, từ trên xuống dưới
      timelineIcons: [
        "https://w.ladicdn.com/s400x350/6322a62f2dad980013bb5005/element_0013_15-20251128150902-8jlgc.png",
        "https://w.ladicdn.com/s400x400/6322a62f2dad980013bb5005/element_0012_16-20251128150902-x0agu.png",
        "https://w.ladicdn.com/s400x350/6322a62f2dad980013bb5005/element_0011_17-20251128150902-k7sz7.png",
        "https://w.ladicdn.com/s400x400/6322a62f2dad980013bb5005/element_0010_18-20251128150902-ioger.png"
      ]
    }
  },
 
  /* ===================================================================
     14. NÂNG CAO (tuỳ chọn) — chỉnh bất kỳ phần tử nào theo ID trong HTML
     -------------------------------------------------------------------
     imageOverrides : { "IMAGE17": "link-anh" }       đổi ảnh nền phần tử
     textOverrides  : { "HEADLINE20": "chữ\ndòng 2" }  đổi chữ phần tử
     hide           : ["IMAGE54", "GROUP15"]           ẩn phần tử
     =================================================================== */
  advanced: {
    cover:   { imageOverrides: {}, textOverrides: {}, hide: [] },
    content: { imageOverrides: {}, textOverrides: {}, hide: [] }
  }
};
 
let orderList = [];
// Konstanta untuk menyimpan harga satuan asli (price per unit)
const PRICE_PER_UNIT = "pricePerUnit";

// Fungsi untuk format mata uang Rupiah
function formatRupiah(angka) {
  // Fungsi bawaan toLocaleString() lebih baik digunakan jika environment mendukungnya
  return "Rp " + Math.round(angka).toLocaleString("id-ID");
}

function addToOrder(menu, hargaSatuan, jumlah = 1) {
  jumlah = parseInt(jumlah) || 1;
  // Jika menu sudah ada, tambahkan jumlah dan total harga
  const existing = orderList.find((item) => item.menu === menu);

  if (existing) {
    existing.jumlah += jumlah;
    // Tidak perlu mengupdate 'harga' di sini, karena 'harga' sekarang adalah harga satuan
  } else {
    // Menyimpan harga satuan di properti baru PRICE_PER_UNIT (agar tidak dobel hitung)
    orderList.push({ menu, [PRICE_PER_UNIT]: hargaSatuan, jumlah });
  }
  updateSummary();
  showToast(`${menu} (${jumlah}) berhasil ditambahkan!`);
}

// Update ringkasan pesanan
function updateSummary() {
  const summary = document.getElementById("orderSummary");
  if (orderList.length === 0) {
    summary.innerHTML = "<em>Belum ada pesanan.</em>";
    return;
  }

  let html = '<ul style="padding-left:18px;">';
  let total = 0;

  orderList.forEach((item, index) => {
    // Hitung subtotal berdasarkan harga satuan asli dan jumlah
    const hargaSatuan = item[PRICE_PER_UNIT];
    const subtotal = hargaSatuan * item.jumlah;
    total += subtotal;

    // Tambahkan tombol hapus
    html += `
            <li style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 5px;">
                <span>${item.menu} x ${item.jumlah}</span>
                <span>${formatRupiah(subtotal)}</span>
                <button onclick="removeOrderItem(${index})" style="background:var(--deep-maroon);color:var(--cream-gold);border:1px solid var(--cream-gold);padding: 2px 8px;border-radius:12px;font-size:0.8rem;margin-left:10px;">Hapus</button>
            </li>
        `;
  });

  html += `</ul><strong style="display:block;margin-top:10px;">Total: ${formatRupiah(
    total
  )}</strong>`;
  summary.innerHTML = html;
}

// Hapus item pesanan
function removeOrderItem(index) {
  const itemNama = orderList[index].menu;
  orderList.splice(index, 1);
  updateSummary();
  showToast(`${itemNama} berhasil dihapus dari pesanan.`);
}

// Submit pesanan
function submitOrder(e) {
  e.preventDefault();
  if (orderList.length === 0) {
    alert("Silakan pilih menu terlebih dahulu!");
    return;
  }
  const nama = document.getElementById("namaPemesan").value;
  const alamat = document.getElementById("alamatPemesan").value;
  // Tampilkan loader
  const submitButton = e.target.querySelector('button[type="submit"]');
  const loader = document.getElementById("orderLoader");

  submitButton.style.display = "none";
  loader.style.display = "flex"; // Gunakan flex agar icon dan teks sejajar

  // Hitung total akhir
  const finalTotal = orderList.reduce(
    (sum, item) => sum + item[PRICE_PER_UNIT] * item.jumlah,
    0
  );

  // Simulasi proses submit selama 1.5 detik
  setTimeout(() => {
    loader.style.display = "none";
    submitButton.style.display = "block"; // Tampilkan kembali tombol submit

    const summaryDiv = document.getElementById("orderSummary");
    summaryDiv.innerHTML = `
            <h3 style="color:var(--cream-gold);margin-top:0;">✅ Pesanan Berhasil!</h3>
            <p><strong>Nama:</strong> ${nama}</p>
            <p><strong>No Meja:</strong> ${alamat}</p>
            <div style="font-weight:bold;font-size:1.2rem;border-top:1px solid rgba(231, 197, 156, 0.4);padding-top:10px;display:flex;justify-content:space-between;">
                <span>TOTAL AKHIR:</span>
                <span>${formatRupiah(finalTotal)}</span>
            </div>
            <em style="display:block;margin-top:15px;">Pesanan Anda sedang diproses. Terima kasih!</em>
        `;

    showToast(
      `Terima kasih ${nama}! Pesanan Anda (Total ${formatRupiah(
        finalTotal
      )}) sedang disiapkan.`
    );

    orderList = [];
    document.getElementById("namaPemesan").value = "";
    document.getElementById("alamatPemesan").value = "";

    // Scroll ke ringkasan setelah submit
    document.getElementById("summary").scrollIntoView({ behavior: "smooth" });
  }, 1500);
}

window.addEventListener("DOMContentLoaded", function () {
  // Welcome overlay
  const welcomeOverlay = document.getElementById("welcomeOverlay");
  const welcomeBtn = document.getElementById("welcomeBtn");
  if (welcomeOverlay && welcomeBtn) {
    welcomeBtn.onclick = function () {
      welcomeOverlay.classList.remove("show");
      setTimeout(() => {
        welcomeOverlay.style.display = "none";
      }, 400);
    };
  }

  // Popup menu detail
  // Menambahkan parameter 'hargaSatuan' dan 'jumlahDefault'
  function showMenuDetail(menu, hargaSatuan, imgSrc, jumlahDefault = 1) {
    document.getElementById("overlay").classList.add("active");
    const popup = document.getElementById("menuDetailPopup");
    popup.classList.add("show");
    popup.style.display = "flex";

    // Update konten popup
    document.getElementById("popupTitle").textContent = menu;
    document.getElementById("popupImg").src = imgSrc;
    document.getElementById("popupPrice").textContent =
      formatRupiah(hargaSatuan); // Tampilkan harga satuan saja di sini

    // Tambahkan/Update input jumlah pada popup
    let jumlahInput = document.getElementById("popupJumlahInput");
    if (!jumlahInput) {
      jumlahInput = document.createElement("input");
      jumlahInput.type = "number";
      jumlahInput.min = "1";
      jumlahInput.id = "popupJumlahInput";
      // Sesuaikan style agar sejalan dengan desain glassmorphism/tema
      jumlahInput.style.cssText =
        "padding: 10px 12px; border-radius: 10px; border: 1.5px solid var(--border-input); font-size: 1rem; background: rgba(44, 33, 26, 0.6); color: var(--text-color-light); width: 60px; margin: 12px auto; text-align:center;";
      jumlahInput.setAttribute("aria-label", "Jumlah " + menu);
      document.getElementById("popupPrice").after(jumlahInput);
    } else {
      jumlahInput.style.display = "inline-block";
    }

    // Mengambil nilai jumlah dari menu card yang diklik
    jumlahInput.value = parseInt(jumlahDefault) || 1;

    // Update total harga saat input jumlah diubah
    const totalHargaElement = document.getElementById("popupTotalHarga");
    if (!totalHargaElement) {
      const newTotal = document.createElement("p");
      newTotal.id = "popupTotalHarga";
      newTotal.style.fontWeight = "bold";
      newTotal.style.fontSize = "1.2rem";
      newTotal.style.color = "var(--dark-cream)";
      jumlahInput.after(newTotal);
    }

    // Fungsi untuk mengupdate tampilan harga total di popup
    const updatePopupTotal = () => {
      const currentJumlah = parseInt(jumlahInput.value) || 1;
      const subtotal = hargaSatuan * currentJumlah;
      document.getElementById(
        "popupTotalHarga"
      ).textContent = `Total: ${formatRupiah(subtotal)}`;
    };

    jumlahInput.oninput = updatePopupTotal;
    updatePopupTotal(); // Panggil pertama kali

    // Logika tombol "Pesan Menu Ini"
    document.getElementById("popupOrderBtn").onclick = function () {
      // Ambil jumlah final dari input popup
      const finalJumlah = parseInt(jumlahInput.value) || 1;

      addToOrder(menu, hargaSatuan, finalJumlah);
      closeMenuDetail();
      // Setelah ditutup, reset atau sembunyikan elemen dinamis jika perlu
    };
  }

  function closeMenuDetail() {
    document.getElementById("overlay").classList.remove("active");
    const popup = document.getElementById("menuDetailPopup");
    popup.classList.remove("show");
    setTimeout(() => {
      popup.style.display = "none";
    }, 400);
  }

  document.getElementById("closePopup").onclick = closeMenuDetail;
  document.getElementById("overlay").onclick = closeMenuDetail;

  // Expose showMenuDetail and removeOrderItem globally
  window.showMenuDetail = showMenuDetail;
  window.removeOrderItem = removeOrderItem;
});

// Notifikasi (TOAST)
function showToast(message) {
  let toast = document.getElementById("toastNotif");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toastNotif";
    toast.style.cssText = `
            position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%) scale(0.98); 
            background: linear-gradient(90deg, var(--cream-gold) 60%, var(--dark-cream) 100%); 
            color: var(--deep-maroon); padding: 14px 32px; border-radius: 24px; font-weight: 700; 
            font-size: 1.12rem; box-shadow: 0 4px 18px var(--shadow-accent); z-index: 10002; 
            opacity: 0; transition: opacity 0.4s, transform 0.4s;
        `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = "1";
  toast.style.transform = "translateX(-50%) scale(1.04)";
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) scale(0.98)";
  }, 1800);
}

// Fitur pencarian dan filter menu
function filterMenu() {
  const search = document.getElementById("searchMenu").value.toLowerCase();
  document.querySelectorAll(".menu-card").forEach((card) => {
    const nama = card.querySelector("h3").textContent.toLowerCase();
    card.style.display = !search || nama.includes(search) ? "flex" : "none"; // Gunakan 'flex' karena menu-card adalah flex
  });
}
document.getElementById("searchMenu").addEventListener("input", filterMenu);
// Cegah submit form search dan filter menu saat enter
document.querySelector(".search-wrap").addEventListener("submit", function (e) {
  e.preventDefault();
  filterMenu();
});

// Tombol kembali ke atas dan animasi ringkasan
const backToTopBtn = document.getElementById("backToTopBtn");
const summarySection = document.querySelector(".summary-section");
if (summarySection) {
  summarySection.style.transition = "opacity 0.5s, transform 0.5s";
  // summarySection.style.opacity = "0"; // Biarkan di CSS agar tidak mengganggu load awal
  // summarySection.style.transform = "translateY(40px)";
}
let lastScrollY = window.scrollY;
window.addEventListener("scroll", function () {
  // Tombol ke atas
  if (window.scrollY > 200) {
    backToTopBtn.style.display = "flex";
    backToTopBtn.style.opacity = "1";
  } else {
    backToTopBtn.style.opacity = "0";
    setTimeout(() => {
      backToTopBtn.style.display = "none";
    }, 300);
  }

  // Ringkasan animasi
  if (!summarySection) return;
  const rect = summarySection.getBoundingClientRect();
  const isVisible = rect.top < window.innerHeight - 100;

  if (isVisible) {
    summarySection.style.opacity = "1";
    summarySection.style.transform = "translateY(0)";
  } else if (window.scrollY < lastScrollY) {
    // Sembunyikan hanya saat scroll ke atas menjauhi section
    summarySection.style.opacity = "0";
    summarySection.style.transform = "translateY(40px)";
  }
  lastScrollY = window.scrollY;
});

backToTopBtn.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Tampilkan tombol hamburger di layar kecil
function checkNavToggle() {
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");
  if (window.innerWidth <= 700) {
    if (navToggle) navToggle.style.display = "block";
    if (navMenu) navMenu.style.display = "none";
  } else {
    if (navToggle) navToggle.style.display = "none";
    if (navMenu) navMenu.style.display = "flex";
  }
}
window.addEventListener("resize", checkNavToggle);
checkNavToggle(); // Panggil saat load

if (document.getElementById("navToggle")) {
  document.getElementById("navToggle").onclick = function () {
    var navMenu = document.getElementById("navMenu");
    if (navMenu.style.display === "none") {
      navMenu.style.display = "flex";
    } else {
      navMenu.style.display = "none";
    }
  };
}

// Expose submitOrder globally
window.submitOrder = submitOrder;

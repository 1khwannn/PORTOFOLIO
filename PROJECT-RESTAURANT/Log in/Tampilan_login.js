      function showAlert(message, type) {
        const oldAlert = document.querySelector(".custom-alert");
        if (oldAlert) oldAlert.remove();

        const alert = document.createElement("div");
        alert.className =
          "custom-alert" + (type === "error" ? " alert-error" : "");
        alert.textContent = message;
        document.body.appendChild(alert);

        setTimeout(() => {
          alert.style.opacity = "0";
          alert.style.transform = "translate(-50%, -20px)";
          setTimeout(() => alert.remove(), 400);
        }, 2500);
      }

      document
        .getElementById("login-form")
        .addEventListener("submit", function (e) {
          e.preventDefault();

          const username = document.getElementById("username").value.trim();
          const password = document.getElementById("password").value.trim();

          const storedData = localStorage.getItem("registeredUser");
          const userData = storedData ? JSON.parse(storedData) : null;

          if (!userData) {
            showAlert(
              "❌ Belum ada akun terdaftar. Silakan daftar terlebih dahulu.",
              "error"
            );
            return;
          }

          if (
            username === userData.username &&
            password === userData.password
          ) {
            showAlert(
              "✅ Login berhasil! Selamat datang, " + username + ".",
              "success"
            );
            setTimeout(() => {
              window.location.href = "/PROJECT-RESTAURANT/Beranda/beranda_tentang_resto.html";
            }, 2000);
          } else {
            showAlert("❌ Nama Pengguna atau Kata Sandi salah!", "error");
          }
        });
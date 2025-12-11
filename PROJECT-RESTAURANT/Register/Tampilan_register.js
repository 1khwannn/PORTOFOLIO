      document
        .getElementById("register-form")
        .addEventListener("submit", function (e) {
          e.preventDefault();

          const username = document.getElementById("username").value.trim();
          const password = document.getElementById("password").value.trim();
          const confirm = document
            .getElementById("confirm-password")
            .value.trim();

          if (!username || !password || !confirm) {
            showAlert("❌ Semua kolom wajib diisi!", "error");
            return;
          }

          if (password.length < 6) {
            showAlert("❌ Kata sandi harus minimal 6 karakter!", "error");
            return;
          }

          if (password !== confirm) {
            showAlert("❌ Kata sandi tidak cocok!", "error");
            return;
          }

          localStorage.setItem(
            "registeredUser",
            JSON.stringify({ username, password })
          );

          showAlert("✅ Pendaftaran berhasil! Silakan login.", "success");

          setTimeout(() => {
            window.location.href = "/PROJECT-RESTAURANT/Log in/Tampilan_login.html";
          }, 2000);
        });

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
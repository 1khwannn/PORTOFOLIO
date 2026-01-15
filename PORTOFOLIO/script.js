      const darkModeToggle = document.getElementById("dark-mode-toggle");
      const body = document.body;
      const darkModeIcon = darkModeToggle.querySelector("i");

      const isDarkMode = localStorage.getItem("darkMode") === "enabled";
      if (isDarkMode) {
        body.classList.add("dark-mode");
        darkModeIcon.classList.remove("fa-moon");
        darkModeIcon.classList.add("fa-sun");
      } else {
        darkModeIcon.classList.remove("fa-sun");
        darkModeIcon.classList.add("fa-moon");
      }

      darkModeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");

        if (body.classList.contains("dark-mode")) {
          darkModeIcon.classList.remove("fa-moon");
          darkModeIcon.classList.add("fa-sun");
          localStorage.setItem("darkMode", "enabled");
        } else {
          darkModeIcon.classList.remove("fa-sun");
          darkModeIcon.classList.add("fa-moon");
          localStorage.setItem("darkMode", "disabled");
        }
      });

      const scrollToTopBtn = document.getElementById("scrollToTopBtn");

      window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
          scrollToTopBtn.style.display = "block";
        } else {
          scrollToTopBtn.style.display = "none";
        }
      });

      scrollToTopBtn.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });

      const menuToggle = document.getElementById("menu-toggle");
      const navList = document.getElementById("nav-list");

      menuToggle.addEventListener("click", () => {
        navList.classList.toggle("open");
        const icon = menuToggle.querySelector("i");
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-times");
      });

      navList.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          if (window.innerWidth <= 768) {
            navList.classList.remove("open");
            menuToggle.querySelector("i").classList.remove("fa-times");
            menuToggle.querySelector("i").classList.add("fa-bars");
          }
        });
      });

      const form = document.getElementById("contact-form");
      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const messageInput = document.getElementById("message");
      const nameError = document.getElementById("name-error");
      const emailError = document.getElementById("email-error");
      const messageError = document.getElementById("message-error");
      const popup = document.getElementById("success-popup");
      const closePopup = document.getElementById("close-popup");

      function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      }

      form.addEventListener("submit", async function (e) {
        e.preventDefault();
        nameError.textContent =
          emailError.textContent =
          messageError.textContent =
            "";
        let valid = true;

        if (nameInput.value.trim() === "") {
          nameError.textContent = "Please enter your name.";
          valid = false;
        }
        if (!validateEmail(emailInput.value.trim())) {
          emailError.textContent = "Please enter a valid email.";
          valid = false;
        }
        if (messageInput.value.trim() === "") {
          messageError.textContent = "Please enter your message.";
          valid = false;
        }

        if (valid) {
          const formData = new FormData(form);
          try {
            const response = await fetch(form.action, {
              method: "POST",
              body: formData,
              headers: {
                Accept: "application/json",
              },
            });

            if (response.ok) {
              form.reset();
              popup.classList.add("show");
              setTimeout(() => popup.classList.remove("show"), 3000);
            } else {
              alert("Oops! Terjadi masalah saat mengirim pesan Anda.");
            }
          } catch (error) {
            console.error("Submission error:", error);
            alert("Oops! Terjadi kesalahan jaringan. Coba lagi nanti.");
          }
        }
      });

      closePopup.addEventListener("click", () =>
        popup.classList.remove("show")
      );

      const music = document.getElementById("bg-music");
      const playBtn = document.getElementById("play-btn");
      let playing = false;

      playBtn.addEventListener("click", () => {
        if (!playing) {
          music.play();
          playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
          music.pause();
          playBtn.innerHTML = '<i class="fas fa-music"></i>';
        }
        playing = !playing;
      });

      const skillBars = document.querySelectorAll(".skill-bar");

      function animateSkills() {
        skillBars.forEach((bar) => {
          const fill = bar.querySelector(".progress-fill");
          const progress = bar.dataset.progress;

          const rect = bar.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.85) {
            fill.style.width = progress;
          }
        });
      }

      window.addEventListener("scroll", animateSkills);
      window.addEventListener("load", animateSkills);
      window.addEventListener("scroll", animateSkills);
      window.addEventListener("load", animateSkills);

      const card = document.querySelector(".about-card");
      let rafId = null;

      card.addEventListener("mousemove", (e) => {
        if (rafId) return;

        rafId = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const rotateX = (y / rect.height - 0.5) * -15;
          const rotateY = (x / rect.width - 0.5) * 15;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

          rafId = null;
        });
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform =
          "perspective(1000px) rotateX(0deg) rotateY(0deg)";
      });

      const repoList = document.querySelector("#github-repos ul");
      fetch(
        "https://api.github.com/users/1khwannn/repos?sort=updated&per_page=5"
      )
        .then((res) => {
          if (!res.ok) throw new Error("Gagal memuat repositori");
          return res.json();
        })
        .then((data) => {
          data.forEach((repo) => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = repo.html_url;
            a.target = "_blank";
            const lang = repo.language ? ` (${repo.language})` : "";
            const stars =
              repo.stargazers_count > 0 ? ` ⭐${repo.stargazers_count}` : "";
            a.innerHTML = `${repo.name}${lang}${stars}`;
            li.appendChild(a);
            repoList.appendChild(li);
          });
        })
        .catch((err) => {
          console.error("Error fetching GitHub repos:", err);
          const li = document.createElement("li");
          li.textContent = "Unable to load repositories";
          repoList.appendChild(li);
        });
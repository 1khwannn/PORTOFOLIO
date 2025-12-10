   const toggle = document.getElementById("navToggle");
      const navMenu = document.getElementById("navMenu");
      const header = document.getElementById("mainHeader");
      const heroContent = document.getElementById("heroContent");

      toggle.addEventListener("click", () => {
        navMenu.classList.toggle("show");
        const icon = toggle.querySelector("i");
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-times");
      });

      document.querySelectorAll("#navMenu a").forEach((link) => {
        link.addEventListener("click", () => {
          if (window.innerWidth <= 700) {
            navMenu.classList.remove("show");
            const icon = toggle.querySelector("i");
            icon.classList.add("fa-bars");
            icon.classList.remove("fa-times");
          }
        });
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth > 700) {
          navMenu.classList.remove("show");
          const icon = toggle.querySelector("i");
          icon.classList.add("fa-bars");
          icon.classList.remove("fa-times");
        }
      });

      const sections = document.querySelectorAll("section");

      window.addEventListener("scroll", () => {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }

        let current = "";
        sections.forEach((section) => {
          const sectionTop = section.offsetTop - header.offsetHeight - 50;
          if (scrollY >= sectionTop) {
            current = section.getAttribute("id");
          }
        });

        navMenu.querySelectorAll("a").forEach((a) => {
          a.classList.remove("active");
          if (a.getAttribute("href").substring(1) === current) {
            a.classList.add("active");
          }
        });
      });

      const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      };

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      sections.forEach((section) => {
        observer.observe(section);
      });

      document.querySelectorAll("nav a").forEach((a) => {
        const text = a.textContent;
        a.innerHTML = `<span>${text}</span>`;
      });
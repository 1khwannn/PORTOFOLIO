 const canvas = document.getElementById("stars"),
        ctx = canvas.getContext("2d"),
        stars = [];

      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      for (let i = 0; i < 200; i++)
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5,
          alpha: Math.random(),
          dx: Math.random() * 0.3 - 0.15,
          dy: Math.random() * 0.3 - 0.15,
        });

      function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let s of stars) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
          ctx.fill();
          s.x += s.dx;
          s.y += s.dy;
          if (s.x < 0) s.x = canvas.width;
          if (s.x > canvas.width) s.x = 0;
          if (s.y < 0) s.y = canvas.height;
          if (s.y > canvas.height) s.y = 0;
        }
        requestAnimationFrame(drawStars);
      }
      drawStars();

      const text = "Fullstack Developer • Futuristic Dreamer • Creator";
      let i = 0;
      function typeEffect() {
        if (i < text.length) {
          document.getElementById("typing").innerHTML += text.charAt(i);
          i++;
          setTimeout(typeEffect, 70);
        }
      }
      typeEffect();

      const card = document.querySelector(".card");
      function createSpark() {
        const spark = document.createElement("div");
        const hue = Math.random() * 360;
        spark.className = "spark";
        spark.style.background = `hsl(${hue},100%,70%)`;
        spark.style.boxShadow = `0 0 10px hsl(${hue},100%,70%),0 0 20px hsl(${hue},100%,70%)`;
        spark.style.left = card.offsetLeft + Math.random() * card.offsetWidth + "px";
        spark.style.top = card.offsetTop + Math.random() * card.offsetHeight + "px";
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 1000);
      }
      setInterval(createSpark, 700);

      const holoCanvas = document.getElementById("holoLines"),
        hCtx = holoCanvas.getContext("2d"),
        lines = [];
      function resizeHolo() {
        holoCanvas.width = window.innerWidth;
        holoCanvas.height = window.innerHeight;
      }
      resizeHolo();
      window.addEventListener("resize", resizeHolo);

      for (let i = 0; i < 50; i++)
        lines.push({
          x: Math.random() * holoCanvas.width,
          y: Math.random() * holoCanvas.height,
          length: Math.random() * 100 + 50,
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 1 - 0.5,
          color: `rgba(0,255,255,${Math.random()})`,
        });

      function drawLines() {
        hCtx.clearRect(0, 0, holoCanvas.width, holoCanvas.height);
        for (let l of lines) {
          hCtx.beginPath();
          hCtx.moveTo(l.x, l.y);
          hCtx.lineTo(l.x + l.length, l.y);
          hCtx.strokeStyle = l.color;
          hCtx.lineWidth = 2;
          hCtx.stroke();
          l.x += l.speedX;
          l.y += l.speedY;
          if (l.x < 0) l.x = holoCanvas.width;
          if (l.x > holoCanvas.width) l.x = 0;
          if (l.y < 0) l.y = holoCanvas.height;
          if (l.y > holoCanvas.height) l.y = 0;
        }
        requestAnimationFrame(drawLines);
      }
      drawLines();

      document.addEventListener("mousemove", (e) => {
        for (let j = 0; j < 2; j++) {
          const spark = document.createElement("div");
          const hue = Math.random() * 360;
          spark.className = "spark";
          spark.style.background = `hsl(${hue},100%,70%)`;
          spark.style.boxShadow = `0 0 10px hsl(${hue},100%,70%),0 0 20px hsl(${hue},100%,70%)`;
          spark.style.left = e.clientX + (Math.random() * 20 - 10) + "px";
          spark.style.top = e.clientY + (Math.random() * 20 - 10) + "px";
          document.body.appendChild(spark);
          setTimeout(() => spark.remove(), 800);
        }
      });

      const themes = [
        { bgStart: "#0a0012", bgEnd: "#000", ring: "#00ffff", text: "#00ffff", btn: "#00ffff" },
        { bgStart: "#0a1200", bgEnd: "#000", ring: "#00ff00", text: "#00ff00", btn: "#00ff00" },
        { bgStart: "#12000a", bgEnd: "#000", ring: "#ff00ff", text: "#ff00ff", btn: "#ff00ff" },
      ];

      let currentTheme = 0;
      document.getElementById("themeSwitcher").addEventListener("click", () => {
        currentTheme = (currentTheme + 1) % themes.length;
        const t = themes[currentTheme];
        document.documentElement.style.setProperty("--bg-start", t.bgStart);
        document.documentElement.style.setProperty("--bg-end", t.bgEnd);
        document.documentElement.style.setProperty("--ring-color", t.ring);
        document.documentElement.style.setProperty("--text-color", t.text);
        document.documentElement.style.setProperty("--btn-border", t.btn);
        document.documentElement.style.setProperty("--btn-bg", t.btn + "22");
      });
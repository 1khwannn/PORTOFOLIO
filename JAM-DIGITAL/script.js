      function clock() {
        var hours = document.getElementById("hour");
        var minutes = document.getElementById("minute");
        var seconds = document.getElementById("seconds");
        var ampm = document.getElementById("ampm");
        var dateDisplay = document.getElementById("date-display");

        var d = new Date();
        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();
        var date = d.getDate();
        var month = d.getMonth();
        var year = d.getFullYear();
        var am = "AM";

        var monthNames = [
          "Januari",
          "Februari",
          "Maret",
          "April",
          "Mei",
          "Juni",
          "Juli",
          "Agustus",
          "September",
          "Oktober",
          "November",
          "Desember",
        ];

        if (h >= 12) {
          am = "PM";
          if (h > 12) h -= 12;
        }

        if (h == 0) h = 12;

        h = h < 10 ? "0" + h : h;
        m = m < 10 ? "0" + m : m;
        s = s < 10 ? "0" + s : s;

        hours.textContent = h;
        minutes.textContent = m;
        seconds.textContent = s;
        ampm.textContent = am;

        dateDisplay.textContent = date + " " + monthNames[month] + " " + year;
      }

      clock();
      setInterval(clock, 1000);

      document.addEventListener("DOMContentLoaded", () => {
        const bgMusic = document.getElementById("bgMusic");
        const muteButton = document.getElementById("muteButton");
        const muteIcon = document.getElementById("muteIcon");

        const updateMuteIcon = () => {
          muteIcon.textContent = bgMusic.muted ? "🔇" : "🔊";
        };

        bgMusic.muted = true;
        updateMuteIcon();

        muteButton.addEventListener("click", () => {
          bgMusic.muted = !bgMusic.muted;
          if (!bgMusic.muted) {
            bgMusic.play().catch(() => {});
          }
          updateMuteIcon();
        });
      });
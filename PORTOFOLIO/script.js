 const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    const darkModeIcon = darkModeToggle.querySelector('i');

    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    if (isDarkMode) {
        body.classList.add('dark-mode');
        darkModeIcon.classList.remove('fa-moon');
        darkModeIcon.classList.add('fa-sun');
    } else {
        darkModeIcon.classList.remove('fa-sun');
        darkModeIcon.classList.add('fa-moon');
    }

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            darkModeIcon.classList.remove('fa-moon');
            darkModeIcon.classList.add('fa-sun');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            darkModeIcon.classList.remove('fa-sun');
            darkModeIcon.classList.add('fa-moon');
            localStorage.setItem('darkMode', 'disabled');
        }
    });


    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const menuToggle = document.getElementById('menu-toggle');
    const navList = document.getElementById('nav-list');
    
    menuToggle.addEventListener('click', () => {
        navList.classList.toggle('open');
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navList.classList.remove('open');
                menuToggle.querySelector('i').classList.remove('fa-times');
                menuToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    });


    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const popup = document.getElementById('success-popup');
    const closePopup = document.getElementById('close-popup');

    function validateEmail(email){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

    form.addEventListener('submit', async function(e){
        e.preventDefault();
        nameError.textContent = emailError.textContent = messageError.textContent = "";
        let valid = true;
        
        if(nameInput.value.trim() === "") { nameError.textContent = "Please enter your name."; valid=false; }
        if(!validateEmail(emailInput.value.trim())) { emailError.textContent = "Please enter a valid email."; valid=false; }
        if(messageInput.value.trim() === "") { messageError.textContent = "Please enter your message."; valid=false; }

        if(valid){
            const formData = new FormData(form);
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    form.reset(); 
                    popup.classList.add('show'); 
                    setTimeout(()=>popup.classList.remove('show'),3000); 
                } else {
                    alert('Oops! Terjadi masalah saat mengirim pesan Anda.');
                }
            } catch (error) {
                console.error("Submission error:", error);
                alert('Oops! Terjadi kesalahan jaringan. Coba lagi nanti.');
            }
        }
    });

    closePopup.addEventListener('click', () => popup.classList.remove('show'));


    const music = document.getElementById("bg-music");
    const playBtn = document.getElementById("play-btn");
    const muteBtn = document.getElementById("mute-btn");
    let playing = false;

    playBtn.onclick = () => {
        if(!playing){ music.play(); playBtn.textContent="Pause"; playing=true; }
        else { music.pause(); playBtn.textContent="Play"; playing=false; }
    };
    muteBtn.onclick = () => { music.muted = !music.muted; muteBtn.textContent = music.muted ? "Unmute" : "Mute"; };

    const skillBars = document.querySelectorAll('.skill-bar');
    function animateSkills() {
        const triggerBottom = window.innerHeight * 0.9;
        skillBars.forEach(bar=>{
            const barTop = bar.getBoundingClientRect().top;
            if(barTop<triggerBottom && !bar.classList.contains('animated')){
                bar.classList.add('animated');
                const fill = bar.querySelector('.progress-fill');
                const progress = bar.getAttribute('data-progress');
                fill.style.width = progress;
            }
        });
    }
    window.addEventListener('scroll', animateSkills);
    window.addEventListener('load', animateSkills);

    const card = document.querySelector('.about-card');
    let mouseX=0, mouseY=0, cardX=0, cardY=0;
    card.addEventListener('mousemove', e=>{
        const rect = card.getBoundingClientRect();
        mouseX=((e.clientX-rect.left)/rect.width-0.5)*30;
        mouseY=((e.clientY-rect.top)/rect.height-0.5)*30;
    });
    card.addEventListener('mouseleave', ()=>{ mouseX=0; mouseY=0; });
    function animateCard() {
        cardX+=(mouseX-cardX)*0.1;
        cardY+=(mouseY-cardY)*0.1;
        card.style.transform=`rotateX(${-cardY}deg) rotateY(${cardX}deg) translateY(-10px)`;
        requestAnimationFrame(animateCard);
    }
    animateCard();

    const repoList = document.querySelector('#github-repos ul');
    fetch('https://api.github.com/users/1khwannn/repos?sort=updated&per_page=5')
    .then(res => {
        if (!res.ok) throw new Error("Gagal memuat repositori");
        return res.json();
    })
    .then(data => {
        data.forEach(repo => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = repo.html_url;
            a.target = "_blank";
            const lang = repo.language ? ` (${repo.language})` : '';
            const stars = repo.stargazers_count > 0 ? ` ⭐${repo.stargazers_count}` : '';
            a.innerHTML = `${repo.name}${lang}${stars}`; 
            li.appendChild(a);
            repoList.appendChild(li);
        });
    })
    .catch(err => {
        console.error("Error fetching GitHub repos:", err);
        const li = document.createElement('li');
        li.textContent = "Unable to load repositories";
        repoList.appendChild(li);
    });
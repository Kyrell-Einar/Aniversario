// Inicializar Partículas
particlesJS('particles-js', {
    particles: {
        number: { value: 30, density: { enable: true, value_area: 800 } },
        color: { value: '#ec4899' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: false },
        move: { enable: true, speed: 2, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
    },
    interactivity: { detect_on: 'canvas', events: { onhover: { enable: true, mode: 'bubble' }, onclick: { enable: true, mode: 'repulse' } } },
    retina_detect: true
});

// Toggle Mobile Navigation
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('hidden');
});

// Controle de Música
const music = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
let isPlaying = false;

function toggleMusic() {
    if (isPlaying) {
        music.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        isPlaying = false;
    } else {
        music.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
        isPlaying = true;
    }
}

musicToggle.addEventListener('click', () => {
    if (!isPlaying) {
        if (window.AudioContext) {
            const audioCtx = new AudioContext();
            if (audioCtx.state === 'suspended') {
                audioCtx.resume().then(toggleMusic).catch(() => alert('Por favor, permita áudio no navegador para reproduzir a música.'));
                return;
            }
        }
    }
    toggleMusic();
});

// Contador de Dias Juntos com Horas e Minutos
const startDate = new Date('2024-11-09');

function updateDaysTogether() {
    const today = new Date();
    const timeDiff = today - startDate;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    document.getElementById('daysTogether').textContent = `Dias Juntos: ${days} dias, ${hours} horas e ${minutes} minutos`;
}

updateDaysTogether();
setInterval(updateDaysTogether, 60000); // Atualiza a cada minuto

// Inicializar GSAP
gsap.registerPlugin();
gsap.from('#hero h1', { duration: 1.5, y: 50, opacity: 0, ease: 'power2.out', delay: 0.5 });
gsap.from('#hero p', { duration: 1.5, y: 50, opacity: 0, ease: 'power2.out', delay: 0.8 });
gsap.from('#hero a', { duration: 1.5, y: 50, opacity: 0, ease: 'power2.out', delay: 1 });

// Animação da Timeline
const timelineItems = document.querySelectorAll('.timeline-item');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            gsap.to(entry.target, { 
                duration: 1, 
                y: 0, 
                opacity: 1, 
                ease: 'power2.out',
                onStart: () => entry.target.classList.add('visible')
            });
        }
    });
}, { threshold: 0.3 });
timelineItems.forEach(item => observer.observe(item));

// Inicializar Swiper
const swiper = new Swiper('.swiper', {
    loop: true,
    autoplay: { delay: 4000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        320: { slidesPerView: 1, spaceBetween: 10 },
        640: { slidesPerView: 1, spaceBetween: 10 },
        768: { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 30 },
    }
});

// Botão de Surpresa
document.getElementById('loveButton').addEventListener('click', () => {
    const message = document.getElementById('surpriseMessage');
    message.classList.toggle('hidden');
    if (!message.classList.contains('hidden')) {
        gsap.from('#surpriseMessage', { duration: 1.2, scale: 0.7, opacity: 0, ease: 'elastic.out(1, 0.3)' });
    }
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Jogo de Corações Melhorado
const canvas = document.getElementById('heartGame');
const ctx = canvas.getContext('2d');

// Ajustar canvas para alta DPI
const dpr = window.devicePixelRatio || 1;

function resizeCanvas() {
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    ctx.scale(dpr, dpr);
}

resizeCanvas();

const messages = ['Eu te amo', 'Te amo para sempre', 'Meu amor eterno', 'Você é tudo para mim', 'Amor da minha vida', 'Para sempre juntos', 'Meu coração é seu', 'Te adoro', 'Amor infinito', 'Você me completa'];
let hearts = [];
let powerUps = [];
let score = 0;
const maxScore = 15;
let gameActive = true;
let timeLeft = 60;
let level = 1;
const scoreDisplay = document.getElementById('scoreDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const levelDisplay = document.getElementById('levelDisplay');
const finalScore = document.getElementById('finalScore');

class Heart {
    constructor() {
        this.x = Math.random() * (canvas.offsetWidth - 50) + 25;
        this.y = Math.random() * (canvas.offsetHeight - 50) + 25;
        this.dx = (Math.random() - 0.5) * (3 + level);
        this.dy = (Math.random() - 0.5) * (3 + level);
        this.message = messages[Math.floor(Math.random() * messages.length)];
        this.id = Date.now() + Math.random();
        this.isPowerUp = false;
    }
    update() {
        this.x += this.dx;
        this.y += this.dy;
        if (this.x < 25 || this.x > canvas.offsetWidth - 25) this.dx *= -1;
        if (this.y < 25 || this.y > canvas.offsetHeight - 25) this.dy *= -1;
    }
    draw() {
        ctx.font = '40px Poppins';
        ctx.fillStyle = '#ec4899';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('❤️', this.x, this.y);
    }
}

class PowerUp extends Heart {
    constructor() {
        super();
        this.isPowerUp = true;
    }
    draw() {
        ctx.font = '40px Poppins';
        ctx.fillStyle = '#ffd700';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⭐', this.x, this.y);
    }
}

function addHeart() {
    if (gameActive && hearts.length < 4 + level) {
        hearts.push(new Heart());
    }
}

function addPowerUp() {
    if (gameActive && powerUps.length < level) {
        powerUps.push(new PowerUp());
    }
}

function showClickEffect(x, y) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(236, 72, 153, 0.3)';
    ctx.fill();
    ctx.restore();
    setTimeout(() => {
        ctx.clearRect(x - 25, y - 25, 50, 50);
    }, 200);
}

function animate() {
    if (!gameActive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    hearts.forEach(heart => {
        heart.update();
        heart.draw();
    });
    powerUps.forEach(powerUp => {
        powerUp.update();
        powerUp.draw();
    });
    ctx.restore();
    requestAnimationFrame(animate);
}

function showMessage(x, y, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'heart-message';
    messageDiv.textContent = message;
    messageDiv.style.left = `${x}px`;
    messageDiv.style.top = `${y}px`;
    canvas.parentElement.appendChild(messageDiv);
    gsap.to(messageDiv, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)', onComplete: () => {
        gsap.to(messageDiv, { opacity: 0, scale: 0.8, duration: 0.6, delay: 1.5, onComplete: () => messageDiv.remove() });
    } });
}

canvas.addEventListener('click', (e) => {
    if (!gameActive) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * dpr;
    const clickY = (e.clientY - rect.top) * dpr;

    showClickEffect(clickX / dpr, clickY / dpr);

    hearts = hearts.filter(heart => {
        if (Math.abs(heart.x - clickX / dpr) < 50 && Math.abs(heart.y - clickY / dpr) < 50) {
            showMessage(clickX / dpr, clickY / dpr, heart.message);
            score += level;
            updateScore();
            checkLevelUp();
            return false;
        }
        return true;
    });

    powerUps = powerUps.filter(powerUp => {
        if (Math.abs(powerUp.x - clickX / dpr) < 50 && Math.abs(powerUp.y - clickY / dpr) < 50) {
            timeLeft += 10;
            showMessage(clickX / dpr, clickY / dpr, '+10 segundos!');
            return false;
        }
        return true;
    });
});

function updateScore() {
    scoreDisplay.textContent = `Corações Coletados: ${score} / ${maxScore}`;
    if (score >= maxScore) {
        endGame();
    }
}

function checkLevelUp() {
    if (score >= level * 5) {
        level++;
        levelDisplay.textContent = `Nível: ${level}`;
        timeLeft += 20;
    }
}

function startTimer() {
    const timerInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(timerInterval);
            return;
        }
        timeLeft--;
        timerDisplay.textContent = `Tempo Restante: ${timeLeft}s`;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    gameActive = false;
    finalScore.textContent = score;
    document.getElementById('gameOver').classList.remove('hidden');
    gsap.from('#gameOver', { opacity: 0, scale: 0.8, duration: 1.2, ease: 'elastic.out(1, 0.3)' });
}

document.getElementById('restartGame').addEventListener('click', () => {
    hearts = [];
    powerUps = [];
    score = 0;
    timeLeft = 60;
    level = 1;
    gameActive = true;
    scoreDisplay.textContent = `Corações Coletados: 0 / ${maxScore}`;
    timerDisplay.textContent = `Tempo Restante: 60s`;
    levelDisplay.textContent = `Nível: 1`;
    document.getElementById('gameOver').classList.add('hidden');
    startTimer();
    animate();
});

// Ajustar canvas em redimensionamento
window.addEventListener('resize', resizeCanvas);

// Iniciar o Jogo
setInterval(addHeart, 800);
setInterval(addPowerUp, 5000);
startTimer();
animate();
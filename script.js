// Inicializar Partículas
particlesJS('particles-js', {
    particles: {
        number: { value: 100, density: { enable: true, value_area: 800 } },
        color: { value: ['#ec4899', '#f9a8d4', '#d8b4fe', '#fed7e2', '#fef3c7'] },
        shape: { type: ['circle', 'heart', 'star'], stroke: { width: 0 } },
        opacity: { value: 0.8, random: true },
        size: { value: 6, random: true },
        line_linked: { enable: true, distance: 120, color: '#f9a8d4', opacity: 0.5, width: 1.5 },
        move: { enable: true, speed: 5, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
    },
    interactivity: { detect_on: 'canvas', events: { onhover: { enable: true, mode: 'bubble' }, onclick: { enable: true, mode: 'repulse' } } },
    retina_detect: true
});

// Animação de Fade-In com Partículas
gsap.to('#particles-js', { duration: 2, opacity: 1, ease: 'power2.out', delay: 0.5 });

// Animação de Entrada para o Botão de Mensagem Secreta
gsap.from('#secretMessageButton', { duration: 1.5, x: 100, opacity: 0, ease: 'power2.out', delay: 1 });

// Toggle Mobile Navigation
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('hidden');
    gsap.to(navMenu, { duration: 0.5, height: navMenu.classList.contains('hidden') ? 0 : 'auto', ease: 'power2.out' });
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
const startDate = new Date('2024-11-09T00:00:00-03:00');

function updateDaysTogether() {
    const today = new Date();
    const timeDiff = today - startDate;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    document.getElementById('daysTogether').textContent = `Dias Juntos: ${days} dias, ${hours} horas e ${minutes} minutos`;
    document.getElementById('daysTogetherFooter').textContent = `Dias Juntos: ${days} dias, ${hours} horas e ${minutes} minutos`;
}

updateDaysTogether();
setInterval(updateDaysTogether, 60000); // Atualiza a cada minuto

// Inicializar GSAP e ScrollTrigger
gsap.registerPlugin(ScrollTrigger);
gsap.from('#hero h1', { duration: 1.5, y: 50, opacity: 0, ease: 'power2.out', delay: 0.5 });
gsap.from('#hero p', { duration: 1.5, y: 50, opacity: 0, ease: 'power2.out', delay: 0.8 });
gsap.from('#hero a', { duration: 1.5, y: 50, opacity: 0, ease: 'power2.out', delay: 1 });
gsap.from('#hero #daysTogether', { duration: 1.5, y: 50, opacity: 0, ease: 'power2.out', delay: 1.2 });

// Animação da Timeline
const timelineItems = document.querySelectorAll('.timeline-item');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            gsap.to(entry.target, { 
                duration: 1.2, 
                y: 0, 
                opacity: 1, 
                scale: 1, 
                rotation: 3,
                ease: 'power3.out',
                onStart: () => entry.target.classList.add('visible')
            });
        }
    });
}, { threshold: 0.3 });
timelineItems.forEach(item => observer.observe(item));

// Animação das Seções
const sections = document.querySelectorAll('section');
sections.forEach(section => {
    gsap.from(section.children, {
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        duration: 1.5,
        y: 50,
        opacity: 0,
        rotation: 5,
        stagger: 0.3,
        ease: 'power3.out'
    });
});

// Animação da Seção de Surpresa
gsap.from('#surpriseMessage', { duration: 1.5, scale: 0.7, opacity: 0, ease: 'elastic.out(1, 0.3)', delay: 1.5 });

// Inicializar Swiper
const swiper = new Swiper('.swiper', {
    loop: true,
    autoplay: { delay: 2000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        320: { slidesPerView: 1, spaceBetween: 10 },
        640: { slidesPerView: 2, spaceBetween: 12 },
        768: { slidesPerView: 3, spaceBetween: 15 },
        1024: { slidesPerView: 5, spaceBetween: 20 },
    }
});

// Botão de Surpresa
document.getElementById('loveButton').addEventListener('click', () => {
    const message = document.getElementById('surpriseMessage');
    message.classList.toggle('hidden');
    if (!message.classList.contains('hidden')) {
        gsap.from('#surpriseMessage', { duration: 1.5, scale: 0.7, opacity: 0, rotation: 10, ease: 'elastic.out(1, 0.3)' });
    }
});

// Botão de Mensagem Secreta
const secretMessageButton = document.getElementById('secretMessageButton');
const secretMessage = document.getElementById('secretMessage');
const closeSecretMessage = document.getElementById('closeSecretMessage');
secretMessageButton.addEventListener('click', () => {
    secretMessage.classList.toggle('hidden');
    if (!secretMessage.classList.contains('hidden')) {
        gsap.from('#secretMessage', { duration: 1.2, scale: 0.7, opacity: 0, rotation: 10, ease: 'elastic.out(1, 0.3)' });
    }
});
closeSecretMessage.addEventListener('click', () => {
    secretMessage.classList.add('hidden');
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

// Efeito de Hover nos Cards
const cards = document.querySelectorAll('.bg-white');
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, { duration: 0.3, scale: 1.05, boxShadow: '0 15px 30px rgba(236, 72, 153, 0.6)', rotation: 3 });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(card, { duration: 0.3, scale: 1, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', rotation: 0 });
    });
});

// Botão Voltar ao Topo
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.remove('hidden');
    } else {
        backToTop.classList.add('hidden');
    }
});
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Barra de Progresso de Rolagem
window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('progressBar').style.width = scrolled + '%';
});
// ==================== FADE-IN DAS SEÇÕES ====================
const sections = document.querySelectorAll("section");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.2 });
sections.forEach(section => { section.classList.add("hidden"); observer.observe(section); });

// ==================== FADE-IN DAS FOTOS ====================
const photos = document.querySelectorAll(".carousel img");
const photoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add("visible-photo");
  });
}, { threshold: 0.2 });
photos.forEach(photo => { photo.classList.add("hidden-photo"); photoObserver.observe(photo); });

// ==================== EFEITO DE DIGITAÇÃO ====================
const messageText = "Um ano de lembranças, risadas, desafios e carinho. Que venham muitos mais.";
const messageElement = document.querySelector(".message p");
let index = 0;
function typeEffect() {
  if(messageElement){
    messageElement.textContent = messageText.slice(0, index);
    index++;
    if(index <= messageText.length) setTimeout(typeEffect, 50);
  }
}
window.addEventListener("load", typeEffect);

// ==================== SCROLL SUAVE ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if(target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ==================== TIMELINE EM CASCATA ====================
const timelineEvents = document.querySelectorAll(".timeline .event");
const timelineObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      timelineEvents.forEach((event, i) => {
        setTimeout(()=>{ event.classList.add("visible-event"); }, i*300);
      });
    }
  });
}, { threshold: 0.2 });
timelineEvents.forEach(event => timelineObserver.observe(event));

// ==================== MÚSICA AUTOMÁTICA ====================
const bgMusic = document.getElementById("bg-music");
window.addEventListener("load", () => {
  bgMusic.play().catch(() => {
    console.log("Autoplay bloqueado pelo navegador.");
  });
});

// ==================== CONTADOR REGRESSIVO ====================
const timer = document.getElementById("timer");
const events = [
  { name: "Aniversário de namoro", date: "2025-11-09T00:00:00" }
];

function getNextEvent() {
  const now = new Date();
  const futureEvents = events.filter(e => new Date(e.date) > now);
  if(futureEvents.length === 0){
    return events.map(e => ({
      name: e.name,
      date: new Date(new Date(e.date).setFullYear(new Date().getFullYear()+1))
    })).sort((a,b) => new Date(a.date)-new Date(b.date))[0];
  }
  return futureEvents.sort((a,b) => new Date(a.date)-new Date(b.date))[0];
}

function updateTimer() {
  const now = new Date();
  const nextEvent = getNextEvent();
  const targetDate = new Date(nextEvent.date);
  const diff = targetDate - now;
  const days = Math.floor(diff/(1000*60*60*24));
  const hours = Math.floor((diff%(1000*60*60*24))/(1000*60*60));
  const mins = Math.floor((diff%(1000*60*60))/(1000*60));
  const secs = Math.floor((diff%(1000*60))/1000);
  timer.textContent = `${nextEvent.name} em ${days}d ${hours}h ${mins}m ${secs}s`;
}
setInterval(updateTimer, 1000);
updateTimer();

// ==================== CORAÇÕES AO CLICAR ====================
document.body.addEventListener("click", (e) => {
  const heart = document.createElement("div");
  heart.textContent = "💖";
  heart.style.position = "absolute";
  heart.style.left = e.pageX-15 + "px";
  heart.style.top = e.pageY-15 + "px";
  heart.style.fontSize = "1.5rem";
  heart.style.pointerEvents = "none";
  heart.style.transition = "all 0.8s ease-out";
  document.body.appendChild(heart);
  setTimeout(()=>{ heart.style.top = e.pageY-50 + "px"; heart.style.opacity="0"; },0);
  setTimeout(()=>{ heart.remove(); },800);
});

// ==================== EASTER EGGS ====================
let clickCount = 0;
document.querySelector(".header").addEventListener("click", () => {
  clickCount++;
  if(clickCount===5){
    const egg = document.getElementById("easter-egg");
    egg.style.display="block";
    setTimeout(()=>{ egg.style.display="none"; clickCount=0; },3000);
  }
});
photos.forEach(photo => {
  photo.addEventListener("dblclick", () => {
    const heart = document.createElement("div");
    heart.textContent = "💘";
    heart.style.position = "absolute";
    heart.style.left = photo.getBoundingClientRect().left + photo.width/2 - 15 + "px";
    heart.style.top = photo.getBoundingClientRect().top + photo.height/2 - 15 + "px";
    heart.style.fontSize = "2rem";
    heart.style.pointerEvents = "none";
    heart.style.transition = "all 1s ease-out";
    document.body.appendChild(heart);
    setTimeout(()=>{ heart.style.top = parseInt(heart.style.top)-50 + "px"; heart.style.opacity="0"; },0);
    setTimeout(()=>{ heart.remove(); },1000);
  });
});

// ==================== BACKGROUND ESTRELAS + CHUVA ====================
const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
window.addEventListener("resize", ()=>{ width=canvas.width=window.innerWidth; height=canvas.height=window.innerHeight; });

const stars = Array.from({length:150}, ()=>({x:Math.random()*width, y:Math.random()*height, r:Math.random()*1.5+0.5}));
const rain = Array.from({length:100}, ()=>({x:Math.random()*width, y:Math.random()*height, l:Math.random()*15+10, vy:4+Math.random()*2}));

function animate() {
  ctx.clearRect(0,0,width,height);
  stars.forEach(s=>{ ctx.fillStyle="#fff"; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill(); });
  rain.forEach(r=>{
    ctx.strokeStyle="rgba(173,216,230,0.6)";
    ctx.beginPath();
    ctx.moveTo(r.x,r.y);
    ctx.lineTo(r.x,r.y+r.l);
    ctx.stroke();
    r.y += r.vy;
    if(r.y>height){ r.y=-r.l; r.x=Math.random()*width; }
  });
  requestAnimationFrame(animate);
}
animate();

// ==================== CARROSSEL INFINITO ====================
const carouselTrack = document.querySelector(".carousel-track");
const originalSlides = Array.from(carouselTrack.children);
carouselTrack.innerHTML = `
  ${originalSlides.map(slide => slide.outerHTML).join('')}
  ${originalSlides.map(slide => slide.outerHTML).join('')}
  ${originalSlides.map(slide => slide.outerHTML).join('')}
`;
const allSlides = Array.from(carouselTrack.children);
const slideWidth = allSlides[0].getBoundingClientRect().width;
let currentIndex = originalSlides.length; // começa no grupo do meio
carouselTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

const nextBtn = document.querySelector(".carousel .next");
const prevBtn = document.querySelector(".carousel .prev");

function updateCarousel() {
  carouselTrack.style.transition = "transform 0.5s ease";
  carouselTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}

nextBtn.addEventListener("click", () => {
  currentIndex++;
  updateCarousel();
  carouselTrack.addEventListener("transitionend", loopCheck);
});
prevBtn.addEventListener("click", () => {
  currentIndex--;
  updateCarousel();
  carouselTrack.addEventListener("transitionend", loopCheck);
});

function loopCheck() {
  if(currentIndex >= 2 * originalSlides.length){
    carouselTrack.style.transition = "none";
    currentIndex = originalSlides.length;
    carouselTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  }
  if(currentIndex < originalSlides.length){
    carouselTrack.style.transition = "none";
    currentIndex = 2 * originalSlides.length - 1;
    carouselTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  }
  carouselTrack.removeEventListener("transitionend", loopCheck);
}

window.addEventListener("resize", () => {
  const newWidth = allSlides[0].getBoundingClientRect().width;
  carouselTrack.style.transition = "none";
  carouselTrack.style.transform = `translateX(-${currentIndex * newWidth}px)`;
});

// Swipe mobile
let startX = 0;
carouselTrack.addEventListener("touchstart", e => { startX = e.touches[0].clientX; });
carouselTrack.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  if(startX - endX > 50) nextBtn.click();
  if(endX - startX > 50) prevBtn.click();
});

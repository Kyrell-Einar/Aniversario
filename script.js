// Toggle Menu
function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Toggle Modo Claro/Escuro
function toggleMode() {
    document.body.classList.toggle('light-mode');
}

// Gerenciar Recados (LocalStorage)
const form = document.getElementById('recado-form');
const list = document.getElementById('recados-list');

function loadRecados() {
    const recados = JSON.parse(localStorage.getItem('recados')) || [];
    list.innerHTML = '';
    recados.forEach((recado, index) => {
        const div = document.createElement('div');
        div.classList.add('recado');
        div.innerHTML = `
            <h3>${recado.titulo}</h3>
            <p>${recado.mensagem}</p>
            <button class="delete-btn" onclick="deleteRecado(${index})" aria-label="Apagar recado">Apagar</button>
        `;
        list.appendChild(div);
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const titulo = document.getElementById('titulo').value;
    const mensagem = document.getElementById('mensagem').value;
    const recados = JSON.parse(localStorage.getItem('recados')) || [];
    recados.push({ titulo, mensagem });
    localStorage.setItem('recados', JSON.stringify(recados));
    loadRecados();
    form.reset();
});

// Função para apagar recado com confirmação
function deleteRecado(index) {
    if (confirm("Tem certeza que deseja apagar este recado?")) {
        const recados = JSON.parse(localStorage.getItem('recados')) || [];
        recados.splice(index, 1);
        localStorage.setItem('recados', JSON.stringify(recados));
        loadRecados();
    }
}

// Animação de Corações Decorativos
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.left = Math.random() * (window.innerWidth - 20) + 'px';
    heart.style.animationDuration = Math.random() * 5 + 5 + 's';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 10000);
}

setInterval(createHeart, 1000);

// Minijogo Romântico
const messages = [
    "Você é meu tudo, Tata! Meu coração bate por você. 💖",
    "Cada dia ao seu lado é como um sonho do qual nunca quero acordar.",
    "Te amo mais do que as palavras podem dizer, minha eterna companheira.",
    "Você ilumina meus dias como ninguém, Tata. Sempre vou te amar!",
    "Nosso amor é a melhor aventura da minha vida. 💞"
];

function startGame() {
    const gameHeart = document.createElement('div');
    gameHeart.classList.add('game-heart');
    gameHeart.style.left = Math.random() * (window.innerWidth - 35) + 'px';
    gameHeart.style.top = Math.random() * (window.innerHeight - 35) + 'px';
    gameHeart.addEventListener('click', () => {
        const modal = document.getElementById('modal');
        const message = document.getElementById('modal-message');
        message.textContent = messages[Math.floor(Math.random() * messages.length)];
        modal.style.display = 'flex';
        gameHeart.remove();
        setTimeout(createGameHeart, 1000);
    });
    document.body.appendChild(gameHeart);
}

function createGameHeart() {
    startGame();
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Fechar modal com tecla Enter ou Esc
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
        closeModal();
    }
});

loadRecados();
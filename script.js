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
        recados.splice(index, 1); // Remove o recado no índice especificado
        localStorage.setItem('recados', JSON.stringify(recados));
        loadRecados(); // Atualiza a lista
    }
}

// Animação de Corações
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.style.left = Math.random() * (window.innerWidth - 20) + 'px'; // Evita transbordo
    heart.style.animationDuration = Math.random() * 5 + 5 + 's';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 10000);
}

setInterval(createHeart, 1000);

loadRecados(); // Carrega recados ao iniciar
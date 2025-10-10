document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('recado-form');
    const list = document.getElementById('recados-list');
    const heartCountDisplay = document.getElementById('heart-count');
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const toggleModeBtn = document.getElementById('toggleMode');

    let heartCount = 0;
    let isGameRunning = false;
    const messages = [
        "Você é meu tudo, Tata! Meu coração bate por você. 💖",
        "Cada dia ao seu lado é como um sonho do qual nunca quero acordar.",
        "Eu te amo mais do que as palavras podem dizer, minha eterna companheira.",
        "Você ilumina meus dias como ninguém, Tata. Sempre vou te amar!",
        "Nosso amor é a melhor aventura da minha vida. 💞"
    ];
    const extraMessages = [
        "Você já pensou como nossas risadas juntas são a melhor música?",
        "Seu sorriso é minha luz, mesmo nos dias mais cinzentos.",
        "Quero segurar sua mão para sempre, em cada aventura.",
        "Você é minha casa, não importa onde estejamos.",
        "Cada beijo seu é como um capítulo novo da nossa história."
    ];
    const finalMessage = "Tata, você coletou todos os corações do meu amor! Eu te amo eternamente! 💖";
    let usedMessages = [];

    // Carregar modo salvo
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        toggleModeBtn.textContent = 'Modo Escuro';
    }

    // Carregar recados salvos
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

    // Adicionar recado
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const titulo = document.getElementById('titulo').value;
        const mensagem = document.getElementById('mensagem').value;
        const recados = JSON.parse(localStorage.getItem('recados')) || [];
        recados.push({ titulo, mensagem });
        localStorage.setItem('recados', JSON.stringify(recados));
        loadRecados();
        form.reset();
        party.confetti(form, { count: party.variation.range(20, 40), shapes: ['heart'] });
    });

    // Apagar recado
    window.deleteRecado = function(index) {
        if (confirm("Tem certeza que deseja apagar este recado?")) {
            const recados = JSON.parse(localStorage.getItem('recados')) || [];
            recados.splice(index, 1);
            localStorage.setItem('recados', JSON.stringify(recados));
            loadRecados();
        }
    };

    // Alternar modo claro/escuro
    toggleModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        toggleModeBtn.textContent = document.body.classList.contains('light-mode') ? 'Modo Escuro' : 'Modo Claro';
        localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    });

    // Toggle menu
    window.toggleMenu = function() {
        const menu = document.getElementById('menu');
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    };

    // Animação de corações decorativos
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.style.left = Math.random() * (window.innerWidth - 20) + 'px';
        heart.style.animationDuration = Math.random() * 5 + 5 + 's';
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 10000);
    }

    setInterval(createHeart, 1000);

    // Minijogo romântico
    window.startGame = function() {
        if (!isGameRunning) {
            isGameRunning = true;
            usedMessages = [];
            heartCount = 0;
            heartCountDisplay.textContent = heartCount;
            heartCountDisplay.classList.remove('highlight');
            createGameHeart();
        }
    };

    function createGameHeart() {
        if (!isGameRunning) return;
        const gameHeart = document.createElement('div');
        gameHeart.classList.add('game-heart');
        gameHeart.style.left = Math.random() * (window.innerWidth - 40) + 'px';
        gameHeart.style.top = Math.random() * (window.innerHeight - 40) + 'px';
        document.body.appendChild(gameHeart);

        gameHeart.addEventListener('click', () => {
            heartCount++;
            heartCountDisplay.textContent = heartCount;
            heartCountDisplay.classList.add('highlight');
            setTimeout(() => heartCountDisplay.classList.remove('highlight'), 500);

            party.confetti(gameHeart, { count: party.variation.range(10, 20), shapes: ['heart'] });
            gameHeart.remove();

            if (usedMessages.length >= messages.length) {
                modalMessage.textContent = finalMessage;
                modal.style.display = 'flex';
                isGameRunning = false;
                return;
            }

            let message;
            do {
                message = messages[Math.floor(Math.random() * messages.length)];
            } while (usedMessages.includes(message));
            usedMessages.push(message);
            modalMessage.textContent = message;
            modal.style.display = 'flex';

            setTimeout(createGameHeart, 1000);
        });

        setTimeout(() => {
            if (gameHeart.parentNode && isGameRunning) {
                gameHeart.remove();
                setTimeout(createGameHeart, 1000);
            }
        }, 5000);
    }

    window.closeModal = function() {
        modal.style.display = 'none';
    };

    window.showExtraMessage = function() {
        modalMessage.textContent = extraMessages[Math.floor(Math.random() * extraMessages.length)];
    };

    // Fechar modal com tecla Enter ou Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
            closeModal();
        }
    });

    loadRecados();
});
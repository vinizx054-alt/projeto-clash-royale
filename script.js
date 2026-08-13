document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.card');

    // 1. Efeito de entrada e 3D nos Cards (Mantidos)
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8) translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.opacity = '1';
            card.style.transform = 'none';
            setTimeout(() => { card.style.transition = 'transform 0.1s ease'; }, 600);
        }, index * 150);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
            const rotacaox = (rect.height / 2 - y) / 10; 
            const rotacaoy = (x - rect.width / 2) / 10;
            card.style.transform = `rotateX(${rotacaox}deg) rotateY(${rotacaoy}deg) scale(1.03)`;
        });

        card.mouseleaveHandler = () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
            card.style.setProperty('--x', `-999px`);
            card.style.setProperty('--y', `-999px`);
        };
        card.addEventListener('mouseleave', card.mouseleaveHandler);

        const btn = card.querySelector('.btn-ver');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                playClickSound();
            });
        }
    });

    // 2. Lógica do Botão do YouTube
    const ytBtn = document.getElementById('btn-youtube');
    
    // Verifica se já existe um link salvo no navegador
    let linkSalvo = localStorage.getItem('youtubeChannelUrl');
    if (linkSalvo) {
        ytBtn.textContent = "📺 Ir para o Canal";
        ytBtn.classList.add('has-link');
    }

    ytBtn.addEventListener('click', () => {
        playClickSound();
        linkSalvo = localStorage.getItem('youtubeChannelUrl');

        if (!linkSalvo) {
            // Se não tem link, pede para o usuário inserir
            const urlInput = prompt("Cole aqui a URL completa do seu canal do YouTube (ex: https://youtube.com):");
            
            if (urlInput && (urlInput.includes("youtube.com") || urlInput.includes("youtu.be"))) {
                localStorage.setItem('youtubeChannelUrl', urlInput.trim());
                ytBtn.textContent = "📺 Ir para o Canal";
                ytBtn.classList.add('has-link');
                alert("Canal configurado com sucesso! Clique novamente para acessar.");
            } else if (urlInput) {
                alert("Por favor, insira um link válido do YouTube.");
            }
        } else {
            // Se já tem o link salvo, abre ele em uma nova aba
            window.open(linkSalvo, '_blank');
        }
    });
});

function playClickSound() {
    try {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const osc = context.createOscillator();
        const gain = context.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, context.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, context.currentTime + 0.1);
        gain.gain.setValueAtTime(0.2, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(context.destination);
        osc.start();
        osc.stop(context.currentTime + 0.1);
    } catch (e) {
        console.log("Áudio bloqueado.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Atualizar o ano no rodapé automaticamente
    const yearSpan = document.getElementById('current-year');
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Comportamento do botão "WhatsApp em breve"
    const btnWhats = document.getElementById('btn-whats-aviso');
    
    if(btnWhats) {
        btnWhats.addEventListener('click', () => {
            alert("O WhatsApp do escritório estará disponível em breve! \n\nPor favor, ligue para o fixo: (54) 3361-2383");
        });
    }

    // 3. Efeito simples ao rolar a página (Opcional - Navbar fica um pouco transparente)
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.opacity = "0.95";
        } else {
            header.style.opacity = "1";
        }
    });

});

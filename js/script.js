document.addEventListener('DOMContentLoaded', () => {
    
    // Atualiza Ano
    const yearSpan = document.getElementById('current-year');
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Função de clique para botões de WhatsApp
    function handleWhatsClick() {
        alert("O WhatsApp do escritório estará disponível em breve! \n\nEnquanto isso, vamos ligar para o fixo: (54) 3361-2383");
        window.location.href = "tel:5433612383";
    }

    // Adiciona evento ao botão do Hero
    const btnHero = document.getElementById('btn-whats-hero');
    if(btnHero) btnHero.addEventListener('click', handleWhatsClick);

    // Adiciona evento ao botão do Rodapé
    const btnFooter = document.getElementById('btn-whats-footer');
    if(btnFooter) btnFooter.addEventListener('click', handleWhatsClick);

    // Navbar Scroll Effect (Opacidade)
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
        } else {
            header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    
    // Atualiza Ano Automaticamente
    const yearSpan = document.getElementById('current-year');
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Botão WhatsApp (Aviso temporário)
    const btnWhats = document.getElementById('btn-whats-aviso');
    if(btnWhats) {
        btnWhats.addEventListener('click', () => {
            alert("O WhatsApp do escritório estará disponível em breve! \n\nPor enquanto, redirecionando para a discagem telefônica...");
            window.location.href = "tel:5433612383";
        });
    }

    // Efeito sutil na Header ao rolar
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.opacity = "0.98";
            header.style.padding = "0.5rem 5%"; // Fica mais fininho ao rolar
        } else {
            header.style.opacity = "1";
            header.style.padding = "0.8rem 5%";
        }
    });
});
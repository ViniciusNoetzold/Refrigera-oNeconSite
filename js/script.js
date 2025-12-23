document.addEventListener('DOMContentLoaded', () => {
    
    // Atualiza Ano Automaticamente
    const yearSpan = document.getElementById('current-year');
    if(yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- CONFIGURAÇÃO DO WHATSAPP ---
    function handleWhatsClick() {
        // Seu número novo (55 + 54 + Número)
        const phoneNumber = "5554984379019"; 
        
        // Mensagem padrão que aparece quando o cliente abre a conversa
        const message = encodeURIComponent("Olá! Vim pelo site da Necon e gostaria de mais informações.");
        
        // Cria o link do WhatsApp
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        
        // Abre o WhatsApp em uma nova aba
        window.open(whatsappUrl, '_blank');
    }

    // Ativa o botão lá de cima (Hero)
    const btnHero = document.getElementById('btn-whats-hero');
    if(btnHero) {
        btnHero.addEventListener('click', handleWhatsClick);
    }

    // Ativa o botão lá de baixo (Localização)
    const btnFooter = document.getElementById('btn-whats-footer');
    if(btnFooter) {
        btnFooter.addEventListener('click', handleWhatsClick);
    }
});
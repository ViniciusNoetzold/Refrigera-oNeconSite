document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DATA ATUAL ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // --- 2. MENU HAMBÚRGUER (NOVO) ---
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            // Alterna a classe 'active' no menu e no ícone
            navLinks.classList.toggle('active');

            // Troca o ícone de Barras para X
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- 3. WHATSAPP ---
    function handleWhatsClick() {
        window.open('https://wa.me/5554984379019', '_blank');
    }

    const btnHero = document.getElementById('btn-whats-hero');
    if (btnHero) btnHero.addEventListener('click', handleWhatsClick);

    const btnFooter = document.getElementById('btn-whats-footer');
    if (btnFooter) btnFooter.addEventListener('click', handleWhatsClick);
});
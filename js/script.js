document.addEventListener('DOMContentLoaded', () => {

  // Atualiza ano automaticamente no footer
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Botão WhatsApp com aviso temporário
  const btnWhats = document.getElementById('btn-whatsapp');
  if (btnWhats) {
    btnWhats.addEventListener('click', (e) => {
      e.preventDefault();
      alert(
        "O WhatsApp do escritório estará disponível em breve.\n\n" +
        "Por enquanto, você será redirecionado para a ligação telefônica."
      );
      window.location.href = "tel:+555433612383";
    });
  }

  // Header mais fino ao rolar
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.style.padding = "8px 0";
        header.style.opacity = "0.98";
      } else {
        header.style.padding = "15px 0";
        header.style.opacity = "1";
      }
    });
  }

});

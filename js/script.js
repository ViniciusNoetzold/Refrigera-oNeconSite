document.addEventListener('DOMContentLoaded', () => {

  // Ano automático
  const year = document.getElementById('current-year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // WhatsApp temporário
  const btn = document.getElementById('btn-whatsapp');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      alert(
        "O WhatsApp estará disponível em breve.\n\n" +
        "Você será redirecionado para ligação."
      );
      window.location.href = "tel:+555433612383";
    });
  }

});

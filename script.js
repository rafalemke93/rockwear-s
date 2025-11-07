
document.addEventListener("DOMContentLoaded", () => {
  const cardNumber = document.getElementById("cardNumber");
  const cardExpiry = document.getElementById("cardExpiry");
  const cardCVV = document.getElementById("cardCVV");
  const cardName = document.getElementById("cardName");
  const cardBrand = document.getElementById("cardBrand");
  const form = document.getElementById("cardForm");

  // Função para detectar bandeira
  const detectBrand = (num) => {
    const n = num.replace(/\D/g, "");
    if (/^4/.test(n)) return "Visa";
    if (/^5[1-5]/.test(n)) return "MasterCard";
    if (/^3[47]/.test(n)) return "American Express";
    if (/^6(?:011|5)/.test(n)) return "Discover";
    if (/^3(?:0[0-5]|[68])/.test(n)) return "Diners Club";
    if (/^35/.test(n)) return "JCB";
    return "";
  };

  // Formata número do cartão
  cardNumber.addEventListener("input", () => {
    let value = cardNumber.value.replace(/\D/g, "").substring(0, 16);
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    cardNumber.value = value;

    const brand = detectBrand(value);
    cardBrand.textContent = brand ? brand : "";
  });

  // Formata validade (MM/AA)
  cardExpiry.addEventListener("input", () => {
    let value = cardExpiry.value.replace(/\D/g, "").substring(0, 4);
    if (value.length >= 3) value = value.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    cardExpiry.value = value;
  });

  // Permite apenas números no CVV
  cardCVV.addEventListener("input", () => {
    cardCVV.value = cardCVV.value.replace(/\D/g, "").substring(0, 4);
  });

  // Validação simples
  const validateCard = () => {
    const num = cardNumber.value.replace(/\s/g, "");
    const exp = cardExpiry.value;
    const cvv = cardCVV.value;

    const [month, year] = exp.split("/").map((v) => parseInt(v));
    const now = new Date();
    const thisMonth = now.getMonth() + 1;
    const thisYear = parseInt(now.getFullYear().toString().slice(-2));

    if (num.length < 13 || num.length > 16) {
      alert("Número de cartão inválido.");
      return false;
    }
    if (!month || !year || month < 1 || month > 12) {
      alert("Validade inválida.");
      return false;
    }
    if (year < thisYear || (year === thisYear && month < thisMonth)) {
      alert("Cartão vencido.");
      return false;
    }
    if (cvv.length < 3 || cvv.length > 4) {
      alert("CVV inválido.");
      return false;
    }
    if (cardName.value.trim().length < 3) {
      alert("Digite o nome completo como está no cartão.");
      return false;
    }
    return true;
  };

  // Submissão do formulário
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validateCard()) {
      form.classList.add("loading");
      alert("✅ Pagamento processado com sucesso!\nObrigado pela compra 🤘");
      form.reset();
      cardBrand.textContent = "";
    }
  });
});


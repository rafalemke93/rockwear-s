function menuOnClick() {
  document.getElementById("menu-bar").classList.toggle("change");
  document.getElementById("nav").classList.toggle("change");
  document.getElementById("menu-bg").classList.toggle("change-bg");
}


    const hamburguer = document.getElementById("hamburguer");
    const menu = document.getElementById("menumob2");
    const fechar = document.getElementById("fechar-menu");

    hamburguer.onclick = () => {
      menu.classList.add("active");
    };

    fechar.onclick = () => {
      menu.classList.remove("active");
    };

    // BACKEND

    //  busca
  document.addEventListener("DOMContentLoaded", function() {
    const input = document.getElementById("pesquisar");
    const produtos = document.querySelectorAll(".produto");

    if (input) {
      input.addEventListener("input", function() {
        const termo = input.value.toLowerCase().trim();
        produtos.forEach(produto => {
          const textoProduto = produto.innerText.toLowerCase();
          produto.style.display = textoProduto.includes(termo) ? "block" : "none";
        });
      });

      const form = input.closest("form");
      if (form) form.addEventListener("submit", e => e.preventDefault());
    }

    document.getElementById('cartCount').style.display = 'none';


    loadCartFromStorage();
  });


  // Carrinho com localStorage

  let cart = [];
  let isCartOpen = false;

  function toggleCart(forceState) {
    const dropdown = document.getElementById('cartDropdown');
    isCartOpen = forceState !== undefined ? forceState : !isCartOpen;
    dropdown.classList.toggle('active', isCartOpen);
  }

  function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, image, quantity: 1 });
    }

    saveCartToStorage();
    updateCartDisplay();
    showAddedToCartAnimation();
  }

  function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    saveCartToStorage();
    updateCartDisplay();
  }

  function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        removeFromCart(name);
      } else {
        saveCartToStorage();
        updateCartDisplay();
      }
    }
  }

  function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartCountMobile = document.getElementById('cartCountMobile');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

    if(cartCount) cartCount.textContent = totalItems;
  if(cartCount) cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

  // Mobile
  if(cartCountMobile) cartCountMobile.textContent = totalItems;
  if(cartCountMobile) cartCountMobile.style.display = totalItems > 0 ? 'flex' : 'none';

    if (cart.length === 0) {
      cartItems.innerHTML = `
        <div class="empty-cart">
          <i class="bi bi-bag"></i>
          <p>Seu carrinho está vazio</p>
          <small>Adicione alguns produtos incríveis!</small>
        </div>
      `;
      cartFooter.style.display = 'none';
      return;
    }

    cartItems.innerHTML = '';

    cart.forEach(item => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="item-image">
        <div class="item-details">
          <div class="item-name">${item.name}</div>
          <div class="item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
        </div>
        <div class="item-quantity">
          <button class="qty-btn minus">-</button>
          <span class="qty-number">${item.quantity}</span>
          <button class="qty-btn plus">+</button>
        </div>
        <button class="remove-btn"><i class="bi bi-trash"></i></button>
      `;

      div.querySelector('.minus').addEventListener('click', () => updateQuantity(item.name, -1));
      div.querySelector('.plus').addEventListener('click', () => updateQuantity(item.name, 1));
      div.querySelector('.remove-btn').addEventListener('click', () => removeFromCart(item.name));

      cartItems.appendChild(div);
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    cartFooter.style.display = 'block';
  }

  // 🔹 Salva o carrinho no localStorage
  function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // 🔹 Carrega o carrinho salvo, se existir
  function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      cart = JSON.parse(savedCart);
      updateCartDisplay();
    }
  }

  function showAddedToCartAnimation() {
    const cartIcon = document.querySelector('.cart-icon-container img');
    if (!cartIcon) return;
    cartIcon.style.transform = 'scale(1.1)';
    setTimeout(() => { cartIcon.style.transform = 'scale(1)'; }, 200);
  }

   // Sistema básico de resumo e pagamento (mantém sua lógica anterior)
    let selectedPaymentMethod = null;
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    document.querySelectorAll('.payment-method').forEach(method => {
      method.addEventListener('click', function() {
        document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
        this.classList.add('active');
        selectedPaymentMethod = this.dataset.method;
        document.getElementById('card-details').style.display =
          (selectedPaymentMethod === 'credit_card' || selectedPaymentMethod === 'debit_card') ? 'block' : 'none';
      });
    });

    function loadCartSummary() {
      const summaryItems = document.getElementById('summary-items');
      let total = 0;
      summaryItems.innerHTML = '';
      cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        summaryItems.innerHTML += `
          <div class="summary-item">
            <span>${item.name} (${item.quantity}x)</span>
            <span>R$ ${itemTotal.toFixed(2).replace('.', ',')}</span>
          </div>`;
      });
      document.getElementById('summary-total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
    loadCartSummary();

    document.getElementById('btn-finalize').addEventListener('click', () => {
      if (!selectedPaymentMethod) return alert('Selecione uma forma de pagamento!');
      document.getElementById('order-id').textContent = Math.random().toString(36).substr(2,8).toUpperCase();
      document.getElementById('success-modal').style.display = 'flex';
      localStorage.removeItem('cart');
    });

    
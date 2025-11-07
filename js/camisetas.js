// GALERIA
const imagensGaleria = document.querySelectorAll('.img-galeria');
const imgDestaque = document.getElementById('img-destaque');

imagensGaleria.forEach(img => {
  img.addEventListener('click', () => {
    imgDestaque.src = img.src;
    imagensGaleria.forEach(i => i.classList.remove('img-destaque'));
    img.classList.add('img-destaque');
  });
});

imgDestaque.addEventListener('click', () => {
  imgDestaque.classList.toggle('zoomed');
});

// PLAYER

const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const icon = document.getElementById('icon');
const disco = document.querySelector('.disco');

function playPause() {
  if (audio.paused) {
    audio.play();
    icon.className = 'pause-icon';
    icon.innerHTML = '<span></span><span></span>';
    disco.classList.add('girando');
  } else {
    audio.pause();
    icon.className = 'play-icon';
    icon.innerHTML = '';
    disco.classList.remove('girando');
  }
}


audio.addEventListener('ended', () => {
  icon.className = 'play-icon';
  icon.innerHTML = '';
  disco.classList.remove('girando');
});

const hamburguer = document.getElementById("hamburguer");
const menu = document.getElementById("menumob2");
const fechar = document.getElementById("fechar-menu");

hamburguer.onclick = () => {
  menu.classList.add("active");
};

fechar.onclick = () => {
  menu.classList.remove("active");
};


window.onclick = (e) => {
  if (e.target === menu) {
    menu.classList.remove("active");
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("pesquisar");
  const produtos = document.querySelectorAll(".produto");

  if (input) {
    input.addEventListener("input", function () {
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

  if (cartCount) cartCount.textContent = totalItems;
  if (cartCount) cartCount.style.display = totalItems > 0 ? 'flex' : 'none';


  if (cartCountMobile) cartCountMobile.textContent = totalItems;
  if (cartCountMobile) cartCountMobile.style.display = totalItems > 0 ? 'flex' : 'none';

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


function saveCartToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}


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

function checkout() {
  if (cart.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  window.location.href = 'checkout.html';
}

function closeCart() {
  toggleCart(false);
}

let selectedSize = null;


document.querySelectorAll('.btn-tamanho').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.btn-tamanho').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedSize = btn.textContent.trim();
  });
});

document.getElementById('shopBtn').addEventListener('click', () => {
  const name = document.getElementById('titulo').textContent.trim();
  const price = 43.90;
  const image = document.getElementById('img-destaque').src;

  if (!selectedSize) {
    alert('Por favor, selecione um tamanho antes de adicionar ao carrinho!');
    return;
  }

  const existingItem = cart.find(item => item.name === name && item.size === selectedSize);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, image, size: selectedSize, quantity: 1 });
  }

  saveCartToStorage();
  updateCartDisplay();
  showAddedToCartAnimation();
});

// SLIDE
const slides = document.getElementById("slides");
const total = slides.children.length;
let index = 0;

document.getElementById("next").onclick = () => {
  index = (index + 1) % total;
  slides.style.transform = `translateX(${-index * 100}%)`;
};

document.getElementById("prev").onclick = () => {
  index = (index - 1 + total) % total;
  slides.style.transform = `translateX(${-index * 100}%)`;
};
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



const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

const produtos = [
  { id: 1, nome: "Camiseta Clássica Metallica", img: "imgs/metallica1.png", preco: "R$ 44,90" },
  { id: 2, nome: "Camiseta Clássica Korn", img: "imgs/korn1.png", preco: "R$ 43,90" },
  { id: 3, nome: "Camiseta System of a Down", img: "imgs/system1.png", preco: "R$ 69,90" },
  { id: 4, nome: "Camiseta Slipknot Tribal", img: "imgs/slip1.png", preco: "R$ 72,90" },
  { id: 5, nome: "Camiseta Linkin Park", img: "imgs/linkin1.png", preco: "R$ 74,90" },
  { id: 6, nome: "Camiseta Green Day \"American Idiot\"", img: "imgs/gd1.png", preco: "R$ 74,90" },
  { id: 7, nome: "Camiseta Nirvana", img: "imgs/nirvana1.png", preco: "R$ 69,90" },
  { id: 8, nome: "Camiseta Guns N' Roses", img: "imgs/guns1.png", preco: "R$ 64,90" },
  { id: 9, nome: "Camiseta Queen", img: "imgs/queen1.png", preco: "R$ 59,90" },
  { id: 10, nome: "Camiseta AC/DC", img: "imgs/acdc1.png", preco: "R$ 69,90" },
  { id: 11, nome: "Camiseta Iron Maiden", img: "imgs/iron1.png", preco: "R$ 79,90" },
  { id: 12, nome: "Camiseta Ramones", img: "imgs/ramones1.png", preco: "R$ 49,90" },
  { id: 13, nome: "Camiseta The Beatles", img: "imgs/beatles1.png", preco: "R$ 59,90" },
  { id: 14, nome: "Camiseta Led Zeppelin", img: "imgs/led1.png", preco: "R$ 69,90" },
  { id: 15, nome: "Camiseta Foo Fighters", img: "imgs/foo1.png", preco: "R$ 64,90" }
];


app.use(express.static(path.join(__dirname)));


app.get("/buscar", (req, res) => {
  const q = (req.query.q || "").trim().toLowerCase();


  if (!q) {
    return res.redirect("/");
  }


  const resultados = produtos.filter(p => p.nome.toLowerCase().includes(q));


  let html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1"/>
      <title>Resultados: ${escapeHtml(req.query.q || "")}</title>
      <link rel="stylesheet" href="css/index.css">
      <style>
        .result-grid { display:flex; flex-wrap:wrap; gap:24px; justify-content:center; padding:20px; }
        .result-card { width:220px; background:white; padding:12px; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.08); text-align:center; }
        .result-card img { max-width:100%; height:auto; border-radius:6px; }
        .no-results { text-align:center; padding:40px; color:#666; }
        .back-btn { display:inline-block; margin:20px auto; padding:10px 18px; background:#222; color:#fff; text-decoration:none; border-radius:8px; }
        header { text-align:center; margin-top:18px; }
        .search-form { text-align:center; margin:10px 0; }
        .search-input { width:320px; padding:8px 10px; border-radius:8px; border:1px solid #ccc; }
      </style>
    </head>
    <body>
      <header>
        <a href="/"><img src="imgs/logox.png" alt="logo" style="height:60px"></a>
        <div class="search-form">
          <form action="/buscar" method="get">
            <input class="search-input" name="q" value="${escapeHtml(req.query.q || "")}" placeholder="Procure sua banda favorita" />
            <button type="submit">Buscar</button>
          </form>
        </div>
        <h2>Resultados para "${escapeHtml(req.query.q || "")}"</h2>
      </header>
      <main>
    `;

  if (resultados.length === 0) {
    html += `<p class="no-results">Nenhum produto encontrado para "${escapeHtml(req.query.q || "")}".</p>`;
  } else {
    html += `<div class="result-grid">`;
    resultados.forEach(p => {

      const imgPath = path.join(__dirname, p.img);
      const imgSrc = fs.existsSync(imgPath) ? p.img : "imgs/placeholder.png";

      html += `
          <div class="result-card">
            <img src="${imgSrc}" alt="${escapeHtml(p.nome)}" />
            <h3 style="font-size:16px;margin:10px 0;">${escapeHtml(p.nome)}</h3>
            <p style="font-weight:700;">${escapeHtml(p.preco)}</p>
          </div>
        `;
    });
    html += `</div>`;
  }

  html += `
        <div style="text-align:center;margin:30px;">
          <a class="back-btn" href="/">Voltar à loja</a>
        </div>
      </main>
    </body>
    </html>
    `;

  res.send(html);
});

app.get("/api/suggestions", (req, res) => {
  const q = (req.query.q || "").trim().toLowerCase();
  if (!q) return res.json([]);

  const matches = produtos
    .filter(p => p.nome.toLowerCase().includes(q))
    .slice(0, 8)
    .map(p => ({ nome: p.nome, img: p.img, preco: p.preco }));

  res.json(matches);
});

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

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
    icon.className = 'pause-icon'; // muda para ícone de pausa
    icon.innerHTML = '<span></span><span></span>';
    disco.classList.add('girando'); // começa girar
  } else {
    audio.pause();
    icon.className = 'play-icon'; // volta para ícone de play
    icon.innerHTML = ''; // limpa o conteúdo antigo
    disco.classList.remove('girando'); // para de girar
  }
}

// Quando a música termina, volta o botão para o estado inicial
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

// Fecha o menu ao clicar fora dele (opcional)
window.onclick = (e) => {
  if (e.target === menu) {
    menu.classList.remove("active");
  }
};

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
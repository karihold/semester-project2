const menuButton = document.querySelector('#menu-button');
const menu = document.querySelector('.nav-ul');

menuButton.addEventListener('click', toggleMenu);

function toggleMenu() {
  menuButton.classList.toggle('active');
  menu.classList.toggle('active');
}

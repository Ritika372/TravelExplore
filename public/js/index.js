// to make js work on old versions
import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';

//DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logoutBtn = document.querySelector('.nav__el--logout');

//DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  document.querySelector('.form').addEventListener('submit', (event) => {
    console.log('hello');
    event.preventDefault();
    const email = document.querySelector('#email').value;
    const pass = document.querySelector('#password').value;

    login(email, pass);
    //   console.log(email, pass);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    logout();
  });
}

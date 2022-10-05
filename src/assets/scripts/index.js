import 'lazysizes';
import initializePortrait from './intro-portrait';
import * as party from 'party-js';

initializePortrait();

const cookie = document.createElement('span');
cookie.innerText = '🍪';
cookie.style.fontSize = '24px';

document.querySelector('.js-cookies').addEventListener('click', (event) => {
  party.confetti(event.currentTarget, {
    count: party.variation.range(20, 40),
    shapes: cookie,
  });
});

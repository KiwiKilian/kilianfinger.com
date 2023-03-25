import party from 'party-js';

const cookieButton = document.querySelector('.js-cookies');

const cookie = document.createElement('span');
cookie.innerText = '🍪';
cookie.style.fontSize = '24px';

cookieButton.addEventListener('click', () => {
  party.confetti(cookieButton, {
    count: party.variation.range(20, 40),
    shapes: cookie,
  });
});

import * as party from 'party-js';

export const initializeCookies = () => {
  const cookieButton = document.querySelector('.js-cookies');
  if (!cookieButton) return;

  const cookie = document.createElement('span');
  cookie.innerText = '🍪';
  cookie.style.fontSize = '24px';

  cookieButton.addEventListener('click', () => {
    party.confetti(cookieButton, {
      count: party.variation.range(20, 40),
      shapes: cookie,
    });
  });
};

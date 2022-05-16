import './intro-portrait.js';
import barba from '@barba/core';

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

barba.init({
  transitions: [
    {
      name: 'default-transition',
      async leave() {
        document.querySelector('.js-transitioner').classList.add('open');

        return new Promise((resolve) => setTimeout(resolve, 600));
      },
      enter(data) {
        data.current.container.remove();
        document.querySelector('.js-transitioner').classList.remove('open');

        return new Promise((resolve) => setTimeout(resolve, 600));
      },
    },
  ],
});

barba.hooks.enter(() => {
  // document.body.scrollTop = 0;
});

barba.hooks.afterEnter(() => {
  // document.body.scrollTop = 0;
  history.scrollRestoration = 'manual';
});

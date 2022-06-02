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

barba.hooks.enter((data) => {
  if (data.next.namespace === 'home' && data.current.namespace.startsWith('projects/')) {
    document.querySelector('.js-projects').scrollIntoView();
  } else {
    document.body.scrollTop = 0;
  }
});

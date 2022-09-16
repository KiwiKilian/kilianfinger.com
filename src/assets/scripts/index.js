import 'lazysizes';
import barba from '@barba/core';
import initializePortrait from './intro-portrait';

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

initializePortrait();

barba.init({
  views: [
    {
      namespace: 'home',
      beforeEnter() {
        initializePortrait();
      },
    },
  ],
  transitions: [
    {
      name: 'default-transition',
      leave(data) {
        document.querySelector('.js-transitioner').classList.add('open');

        return new Promise((resolve) =>
          setTimeout(() => {
            data.current.container.remove();

            resolve();
          }, 600),
        );
      },
      enter() {
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
    window.scrollTo({ top: 0 });
  }
});

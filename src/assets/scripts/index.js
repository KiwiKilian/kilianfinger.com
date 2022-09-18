import 'lazysizes';
import barba from '@barba/core';
import initializePortrait from './intro-portrait';

initializePortrait();

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

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
  const parser = new DOMParser();
  const nextDocument = parser.parseFromString(data.next.html, 'text/html');
  const themeColor = nextDocument.querySelector('meta[name="theme-color"]').getAttribute('content');

  document.querySelector('meta[name="theme-color"]').setAttribute('content', themeColor);
  document.querySelector('.js-transitioner').style.backgroundColor = themeColor;

  if (data.next.namespace === 'home' && data.current.namespace.startsWith('projects/')) {
    document.querySelector('.js-projects').scrollIntoView();
  } else {
    window.scrollTo({ top: 0 });
  }
});

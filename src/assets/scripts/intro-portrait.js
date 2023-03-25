const portraitWrapper = document.querySelector('.js-intro-portrait');

const portraits = document.querySelectorAll('.js-intro-portrait img');
let portraitIndex = 0;

const changePortrait = () => {
  if (portraitWrapper.classList.contains('is-shaking')) return;

  portraitWrapper.offsetWidth;
  portraitWrapper.classList.add('is-shaking');
  const nextPortraitIndex = (portraitIndex + 1) % 3;
  portraits[nextPortraitIndex].classList.replace('is-hidden', 'is-loading');

  setTimeout(() => {
    portraits[portraitIndex].classList.replace('is-visible', 'is-hidden');
    portraits[nextPortraitIndex].classList.replace('is-loading', 'is-visible');
    portraitWrapper.classList.remove('is-shaking');

    portraitIndex = nextPortraitIndex;
  }, 600);
};

portraitWrapper.addEventListener('click', changePortrait);

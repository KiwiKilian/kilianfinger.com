const portraitWrapper = document.querySelector('.js-intro-portrait');
const portraits = document.querySelectorAll('.js-intro-portrait picture');
let portraitIndex = 0;

const changePortrait = (event) => {
  portraitWrapper.classList.remove('shake');
  portraitWrapper.offsetWidth;
  portraitWrapper.classList.add('shake');

  setTimeout(() => {
    portraits[portraitIndex].style.display = 'none';
    portraitIndex = (portraitIndex + 1) % 3;
    portraits[portraitIndex].style.display = 'block';
  }, 600);
};

portraitWrapper.addEventListener('click', changePortrait);

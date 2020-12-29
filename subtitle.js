const subtitle = document.getElementsByClassName('subtitle')[0];

const changeSubtitle = (text, time) => {
  const transitionTime = 1000;

  setTimeout(() => {
    subtitle.style.opacity = 0;
    setTimeout(() => {
      subtitle.innerHTML = text;
      subtitle.style.opacity = 1;
    }, transitionTime / 2);
  }, time - transitionTime);
};

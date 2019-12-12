const redSword = document.querySelector('#redsword');
const blueSword = document.querySelector('#bluesword');

const centerOfPage = window.innerWidth / 2;

const hiltFraction = 1.75;

const redSwordWidth = redSword.clientWidth;
const blueSwordWidth = blueSword.clientWidth;

const redSwordStop = centerOfPage - redSwordWidth / hiltFraction;
const blueSwordStop = centerOfPage - blueSwordWidth / hiltFraction;

let redSwordRotation = -90;
let blueSwordRotation = 90;

animate({
  duration: 500,
  timing(timeFraction) {
    return Math.pow(timeFraction, 2);
  },
  draw(progress) {
    redSwordRotation = redSwordRotation + progress * 10;
    blueSwordRotation = blueSwordRotation - progress * 10;
    if (redSwordRotation >= 0 || progress === 1) redSwordRotation = 0;
    if (blueSwordRotation <= 0 || progress === 1) blueSwordRotation = 0;
    redSword.style.left = `${progress * redSwordStop}px`;
    blueSword.style.right = `${progress * blueSwordStop}px`;
    redSword.style.transform = `rotate(${redSwordRotation}deg)`;
    blueSword.style.transform = `rotate(${blueSwordRotation}deg)`;
  }
});

function animate({ timing, draw, duration }) {
  const start = performance.now();

  requestAnimationFrame(function animate(time) {
    let timeFraction = (time - start) / duration;
    if (timeFraction > 1) timeFraction = 1;

    const progress = timing(timeFraction);

    draw(progress);

    if (timeFraction < 1) {
      requestAnimationFrame(animate);
    }
  });
}

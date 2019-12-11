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

/* let redSwordMove = 0;
let blueSwordMove = 0;
let redSwordRotation = -90;
let blueSwordRotation = 90;

const blueSwordHalfWidth = blueSwordWidth / 2;
const blueSwordDiagonal = getDiagonal(blueSword.clientWidth, blueSword.clientHeight);
const blueSwordHalfDiagonal = blueSwordDiagonal / 2;
const y = getDiagonal(blueSword.clientWidth / 2, blueSword.clientHeight / 2);
const blueSwordMovementEndPoint = centerOfPage - blueSword.clientHeight + blueSword.clientHeight / 3;

const redSwordHalfWidth = redSwordWidth / 2;
const redSwordDiagonal = getDiagonal(redSword.clientWidth, redSword.clientHeight);
const redSwordHalfDiagonal = redSwordDiagonal / 2;
const x = getDiagonal(redSword.clientWidth / 2, redSword.clientHeight / 2);
const redSwordMovementEndPoint = centerOfPage - redSword.clientHeight + redSword.clientHeight / 3;

const framesPerSecond = 1000 / 60;
const startRotationDegree = 90;

const oneSecond = 1000;

const movementSpeed = centerOfPage / framesPerSecond;
const rotationSpeed = oneSecond / startRotationDegree;
const animationStartWait = 500;

function animateRedSword() {
  const swordIsAtCenter = redSwordMove >= redSwordMovementEndPoint;

  if (!swordIsAtCenter) {
    redSwordMove = redSwordMove + movementSpeed;
    redSword.style.left = `${redSwordMove}px`;

    window.requestAnimationFrame(animateRedSword);
  }  else {
    redSword.style.left = `${centerOfPage - redSwordHalfWidth - magicNumber}px`;
  }
}

function animateBlueSword() {
  const isSwordAtCenter = blueSwordMove >= blueSwordMovementEndPoint;

  if (!isSwordAtCenter) {
    blueSwordMove = blueSwordMove + movementSpeed;

    blueSword.style.right = `${blueSwordMove}px`;
    window.requestAnimationFrame(animateBlueSword);
  } else {
    blueSword.style.right = `${centerOfPage - blueSwordHalfWidth - magicNumber}px`;
  }
}

function getDiagonal(width, height) {
  return Math.sqrt(width * width + height * height);
}

function rotateRedSword() {
  const swordIsFullyRotatet = redSwordRotation >= 0;

  if (!swordIsFullyRotatet) {
    redSwordRotation = redSwordRotation + rotationSpeed;
    redSword.style.transform = `rotate(${redSwordRotation >= 0 ? 0 : redSwordRotation}deg)`;
    window.requestAnimationFrame(rotateRedSword);
  } else {
    redSword.style.transform = `rotate(0deg)`;
  }
}

function rotateBlueSword() {
  const swordIsFullyRotatet = blueSwordRotation <= 0;
  if (!swordIsFullyRotatet) {
    blueSwordRotation = blueSwordRotation - rotationSpeed;
    blueSword.style.transform = `rotate(${blueSwordRotation <= 0 ? 0 : blueSwordRotation}deg)`;
    window.requestAnimationFrame(rotateBlueSword);
  } else {
    blueSword.style.transform = `rotate(0deg)`;
  }
}

function startRedSwordAnimation() {
  window.requestAnimationFrame(animateRedSword);
  window.requestAnimationFrame(rotateRedSword);
}

function startBlueSwordAnimation() {
  window.requestAnimationFrame(animateBlueSword);
  window.requestAnimationFrame(rotateBlueSword);
}

window.setTimeout(startRedSwordAnimation, animationStartWait);
window.setTimeout(startBlueSwordAnimation, animationStartWait);


 */

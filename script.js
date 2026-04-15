const actionBtn = document.querySelector('.action-btn');
const resetBtn = document.querySelector('.reset-btn');
const truck = document.querySelector('.truck');
const tatsuro = document.querySelector('.tatsuro');
const message = document.querySelector('.message');

let truckInterval;
let isStarted = false;

function getRandomSpeed() {
  const speeds = [5, 8, 10];
  return speeds[Math.floor(Math.random() * speeds.length)];
}

const audio = new Audio("koe.m4a");

function playSound() {
  audio.currentTime = 0;
  audio.play();
}

audio.addEventListener('ended', () => {
  resetGame();
});

function resetGame() {
  clearInterval(truckInterval);
  isStarted = false;
  truck.style.right = '-50px';
  truck.style.top = 'calc(350px)';
  tatsuro.style.left = 'calc(25px)';
  tatsuro.style.bottom = '130px';
  tatsuro.style.transform = 'translate(-50%, 0)';
  message.style.display = 'none';
  actionBtn.textContent = 'スタート';
  actionBtn.disabled = false;
}

function handleAction() {
  if (!isStarted) {
    isStarted = true;
    actionBtn.textContent = '飛び出し';
    const speed = getRandomSpeed();
    truckInterval = setInterval(() => {
      truck.style.right = `${parseInt(truck.style.right || 0) + speed}px`;
    }, 10);
  } else {
    actionBtn.disabled = true;
    clearInterval(truckInterval);
    tatsuro.style.bottom = '30%';
    tatsuro.style.transform = 'translateY(-50%)';
    setTimeout(() => {
      const truckRect = truck.getBoundingClientRect();
      const tatsuroRect = tatsuro.getBoundingClientRect();
      const distance = truckRect.left - (tatsuroRect.right);
      const absDistance = Math.abs(distance);
      message.classList.remove('success', 'failure', 'no-guts');
      message.style.display = 'block';
      if (distance <= 0 && absDistance <= (truckRect.width + tatsuroRect.width) / 2 + 65) {
        tatsuro.style.transform = 'translateY(-50%) rotate(-90deg)';
        message.style.left = `${tatsuroRect.right}px`;
        message.style.top = `${tatsuroRect.top - 30}px`;
        message.textContent = '死○じゃった';
        message.classList.add('failure');
      } else if (distance > 0 && absDistance <= 35) {
        message.textContent = '僕は死にましぇん';
        message.classList.add('success');
        message.style.left = `${tatsuroRect.left + tatsuroRect.width / 2 + 10}px`;
        message.style.top = `${tatsuroRect.top - message.offsetHeight}px`;
        playSound();
      } else {
        message.style.left = `${tatsuroRect.left + tatsuroRect.width / 2}px`;
        message.style.top = `${tatsuroRect.top - 15}px`;
        message.textContent = '根性なし';
        message.classList.add('no-guts');
      }
    }, 500);
  }
}

// スマホとPCの両方に対応（二重発火防止）
function addTapHandler(element, handler) {
  let touched = false;
  element.addEventListener('touchend', (e) => {
    e.preventDefault();
    touched = true;
    handler();
  });
  element.addEventListener('click', () => {
    if (!touched) handler();
    touched = false;
  });
}

addTapHandler(actionBtn, handleAction);
addTapHandler(resetBtn, resetGame);

resetGame();

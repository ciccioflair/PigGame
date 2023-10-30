'use strict';

// Global Variables
const player0Name = document.getElementById('name--0');
const player1Name = document.getElementById('name--1');

const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');

const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');

const score0El = document.getElementById('score--0');
const score1El = document.getElementById('score--1');

const diceEl = document.querySelector('.cube');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

const diceRollSound = new Audio('./Audio/dice-95077.mp3');
const scoreAudio = new Audio('./Audio/score.mp3');
const loseScore = new Audio('./Audio/one.mp3');
const winAudio = new Audio('./Audio/tadaa.mp3');

let scores, currentScore, activePlayer, playing;

// Starting conditions

const init = function () {
  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;

  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;

  player0El.classList.add('player--active');
  player1El.classList.remove('player--active');
  document.querySelector('.player--winner').textContent = '';
};

init();


// Functions

const changePlayer = function () {
  currentScore = 0;
  document.getElementById(`current--${activePlayer}`).textContent =
    currentScore;

  activePlayer = activePlayer === 0 ? 1 : 0;

  player0El.classList.toggle('player--active');
  player1El.classList.toggle('player--active');
};

const closeModal = function () {
  document.querySelector('.player--winner').classList.add('hidden');
  document.querySelector('.overlay').classList.add('hidden');
  document.querySelector('.close-modal').classList.add('hidden');
};

const pulse = function () {
  setTimeout(() => {
    document
      .getElementById(`current--${activePlayer}`)
      .classList.remove('pulse');
  }, 900);
};

// Dice roll event

btnRoll.addEventListener('click', function () {
  if (playing) {
    const rndNum = Math.trunc(Math.random() * 6) + 1;
    diceRollSound.play();
    diceEl.classList.toggle('show-spin');
    document.querySelector(
      '.cube__face__front'
    ).style.backgroundImage = `url(./dice-${rndNum}.png)`;

    // Wait some time before making calculations
    setTimeout(() => {
      if (rndNum !== 1) {
        currentScore += rndNum;
        document
          .getElementById(`current--${activePlayer}`)
          .classList.add('pulse');
        document.getElementById(`current--${activePlayer}`).textContent =
          currentScore;
        scoreAudio.play();

        pulse();

        // Change Player
      } else {
        loseScore.play();
        document
          .getElementById(`current--${activePlayer}`)
          .classList.add('pulse');

        pulse();

        changePlayer();
      }
    }, 900);
  }
});

// Hold event

btnHold.addEventListener('click', function () {
  if (playing) {
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];

    if (scores[activePlayer] >= 100) {
      playing = false;
      winAudio.play();
      document.getElementById(`score--${activePlayer}`).classList.add('pulse');
      document.querySelector('.player--winner').classList.remove('hidden');
      setTimeout(() => {
        document.querySelector('.overlay').classList.remove('hidden');
        document.querySelector('.close-modal').classList.remove('hidden');
        document.querySelector('.player--winner').textContent =
          activePlayer === 0
            ? `${player0Name.textContent} WIN!!`
            : `${player1Name.textContent} WIN!!`;
      }, 2000);
    } else {
      changePlayer();
    }
  }
});

// Close winning Modal event

document.querySelector('.close-modal').addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeModal();
});

// New Game event

document.querySelector('.btn--new').addEventListener('click', init);

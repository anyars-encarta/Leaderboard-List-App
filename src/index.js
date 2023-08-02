import './style.css';
import myDateTime from './modules/date-time.js';
import {
  createGame, addYourScore, retrieveScores, getGameId,
} from './modules/scoreblock.js';

const submitForm = document.querySelector('.scores-form');
const refreshButton = document.getElementById('refresh');

const scoresContainer = document.getElementById('score-list');

// Declare the gameName variable here
const gameName = "Anyars' Quiz Game";

const displayScores = (scores) => {
  scoresContainer.innerHTML = '';

  if (!Array.isArray(scores) || scores.length === 0) {
    const noScoresMessage = document.createElement('p');
    noScoresMessage.textContent = 'No scores to display...';
    scoresContainer.appendChild(noScoresMessage);
    noScoresMessage.style.color = 'red';
  } else {
    scores.forEach(({ user, score }, index) => {
      const listItem = document.createElement('li');
      listItem.setAttribute('id', `score-${index}`);
      listItem.textContent = `${user}: ${score}`;
      scoresContainer.appendChild(listItem);
    });
  }
};

const refreshScores = async () => {
  try {
    // Get the gameId from local storage
    let gameId = getGameId();

    if (!gameId) {
      gameId = await createGame(gameName);

      if (!gameId) {
        // console.error('Error creating/fetching game ID.');
        return;
      }

      localStorage.setItem('gameId', gameId);
    }

    // Pass the scoresContainer
    const scores = await retrieveScores(gameId, scoresContainer);
    displayScores(scores);
  } catch (error) {
    // console.error('Error retrieving scores:', error.message);
  }
};

const onSubmitScore = async (e) => {
  e.preventDefault();

  const userNameInput = document.getElementById('name');
  const scoreInput = document.getElementById('score');

  const userName = userNameInput.value;
  const score = scoreInput.value;

  // Validate user input
  if (!userName || !score || Number.isNaN(parseInt(score, 10))) {
    // Invalid input, handle the error appropriately
    const messageSpan = document.getElementById('message');

    messageSpan.style.display = 'block';
    messageSpan.style.color = 'red';
    messageSpan.textContent = 'Please enter a valid name and score.';
    userNameInput.style.border = '1px solid red';
    scoreInput.style.border = '1px solid red';
    setTimeout(() => {
      messageSpan.style.display = 'none';
      userNameInput.style.border = '';
      scoreInput.style.border = '';
      submitForm.reset();
    }, 5000);
    return;
  }

  try {
    let gameId = getGameId();

    if (!gameId) {
      // If the game ID is not found in local storage,
      // create a new game and pass the gameName variable
      gameId = await createGame(gameName);

      if (!gameId) {
        throw new Error('Error creating/fetching game ID.');
      }

      // Set the game ID in local storage for future use
      localStorage.setItem('gameId', gameId);
    }

    await addYourScore(userName, score);
    refreshScores();
    submitForm.reset();
  } catch (error) {
    // console.error('Error submitting score:', error.message);
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  myDateTime();
  refreshScores();

  try {
    // First, create the game or fetch the existing game ID
    const gameId = await createGame(gameName);

    if (gameId) {
      // If the gameId is successfully retrieved, fetch the scores and display them and pass the
      // scoresContainer to retrieveScores
      retrieveScores(scoresContainer);
    } else {
      // console.error('Error creating/fetching game ID.');
    }
  } catch (error) {
    // console.error('Error creating new game:', error.message);
  }

  const submitForm = document.querySelector('.scores-form');
  submitForm.addEventListener('submit', onSubmitScore);
});

submitForm.addEventListener('submit', onSubmitScore);
refreshButton.addEventListener('click', refreshScores);

export default displayScores;

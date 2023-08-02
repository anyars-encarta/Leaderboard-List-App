// import './style.css';
import myDateTime from './modules/date-time.js';
import { createGame, addYourScore, retrieveScores, getGameId } from './modules/scoreblock.js';
const scoresContainer = document.getElementById('score-list');

const displayScores = (scores) => {
  scoresContainer.innerHTML = '';

  if (scores.length === 0) {
    const noScoresMessage = document.createElement('p');
    noScoresMessage.textContent = 'No scores to display...';
    scoresContainer.appendChild(noScoresMessage);
    noScoresMessage.style.color = 'red';
  } else {
    scores.forEach(({ user, score }, index) => {
      const listItem = document.createElement('li');
      listItem.setAttribute('id', `score-${index}`);
      listItem.textContent = user + ': ' + score;
      scoresContainer.appendChild(listItem);
    });
  }
};

const refreshScores = async () => {
  try {
    const scores = await retrieveScores();
    displayScores(scores);
  } catch (error) {
    console.error('Error retrieving scores:', error.message);
  }
};

const onSubmitScore = async (e) => {
  e.preventDefault();

  const userNameInput = document.getElementById('name');
  const scoreInput = document.getElementById('score');

  const userName = userNameInput.value;
  const score = scoreInput.value;

  // Validate user input
  if (!userName || !score || isNaN(parseInt(score, 10))) {
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
    await addYourScore(userName, score);
    refreshScores();
    submitForm.reset();
  } catch (error) {
    console.error('Error submitting score:', error.message);
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  myDateTime();

  const gameName = '"Anyars\' Quiz Game';
  try {
    // First, create the game or fetch the existing game ID
    await createGame(gameName);

    // Then, fetch the scores and display them after the game ID is available
    const scores = await retrieveScores();
    displayScores(scores);
  } catch (error) {
    console.error('Error creating new game:', error.message);
  }
});

const submitForm = document.querySelector('.scores-form');
submitForm.addEventListener('submit', onSubmitScore);

const refreshButton = document.getElementById('refresh');
refreshButton.addEventListener('click', refreshScores);

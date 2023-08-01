const scoreLoad = () => {
  const scoresListDisplay = document.getElementById('score-list');
  const scoreTitle = document.getElementById('name');
  const scoreMark = document.getElementById('score');
  const spanMessage = document.getElementById('message');

  let scoreLists = [];
  class Scores {
    static addScore(name, score) {
      if (Scores.isEmptyField(name, score)) {
        Scores.showErrorMesssage('Please fill in both the name and the score fields.');
        return;
      }

      if (Scores.isDuplicate(name, score)) {
        Scores.showErrorMesssage('This score already exists in the score list.');
        return;
      }
      // Generate new unique ID for score
      const id = Scores.counterAutoIncreatmentId();
      // Add score to list
      scoreLists.push({ id, name, score });

      // Save scores to local storage
      Scores.saveScores();

      // Clear input fields
      Scores.clearInputFields();
      // Display success message
      Scores.showsuccessMessage('Score added successfully!');
      // Display score in list
      Scores.renderScores(id, name, score);
    }

    static isEmptyField(nameText, scoreText) {
      return !nameText || !scoreText;
    }

    static isDuplicate(nameText, scoreText) {
      return scoreLists.some((score) => score.name === nameText && score.score === scoreText);
    }

    static removeScore(id) {
      scoreLists = scoreLists.filter((score) => score.id !== id);
      // Save scores to local storage
      Scores.saveScores();
      // Remove score from the list
      const scoreElement = document.getElementById(`score-${id}`);
      if (scoreElement) {
        scoreElement.remove();
      }
      // Display success message
      Scores.showsuccessMessage('Score removed successfully!');
    }

    static renderScores(id, name, score) {
      // Create list of Scores
      const scoreElement = document.createElement('li');
      scoreElement.setAttribute('id', `score-${id}`);
      scoreElement.textContent = `${name}: ${score}`;
      // Create remove button for list
      const removeButton = document.createElement('button');
      removeButton.setAttribute('class', 'remove-btn');
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', () => {
        Scores.removeScore(id);
        Scores.showsuccessMessage('Score removed successfully!');
      });
      scoreElement.appendChild(removeButton);
      // Add score to list
      scoresListDisplay.appendChild(scoreElement);
    }

    static counterAutoIncreatmentId() {
      if (scoreLists.length === 0) {
        return 1;
      }
      return scoreLists[scoreLists.length - 1].id + 1;
    }

    static clearInputFields() {
      scoreTitle.value = '';
      scoreMark.value = '';
    }

    static saveScores() {
      localStorage.setItem('scoreLists', JSON.stringify(scoreLists));
    }

    static loadScores() {
      const scoresJson = localStorage.getItem('scoreLists');
      return scoresJson ? JSON.parse(scoresJson) : [];
    }

    static showsuccessMessage(message) {
      spanMessage.classList.add('success');
      spanMessage.classList.remove('error');
      spanMessage.textContent = message;
      spanMessage.style.display = 'block';
      scoreTitle.style.border = '1px solid green';
      scoreMark.style.border = '1px solid green';
      setTimeout(() => {
        spanMessage.style.display = 'none';
        scoreTitle.style.border = '';
        scoreMark.style.border = '';
        Scores.clearInputFields();
      }, 2000);// hide the success message after 2 seconds
    }

    static showErrorMesssage(message) {
      spanMessage.classList.add('error');
      spanMessage.classList.remove('success');
      spanMessage.textContent = message;
      spanMessage.style.display = 'block';
      scoreTitle.style.border = '1px solid red';
      scoreMark.style.border = '1px solid red';
      setTimeout(() => {
        spanMessage.style.display = 'none';
        scoreTitle.style.border = '';
        scoreMark.style.border = '';
        Scores.clearInputFields();
      }, 2000);// hide the success message after 2 seconds
    }
  }

  // Add event listener to click or submit button
  const addButton = document.getElementById('add-btn');
  addButton.addEventListener('click', (event) => {
    event.preventDefault();
    const name = scoreTitle.value.trim();
    const score = scoreMark.value.trim();
    if (name && score) {
      Scores.addScore(name, score);
    } else {
      Scores.showsuccessMessage('Please fill in both the name and the score fields.');
    }
  });

  // Load scores from local storage and render it on the page
  Scores.loadScores().forEach((score) => {
    // Display score in list
    Scores.renderScores(score.id, score.name, score.score);
  });
};

export default scoreLoad;
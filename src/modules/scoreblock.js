// Helper function to handle API errors
const handleApiError = (error) => {
  // Handle API request error
  console.error('An error occurred:', error);
};

export const getGameId = () => localStorage.getItem('gameId');

// Function to clear local storage when a new game is created
export const clearLocalStorage = () => {
  localStorage.removeItem('gameId');
  localStorage.removeItem('scores');
};

const makeApiRequest = async (url, method, body) => {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    // Check if the response has JSON data, if not, return an empty object
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      // Parse the JSON and return the response data
      return response.json(); 
    } else {
      // Return an empty object if the response doesn't have JSON data
      return {}; 
    }
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};


export const createGame = async (gameName) => {
  try {
    const gameId = getGameId();

    if (!gameId) {
      const response = await makeApiRequest(
        'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/',
        'POST',
        {
          name: gameName,
        }
      );

      // Check if the response contains the gameId property
      if (response?.result?.includes('Game with ID: ')) {
        // Extract the gameId from the response
        const newGameId = response.result.split('Game with ID: ')[1];
        if (newGameId) {
          localStorage.setItem('gameId', newGameId);
        }
      }
    }
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const retrieveScores = async () => {
  try {
    // Get the game ID from local storage
    const gameId = getGameId(); 

    if (!gameId) {
      throw new Error('Game ID not found. Please create a new game first.');
    }

    const response = await makeApiRequest(
      `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${gameId}/scores/`,
      'GET'
    );

    // Extract the scores from the response
    const scores = response.result; 

    localStorage.setItem('scores', JSON.stringify(scores));
    // Return the extracted scores
    return scores; 
  } catch (error) {
    handleApiError(error);
    // Return an empty array if there's an error
    return []; 
  }
};

export const addYourScore = async (userName, score) => {
  try {
    // Get the game ID from local storage
    const gameId = getGameId(); 
    if (!gameId) {
      throw new Error('Game ID not found. Please create a new game first.');
    }

    const parsedScore = parseInt(score, 10);

    if (!userName || isNaN(parsedScore) || parsedScore <= 0) {
      return;
    }

    await makeApiRequest(
      `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${gameId}/scores/`,
      'POST',
      {
        user: userName,
        score: parsedScore,
      }
    );

    const scores = await retrieveScores();
    const updatedScores = [...scores, { user: userName, score: parsedScore }];
    localStorage.setItem('scores', JSON.stringify(updatedScores));
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
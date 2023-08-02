// Helper function to handle API errors
const handleApiError = () => {
  throw new Error('error!');
  // Handle API request error
  // console.error('An error occurred:', error);
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
    }
    // Return an empty object if the response doesn't have JSON data
    return {};
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const createGame = async (gameName) => {
  try {
    let gameId = getGameId();

    // Use a fixed game ID if it exists in local storage
    const fixedGameId = 'JhRzPkDH3S1gPDwcnOFS';

    if (!gameId) {
      const response = await makeApiRequest(
        'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/',
        'POST',
        {
          name: gameName,
          gameID: fixedGameId, // Pass the fixed game ID in the API request
        },
      );

      if (response?.result?.startsWith('Game with ID: ')) {
        // Extract the gameId from the response
        gameId = fixedGameId;
        localStorage.setItem('gameId', gameId);
      }
    }
    return gameId;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const retrieveScoresFromAPI = async (gameId) => {
  try {
    const response = await makeApiRequest(
      `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${gameId}/scores/`,
      'GET',
    );

    // Extract the scores from the response
    const scores = response.result;

    // Check if the scores variable is an array
    if (Array.isArray(scores)) {
      // Return the extracted scores if it's an array
      return scores;
    }
    throw new Error('Invalid scores data format.');
  } catch (error) {
    handleApiError(error);
    // Return an empty array if there's an error
    return [];
  }
};

export const retrieveScores = async () => {
  try {
    const gameId = getGameId();

    if (!gameId) {
      // If the game ID is not found in local storage, display a message
      // Return an empty array when the scores are not available
      return [];
    }

    const scores = await retrieveScoresFromAPI(gameId);
    return scores;
  } catch (error) {
    // Return an empty array when there's an error
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

    if (!userName || Number.isNaN(parsedScore) || parsedScore <= 0) {
      return;
    }

    await makeApiRequest(
      `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${gameId}/scores/`,
      'POST',
      {
        user: userName,
        score: parsedScore,
      },
    );

    const scores = await retrieveScores();
    const updatedScores = [...scores, { user: userName, score: parsedScore }];
    localStorage.setItem('scores', JSON.stringify(updatedScores));
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

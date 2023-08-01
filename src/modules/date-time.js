import { DateTime } from './luxon.js';

const myDateTime = () => {
  const myDocument = document.getElementById('date-time');

  const dateTimeUpdate = () => {
    const dateTimeCurrent = DateTime.now().toLocaleString(
      DateTime.DATETIME_FULL_WITH_SECONDS,
    );
    myDocument.innerHTML = dateTimeCurrent;
  };

  setInterval(dateTimeUpdate, 500);
};

export default myDateTime;
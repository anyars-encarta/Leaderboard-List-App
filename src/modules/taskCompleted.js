import { storeItem } from './addEditRemove.js';

// Set checkbox to true and save to local storage
export const checkedBox = (todo, index) => {
  todo[index].completed = true;
  storeItem(todo);
};

// Set checkbox to false and save to local storage
export const notChecked = (todo, index) => {
  todo[index].completed = false;
  storeItem(todo);
};
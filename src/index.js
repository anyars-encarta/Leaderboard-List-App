import './style.css';
import myDateTime from './modules/date-time.js';
import {
  getItem, addItem, editItem, removeItem, findIndex, clearTasks,
} from './modules/addEditRemove.js';
import { checkedBox, notChecked } from './modules/taskCompleted.js';

// Declare initial variables
const list = document.querySelector('#list');
const addBtn = document.querySelector('#add-btn');
const clear = document.querySelector('#clear');

// Variable to get Tasks from local storage
let todo = getItem();

// Function to clear existing list content
const clearList = () => {
  list.innerHTML = '';
};

// Sort tasks in descending order based on their indexes
const todoList = () => {
  clearList();
  todo = todo.sort((a, b) => a.index - b.index);

  todo.forEach((item) => {
    list.innerHTML += `
        <li class="item">
            <input type="checkbox" class="check" ${item.completed ? 'checked' : ''}>
            <span class="focus">${item.desc}</span>
            <i class="fa fa-ellipsis-v"></i>
        </li>`;
  });
};

// Function to add task when "Enter" key is pressed
const handleInputKeyPress = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const newItem = document.querySelector('#new').value;
    if (!newItem) {
      e.preventDefault();
    } else {
      addItem(todo, newItem);
      todoList();
      document.querySelector('#new').value = '';
    }
  }
};

// Event listener to the input field for "Enter" key press
document.querySelector('#new').addEventListener('keypress', handleInputKeyPress);

// Event listener to individual task items for editing and removing tasks
list.addEventListener('click', (e) => {
  const index = findIndex(list, e);
  if (e.target.classList.contains('fa-ellipsis-v')) {
    const item = e.target.parentElement;
    item.contentEditable = 'true';
    item.addEventListener('input', () => {
      editItem(todo, index, item.textContent);
    });
    e.target.classList.remove('fa-ellipsis-v');
    e.target.classList.add('fa-trash');
  } else if (e.target.classList.contains('fa-trash')) {
    removeItem(todo, index);
    e.target.parentElement.remove();
  } else if (e.target.classList.contains('check')) {
    if (e.target.checked) {
      checkedBox(todo, index);
    } else {
      notChecked(todo, index);
    }
  }
});

// Clear(remove) all completed marked tasks
clear.addEventListener('click', () => {
  const items = document.querySelectorAll('.check');
  items.forEach((item) => {
    if (item.checked) {
      item.parentElement.remove();
    }
  });
  todo = clearTasks(todo);
});

// Event listener to add(+) button
addBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const newItem = document.querySelector('#new').value;
  if (!newItem) {
    e.preventDefault();
  } else {
    addItem(todo, newItem);
    todoList(); // Update the list after adding a new item
    document.querySelector('#new').value = '';
  }
});

// Event listener to document on loading content
document.addEventListener('DOMContentLoaded', () => {
  todo = getItem(); // Fetch the tasks from local storage
  todoList();
  myDateTime();
});

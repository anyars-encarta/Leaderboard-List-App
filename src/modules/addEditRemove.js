// // Variable to get Tasks from local storage
// const todo = JSON.parse(localStorage.getItem('items')) || [];

// Function to save to local storage
export const storeItem = (todo) => {
  localStorage.setItem('items', JSON.stringify(todo));
};

// Function to save to local storage
export const getItem = () => JSON.parse(localStorage.getItem('items')) || [];

// Add new tasks
export const addItem = (todo, desc) => {
  const item = {
    desc,
    completed: false,
    index: todo.length + 1,
  };
  todo.push(item);
  storeItem(todo);
};

// Remove tasks
export const removeItem = (todo, index) => {
  todo.splice(index, 1);
  for (let i = index; i < todo.length; i += 1) {
    todo[i].index = i + 1;
  }
  storeItem(todo);
};

// Edit existing tasks
export const editItem = (todo, index, desc) => {
  todo[index].desc = desc;
  storeItem(todo);
};

// Find task index
export const findIndex = (list, e) => {
  const item = e.target.parentElement;
  const index = Array.from(list.children).indexOf(item);
  return index;
};

// Function to clear marked completed tasks
export function clearTasks(todo) {
  const updatedTodo = todo.filter((item) => !item.completed);
  updatedTodo.forEach((item, index) => {
    item.index = index + 1;
  });
  storeItem(updatedTodo);
  return updatedTodo;
}
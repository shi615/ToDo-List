
// 当页面加载时，从存储中加载todos
document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get('todos', function(data) {
        let todos = data.todos || [];
        todos.forEach(function(todo) {
            addTodoToUI(todo);
        });
    });
});

document.getElementById('add-todo').addEventListener('click', function() {
    let value = document.getElementById('new-todo').value.trim();
    if (value) {
        addTodoToUI(value);
        saveTodoToStorage(value);
        document.getElementById('new-todo').value = '';
    }
});

document.getElementById('new-todo').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        let value = document.getElementById('new-todo').value.trim();
        if (value) {
            addTodoToUI(value);
            saveTodoToStorage(value);
            document.getElementById('new-todo').value = '';
        }
    }
});

function addTodoToUI(value) {
    let ul = document.getElementById('todo-list');
    let li = document.createElement('li');

    let span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = value;
    li.appendChild(span);

    let editButton = document.createElement('button');
    editButton.className = 'edit-todo';
    editButton.textContent = 'Edit';
    li.appendChild(editButton);

    let deleteButton = document.createElement('button');
    deleteButton.className = 'delete-todo';
    deleteButton.textContent = 'Done';
    li.appendChild(deleteButton);

    ul.appendChild(li);

    attachEventListeners(li);
}

function saveTodoToStorage(value) {
    chrome.storage.local.get('todos', function(data) {
        let todos = data.todos || [];
        todos.push(value);
        chrome.storage.local.set({ 'todos': todos });
    });
}

function removeTodoFromStorage(value) {
    chrome.storage.local.get('todos', function(data) {
        let todos = data.todos || [];
        let index = todos.indexOf(value);
        if (index !== -1) {
            todos.splice(index, 1);
            chrome.storage.local.set({ 'todos': todos });
        }
    });
}

function attachEventListeners(li) {
    let editButton = li.querySelector('.edit-todo');
    let deleteButton = li.querySelector('.delete-todo');
    let todoText = li.querySelector('.todo-text');

    editButton.addEventListener('click', function() {
        let newValue = prompt('Edit task:', todoText.textContent);
        if (newValue) {
            removeTodoFromStorage(todoText.textContent);
            todoText.textContent = newValue.trim();
            saveTodoToStorage(newValue.trim());
        }
    });

    deleteButton.addEventListener('click', function() {
        removeTodoFromStorage(todoText.textContent);
        li.remove();
    });
}

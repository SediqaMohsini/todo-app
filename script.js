// ۱. پیدا کردن عناصر صفحه
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const counter = document.getElementById('counter');
const clearBtn = document.getElementById('clearBtn');
const filterButtons = document.querySelectorAll('#filters button');
let currentFilter = 'all';

// ۲. آرایه‌ای که کارها توش نگه داشته می‌شن

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ۳. نمایش کارها توی صفحه
function renderTasks() {
  taskList.innerHTML = '';
  const remaining = tasks.filter(function (t) { return !t.done; }).length;
counter.textContent = remaining + (remaining === 1 ? ' task left' : ' tasks left');

filterButtons.forEach(function (btn) {
  btn.classList.toggle('selected', btn.dataset.filter === currentFilter);
});
tasks.forEach(function (task, index) {
  if (currentFilter === 'active' && task.done) return;
  if (currentFilter === 'done' && !task.done) return;
    const li = document.createElement('li');

    // چک‌باکس برای تیک زدن
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', function () {
      tasks[index].done = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    // متن کار
    const span = document.createElement('span');
    span.textContent = ' ' + task.text + ' ';
    if (task.done) {
      span.style.textDecoration = 'line-through';
      span.style.color = '#999';
    }

    // دکمه‌ی حذف
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌';
    deleteBtn.addEventListener('click', function () {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

// ۴. اضافه کردن یه کار جدید
function addTask() {
  const text = taskInput.value.trim();
  if (text === '') return;

  tasks.push({ text: text, done: false });
  taskInput.value = '';
  saveTasks();
  renderTasks();
}

// ۵. وصل کردن دکمه و کلید Enter
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    addTask();
  }
});

filterButtons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

clearBtn.addEventListener('click', function () {
  tasks = tasks.filter(function (t) { return !t.done; });
  saveTasks();
  renderTasks();
});
renderTasks();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
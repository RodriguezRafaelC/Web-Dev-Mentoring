

let tasks = JSON.parse(localStorage.getItem('myChecklistTasks')) || [];
let currentCategory = 'work';

const datePicker = document.getElementById('datePicker');
datePicker.valueAsDate = new Date();

datePicker.addEventListener('change', renderTasks);

document.getElementById("taskInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") addTask();
});


function selectCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll('.cat-option').forEach(btn => btn.classList.remove('selected'));
    document.getElementById(`btn-${cat}`).classList.add('selected');
}

function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    const date = datePicker.value;

    if (text === '') {
        input.focus();
        input.style.borderColor = '#ff7675';
        setTimeout(() => input.style.borderColor = '#dfe6e9', 1000);
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        category: currentCategory,
        date: date,
        completed: false
    };

    tasks.push(newTask);
    saveAndRender();
    input.value = ''; 
    input.focus();
}

function toggleComplete(id) {
    tasks = tasks.map(t => {
        if (t.id === id) t.completed = !t.completed;
        return t;
    });
    saveAndRender();
}

function deleteTask(id) {
    if(confirm("Delete this task?")) {
        tasks = tasks.filter(t => t.id !== id);
        saveAndRender();
    }
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    const newText = prompt("Edit your task:", task.text);
    
    if (newText !== null && newText.trim() !== "") {
        task.text = newText.trim();
        saveAndRender();
    }
}

function saveAndRender() {
    localStorage.setItem('myChecklistTasks', JSON.stringify(tasks));
    renderTasks();
}

function getIcon(cat) {
    switch(cat) {
        case 'work': return 'fa-briefcase';
        case 'school': return 'fa-graduation-cap';
        case 'rec': return 'fa-gamepad';
        case 'home': return 'fa-house';
        default: return 'fa-list';
    }
}

function renderTasks() {
    const list = document.getElementById('taskList');
    const selectedDate = datePicker.value;
    list.innerHTML = '';

    // Filter tasks for the selected date
    const filteredTasks = tasks.filter(t => t.date === selectedDate);

    if (filteredTasks.length === 0) {
        list.innerHTML = `
            <li style="text-align:center; color:#b2bec3; margin-top:30px; display:flex; flex-direction:column; align-items:center;">
                <i class="fa-solid fa-mug-hot" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.5;"></i>
                No tasks for this date.
            </li>`;
        return;
    }

    filteredTasks.sort((a, b) => a.completed - b.completed);

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.setAttribute('data-cat', task.category);
        
        li.innerHTML = `
            <div class="task-content">
                <div class="check-btn" onclick="toggleComplete(${task.id})">
                    ${task.completed ? '<i class="fa-solid fa-check"></i>' : ''}
                </div>
                <span class="task-text">${task.text}</span>
            </div>
            <div class="actions">
                <button class="btn-icon edit-btn" onclick="editTask(${task.id})">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn-icon del-btn" onclick="deleteTask(${task.id})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;
        list.appendChild(li);
    });
}


renderTasks();

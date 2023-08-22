document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.querySelector('.task');
  const descriptionInput = document.querySelector('.description');
  const addButton = document.querySelector('.custom-btn');
  const taskList = document.getElementById('taskList');

  // Fetch tasks from JSON Server
  async function fetchTasks() {
    const response = await fetch('http://localhost:3000/tasks');
    const tasks = await response.json();
    return tasks;
  }

  // Display tasks on the page
  async function displayTasks() {
    taskList.innerHTML = '';

    const tasks = await fetchTasks();

    tasks.forEach(task => {
      const taskItem = document.createElement('li');
      taskItem.innerHTML = `
        <label class="task-label">
          <input type="checkbox" class="complete-checkbox" ${task.completed ? 'checked' : ''}>
          <span class="task-title ${task.completed ? 'completed' : ''}">${task.title}: ${task.description}</span>
        </label>
        <button class="edit-btn">Editar</button>
        <button class="delete-btn">Eliminar</button>
      `;

      const completeCheckbox = taskItem.querySelector('.complete-checkbox');
      completeCheckbox.addEventListener('change', () => completeTask);

      const editButton = taskItem.querySelector('.edit-btn');
      editButton.addEventListener('click', () => editTask(task.id, task.title, task.description));

      const deleteButton = taskItem.querySelector('.delete-btn');
      deleteButton.addEventListener('click', () => deleteTask(task.id));

      taskList.appendChild(taskItem);
    });
  }

  // Añadir nueva tarea
  async function addTask() {
    const newTask = {
      title: taskInput.value,
      description: descriptionInput.value,
      completed: false
    };

    await fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    });

    taskInput.value = '';
    descriptionInput.value = '';
    displayTasks();
  }

  // Tarea completada
  async function completeTask(taskId, completed) {
    const task = await fetch(`http://localhost:3000/tasks/${taskId}`);
    const updatedTask = {
      ...task,
      completed: completed
    };

    await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    });

    displayTasks();
  }

  // Editar tarea
  async function editTask(taskId, currentTitle, currentDescription) {
    const newTitle = prompt('Enter the new title:', currentTitle);
    const newDescription = prompt('Enter the new description:', currentDescription);

    if (newTitle !== null && newDescription !== null) {
      const updatedTask = {
        title: newTitle,
        description: newDescription
      };

      await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      displayTasks();
    }
  }
  

  // Borrar una tarea
  async function deleteTask(taskId) {
    await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: 'DELETE',
    });

    displayTasks();
  }

  

  // Event listener botón añadir
  addButton.addEventListener('click', addTask);

  // Visualizar tareas
  displayTasks();
});

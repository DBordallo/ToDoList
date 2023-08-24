// Esperar a que se cargue el contenido del documento antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {

  // Obtener referencias a elementos del DOM
  const taskInput = document.querySelector('.task');
  const descriptionInput = document.querySelector('.description');
  const addButton = document.querySelector('.custom-btn');
  const taskList = document.getElementById('taskList');

  // Función para obtener las tareas desde el servidor JSON
  async function fetchTasks() {
    const response = await fetch('http://localhost:3000/tasks');
    const tasks = await response.json();
    return tasks;
  }

  // Función para mostrar las tareas en el documento
  async function displayTasks() {
    taskList.innerHTML = '';  // limpiar antes de actualizar

  // Obtener las tareas desde el servidor
    const tasks = await fetchTasks();

  // Iterar sobre cada tarea y crear elementos HTML para mostrarlas
    tasks.forEach(task => {
      const taskItem = document.createElement('li');
      taskItem.innerHTML = `
      <label class="task-label">
      <input type="checkbox" class="complete-checkbox" ${task.completed ? 'checked' : ''}>
      <span class="task-title ${task.completed ? 'completed' : ''}">${task.title}: ${task.description}</span>
    </label>
    <div class="btns">
    <button class="edit-btn">Editar</button>
    <button class="delete-btn">Eliminar</button>
    </div>
      `;
      
  // Obtener referencias a elementos dentro del li
      // Checkbox
      const completeCheckbox = taskItem.querySelector('.complete-checkbox');  
      completeCheckbox.addEventListener('change', () => completeTask(task.id, completeCheckbox.checked));
      
      const localStorageState = localStorage.getItem(`task_${task.id}`);
    if (localStorageState === 'completed') {
      completeCheckbox.checked = true;
    }
      // Editar
      const editButton = taskItem.querySelector('.edit-btn');
      editButton.addEventListener('click', () => editTask(task.id, task.title, task.description));

      // Borrar
      const deleteButton = taskItem.querySelector('.delete-btn');
      deleteButton.addEventListener('click', () => deleteTask(task.id));

      // Agregar el elemento li con la tarea a la lista de tareas
      taskList.appendChild(taskItem);
    });
  }

  // Función para agregar una nueva tarea
  async function addTask() {
    const newTask = {
      title: taskInput.value,
      description: descriptionInput.value,
      completed: false
    };

    // Enviar la nueva tarea al servidor
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

  // Función para marcar una tarea como completada
  async function completeTask(taskId, completed) {
    const taskResponse = await fetch(`http://localhost:3000/tasks/${taskId}`);
    const task = await taskResponse.json();

    // Actualizar el estado de completado en la tarea y enviarla de vuelta al servidor
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

    // Actualizar el estado de completado en el almacenamiento local y mostrar las tareas actualizadas
    localStorage.setItem(`task_${taskId}`, completed ? 'completed' : 'incomplete');

    displayTasks();
  }

  // Función para editar una tarea
  async function editTask(taskId, currentTitle, currentDescription) {
    // Solicitar un nuevo título y descripción para la tarea
    const newTitle = prompt('Nueva tarea:', currentTitle);
    const newDescription = prompt('Nueva descripción:', currentDescription);

    // Si se proporcionaron nuevos valores, actualizar la tarea en el servidor
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
  

  // Función para eliminar una tarea
  async function deleteTask(taskId) {
    // Enviar solicitud al servidor para eliminar la tarea
    await fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: 'DELETE',
    });
    // Mostrar las tareas actualizadas
    displayTasks();
  }

  addButton.addEventListener('click', addTask);

  // Visualizar tareas
  displayTasks();
});

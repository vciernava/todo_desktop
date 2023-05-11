const { invoke } = window.__TAURI__.tauri;

const BASE_URL = "http://localhost:8080";

function toggle_task(id) {
  fetch(`${BASE_URL}/task/${id}`, { method: "PATCH" })
    .then((response) => response.json())
    .then((res) => {
      console.log(`rows affected: ${res.rows_affected}`);
      const task_item = document.getElementById(id);
      task_item.classList.toggle("completed");
      task_item.lastElementChild.toggleAttribute("disabled");
    });
}

function delete_task(id) {
  fetch(`${BASE_URL}/task/${id}`, { method: "DELETE" })
    .then((response) => response.json())
    .then((res) => {
      console.log(`rows affected: ${res.rows_affected}`);
      let elm = document.getElementById(id);
      elm.remove();
    });
}

function add_task(title) {
  console.log(`adding task: ${title}`);
  fetch(`${BASE_URL}/task/${title}`, { method: "POST" })
    .then((response) => response.json())
    .then((task) => {
      const task_list = document.getElementById("task-list");
      task_list.appendChild(construct_task(task));
      if(task_list.children.length === 10) {
        let new_task_btn = document.getElementById("new-task-btn");
        new_task_btn.setAttribute("disabled", "disabled");
      }
    });
}

function construct_task(task) {
  var input = document.createElement('input');
  input.type = "checkbox";
  input.classList.add("form-check-input");
  input.classList.add("flex-shrink-0");
  input.checked = task.completed;

  input.onclick = (e) => {
    toggle_task(task.id)
  }

  var label = document.createElement('label');
  label.innerHTML = task.title;

  var button = document.createElement('button');
  button.innerHTML = "Delete";
  button.classList.add("btn");
  button.classList.add("btn-danger");
  button.classList.add("ms-auto");
  button.setAttribute("disabled", "disabled");

  button.onclick = (e) => {
    delete_task(task.id)
  }

  var task_item = document.createElement('li');
  task_item.classList.add("list-group-item");
  task_item.classList.add("d-flex");
  task_item.classList.add("gap-5");
  task_item.classList.add("align-items-center");
  task_item.classList.add("justify-content-start");
  if (task.completed) {
    task_item.classList.add("completed");
    task_item.lastElementChild.removeAttribute("disabled");
  }
  task_item.id = task.id;
  task_item.appendChild(input);
  task_item.appendChild(label);
  task_item.appendChild(button);

  return task_item;
}

window.addEventListener("DOMContentLoaded", () => {
  window.__APP_STATE__ = {
    tasks: []
  };

  let new_task_input = document.getElementById("new-task-input");
  let new_task_btn = document.getElementById("new-task-btn");
  new_task_btn.onclick = (e) => {
    add_task(new_task_input.value)
    new_task_input.value = "";
  }
  new_task_input.onkeyup = (e) => {
    if(e.code === "Enter") {
      add_task(new_task_input.value)
      new_task_input.value = "";
    }
  }

  const task_list = document.getElementById("task-list");

  fetch(`${BASE_URL}/tasks`)
    .then((response) => response.json())
    .then((tasks) => {
      tasks.forEach((task) => {
        task_list.appendChild(construct_task(task));
      });
      console.log(tasks);
    });
});
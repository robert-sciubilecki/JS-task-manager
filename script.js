"use strict";

const dateDisplay = document.querySelectorAll(".date-heading");
const taskManager = document.querySelector(".task-manager");
const modalWindow = document.querySelector(".modal-window");
const configWindow = document.querySelector(".config-window");
const overlay = document.querySelector(".overlay");
const closeModalBtn = document.querySelectorAll(".close-modal");
const btnModal = document.querySelectorAll(".btn-modal");
const addBtn = document.querySelector(".add-btn");
const configBtn = document.querySelector(".config");
const deleteBtn = document.querySelector(".delete-btn");
///// FORM SELECTORS
const taskInput = document.querySelector("#task-input");
const priority = document.querySelector("#priority");
const duration = document.querySelector("#duration");

function showDate() {
  const today = new Date();
  const week = [];
  for (let i = 0; i < 6; i++) {
    week.push(today.setDate(today.getDate() + 1));
  }

  dateDisplay.forEach(function (day) {
    const weekDay = week[day.dataset["day"]];
    const date = new Date(weekDay);
    const dateToDisplay = new Intl.DateTimeFormat(navigator.language).format(
      date
    );
    day.textContent = dateToDisplay;
  });
}

function showModal(target) {
  target.classList.remove("display-none");
  overlay.classList.remove("display-none");
  setTimeout(() => {
    target.classList.remove("hidden");
    overlay.classList.remove("hidden");
  }, 10);
}

function hideModal(target) {
  target.classList.add("hidden");
  overlay.classList.add("hidden");
  setTimeout(() => {
    target.classList.add("display-none");
    overlay.classList.add("display-none");
  }, 300);
}

taskManager.addEventListener("click", function (e) {
  const btn = e.target.closest("button");
  modalWindow.dataset.weekDay = e.target
    .closest(".day")
    .querySelector("h2").dataset.day;
  if (!btn) return;
  showModal(modalWindow);
});

[...btnModal, ...closeModalBtn].forEach((el) =>
  el.addEventListener("click", function (e) {
    console.log(e.target.closest(".modal-window"));
    hideModal(e.target.closest(".modal-window"));
  })
);

configBtn.addEventListener("click", function (e) {
  showModal(configWindow);
});

showDate();

// CLASSES ////////////////////////////////////////////////////////////////////////

class App {
  #daysList = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  };

  constructor() {
    this._getLocalStorage();
    this._displayManager();
    addBtn.addEventListener("click", this._createTask.bind(this));
    deleteBtn.addEventListener("click", this._deleteData);
  }

  _displayManager() {
    for (let i = 0; i < 5; i++) {
      if (this.#daysList[i]) {
        this.#daysList[i].forEach((task) => this._displayTask(task));
      }
    }
  }

  _displayTask(task) {
    const html = `
      <div class="task ${task.priority} ${task.duration}">
        <span class="task-description">${task.name}</span>
      </div>
    `;
    document
      .querySelector(`.day-${task.weekDay}`)
      .querySelector(".tasks")
      .insertAdjacentHTML("beforeend", html);
    const newlyCreatedElement = document.querySelector(
      `.day-${task.weekDay} .tasks .task:last-child`
    );
    setTimeout(() => newlyCreatedElement.classList.add("fade-in"), 3);
  }

  _createTask(e) {
    e.preventDefault();
    hideModal(modalWindow);
    const task = new Task(
      taskInput.value,
      priority.value,
      duration.value,
      modalWindow.dataset.weekDay
    );

    this._displayTask(task);

    this.#daysList[task.weekDay].push(task);
    this._setLocalStorage();
    console.log(this.#daysList);
  }

  _setLocalStorage() {
    console.log(this.#daysList);
    localStorage.setItem("daysList", JSON.stringify(this.#daysList));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("daysList"));
    this.#daysList = data || this.#daysList;
  }

  _deleteData() {
    localStorage.removeItem("daysList");
  }
}

class Task {
  id = (new Date().getTime() + "").slice(-5);
  constructor(name = "Empty", priority, duration, weekDay) {
    this.name = name;
    this.priority = priority;
    this.duration = duration;
    this.weekDay = weekDay;
  }
}

const app = new App();

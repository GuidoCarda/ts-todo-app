"use strict";
const form = document.querySelector("form");
const input = document.querySelector("input");
const todoBtn = document.querySelector("#todo-btn");
const todosList = document.querySelector(".todos");
let todos = getTodos();
let editingTodoId = null;
form === null || form === void 0 ? void 0 : form.addEventListener("submit", handleSubmit);
renderTodos();
function handleSubmit(e) {
    e.preventDefault();
    const value = input === null || input === void 0 ? void 0 : input.value.trim();
    if (!value) {
        alert("empty field");
        input === null || input === void 0 ? void 0 : input.focus();
        return;
    }
    if (editingTodoId !== null) {
        todos = todos.map((todo) => todo.id === editingTodoId ? Object.assign(Object.assign({}, todo), { title: value }) : todo);
        editingTodoId = null;
        if (todoBtn) {
            todoBtn.textContent = "add";
        }
    }
    else {
        addTodo(value);
    }
    setTodos(todos);
    renderTodos();
    if (input) {
        input.value = "";
    }
}
function addTodo(title) {
    const newTodo = {
        id: getRandomId(),
        title,
        done: false,
    };
    todos = [...todos, newTodo];
}
function editTodo(id) {
    if (editingTodoId) {
        return alert("already editing a todo");
    }
    const todo = todos.find((todo) => todo.id === id);
    if (todo && input) {
        if (todoBtn)
            todoBtn.textContent = "save";
        input.value = todo.title;
        input === null || input === void 0 ? void 0 : input.focus();
        editingTodoId = id;
    }
    else {
        alert("algo salio mal");
    }
}
function deleteTodo(id) {
    if (editingTodoId)
        return alert("you can delete todos while editing one");
    todos = todos.filter((todo) => todo.id !== id);
    renderTodos();
}
function renderTodos() {
    if (todosList === null || todosList === void 0 ? void 0 : todosList.hasChildNodes())
        todosList.innerHTML = "";
    todos.forEach(({ id, title }) => {
        const todoItem = document.createElement("li");
        todoItem.classList.add("todo");
        todoItem.textContent = title;
        todosList === null || todosList === void 0 ? void 0 : todosList.appendChild(todoItem);
        const actionsWrapper = document.createElement("div");
        const deleteBtn = createButton("delete", () => deleteTodo(id));
        const editBtn = createButton("edit", () => editTodo(id));
        actionsWrapper.append(editBtn, deleteBtn);
        actionsWrapper.classList.add("todo-actions");
        todoItem.appendChild(actionsWrapper);
    });
}
function createButton(label, onClick) {
    const button = document.createElement("button");
    button.textContent = label;
    button.addEventListener("click", onClick);
    return button;
}
// function createButton<T extends (...args: any[]) => void>(
//   label: string,
//   onClick: T
// ): HTMLButtonElement {
//   const button = document.createElement("button");
//   button.textContent = label;
//   button.addEventListener("click", onClick);
//   return button;
// }
function getRandomId(length = 10) {
    return Math.random()
        .toString(36)
        .substring(2, length + 2);
}
function getTodos() {
    const todos = localStorage.getItem("todos");
    return todos ? JSON.parse(todos) : [];
}
function setTodos(value) {
    localStorage.setItem("todos", JSON.stringify(value));
}
//# sourceMappingURL=index.js.map
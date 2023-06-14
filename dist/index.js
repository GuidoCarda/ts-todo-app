"use strict";
const form = document.querySelector("form");
const todoInput = document.querySelector("#todo-field");
const todoInputLimitEl = document.querySelector(".input-limit");
const todoBtn = document.querySelector("#todo-btn");
const todosList = document.querySelector(".todos");
const TODOS_LIMIT = 5;
let todos = getTodos();
let editingTodoId = null;
form === null || form === void 0 ? void 0 : form.addEventListener("submit", handleSubmit);
todoInput === null || todoInput === void 0 ? void 0 : todoInput.addEventListener("keyup", handleInputKeyDown);
todosList === null || todosList === void 0 ? void 0 : todosList.addEventListener("click", handleTodoToggle);
document.title = `${todos.length} remaining`;
renderTodos();
function handleSubmit(e) {
    e.preventDefault();
    const value = todoInput === null || todoInput === void 0 ? void 0 : todoInput.value.trim();
    if (!value) {
        alert("empty field");
        todoInput === null || todoInput === void 0 ? void 0 : todoInput.focus();
        return;
    }
    if (value.length > 40) {
        return alert("The title is too long");
    }
    if (editingTodoId !== null) {
        todos = todos.map((todo) => todo.id === editingTodoId ? Object.assign(Object.assign({}, todo), { title: value }) : todo);
        editingTodoId = null;
        if (todoBtn) {
            todoBtn.textContent = "add";
        }
    }
    else {
        if (todos.length >= TODOS_LIMIT) {
            alert("Todo's limit reached");
            clearInput();
            return;
        }
        addTodo(value);
    }
    setTodos(todos);
    renderTodos();
    clearInput();
}
function handleInputKeyDown(e) {
    var _a;
    const titleLength = (_a = e.target) === null || _a === void 0 ? void 0 : _a.value.length;
    if (todoInputLimitEl) {
        todoInputLimitEl.textContent = `${titleLength}/40`;
        if (titleLength > 40) {
            todoInputLimitEl.classList.add("error");
        }
        else {
            todoInputLimitEl.classList.remove("error");
        }
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
function updateTodoState(id) {
    todos = todos.map((todo) => todo.id === id ? Object.assign(Object.assign({}, todo), { done: !todo.done }) : todo);
    renderTodos();
    setTodos(todos);
}
function handleTodoToggle(e) {
    var _a;
    const target = e.target;
    if (target) {
        const id = (_a = target === null || target === void 0 ? void 0 : target.id) === null || _a === void 0 ? void 0 : _a.split("-")[1];
        if (id) {
            updateTodoState(id);
        }
    }
}
function clearInput() {
    if (todoInput) {
        todoInput.value = "";
    }
    if (todoInputLimitEl) {
        todoInputLimitEl.textContent = `0/40`;
    }
}
function editTodo(id) {
    if (editingTodoId) {
        return alert("already editing a todo");
    }
    const todo = todos.find((todo) => todo.id === id);
    if (todo && todoInput) {
        if (todoBtn)
            todoBtn.textContent = "save";
        todoInput.value = todo.title;
        if (todoInputLimitEl)
            todoInputLimitEl.textContent = `${todo.title.length}/40`;
        todoInput === null || todoInput === void 0 ? void 0 : todoInput.focus();
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
    setTodos(todos);
    renderTodos();
}
function renderTodos() {
    if (todosList === null || todosList === void 0 ? void 0 : todosList.hasChildNodes())
        todosList.innerHTML = "";
    document.title = `${todos.length} remaining`;
    todos.forEach(({ id, title, done }) => {
        const todoItem = document.createElement("li");
        todoItem.classList.add("todo");
        todoItem.className = `todo ${done ? "completed" : ""}`;
        todoItem.textContent = title;
        todoItem.id = `todo-${id}`;
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
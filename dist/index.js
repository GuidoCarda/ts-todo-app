"use strict";
const form = document.querySelector("form");
const input = document.querySelector("input");
const todosList = document.querySelector(".todos");
const TODOS = [];
let prevId = 0;
form === null || form === void 0 ? void 0 : form.addEventListener("submit", handleSubmit);
renderTodos(TODOS);
function handleSubmit(e) {
    e.preventDefault();
    const title = input === null || input === void 0 ? void 0 : input.value.trim();
    if (!title) {
        return alert("empty todo field");
    }
    const newTodo = {
        id: prevId++,
        title,
        done: false,
    };
    TODOS.push(newTodo);
    if (input) {
        input.value = "";
    }
    renderTodos(TODOS);
}
function deleteTodo() { }
function editTodo(id) {
    console.log(`Edit todo ${id}`);
}
function renderTodos(todos) {
    if (todosList === null || todosList === void 0 ? void 0 : todosList.hasChildNodes()) {
        todosList.innerHTML = "";
    }
    todos.forEach(({ title, id }) => {
        const li = document.createElement("li");
        li.textContent = title;
        const editBtn = document.createElement("button");
        editBtn.textContent = "edit todo";
        editBtn.addEventListener("click", () => editTodo(id));
        li.appendChild(editBtn);
        todosList === null || todosList === void 0 ? void 0 : todosList.appendChild(li);
    });
}
//# sourceMappingURL=index.js.map
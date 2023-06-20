"use strict";
const form = document.querySelector("form");
const todoInput = document.querySelector("#todo-field");
const todoInputLimitEl = document.querySelector(".input-limit");
const todoBtn = document.querySelector("#todo-btn");
const todosList = document.querySelector(".todos");
const filterContainer = document.querySelector(".filter-container");
const TODOS_LIMIT = 5;
let todos = getTodos();
let editingTodoId = null;
form === null || form === void 0 ? void 0 : form.addEventListener("submit", handleSubmit);
todoInput === null || todoInput === void 0 ? void 0 : todoInput.addEventListener("keyup", handleInputKeyDown);
todosList === null || todosList === void 0 ? void 0 : todosList.addEventListener("click", handleTodoToggle);
document.title = `${todos.length} remaining`;
renderTodos(todos);
renderFilters();
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
    renderTodos(todos);
    renderFilters();
    clearInput();
    console.log(todos);
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
        createdAt: new Date(),
    };
    todos = [...todos, newTodo];
}
function updateTodoState(id) {
    todos = todos.map((todo) => todo.id === id ? Object.assign(Object.assign({}, todo), { done: !todo.done }) : todo);
    renderTodos(todos);
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
    renderTodos(todos);
    renderFilters();
}
function handleFilterChange(e) {
    var _a;
    const selectedFilter = (_a = e.target) === null || _a === void 0 ? void 0 : _a.value;
    console.log(selectedFilter);
    if (selectedFilter) {
        let filteredTodos = filterTodos(selectedFilter);
        console.log(filteredTodos);
        renderTodos(filteredTodos);
    }
}
function filterTodos(criteria) {
    if (criteria === "completed") {
        return todos.filter((todo) => todo.done);
    }
    else if (criteria === "pending") {
        return todos.filter((todo) => !todo.done);
    }
    return todos;
}
function renderFilters() {
    var _a;
    //TODO: Refactor thiiiz sheet :D
    if (todos.length < 2) {
        if (filterContainer === null || filterContainer === void 0 ? void 0 : filterContainer.hasChildNodes()) {
            return (_a = document.querySelector("#filters")) === null || _a === void 0 ? void 0 : _a.remove();
        }
    }
    else {
        if (filterContainer === null || filterContainer === void 0 ? void 0 : filterContainer.hasChildNodes())
            return;
        const filters = ["all", "completed", "pending"];
        const filtersSelect = document.createElement("select");
        filtersSelect.id = "filters";
        filters.forEach((filter) => {
            const option = document.createElement("option");
            option.textContent = filter;
            option.value = filter;
            filtersSelect.appendChild(option);
        });
        filtersSelect.addEventListener("change", handleFilterChange);
        filterContainer === null || filterContainer === void 0 ? void 0 : filterContainer.appendChild(filtersSelect);
    }
}
function renderTodos(filteredTodos) {
    if (todosList === null || todosList === void 0 ? void 0 : todosList.hasChildNodes())
        todosList.innerHTML = "";
    document.title = `${todos.length} remaining`;
    filteredTodos.forEach(({ id, title, done, createdAt }) => {
        const todoItem = document.createElement("li");
        todoItem.classList.add("todo");
        todoItem.className = `todo ${done ? "completed" : ""}`;
        todoItem.textContent = title;
        todoItem.id = `todo-${id}`;
        todoItem.draggable = true;
        todosList === null || todosList === void 0 ? void 0 : todosList.appendChild(todoItem);
        todoItem.addEventListener("dragstart", (e) => {
            var _a, _b;
            (e === null || e === void 0 ? void 0 : e.currentTarget).classList.add("dragging");
            (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.clearData();
            (_b = e.dataTransfer) === null || _b === void 0 ? void 0 : _b.setData("text/plain", todoItem.id);
        });
        todoItem.addEventListener("dragend", (e) => {
            e.currentTarget.classList.remove("dragging");
        });
        //needed to allow the drop event to occurr and be listened
        todoItem.addEventListener("dragover", (e) => {
            // console.log("dragover");
            e.preventDefault();
        });
        // todosList?.addEventListener("dragover", handleSortableTodos);
        // todoItem.addEventListener("drop", (e) => {
        //   console.log("drop");
        //   e.preventDefault();
        //   const data = e.dataTransfer?.getData("text") || "";
        //   const source = document.getElementById(data);
        //   //@ts-ignore
        //   if (e.target.classList.contains("todo")) {
        //     console.log("entro");
        //     //@ts-ignore
        //     e?.target?.after(source);
        //   } else {
        //     //@ts-ignore
        //     e?.target?.parentNode?.after(source);
        //   }
        // });
        todoItem.addEventListener("drop", (e) => {
            var _a;
            console.log("drop");
            // e.preventDefault();
            const data = ((_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData("text")) || "";
            const draggedItem = document.getElementById(data);
            const siblings = [
                ...((todosList === null || todosList === void 0 ? void 0 : todosList.querySelectorAll(".todo:not(.dragging)")) || []),
            ];
            let nextSibling = siblings.find((sibling) => {
                const siblingElemement = sibling;
                return (e.clientY <=
                    siblingElemement.offsetTop + siblingElemement.offsetHeight / 2);
            });
            todos = sortTodos(draggedItem.id.split("-")[1], nextSibling === null || nextSibling === void 0 ? void 0 : nextSibling.id.split("-")[1]);
            setTodos(todos);
            todosList === null || todosList === void 0 ? void 0 : todosList.insertBefore(draggedItem, nextSibling);
        });
        const creationDateSpan = document.createElement("span");
        creationDateSpan.textContent = getFormattedDate(createdAt);
        const actionsWrapper = document.createElement("div");
        const deleteBtn = createButton("delete", () => deleteTodo(id));
        const editBtn = createButton("edit", () => editTodo(id));
        actionsWrapper.append(editBtn, deleteBtn);
        actionsWrapper.classList.add("todo-actions");
        todoItem.append(creationDateSpan);
        todoItem.appendChild(actionsWrapper);
    });
    const hasIncompletedTodos = filteredTodos.some((todo) => !todo.done);
    if (todosList === null || todosList === void 0 ? void 0 : todosList.nextElementSibling) {
        todosList === null || todosList === void 0 ? void 0 : todosList.nextElementSibling.remove();
    }
    if (filteredTodos.length > 1 && hasIncompletedTodos) {
        const button = createButton("Mark all as completed", completeAll);
        button.classList.add("complete-all-btn");
        todosList === null || todosList === void 0 ? void 0 : todosList.after(button);
    }
}
//TODO: is there any better way to implement this?
function sortTodos(draggedTodoId, nextId) {
    let todosCopy = [...todos];
    const draggedTodoIndex = todos.findIndex((todo) => todo.id === draggedTodoId);
    const [draggedTodo] = todosCopy.splice(draggedTodoIndex, 1);
    if (!nextId) {
        //this means that it was dragged to the end
        todosCopy = [...todosCopy, draggedTodo];
    }
    else {
        const nextTodoIndex = todosCopy.findIndex((todo) => todo.id === nextId);
        todosCopy = [
            ...todosCopy.splice(0, nextTodoIndex - 1),
            draggedTodo,
            ...todosCopy.splice(0),
        ];
    }
    return todosCopy;
}
function handleSortableTodos(e) {
    e.preventDefault();
    const draggingItem = document.querySelector(".dragging");
    console.log(draggingItem.id.split("-")[1]);
    const siblings = [
        ...((todosList === null || todosList === void 0 ? void 0 : todosList.querySelectorAll(".todo:not(.dragging)")) || []),
    ];
    let nextSibling = siblings.find((sibling) => {
        const siblingElemement = sibling;
        return (e.clientY <=
            siblingElemement.offsetTop + siblingElemement.offsetHeight / 2);
    });
    todosList === null || todosList === void 0 ? void 0 : todosList.insertBefore(draggingItem, nextSibling);
}
function getFormattedDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
        day: "2-digit",
        year: "numeric",
        month: "long",
        weekday: "short",
    });
}
function completeAll() {
    todos = todos.map((todo) => (!todo.done ? Object.assign(Object.assign({}, todo), { done: true }) : todo));
    renderTodos(todos);
    setTodos(todos);
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
// Drag and drop feature
//# sourceMappingURL=index.js.map
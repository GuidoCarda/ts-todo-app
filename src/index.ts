const form: HTMLFormElement | null = document.querySelector("form");
const todoInput: HTMLInputElement | null =
  document.querySelector("#todo-field");
const todoInputLimitEl: HTMLSpanElement | null =
  document.querySelector(".input-limit");
const todoBtn: HTMLButtonElement | null = document.querySelector("#todo-btn");
const todosList: HTMLUListElement | null = document.querySelector(".todos");
const filterContainer: HTMLDivElement | null =
  document.querySelector(".filter-container");

const todosActionsEl = document.querySelector(".todos-actions");

type Todo = {
  id: string;
  title: string;
  done: boolean;
  createdAt: Date | string;
};

const TODOS_LIMIT = 5;
let todos: Todo[] = getTodos();
let editingTodoId: string | null = null;

form?.addEventListener("submit", handleSubmit);
todoInput?.addEventListener("keyup", handleInputKeyDown);
todosList?.addEventListener("click", handleTodoToggle);

document.title = `${todos.length} remaining`;
renderTodos(todos);
renderFilters();

function handleSubmit(e: SubmitEvent) {
  e.preventDefault();

  const value = todoInput?.value.trim();

  if (!value) {
    alert("empty field");
    todoInput?.focus();
    return;
  }

  if (value.length > 40) {
    return alert("The title is too long");
  }

  if (editingTodoId !== null) {
    todos = todos.map((todo) =>
      todo.id === editingTodoId ? { ...todo, title: value } : todo
    );
    editingTodoId = null;
    if (todoBtn) {
      todoBtn.textContent = "add";
    }
  } else {
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

function handleInputKeyDown(e: KeyboardEvent) {
  const titleLength = (e.target as HTMLInputElement)?.value.length;
  if (todoInputLimitEl) {
    todoInputLimitEl.textContent = `${titleLength}/40`;

    if (titleLength > 40) {
      todoInputLimitEl.classList.add("error");
    } else {
      todoInputLimitEl.classList.remove("error");
    }
  }
}

function addTodo(title: string) {
  const newTodo = {
    id: getRandomId(),
    title,
    done: false,
    createdAt: new Date(),
  };
  todos = [...todos, newTodo];
}

function updateTodoState(id: string) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, done: !todo.done } : todo
  );
  renderTodos(todos);
  setTodos(todos);
}

function handleTodoToggle(e: MouseEvent) {
  const target = e.target as Element;
  if (target) {
    const id = target?.id?.split("-")[1];
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

function editTodo(id: string) {
  if (editingTodoId) {
    return alert("already editing a todo");
  }

  const todo = todos.find((todo) => todo.id === id);

  if (todo && todoInput) {
    if (todoBtn) todoBtn.textContent = "save";
    todoInput.value = todo.title;
    if (todoInputLimitEl)
      todoInputLimitEl.textContent = `${todo.title.length}/40`;
    todoInput?.focus();
    editingTodoId = id;
  } else {
    alert("algo salio mal");
  }
}

function deleteTodo(id: string) {
  if (editingTodoId) return alert("you can delete todos while editing one");
  todos = todos.filter((todo) => todo.id !== id);
  setTodos(todos);
  renderTodos(todos);
  renderFilters();
}

function handleFilterChange(e: Event) {
  const selectedFilter = (e.target as HTMLSelectElement)?.value;

  console.log(selectedFilter);
  if (selectedFilter) {
    let filteredTodos = filterTodos(selectedFilter);
    console.log(filteredTodos);
    renderTodos(filteredTodos);
  }
}

function filterTodos(criteria: string): Todo[] {
  if (criteria === "completed") {
    return todos.filter((todo) => todo.done);
  } else if (criteria === "pending") {
    return todos.filter((todo) => !todo.done);
  }
  return todos;
}

function renderFilters() {
  //TODO: Refactor thiiiz sheet :D
  if (todos.length < 2) {
    if (filterContainer?.hasChildNodes()) {
      return document.querySelector("#filters")?.remove();
    }
  } else {
    if (filterContainer?.hasChildNodes()) return;
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

    filterContainer?.appendChild(filtersSelect);
  }
}

function renderTodos(filteredTodos: Todo[]) {
  if (todosList?.hasChildNodes()) todosList.innerHTML = "";
  document.title = `${todos.length} remaining`;

  filteredTodos.forEach(({ id, title, done, createdAt }) => {
    const todoItem = document.createElement("li");
    todoItem.classList.add("todo");
    todoItem.className = `todo ${done ? "completed" : ""}`;
    todoItem.textContent = title;
    todoItem.id = `todo-${id}`;
    todoItem.draggable = true;
    todosList?.appendChild(todoItem);

    todoItem.addEventListener("dragstart", (e) => {
      if (editingTodoId) {
        return alert("sorting while editing is not posible");
      }
      (e?.currentTarget as HTMLElement).classList.add("dragging");
      e.dataTransfer?.clearData();
      e.dataTransfer?.setData("text/plain", todoItem.id);
    });

    todoItem.addEventListener("dragend", (e) => {
      (e.currentTarget as HTMLElement).classList.remove("dragging");
    });

    //needed to allow the drop event to occurr and be listened
    todoItem.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    todoItem.addEventListener("drop", (e) => {
      console.log("drop");

      const data = e.dataTransfer?.getData("text") || "";
      const draggedItem = document.getElementById(data) as HTMLElement;

      const siblings = [
        ...(todosList?.querySelectorAll(".todo:not(.dragging)") || []),
      ];

      let nextSibling = siblings.find((sibling) => {
        const siblingElemement = sibling as HTMLElement;
        return (
          e.clientY <=
          siblingElemement.offsetTop + siblingElemement.offsetHeight / 2
        );
      }) as Element;

      todos = sortTodos(
        draggedItem.id.split("-")[1],
        nextSibling?.id.split("-")[1]
      );
      setTodos(todos);
      todosList?.insertBefore(draggedItem, nextSibling);
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

  if (todosActionsEl?.hasChildNodes()) {
    todosActionsEl.innerHTML = "";
  }

  if (filteredTodos.length > 1 && hasIncompletedTodos) {
    const button = createButton("Mark all as completed", completeAll);
    button.classList.add("complete-all-btn");
    todosActionsEl?.append(button);
  }

  if (todos.some((todo) => todo.done)) {
    const button = createButton("Clear all completed", clearCompletedTodos);
    button.classList.add("remove-completed-btn");
    todosActionsEl?.append(button);
  }
}

// TODO: is there any better way to implement this?
function sortTodos(draggedTodoId: string, nextId: string | undefined) {
  let todosCopy = [...todos];

  const draggedTodoIndex = todos.findIndex((todo) => todo.id === draggedTodoId);
  const [draggedTodo] = todosCopy.splice(draggedTodoIndex, 1);

  if (!nextId) {
    //this means that it was dragged to the end
    todosCopy = [...todosCopy, draggedTodo];
  } else {
    const nextTodoIndex = todosCopy.findIndex((todo) => todo.id === nextId);

    todosCopy = [
      ...todosCopy.splice(0, nextTodoIndex - 1),
      draggedTodo,
      ...todosCopy.splice(0),
    ];
  }

  return todosCopy;
}

function handleSortableTodos(e: DragEvent) {
  e.preventDefault();
  const draggingItem = document.querySelector(".dragging") as HTMLElement;

  const siblings = [
    ...(todosList?.querySelectorAll(".todo:not(.dragging)") || []),
  ];

  let nextSibling = siblings.find((sibling) => {
    const siblingElemement = sibling as HTMLElement;
    return (
      e.clientY <=
      siblingElemement.offsetTop + siblingElemement.offsetHeight / 2
    );
  }) as Element;

  todosList?.insertBefore(draggingItem, nextSibling);
}

function getFormattedDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    year: "numeric",
    month: "long",
    weekday: "short",
  });
}

function completeAll() {
  todos = todos.map((todo) => (!todo.done ? { ...todo, done: true } : todo));
  renderTodos(todos);
  setTodos(todos);
}

function clearCompletedTodos() {
  todos = todos.filter((todo) => !todo.done);
  renderTodos(todos);
  setTodos(todos);
}

type ButtonClickHandler = () => void;

function createButton(label: string, onClick: ButtonClickHandler) {
  const button = document.createElement("button");
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function getRandomId(length: number = 10): string {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
}

function getTodos(): Todo[] {
  const todos = localStorage.getItem("todos");
  return todos ? JSON.parse(todos) : [];
}

function setTodos(value: Todo[]) {
  localStorage.setItem("todos", JSON.stringify(value));
}

// Drag and drop feature

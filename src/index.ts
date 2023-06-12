const form: HTMLFormElement | null = document.querySelector("form");
const input: HTMLInputElement | null = document.querySelector("input");
const todoBtn: HTMLButtonElement | null = document.querySelector("#todo-btn");
const todosList: HTMLUListElement | null = document.querySelector(".todos");

type Todo = {
  id: string;
  title: string;
  done: boolean;
};

let todos: Todo[] = getTodos();
let editingTodoId: string | null = null;

form?.addEventListener("submit", handleSubmit);

renderTodos();

function handleSubmit(e: SubmitEvent) {
  e.preventDefault();
  const value = input?.value.trim();

  if (!value) {
    alert("empty field");
    input?.focus();
    return;
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
    addTodo(value);
  }

  setTodos(todos);
  renderTodos();
  if (input) {
    input.value = "";
  }
}

function addTodo(title: string) {
  const newTodo = {
    id: getRandomId(),
    title,
    done: false,
  };
  todos = [...todos, newTodo];
}

function editTodo(id: string) {
  if (editingTodoId) {
    return alert("already editing a todo");
  }

  const todo = todos.find((todo) => todo.id === id);

  if (todo && input) {
    if (todoBtn) todoBtn.textContent = "save";
    input.value = todo.title;
    input?.focus();
    editingTodoId = id;
  } else {
    alert("algo salio mal");
  }
}

function deleteTodo(id: string) {
  if (editingTodoId) return alert("you can delete todos while editing one");
  todos = todos.filter((todo) => todo.id !== id);
  renderTodos();
}

function renderTodos() {
  if (todosList?.hasChildNodes()) todosList.innerHTML = "";

  todos.forEach(({ id, title }) => {
    const todoItem = document.createElement("li");
    todoItem.classList.add("todo");
    todoItem.textContent = title;
    todosList?.appendChild(todoItem);

    const actionsWrapper = document.createElement("div");

    const deleteBtn = createButton("delete", () => deleteTodo(id));
    const editBtn = createButton("edit", () => editTodo(id));

    actionsWrapper.append(editBtn, deleteBtn);
    actionsWrapper.classList.add("todo-actions");

    todoItem.appendChild(actionsWrapper);
  });
}

type ButtonClickHandler = () => void;

function createButton(label: string, onClick: ButtonClickHandler) {
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

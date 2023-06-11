const form: HTMLFormElement | null = document.querySelector("form");
const input: HTMLInputElement | null = document.querySelector("input");
const todosList: HTMLUListElement | null = document.querySelector(".todos");

type Todo = { id: number; title: string; done: boolean };

const TODOS: Todo[] = [];
let prevId = 0;

form?.addEventListener("submit", handleSubmit);
renderTodos(TODOS);

function handleSubmit(e: SubmitEvent): void {
  e.preventDefault();
  const title = input?.value.trim();

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

function deleteTodo() {}

function editTodo(id: number) {
  console.log(`Edit todo ${id}`);
}

function renderTodos(todos: Todo[]) {
  if (todosList?.hasChildNodes()) {
    todosList.innerHTML = "";
  }
  todos.forEach(({ title, id }) => {
    const li = document.createElement("li");
    li.textContent = title;
    const editBtn = document.createElement("button");
    editBtn.textContent = "edit todo";
    editBtn.addEventListener("click", () => editTodo(id));
    li.appendChild(editBtn);
    todosList?.appendChild(li);
  });
}

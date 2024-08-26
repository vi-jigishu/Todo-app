document.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.querySelector(".todo-input");
    const addButton = document.querySelector(".add-button");
    const todosContainer = document.querySelector(".todos");
    const filterButtons = document.querySelectorAll(".filter");
    const deleteAllButton = document.querySelector("#delete-all");
    const counter = document.querySelector(".counter-container p span");
  
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
  
    const updateTimeAndDate = () => {
      const now = new Date();
      document.getElementById("time").textContent = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      document.getElementById("date").textContent = now.toLocaleDateString(
        undefined,
        { weekday: "long", month: "long", day: "numeric" }
      );
    };
  
    setInterval(updateTimeAndDate, 1000);
  
    const renderTodos = (filter = "all") => {
      todosContainer.innerHTML = "";
      let filteredTodos;
  
      if (filter === "completed") {
        filteredTodos = todos.filter((todo) => todo.completed);
      } else if (filter === "pending") {
        filteredTodos = todos.filter((todo) => !todo.completed);
      } else {
        filteredTodos = todos;
      }
  
      filteredTodos.forEach((todo, index) => {
        const li = document.createElement("li");
        li.className = "todo";
        li.innerHTML = `
          <label>
            <input type="checkbox" ${
              todo.completed ? "checked" : ""
            } data-index="${index}" style="display: none;">
            <i class="custom-checkbox fa-regular ${
              todo.completed ? "fa-square-check" : "fa-square"
            }"></i>
            <span class="todo-text" data-index="${index}">${todo.text}</span>
          </label>
          <button class="edit-button" data-index="${index}"><i class="fa-solid fa-pen"></i></button>
          <button class="delete-button" data-index="${index}"><i class="fa-solid fa-xmark"></i></button>
        `;
        todosContainer.appendChild(li);
      });
  
      updateCounter();
      toggleDeleteAllButton();
    };
  
    const updateCounter = () => {
      counter.textContent = todos.length;
    };
  
    const toggleDeleteAllButton = () => {
      deleteAllButton.style.display = todos.length ? "inline-block" : "none";
    };
  
    const saveTodosToLocalStorage = () => {
      localStorage.setItem("todos", JSON.stringify(todos));
    };
  
    const addTodo = (text) => {
      if (!text.trim()) return;
      todos.push({ text, completed: false });
      saveTodosToLocalStorage();
      renderTodos();
      todoInput.value = "";
    };
  
    const deleteTodo = (index) => {
      todos.splice(index, 1);
      saveTodosToLocalStorage();
      renderTodos();
    };
  
    const toggleTodoCompletion = (index) => {
      todos[index].completed = !todos[index].completed;
      saveTodosToLocalStorage();
      renderTodos();
    };
  
    const saveTodoEdit = (index, newText) => {
      if (newText.trim()) {
        todos[index].text = newText.trim();
        saveTodosToLocalStorage();
        renderTodos();
      }
    };
  
    const cancelTodoEdit = (index) => {
      renderTodos();
    };
  
    addButton.addEventListener("click", () => addTodo(todoInput.value));
  
    todoInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") addTodo(e.target.value);
    });
  
    todosContainer.addEventListener("click", (e) => {
      if (e.target.matches(".delete-button, .delete-button *")) {
        const index = e.target.closest(".delete-button").dataset.index;
        deleteTodo(index);
      } else if (e.target.matches(".edit-button, .edit-button *")) {
        const index = e.target.closest(".edit-button").dataset.index;
        const todoTextElement = todosContainer.querySelector(
          `.todo-text[data-index="${index}"]`
        );
        const editButton = e.target.closest(".edit-button");
        const deleteButton = e.target
          .closest("li")
          .querySelector(".delete-button");
  
        editButton.style.display = "none";
        deleteButton.style.display = "none";
  
        const currentText = todoTextElement.textContent;
  
        todoTextElement.innerHTML = `
          <div class="todo-edit-container">
            <div class="todo-edit-buttons">
              <button class="save-button"><i class="fa-solid fa-bookmark"></i></button>
              <button class="cancel-button"><i class="fa-solid fa-ban"></i></button>
            </div>
            <input type="text" value="${currentText}" class="edit-input">
          </div>
        `;
  
        const editInput = todoTextElement.querySelector(".edit-input");
        const saveButton = todoTextElement.querySelector(".save-button");
        const cancelButton = todoTextElement.querySelector(".cancel-button");
  
        saveButton.addEventListener("click", () => {
          saveTodoEdit(index, editInput.value);
        });
  
        cancelButton.addEventListener("click", () => {
          editButton.style.display = "inline-block";
          deleteButton.style.display = "inline-block";
          cancelTodoEdit(index);
        });
  
        editInput.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            saveTodoEdit(index, editInput.value);
          }
        });
      } else if (e.target.matches(".custom-checkbox")) {
        const index = e.target.nextElementSibling.dataset.index;
        toggleTodoCompletion(index);
      }
    });
  
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelector(".filter.active").classList.remove("active");
        button.classList.add("active");
        renderTodos(button.dataset.filter);
      });
    });
  
    deleteAllButton.addEventListener("click", () => {
      todos = [];
      saveTodosToLocalStorage();
      renderTodos();
    });
  
    renderTodos();
    updateTimeAndDate();
  });
  



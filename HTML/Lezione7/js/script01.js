const STORAGE_KEY = "ledgerTodosV1";

const state = {
    todos: [],
    filter: "all"
};

const refs = {
    form: document.getElementById("todoForm"),
    input: document.getElementById("todoInput"),
    deadline: document.getElementById("todoDeadline"),
    list: document.getElementById("todoList"),
    filterTabs: document.getElementById("filterTabs"),
    totalTasks: document.getElementById("totalTasks"),
    pendingTasks: document.getElementById("pendingTasks"),
    doneTasks: document.getElementById("doneTasks"),
    todayDate: document.getElementById("todayDate")
};

function initApp() {
    state.todos = loadTodos();
    refs.todayDate.textContent = new Date().toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

    refs.form.addEventListener("submit", onSubmit);
    refs.filterTabs.addEventListener("click", onFilterClick);
    refs.list.addEventListener("click", onListClick);

    renderTodos();
}

function onSubmit(event) {
    event.preventDefault();
    const text = refs.input.value.trim();
    const deadline = refs.deadline.value || null;
    if (!text) {
        return;
    }

    addTodo(text, deadline);
    refs.form.reset();
    refs.input.focus();
}

function onFilterClick(event) {
    const button = event.target.closest("button[data-filter]");
    if (!button) {
        return;
    }

    state.filter = button.dataset.filter;

    refs.filterTabs.querySelectorAll("button[data-filter]").forEach((btn) => {
        btn.classList.toggle("active", btn === button);
    });

    renderTodos();
}

function onListClick(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) {
        return;
    }

    const item = button.closest("li[data-id]");
    if (!item) {
        return;
    }

    const id = Number(item.dataset.id);
    const action = button.dataset.action;

    if (action === "toggle") {
        toggleTodo(id);
    }

    if (action === "delete") {
        deleteTodo(id);
    }
}

function addTodo(text, deadline) {
    const todo = {
        id: Date.now(),
        title: text,
        done: false,
        createdAt: new Date().toISOString(),
        deadline
    };

    state.todos.unshift(todo);
    saveTodos();
    renderTodos();
}

function toggleTodo(id) {
    state.todos = state.todos.map((todo) => {
        if (todo.id === id) {
            return { ...todo, done: !todo.done };
        }
        return todo;
    });

    saveTodos();
    renderTodos();
}

function deleteTodo(id) {
    state.todos = state.todos.filter((todo) => todo.id !== id);
    saveTodos();
    renderTodos();
}

function getFilteredTodos() {
    if (state.filter === "done") {
        return state.todos.filter((todo) => todo.done);
    }

    if (state.filter === "pending") {
        return state.todos.filter((todo) => !todo.done);
    }

    return state.todos;
}

function renderTodos() {
    const filtered = getFilteredTodos();

    if (!filtered.length) {
        refs.list.innerHTML = '<li class="list-group-item empty-state">Nessuna attivita in questa vista.</li>';
        renderStats();
        return;
    }

    refs.list.innerHTML = filtered
        .map((todo) => {
            const overdue = isOverdue(todo);
            const statusLabel = todo.done ? "Completa" : overdue ? "Scaduta" : "Aperta";
            const statusClass = todo.done ? "text-bg-success" : overdue ? "text-bg-danger" : "text-bg-warning";
            const deadlineText = todo.deadline
                ? `<small class="d-block ${overdue ? "text-danger fw-semibold" : "text-body-tertiary"}">${overdue ? "Scaduta il" : "Scadenza"}: ${formatDeadline(todo.deadline)}</small>`
                : "";

            return `
                <li class="list-group-item ${overdue ? "todo-overdue" : ""}" data-id="${todo.id}">
                    <div class="row g-2 align-items-md-center justify-content-between">
                        <div class="col-12 col-md">
                            <div class="row g-2 align-items-start">
                                <div class="col-auto">
                                    <button type="button" class="btn btn-sm ${todo.done ? "btn-success" : "btn-outline-success"}" data-action="toggle" aria-label="Cambia stato">
                                        ${todo.done ? "Fatto" : "Done"}
                                    </button>
                                </div>
                                <div class="col">
                                    <p class="mb-1 todo-title ${todo.done ? "done" : ""}">${escapeHtml(todo.title)}</p>
                                    <span class="badge ${statusClass}">${statusLabel}</span>
                                    ${deadlineText}
                                </div>
                            </div>
                        </div>
                        <div class="col-12 col-md-auto d-grid d-md-block">
                            <button type="button" class="btn btn-sm btn-outline-danger" data-action="delete" aria-label="Elimina attività">Elimina</button>
                        </div>
                    </div>
                </li>
            `;
        })
        .join("");

    renderStats();
}

function renderStats() {
    const total = state.todos.length;
    const done = state.todos.filter((todo) => todo.done).length;
    const pending = total - done;

    refs.totalTasks.textContent = `Totale: ${total}`;
    refs.pendingTasks.textContent = `Da fare: ${pending}`;
    refs.doneTasks.textContent = `Completate: ${done}`;
}

function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
}

function loadTodos() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
            return [];
        }

        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed
            .filter((item) => item && typeof item.id === "number" && typeof item.title === "string")
            .map((item) => ({
                id: item.id,
                title: item.title,
                done: Boolean(item.done),
                createdAt: typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
                deadline: typeof item.deadline === "string" && item.deadline ? item.deadline : null
            }));
    } catch (_error) {
        return [];
    }
}

function formatDeadline(deadline) {
    const date = new Date(`${deadline}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
        return deadline;
    }

    return date.toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
}

function isOverdue(todo) {
    if (todo.done || !todo.deadline) {
        return false;
    }

    const today = new Date();
    const todayAtMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const deadlineDate = new Date(`${todo.deadline}T00:00:00`);

    if (Number.isNaN(deadlineDate.getTime())) {
        return false;
    }

    return deadlineDate < todayAtMidnight;
}

function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

initApp();


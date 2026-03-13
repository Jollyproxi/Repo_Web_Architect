// ...existing code...

const items = [];

const addButton = document.getElementById("btnAdd");
const itemInput = document.getElementById("item");
const dateInput = document.getElementById("data");
const todoList = document.getElementById("listaItems");

function parseIsoDate(iso) {
    let parts = iso.split("-"); // yyyy-mm-dd
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}


function formatDateIT(date) {
    let dd = String(date.getDate()).padStart(2, "0");
    let mm = String(date.getMonth() + 1).padStart(2, "0");
    let yyyy = date.getFullYear();
    return dd + "/" + mm + "/" + yyyy; // gg/mm/yyyy
}

function formatDateUS(date) {
    let dd = String(date.getDate()).padStart(2, "0");
    let mm = String(date.getMonth() + 1).padStart(2, "0");
    let yyyy = date.getFullYear();
    return mm + "/" + dd + "/" + yyyy; // mm/dd/yyyy
}

function renderList() {
    todoList.innerHTML = "";

    items.sort(function (a, b) {
        return a.date - b.date; // ascending (oldest -> newest)
    });

    items.forEach(function (todoItem) {
        let listItem = document.createElement("li");
        listItem.textContent = todoItem.text + " - " + formatDateIT(todoItem.date);
        todoList.appendChild(listItem);
    });
}

addButton.addEventListener("click", function () {
    let item = itemInput.value;
    let dateValue = dateInput.value; // from <input type="date">

    items.push({
        text: item,
        date: parseIsoDate(dateValue)
    });

    renderList();

    itemInput.value = "";
    dateInput.value = "";
});

// ...existing code...
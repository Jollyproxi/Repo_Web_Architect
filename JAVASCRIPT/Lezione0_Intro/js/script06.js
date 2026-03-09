// ...existing code...

var items = [];

var addButton = document.getElementById("btnAdd");
var itemInput = document.getElementById("item");
var dateInput = document.getElementById("data");
var todoList = document.getElementById("listaItems");

function parseIsoDate(iso) {
    var parts = iso.split("-"); // yyyy-mm-dd
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

function formatDateIT(date) {
    var dd = String(date.getDate()).padStart(2, "0");
    var mm = String(date.getMonth() + 1).padStart(2, "0");
    var yyyy = date.getFullYear();
    return dd + "/" + mm + "/" + yyyy; // gg/mm/yyyy
}

function renderList() {
    todoList.innerHTML = "";

    items.sort(function (a, b) {
        return a.date - b.date; // ascending (oldest -> newest)
    });

    items.forEach(function (todoItem) {
        var listItem = document.createElement("li");
        listItem.textContent = todoItem.text + " - " + formatDateIT(todoItem.date);
        todoList.appendChild(listItem);
    });
}

addButton.addEventListener("click", function () {
    var item = itemInput.value;
    var dateValue = dateInput.value; // from <input type="date">

    items.push({
        text: item,
        date: parseIsoDate(dateValue)
    });

    renderList();

    itemInput.value = "";
    dateInput.value = "";
});

// ...existing code...
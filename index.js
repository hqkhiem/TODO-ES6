let mapTodo = new Map();
let mapActive = new Map();
document.getElementById("new-todo").addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        let textInput = document.getElementById("new-todo");
        if (textInput.value.trim() !== "") {
            let todo = new Todo();
            todo.initTodo(textInput.value.trim());
            textInput.value = "";
            return Todo.showItemsLeft();
        }
    }
});

let checkAll = () => {
    if ($('.toggle').prop('checked') === true) {
        $('.toggle').prop('checked', false);
    } else {
        $('.toggle').prop('checked', true);
    }
    localStorage.setItem("data", document.getElementById("todoapp").outerHTML);
    return Todo.showItemsLeft();
};

class Todo {
    constructor() {
        this.id = new Date().getTime();
        this.state = "Active";
    }

    initTodo(textInput) {
        let newItem = document.createElement("li");
        let id = new Date().getTime();
        newItem.id = this.id;
        newItem.className = "list-group-item";
        newItem.onmouseover = function (j) { return function () { Todo.showDelete(j); }; }(id);
        newItem.onmouseout = function (j) { return function () { Todo.hideDelete(j); }; }(id);

        let div = document.createElement("div");
        div.className = "view";

        let checkboxItem = document.createElement("input");
        checkboxItem.className = "toggle";
        checkboxItem.id = "toggle";
        checkboxItem.type = "checkbox";
        checkboxItem.onclick = Todo.showItemsLeft;

        let deleteItem = document.createElement("input");
        deleteItem.id = id + "_destroy";
        deleteItem.className = "destroy";
        deleteItem.type = "button";
        deleteItem.value = "X";
        deleteItem.onclick = function (k) { return function () {Todo.deleteTodo(k); }; }(id);

        let labelItem = document.createElement("label");
        labelItem.innerText = textInput;
        labelItem.className = "todo-text";

        div.appendChild(checkboxItem);
        div.appendChild(labelItem);
        div.appendChild(deleteItem);

        newItem.appendChild(div);
        let listTodo = document.getElementById("list-group");
        listTodo.appendChild(newItem);

        localStorage.setItem("data", listTodo.outerHTML);
    }

    static deleteTodo(id) {
        document.getElementById(id).remove();
        localStorage.setItem("data", document.getElementById("todoapp").outerHTML);
        return Todo.showItemsLeft();
    }

    static showDelete(id){
        document.getElementById(id + '_destroy').style.display = "block";
    }

    static hideDelete(id){
        document.getElementById(id + '_destroy').style.display = "none";
    }

    static showItemsLeft(){
        let selected = [];
        $(document).ready(function () {
            $(".toggle:not(:checked)").each(function () {
                selected.push($(this).val());
            });

            if (selected.length === 0) {
                let countTodo = document.getElementsByClassName('todo-text');
                if (countTodo.length === 0) {
                    document.getElementById('footer').style.display = "none";
                }
            } else {
                document.getElementById('footer').style.display = "block";
            }
            document.getElementById("todo-count-number").innerText = selected.length;
            localStorage.setItem("data", document.getElementById("todoapp").outerHTML);
        });
    }
}

let filterComplete = () =>{
    let selected = [];
    $(document).ready(function () {
        $(".toggle:checked").each(function () {
            selected.push($(this));
        });
    });
}

console.log(document.getElementById("todo-count-number").innerText);

if(document.getElementById("todo-count-number").innerText){
    console.log(1);
}
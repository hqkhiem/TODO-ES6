class Todo {
    constructor(id, data, state = "list-group-item") {
        this.id = id;
        this.data = data;
        this.state = state;
    }

    createTodo(firstLoad) {
        let div = document.createElement("div");
        div.className = "view";
        div.appendChild(this.createCheckElement(((this.state == "list-group-item") ? "toggle" : "toggle checked")));
        div.appendChild(this.createDeleteElement());
        div.appendChild(this.createLabelTodoElement());
        let newItem = this.createLiElement(this.state);
        newItem.appendChild(div);

        let listTodo = document.getElementById("list-group");
        listTodo.appendChild(newItem);

        console.log(new Todo(this.id, this.data, this.state));
        if (!firstLoad) {
            let storageData = JSON.parse(localStorage["data"]);
            storageData.todos.push(new Todo(this.id, this.data));
            localStorage["data"] = JSON.stringify(storageData);
        }
        Todo.countTodos();
    }

    createLiElement() {
        let newItem = document.createElement("li");
        newItem.id = this.id;
        newItem.className = this.state;
        newItem.setAttribute('onmouseover', 'showDelete(' + this.id + ')');
        newItem.setAttribute('onmouseout', 'hideDelete(' + this.id + ')');
        return newItem;
    }

    createCheckElement(className = "toggle") {
        let checkboxItem = document.createElement("input");
        checkboxItem.className = className;
        checkboxItem.id = "toggle-" + this.id;
        checkboxItem.type = "checkbox";
        checkboxItem.setAttribute('onclick', 'Todo.checkCompleteTodos(' + this.id + ')');
        return checkboxItem;
    }

    createDeleteElement(className = "destroy") {
        let deleteItem = document.createElement("input");
        deleteItem.id = "destroy-" + this.id;
        deleteItem.className = className;
        deleteItem.type = "button";
        deleteItem.value = "x";
        deleteItem.setAttribute('onclick', 'Todo.deleteTodo(' + this.id + ')');
        return deleteItem;
    }

    createLabelTodoElement(className = "todo-text",) {
        let labelItem = document.createElement("label");
        labelItem.className = "todo-text";
        labelItem.id = this.id + "_label";
        let text = document.createElement("p");
        text.className = "edit-todo";
        text.id = "p-todo-" + this.id;

        text.innerText = this.data;
        labelItem.appendChild(text)
        labelItem.setAttribute('ondblclick', 'Todo.editTodo("' + this.id + '")');
        return labelItem;
    }

    static checkCompleteTodos(id = null) {
        // Check complete for a todo
        console.log("IN");
        let data = JSON.parse(localStorage['data']);
        let todos = data.todos;
        if (id != null) {
            this.changeCheckboxClass(id);
            // Update data local
            let todoResult = this.findTodoById(id, data)

            const todo = document.getElementById(id);
            if (todo != null) {
                if ($("li[id=\'" + id + "\'] .toggle:checked").length > 0) {
                    todo.className = "list-group-item completed"
                } else {
                    todo.className = "list-group-item";
                }
            }
            todoResult.state = todo.className;
            localStorage['data'] = JSON.stringify(data);
        } else {
            // Check whether has checked
            let state = null;
            if ($('.toggle').prop('checked') === true) {
                $('.toggle').prop('checked', false);
                $('[class="toggle checked"]').prop("class", "toggle");

                // Change the class name's elements to apply that was changed by css
                $('.list-group-item.completed').prop("class", "list-group-item");
                state = "list-group-item";

            } else {
                $('.toggle').prop('checked', true);
                $('.toggle').prop("class", "toggle checked");
                $('.list-group-item').prop('class', "list-group-item completed");
                state = "list-group-item completed";
            }
            for (let todo of todos) {
                todo.state = state;
            }
        }
        return Todo.countTodos();
    }

    static findTodoById(id, data) {
        let todos = data.todos;
        for (let i = 0; i < todos.length; i++) {
            if (todos[i].id == id) {
                return todos[i];
            }
        }
    }

    static changeCheckboxClass(id) {
        console.log("in changeCheckboxClass");
        let toogleCheckboxId = 'toggle-' + id;
        console.log('#' + toogleCheckboxId);
        console.log(document.getElementById(toogleCheckboxId).checked);
        const todo = this.findTodoById(id, JSON.parse(localStorage['data']));
        if (todo.state !== "list-group-item") {
            $('#' + toogleCheckboxId).prop("class", "toggle");
            $('#' + toogleCheckboxId).prop('checked', false);
        } else {
            $('#' + toogleCheckboxId).prop("class", "toggle checked");
            $('#' + toogleCheckboxId).prop('checked', true);
        }
    }


    static deleteTodo(id) {
        let data = JSON.parse(localStorage['data']);
        let todos = data.todos;

        for (let i = 0; i < todos.length; i++) {
            if (todos[i].id == id) {
                todos.splice(i, 1);
                break;
            }
        }
        localStorage['data'] = JSON.stringify(data);
        document.getElementById(id).remove();
        return Todo.countTodos();
    }

    static editTodo(id){
        if (!document.getElementById("edit-todo-"+ id)){
            $("#toggle-" + id).hide();
            $('#p-todo-'+ id).hide();
            const idEdit = "edit-todo-" + id;
            var input = $('<input class="edit-todo" id='+idEdit+' type="text" value="' + $('#p-todo-' + id).text() + '" onmouseleave="Todo.editTodoListener(\''+id+'\')"  oninput="Todo.editTodoListener(\''+id+'\')"/>' )
            $('#'+ id + "_label").append(input);
        }
    }

    static editTodoListener(id){
        let textInput = document.getElementById("edit-todo-" + id).value;
        const idx = "edit-todo-"+ id;

        $(document).on('click', function(e) {
            if (e.target.id != idx){
                if (textInput.trim() == "") {
                    $("[id="+id+"]").remove();
                    this.deleteTodo(id);
                } else {
                    document.getElementById("p-todo-" + id).innerHTML = textInput;
                    $('#p-todo-' + id).innerHTML = textInput;
                    $('#p-todo-' + id).show();
                    $('#edit-todo-' + id).remove();

                    // Update data in local storage
                    let data = JSON.parse(localStorage['data']);
                    let todoResult = Todo.findTodoById(id, data)
                    todoResult.data = textInput;
                    localStorage['data'] = JSON.stringify(data);
                }
                $("#toggle-" + id).show();
            }
        });
        document.getElementById("edit-todo-"+ id).addEventListener("keyup", (event) => {
            if (event.keyCode === 13 || event.keyCode === 27) {
                if (textInput.trim() == "") {
                    $("[id="+id+"]").remove();
                    this.deleteTodo(id);
                } else {
                    document.getElementById("p-todo-" + id).innerHTML = textInput;
                    $('#p-todo-' + id).innerHTML = textInput;
                    $('#p-todo-' + id).show();
                    $('#edit-todo-' + id).remove();

                    // Update data in local storage
                    let data = JSON.parse(localStorage['data']);
                    let todoResult = Todo.findTodoById(id, data)
                    todoResult.data = textInput;
                    localStorage['data'] = JSON.stringify(data);
                }
                $("#toggle-" + id).show();
            }
    });
    }

    static countTodos() {
        const data = JSON.parse(localStorage['data']).todos;
        const count = data.filter(todo => todo.state !== "list-group-item completed").length;
        document.getElementById("todo-count-number").innerText = count;
        if (data.length === 0) {
            document.getElementById('footer').style.display = "none";
        } else {
            document.getElementById('footer').style.display = "block";
        }
    }

    static clearCompleteTodo() {
        $(document).ready(function () {
            let completeTodos =  JSON.parse(localStorage['data']).todos.filter(todo => todo.state === "list-group-item completed");
            for (let todo of completeTodos){
                console.log(todo.id);
                Todo.deleteTodo(todo.id);
            }
            $("li[class='list-group-item completed']").remove();
        });
    }
}

let filterComplete = () => {
    $("a[href=\"#/completed\"]").addClass('selected');
    $("a[href=\"#/active\"]").removeClass();
    $("a[href=\"#/\"]").removeClass();
    $(document).ready(function () {
        $("li[class='list-group-item completed']").show();
        $("li[class='list-group-item']").hide();
    });
}

let filterActive = () => {
    $("a[href=\"#/active\"]").addClass('selected');
    $("a[href=\"#/completed\"]").removeClass();
    $("a[href=\"#/\"]").removeClass();
    $(document).ready(function () {
        $("li[class='list-group-item completed']").hide();
        $("li[class='list-group-item']").show();
    });
}

let filterAll = () => {
    $("a[href=\"#/\"]").addClass('selected');
    $("a[href=\"#/completed\"]").removeClass();
    $("a[href=\"#/active\"]").removeClass();
    $(document).ready(function () {
        $("li[class='list-group-item']").show();
        $("li[class='list-group-item completed']").show();
    });
}

let showDelete = (id) => {
    document.getElementById("destroy-" + id).style.display = "block";
}

let hideDelete = (id) => {
    document.getElementById("destroy-" + id).style.display = "none";
}


window.onload = function () {
    $('li.list-group-item').remove();
    if (localStorage['data'] == null) {
        let storageData = {
            todos: []
        };
        localStorage["data"] = JSON.stringify(storageData);
    } else {
        let todos = JSON.parse(localStorage['data']).todos;
        for (let todo of todos) {
            let newTodo = new Todo(todo.id, todo.data, todo.state);
            newTodo.createTodo(true);
        }
    }
    document.getElementById("new-todo").addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            let textInput = document.getElementById("new-todo");
            if (textInput.value.trim() !== "") {
                let todo = new Todo(new Date().getTime(), textInput.value.trim());
                todo.createTodo(false);
                textInput.value = "";
                return Todo.countTodos();
            }
        }
    });
}
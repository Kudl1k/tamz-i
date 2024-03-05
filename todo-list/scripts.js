let tasks = []



class PageOne extends HTMLElement {
    connectedCallback() {
        this.innerHTML = document.getElementById('main-page').innerHTML;
    }
}

class PageTwo extends HTMLElement {
    connectedCallback() {
        this.innerHTML = document.getElementById('create-new-todo').innerHTML;

        let taskInputValue = ""

        document.getElementById('task-input').addEventListener('ionInput',(ev) =>{
            taskInputValue = ev.target.value
            console.log(taskInputValue)
        })

        document.getElementById('add-task-button').addEventListener('click',(ev) =>{
            if (taskInputValue != ""){
                tasks.push(new Task(taskInputValue))
                createTodoItemCard(taskInputValue)
                document.querySelector('ion-nav').pop();
            }
        })

    }
}


customElements.define('main-page', PageOne);
customElements.define('create-new-todo', PageTwo);


class Task{
    constructor (name){
        this.name = name
        this.checked = false
    }
}


function createTodoItemCard(text) {
    // Create elements
    const card = document.createElement('ion-card');
    const cardContent = document.createElement('ion-card-content');
    const todoItem = document.createElement('div');
    const todoText = document.createElement('div');
    const todoButton = document.createElement('ion-button');
    const todoIcon = document.createElement('ion-icon');

    // Set IDs and classes
    cardContent.id = 'todo-item-card';
    todoItem.id = 'todo-item';
    todoText.id = 'todo-text';
    todoButton.setAttribute('fill', 'clear');
    todoIcon.id = 'checkbox-item';
    todoIcon.setAttribute('name', 'checkbox-outline');

    // Set text content
    todoText.textContent = text;

    // Append elements
    todoButton.appendChild(todoIcon);
    todoItem.appendChild(todoText);
    todoItem.appendChild(todoButton);
    cardContent.appendChild(todoItem);
    card.appendChild(cardContent);

    card.id = 'task' + tasks.length

    document.getElementById("task-list").appendChild(card)

    todoButton.addEventListener('click', function() {
        // Get the index of the task associated with this card
        const taskId = parseInt(card.id.replace('task', ''));
        
        // Check if the task exists in the tasks array
        if (tasks[taskId]) {
            // Toggle the checked attribute of the task
            tasks[taskId].checked = !tasks[taskId].checked;
    
            // Change the name of the icon based on the checked attribute
            if (tasks[taskId].checked) {
                todoIcon.setAttribute('name', 'checkbox');
            } else {
                todoIcon.setAttribute('name', 'checkbox-outline');
            }
        }
    })
}

document.addEventListener('click', function(event) {
    const fabButton = event.target.closest('#fab-button');
    if (fabButton) {
        // Navigate to the create-new-todo page
        document.querySelector('ion-nav').push('create-new-todo');
    }
});


// Define existingEntries outside the event listener
var existingEntries = JSON.parse(localStorage.getItem('bmiData'));
if (!Array.isArray(existingEntries)) {
    existingEntries = [];
}

// Get the ion-content element in the history page
var historyContent = document.querySelector('#history-page ion-content');



function fetchLocalStorage(){
    historyContent.innerHTML = '';
    // Loop through each entry
    existingEntries.forEach(function(entry) {
    // Create a new ion-item
    var item = document.createElement('ion-item');

    // Set the label text
    var label = document.createElement('ion-label');
    label.textContent = `${entry.date} ${entry.name} BMI:${entry.bmi}`;
    item.appendChild(label);

    // Create a delete button
    var button = document.createElement('ion-button');
    button.setAttribute('aria-label', 'Delete');
    button.addEventListener('click', function() {
        // Delete this entry
        var index = existingEntries.indexOf(entry);
        if (index !== -1) {
            existingEntries.splice(index, 1);
            localStorage.setItem('bmiData', JSON.stringify(existingEntries));
            item.remove(); // Remove this item from the page
        }
    });

    // Add a trash icon to the button
    var icon = document.createElement('ion-icon');
    icon.setAttribute('name', 'trash');
    icon.setAttribute('aria-hidden', 'true');
    button.appendChild(icon);

    item.appendChild(button);

    // Add the new item to the history page
    historyContent.appendChild(item);
});
}

fetchLocalStorage();

document.getElementById('calculate-button').addEventListener('click', function() {
    var name = document.getElementById('input_name').value;
    var age = document.getElementById('input_age').value;
    var gender = document.getElementById('input_gender').value;
    var height = document.getElementById('input_height').value / 100; // convert cm to m
    var weight = document.getElementById('input_weight').value;

    // Check if inputs are empty
    if (!name || !age || !gender || !height || !weight) {
        return; // Exit the function if any input is empty
    }

    var bmi = weight / (height * height);
    var status;

    if (bmi < 18.5) {
        status = 'Underweight';
    } else if (bmi < 24.9) {
        status = 'Normal weight';
    } else if (bmi < 29.9) {
        status = 'Overweight';
    } else {
        status = 'Obese';
    }

    var actionSheet = document.querySelector('ion-action-sheet');
    actionSheet.header = 'BMI Result';
    actionSheet.buttons = [
        {
            text: `Name: ${name}`,
        },
        {
            text: `Age: ${age}`,
        },
        {
            text: `Gender: ${gender}`,
        },
        {
            text: `Height: ${height} m`,
        },
        {
            text: `Weight: ${weight} kg`,
        },
        {
            text: `BMI: ${bmi.toFixed(2)}`,
        },
        {
            text: `Status: ${status}`,
        },
        {
            text: 'Cancel',
            role: 'cancel',
        },
    ];

    actionSheet.present();

    // Save data to local storage
    var currentDate = new Date();
    var data = {
        name: name,
        age: age,
        gender: gender,
        height: height,
        weight: weight,
        bmi: bmi.toFixed(2),
        status: status,
        date: currentDate.getDate() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getFullYear()
    };
    console.log(existingEntries);
    console.log(data);

    existingEntries.push(data);
    localStorage.setItem('bmiData', JSON.stringify(existingEntries));
    fetchLocalStorage();
});
console.log("Hello World!")


// Get the elements
var saveButton = document.getElementById('saveButton');
var loadButton = document.getElementById('loadButton');
var inputs = document.querySelectorAll('input, ion-radio-group, ion-checkbox, ion-input');
var datetimeInput = document.getElementById('datetime');
var selectedDate = datetimeInput.value; // Initialize selectedDate with the current value of datetimeInput

// Update selectedDate when the datetime input changes
datetimeInput.addEventListener('ionChange', (ev) => {
    selectedDate = new Date(ev.detail.value);
});

// Save the values into local storage when the "Save" button is clicked
saveButton.addEventListener('click', function() {
    console.log(selectedDate)
    inputs.forEach(function(input) {
        if (input.tagName === 'ION-CHECKBOX') {
            localStorage.setItem(input.id, input.checked);
        } else if (input.tagName === 'ION-RADIO-GROUP') {
            localStorage.setItem(input.id, input.value);
        } else if (input.tagName === 'ION-INPUT') {
            localStorage.setItem(input.id, input.value);
        } else {
            localStorage.setItem(input.id, input.value);
        }
    });
    localStorage.setItem(datetimeInput.id, selectedDate.toISOString()); // Save the date as an ISO string
    console.log("Saved to local storage!");
});

// Load the values from local storage when the "Load" button is clicked
loadButton.addEventListener('click', function() {
    inputs.forEach(function(input) {
        if (input.tagName === 'ION-CHECKBOX') {
            input.checked = localStorage.getItem(input.id) === 'true';
        } else if (input.tagName === 'ION-RADIO-GROUP') {
            input.value = localStorage.getItem(input.id);
        } else if (input.tagName === 'ION-INPUT') {
            input.value = localStorage.getItem(input.id);
        } else {
            input.value = localStorage.getItem(input.id);
        }
    });
    datetimeInput.value = new Date(localStorage.getItem(datetimeInput.id)).toISOString(); // Load the date as an ISO string and convert it to a Date object
    console.log("Loaded from local storage!");
});